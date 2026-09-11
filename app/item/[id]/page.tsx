import { notFound } from "next/navigation";
import Link from "next/link";
import { catalogue, getItem } from "@/data/catalogue";
import ItemIllustration from "@/components/ItemIllustration";
import SimulatedPurchase from "@/components/SimulatedPurchase";
import ReportButton from "@/components/ReportButton";

export function generateStaticParams() {
  return catalogue.map((p) => ({ id: p.id }));
}

export default function ItemPage({ params }: { params: { id: string } }) {
  const item = getItem(params.id);
  if (!item) notFound();

  const listedDate = new Date(item.listedAt + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const facts: [string, string][] = [
    ["Price", `$${item.price}`],
    ["Category", item.category],
    ["Condition", item.condition],
    ["Listed", listedDate],
    ["Brand", item.brand ?? "Not noted by seller"],
    ["Era", item.era ?? "Not noted by seller"],
    [
      "Tested / verified working",
      item.verifiedWorking === null
        ? "Not tested or verified by seller"
        : item.verifiedWorking
        ? "Yes"
        : "No",
    ],
    ["Original retail price", item.originalPrice ? `$${item.originalPrice}` : "Unknown"],
    ["Material", item.material ?? "Not noted by seller"],
    ["Sold by", item.seller],
    ["Quantity", `${item.stock} available`],
  ];

  return (
    <div>
      <Link href="/" className="text-sm text-dust hover:text-rust transition-colors">
        ← Back to browse
      </Link>

      <div className="mt-4 grid sm:grid-cols-2 gap-8">
        <ItemIllustration category={item.category} className="w-full aspect-square border border-dust-line" />

        <div>
          <span className="text-xs text-dust">Lot {item.id}</span>
          <h1 className="font-display text-3xl mt-1">{item.name}</h1>
          <p className="text-ink/60">
            {item.condition}
            {item.era ? ` · ${item.era}` : ""}
          </p>

          <p className="mt-4 text-ink/80">{item.description}</p>

          <dl className="mt-6 border-t border-dust-line">
            {facts.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-dust-line py-2 text-sm">
                <dt className="text-dust">{label}</dt>
                <dd className="text-right">{value}</dd>
              </div>
            ))}
          </dl>

          <SimulatedPurchase name={item.name} price={item.price} />

          <div className="mt-4">
            <ReportButton itemId={item.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
