import React from 'react';

export default function TicketsList({ tickets, onDelete, onUpdateStatus }) {
  return (
    <div className="tickets-list">
      <h3>Tickets</h3>
      <table className="tickets-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket._id}>
              <td>{ticket.title}</td>
              <td>{ticket.description}</td>
              <td>{ticket.status}</td>
              <td>
                <button onClick={() => onUpdateStatus(ticket._id, 'in_progress')}>In Progress</button>
                <button onClick={() => onUpdateStatus(ticket._id, 'closed')}>Close</button>
                <button onClick={() => onDelete(ticket._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
