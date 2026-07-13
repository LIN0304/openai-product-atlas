# Research Plan

## Scope

- Question: What official OpenAI product and release events should appear in a canonical timeline from ChatGPT launch on 2022-11-30 through 2026-07-13?
- Audience: OpenAI product-history explorers, researchers, builders, and the GPT-5.6 Sol demo audience.
- Decision supported: Which atomic events become searchable timeline nodes, which become map landmarks, and what official evidence supports every node.
- Freshness requirement: Verify through 2026-07-13; every source record carries a retrieval date and coverage status.
- Geography/domain constraints: Global OpenAI products and official release surfaces; no regional rumor or third-party reconstruction as evidence.
- Source quality bar: Official OpenAI launch posts, Help Center release notes, developer changelogs, model release notes, and deprecation records only.
- Exclusions: Research-paper-only announcements without a product or platform change; undocumented experiments; social posts without a durable official page; duplicate cross-posts after canonicalization.

## Assumptions

- `ChatGPT 3.5` product-history scope begins at ChatGPT's public launch on 2022-11-30, while model-history records may identify the GPT-3.5 family separately.
- A single release-note heading may contain several atomic product events and should be split when product, lifecycle, or verifier meaning differs.
- `all updates` is bounded by what is publicly observable in official living changelogs; known gaps remain explicit instead of being silently invented.
- The web map uses curated landmark nodes by default while the full downloadable dataset preserves granular events.

## Decomposition

| unit_id | atomic question | evidence needed | source class | owner | status |
| --- | --- | --- | --- | --- | --- |
| U01 | What is the canonical start date and initial product event? | ChatGPT launch announcement | official launch post | main | complete |
| U02 | Which 2022-2024 consumer/model changes are atomic events? | Help Center entries and launch posts | official release notes | consumer_history | complete |
| U03 | Which 2025-2026 consumer/model changes are atomic events? | Help Center entries and launch posts | official release notes | consumer_current | complete |
| U04 | Which developer, Codex, client, business, and lifecycle changes are atomic events? | changelogs, deprecations, release notes | official developer/help docs | platform_lifecycle | complete |
| U05 | How are duplicates, corroborations, and same-day splits canonicalized? | normalized titles, dates, product and source equivalence | extracted datasets | main | complete |
| U06 | Which nodes become landmarks and where do they sit on the pixel map? | importance rubric and product taxonomy | canonical dataset | main | complete |
| U07 | Do all delivered records parse, cite an official source, and fit the date/taxonomy contracts? | validators and ledger checks | generated artifacts | main | complete |

## Subagent Lanes

| lane | objective | sources | output artifact |
| --- | --- | --- | --- |
| consumer_history | Extract 2022-11-30 through 2024 consumer and model events | OpenAI Help Center and launch posts | lane-results/consumer-2022-2024.json |
| consumer_current | Extract 2025-01-01 through 2026-07-13 consumer and model events | OpenAI Help Center and launch posts | lane-results/consumer-2025-2026.json |
| platform_lifecycle | Extract API, Codex, Apps SDK, clients, enterprise, deprecations, and safety lifecycle | developer changelogs and official release notes | lane-results/platform-lifecycle.json |
| canonicalization | Normalize, deduplicate, score, geocode, and attach source lineage | all lane results | data/openai-timeline.json |
| adversarial_qa | Check dates, official URLs, unsupported future claims, duplicate nodes, and coverage gaps | final dataset and source matrix | validation reports |

## Validation Gates

- Ledger schema validation
- Citation coverage validation
- Contradiction review
- Freshness review
- Final synthesis review
