// Shared message store for all WhatsApp integrations (Meta, Twilio, etc.)

export type MessageSource = "meta" | "twilio";

export interface MessageEntry {
  id: string;
  timestamp: string;
  source: MessageSource;
  from: string;
  to: string;
  body: string;
  type: string;
  raw: unknown;
  mediaUrl?: string;
  numMedia?: number;
}

// In-memory storage (use Redis/DB in production)
const messageLog: MessageEntry[] = [];
const MAX_MESSAGES = 100;

export function addMessage(entry: Omit<MessageEntry, "id" | "timestamp">): MessageEntry {
  const newEntry: MessageEntry = {
    ...entry,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };

  messageLog.push(newEntry);

  // Evict oldest if over limit
  if (messageLog.length > MAX_MESSAGES) {
    messageLog.shift();
  }

  return newEntry;
}

export function getMessages(source?: MessageSource): MessageEntry[] {
  let messages = [...messageLog].reverse();

  if (source) {
    messages = messages.filter((m) => m.source === source);
  }

  return messages;
}

export function getMessageCount(): number {
  return messageLog.length;
}

export function clearMessages(): void {
  messageLog.length = 0;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
