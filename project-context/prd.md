# PRD — GTM OS (v0)

**Version:** 0.3  
**Date:** September 30, 2025  
**Owner:** Engineering  
**Status:** Ready to build

---

## 1) Goal & Non-Goals

### 1.1 Goal (what v0 must do)

Ship a developer-first service where:

- **One API call** generates a ready-to-send multi-step **email** journey (subjects, bodies, spacing).
- **One API call** enrolls contacts into that journey and the platform sends on schedule.
- **One API call** (conversion event) stops all future sends for that contact in that journey.
- Email sending uses the **customer's Resend API key (BYO)**.

### 1.2 Non-Goals (v0 will not include)

- SMS/WhatsApp/push or multi-channel.
- Temporal/long-running workflow engine.
- Per-message LLM calls (LLM only at journey creation).
- Rich condition engine beyond simple "converted / engaged recently".
- UI. (Optional JSON previews only.)
- Deep analytics dashboards (we'll expose simple counts via JSON).

---

## 2) Target Users & Value

- **Who:** Seed/Series A B2B SaaS & dev tools where an engineer owns lifecycle emails.
- **Why valuable:**
    1. Skip copywriting + sequencing (AI creates 5–7 step journeys)
    2. Hosted scheduling with idempotency + stop-on-convert
    3. 10-minute integration, **no email infra** (they bring their **Resend** key)

---

## 3) Product Surface

### 3.1 Endpoints (v0)

1. **POST `/journeys`**  
    Creates a journey with fixed stages from a goal + audience.
    
    - **Body:** `{ goal, audience, options? }`
    - **Returns:** `{ journey_id, name, stages: [{ day, subject, body }] }`
    - **LLM:** single call at creation time via Vercel AI SDK.
2. **POST `/enrollments`**  
    Enrolls a contact into an existing journey.
    
    - **Body:** `{ journey_id, contact: { email, data? }, options?: { start_at?, test_mode? } }`
    - **Returns:** `{ enrollment_id, status: "active", next_run_at }`
    - **Test Mode:** When `test_mode: true`, creates message records but no actual sends. Stages progress in minutes not days.
3. **POST `/events`**  
    Records events; used at minimum for **`{ type: "conversion" }`** to stop sends.
    
    - **Body:** `{ type: "conversion" | "unsubscribe" | "open" | "click" | "custom", contact_email, journey_id?, enrollment_id?, metadata? }`
    - **Returns:** `{ event_id, accepted: true }`
4. **GET `/enrollments/:id/timeline`**  
    Returns messages + events merged chronologically (debug/support).
    
5. **GET `/journeys/:id/preview?contact=email@example.com`** (optional)  
    Returns the staged emails with merge-tags filled for a sample contact (no send).
    
6. **GET `/health`** (internal)  
    Returns counts of active enrollments, pending sends, error rate.
    

> Authentication for all endpoints via `X-API-Key` (our API key).  
> **BYO Resend** via either:
> 
> - `resend_api_key` stored on the **Account** (preferred), or
> - Header override `X-Resend-Key` per request (useful for testing).  
>     If both are present, header wins.

### 3.2 Email Compliance (v0 must)

- **List-Unsubscribe** header (mailto + HTTPS URL).
- Footer unsubscribe link (tokenized).
- Per-journey **suppression** list.
- Soft daily send caps per account.

### 3.3 Standard Error Format

All errors return consistent JSON:

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "The provided Resend API key is invalid",
    "details": { "key_suffix": "...abc123" }
  }
}
```

Error codes: `invalid_api_key`, `resend_auth_failed`, `rate_limit_exceeded`, `journey_not_found`, `duplicate_enrollment`, `llm_generation_failed`

---

## 4) User Flow (happy path)

1. Dev calls **`POST /journeys`** with `{goal, audience}` → gets `journey_id` and 5–7 staged emails.
2. Dev calls **`POST /enrollments`** for N contacts.
3. Scheduler sends stage 0 now (or at `start_at`), sets `next_run_at` for stage 1.
4. Their app calls **`POST /events { type:"conversion" }`** when user upgrades → we stop future sends immediately (≤ 60s).
5. Dev inspects **`GET /enrollments/:id/timeline`** if needed.

---

## 5) Architecture (v0)

**Stack:** Convex (HTTP + DB + Scheduler), **Vercel AI SDK** with **AI Gateway** (journey creation), Resend (sending; BYO key).

### 5.1 AI Integration Setup

**Dependencies:**

```json
{
  "ai": "^5.0.0",
  "@ai-sdk/openai": "^1.0.0",
  "zod": "^3.22.0"
}
```

**AI Configuration:**

```typescript
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// AI Gateway is automatically used when deployed on Vercel
// or can be explicitly configured with gateway() provider
```

**Journey Generation Schema:**

```typescript
const journeySchema = z.object({
  name: z.string().describe('A clear, descriptive name for the journey'),
  stages: z.array(
    z.object({
      day: z.number().describe('Day offset from enrollment (0 = immediate)'),
      subject: z.string().describe('Email subject line with merge tags like {{name}}'),
      body: z.string().describe('HTML email body with {{unsubscribe_url}} required')
    })
  ).min(5).max(7)
});

