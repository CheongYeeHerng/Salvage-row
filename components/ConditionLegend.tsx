"use client";

import { useState } from "react";
import { Condition } from "@/data/catalogue";
import ConditionTag, { CONDITION_DEFINITIONS } from "./ConditionTag";

const ORDER: Condition[] = ["Like new", "Good", "Fair", "Well-worn"];

export default function ConditionLegend() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="text-xs text-dust underline hover:text-rust transition-colors"
      >
        {open ? "Hide" : "What do these conditions mean?"}
      </button>

      {open && (
        <dl className="mt-2 border border-dust-line bg-paper-dim/40 p-3 space-y-2 max-w-md">
          {ORDER.map((condition) => (
            <div key={condition} className="flex items-start gap-3">
              <dt className="shrink-0 pt-0.5">
                <ConditionTag condition={condition} />
              </dt>
              <dd className="text-sm text-ink/80">{CONDITION_DEFINITIONS[condition]}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
