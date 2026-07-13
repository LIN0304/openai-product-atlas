# OpenAI Product Timeline Dataset v0.1 — Research Report

## Executive answer

The reproducible map edition contains **326 canonical product events**, including **83 landmarks** across **10 product regions**. It begins with ChatGPT's official launch on **2022-11-30** and ends at the latest official event found on **2026-07-09** during a retrieval pass completed on **2026-07-13**.

## Method

1. Snapshot official OpenAI Help Center, platform/developer changelog, launch-post, and lifecycle entry points.
2. Independently extract historical consumer/model, current consumer/model, and platform/lifecycle lanes.
3. Normalize dates, product families, event types, lifecycle states, bilingual fields, and official URLs.
4. Deduplicate same-day semantic matches while retaining corroborating sources.
5. Select a 326-node canonical layer with coverage across product families and quarters; preserve all 948 extraction records separately.
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

Run `npm run data:collect`, `npm run data:build`, `npm run data:validate`, and `npm run research:build`. See `evidence-ledger.json`, `source-matrix.csv`, and the lane reports for provenance and caveats.
