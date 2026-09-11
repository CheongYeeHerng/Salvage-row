"use client";

import { useState } from "react";

interface Turn {
  question: string;
  answer: string;
  mode?: string;
  error?: string;
}

const SUGGESTIONS = [
  "Which electronics have been tested and confirmed working?",
  "Compare the Trek bike and the skateboard for getting around town.",
  "What's the cheapest way to furnish a first apartment here?",
  "Where does the Polaroid camera come from, and has it been tested?",
];

export default function QaPanel() {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);

  async function ask(q: string) {
    const trimmed = q.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setQuestion("");
    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = await res.json();
      setTurns((t) => [
        ...t,
        { question: trimmed, answer: data.answer, mode: data.mode, error: data.error },
      ]);
    } catch {
      setTurns((t) => [
        ...t,
        {
          question: trimmed,
          answer: "The request failed before reaching the server. Please try again.",
          mode: "error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border border-dust-line bg-paper-dim/40 p-4 sm:p-6">
      <h2 className="font-display text-xl mb-1">Ask about the catalogue</h2>
      <p className="text-sm text-dust mb-4">
        Answers are grounded only in the listings above — it will say so when a fact isn&apos;t on file.
      </p>

      {turns.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="text-xs px-3 py-1 border border-dust-line hover:bg-paper-dim transition-colors text-left"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {turns.length > 0 && (
        <ol className="space-y-4 mb-4">
          {turns.map((t, i) => (
            <li key={i} className="border-t border-dust-line pt-3 first:border-t-0 first:pt-0">
              <p className="font-medium">{t.question}</p>
              <p className="text-sm mt-1 whitespace-pre-wrap">{t.answer}</p>
              {t.mode === "unavailable" && (
                <p className="text-xs text-rust-dark mt-1">
                  Simulated feature unavailable in this environment.
                </p>
              )}
              {t.error && (
                <p className="text-xs text-rust-dark mt-1 font-mono whitespace-pre-wrap break-words">
                  {t.error}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          type="text"
          placeholder="Ask a question about anything in the shop"
          className="flex-1 border border-dust-line bg-paper px-3 py-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-rust"
          aria-label="Ask a question about the catalogue"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-rust text-paper hover:bg-rust-dark transition-colors disabled:opacity-60"
        >
          {loading ? "Thinking…" : "Ask"}
        </button>
      </form>
    </section>
  );
}
