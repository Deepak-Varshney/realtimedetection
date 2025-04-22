import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["user", "supervisor", "admin"], 
    default: "user" 
  }
});

export default mongoose.models.User || mongoose.model("User", userSchema);
