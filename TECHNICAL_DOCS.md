# WhatsApp Webhook Technical Documentation

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   WhatsApp      │────▶│   Meta Cloud    │────▶│   Your Ngrok    │
│   User Phone    │     │   API/Webhooks  │     │   Tunnel        │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                              ┌──────────────────────────┘
                              ▼
                    ┌─────────────────┐
                    │  Next.js App    │
                    │  Port 3000      │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌────────────┐ ┌────────────┐ ┌────────────┐
       │  GET /api  │ │ POST /api  │ │  Memory    │
       │  /webhook  │ │ /webhook   │ │  Storage   │
       │ (Verify)   │ │ (Receive)  │ │  (Array)   │
       └────────────┘ └────────────┘ └────────────┘
```

## Webhook Flow

### 1. Registration Flow (One-time Setup)

When you configure the webhook URL in Meta Developer Console:

```
Meta Console ──GET──▶ https://your-url/api/webhook
                       ?hub.mode=subscribe
                       &hub.verify_token=xxx
                       &hub.challenge=random_string

Your Server ──200──▶ Returns hub.challenge (proves ownership)
```

**Code Flow:**
```typescript
// GET /api/webhook
if (mode === "subscribe" && token === VERIFY_TOKEN) {
  return new Response(challenge, { status: 200 }); // Success
}
return 403; // Failed
```

### 2. Incoming Message Flow (Real-time)

Every time someone sends a message to your WhatsApp number:

```
User Message ──▶ Meta Servers ──POST──▶ Your Webhook
                                          /api/webhook
                                         {
                                           "entry": [{
                                             "changes": [{
                                               "value": {
                                                 "messages": [...],
                                                 "contacts": [...]
                                               }
                                             }]
                                           }]
                                         }

Your Server ──200──▶ Meta (acknowledgment)
     │
     ▼
Store in Memory Array
     │
     ▼
Dashboard polls /api/messages every 3s
```

## Request/Response Lifecycle

### Webhook Verification Request (GET)

| Parameter | Description | Example |
|-----------|-------------|---------|
| `hub.mode` | Always "subscribe" | `subscribe` |
| `hub.verify_token` | Your secret token | `my_secret_123` |
| `hub.challenge` | Random string to echo | `9487123654` |

**Success Response:**
```
HTTP 200 OK
Body: 9487123654 (echo the challenge)
```

**Failure Response:**
```
HTTP 403 Forbidden
Body: { "error": "Verification failed" }
```

### Incoming Message Payload (POST)

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "BUSINESS_ACCOUNT_ID",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "15551234567",
              "phone_number_id": "PHONE_NUMBER_ID"
            },
            "contacts": [
              {
                "profile": { "name": "John Doe" },
                "wa_id": "1234567890"
              }
            ],
            "messages": [
              {
                "from": "1234567890",
                "id": "MESSAGE_ID",
                "timestamp": "1698234567",
                "type": "text",
                "text": { "body": "Hello there!" }
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

## Data Structures

### Message Types & Payloads

```typescript
// Text Message
{
  type: "text",
  text: { body: "Hello World" }
}

// Image Message
{
  type: "image",
  image: {
    caption: "Optional caption",
    mime_type: "image/jpeg",
    sha256: "hash",
    id: "MEDIA_ID"
  }
}

// Location Message
{
  type: "location",
  location: {
    latitude: 37.7749,
    longitude: -122.4194,
    name: "San Francisco",
    address: "CA, USA"
  }
}

// Document Message
{
  type: "document",
  document: {
    filename: "report.pdf",
    mime_type: "application/pdf",
    id: "MEDIA_ID"
  }
}

// Interactive (Button/List Reply)
{
  type: "interactive",
  interactive: {
    type: "button_reply",
    button_reply: {
      id: "button_1",
      title: "Yes"
    }
  }
}
```

### Status Updates

```json
{
  "statuses": [
    {
      "id": "MESSAGE_ID",
      "recipient_id": "1234567890",
      "status": "delivered",
      "timestamp": "1698234567"
    }
  ]
}
```

Status values: `sent`, `delivered`, `read`, `failed`

## Code Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     INCOMING REQUEST                             │
└─────────────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
           ▼                               ▼
    ┌─────────────┐                 ┌─────────────┐
    │   GET       │                 │    POST     │
    │  /webhook   │                 │   /webhook  │
    └──────┬──────┘                 └──────┬──────┘
           │                               │
           ▼                               ▼
    ┌─────────────┐                 ┌─────────────┐
    │ Validate    │                 │ Parse JSON  │
    │ hub.mode    │                 │ Body        │
    └──────┬──────┘                 └──────┬──────┘
           │                               │
           ▼                               ▼
    ┌─────────────┐                 ┌─────────────┐
    │ Compare     │                 │ Extract     │
    │ verify_token│                 │ entry[]     │
    └──────┬──────┘                 └──────┬──────┘
           │                               │
           ▼                               ▼
    ┌─────────────┐                 ┌─────────────┐
    │ Return      │                 │ Iterate     │
    │ challenge   │                 │ changes[]   │
    └──────┬──────┘                 └──────┬──────┘
           │                               │
           ▼                               ▼
    ┌─────────────┐                 ┌─────────────┐
    │  200 OK     │                 │ Process     │
    │             │                 │ messages[]  │
    └─────────────┘                 └──────┬──────┘
                                           │
                              ┌────────────┼────────────┐
                              ▼            ▼            ▼
                         ┌────────┐  ┌────────┐  ┌────────┐
                         │  Text  │  │ Image  │  │Location│
                         └───┬────┘  └───┬────┘  └───┬────┘
                             │           │           │
                             ▼           ▼           ▼
                         ┌────────────────────────────────┐
                         │    Log to messageLog Array     │
                         │    (Max 100 entries)           │
                         └───────────────┬────────────────┘
                                         │
                                         ▼
                              ┌────────────────────┐
                              │   Return 200 OK    │
                              │ (Acknowledge to    │
                              │  Meta)             │
                              └────────────────────┘
```

