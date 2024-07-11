import React from 'react';

export default function TicketList({ tickets }) {
  return (
    <div className="ticket-list">
      <h3>Tickets</h3>
      {tickets.map(ticket => (
        <div key={ticket._id} className="ticket-item">
          <h4>{ticket.title}</h4>
          <p>{ticket.description}</p>
          <p>Status: {ticket.status}</p>
        </div>
      ))}
    </div>
  );
}
