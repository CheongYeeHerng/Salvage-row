import Link from "next/link";
import { Item } from "@/data/catalogue";
import ItemIllustration from "./ItemIllustration";

export default function ItemCard({ item, reason }: { item: Item; reason?: string | null }) {
  return (
    <Link
      href={`/item/${item.id}`}
      className="group block border border-dust-line bg-paper-dim/40 hover:bg-paper-dim transition-colors"
    >
      <ItemIllustration category={item.category} className="w-full aspect-square" />
      <div className="p-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs tracking-wide text-dust">Lot {item.id}</span>
          <span className="text-xs text-dust">{item.category}</span>
        </div>
        <h3 className="font-display text-lg leading-snug mt-1 group-hover:text-rust transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-ink/60">
          {item.condition}
          {item.era ? ` · ${item.era}` : ""}
        </p>
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
