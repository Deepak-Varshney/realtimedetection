import React, { useState, useEffect } from 'react';
import { Ticket, Megaphone, ArrowRight } from 'lucide-react';

export default function AdminView({ tickets, events, onAssignTicket, onCreateEvent }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [supervisors, setSupervisors] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        const supervisorsOnly = data.filter(user => user.role === 'supervisor');
        setSupervisors(supervisorsOnly);
      })
      .catch(err => console.error('Failed to load supervisors', err));
  }, []);

  const handleAssign = () => {
    if (selectedTicket && selectedSupervisor) {
      onAssignTicket(selectedTicket, selectedSupervisor);
      setSelectedTicket(null);
      setSelectedSupervisor('');
      setShowAssignmentModal(false); // Close modal after assignment
    }
  };
  console.log(supervisors)

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (newEventTitle.trim()) {
      onCreateEvent(newEventTitle, newEventDesc);
      setNewEventTitle('');
      setNewEventDesc('');
      setShowEventForm(false);
    }
  };

  const openAssignmentModal = (ticketId) => {
    setSelectedTicket(ticketId);
    setShowAssignmentModal(true);
  };

  const closeAssignmentModal = () => {
    setShowAssignmentModal(false);
    setSelectedTicket(null);
    setSelectedSupervisor('');
  };

  return (
    <div className="space-y-6">
      {/* Tickets List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-blue-600" />
          All Tickets
        </h2>
        <div className="space-y-3">
          {tickets.length > 0 ? (
            tickets.map(ticket => (
              <div
                key={ticket._id}
                className={`border rounded-md p-3 cursor-pointer transition-colors ${selectedTicket === ticket._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{ticket.title}</h3>
                  <div className="cursor-pointer text-gray-500" onClick={() => openAssignmentModal(ticket._id)}>
                    ...
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
                {ticket.assignedTo && (
                  <p className="text-sm text-gray-500 mt-1">Assigned to: {ticket.assignedTo}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No tickets available</p>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-lg shadow max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-blue-600" />
              Assign Ticket
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Supervisor</label>
                <select
                  value={selectedSupervisor}
                  onChange={(e) => setSelectedSupervisor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select --</option>
                  {supervisors.map(sup => (
                    <option key={sup._id} value={sup._id}>{sup.firstName} {sup.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAssign}
                  disabled={!selectedSupervisor}
                  className={`px-4 py-2 rounded-md text-white ${selectedSupervisor ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                    } transition-colors`}
                >
                  Assign
                </button>
              </div>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={closeAssignmentModal}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Events Management */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-600" />
            Announcements
          </h2>
          <button
            onClick={() => setShowEventForm(!showEventForm)}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
          >
            {showEventForm ? 'Cancel' : 'New Announcement'}
          </button>
        </div>

        {showEventForm && (
          <form onSubmit={handleCreateEvent} className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Announcement title..."
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Announcement details..."
                rows="3"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Post Announcement
            </button>
          </form>
        )}

        <div className="space-y-3">
          {events.length > 0 ? (
            events.map(event => (
              <div key={event._id} className="border border-gray-200 rounded-md p-3">
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-400">
                    Posted on: {new Date(event.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Read by: {event.readBy.length} users
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No announcements yet</p>
          )}
        </div>
      </div>
    </div>
  );
}