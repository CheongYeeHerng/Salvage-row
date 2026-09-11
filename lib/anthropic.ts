const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-5";

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
 * Calls the Anthropic Messages API from the server only. ANTHROPIC_API_KEY is
 * read from the server environment and never sent to the browser. If the key
 * is missing or the call fails, callers should catch `usedFallback: true` and
 * use their own non-AI fallback so the demo still functions.
 */
export async function callClaude({
  system,
  user,
  maxTokens = 1024,
}: ClaudeCallOptions): Promise<ClaudeResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      text: "",
      usedFallback: true,
      error: "ANTHROPIC_API_KEY is not configured on the server.",
    };
  }

  try {
    const response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        ok: false,
        text: "",
        usedFallback: true,
        error: `Claude API returned ${response.status}: ${errText.slice(0, 300)}`,
      };
    }

    const data = await response.json();
    const text = (data.content ?? [])
      .filter((block: { type: string }) => block.type === "text")
      .map((block: { text: string }) => block.text)
      .join("\n")
      .trim();

    return { ok: true, text, usedFallback: false };
  } catch (err) {
    return {
      ok: false,
      text: "",
      usedFallback: true,
      error: err instanceof Error ? err.message : "Unknown error calling Claude API.",
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
