import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TicketForm from '../components/TicketForm';
import TicketsList from '../components/TicketsList';
import './profile.css'; // Styling for profile page

export default function Profile() {
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token1');
        const response = await fetch(`https://intern-task-5z54.onrender.com/api/user/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user profile');

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token1');
        const response = await fetch('https://intern-task-5z54.onrender.com/api/ticket/lists', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch tickets');

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  const handleCreateTicket = async (newTicket) => {
    try {
      const token = localStorage.getItem('token1');
      const response = await fetch('https://intern-task-5z54.onrender.com/api/ticket/create_ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(newTicket),
      });

      if (!response.ok) throw new Error('Failed to create ticket');

      const createdTicket = await response.json();
      setTickets((prevTickets) => [...prevTickets, createdTicket]);
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const token = localStorage.getItem('token1');
      const response = await fetch(`https://intern-task-5z54.onrender.com/api/ticket/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update ticket status');

      setTickets((prevTickets) =>
        prevTickets.map(ticket => ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket)
      );
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      const token = localStorage.getItem('token1');
      const response = await fetch(`https://intern-task-5z54.onrender.com/api/ticket/delete/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });

      if (!response.ok) throw new Error('Failed to delete ticket');

      setTickets((prevTickets) => prevTickets.filter(ticket => ticket._id !== ticketId));
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-details">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      <TicketForm onCreateTicket={handleCreateTicket} user={user} />

      {tickets.length === 0 ? (
        <p>there are no ticket</p>
      ) : (
        <TicketsList
          tickets={user.role === 'admin' ? tickets : tickets.filter(ticket => ticket.createdBy === user._id)}
          onDelete={handleDeleteTicket}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
