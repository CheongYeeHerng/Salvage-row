/**
 * This app is deployed behind a class-provided gateway that does not expose
 * the Anthropic Messages API directly (Claude routes on the gateway itself
 * return 403 for student keys). The supported path to a Claude model is the
 * gateway's OpenRouter-compatible endpoint, using OpenAI-style chat
 * completions request/response shapes. See /notes for details.
 */
const GATEWAY_BASE_URL =
  process.env.GATEWAY_BASE_URL?.replace(/\/+$/, "") ??
  "https://174.138.16.223/openrouter/v1";
const CHAT_COMPLETIONS_URL = `${GATEWAY_BASE_URL}/chat/completions`;
const MODEL = process.env.GATEWAY_MODEL ?? "anthropic/claude-3.5-sonnet";

interface ClaudeCallOptions {
  system: string;
  user: string;
  maxTokens?: number;
}

export interface ClaudeResult {
  ok: boolean;
  text: string;
  /** true if we fell back to the non-AI path because no key was configured or the call failed */
  usedFallback: boolean;
  error?: string;
}

/**
 * Calls a Claude model through the gateway's OpenRouter-compatible chat
 * completions endpoint, from the server only. The gateway key is read from
 * the server environment and never sent to the browser. If the key is
 * missing or the call fails, callers should catch `usedFallback: true` and
 * use their own non-AI fallback so the demo still functions.
 */
export async function callClaude({
  system,
  user,
  maxTokens = 1024,
}: ClaudeCallOptions): Promise<ClaudeResult> {
  const apiKey = process.env.GATEWAY_API_KEY ?? process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      text: "",
      usedFallback: true,
      error:
        "No gateway key configured on the server (checked GATEWAY_API_KEY and ANTHROPIC_API_KEY).",
    };
  }

  try {
    const response = await fetch(CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        ok: false,
        text: "",
        usedFallback: true,
        error: `Gateway returned ${response.status} from ${CHAT_COMPLETIONS_URL}: ${errText.slice(0, 400)}`,
      };
    }

    const data = await response.json();
    const text: string = data?.choices?.[0]?.message?.content ?? "";

    if (!text) {
      return {
        ok: false,
        text: "",
        usedFallback: true,
        error: `Gateway responded 200 but no message content was found. Raw shape: ${JSON.stringify(data).slice(0, 400)}`,
      };
    }

    return { ok: true, text: text.trim(), usedFallback: false };
  } catch (err) {
    return {
      ok: false,
      text: "",
      usedFallback: true,
      error:
        err instanceof Error
          ? `Network/fetch error calling gateway: ${err.message}`
          : "Unknown error calling the gateway.",
    };
  }
}

/** Strips ```json fences etc. and parses the model's JSON response defensively. */
export function parseJsonLoose<T>(raw: string): T | null {
  const cleaned = raw
    .trim()
    .replace(/^```(json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // try to salvage the first {...} or [...] block
    const match = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}