type JourneyStructure = z.infer<typeof journeySchema>;
```

### 5.2 Scheduler Loop (every minute)

```
select enrollments where status="active" and next_run_at <= now
  for each:
    if converted? -> status="completed"; continue
    stage = journey.stages[current_stage]
    
    # Send time windows (unless test_mode)
    if not test_mode and not within_send_window:
      next_run_at = next_9am; continue
    
    render = handlebars(stage.body, contact.data)
    subject = handlebars(stage.subject, contact.data)
    
    try:
      send via Resend (using account's Resend API key)
      record message row (idempotent per enrollment+stage)
    catch:
      retry with exponential backoff (1min, 5min, 15min)
      if all retries failed -> status="failed"
    
    if last stage -> status="completed"
    else:
      current_stage += 1
      next_run_at = now + wait_from(stage.day or cadence)
```

**Idempotency:** `(enrollment_id, stage)` unique key prevents duplicate sends.

**Stop-on-convert:** `/events` writes a `conversion` event; scheduler checks a cached flag or quick lookup.

**Error Handling:**

- Failed sends: Retry 3x with exponential backoff (1min, 5min, 15min)
- Invalid Resend key: Surface immediately at enrollment, status="failed"
- LLM failures: Retry once with Vercel AI SDK's built-in retry, then return default journey template
- Scheduler crashes: Idempotency ensures no duplicates on resume

**Send Windows:**

- Default: Send between 9am-5pm recipient timezone (if known)
- Fallback: 9am-5pm EST
- Override: enrollment `options.send_immediately=true`

**Operational Limits (v0):**

- Max 100 enrollments/second per account
- Max 10 journeys per account
- Max 10k active enrollments per journey
- Messages expire after 30 days (scheduler skips)
- Soft bounce: retry 3x, Hard bounce: mark failed

---

## 6) Data Model (Convex)

```ts
// accounts
{ _id, name, api_key, resend_api_key_encrypted?, plan, limits, usage, created_at }

// journeys
{ _id, account_id, name, goal, audience,
  stages: [{ day: number, subject: string, body: string }],
  is_active: boolean,
  stats: { total_enrolled: number, total_completed: number, total_converted: number },
  created_at
}

// enrollments (UNIQUE: account_id + journey_id + contact_email)
{ _id, account_id, journey_id, contact_email, contact_data: any,
  status: "active" | "completed" | "converted" | "removed" | "failed",
  current_stage: number, next_run_at: number, enrolled_at: number,
  test_mode: boolean, retry_count: number, last_error?: string
}

// messages (ledger)
{ _id, account_id, enrollment_id, journey_id, stage: number,
  subject: string, body: string, 
  status: "queued" | "sent" | "failed" | "test",
  sent_at?: number, external_id?: string,
  retry_count: number, error_detail?: string,
  template_version?: string, personalization_snapshot?: any
}

// events (timeline)
{ _id, account_id, contact_email, enrollment_id?, journey_id?,
  event_type: "conversion" | "unsubscribe" | "open" | "click" | "custom",
  metadata?: any, timestamp: number
}

// suppressions (per journey)
{ _id, account_id, journey_id, contact_email, reason, created_at }
```

**Indexes (minimal):**

- `enrollments`: by `account_id`, by `status`, by `next_run_at`, by `(account_id, journey_id, contact_email)` [UNIQUE].
- `messages`: by `enrollment_id`, by `journey_id`.
- `events`: by `(account_id, contact_email)`, by `enrollment_id`.
- `suppressions`: by `(journey_id, contact_email)`.

**Duplicate Prevention:**

- Unique constraint on `(account_id, journey_id, contact_email)`
- Return existing `enrollment_id` if duplicate attempted
- Optional: `force_new` flag to create new enrollment

---

## 7) LLM Usage with Vercel AI SDK

### 7.1 Journey Generation Implementation

**Single API call using Vercel AI SDK's `generateObject`:**

```typescript
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

async function generateJourney(goal: string, audience: string, emailCount = 5) {
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o'), // or 'openai/gpt-4o' with AI Gateway
      schema: journeySchema,
      prompt: `Create a ${emailCount}-email nurture journey for:
Goal: ${goal}
Audience: ${audience}

Requirements:
- Space emails progressively (e.g., day 0, 2, 5, 8, 12)
- Include merge tags: {{name}}, {{company}}
- Use clear, friendly B2B tone
- Each email must include {{unsubscribe_url}} in body
- Subject lines should be compelling and specific`,
      temperature: 0.7,
      maxRetries: 2, // Built-in retry handling
    });

    // Validate required tokens
    const valid = validateJourneyStructure(object);
    if (!valid) {
      throw new Error('Generated journey missing required tokens');
    }

    return object;
  } catch (error) {
    console.error('LLM generation failed:', error);
    // Fall back to default journey
    return DEFAULT_JOURNEY;
  }
}
```

### 7.2 Validation Rules

```typescript
function validateJourneyStructure(journey: JourneyStructure): boolean {
  // Check stage ordering
  for (let i = 1; i < journey.stages.length; i++) {
    if (journey.stages[i].day <= journey.stages[i - 1].day) {
      return false;
    }
  }

  // Check required tokens
  for (const stage of journey.stages) {
    if (!stage.body.includes('{{unsubscribe_url}}')) {
      return false;
    }
    if (!stage.subject || !stage.body) {
      return false;
    }
  }

  return true;
}
```

### 7.3 Default Journey Fallback

```typescript
const DEFAULT_JOURNEY: JourneyStructure = {
  name: "Standard Nurture",
  stages: [
    { 
      day: 0, 
      subject: "Welcome to {{company}}, {{name}}", 
      body: `<p>Hi {{name}},</p><p>Thanks for signing up...</p><p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>` 
    },
    { 
      day: 2, 
      subject: "Quick question, {{name}}", 
      body: `<p>Hi {{name}},</p><p>How's it going?...</p><p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>` 
    },
    { 
      day: 5, 
      subject: "Getting started with {{company}}", 
      body: `<p>Hi {{name}},</p><p>Here's how to...</p><p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>` 
    },
    { 
      day: 8, 
      subject: "See how others use {{company}}", 
      body: `<p>Hi {{name}},</p><p>Customer story...</p><p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>` 
    },
    { 
      day: 12, 
      subject: "Special offer for {{name}}", 
      body: `<p>Hi {{name}},</p><p>Limited time...</p><p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>` 
    }
  ]
};
```

### 7.4 AI Gateway Benefits

When deployed on Vercel or explicitly using AI Gateway:

- **Automatic failover** between multiple model providers
- **Usage analytics** and monitoring
- **Cost optimization** through intelligent routing
- **Rate limiting** and quota management

**Explicit Gateway Usage (optional):**

```typescript
import { gateway, generateObject } from 'ai';

