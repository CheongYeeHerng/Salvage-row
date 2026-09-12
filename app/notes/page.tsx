export const metadata = { title: "Notes — Salvage Row" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-2xl mb-3">{title}</h2>
      <div className="space-y-3 text-ink/85 leading-relaxed">{children}</div>
    </section>
  );
}

export default function NotesPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl mb-2">Notes</h1>
      <p className="text-dust mb-10">
        Written for anyone reviewing this demo — what it is, what's real, and what's still rough.
      </p>

      <Section title="1. What you built and who it is for">
        <p>
          Salvage Row is a seeded secondhand marketplace demo: a browse view across 48 listings
          (two pages, sortable by price or how recently something was listed), an item detail
          view, a natural-language search box, a catalogue-grounded Q&amp;A assistant, and a
          &quot;report this listing&quot; flow. It's built for a reviewer evaluating the demo —
          everything is reachable with no account, no sign-in, and no setup beyond opening the
          URL.
        </p>
        <p>
          Search and Q&amp;A both work the same way under the hood: the small catalogue (48
          items) is sent as JSON context to a model alongside the user's query or question, and
          the model returns either a ranked list of matching listing IDs (search) or a direct,
          catalogue-grounded answer (Q&amp;A). If that call fails, search falls back to a plain
          keyword scorer over the listing text, and Q&amp;A says plainly that it's unavailable
          rather than fabricating an answer.
        </p>
      </Section>

      <Section title="2. What is seeded, simulated, or otherwise limited">
        <ul className="list-disc pl-5 space-y-1">
          <li>All 48 listings are seed data, attributed to a handful of fictional sellers.</li>
          <li>
            Almost every listing has a stock of 1, matching how a real secondhand market works —
            unlike a shop that restocks identical units.
          </li>
          <li>
            Several listings deliberately have no logged brand, era, original retail price, or
            tested/verified-working status, specifically to exercise the &quot;acknowledge
            missing facts&quot; behavior in Q&amp;A rather than let it guess.
          </li>
          <li>
            Checkout (&quot;Buy&quot; on the item page) is a simulated, clearly labeled
            confirmation — no real payment method is ever charged, and nothing ships.
          </li>
          <li>
            Listing reports (wrong info / suspected scam) submit to a real, validated server
            route that logs the report — but nothing reviews that log. There's no moderation
            queue or seller-action workflow behind it.
          </li>
          <li>There are no user accounts or authentication anywhere — the whole site is public by design.</li>
        </ul>
      </Section>

      <Section title="3. AI coding tools, and which models power search &amp; Q&amp;A">
        <p>
          This project was built with an AI coding assistant (Codex CLI, run through a
          class-provided API gateway) end to end — scaffolding the Next.js app, the catalogue
          data, the API routes, and the UI. I reviewed and adjusted the generated code rather
          than accepting it blindly, and can walk through or explain any part of it on request.
        </p>
        <p>
          <strong>Which model actually answers Search and Q&amp;A, and why:</strong> getting to a
          working model took three attempts, worth stating plainly rather than glossing over:
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Calling Claude directly (the native Anthropic API shape) — blocked by the gateway for student keys (403).</li>
          <li>
            Calling Claude through the gateway&apos;s OpenRouter-compatible route
            (<code>anthropic/claude-3.5-sonnet</code>) — reachable, but rejected because no price
            is published for that model on this gateway account.
          </li>
          <li>
            Calling the gateway&apos;s own OpenAI-compatible Chat Completions endpoint with{" "}
            <code>gpt-5.6-terra</code> — this is what&apos;s actually wired up and working today.
          </li>
        </ol>
        <p>
          So: Search and Q&amp;A are genuinely model-powered and genuinely live, just not
          specifically Claude in this deployment — that was a gateway/billing constraint on the
          account, not a design choice. The model id is a single environment variable
          (<code>GATEWAY_MODEL</code>, read in <code>lib/model.ts</code>), so pointing this at a
          different model or a different gateway needs no other code changes.
        </p>
      </Section>

      <Section title="4. What I chose not to build, and why">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>A real search index (embeddings/vector DB).</strong> At 48 listings, the
            entire catalogue fits comfortably in a single prompt, so the model can reason
            directly over every field. This is the simplest thing that works at this size — it
            would not scale to a large catalogue, where an actual retrieval layer would be
            necessary.
          </li>
          <li>
            <strong>Accounts, cart persistence, real payments, and shipping/logistics.</strong>{" "}
            Explicitly out of scope for this brief — building any of these convincingly would
            take time away from the AI-facing features the demo is meant to showcase.
          </li>
          <li>
            <strong>A moderation workflow for reports.</strong> The report button submits and
            logs a real request server-side, which is enough to demonstrate the flow end to end;
            building an actual review queue and seller-suspension logic is a separate, larger
            project.
          </li>
          <li>
            <strong>An offer/negotiation flow.</strong> Every listing has one fixed, simulated
            buy-now price rather than a back-and-forth, to keep the checkout surface small and
            clearly labeled as simulated.
          </li>
          <li>
            <strong>Real product photography.</strong> Each category gets a simple line-drawn SVG
            icon instead, which sidesteps both an image pipeline and any licensing question
            around real photos for a demo.
          </li>
        </ul>
      </Section>

      <Section title="5. Known issues and unfinished parts">
        <ul className="list-disc pl-5 space-y-1">
          <li>Search results are capped at 12 with no pagination; a larger catalogue would need it.</li>
          <li>No rate limiting or caching on the API routes.</li>
          <li>Search and Q&amp;A prompts are not adversarially hardened against a crafted, injection-style query.</li>
          <li>
            Sorting (by price or recency) only applies to the plain browse view — search results
            keep the model&apos;s relevance ranking instead, since re-sorting a ranked list by
            price or date would defeat the point of ranking it by relevance. The sort control is
            disabled while a search is active, rather than silently ignored.
          </li>
          <li>
            Q&amp;A&apos;s &quot;say so when a fact is missing&quot; behavior is only as reliable
            as the underlying model&apos;s instruction-following — there&apos;s no separate
            verification step confirming every answer stayed inside the catalogue.
          </li>
          <li>
            The model behind Search and Q&amp;A is tied to what this specific class gateway
            currently permits (see section 3) — if the gateway&apos;s configuration changes,{" "}
            <code>GATEWAY_MODEL</code> may need updating.
          </li>
        </ul>
      </Section>
    </div>
  );
}
