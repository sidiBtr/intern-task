import React from 'react';

export default function TicketActions({ ticket, onUpdateStatus, onAssignTicket, onDeleteTicket }) {
  const handleUpdateStatus = () => {
    const newStatus = prompt('Enter new status:');
    if (newStatus) {
      onUpdateStatus(ticket._id, newStatus);
    }
  };

  const handleAssignTicket = () => {
    const assignedTo = prompt('Enter user ID to assign:');
    if (assignedTo) {
      onAssignTicket(ticket._id, assignedTo);
    }
  };

  const handleDeleteTicket = () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      onDeleteTicket(ticket._id);
    }
  };

  return (
    <div className="ticket-actions">
      <h3>Actions</h3>
      <button onClick={handleUpdateStatus}>Update Status</button>
      <button onClick={handleAssignTicket}>Assign Ticket</button>
      <button onClick={handleDeleteTicket}>Delete Ticket</button>
    </div>
  );
}
