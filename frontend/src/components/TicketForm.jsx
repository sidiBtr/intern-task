import React, { useState } from 'react';
import './ticketForm.css'

export default function TicketForm({ onCreateTicket, user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate input fields
      if (!title.trim() || !description.trim()) {
        alert('Please fill in all fields');
        return;
      }

      // Create ticket object
      const newTicket = {
        title,
        description,
        status: 'open',
        createdBy: user._id
      };

      
      await onCreateTicket(newTicket);

      // Clear form fields after successful submission
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket. Please try again.');
    }
  };

  return (
<div className="ticket-form">
      <h3>Create New Ticket</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <button type="submit" className="form-button">
          Submit Ticket
        </button>
      </form>
    </div>
  );
}