const { object } = await generateObject({
  model: gateway('openai/gpt-4o'), // Routes through AI Gateway
  schema: journeySchema,
  prompt: '...',
});
```

---

## 8) BYO Resend: Handling & Security

- Store `resend_api_key_encrypted` per account using env-salted AEAD.
- **Validate key at enrollment time** by test-sending to Resend validation endpoint.
- Allow per-request override header `X-Resend-Key` for dev/testing.
- Never log full keys; redact to last 4.
- If key invalid at enrollment: Return immediate error, don't create enrollment.

**Sender identity:**

- v0 provides a default "sandbox" sender (we own) for quick start **or** lets the account pass `from` per journey.
- Docs show DNS steps to move to their domain later.

---

## 9) API Sketches

### 9.1 Create Journey

```http
POST /journeys
X-API-Key: acct_xxx
Content-Type: application/json

{
  "goal": "Convert trial users to paid",
  "audience": "B2B SaaS trials",
  "options": { "emails": 5 }
}
```

**200 OK**

```json
{
  "journey_id": "jrn_123",
  "name": "Trial → Paid (B2B)",
  "stages": [
    { "day": 0, "subject": "Welcome, {{name}}", "body": "<p>...</p>" },
    { "day": 2, "subject": "Set up in 2 mins", "body": "<p>...</p>" }
  ]
}
```

**500 Error (LLM failed, using fallback)**

```json
{
  "journey_id": "jrn_123",
  "name": "Standard Nurture",
  "stages": [...],
  "warning": {
    "code": "llm_generation_failed",
    "message": "AI generation failed, using default template",
    "details": { "fallback": true }
  }
}
```

### 9.2 Enroll Contact

```http
POST /enrollments
X-API-Key: acct_xxx
X-Resend-Key: re_xxx   // optional override
Content-Type: application/json

