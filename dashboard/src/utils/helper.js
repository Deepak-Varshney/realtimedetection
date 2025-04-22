import toast from "react-hot-toast";

export const createTicket = async (title, description) => {
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

export const assignTicket = async (ticketId, supervisor) => {
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

export const updateTicketStatus = async (ticketId, status) => {
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

export const createEvent = async (title, description) => {
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

export const markEventAsRead = async (eventId) => {
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
export const handleSignOut = async () => {
    await signOut();
    router.push("/login");
};
