import { useState, useEffect } from 'react';
import { fetchData, assignTicket } from '../utils/api';

export default function useAdminData() {
  const [supervisors, setSupervisors] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [expense, setExpense] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const { users, tickets, events, expense } = await fetchData();

        // Filter supervisors
        const supervisorsOnly = users.filter(user => user.role === 'supervisor');
        setSupervisors(supervisorsOnly);

        // Sort tickets by updatedAt
        const sortedTickets = tickets.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setTickets(sortedTickets);
        setFilteredTickets(sortedTickets);

        // Sort events by createdAt
        const sortedEvents = events.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setEvents(sortedEvents);
        const sortedExpense = expense.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setEvents(sortedExpense);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    loadData();
  }, []);

  // Handle ticket assignment
  const handleAssign = async () => {
    if (selectedTicket && selectedSupervisor) {
      try {
        const updatedTicket = await assignTicket(selectedTicket, selectedSupervisor);
        setTickets(tickets.map(t => (t._id === updatedTicket._id ? updatedTicket : t)));
        setFilteredTickets(filteredTickets.map(t => (t._id === updatedTicket._id ? updatedTicket : t)));
        closeAssignmentModal();
      } catch (err) {
        console.error('Error assigning ticket:', err);
      }
    }
  };

  // Open the assignment modal
  const openAssignmentModal = (ticketId) => {
    setSelectedTicket(ticketId);
    setShowAssignmentModal(true);
  };

  // Close the assignment modal
  const closeAssignmentModal = () => {
    setShowAssignmentModal(false);
    setSelectedTicket(null);
    setSelectedSupervisor('');
  };

  // Filter tickets based on the search input
  const filterTickets = (filter) => {
    if (filter.trim() === '') {
      setFilteredTickets(tickets);
    } else {
      const lowerCaseFilter = filter.toLowerCase();
      setFilteredTickets(
        tickets.filter(ticket =>
          ticket.category.toLowerCase().includes(lowerCaseFilter) ||
          ticket.subcategory.toLowerCase().includes(lowerCaseFilter) ||
          ticket.description.toLowerCase().includes(lowerCaseFilter)
        )
      );
    }
  };

  return {
    supervisors,
    tickets,
    filteredTickets,
    events,
    selectedTicket,
    selectedSupervisor,
    expense,
    showAssignmentModal,
    setSelectedSupervisor,
    handleAssign,
    openAssignmentModal,
    closeAssignmentModal,
    filterTickets,
    setEvents,
    setExpense
  };
}