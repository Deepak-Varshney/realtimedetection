// 'use client'

// import { useState, useEffect } from 'react';
// import { 
//   User, Shield, Users, Ticket, CreditCard, Plus, 
//   Check, Clock, ArrowRight, Search, Bell, Menu,
//   Calendar, Megaphone
// } from 'lucide-react';
// import { useUser, useClerk } from '@clerk/nextjs';
// import { toast } from 'react-hot-toast';
// import {router} from 'next/navigation';

// export default function TicketingDashboard() {
//   const { user } = useUser();
//   const { signOut } = useClerk();
//   const [currentRole, setCurrentRole] = useState('user');
//   const [tickets, setTickets] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [unreadEvents, setUnreadEvents] = useState(0);

//   // Fetch data
//   useEffect(() => {
//     if (!user) return;

//     // Set role from user metadata
//     setCurrentRole(user.publicMetadata.role || 'user');

//     // Fetch tickets
//     fetch('/api/tickets')
//       .then(res => res.json())
//       .then(data => setTickets(data))
//       .catch(err => toast.error('Failed to load tickets'));

//     // Fetch payments
//     fetch('/api/payments')
//       .then(res => res.json())
//       .then(data => setPayments(data))
//       .catch(err => toast.error('Failed to load payments'));

//     // Fetch events and calculate unread
//     fetch('/api/events')
//       .then(res => res.json())
//       .then(data => {
//         setEvents(data);
//         const unread = data.filter(e => !e.readBy.includes(user.id)).length;
//         setUnreadEvents(unread);
//       })
//       .catch(err => toast.error('Failed to load events'));
//   }, [user]);

//   const createTicket = async (title, description) => {
//     try {
//       const response = await fetch('/api/tickets', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ title, description })
//       });
//       const newTicket = await response.json();
//       setTickets([...tickets, newTicket]);
//       toast.success('Ticket created successfully');
//     } catch (error) {
//       toast.error('Failed to create ticket');
//     }
//   };

//   const assignTicket = async (ticketId, supervisor) => {
//     try {
//       const response = await fetch('/api/tickets', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ticketId, assignedTo: supervisor })
//       });
//       const updatedTicket = await response.json();
//       setTickets(tickets.map(t => 
//         t._id === updatedTicket._id ? updatedTicket : t
//       ));
//       toast.success('Ticket assigned successfully');
//     } catch (error) {
//       toast.error('Failed to assign ticket');
//     }
//   };

//   const updateTicketStatus = async (ticketId, status) => {
//     try {
//       const response = await fetch('/api/tickets', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ticketId, status })
//       });
//       const updatedTicket = await response.json();
//       setTickets(tickets.map(t => 
//         t._id === updatedTicket._id ? updatedTicket : t
//       ));
//       toast.success('Ticket status updated');
//     } catch (error) {
//       toast.error('Failed to update ticket');
//     }
//   };

//   const createEvent = async (title, description) => {
//     try {
//       const response = await fetch('/api/events', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ title, description })
//       });
//       const newEvent = await response.json();
//       setEvents([...events, newEvent]);
//       toast.success('Event created successfully');
//     } catch (error) {
//       toast.error('Failed to create event');
//     }
//   };

//   const markEventAsRead = async (eventId) => {
//     try {
//       const response = await fetch('/api/events', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ eventId })
//       });
//       const updatedEvent = await response.json();
//       setEvents(events.map(e => 
//         e._id === updatedEvent._id ? updatedEvent : e
//       ));
//       setUnreadEvents(unreadEvents - 1);
//     } catch (error) {
//       toast.error('Failed to mark event as read');
//     }
//   };
//   const handleSignOut = async () => {
//     await signOut();
//     router.push("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-white shadow-sm">
//         <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <Ticket className="w-6 h-6 text-blue-600" />
//             <h1 className="text-xl font-bold">Dashboard</h1>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <button className="p-2 rounded-full hover:bg-gray-100 relative">
//                 <Bell className="w-5 h-5 text-gray-600" />
//                 {unreadEvents > 0 && (
//                   <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {unreadEvents}
//                   </span>
//                 )}
//               </button>
//             </div>

//             <div className="relative">
//               <button 
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
//               >
//                 <User className="w-4 h-4" />
//                 <span>{user?.firstName} ({currentRole})</span>
//                 <Menu className="w-4 h-4" />
//               </button>