## Memory Storage

```typescript
// In-memory array stores last 100 messages
const messageLog: Array<{
  timestamp: string;  // ISO 8601
  data: WebhookPayload;
}> = [];

// FIFO eviction when limit reached
if (messageLog.length > 100) {
  messageLog.shift(); // Remove oldest
}

// API returns reversed (newest first)
return [...messageLog].reverse();
```

**Note:** This is volatile storage. Restarting the server clears history. For production, use Redis/Database.

## Dashboard Polling Mechanism

```
Browser ──GET /api/messages──▶ Server
                                  │
                                  ▼
                         Return messageLog
                                  │
Browser ◀──JSON Response──────────┘
    │
    ▼
Render Message List
    │
    └─ Wait 3 seconds ─┐
                       │
    ◀── Loop back ─────┘
```

```typescript
// Frontend polling logic
useEffect(() => {
  const interval = setInterval(fetchMessages, 3000);
  return () => clearInterval(interval);
}, []);
```

## Sending Messages (Outbound)

```
Client ──POST /api/send──▶ Server
{
  "to": "1234567890",
  "message": "Hello!"
}
                              │
                              ▼
                    ┌─────────────────┐
                    │ Build Payload   │
                    │                 │
                    │ {               │
                    │   messaging_    │
                    │   product:      │
                    │   "whatsapp",   │
                    │   to: "...",    │
                    │   text: {...}   │
                    │ }               │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ POST to Graph   │
                    │ API             │
                    │                 │
                    │ /v18.0/{phone_  │
                    │ number_id}/     │
                    │ messages        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Bearer Token    │
                    │ Auth            │
                    └────────┬────────┘
                             │
                             ▼
                         Meta API
                             │
                             ▼
                    ┌─────────────────┐
                    │ WhatsApp        │
                    │ Delivered to    │
                    │ User            │
                    └─────────────────┘
```

## Security Considerations

### 1. Verify Token Validation
- Meta sends verify_token during setup
- Must match exactly with `WHATSAPP_VERIFY_TOKEN` env var
- Prevents unauthorized webhook registrations

### 2. Always Return 200 OK
- Even on processing errors, return 200
- Prevents Meta from retrying and flooding

```typescript
try {
  processWebhook(body);
} catch (error) {
  console.error(error);
  // Still return 200
}
return NextResponse.json({ success: true });
```

### 3. HTTPS Required
- Meta rejects HTTP webhook URLs
- ngrok provides HTTPS tunnel for local dev

### 4. Access Token Security
- Store in environment variables
- Never commit to git
- Rotate tokens periodically

## Error Handling

| Scenario | Action | Response |
|----------|--------|----------|
| Invalid verify_token | Log, reject | 403 Forbidden |
| Invalid JSON body | Log error | 200 OK (prevent retry) |
| Processing error | Log stack trace | 200 OK (prevent retry) |
| Missing env vars | Return config error | 500 Server Error |
| Graph API error | Log, propagate | Forward API status |

## Scaling Considerations

### Current Limitations
1. **Single Instance**: In-memory storage doesn't sync across instances
2. **No Persistence**: Data lost on restart
3. **Polling**: Inefficient at scale (use WebSockets/SSE)
4. **No Rate Limiting**: Vulnerable to spam

### Production Recommendations

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Load      │────▶│   Redis     │◄────│   Worker    │
│   Balancer  │     │   Queue     │     │   Process   │
└──────┬──────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  Next.js    │────▶│  PostgreSQL │
│  API Route  │     │  Database   │
└─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  WebSocket  │
                    │  Server     │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    ▼             ▼
               [Client 1]   [Client 2]
```

Replace polling with:
- **Redis** for message queue
- **PostgreSQL/MongoDB** for persistence
- **WebSockets/SSE** for real-time updates
- **Bull/Agenda** for background job processing

## File Structure Reference

```
app/
├── api/
│   ├── webhook/
│   │   └── route.ts          # Main webhook handler
│   │       ├── GET()         # Verification
│   │       └── POST()        # Message receiving
│   ├── messages/
│   │   └── route.ts          # Retrieval API
│   │       └── GET()         # Return messageLog
│   └── send/
│       └── route.ts          # Outbound messaging
│           └── POST()        # Send via Graph API
├── page.tsx                  # Dashboard UI
│   ├── fetchMessages()       # Polling logic
│   ├── getMessagePreview()   # Type parser
│   └── getSenderInfo()       # Contact extraction
└── layout.tsx                # Root layout
```

## API Reference

### GET /api/webhook
Verifies webhook with Meta. Called once during setup.

**Query Parameters:**
- `hub.mode` - Must be "subscribe"
- `hub.verify_token` - Must match env var
- `hub.challenge` - String to echo back

### POST /api/webhook
Receives all webhook events from Meta.

**Headers:**
- `Content-Type: application/json`

**Body:** WhatsApp webhook payload (see Message Types above)

**Response:** Always 200 OK

### GET /api/messages
Returns recent messages for dashboard.

**Response:**
```json
{
  "messages": [
    {
      "timestamp": "2024-01-15T10:30:00Z",
      "data": { /* webhook payload */ }
    }
  ]
}
```

### POST /api/send
Sends a WhatsApp message.

**Body:**
```json
{
  "to": "1234567890",
  "message": "Hello!",
  "type": "text"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* Graph API response */ }
}
```
