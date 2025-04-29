import { connectDB } from "@/lib/mongodb";
import Event from "@/models/event";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
  try {

    const { id } = currentUser();
    const { title, description, createdBy } = await req.json();

    await connectDB();
    const newEvent = new Event({
      title,
      description,
      createdBy,
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
    const user = await currentUser();
    const { eventId } = await req.json();
    await connectDB();
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId },
      { $addToSet: { readBy: user.id } },
      { new: true }
    );

    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("id"); 
    await connectDB();
    const deletedEvent = await Event.findOneAndDelete({ _id: eventId });

    if (!deletedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Event deleted successfully", event: deletedEvent });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}