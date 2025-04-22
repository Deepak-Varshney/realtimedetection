
// File: models/payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "completed", "failed"], 
    default: "pending" 
  },
  date: { type: Date, default: Date.now }
});

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
