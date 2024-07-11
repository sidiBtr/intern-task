import React, { useState, useEffect } from 'react';
import './profile.css'; // Styling for profile page
import TicketsList from '../components/TicketsList';
import TicketActions from '../components/TicketActions';
import { useParams } from 'react-router-dom';

export default function Profile() {
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token1');
        const response = await fetch(`http://localhost:3000/api/user/profile/${userId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token, // Send token1 in headers
              },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Handle error (redirect, show message, etc.)
      }
    };

    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
      const fetchTickets = async () => {
        try {
          const token = localStorage.getItem('token1');
          const response = await fetch('http://localhost:3000/api/ticket/lists', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token, // Send token1 in headers
              },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch tickets');
          }

          const data = await response.json();
          setTickets(data);
        } catch (error) {
          console.error('Error fetching tickets:', error);
          // Handle error (redirect, show message, etc.)
        }
      };

      fetchTickets();
    
  }, [user]);

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/ticket/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update ticket status');
      }

      const updatedTickets = tickets.map(ticket => (
        ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
      setTickets(updatedTickets);
    } catch (error) {
      console.error('Error updating ticket status:', error);
      // Handle error (redirect, show message, etc.)
    }
  };

  const handleAssignTicket = async (ticketId, assignedTo) => {
    try {
      const token = localStorage.getItem('token1');
      const response = await fetch(`http://localhost:3000/api/ticket/${ticketId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ assignedTo }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign ticket');
      }

      const updatedTickets = tickets.map(ticket => (
        ticket._id === ticketId ? { ...ticket, assignedTo } : ticket
      ));
      setTickets(updatedTickets);
    } catch (error) {
      console.error('Error assigning ticket:', error);
      // Handle error (redirect, show message, etc.)
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      const token = localStorage.getItem('token1');
      const response = await fetch(`http://localhost:3000/api/ticket/delete/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }

      const updatedTickets = tickets.filter(ticket => ticket._id !== ticketId);
      setTickets(updatedTickets);
    } catch (error) {
      console.error('Error deleting ticket:', error);
      // Handle error (redirect, show message, etc.)
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Optional loading state
  }

  const handleCreateTicket = async (newTicket) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/ticket/create_ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(newTicket),
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      // Refresh ticket list after successful creation
      fetchTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };


  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-details">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {user.role === 'admin' && (
        <div>
          <h3>All Tickets</h3>
          <TicketsList tickets={tickets} />
          <TicketActions
            onUpdateStatus={handleUpdateStatus}
            onAssignTicket={handleAssignTicket}
            onDeleteTicket={handleDeleteTicket}
          />
        </div>
      )}

      {user.role === 'support_agent' && (
        <div>
          <h3>Assigned Tickets</h3>
          <TicketsList tickets={tickets.filter(ticket => ticket.assignedTo === user._id)} />
        </div>
      )}

      {user.role === 'customer' && (
        <div>
          <h3>My Tickets</h3>
          <TicketsList tickets={tickets.filter(ticket => ticket.createdBy === user._id)} />
        </div>
      )}
    </div>
  );
}
