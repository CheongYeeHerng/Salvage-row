export default function StarRating({
  rating,
  reviewCount,
  size = "text-sm",
}: {
  rating: number;
  reviewCount?: number;
  size?: string;
}) {
  const clamped = Math.max(0, Math.min(5, rating));
  // Fill fraction (0–1) for each of the 5 stars, e.g. 4.25 -> [1, 1, 1, 1, 0.25]
  const fills = Array.from({ length: 5 }, (_, i) => Math.max(0, Math.min(1, clamped - i)));

  return (
    <span className={`inline-flex items-center gap-1.5 ${size}`}>
      <span className="inline-flex" aria-hidden>
        {fills.map((fill, i) => (
          <span key={i} className="relative inline-block leading-none">
            <span className="text-dust-line select-none">★</span>
            {fill > 0 && (
              <span
                className="absolute inset-0 overflow-hidden text-[#B98A2E] select-none"
                style={{ width: `${fill * 100}%` }}
              >
                ★
              </span>
            )}
          </span>
        ))}
      </span>
      <span className="sr-only">{rating.toFixed(1)} out of 5 stars</span>
      <span className="text-ink/60">
        {rating.toFixed(1)}
        {typeof reviewCount === "number" && ` (${reviewCount})`}
      </span>
    </span>
  );
}
