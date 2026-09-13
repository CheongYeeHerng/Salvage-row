export default function StarRating({
  rating,
  reviewCount,
  size = "text-sm",
}: {
  rating: number;
  reviewCount?: number;
  size?: string;
}) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));

  return (
    <span className={`inline-flex items-center gap-1.5 ${size}`}>
      <span className="relative inline-block leading-none" style={{ width: "5.5em" }}>
        <span className="text-dust-line select-none" aria-hidden>
          ★★★★★
        </span>
        <span
          className="absolute inset-0 overflow-hidden text-[#B98A2E] select-none"
          style={{ width: `${pct}%` }}
          aria-hidden
        >
          ★★★★★
        </span>
      </span>
      <span className="sr-only">{rating.toFixed(1)} out of 5 stars</span>
      <span className="text-ink/60">
        {rating.toFixed(1)}
        {typeof reviewCount === "number" && ` (${reviewCount})`}
      </span>
    </span>
  );
}
