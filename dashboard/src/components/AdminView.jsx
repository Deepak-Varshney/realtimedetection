
'use client'
import React, { useState, useEffect } from 'react';
import { Ticket, Megaphone, ArrowRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export default function AdminView() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [supervisors, setSupervisors] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [payments, setPayments] = useState([]);
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [newEventDesc, setNewEventDesc] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const user = useUser();
  // console.log(user.user.id)
  // console.log(supervisors)
  useEffect(() => {
    if (user.user) setCurrentUser({
      id: user.user.id,
      firstName: user.user.firstName,
      lastName: user.user.lastName,
      email: user.user.emailAddresses[0].emailAddress,
      clerkId: user.user.id,
      role: user.user.publicMetadata.role,
    })
  }, [user.isLoaded])
  console.log(currentUser)
  // Fetch supervisors on component mount
  useEffect(() => {

    const fetchSupervisors = async () => {
      try {
        const res = await axios.get('/api/users');
        const supervisorsOnly = res.data.filter(user => user.role === 'supervisor');
        setSupervisors(supervisorsOnly);
      } catch (err) {
        console.error('Failed to load supervisors', err);
      }
    };
    fetchSupervisors();
    // Fetch tickets
    axios.get('/api/tickets')
      .then(res => {
        const sortedTickets = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
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

    // fetch events
    axios.get('/api/events').then(res => {
      const sortedEvents = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setEvents(sortedEvents);
    }).catch(() => toast.error('Failed to load events'));

  }, []);
  // Assign ticket to supervisor
  const assignTicket = async (ticketId, supervisor) => {
    try {
      const res = await axios.put('/api/tickets', { ticketId, assignedTo: supervisor });
      const updatedTicket = res.data;
      setTickets(tickets.map(t => t._id === updatedTicket._id ? updatedTicket : t));
      toast.success('Ticket assigned successfully');
    } catch {
      toast.error('Failed to assign ticket');
    }
  };


  // Create a new event
  const createEvent = async (title, description, createdBy) => {
    try {
      const res = await axios.post('/api/events', { title, description, createdBy: currentUser });
      setEvents([...events, res.data]);
      toast.success('Event created successfully');
    } catch {
      toast.error('Failed to create event');
    }
  };

  // Handlers for assignment modal
  const openAssignmentModal = (ticketId) => {
    setSelectedTicket(ticketId);
    setShowAssignmentModal(true);
  };

  const closeAssignmentModal = () => {
    setShowAssignmentModal(false);
    setSelectedTicket(null);
    setSelectedSupervisor('');
  };

  // Event handler to assign ticket
  const handleAssign = () => {
    if (selectedTicket && selectedSupervisor) {
      assignTicket(selectedTicket, selectedSupervisor);
      setSelectedTicket(null);
      setSelectedSupervisor('');
      setShowAssignmentModal(false);
    }
  };

  // Event handler to create event
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (newEventTitle.trim()) {
      createEvent(newEventTitle, newEventDesc);
      setNewEventTitle('');
      setNewEventDesc('');
      setShowEventForm(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Tickets List */}
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
                className={`border rounded-md p-3 cursor-pointer transition-colors ${selectedTicket === ticket._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{ticket.category}</h3>
                  <h4 className="font-medium">{ticket.subcategory}</h4>
                  <div className="cursor-pointer" onClick={() => openAssignmentModal(ticket._id)}>
                    ...
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
                {ticket.assignedTo && (
                  <p className="text-sm text-gray-500 mt-1">Assigned to: {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}</p>
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
              <ArrowRight className="w-5 h-5 text-purple-600" />
              Assign Ticket
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label className="block text-sm font-medium mb-1">Select Supervisor</Label>
                <select
                  value={selectedSupervisor?._id || ''}
                  onChange={(e) => {
                    const selected = supervisors.find(sup => sup._id === e.target.value);
                    setSelectedSupervisor(selected || '');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- Select --</option>
                  {supervisors.map(sup => (
                    <option key={sup._id} value={sup._id}>
                      {sup.firstName} {sup.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAssign}
                  disabled={!selectedSupervisor}
                  className={`px-4 py-2 rounded-md ${selectedSupervisor ? '' : 'cursor-not-allowed'
                    } transition-colors`}
                >
                  Assign
                </Button>
              </div>
            </div>
            <div className="mt-4 text-right">
              <Button
                variant="outline"
                onClick={closeAssignmentModal}
                className="text-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )
      }


      {/* Events Management */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-purple-600" />
            Announcements
          </h2>
          <Button
            onClick={() => setShowEventForm(!showEventForm)}
            className="text-white px-3 py-1 rounded-md text-sm"
          >
            {showEventForm ? 'Cancel' : 'New Announcement'}
          </Button>
        </div>
        {showEventForm && (
          <form onSubmit={handleCreateEvent} className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                placeholder="Announcement title..."
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Textarea
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                placeholder="Announcement details..."
                rows="3"
              />
            </div>
            <Button
              type="submit"
              className="px-4 py-2 rounded-md transition-colors"
            >
              Post Announcement
            </Button>
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
    </div >
  );
}