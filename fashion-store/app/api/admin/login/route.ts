import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Admin credentials not configured on the server" },
        { status: 500 },
      );
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Generate a simple session token
    const token = Buffer.from(
      JSON.stringify({
        email,
        timestamp: Date.now(),
        random: Math.random().toString(36).slice(2),
      }),
    ).toString("base64");

    return NextResponse.json({
      token,
      admin: {
        id: "admin-001",
        name: email.split("@")[0],
        email,
        role: "owner",
        status: "active",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 },
    );
  }
}