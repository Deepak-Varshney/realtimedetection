import { connectDB } from "@/lib/mongodb";
import Event from "@/models/event";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
  try {

    const { id } = currentUser();
    const { title, description } = await req.json();

    await connectDB();
    const newEvent = new Event({
      title,
      description,
      createdBy: id,
      readBy: []
    });

    await newEvent.save();
    return NextResponse.json(newEvent);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { id } = currentUser();
    await connectDB();

    const events = await Event.find();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id } = currentUser();
    const { eventId } = await req.json();

    await connectDB();
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId },
      { $addToSet: { readBy: id } },
      { new: true }
    );

    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
