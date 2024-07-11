import express from 'express'
import { TicketModel } from '../models/ticketModel.js'
import auth from '../verifyUser.js'

const ticketRouter = express()
// create new ticket
ticketRouter.post('/create_ticket', auth(['customer', 'admin']), async (req, res) => {
    const { title, description } = req.body;
  
    try {
      const ticket = new TicketModel({
        title,
        description,
        createdBy: req.user._id,
      });
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
ticketRouter.put('/:id/status', auth(['support_agent', 'admin']), async (req, res) => {
    const { status } = req.body;
  
    try {
      const ticket = await TicketModel.findById(req.params.id);
      if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });
  
      ticket.status = status;
      await ticket.save();
  
      res.json(ticket);
    } catch (err) {
      res.status(400).json({ msg: err.message });
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
ticketRouter.delete('delete/:id', auth(['admin']), async (req, res) => {
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