import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import type { WaitlistFormData, WaitlistApiResponse } from "@/types/waitlist";

const resend = new Resend(process.env.RESEND_API_KEY);
const audienceId = process.env.RESEND_AUDIENCE_ID;

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: WaitlistFormData = await request.json();
    const { email, firstName, lastName } = body;

    // Server-side validation
    if (!email || !firstName || !lastName) {
      return NextResponse.json<WaitlistApiResponse>(
        {
          success: false,
          message: "All fields are required",
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<WaitlistApiResponse>(
        {
          success: false,
          message: "Invalid email format",
          error: "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    // Check if environment variables are configured
    if (!process.env.RESEND_API_KEY || !audienceId) {
      console.error("Resend configuration missing");
      return NextResponse.json<WaitlistApiResponse>(
        {
          success: false,
          message: "Server configuration error",
          error: "Resend API is not properly configured",
        },
        { status: 500 }
      );
    }

    // Add contact to Resend audience
    await resend.contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
      audienceId,
    });

    return NextResponse.json<WaitlistApiResponse>(
      {
        success: true,
        message: "Successfully joined the waitlist! We'll be in touch soon.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Waitlist signup error:", error);

    // Handle specific Resend errors
    if (error?.message?.includes("already exists")) {
      return NextResponse.json<WaitlistApiResponse>(
        {
          success: false,
          message: "This email is already on the waitlist",
          error: "Email already registered",
        },
        { status: 409 }
      );
    }

    return NextResponse.json<WaitlistApiResponse>(
      {
        success: false,
        message: "Failed to join waitlist",
        error: error?.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
