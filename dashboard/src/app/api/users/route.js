// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/user";
// import { NextResponse } from 'next/server';

// export async function GET() {
//   try {
//     await connectDB();
//     const users = await User.find({  });
//     return NextResponse.json(users);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


// export async function POST(req) {
//   try {
//     const { data } = await req.json();

//     await connectDB();

//     const { id, first_name, last_name, email_addresses } = data;

//     if (!first_name || !last_name) {
//       throw new Error("Missing first_name or last_name in Clerk payload");
//     }

//     const email = email_addresses[0]?.email_address;

//     const existingUser = await User.findOne({ clerkId: id });

//     if (!existingUser) {
//       const newUser = new User({
//         clerkId: id,
//         email: email,
//         firstName: first_name,
//         lastName: last_name,
//       });

//       await newUser.save();
//       console.log("✅ New user created:", newUser);
//     } else {
//       console.log("👀 Existing user:", existingUser);
//     }

//     return NextResponse.json({ message: "Webhook processed" });
//   } catch (error) {
//     console.error("❌ Webhook error:", error);
//     return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
//   }
// }
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

// GET all users
export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("id");

  try {
    await connectDB();
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user);
    }
    const users = await User.find({});
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// POST create a new user from Clerk webhook
export async function POST(req) {
  try {
    const { data } = await req.json();

    await connectDB();

    const { id, first_name, last_name, email_addresses } = data;

    if (!first_name || !last_name) {
      throw new Error("Missing first_name or last_name in Clerk payload");
    }

    const email = email_addresses[0]?.email_address;
    const existingUser = await User.findOne({ clerkId: id });

    if (!existingUser) {
      const newUser = new User({
        clerkId: id,
        email: email,
        firstName: first_name,
        lastName: last_name,
      });

      await newUser.save();
      console.log("✅ New user created:", newUser);
    } else {
      console.log("👀 Existing user:", existingUser);
    }

    return NextResponse.json({ message: "Webhook processed" });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
