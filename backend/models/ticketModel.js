import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
  }, {timestamps: true});

  export const TicketModel = mongoose.model('TicketModel', ticketSchema)