//               {isMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
//                   <button 
//                     onClick={handleSignOut}
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                   >
//                     Sign Out
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-6">
//         {currentRole === 'user' && (
//           <UserView 
//             tickets={tickets.filter(t => t.status !== 'done')}
//             payments={payments}
//             events={events}
//             onCreateTicket={createTicket}
//             onMarkEventAsRead={markEventAsRead}
//           />
//         )}

//         {currentRole === 'supervisor' && (
//           <SupervisorView 
//             tickets={tickets.filter(t => t.assignedTo === user.id)}
//             onUpdateStatus={updateTicketStatus}
//           />
//         )}

//         {currentRole === 'admin' && (
//           <AdminView 
//             tickets={tickets}
//             events={events}
//             onAssignTicket={assignTicket}
//             onCreateEvent={createEvent}
//           />
//         )}
//       </main>
//     </div>
//   );
// }

// // User View Component
// function UserView({ tickets, payments, events, onCreateTicket, onMarkEventAsRead }) {
//   const [newTicketTitle, setNewTicketTitle] = useState('');
//   const [newTicketDesc, setNewTicketDesc] = useState('');
//   const [showEvents, setShowEvents] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (newTicketTitle.trim()) {
//       onCreateTicket(newTicketTitle, newTicketDesc);
//       setNewTicketTitle('');
//       setNewTicketDesc('');
//     }
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {/* Create Ticket Section */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//           <Plus className="w-5 h-5 text-blue-600" />
//           Create New Ticket
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//             <input
//               type="text"
//               value={newTicketTitle}
//               onChange={(e) => setNewTicketTitle(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Ticket title..."
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//             <textarea
//               value={newTicketDesc}
//               onChange={(e) => setNewTicketDesc(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Describe your issue..."
//               rows="3"
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
//           >
//             Submit Ticket
//           </button>
//         </form>
//       </div>

//       {/* My Tickets Section */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//           <Ticket className="w-5 h-5 text-blue-600" />
//           My Tickets
//         </h2>
//         <div className="space-y-3">
//           {tickets.length > 0 ? (
//             tickets.map(ticket => (
//               <div key={ticket._id} className="border border-gray-200 rounded-md p-3">
//                 <div className="flex justify-between items-start">
//                   <h3 className="font-medium">{ticket.title}</h3>
//                   <span className={`px-2 py-1 text-xs rounded-full ${
//                     ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
//                     ticket.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
//                     'bg-green-100 text-green-800'
//                   }`}>
//                     {ticket.status}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
//                 {ticket.assignedTo && (
//                   <p className="text-sm text-gray-500 mt-1">Assigned to: {ticket.assignedTo}</p>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No active tickets</p>
//           )}
//         </div>
//       </div>

//       {/* Events Section */}
//       <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold flex items-center gap-2">
//             <Megaphone className="w-5 h-5 text-blue-600" />
//             Announcements
//           </h2>
//           <button 
//             onClick={() => setShowEvents(!showEvents)}
//             className="text-blue-600 hover:text-blue-800 text-sm"
//           >
//             {showEvents ? 'Hide' : 'Show'} ({events.length})
//           </button>
//         </div>

//         {showEvents && (
//           <div className="space-y-3">
//             {events.length > 0 ? (
//               events.map(event => (
//                 <div key={event._id} className="border border-gray-200 rounded-md p-3">
//                   <div className="flex justify-between items-start">
//                     <h3 className="font-medium">{event.title}</h3>
//                     <button
//                       onClick={() => onMarkEventAsRead(event._id)}
//                       className="text-xs text-blue-600 hover:text-blue-800"
//                     >
//                       Mark as read
//                     </button>
//                   </div>
//                   <p className="text-sm text-gray-500 mt-1">{event.description}</p>
//                   <p className="text-xs text-gray-400 mt-2">
//                     Posted on: {new Date(event.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500">No announcements</p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Payments Section */}
//       <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
//         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//           <CreditCard className="w-5 h-5 text-blue-600" />
//           My Payments
//         </h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {payments.map(payment => (
//                 <tr key={payment._id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment._id.slice(-6)}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${payment.amount}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(payment.date).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs rounded-full ${
//                       payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {payment.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     {payment.status === 'pending' && (
//                       <button className="text-blue-600 hover:text-blue-800">Pay Now</button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Supervisor View Component
// function SupervisorView({ tickets, onUpdateStatus }) {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow">
//       <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//         <Users className="w-5 h-5 text-blue-600" />
//         Assigned Tickets
//       </h2>
//       <div className="space-y-4">
//         {tickets.length > 0 ? (
//           tickets.map(ticket => (
//             <div key={ticket._id} className="border border-gray-200 rounded-md p-4">
//               <div className="flex justify-between items-start">
//                 <h3 className="font-medium">{ticket.title}</h3>
//                 <span className={`px-2 py-1 text-xs rounded-full ${
//                   ticket.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {ticket.status}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>

//               <div className="mt-4 flex gap-2">
//                 <button
//                   onClick={() => onUpdateStatus(ticket._id, 'extended')}
//                   className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200"
//                 >
//                   <Clock className="w-4 h-4" />
//                   Extend
//                 </button>
//                 <button
//                   onClick={() => onUpdateStatus(ticket._id, 'done')}
//                   className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
//                 >
//                   <Check className="w-4 h-4" />
//                   Mark Done
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">No tickets assigned to you</p>
//         )}
//       </div>
//     </div>
//   );
// }

// // Admin View Component
// function AdminView({ tickets, events, onAssignTicket, onCreateEvent }) {
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [selectedSupervisor, setSelectedSupervisor] = useState('');
//   const [supervisors, setSupervisors] = useState([]);
//   const [newEventTitle, setNewEventTitle] = useState('');
//   const [newEventDesc, setNewEventDesc] = useState('');
//   const [showEventForm, setShowEventForm] = useState(false);

//   useEffect(() => {
//     fetch('/api/users')
//       .then(res => res.json())
//       .then(data => setSupervisors(data))
//       .catch(err => console.error('Failed to load supervisors', err));
//   }, []);

//   const handleAssign = () => {
//     if (selectedTicket && selectedSupervisor) {
//       onAssignTicket(selectedTicket, selectedSupervisor);
//       setSelectedTicket(null);
//       setSelectedSupervisor('');
//     }
//   };

//   const handleCreateEvent = (e) => {
//     e.preventDefault();
//     if (newEventTitle.trim()) {
//       onCreateEvent(newEventTitle, newEventDesc);
//       setNewEventTitle('');
//       setNewEventDesc('');
//       setShowEventForm(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Tickets List */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//           <Ticket className="w-5 h-5 text-blue-600" />
//           All Tickets
//         </h2>
//         <div className="space-y-3">
//           {tickets.length > 0 ? (
//             tickets.map(ticket => (
//               <div 
//                 key={ticket._id} 
//                 className={`border rounded-md p-3 cursor-pointer transition-colors ${
//                   selectedTicket === ticket._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
//                 }`}
//                 onClick={() => setSelectedTicket(ticket._id)}
//               >
//                 <div className="flex justify-between items-start">
//                   <h3 className="font-medium">{ticket.title}</h3>
//                   <span className={`px-2 py-1 text-xs rounded-full ${
//                     ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
//                     ticket.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
//                     'bg-green-100 text-green-800'
//                   }`}>
//                     {ticket.status}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
//                 {ticket.assignedTo && (
//                   <p className="text-sm text-gray-500 mt-1">Assigned to: {ticket.assignedTo}</p>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No tickets available</p>
//           )}
//         </div>
//       </div>

//       {/* Assignment Panel */}
//       {selectedTicket && (
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <ArrowRight className="w-5 h-5 text-blue-600" />
//             Assign Ticket
//           </h2>
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Select Supervisor</label>
//               <select
//                 value={selectedSupervisor}
//                 onChange={(e) => setSelectedSupervisor(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">-- Select --</option>
//                 {supervisors.map(sup => (
//                   <option key={sup._id} value={sup._id}>{sup.firstName} {sup.lastName}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex items-end">
//               <button
//                 onClick={handleAssign}
//                 disabled={!selectedSupervisor}
//                 className={`px-4 py-2 rounded-md text-white ${
//                   selectedSupervisor ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
//                 } transition-colors`}
//               >
//                 Assign
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Events Management */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold flex items-center gap-2">
//             <Megaphone className="w-5 h-5 text-blue-600" />
//             Announcements
//           </h2>
//           <button 
//             onClick={() => setShowEventForm(!showEventForm)}
//             className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
//           >
//             {showEventForm ? 'Cancel' : 'New Announcement'}
//           </button>
//         </div>

//         {showEventForm && (
//           <form onSubmit={handleCreateEvent} className="mb-6">
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//               <input
//                 type="text"
//                 value={newEventTitle}
//                 onChange={(e) => setNewEventTitle(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Announcement title..."
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <textarea
//                 value={newEventDesc}
//                 onChange={(e) => setNewEventDesc(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Announcement details..."
//                 rows="3"
//               />
//             </div>
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
//             >
//               Post Announcement
//             </button>
//           </form>
//         )}

//         <div className="space-y-3">
//           {events.length > 0 ? (
//             events.map(event => (
//               <div key={event._id} className="border border-gray-200 rounded-md p-3">
//                 <h3 className="font-medium">{event.title}</h3>
//                 <p className="text-sm text-gray-500 mt-1">{event.description}</p>
//                 <div className="flex justify-between items-center mt-2">
//                   <p className="text-xs text-gray-400">
//                     Posted on: {new Date(event.createdAt).toLocaleString()}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Read by: {event.readBy.length} users
//                   </p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No announcements yet</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client'

import { useState, useEffect } from 'react';
import {
  User, Shield, Users, Ticket, CreditCard, Plus,
  Check, Clock, ArrowRight, Search, Bell, Menu,
  Calendar, Megaphone, Ellipsis
} from 'lucide-react';

import { useUser, useClerk } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import { router } from 'next/navigation';

export default function TicketingDashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [currentRole, setCurrentRole] = useState('user');
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [events, setEvents] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadEvents, setUnreadEvents] = useState(0);

  // Fetch data
  useEffect(() => {
    if (!user) return;
    // Set role from user metadata
    setCurrentRole(user.publicMetadata.role || 'user');

    // Fetch tickets
    fetch('/api/tickets')
      .then(res => res.json())
      .then(data => {
        const sortedTickets = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTickets(sortedTickets);
      })
      .catch(err => toast.error('Failed to load tickets'));

    // Fetch payments
    fetch('/api/payments')
      .then(res => res.json())
      .then(data => {
        const sortedPayments = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPayments(sortedPayments)
      })
      .catch(err => toast.error('Failed to load payments'));

    // Fetch events and calculate unread
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        const sortedEvents = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setEvents(sortedEvents);
        const unread = data.filter(e => !e.readBy.includes(user.id)).length;
        setUnreadEvents(unread);
      })
      .catch(err => toast.error('Failed to load events'));

  }, [user]);

  const createTicket = async (title, description) => {
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      const newTicket = await response.json();
      setTickets([...tickets, newTicket]);
      toast.success('Ticket created successfully');
    } catch (error) {
      toast.error('Failed to create ticket');
    }
  };

  const assignTicket = async (ticketId, supervisor) => {
    try {
      const response = await fetch('/api/tickets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, assignedTo: supervisor })
      });
      const updatedTicket = await response.json();
      setTickets(tickets.map(t =>
        t._id === updatedTicket._id ? updatedTicket : t
      ));
      toast.success('Ticket assigned successfully');
    } catch (error) {
      toast.error('Failed to assign ticket');
    }
  };

  const updateTicketStatus = async (ticketId, status) => {
    try {
      const response = await fetch('/api/tickets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, status })
      });
      const updatedTicket = await response.json();
      setTickets(tickets.map(t =>
        t._id === updatedTicket._id ? updatedTicket : t
      ));
      toast.success('Ticket status updated');
    } catch (error) {
      toast.error('Failed to update ticket');
    }
  };

  const createEvent = async (title, description) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      const newEvent = await response.json();
      setEvents([...events, newEvent]);
      toast.success('Event created successfully');
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const markEventAsRead = async (eventId) => {
    try {
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      });
      const updatedEvent = await response.json();
      setEvents(events.map(e =>
        e._id === updatedEvent._id ? updatedEvent : e
      ));
      setUnreadEvents(unreadEvents - 1);
    } catch (error) {
      toast.error('Failed to mark event as read');
    }
  };
  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Ticket className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadEvents > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadEvents}
                  </span>
                )}
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
              >
                <User className="w-4 h-4" />
                <span>{user?.firstName} ({currentRole})</span>
                <Menu className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={handleSignOut}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

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

        {currentRole === 'supervisor' && (
          <SupervisorView
            tickets={tickets.filter(t => t.assignedTo === user.id)}
            onUpdateStatus={updateTicketStatus}
          />
        )}

        {currentRole === 'admin' && (
          <AdminView
            tickets={tickets}
            events={events}
            onAssignTicket={assignTicket}
            onCreateEvent={createEvent}
          />
        )}
      </main>
    </div>
  );
}

// User View Component
function UserView({ tickets, payments, events, onCreateTicket, onMarkEventAsRead }) {
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

// Supervisor View Component
function SupervisorView({ tickets, onUpdateStatus }) {
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

function AdminView({ tickets, events, onAssignTicket, onCreateEvent }) {
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
      .then(data => setSupervisors(data))
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