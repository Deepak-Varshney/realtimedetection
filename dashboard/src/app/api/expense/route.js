import { connectDB } from "@/lib/mongodb"
import Expense from "@/models/expense"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
      const user = await currentUser()
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
  
      const { name, amount, category, date, paidBy, notes } = await req.json()
  
      await connectDB()
      const newExpense = new Expense({
        name,
        amount,
        category,
        date,
        paidBy,
        notes,
        createdBy: user.id
      })
  
      await newExpense.save()
      return NextResponse.json(newExpense)
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
  
export async function GET() {
  try {
    await connectDB();

    const expense = await Expense.find();
    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}