{
  "journey_id": "jrn_123",
  "contact": { "email": "sarah@techco.com", "data": { "name": "Sarah", "company": "TechCo" } },
  "options": { "test_mode": true }  // optional
}
```

**200 OK (new enrollment)**

```json
{
  "enrollment_id": "enr_456",
  "status": "active",
  "next_run_at": "2025-09-30T14:00:00Z",
  "test_mode": true
}
```

**200 OK (duplicate - returns existing)**

```json
{
  "enrollment_id": "enr_789",
  "status": "active",
  "existing": true,
  "enrolled_at": "2025-09-29T10:00:00Z"
}
```

**400 Error**

```json
{
  "error": {
    "code": "resend_auth_failed",
    "message": "Invalid Resend API key",
    "details": { "key_suffix": "...abc123" }
  }
}
```

### 9.3 Record Conversion

```http
POST /events
X-API-Key: acct_xxx
Content-Type: application/json

{ "type": "conversion", "contact_email": "sarah@techco.com", "journey_id": "jrn_123" }
```

---

## 10) Compliance & Tracking (minimal but real)

- **Unsubscribe:** tokenized link `/u/:token` → writes `events{unsubscribe}` + `suppressions` and halts future sends.
- **List-Unsubscribe:** `mailto:` + HTTPS link in headers.
- **Engagement:** wrap links through `/r/:msgId?url=...` to log `click`.
- **Opens:** optional pixel for `open` (best-effort).
- **Retention:** keep full bodies 90 days; keep subjects + hashes after.

---

## 11) Success Metrics & Monitoring

### 11.1 Success Metrics (for v0)

- **TTFV:** hello-world journey sent in **≤10 minutes** (cold start).
- **Reliability:** stop-on-convert takes **≤60s** from `/events` to suppression.
- **Throughput:** 10k enrollments/day with <1% duplicate/late sends.
- **Supportability:** 100% of incidents diagnosable via `/timeline`.
- **AI Success Rate:** ≥95% of journey generations succeed without fallback.

### 11.2 Critical Monitoring (Day 1)

```ts
// Must-have metrics from day 1:
{
  send_success_rate: messages.sent / messages.total,
  api_latency: { p50: 100ms, p95: 500ms, p99: 1000ms },
  llm_generation_success_rate: journeys.created / journeys.attempted,
  llm_fallback_rate: journeys.using_default / journeys.total,
  resend_errors_by_type: { auth: 0, rate_limit: 0, other: 0 },
  active_enrollments_count: enrollments.where(status="active").count,
  ai_gateway_usage: { requests: n, errors: n, latency_p95: ms }
}

