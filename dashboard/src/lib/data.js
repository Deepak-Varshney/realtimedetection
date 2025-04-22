import { connectDB } from '@/lib/mongodb'
import ticket from '@/models/ticket';
import payment from '@/models/payment';
import event from '@/models/event';
export async function getTickets(userId) {
    await connectDB();
    return ticket.find({ userId });
}

export async function getPayments(userId) {
    await connectDB();
    return payment.find({ userId });
}

export async function getEvents(userId) {
    await connectDB();
    return event.find({ userId });
}
