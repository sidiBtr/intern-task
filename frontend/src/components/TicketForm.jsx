import React, { useState } from 'react';

export default function TicketForm({ onCreateTicket }) {
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
      };

      // Call the onCreateTicket function passed from parent component
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
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <button type="submit">Submit Ticket</button>
      </form>
    </div>
  );
}
