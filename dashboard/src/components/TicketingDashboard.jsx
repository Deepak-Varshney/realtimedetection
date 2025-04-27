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

  const [unreadEvents, setUnreadEvents] = useState(0);




  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-6">
        {currentRole === 'user' && (
          <UserView
            tickets={tickets.filter(t => t.createdBy === user.id)}
            payments={payments}
            events={events}
            onCreateTicket={createTicket}
          />
        )}

        {currentRole === 'supervisor' && <SupervisorView />}

        {currentRole === 'admin' && (
          <AdminView
            onCreateEvent={createEvent}
          />
        )}
      </main>
    </div>
  );
}
