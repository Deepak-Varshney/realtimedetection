import React, { useState } from 'react';
import { Ticket, Megaphone, Plus, CreditCard } from 'lucide-react';
export default function UserView({ tickets, payments, events, onCreateTicket, onMarkEventAsRead }) {
    const [newTicketTitle, setNewTicketTitle] = useState('');
    const [newTicketDesc, setNewTicketDesc] = useState('');
    const [showEvents, setShowEvents] = useState(false);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (newTicketTitle.trim()) {
        onCreateTicket(newTicketTitle, newTicketDesc);
        setNewTicketTitle('');
        setNewTicketDesc('');
      }
    };
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Ticket Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Create New Ticket
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newTicketTitle}
                onChange={(e) => setNewTicketTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ticket title..."
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newTicketDesc}
                onChange={(e) => setNewTicketDesc(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your issue..."
                rows="3"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit Ticket
            </button>
          </form>
        </div>
  
        {/* My Tickets Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-blue-600" />
            My Tickets
          </h2>
          <div className="space-y-3">
            {tickets.length > 0 ? (
              tickets.map(ticket => (
                <div key={ticket._id} className="border border-gray-200 rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{ticket.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
                  {ticket.assignedTo && (
                    <p className="text-sm text-gray-500 mt-1">Assigned to: {ticket.assignedTo}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No active tickets</p>
            )}
          </div>
        </div>
  
        {/* Events Section */}
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-blue-600" />
              Announcements
            </h2>
            <button
              onClick={() => setShowEvents(!showEvents)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {showEvents ? 'Hide' : 'Show'} ({events.length})
            </button>
          </div>
  
          {showEvents && (
            <div className="space-y-3">
              {events.length > 0 ? (
                events.map(event => (
                  <div key={event._id} className="border border-gray-200 rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{event.title}</h3>
                      <button
                        onClick={() => onMarkEventAsRead(event._id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Mark as read
                      </button>
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
          )}
        </div>
  
        {/* Payments Section */}
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
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
        </div>
      </div>
    );
  }
  