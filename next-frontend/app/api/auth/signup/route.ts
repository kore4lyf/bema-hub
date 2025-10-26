import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, first_name, last_name, country, city, referred_by } = await request.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/wp/v2/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        first_name,
        last_name,
        country,
        city,
        referred_by,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Registration failed" },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
