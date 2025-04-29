import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    paidBy: { type: String, required: true },
    notes: { type: String },
    createdBy: { type: String, required: true }, // Clerk user ID
}, {
    timestamps: true
})

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema)
export default Expense
