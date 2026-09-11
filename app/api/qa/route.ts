import { NextRequest, NextResponse } from "next/server";
import { callModel } from "@/lib/model";
import { catalogueContext } from "@/lib/search";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are a knowledgeable, concise shop assistant for Salvage Row, a small secondhand marketplace.
You will be given the full catalogue as JSON and a shopper's question, which may ask about one item,
compare several, or ask a general question ("what's a good starter tool for someone with no workshop?").

Answer using ONLY the catalogue data provided — never invent facts, prices, brands, or condition
details. A field value of null (e.g. brand, era, originalPrice, verifiedWorking) means the seller
has not logged or verified that fact. When the question depends on a null or absent field, say
plainly that it isn't listed in the catalogue rather than guessing.

When comparing items, be specific: name the items and the differing attribute values.
Keep answers conversational and under ~120 words unless the comparison genuinely needs more.
Do not use markdown headers. Plain prose and short lists are fine.`;

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
    maxTokens: 600,
  });

  if (!result.ok && result.error) {
    console.error("[qa] gateway call failed:", result.error);
  }

  if (result.ok && result.text) {
    return NextResponse.json({ mode: "ai", answer: result.text });
  }

  return NextResponse.json({
    mode: "unavailable",
    answer:
      "Catalogue Q&A isn't available right now — the model call didn't return a response. " +
      "This feature depends on a server-side GATEWAY_API_KEY being configured; see /notes for details.",
    error: result.error,
  });
}
