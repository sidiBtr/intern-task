import express from 'express'
import { TicketModel } from '../models/ticketModel.js'
import auth from '../verifyUser.js'
import sendEmail from '../nodemailer.js'

const ticketRouter = express()
/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - createdBy
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the ticket
 *         description:
 *           type: string
 *           description: The description of the ticket
 *         status:
 *           type: string
 *           enum: [open, in_progress, closed]
 *           description: The status of the ticket
 *           default: open
 *         assignedTo:
 *           type: string
 *           description: The ID of the user the ticket is assigned to
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created the ticket
 *       example:
 *         title: Example Ticket
 *         description: This is an example ticket
 *         status: open
 *         assignedTo: 60c72b2f9b1d8e0015a78fd1
 *         createdBy: 60c72b2f9b1d8e0015a78fd2
 */

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get all tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: The list of the tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 */

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: The ticket was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       500:
 *         description: Some error happened
 */

/**
 * @swagger
 * /tickets/{id}/status:
 *   put:
 *     summary: Update the status of a ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, closed]
 *     responses:
 *       200:
 *         description: The ticket status was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: The ticket was not found
 *       500:
 *         description: Some error happened
 */

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Delete a ticket by ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket ID
 *     responses:
 *       200:
 *         description: The ticket was deleted
 *       404:
 *         description: The ticket was not found
 *       500:
 *         description: Some error happened
 */
// create new ticket
ticketRouter.post('/create_ticket', auth(['customer', 'admin']), async (req, res) => {
    const { title, description } = req.body;
  
    try {
      const ticket = new TicketModel({
        title,
        description,
        createdBy: req.user._id,
      });
      console.log(req.user)
      await ticket.save();
  
      res.json(ticket);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  });
  // get all tickets
  ticketRouter.get('/lists', auth(['support_agent', 'admin']), async (req, res) => {
    try {
      const tickets = await TicketModel.find().populate('createdBy', 'username email').populate('assignedTo', 'username email');
      res.json(tickets);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  });
  // Update a ticket status
  ticketRouter.put('/:ticketId/status', auth(['customer', 'admin']), async (req, res) => {
    const { status } = req.body;
    const { ticketId } = req.params;
  
    try {
      const ticket = await TicketModel.findById(ticketId);
      if (!ticket) {
        return res.status(404).json({ msg: 'Ticket not found' });
      }
  
      ticket.status = status;
      await ticket.save();
  
      // Send email notification to the ticket creator
      const user = await UserModel.findById(ticket.createdBy);
      if (user) {
        await sendEmail(
          user.email,
          'Ticket Status Updated',
          `Your ticket "${ticket.title}" status has been updated to "${status}".`
        );
      }
  
      res.json(ticket);
    } catch (err) {
      console.error('Error updating ticket status:', err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  });
  // Assign a ticket to a user
ticketRouter.put('/:id/assign', auth(['admin']), async (req, res) => {
    const { assignedTo } = req.body;
  
    try {
      const ticket = await TicketModel.findById(req.params.id);
      if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });
  
      ticket.assignedTo = assignedTo;
      await ticket.save();
  
      res.json(ticket);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  });
  // Delete a ticket by ID
ticketRouter.delete('/delete/:id', auth(['admin']), async (req, res) => {
  try {
    const ticket = await TicketModel.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }

    res.json({ msg: 'Ticket deleted successfully' });
  } catch (err) {
    console.error('Error deleting ticket:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});
  
export default ticketRouter;