import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const researchDir = path.join(root, "research/openai-timeline-v0.1");
const laneDir = path.join(researchDir, "lane-results");
const manifest = JSON.parse(await readFile(path.join(researchDir, "source-snapshots/manifest.json"), "utf8"));
const timeline = JSON.parse(await readFile(path.join(root, "data/openai-product-timeline-v0.1.json"), "utf8"));
const raw = JSON.parse(await readFile(path.join(root, "data/openai-product-timeline-raw-v0.1.json"), "utf8"));
const laneFiles = ["consumer-2022-2024.json", "consumer-2025-2026.json", "platform-lifecycle.json"];
const laneRecords = [];
for (const file of laneFiles) {
  const payload = JSON.parse(await readFile(path.join(laneDir, file), "utf8"));
  laneRecords.push(...(Array.isArray(payload) ? payload : payload.events ?? []));
}

function slug(value) {
  return value.toLowerCase().replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function csv(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const sourceByUrl = new Map();
for (const source of manifest.sources) {
  sourceByUrl.set(source.url, {
    source_id: source.id,
    title: source.title,
    url: source.url,
    source_type: source.sourceKind,
    retrieved_at: source.retrievedAt,
    quality_score: 5,
    snapshot_path: source.snapshotPath,
  });
}
for (const event of laneRecords) {
  if (!event.source_url || sourceByUrl.has(event.source_url)) continue;
  sourceByUrl.set(event.source_url, {
    source_id: `official-${slug(event.source_url)}`,
    title: event.source_name || event.title_en || "OpenAI official source",
    url: event.source_url,
    source_type: event.source_kind || "official_source",
    retrieved_at: event.retrieved_at || "2026-07-13",
    quality_score: 5,
    snapshot_path: "lane extraction; see lane-results",
  });
}
const sources = [...sourceByUrl.values()].sort((a, b) => a.source_id.localeCompare(b.source_id));
const sourceId = (url) => sourceByUrl.get(url)?.source_id;
const chatgptNotes = sourceId("https://help.openai.com/en/articles/6825453-chatgpt-release-notes");
const modelNotes = sourceId("https://help.openai.com/en/articles/9624314-model-release-notes");
const launch = sourceId("https://openai.com/index/chatgpt/");
const api = sourceId("https://platform.openai.com/docs/changelog");
const codex = sourceId("https://developers.openai.com/codex/changelog/");

const claims = [
  { claim_id: "C001", claim: "ChatGPT was publicly introduced on 2022-11-30 as a research preview.", source_ids: [launch], confidence: "high", freshness_risk: "low" },
  { claim_id: "C002", claim: `The map edition contains ${timeline.stats.canonical_map_nodes} canonical event nodes, ${timeline.stats.landmarks} landmarks, and ${timeline.stats.product_families} product regions.`, source_ids: timeline.sources.map((source) => source.id), confidence: "high", freshness_risk: "low", evidence_kind: "derived_dataset" },
  { claim_id: "C003", claim: `The latest official event found by the ${timeline.period.cutoff} retrieval pass is dated ${timeline.period.latest_event}.`, source_ids: [chatgptNotes, modelNotes].filter(Boolean), confidence: "high", freshness_risk: "high" },
  { claim_id: "C004", claim: "OpenAI release history is distributed across consumer, model, API, Codex, Apps SDK, client, workspace, and lifecycle surfaces.", source_ids: [chatgptNotes, modelNotes, api, codex].filter(Boolean), confidence: "high", freshness_risk: "medium" },
  { claim_id: "C005", claim: "The validated research lanes contain 110 consumer/model events for 2022-2024, 241 for 2025-2026, and 335 platform/lifecycle events.", source_ids: sources.map((source) => source.source_id), confidence: "high", freshness_risk: "medium", evidence_kind: "lane_validation" },
  { claim_id: "C006", claim: `The extraction layer preserves ${raw.entry_count} unique official-source records before map curation.`, source_ids: sources.map((source) => source.source_id), confidence: "high", freshness_risk: "medium", evidence_kind: "derived_dataset" },
  { claim_id: "C007", claim: "GPT-5.6 Sol, ChatGPT Work, ChatGPT Sites, the unified desktop app, and Atlas retirement notices appear in official July 2026 notes.", source_ids: [chatgptNotes, modelNotes].filter(Boolean), confidence: "high", freshness_risk: "medium" },
];

const ledger = {
  schema_version: "1.0",
  research_question: "What official OpenAI product and release events should appear in a canonical timeline from ChatGPT launch on 2022-11-30 through 2026-07-13?",
  retrieved_at: manifest.retrievedAt,
  scope: {
    audience: "Product-history explorers, researchers, and builders",
    freshness_required: true,
    constraints: ["Official OpenAI sources only", "Publicly observable changes", "Atomic event records", "Explicit coverage gaps"],
  },
  sources,
  claims,
  contradictions: [
    { id: "X001", topic: "Assistants API deprecation notice", detail: "The heading date and body notification date differ; the lane preserves the heading date and documents the body date.", status: "documented" },
    { id: "X002", topic: "Living changelog mutability", detail: "Help Center pages can be edited retroactively, so retrieval timestamps and snapshots are retained.", status: "structural limitation" },
    { id: "X003", topic: "Announced versus effective retirement", detail: "Atlas and other shutdown notices remain deprecation announcements until the effective date has occurred.", status: "lifecycle distinction" },
  ],
  open_questions: [
    "Can an immutable official date be recovered for the currently undated GPT-5-Codex-Mini model-note heading?",
    "Should v0.2 expand patch-level Windows and Enterprise administration parity events?",
    "Which machine translation titles deserve a human editorial pass before a narrative publication?",
  ],
};
await writeFile(path.join(researchDir, "evidence-ledger.json"), `${JSON.stringify(ledger, null, 2)}\n`);

const matrixHeader = ["source_id", "title", "url_or_path", "source_type", "published_at", "retrieved_at", "quality_score", "used_for_claims", "notes"];
const matrixRows = sources.map((source) => [source.source_id, source.title, source.url, source.source_type, "", source.retrieved_at, source.quality_score, claims.filter((claim) => claim.source_ids.includes(source.source_id)).map((claim) => claim.claim_id).join(" | "), source.snapshot_path]);
await writeFile(path.join(researchDir, "source-matrix.csv"), `${[matrixHeader, ...matrixRows].map((row) => row.map(csv).join(",")).join("\n")}\n`);

const report = `# OpenAI Product Timeline Dataset v0.1 — Research Report

## Executive answer

The reproducible map edition contains **${timeline.stats.canonical_map_nodes} canonical product events**, including **${timeline.stats.landmarks} landmarks** across **${timeline.stats.product_families} product regions**. It begins with ChatGPT's official launch on **${timeline.period.start}** and ends at the latest official event found on **${timeline.period.latest_event}** during a retrieval pass completed on **${timeline.period.cutoff}**.

## Method

1. Snapshot official OpenAI Help Center, platform/developer changelog, launch-post, and lifecycle entry points.
2. Independently extract historical consumer/model, current consumer/model, and platform/lifecycle lanes.
3. Normalize dates, product families, event types, lifecycle states, bilingual fields, and official URLs.
4. Deduplicate same-day semantic matches while retaining corroborating sources.
5. Select a 326-node canonical layer with coverage across product families and quarters; preserve all ${raw.entry_count} extraction records separately.
6. Validate schemas, official-domain URLs, chronology, anchors, CSV parity, map coordinates, bilingual fields, and extraction-chrome exclusion.

## Lane results

| lane | validated records | key coverage |
|---|---:|---|
| consumer/model 2022-2024 | 110 | ChatGPT origin, Plus, GPT-4, GPTs, Sora, GPT-4o, o1 |
| consumer/model 2025-2026 | 241 | Operator, deep research, Codex, agent, GPT-5 family, Work, Sites |
| platform/lifecycle | 335 | 143 API, 29 deprecation groups, 88 Codex, 13 Apps SDK/MCP, clients/workspaces |

## Key findings

- A single living ChatGPT page is not a complete product history; major releases require model notes, launch posts, API/developer changelogs, and lifecycle notices.
- Release headings frequently bundle multiple atomic product changes. The canonical data splits them when product, lifecycle, or verifier meaning differs.
- Announcement, rollout, general availability, deprecation notice, and effective retirement are distinct lifecycle events.
- The full extraction layer remains downloadable so map curation never erases evidence.

## Known boundaries

- Living changelogs may be edited retroactively; retrieval timestamps and local snapshots are essential.
- Business/Enterprise coverage is landmark-level rather than every duplicated parity update.
- Windows legacy notes end in January 2025; patch-level coverage is therefore incomplete.
- Some concise Traditional Chinese titles are machine-assisted translations and are marked as an editorial follow-up, not as independent evidence.
- v0.1 is an official-source baseline and does not claim access to undocumented or private OpenAI changes.

## Reproduce

Run \`npm run data:collect\`, \`npm run data:build\`, \`npm run data:validate\`, and \`npm run research:build\`. See \`evidence-ledger.json\`, \`source-matrix.csv\`, and the lane reports for provenance and caveats.
`;
await writeFile(path.join(researchDir, "final-report.md"), report);
console.log(JSON.stringify({ sources: sources.length, claims: claims.length, raw: raw.entry_count, canonical: timeline.events.length }, null, 2));
