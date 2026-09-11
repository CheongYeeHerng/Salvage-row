import { catalogue } from "@/data/catalogue";
import BrowseView from "@/components/BrowseView";
import QaPanel from "@/components/QaPanel";

export default function HomePage() {
  return (
    <div>
      <div className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl leading-tight">
          One-of-a-kind secondhand finds, sold as-is and described honestly.
        </h1>
        <p className="mt-3 text-ink/70">
          Every listing here is seeded demo data from a handful of independent sellers — mostly
          single, used items. No account is needed to browse, search, or ask questions — this is
          a reviewer-facing demo, and checkout is simulated. Search in plain language below, or
          filter by category.
        </p>
      </div>

      <BrowseView initial={catalogue} />

      <div className="mt-12">
        <QaPanel />
      </div>
    </div>
  );
}
