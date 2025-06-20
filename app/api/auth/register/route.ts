import { connectToDatabase } from "@/lib/db";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and Password are required" },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already Registered" },
        { status: 300 }
      );
    }
    await User.create({
      email,
      password,
    });
    return NextResponse.json(
      { message: "User Registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Not registered", error },
      { status: 404 }
    );
  }
}
