"use client";

import { useState } from "react";

export default function SimulatedPurchase({ name, price }: { name: string; price: number }) {
  const [status, setStatus] = useState<"idle" | "done">("idle");

  return (
    <div>
      {status === "idle" ? (
        <button
          onClick={() => setStatus("done")}
          className="px-5 py-2.5 bg-rust text-paper hover:bg-rust-dark transition-colors"
        >
          Buy for ${price}
        </button>
      ) : (
        <p className="border border-dust-line bg-paper-dim/60 px-4 py-3 text-sm">
          Order confirmed for <strong>{name}</strong>. This is a simulated purchase — no real
          payment method was charged and nothing ships.
        </p>
      )}
      <p className="text-xs text-dust mt-2">Simulated checkout — no real payment is processed.</p>
    </div>
  );
}
