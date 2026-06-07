import { NextRequest, NextResponse } from "next/server";
import { addMessage } from "@/lib/messageStore";

/**
 * POST handler for Twilio WhatsApp webhook
 * Twilio sends form-encoded data by default
 *
 * Sample Twilio payload:
 * {
 *   MessageSid: "SMxxx",
 *   From: "whatsapp:+1234567890",
 *   To: "whatsapp:+0987654321",
 *   Body: "Hello",
 *   NumMedia: "0",
 *   MediaContentType0: "image/jpeg",
 *   MediaUrl0: "https://...",
 *   ProfileName: "John Doe",
 *   WaId: "1234567890"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Twilio sends form-encoded data
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    console.log("Twilio webhook received:", data);

    // Extract message details
    const from = data.From as string; // whatsapp:+1234567890
    const to = data.To as string; // whatsapp:+0987654321
    const body = (data.Body as string) || "";
    const numMedia = parseInt((data.NumMedia as string) || "0", 10);
    const profileName = (data.ProfileName as string) || "Unknown";
    const waId = data.WaId as string;

    // Determine message type
    let type = "text";
    let mediaUrl: string | undefined;

    if (numMedia > 0) {
      const contentType = (data.MediaContentType0 as string) || "";
      mediaUrl = data.MediaUrl0 as string;

      if (contentType.startsWith("image/")) type = "image";
      else if (contentType.startsWith("audio/")) type = "audio";
      else if (contentType.startsWith("video/")) type = "video";
      else if (contentType.startsWith("application/")) type = "document";
    }

    // Check for location data (Twilio sends these when user shares location)
    const latitude = data.Latitude as string;
    const longitude = data.Longitude as string;
    if (latitude && longitude) {
      type = "location";
    }

    // Store in shared message log
    const entry = addMessage({
      source: "twilio",
      from: from.replace("whatsapp:", ""),
      to: to.replace("whatsapp:", ""),
      body,
      type,
      raw: data,
      mediaUrl,
      numMedia,
    });

    console.log(`Twilio ${type} message from ${profileName} (${waId}): ${body}`);

    // Optionally: Send a response back via Twilio
    // const responseMessage = generateReply(body);
    // await sendTwilioReply(to, from, responseMessage);

    // Return empty TwiML response (or XML if you want to reply)
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <!-- Optionally add auto-reply here -->
  <!-- <Message>Thanks for your message!</Message> -->
</Response>`;

    return new Response(twiml, {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("Twilio webhook error:", error);
    // Still return 200 to prevent Twilio retries
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><Response/>`,
      { status: 200, headers: { "Content-Type": "application/xml" } }
    );
  }
}

/**
 * GET handler for webhook verification
 * Twilio doesn't use challenge-response like Meta, but this can be used for health checks
 */
export async function GET() {
  return NextResponse.json({
    status: "Twilio webhook endpoint active",
    url: "/api/webhook/twilio",
    method: "POST (form-encoded)",
  });
}
