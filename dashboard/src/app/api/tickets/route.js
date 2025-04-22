import { connectDB } from "@/lib/mongodb";
import Ticket from "@/models/ticket";
import { NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server';


export async function POST(req) {
  try {
    const user = await currentUser();
    const { title, description } = await req.json();

    await connectDB();
    const newTicket = new Ticket({
      title,
      description,
      createdBy: user.id,
      status: "open"
    });

    await newTicket.save();
    return NextResponse.json(newTicket);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { id } = currentUser();
    await connectDB();

    const tickets = await Ticket.find({
      $or: [
        { createdBy: id },
        { assignedTo: id }
      ]
    });

    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id } = currentUser();
    const { ticketId, status, assignedTo } = await req.json();

    await connectDB();
    const updateData = {};
    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;

    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticketId },
      updateData,
      { new: true }
    );

    return NextResponse.json(updatedTicket);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}