import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
  }, {timestamps: true});

  export const TicketModel = mongoose.model('TicketModel', ticketSchema)