import { NextRequest, NextResponse } from "next/server";
import { getItem } from "@/data/catalogue";

export const runtime = "nodejs";

const VALID_REASONS = ["Wrong information", "Suspected scam", "Other"] as const;

export async function POST(req: NextRequest) {
  let itemId = "";
  let reason = "";
  let details = "";

  try {
    const body = await req.json();
    itemId = typeof body.itemId === "string" ? body.itemId : "";
    reason = typeof body.reason === "string" ? body.reason : "";
    details = typeof body.details === "string" ? body.details.slice(0, 1000) : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const item = getItem(itemId);
  if (!item) {
    return NextResponse.json({ error: "Unknown listing." }, { status: 404 });
  }
  if (!VALID_REASONS.includes(reason as (typeof VALID_REASONS)[number])) {
    return NextResponse.json({ error: "Invalid reason." }, { status: 400 });
  }

  // Demo only: this simply logs to the server console. Nothing is persisted,
  // and no moderation queue or trust-and-safety workflow reads this in the
  // deployed demo — see /notes for what a real version would need.
  console.log("[report]", {
    itemId,
    itemName: item.name,
    reason,
    details,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
