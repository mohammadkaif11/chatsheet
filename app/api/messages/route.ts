import { NextRequest, NextResponse } from "next/server";
import { getMessages, MessageSource } from "@/lib/messageStore";

/**
 * GET handler to retrieve logged messages
 * Query params:
 *   - source: Filter by source ("meta" | "twilio")
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sourceParam = searchParams.get("source");

  // Filter by source if provided
  const source = sourceParam as MessageSource | undefined;
  const messages = getMessages(source);

  return NextResponse.json({
    messages,
    count: messages.length,
    source: source || "all",
  });
}

/**
 * DELETE handler to clear message history
 */
export async function DELETE() {
  const { clearMessages } = await import("@/lib/messageStore");
  clearMessages();
  return NextResponse.json({ success: true, message: "Messages cleared" });
}
