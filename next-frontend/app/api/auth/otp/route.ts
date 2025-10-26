import { NextRequest, NextResponse } from "next/server";

// In-memory store for OTPs (use Redis in production)
const otpStore = new Map<string, { code: string; expires: number }>();

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email, action } = await request.json();

    if (action === "generate") {
      const otp = generateOTP();
      const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

      otpStore.set(email, { code: otp, expires });

      // Send OTP via email (implement email service)
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/bema/v1/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      return NextResponse.json({ success: true, message: "OTP sent to email" });
    }

    if (action === "verify") {
      const { otp } = await request.json();
      const stored = otpStore.get(email);

      if (!stored) {
        return NextResponse.json({ success: false, message: "OTP not found" }, { status: 400 });
      }

      if (Date.now() > stored.expires) {
        otpStore.delete(email);
        return NextResponse.json({ success: false, message: "OTP expired" }, { status: 400 });
      }

      if (stored.code !== otp) {
        return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
      }

      otpStore.delete(email);
      return NextResponse.json({ success: true, message: "OTP verified" });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
