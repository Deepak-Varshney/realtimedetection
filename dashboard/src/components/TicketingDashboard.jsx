'use client'
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import AdminView from './AdminView';
import SupervisorView from './SupervisorView';
import UserView from './UserView';

export default function TicketingDashboard() {
  const { user } = useUser();
  const [currentRole, setCurrentRole] = useState('user');
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [events, setEvents] = useState([]);
  const [unreadEvents, setUnreadEvents] = useState(0);

  useEffect(() => {
    if (!user) return;
    setCurrentRole(user.publicMetadata.role || 'user');

    // Fetch tickets
    axios.get('/api/tickets')
      .then(res => {
        const sortedTickets = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTickets(sortedTickets);
      })
      .catch(() => toast.error('Failed to load tickets'));

    // Fetch payments
    axios.get('/api/payments')
      .then(res => {
        const sortedPayments = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPayments(sortedPayments);
      })
      .catch(() => toast.error('Failed to load payments'));

  }, [user]);

  const createTicket = async (title, description) => {
    try {
      const res = await axios.post('/api/tickets', { title, description });
      setTickets([...tickets, res.data]);
      toast.success('Ticket created successfully');
    } catch {
      toast.error('Failed to create ticket');
    }
  };

  const createEvent = async (title, description) => {
    try {
      const res = await axios.post('/api/events', { title, description });
      setEvents([...events, res.data]);
      toast.success('Event created successfully');
    } catch {
      toast.error('Failed to create event');
    }
  };

  const markEventAsRead = async (eventId) => {
    try {
      const res = await axios.put('/api/events', { eventId });
      const updatedEvent = res.data;
      setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e));
      setUnreadEvents(prev => prev - 1);
    } catch {
      toast.error('Failed to mark event as read');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-6">
        {currentRole === 'user' && (
          <UserView
            tickets={tickets.filter(t => t.createdBy === user.id)}
            payments={payments}
            events={events}
            onCreateTicket={createTicket}
            onMarkEventAsRead={markEventAsRead}
          />
        )}

        {currentRole === 'supervisor' && <SupervisorView />}

        {currentRole === 'admin' && (
          <AdminView
            tickets={tickets}
            events={events}
            onCreateEvent={createEvent}
          />
        )}
      </main>
    </div>
  );
}
