import { Condition } from "@/data/catalogue";

export const CONDITION_DEFINITIONS: Record<Condition, string> = {
  "Like new": "Little to no visible wear — often unused or barely used, no functional issues.",
  Good: "Some light wear from normal use, but clean and fully functional.",
  Fair: "Noticeable cosmetic wear or minor flaws; still usable as described in the listing.",
  "Well-worn": "Heavy, obvious wear from a lot of use — functional, but showing its age.",
};

const STYLES: Record<Condition, string> = {
  "Like new": "bg-[#2F6B46] text-paper",
  Good: "bg-denim text-paper",
  Fair: "bg-[#8C5A1E] text-paper",
  "Well-worn": "bg-[#8B2A2A] text-paper",
};

export default function ConditionTag({ condition }: { condition: Condition }) {
  return (
    <span
      className={`inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 ${STYLES[condition]}`}
    >
      {condition}
    </span>
  );
}
