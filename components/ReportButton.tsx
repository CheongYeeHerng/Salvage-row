"use client";

import { useState } from "react";

const REASONS = ["Wrong information", "Suspected scam", "Other"] as const;
type Reason = (typeof REASONS)[number];

export default function ReportButton({ itemId }: { itemId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<Reason>("Wrong information");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submitReport() {
    setStatus("sending");
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, reason, details }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-sm border border-dust-line bg-paper-dim/60 px-4 py-3">
        Report submitted. In this demo it isn&apos;t reviewed by anyone — see{" "}
        <a href="/notes" className="underline hover:text-rust">
          /notes
        </a>{" "}
        for what a real version would need.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-dust underline hover:text-rust transition-colors"
      >
        Report wrong info or a scam
      </button>
    );
  }

  return (
    <div className="border border-dust-line bg-paper-dim/40 p-4 text-sm">
      <p className="font-medium mb-2">Report this listing</p>

      <fieldset className="space-y-1 mb-3">
        <legend className="sr-only">Reason for report</legend>
        {REASONS.map((r) => (
          <label key={r} className="flex items-center gap-2">
            <input
              type="radio"
              name="report-reason"
              value={r}
              checked={reason === r}
              onChange={() => setReason(r)}
            />
            {r}
          </label>
        ))}
      </fieldset>

      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Optional details — what looks wrong or suspicious?"
        rows={3}
        className="w-full border border-dust-line bg-paper px-3 py-2 mb-3 focus:outline-none focus-visible:outline-2 focus-visible:outline-rust"
      />

      <div className="flex gap-2 items-center">
        <button
          onClick={submitReport}
          disabled={status === "sending"}
          className="px-4 py-2 bg-denim text-paper hover:bg-denim-dark transition-colors disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Submit report"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="px-4 py-2 border border-dust-line hover:bg-paper-dim transition-colors"
        >
          Cancel
        </button>
      </div>
      {status === "error" && (
        <p className="text-rust-dark text-xs mt-2">
          The report didn&apos;t go through. Please try again.
        </p>
      )}
    </div>
  );
}
