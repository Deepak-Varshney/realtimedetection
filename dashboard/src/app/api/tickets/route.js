import { connectDB } from "@/lib/mongodb";
import Ticket from "@/models/ticket";
import { NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req) {
  try {
    const user = await currentUser();
    const { category, description, subcategory } = await req.json();

    await connectDB();
    const newTicket = new Ticket({
      category,
      description,
      subcategory,
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
    await connectDB();
    const tickets = await Ticket.find({});

    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { ticketId, status, assignedTo, deadline } = await req.json();

    await connectDB();
    const updateData = {};

    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;

    // Use provided deadline based on status
    if (status === "assigned" && deadline) {
      updateData.deadline = deadline;
    } else if (status === "extended" && deadline) {
      updateData.deadline = deadline;
    }

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

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get("id"); 
    await connectDB();
    const deletedTicket = await Ticket.findOneAndDelete({ _id: ticketId });

    if (!deletedTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ticket deleted successfully", ticket: deletedTicket });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}