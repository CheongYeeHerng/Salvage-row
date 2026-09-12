import { Condition } from "@/data/catalogue";

const STYLES: Record<Condition, string> = {
  "Like new": "bg-[#DCEAE0] text-[#2F5D3A]",
  Good: "bg-[#DCE4EC] text-[#2C4A63]",
  Fair: "bg-[#D9A441] text-[#3F2A05]",
  "Well-worn": "bg-[#EDD6D2] text-[#7E4324]",
};

export default function ConditionTag({ condition }: { condition: Condition }) {
  return (
    <span
      className={`inline-block text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 ${STYLES[condition]}`}
    >
      {condition}
    </span>
  );
}
