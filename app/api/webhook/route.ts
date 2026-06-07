import { NextRequest, NextResponse } from "next/server";
import { addMessage, getMessages } from "@/lib/messageStore";

/**
 * GET handler for webhook verification
 * Meta sends a challenge that we must echo back to verify the endpoint
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");


  console.log(process.env.WHATSAPP_VERIFY_TOKEN)
  // Verify the mode and token
  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("Webhook verified successfully");
    return new Response(challenge, { status: 200 });
  }

  console.error("Webhook verification failed", { mode, token });
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

/**
 * POST handler for receiving webhook events
 * Meta sends message events, status updates, etc.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Meta webhook received:", JSON.stringify(body, null, 2));

    // Process different entry types
    if (body.entry) {
      for (const entry of body.entry) {
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.value?.messages) {
              for (const message of change.value.messages) {
                await handleIncomingMessage(message, change.value);
              }
            }

            // Handle message statuses (sent, delivered, read)
            if (change.value?.statuses) {
              for (const status of change.value.statuses) {
                console.log(`Message ${status.id} status: ${status.status}`);
              }
            }
          }
        }
      }
    }

    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    // Still return 200 to prevent Meta from retrying
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

async function handleIncomingMessage(
  message: Record<string, unknown>,
  value: Record<string, unknown>
) {
  const contact = (value.contacts as Record<string, unknown>[])?.[0];
  const phoneNumber = (contact?.wa_id as string) || (message.from as string) || "unknown";
  const name = (contact?.profile as Record<string, string>)?.name || "Unknown";

  // Extract message body based on type
  let body = "";
  let mediaUrl: string | undefined;
  const msgType = message.type as string;

  switch (msgType) {
    case "text": {
      body = (message.text as Record<string, string>)?.body || "";
      break;
    }
    case "image": {
      body = (message.image as Record<string, string>)?.caption || "🖼️ Image";
      // Media ID would need to be fetched from Meta's media API
      break;
    }
    case "audio": {
      body = "🎵 Audio message";
      break;
    }
    case "video": {
      body = "📹 Video";
      break;
    }
    case "document": {
      body = `📄 ${(message.document as Record<string, string>)?.filename || "Document"}`;
      break;
    }
    case "location": {
      const loc = message.location as Record<string, number>;
      body = `📍 Location: ${loc?.latitude}, ${loc?.longitude}`;
      break;
    }
    case "button": {
      body = `🔘 Button: ${(message.button as Record<string, string>)?.text || ""}`;
      break;
    }
    case "interactive": {
      body = "📱 Interactive response";
      break;
    }
    default:
      body = `[${msgType}]`;
  }

  // Add to shared message store
  const metadata = value.metadata as Record<string, string> | undefined;
  addMessage({
    source: "meta",
    from: phoneNumber,
    to: metadata?.display_phone_number || "unknown",
    body,
    type: msgType,
    raw: { message, value, contact },
    mediaUrl,
  });

  console.log(`Meta ${msgType} message from ${name} (${phoneNumber}): ${body}`);
}

// Export for use in other routes (backward compatibility)
export function getMessageLog() {
  return getMessages("meta");
}
