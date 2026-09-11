import { Category } from "@/data/catalogue";

const STROKE = "#2B2620";
const FILL = "#3E5C76";

function Furniture() {
  return (
    <>
      <rect x="22" y="30" width="56" height="34" fill={FILL} fillOpacity={0.5} stroke={STROKE} strokeWidth="1.5" />
      <path d="M26 64 L26 82 M74 64 L74 82" stroke={STROKE} strokeWidth="2.5" />
      <path d="M22 30 L22 20 M78 30 L78 20" stroke={STROKE} strokeWidth="2.5" />
      <line x1="22" y1="46" x2="78" y2="46" stroke={STROKE} strokeWidth="1" opacity={0.6} />
    </>
  );
}

function Electronics() {
  return (
    <>
      <rect x="18" y="28" width="64" height="40" rx="2" fill={FILL} fillOpacity={0.5} stroke={STROKE} strokeWidth="1.5" />
      <rect x="26" y="35" width="48" height="26" fill="none" stroke={STROKE} strokeWidth="1.2" />
      <circle cx="30" cy="72" r="3" fill="none" stroke={STROKE} strokeWidth="1.2" />
      <circle cx="70" cy="72" r="3" fill="none" stroke={STROKE} strokeWidth="1.2" />
      <path d="M40 72 L60 72" stroke={STROKE} strokeWidth="1.2" />
    </>
  );
}

function Clothing() {
  return (
    <>
      <path d="M50 24 L38 32 L30 28 L20 40 L30 46 L30 84 L70 84 L70 46 L80 40 L70 28 L62 32 Z"
        fill={FILL} fillOpacity={0.5} stroke={STROKE} strokeWidth="1.5" />
      <circle cx="50" cy="20" r="4" fill="none" stroke={STROKE} strokeWidth="1.5" />
      <path d="M50 24 L50 20" stroke={STROKE} strokeWidth="1.5" />
    </>
  );
}

function Books() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={22 + i * 14}
          y={30 + (i % 2 === 0 ? 0 : 6)}
          width="12"
          height={54 - (i % 2 === 0 ? 0 : 6)}
          fill={FILL}
          fillOpacity={0.45 + i * 0.06}
          stroke={STROKE}
          strokeWidth="1.3"
        />
      ))}
    </>
  );
}

function Kitchenware() {
  return (
    <>
      <path d="M32 40 Q32 30 50 30 Q68 30 68 40 L64 78 L36 78 Z" fill={FILL} fillOpacity={0.5} stroke={STROKE} strokeWidth="1.5" />
      <path d="M68 45 Q84 45 84 58 Q84 68 70 66" fill="none" stroke={STROKE} strokeWidth="2" />
      <line x1="36" y1="52" x2="64" y2="52" stroke={STROKE} strokeWidth="1" opacity={0.6} />
    </>
  );
}

function Tools() {
  return (
    <>
      <rect x="45" y="16" width="10" height="50" rx="2" fill={FILL} fillOpacity={0.5} stroke={STROKE} strokeWidth="1.5" transform="rotate(35 50 50)" />
      <circle cx="30" cy="76" r="12" fill="none" stroke={STROKE} strokeWidth="2.5" />
      <path d="M30 68 L30 84 M22 76 L38 76" stroke={STROKE} strokeWidth="2" />
    </>
  );
}

function ToysGames() {
  return (
    <>
      <rect x="26" y="26" width="24" height="24" rx="3" fill={FILL} fillOpacity={0.5} stroke={STROKE} strokeWidth="1.5" />
      <circle cx="34" cy="34" r="1.8" fill={STROKE} />
      <circle cx="42" cy="42" r="1.8" fill={STROKE} />
      <circle cx="34" cy="42" r="1.8" fill={STROKE} />
      <circle cx="42" cy="34" r="1.8" fill={STROKE} />
      <rect x="52" y="52" width="24" height="24" rx="3" fill={FILL} fillOpacity={0.35} stroke={STROKE} strokeWidth="1.5" />
      <circle cx="64" cy="64" r="1.8" fill={STROKE} />
    </>
  );
}

function OutdoorBikes() {
  return (
    <>
      <circle cx="30" cy="68" r="16" fill="none" stroke={STROKE} strokeWidth="2" />
      <circle cx="70" cy="68" r="16" fill="none" stroke={STROKE} strokeWidth="2" />
      <circle cx="30" cy="68" r="2" fill={STROKE} />
      <circle cx="70" cy="68" r="2" fill={STROKE} />
      <path d="M30 68 L48 34 L70 68 M40 50 L60 50 M48 34 L58 34" stroke={STROKE} strokeWidth="2" fill="none" />
    </>
  );
}

export default function ItemIllustration({
  category,
  className = "",
}: {
  category: Category;
  className?: string;
}) {
  const inner =
    category === "Furniture" ? (
      <Furniture />
    ) : category === "Electronics" ? (
      <Electronics />
    ) : category === "Clothing" ? (
      <Clothing />
    ) : category === "Books & Media" ? (
      <Books />
    ) : category === "Kitchenware" ? (
      <Kitchenware />
    ) : category === "Tools" ? (
      <Tools />
    ) : category === "Toys & Games" ? (
      <ToysGames />
    ) : (
      <OutdoorBikes />
    );

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={`${category} illustration`}>
      <rect x="0" y="0" width="100" height="100" fill="#E6D9BE" />
      {inner}
    </svg>
  );
}
