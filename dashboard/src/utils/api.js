import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Fetch all users, tickets, and events data.
 * @returns {Promise<{users: Array, tickets: Array, events: Array}>}
 */
export const fetchData = async () => {
  try {
    const [usersRes, ticketsRes, eventsRes, expenseRes] = await Promise.all([
      axios.get('/api/users'),
      axios.get('/api/tickets'),
      axios.get('/api/events'),
      axios.get('/api/expense'),
    ]);

    return {
      users: usersRes.data,
      tickets: ticketsRes.data,
      events: eventsRes.data,
      expense: expenseRes.data,
    };
  } catch (err) {
    toast.error('Failed to load data');
    throw err;
  }
};

/**
 * Assign a ticket to a supervisor.
 * @param {string} ticketId - The ID of the ticket.
 * @param {Object} supervisor - The supervisor object.
 * @returns {Promise<Object>} - The updated ticket.
 */
export const assignTicket = async (ticketId, supervisor) => {
  try {
    const res = await axios.put('/api/tickets', { ticketId, assignedTo: supervisor });
    toast.success('Ticket assigned successfully');
    return res.data;
  } catch (err) {
    toast.error('Failed to assign ticket');
    throw err;
  }
};

/**
 * Create a new event.
 * @param {string} title - The title of the event.
 * @param {string} description - The description of the event.
 * @param {Object} createdBy - The user who created the event.
 * @returns {Promise<Object>} - The created event.
 */
export const createEvent = async (title, description, createdBy) => {
  try {
    const res = await axios.post('/api/events', { title, description, createdBy });
    toast.success('Event created successfully');
    return res.data;
  } catch (err) {
    toast.error('Failed to create event');
    throw err;
  }
};