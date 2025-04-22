import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/payment";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { id } = currentUser();
    await connectDB();
    
    const payments = await Payment.find({ id });
    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { id } = currentUser();
    const { amount } = await req.json();
    
    await connectDB();
    const newPayment = new Payment({
      id,
      amount,
      status: "pending"
    });
    
    await newPayment.save();
    return NextResponse.json(newPayment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}