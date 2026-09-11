import { NextRequest, NextResponse } from "next/server";
import { getItem } from "@/data/catalogue";
import { callClaude, parseJsonLoose } from "@/lib/anthropic";
import { catalogueContext, keywordFallbackSearch } from "@/lib/search";

export const runtime = "nodejs";

interface SearchModelResponse {
  results: { id: string; reason: string }[];
}

const SYSTEM_PROMPT = `You are the search engine for Salvage Row, a small secondhand marketplace.
You will be given the full catalogue as JSON and a shopper's natural-language query.

Return ONLY a JSON object, no prose, no markdown fences, shaped exactly like:
{"results":[{"id":"014","reason":"short reason this matches, under 15 words"}]}

Rules:
- Only use "id" values that appear in the catalogue provided.
- Order results from most to least relevant to the query.
- A field value of null means that fact is not known/verified by the seller (e.g. brand, era,
  original price, or whether an item was tested) — never guess a value for it, and don't match
  an item to the query based on a null field.
- Include at most 12 results. If nothing in the catalogue reasonably matches, return {"results":[]}.
- Judge relevance broadly: category, condition, price range, era/vintage, brand, material,
  and stated use ("gift", "for a first apartment", "something I can fix up") are all fair signals.`;

export async function POST(req: NextRequest) {
  let query = "";
  try {
    const body = await req.json();
    query = typeof body.query === "string" ? body.query.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!query) {
    return NextResponse.json({ results: [], mode: "empty" });
  }

  const result = await callClaude({
    system: SYSTEM_PROMPT,
    user: `Catalogue:\n${catalogueContext()}\n\nQuery: ${query}`,
    maxTokens: 1024,
  });

  if (!result.ok && result.error) {
    console.error("[search] gateway call failed:", result.error);
  }

  if (result.ok) {
    const parsed = parseJsonLoose<SearchModelResponse>(result.text);
    if (parsed && Array.isArray(parsed.results)) {
      const matches = parsed.results
        .map((r) => ({ item: getItem(r.id), reason: r.reason }))
        .filter((r) => r.item !== undefined);

      return NextResponse.json({
        mode: "ai",
        query,
        results: matches.map((m) => ({ item: m.item, reason: m.reason })),
      });
    }
    // Model responded but not in the shape we asked for — fall through to keyword search
  }

  const fallbackMatches = keywordFallbackSearch(query);
  return NextResponse.json({
    mode: "fallback",
    query,
    note: result.error ?? "The model response could not be parsed; showing keyword matches instead.",
    results: fallbackMatches.map((item) => ({ item, reason: null })),
  });
}