// Implementation: Log to console with structured format
// Optional: Pipe to Axiom/Datadog (1 line setup)
```

---

## 12) Testing Plan

- **Unit:**
    - Zod schema validation for journey structure
    - Idempotent send (unique `(enrollment, stage)`)
    - Merge-tag fallbacks
    - Duplicate enrollment handling
- **Integration:**
    - Create journey with Vercel AI SDK → validate structure
    - Enroll 50 → scheduler sends 1st stage → fire 10 conversions → no further sends
    - Test AI Gateway failover (if configured)
- **Chaos:**
    - Kill scheduler mid-run; ensure no duplicates on resume
    - Simulate LLM failures; verify fallback to default journey
- **Compliance:** verify unsubscribe removes future sends within one cycle
- **BYO:** invalid Resend key surfaces actionable error at enrollment; header override works
- **Test Mode:** verify no actual sends, faster progression, message records created
- **AI Testing:**
    - Mock LLM responses for deterministic tests
    - Verify schema validation catches malformed AI outputs
    - Test retry logic on AI SDK errors

---

## 13) Delivery Plan (1–2 weeks)

**Day 1–2:** Schema + endpoints scaffolding + Vercel AI SDK setup + BYO Resend plumbing + duplicate prevention  
**Day 3–4:** Journey creation with `generateObject` + validation + fallback, scheduler loop, idempotency  
**Day 5:** Error handling, retry logic (including AI SDK retries), send windows  
**Day 6:** Unsubscribe + suppression + link redirect tracking  
**Day 7:** `/timeline`, `/preview`, `/health`, test mode  
**Day 8:** Monitoring setup (including AI Gateway metrics), operational limits, rate limiting  
**Day 9:** Docs + copy-paste snippets; sandbox sender; sample recipes  
**Day 10:** Design-partner pilots (3 accounts), fix list

---

## 14) Risks & Mitigations

- **Deliverability:** provide sandbox sender + daily cap; DKIM/SPF guide.
- **Scheduler drift / load spikes:** batch sends; per-account rate limit; exponential backoff on Resend errors.
- **PII safety:** redact keys; limited retention; encryption at rest for keys and contact data.
- **LLM variance:** strict Zod schema + validation; default journey on failure; built-in retries with Vercel AI SDK.
- **Duplicate enrollments:** unique constraint + return existing enrollment.
- **AI Gateway dependency:** fallback to direct OpenAI if gateway unavailable (automatic with AI SDK).
- **Token costs:** bounded by single generation per journey; consider caching common journey patterns.

---

## 15) Future Compatibility Note

- `enrollment_id` will remain stable for v1
- Journey structure may expand (backward compatible)
- API endpoints will be versioned if breaking changes needed
- Message history will be preserved
- Migration path to Temporal orchestration ready (workflow_id field exists)
- AI Gateway enables easy model switching (GPT-4 → Claude, etc.) without code changes

---

## 16) Nice-to-Have (post-v0)

- Per-message LLM personalization variants (A/B) using streaming `generateObject`
- More conditions (engaged_recently N days)
- SDK package
- Multi-channel + journey marketplace
- Temporal integration for complex workflows
- AI Gateway advanced features: A/B testing across models, cost optimization routing
- Structured output streaming for real-time journey preview during generation

---

## 17) Technology Stack Summary

### 17.1 Core Dependencies

```json
{
  "dependencies": {
    "convex": "^1.x.x",
    "ai": "^5.0.0",
    "@ai-sdk/openai": "^1.0.0",
    "zod": "^3.22.0",
    "resend": "^2.x.x",
    "handlebars": "^4.7.8"
  }
}
```

### 17.2 Environment Variables

```bash
# Convex
CONVEX_DEPLOYMENT=prod:gtm-os

# Vercel AI (AI Gateway automatically configured on Vercel)
OPENAI_API_KEY=sk-...

# Optional: Explicit AI Gateway config (if self-hosting)
VERCEL_AI_GATEWAY_URL=https://gateway.ai.vercel.com

# Encryption
ENCRYPTION_KEY=...
```

---

**Document Status:** Ready to Build  
**Version Notes:** Updated to use Vercel AI SDK with AI Gateway instead of direct OpenAI integration. Added Zod schema validation, improved error handling with SDK's built-in retries, and AI Gateway monitoring metrics.  
**Next Action:** Begin Day 1 implementation with Vercel AI SDK setup + schema validation