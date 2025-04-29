import React from 'react';
import { Ticket } from 'lucide-react';

export default function TicketList({ tickets, selectedTicket, openAssignmentModal }) {
  return (
    <div className="p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Ticket className="w-5 h-5 text-purple-600" />
        All Tickets
      </h2>
      <div className="space-y-3">
        {tickets.length > 0 ? (
          tickets.map(ticket => (
            <div
              key={ticket._id}
              className={`border rounded-md p-3 cursor-pointer transition-colors ${
                selectedTicket === ticket._id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{ticket.category}</h3>
                <h4 className="font-medium">{ticket.subcategory}</h4>
                <div
                  className="cursor-pointer"
                  onClick={() => openAssignmentModal(ticket._id)}
                >
                  ...
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
              {ticket.assignedTo && (
                <p className="text-sm text-gray-500 mt-1">
                  Assigned to: {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No tickets available</p>
        )}
      </div>
    </div>
  );
}