import { Users, Clock, Check } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs';

export default function SupervisorView() {
  const [tickets, setTickets] = useState([]);
  const user = useUser();
  console.log(user)
  // Fetch tickets on mount
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('/api/tickets');
        response.data.filter(t => t.assignedTo === user.id)

        setTickets(response.data);
      } catch (error) {
        toast.error('Failed to fetch tickets');
        console.error(error);
      }
    };
    fetchTickets();
  }, []);

  // Update ticket status
  const onUpdateStatus = async (ticketId, status) => {
    try {
      const response = await axios.put('/api/tickets', { ticketId, status });
      const updatedTicket = response.data;
      setTickets(prevTickets =>
        prevTickets.map(t =>
          t._id === updatedTicket._id ? updatedTicket : t
        )
      );
      toast.success('Ticket status updated');
    } catch (error) {
      toast.error('Failed to update ticket');
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-600" />
        Assigned Tickets
      </h2>
      <div className="space-y-4">
        {tickets.length > 0 ? (
          tickets.map(ticket => (
            <div key={ticket._id} className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{ticket.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${ticket.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {ticket.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => onUpdateStatus(ticket._id, 'extended')}
                  className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200"
                >
                  <Clock className="w-4 h-4" />
                  Extend
                </button>
                <button
                  onClick={() => onUpdateStatus(ticket._id, 'done')}
                  className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
                >
                  <Check className="w-4 h-4" />
                  Mark Done
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No tickets assigned to you</p>
        )}
      </div>
    </div>
  );
}
