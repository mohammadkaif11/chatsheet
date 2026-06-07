import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler to send WhatsApp messages via Twilio
 *
 * Request body:
 * {
 *   "to": "+1234567890",
 *   "message": "Hello!",
 *   "mediaUrl": "https://example.com/image.jpg" // optional
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message, mediaUrl } = body;

    if (!to || !message) {
      return NextResponse.json(
        { error: "Missing required fields: to, message" },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json(
        { error: "Twilio credentials not configured" },
        { status: 500 }
      );
    }

    // Format phone numbers with whatsapp: prefix if not present
    const toNumber = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
    const from = fromNumber.startsWith("whatsapp:")
      ? fromNumber
      : `whatsapp:${fromNumber}`;

    // Build form data for Twilio API
    const formData = new URLSearchParams();
    formData.append("To", toNumber);
    formData.append("From", from);
    formData.append("Body", message);

    if (mediaUrl) {
      formData.append("MediaUrl", mediaUrl);
    }

    // Call Twilio API
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Twilio API error:", data);
      return NextResponse.json(
        { error: "Failed to send message", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      messageSid: data.sid,
      status: data.status,
      data,
    });
  } catch (error) {
    console.error("Error sending Twilio message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET handler for API info
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/send/twilio",
    method: "POST",
    contentType: "application/json",
    body: {
      to: "Phone number (with or without whatsapp: prefix)",
      message: "Message text",
      mediaUrl: "Optional media URL",
    },
  });
}
