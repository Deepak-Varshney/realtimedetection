'use client'
import React, { useEffect, useState } from 'react';
import { Ticket, Megaphone, Plus, CreditCard } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Popover, PopoverContent } from '@radix-ui/react-popover';
import { PopoverTrigger } from './ui/popover';
import TicketForm from './TicketForm';
export default function UserView({ user }) {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [ticketToDelete, setTicketToDelete] = useState(''); // Store ticket ID to delete
  console.log(user)
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get('/api/tickets');
        setTickets(res.data);
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
      }
    }
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events');
        const sortedEvents = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setEvents(sortedEvents);

      } catch (err) {
        console.error('Failed to fetch events:', err);
      }
    }
    fetchTickets();
    fetchEvents();
  }, [])

  const handleNewTicket = (newTicket) => {
    setTickets((prevTickets) => [newTicket, ...prevTickets]); // Add the new ticket to the top of the list
    setIsPopoverOpen(false); // Close the form
  };
  const deleteTicket = async (ticketId) => {
    try {
      await axios.delete(`/api/tickets?id=${ticketId}`);
      setTickets(tickets.filter(ticket => ticket._id !== ticketId));
      toast.success('Ticket deleted successfully');
      setIsModalOpen(false); // Close the modal after deletion
    }
    catch (err) {
      toast.error('Failed to delete ticket');
    }
  };
  const openDeleteModal = (ticketId) => {
    setTicketToDelete(ticketId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTicketToDelete(null);
  };


  const onMarkEventAsRead = async (eventId) => {
    try {
      const res = await axios.put('/api/events', { eventId });
      const updatedEvent = res.data;
      setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e));
      // setUnreadEvents(prev => prev - 1);
      toast.success("Event Read Success")
    } catch {
      toast.error('Failed to mark event as read');
    }
  };

  return (
    <div className="grid grid-cols-1 overflow-auto md:grid-cols-2 h-[calc(100vh)] gap-6">
      {/* Create Ticket Section */}

      {/* My Tickets Section */}
      <div className="p-6 rounded-lg shadow">
        <div className='flex justify-between items-center mb-4'>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            {/* Icon and Title */}
            <Ticket className="w-5 h-5 text-blue-600" />
            My Tickets
          </h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Raise a Ticket</Button>
            </PopoverTrigger>
            <PopoverContent className="relative w-96 bg-opacity-90 p-6 rounded-lg backdrop-blur-md shadow-lg">
              <TicketForm onTicketCreated={handleNewTicket} />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-3">
          {tickets.length > 0 ? (
            tickets.map(ticket => (
              <div key={ticket._id} className="border border-gray-200 rounded-md p-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Category: {ticket.category}</h3>
                  <h4 className="text-sm mt-1">Sub Category: {ticket.subcategory}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                    ticket.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                    {ticket.status}{ticket.status === 'extended' && ticket.deadline}
                  </span>
                </div>
                <p className="text-sm mt-1">{ticket.description}</p>
                {ticket.assignedTo && (
                  <p className="text-sm text-gray-500 mt-1">Assigned to: {ticket.assignedTo.firstName}</p>
                )}
                <Button
                  variant="destructive"
                  onClick={() => openDeleteModal(ticket._id)}
                  className="mt-3"
                >
                  Delete
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No active tickets</p>
          )}
        </div>
      </div>
      <div className="p-6 h-[calc(100vh-30%)] overflow-auto rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-blue-600" />
          Announcements
          ({events.length})
        </h2>
        <div className="space-y-3">
          <div className="space-y-3">
            {events.length > 0 ? (
              events.map(event => (
                <div key={event._id} className="border border-gray-200 rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{event.title}</h3>
                    {event.readBy.includes(user) ? ( // Check if the user's ID is in the readBy array
                      <span className="text-xs text-gray-500">Already Read</span>
                    ) : (
                      <button
                        onClick={() => onMarkEventAsRead(event._id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Posted on: {new Date(event.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No announcements</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p className="mt-2 text-sm text-gray-500">Are you sure you want to delete this ticket?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <Button
                onClick={closeModal}
                variant="outline"
                className="px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteTicket(ticketToDelete);
                }}
                className="px-4 py-2 rounded-md"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Payments Section */}
      {/* <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          My Payments
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map(payment => (
                <tr key={payment._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment._id.slice(-6)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${payment.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {payment.status === 'pending' && (
                      <button className="text-blue-600 hover:text-blue-800">Pay Now</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}
