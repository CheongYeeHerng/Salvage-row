import Link from "next/link";
import { Item } from "@/data/catalogue";
import ItemIllustration from "./ItemIllustration";
import ConditionTag from "./ConditionTag";

export default function ItemCard({ item, reason }: { item: Item; reason?: string | null }) {
  return (
    <Link
      href={`/item/${item.id}`}
      className="group block border border-dust-line bg-paper-dim/40 hover:bg-paper-dim transition-colors"
    >
      <ItemIllustration category={item.category} className="w-full aspect-square" />
      <div className="p-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs tracking-wide text-dust truncate min-w-0" title={item.seller}>
            {item.seller}
          </span>
          <span className="text-xs text-dust shrink-0">{item.category}</span>
        </div>
        <h3 className="font-display text-lg leading-snug mt-1 group-hover:text-rust transition-colors">
          {item.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <ConditionTag condition={item.condition} />
          {item.era && <span className="text-xs text-ink/50">{item.era}</span>}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-base">${item.price}</span>
          {item.stock > 1 && <span className="text-xs text-dust">{item.stock} available</span>}
        </div>
        {reason && (
          <p className="mt-2 text-xs text-rust-dark border-t border-dust-line pt-2">{reason}</p>
        )}
      </div>
    </Link>
  );
}
