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
        What this demo is, how it&apos;s put together, and what&apos;s still rough. Written for
        anyone reviewing the site, not just for other engineers.
      </p>

      <Section title="What this is">
        <p>
          Salvage Row is a seeded secondhand marketplace: a browse view, an item detail view, a
          natural-language search box, and a small Q&amp;A assistant grounded in the catalogue.
          Almost every listing is a single used item (stock of 1), which is typical of a real
          secondhand market and deliberately different from a shop that restocks identical units.
          There are no real accounts, no real payments, and no real shipping — the brief asked
          for a demo, not a production storefront, so those parts are simulated and labeled as
          such on the item page.
        </p>
        <p>
          The whole site is browsable without signing in, on purpose — reviewers shouldn&apos;t need
          credentials to see any of it.
        </p>
      </Section>

      <Section title="Building with an AI coding tool">
        <p>
          This project was built with an AI coding assistant end to end — scaffolding the Next.js
          app, writing the catalogue data, the API routes, and the UI. I reviewed and adjusted the
          generated code rather than accepting it blindly (for example, the schema for a listing
          went through a couple of iterations to fit a secondhand-goods domain instead of the
          original demo domain this was adapted from), and I can walk through and explain any part
          of it on request.
        </p>
      </Section>

      <Section title="Natural-language search">
        <p>
          The catalogue is small (24 listings), so rather than building a real search index, the
          search API route sends the full catalogue as JSON context to the model alongside the
          shopper&apos;s query, and asks for a ranked list of matching listing IDs with a short reason
          for each. That&apos;s the whole implementation: no embeddings, no vector database, no query
          parser.
        </p>
        <p>
          <strong>Why this approach, and where it breaks down:</strong> putting the entire catalogue
          in the prompt is the simplest thing that could plausibly work, and for a few dozen items
          it does — the model can reason directly about condition, price, era, brand, and vague
          intent like &quot;something to fix up as a project&quot; or &quot;cheap furniture for a
          first apartment.&quot; It would not scale: a catalogue of thousands of items won&apos;t fit
          in context, every search costs one full model call (latency and API spend both scale with
          traffic), and there&apos;s no caching. A real version would need an actual retrieval layer —
          embeddings plus a vector index, or a hybrid of keyword search and reranking — with the
          model used for reranking or query understanding rather than reading the whole catalogue
          each time.
        </p>
        <p>
          If the model call fails or doesn&apos;t return parseable JSON (missing API key, network
          error, malformed response), the route falls back to a plain keyword scorer over each
          listing&apos;s text fields, and the UI says so. That fallback is intentionally naive — no
          synonyms, no understanding of intent — it exists so the demo degrades gracefully rather
          than showing an error.
        </p>
      </Section>

      <Section title="Catalogue Q&amp;A">
        <p>
          The Q&amp;A box uses the same &quot;whole catalogue in context&quot; strategy: the question
          and the full catalogue JSON go to the model with instructions to answer only from the
          provided data. Several listings have fields deliberately left as <code>null</code> or
          omitted — brand, era, original retail price, and whether an item has been tested/verified
          are all unknown for some items, specifically to check that the assistant says
          &quot;not listed&quot; instead of guessing (for instance, the Polaroid camera&apos;s
          working condition is explicitly untested). In testing it does this consistently, but it
          is only as reliable as the instruction-following of the underlying model — there&apos;s no
          separate verification step confirming every answer stayed inside the catalogue.
        </p>
        <p>
          This does not have the keyword fallback that search has, since a naive fallback
          can&apos;t meaningfully answer open-ended questions. If the model call fails, the box says
          plainly that the feature is unavailable rather than faking an answer.
        </p>
      </Section>

      <Section title="How the AI calls are wired up">
        <p>
          Both routes call a model from Next.js server routes (<code>app/api/search</code> and{" "}
          <code>app/api/qa</code>) using a key read from the server environment
          (<code>GATEWAY_API_KEY</code>). The key is never sent to the browser, never appears in
          client bundles, and isn&apos;t committed anywhere in this repository — the deployed
          instance has it set as a hosting-provider environment variable. Reviewers don&apos;t need a
          key of their own to try Search or Ask; every request is proxied through this
          server-side route.
        </p>
        <p>
          <strong>Which model, and why:</strong> this is worth stating plainly rather than glossing
          over. This app is deployed behind a class-provided gateway, and getting to a working
          model took three attempts:
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Calling Claude directly (the native Anthropic Messages API shape) — the gateway
            blocks that route entirely for student keys and returns 403.</li>
          <li>Calling Claude through the gateway&apos;s OpenRouter-compatible endpoint
            (<code>anthropic/claude-3.5-sonnet</code>) — reachable, but rejected with a
            &quot;no price is published for this model&quot; error, meaning that model isn&apos;t
            enabled for billing on this gateway account.</li>
          <li>Calling the gateway&apos;s own OpenAI-compatible Chat Completions endpoint with{" "}
            <code>gpt-5.6-terra</code> — this is what&apos;s actually wired up and working. The
            request/response shapes are OpenAI-style (a <code>messages</code> array in, a{" "}
            <code>choices[0].message.content</code> string out) rather than Claude&apos;s native
            format, but the app-level contract — send the catalogue and a question, get back a
            grounded answer — is unaffected by which model answers it.</li>
        </ol>
        <p>
          So: the search and Q&amp;A features are genuinely model-powered and genuinely live, just
          not specifically Claude in this deployment — that was a gateway/billing constraint on
          the account, not a design choice. Pointing <code>GATEWAY_MODEL</code> and{" "}
          <code>GATEWAY_BASE_URL</code> at a different endpoint (a real Anthropic key, a different
          gateway) would work with no other code changes, since <code>lib/model.ts</code> is the
          only place either value is read.
        </p>
      </Section>

      <Section title="Design decisions">
        <p>
          The visual language leans into a flea-market/thrift-shop framing rather than a generic
          storefront look: lot numbers on each card instead of SKUs, a warm kraft-paper and
          faded-denim palette instead of stock e-commerce colors, and simple line-drawn icons per
          category instead of photos (avoiding both an unnecessary image pipeline and any
          licensing question around real product photography for a demo).
        </p>
      </Section>

      <Section title="What's unfinished or out of scope">
        <ul className="list-disc pl-5 space-y-1">
          <li>No accounts, cart, real checkout, or order history — purchase is a single simulated confirmation.</li>
          <li>No pagination on search results (capped at 12); a larger catalogue would need it.</li>
          <li>No rate limiting or caching on the API routes.</li>
          <li>Search and Q&amp;A prompts are not adversarially hardened against prompt injection via a crafted query.</li>
          <li>Illustrations are simple SVG icons per category, not per-listing photography.</li>
          <li>No offer/negotiation flow — every listing is a fixed, simulated buy-now price.</li>
          <li>
            The &quot;Report wrong info or a scam&quot; button on each item page submits to a real
            API route, which validates and logs the report server-side — but nothing reads that
            log. There's no moderation queue, no seller suspension logic, and no notification to
            anyone. A real version would need a review workflow and a way to act on repeated
            reports against the same seller.
          </li>
        </ul>
      </Section>
    </div>
  );
}
