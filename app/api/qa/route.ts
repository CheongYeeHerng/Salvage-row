import { NextRequest, NextResponse } from "next/server";
import { callModel, parseJsonLoose } from "@/lib/model";
import { catalogueContext } from "@/lib/search";
import { getItem } from "@/data/catalogue";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are a knowledgeable, concise shop assistant for Salvage Row, a small secondhand marketplace.
You will be given the full catalogue as JSON and a shopper's question, which may ask about one item,
compare several, or ask a general question ("what's a good starter tool for someone with no workshop?").

Answer using ONLY the catalogue data provided — never invent facts, prices, brands, or condition
details. A field value of null (e.g. brand, era, originalPrice, verifiedWorking) means the seller
has not logged or verified that fact. When the question depends on a null or absent field, say
plainly that it isn't listed in the catalogue rather than guessing.

Each item includes a sellerContact field (phone and email). If asked how to reach the seller of
an item, share that phone/email directly — it's already public information on this demo site,
shown to any visitor via the "Contact seller" button on the item page.

When comparing items, be specific: name the items and the differing attribute values.
Keep answers conversational and under ~120 words unless the comparison genuinely needs more.
Do not use markdown headers. Plain prose and short lists are fine within the answer text.

Return ONLY a JSON object, no prose outside it, no markdown fences, shaped exactly like:
{"answer":"your answer text here","referencedItemIds":["014","009"],"followUpQuestions":["question one","question two"]}

Rules for referencedItemIds:
- List the "id" of every catalogue item your answer actually names or relies on, in the order
  they're first mentioned. Only use ids that appear in the catalogue provided.
- If the answer doesn't reference any specific item (a general question with no items named),
  return an empty array.

Rules for followUpQuestions:
- 2 to 4 short, natural questions a shopper might reasonably ask next, grounded in this
  catalogue's actual items and fields — not generic questions that could apply to any shop.
- Build on what was just asked: a narrower comparison, an adjacent item, a related missing-fact
  check, or a natural next step ("how do I contact the seller of X").
- Phrase each as something the shopper would type, not a description of a topic.
- If nothing sensible follows from this answer, return an empty array.`;

export async function POST(req: NextRequest) {
  let question = "";
  try {
    const body = await req.json();
    question = typeof body.question === "string" ? body.question.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!question) {
    return NextResponse.json({ error: "A question is required." }, { status: 400 });
  }

  const result = await callModel({
    system: SYSTEM_PROMPT,
    user: `Catalogue:\n${catalogueContext()}\n\nQuestion: ${question}`,
    maxTokens: 700,
  });

  if (!result.ok && result.error) {
    console.error("[qa] gateway call failed:", result.error);
  }

  if (result.ok && result.text) {
    interface QaModelResponse {
      answer: string;
      referencedItemIds?: string[];
      followUpQuestions?: string[];
    }
    const parsed = parseJsonLoose<QaModelResponse>(result.text);

    if (parsed && typeof parsed.answer === "string" && parsed.answer.trim()) {
      const followUpQuestions = Array.isArray(parsed.followUpQuestions)
        ? parsed.followUpQuestions.filter((q): q is string => typeof q === "string").slice(0, 4)
        : [];

      const referencedItems = Array.isArray(parsed.referencedItemIds)
        ? parsed.referencedItemIds
            .filter((id): id is string => typeof id === "string")
            .map((id) => getItem(id))
            .filter((item): item is NonNullable<typeof item> => item !== undefined)
            .map((item) => ({ id: item.id, name: item.name }))
        : [];

      return NextResponse.json({ mode: "ai", answer: parsed.answer, followUpQuestions, referencedItems });
    }

    // Model responded but not in the expected JSON shape — still show the raw
    // text as the answer rather than discarding a perfectly good response.
    return NextResponse.json({ mode: "ai", answer: result.text, followUpQuestions: [], referencedItems: [] });
  }

  return NextResponse.json({
    mode: "unavailable",
    answer:
      "Catalogue Q&A isn't available right now — the model call didn't return a response. " +
      "This feature depends on a server-side GATEWAY_API_KEY being configured; see /notes for details.",
    error: result.error,
  });
}
