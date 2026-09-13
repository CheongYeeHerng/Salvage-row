import { catalogue, Item } from "@/data/catalogue";
import { getSellerContact, getSellerByName, averageRating } from "@/data/sellers";

/** A compact JSON representation of the catalogue, small enough to pass in full as prompt context. */
export function catalogueContext(): string {
  const compact = catalogue.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    condition: p.condition,
    brand: p.brand ?? null, // null means the seller didn't note a brand
    era: p.era ?? null, // null means the seller didn't note an era/date
    verifiedWorking: p.verifiedWorking, // null means not tested/verified by the seller
    originalPrice: p.originalPrice ?? null, // null means original retail price is unknown
    material: p.material ?? null,
    stock: p.stock,
    seller: p.seller,
    sellerContact: getSellerContact(p.seller) ?? null,
    sellerRating: (() => {
      const profile = getSellerByName(p.seller);
      return profile
        ? { average: Math.round(averageRating(profile.reviews) * 10) / 10, reviewCount: profile.reviews.length }
        : null;
    })(),
    listedAt: p.listedAt,
    description: p.description,
  }));
  return JSON.stringify(compact, null, 0);
}

/**
 * A simple, deterministic keyword scorer used when no API key is configured
 * or a Claude call fails. It's intentionally naive (no synonyms, no intent
 * parsing) — see /notes for why the AI path is the primary implementation.
 */
export function keywordFallbackSearch(query: string, limit = 12): Item[] {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9']+/)
    .filter(Boolean);

  if (terms.length === 0) return catalogue.slice(0, limit);

  const scored = catalogue.map((p) => {
    const haystack = [
      p.name,
      p.category,
      p.condition,
      p.brand ?? "",
      p.era ?? "",
      p.material ?? "",
      p.description,
      p.verifiedWorking === true ? "tested working verified" : "",
      p.verifiedWorking === false ? "not working faulty" : "",
    ]
      .join(" ")
      .toLowerCase();

    let score = 0;
    for (const term of terms) {
      if (haystack.includes(term)) score += 1;
    }
    return { item: p, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item);
}
