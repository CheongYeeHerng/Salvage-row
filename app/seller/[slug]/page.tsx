import { notFound } from "next/navigation";
import Link from "next/link";
import { sellers, getSellerBySlug, averageRating } from "@/data/sellers";
import StarRating from "@/components/StarRating";

export function generateStaticParams() {
  return Object.values(sellers).map((s) => ({ slug: s.slug }));
}

export default function SellerPage({ params }: { params: { slug: string } }) {
  const seller = getSellerBySlug(params.slug);
  if (!seller) notFound();

  const rating = averageRating(seller.reviews);
  const sortedReviews = [...seller.reviews].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="max-w-2xl">
      <Link href="/" className="text-sm text-dust hover:text-rust transition-colors">
        ← Back to browse
      </Link>

      <div className="mt-4">
        <h1 className="font-display text-3xl">{seller.name}</h1>
        <div className="mt-2">
          <StarRating rating={rating} reviewCount={seller.reviews.length} size="text-base" />
        </div>
        <p className="text-sm text-dust mt-2">
          {seller.phone} · {seller.email}
        </p>
        <p className="text-xs text-dust mt-1">
          Simulated seller profile for this demo — contact details and reviews are not real.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl mb-4">
          Reviews from previously sold items ({sortedReviews.length})
        </h2>

        {sortedReviews.length === 0 ? (
          <p className="text-dust italic">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {sortedReviews.map((review) => (
              <li key={review.id} className="border border-dust-line bg-paper-dim/40 p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="font-medium">{review.itemName}</span>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm mt-2">{review.comment}</p>
                <p className="text-xs text-dust mt-2">
                  {review.reviewerName} ·{" "}
                  {new Date(review.date + "T00:00:00").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
