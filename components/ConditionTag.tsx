import { Condition } from "@/data/catalogue";

const STYLES: Record<Condition, string> = {
  "Like new": "bg-[#2F6B46] text-paper",
  Good: "bg-denim text-paper",
  Fair: "bg-[#8C5A1E] text-paper",
  "Well-worn": "bg-rust-dark text-paper",
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
