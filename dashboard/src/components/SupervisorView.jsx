'use client'
import { Users, Clock, Check } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs';
import { DatePickerWithPresets } from './ui/datepicker';
import { Button } from './ui/button';

export default function SupervisorView() {
  const [tickets, setTickets] = useState([]);
  const user = useUser();
  const [showModal, setShowModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [deadline, setDeadline] = useState('');
  // Fetch tickets on mount

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('/api/tickets');
        const tickets = response.data
          .filter(t => t.assignedTo && t.assignedTo.clerkId)
          .filter(t => t.assignedTo.clerkId === user.user?.id);
        setTickets(tickets);
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
                  Deadline: {ticket.deadline}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>

              <div className="mt-4 flex gap-2">
                <Button
                  variant=""
                  onClick={() => {
                    setSelectedTicketId(ticket._id);
                    setShowModal(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1 rounded-md text-sm"
                >
                  <Clock className="w-4 h-4" />
                  Extend
                </Button>

                <Button
                  onClick={() => onUpdateStatus(ticket._id, 'done')}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 rounded-md text-sm hover:bg-green-700"
                >
                  <Check className="w-4 h-4" />
                  Mark Done
                </Button>
              </div>
              {/* {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">Extend Ticket</h2>
                    <label className="block text-sm font-medium mb-2">Select new deadline:</label>
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={async () => {
                          try {
                            await axios.put('/api/tickets', {
                              ticketId: selectedTicketId,
                              status: 'extended',
                              deadline,
                            });
                            setTickets(prev =>
                              prev.map(t =>
                                t._id === selectedTicketId ? { ...t, status: 'extended' } : t
                              )
                            );
                            toast.success('Ticket extended');
                          } catch (error) {
                            toast.error('Failed to extend ticket');
                            console.error(error);
                          }
                          setShowModal(false);
                          setDeadline('');
                        }}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                </div>
              )} */}

              {showModal && (
                <div className="fixed inset-0 bg-transparent bg-opacity-50 bg-opacity-30 flex items-center  backdrop-blur-xs justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">Extend Ticket</h2>
                    <label className="block text-sm font-medium mb-2">Select new deadline:</label>

                    {/* Pass setDeadline to the DatePickerWithPresets */}
                    <DatePickerWithPresets
                      setDeadline={(newDate) => setDeadline(newDate)} // Pass the setDeadline function from the modal
                    />

                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => setShowModal(false)}
                        variant="destructive"
                        className="px-4 py-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={async () => {
                          try {
                            await axios.put('/api/tickets', {
                              ticketId: selectedTicketId,
                              status: 'extended',
                              deadline,
                            });
                            setTickets(prev =>
                              prev.map(t =>
                                t._id === selectedTicketId ? { ...t, status: 'extended' } : t
                              )
                            );
                            toast.success('Ticket extended');
                          } catch (error) {
                            toast.error('Failed to extend ticket');
                            console.error(error);
                          }
                          setShowModal(false);
                          setDeadline(''); // Reset the deadline after confirming
                        }}
                        className="px-4 py-2"
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ))
        ) : (
          <p className="text-gray-500">No tickets assigned to you</p>
        )}
      </div>
    </div>
  );
}
