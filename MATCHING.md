# Smart Match — Implementation Plan

The current `match.html` is a front-end-only mock: it does keyword-overlap scoring against a hardcoded job catalogue and renders fake "match %" results. The UI is real and shippable; the brain is fake. This doc covers what it takes to wire in **real AI matching** without changing the UI.

---

## Architecture — what real matching needs

```
[match.html] ──upload/text──▶ [Backend API] ──▶ [Resume parser]
                                     │                  │
                                     ▼                  ▼
                              [LLM / embeddings]   [Job DB]
                                     │                  │
                                     └──── matches ◀────┘
```

Four moving pieces you don't have yet:

1. **A backend** — the static Render site can't accept file uploads or hold secrets (API keys can't be exposed in client JS).
2. **A resume parser** — PDFs and DOCX files need server-side parsing to extract text.
3. **An AI service** — either an LLM that ranks jobs directly, or an embedding model that compares semantic similarity.
4. **A job database** — right now jobs live in HTML. To match against thousands you need them in a real datastore.

---

## Stage 1 — Cheapest end-to-end (~1 weekend)

Goal: the mock becomes real for paste-text-only resumes. No file uploads yet.

**Stack**

- **Backend:** Render Web Service (free tier) or Cloudflare Worker (free tier). Single endpoint `POST /match` that takes `{ text }` and returns `{ matches: [...] }`.
- **AI:** Anthropic Claude API (`claude-haiku-4-5`) — cheapest model, plenty smart for ranking.
- **Jobs:** keep the 20-job catalogue from `match.html` for now — move it into a JSON file on the backend.

**Endpoint logic**

```js
// POST /match  body: { text: "..." }
const resume = req.body.text;
const jobs   = require('./jobs.json'); // 20-job array

// One call to Claude, returns matches with reasons
const response = await anthropic.messages.create({
  model: 'claude-haiku-4-5',
  max_tokens: 2000,
  messages: [{
    role: 'user',
    content: `Rank these jobs for this candidate. Return JSON only.

CANDIDATE RESUME:
${resume}

JOBS:
${JSON.stringify(jobs)}

Return JSON: [{ "id": "j1", "score": 0-100, "why": "one-sentence reason" }, ...]
Top 8 only. Sort highest first.`
  }]
});

const matches = JSON.parse(response.content[0].text);
res.json({ matches });
```

**Front-end change** — replace `rankJobs()` in `match.html` with:

```js
async function rankJobs(text) {
  const r = await fetch('https://your-backend.onrender.com/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return r.json(); // same shape: { hits, ranked }
}
```

Everything else (the animation, results UI, "why this matches" rendering) keeps working unchanged.

**Cost estimate (Claude Haiku):** ~$0.001 per match. 1,000 matches/day = ~$30/month.

---

## Stage 2 — File upload (~1 extra day)

Add PDF/DOCX support so users don't have to copy-paste.

**Server-side text extraction**

| Format | Library (Node) | Library (Python) |
|---|---|---|
| PDF | `pdf-parse` | `pdfplumber` |
| DOCX | `mammoth` | `python-docx` |
| TXT | built-in | built-in |

**Endpoint change** — `POST /match` now accepts `multipart/form-data` with a `resume` file. Parse to text, then proceed as Stage 1.

**Alternative (no parsing libs):** Send the file directly to a vision-capable model. Claude can read PDFs natively:

```js
const file = await anthropic.beta.files.upload({ file: req.file });
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  messages: [{
    role: 'user',
    content: [
      { type: 'document', source: { type: 'file', file_id: file.id } },
      { type: 'text', text: 'Rank these jobs for this candidate... [same prompt]' }
    ]
  }]
});
```

More expensive but handles every weird resume layout for free.

---

## Stage 3 — Real job database (~1 week)

You can't keep the 20-job array forever. To match against thousands:

**Datastore:** Supabase (Postgres, free tier 500MB) or Render Postgres.

**Schema** — minimum viable:

```sql
CREATE TABLE jobs (
  id          UUID PRIMARY KEY,
  title       TEXT NOT NULL,
  company     TEXT NOT NULL,
  location    TEXT,
  description TEXT NOT NULL,
  salary_min  INT,
  salary_max  INT,
  tags        TEXT[],
  embedding   VECTOR(1536),   -- for similarity search; needs pgvector
  posted_at   TIMESTAMP DEFAULT NOW()
);
```

**Embeddings approach** — much faster than asking an LLM to rank every job:

1. When a job is posted, compute `OpenAI text-embedding-3-small` of `title + description` and store as `embedding`.
2. On match request, embed the resume text the same way.
3. Run a Postgres `<->` cosine distance query against `embedding` — returns top-N jobs in milliseconds.
4. Optionally send the top-N to Claude for re-ranking + writing "why this matches" sentences.

**Cost:** Embeddings are dirt cheap ($0.02 per 1M tokens). Reranking with Claude is the same as Stage 1.

---

## Stage 4 — Quality + safety polish (ongoing)

- **Prompt caching** — Claude caches the jobs list between calls. Saves ~70% on repeat requests.
- **Rate limiting** — Cloudflare or a simple in-memory `Map<ip, count>` so a bored user can't drain the bill.
- **Resume sanitization** — strip emails/phone numbers before sending to the model. Privacy + reduces hallucinated personalization.
- **Match diversity** — don't return five jobs from the same company. Apply a max-3-per-company post-filter.
- **"Why this matches" honesty** — instruct the model to cite specific resume phrases. Avoids vague "great fit" copy.
- **Telemetry** — log `(input length, output count, model, latency, cost)` per call so you can budget.

---

## Recommended incremental path

1. **Today:** mock is live. Ship it. Users see the UX, you learn what shape of result feels useful.
2. **Week 2:** stand up Stage 1 (paste-text + 20 jobs + Claude Haiku). Costs almost nothing.
3. **Week 3:** add file uploads (Stage 2).
4. **Month 2:** real job database + embeddings (Stage 3).
5. **Ongoing:** Stage 4 polish as you see real usage.

---

## Files involved

- `match.html` — UI + current mock logic
- `MATCHING.md` — this doc
- *(future)* `backend/index.js` or `backend/main.py` — the API endpoint
- *(future)* `backend/jobs.json` — job catalogue (until DB)
- *(future)* `backend/.env` — `ANTHROPIC_API_KEY=...` (never commit this)

The contract between the front-end and the backend lives in one function: `rankJobs(text) → { hits, ranked }`. As long as that returns the same shape, the rest of the UI doesn't care whether the brain is keyword matching, Claude, or a black box.
