import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["open", "assigned", "extended", "done"], 
    default: "open" 
  },
  createdBy: { type: String, required: true },
  assignedTo: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ticketSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
