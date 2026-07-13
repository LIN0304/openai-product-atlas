# Platform and lifecycle research lane

## Executive result

This lane extracted **335 event records** from **11 official OpenAI source groups** for the period 2022-11-30 through 2026-07-13. The strongest coverage is the dated-entry extraction of the [API changelog](https://developers.openai.com/api/docs/changelog), [API deprecation registry](https://developers.openai.com/api/docs/deprecations), [Codex changelog](https://developers.openai.com/codex/changelog/), and [Apps SDK changelog](https://developers.openai.com/apps-sdk/changelog/).

## Method

- Official OpenAI sources only: `openai.com`, `developers.openai.com`, and `help.openai.com`.
- Every dated API, Codex, Apps SDK, and in-scope API-deprecation card was normalized to the requested bilingual event schema.
- Client, business, education, enterprise, safety, and security notes were added as material product/lifecycle landmarks where they fill a changelog gap or establish a distinct public surface.
- A release-note card remains one event even when the official card bundles several fixes. This preserves source granularity and avoids inventing dates for undated sub-bullets.
- Future shutdown dates are preserved in summaries, but lifecycle is anchored to the announcement state as of 2026-07-13.

## High-confidence claims

1. The current API changelog exposes dated cards from 2023-10-06 through 2026-07-09; this lane captured all 143 dated cards visible at retrieval. [Official API changelog](https://developers.openai.com/api/docs/changelog)
2. The deprecation registry distinguishes deprecation announcements from shutdown and provides recommended replacements; this lane captured 29 in-scope announcement groups. [Official deprecations](https://developers.openai.com/api/docs/deprecations)
3. The Codex changelog is its own high-frequency release stream: 88 release cards from 2025-05-19 through 2026-07-09 were captured, including app, CLI/IDE, model, mobile and remote-work changes. [Official Codex changelog](https://developers.openai.com/codex/changelog/)
4. Apps SDK/MCP changes are independently versioned: 13 dated cards were captured from the official SDK changelog. [Official Apps SDK changelog](https://developers.openai.com/apps-sdk/changelog/)
5. ChatGPT desktop evolved through separate macOS and Windows clients, Codex surfaces, and a new unified desktop app; the old macOS client became ChatGPT Classic on 2026-07-09. [macOS notes](https://help.openai.com/en/articles/9703738-desktop-app-release-notes) [Windows notes](https://help.openai.com/en/articles/10003026-windows-app-release-notes) [migration guide](https://help.openai.com/en/articles/20001276/)
6. Atlas launched on 2025-10-21, received a dated build stream through 2026-03-10, and was announced for shutdown on 2026-08-09 as browser-agent capabilities moved into ChatGPT and Codex. [Atlas notes](https://help.openai.com/en/articles/12591856-chatgpt-atlas-release-notes) [Atlas transition notice](https://help.openai.com/en/articles/20001371-evolving-atlas-into-chatgpt-for-browser-based-agentic-work)
7. OpenAI's organizational products form distinct launch/lifecycle nodes: ChatGPT Enterprise (2023-08-28), Team (2024-01-10), Edu (2024-05-30), and the Team-to-Business rename (2025-08-29). [Enterprise](https://openai.com/index/introducing-chatgpt-enterprise/) [Team](https://openai.com/index/introducing-chatgpt-team/) [Edu](https://openai.com/index/introducing-chatgpt-edu/) [Business rename](https://help.openai.com/en/articles/12111915-chatgpt-team-is-now-chatgpt-business)
8. Safety/security milestones are product-relevant nodes when they change controls or public capability governance, including the updated Preparedness Framework, Lockdown Mode, Advanced Account Security, and Daybreak. [Preparedness Framework](https://openai.com/index/updating-our-preparedness-framework/) [Lockdown Mode](https://openai.com/index/introducing-lockdown-mode-and-elevated-risk-labels-in-chatgpt/) [Advanced Account Security](https://openai.com/index/advanced-account-security/) [Daybreak](https://openai.com/index/daybreak-securing-the-world/)

## Counts

### By year

- 2023: 18
- 2024: 52
- 2025: 95
- 2026: 170

### By product family

- Agents & Research: 109
- Clients & Surfaces: 39
- Developer Platform: 58
- Enterprise & Vertical: 20
- Models & Reasoning: 33
- Multimodal: 24
- Safety & Lifecycle: 52

### By primary source stream

- OpenAI API Changelog: 143
- Codex Changelog: 88
- OpenAI API Deprecations: 29
- ChatGPT Atlas - Release Notes: 17
- ChatGPT Enterprise & Edu - Release Notes: 14
- Apps SDK Changelog: 13
- ChatGPT macOS app release notes: 5
- Windows App - Release Notes: 2
- Desktop app release notes: 2
- Introducing APIs for GPT-3.5 Turbo and Whisper: 1
- GPT-4: 1
- Function calling and other API updates: 1
- GPT-4 API general availability: 1
- GPT-3.5 Turbo fine-tuning and API updates: 1
- Introducing ChatGPT Enterprise: 1
- Introducing ChatGPT Team: 1
- Hello GPT-4o: 1
- Introducing ChatGPT Edu: 1
- An update on our safety & security practices: 1
- Our updated Preparedness Framework: 1
- Scaling coordinated vulnerability disclosure: 1
- ChatGPT Business Rename FAQ: 1
- Introducing ChatGPT Atlas: 1
- Introducing gpt-oss-safeguard: 1
- Introducing Lockdown Mode and Elevated Risk labels in ChatGPT: 1
- Introducing Advanced Account Security: 1
- Scaling Trusted Access for Cyber with GPT-5.5 and GPT-5.5-Cyber: 1
- Daybreak: Tools for securing every organization in the world: 1
- ChatGPT Business - Release Notes: 1
- Moving to the new ChatGPT desktop app: 1
- Evolving Atlas into ChatGPT for browser-based agentic work: 1

## Contradictions and interpretation risks

- The API deprecation page heading says `2025-08-20: Assistants API`, while its body says developers were notified on 2025-08-26. The dataset uses the official heading date and preserves the notification/removal dates in the summary. This should be manually reviewed before a day-level public visualization.
- The deprecation registry has a heading `2025-09-15: gpt-4o-realtime-preview models` but the prose only says “In September, 2025.” The heading date is used because it is the page's canonical event identifier.
- The GPT-4 API general-availability article shows an updated date in 2024, but its launch event is 2023-07-06. The event date follows the announcement described by the article and deprecation registry, not the later editorial update.
- Help Center release notes are living documents. Their “Updated” timestamp is not the date of each embedded release event and is not used as an event date.
- A scheduled shutdown after 2026-07-13 is not represented as completed retirement. The announcement node remains `deprecation_announced` until a later official source confirms shutdown.

## Gaps and confidence

- **High confidence:** API changelog cards, deprecation headings/tables, Codex cards, Apps SDK cards, and explicit launch/retirement posts.
- **Medium confidence/partial coverage:** Enterprise, Edu and Business admin notes are broad and overlap consumer notes; this lane selects material platform and lifecycle sections rather than claiming every parity bullet is atomized.
- **Known gap:** the legacy Windows release-note page ends in January 2025. Later Windows events are carried by ChatGPT, Enterprise and Codex notes.
- **Known gap:** the Atlas build page has no entries after 2026-03-10 before the July deprecation notice.
- **Known gap:** GitHub release feeds for individual SDK/CLI packages are not treated as canonical product nodes unless surfaced in the official OpenAI changelog.
- **Known gap:** granular API history before October 2023 is not present on the current changelog; five major early platform events were reconstructed from official launch posts.

## Recommended follow-up checks

1. Re-fetch all living changelogs immediately before publishing and diff date headings against this extraction.
2. Resolve the Assistants API 2025-08-20 vs 2025-08-26 date discrepancy with an archived official snapshot or a direct OpenAI correction.
3. Decide whether the final map treats each Codex patch card as a visible node or collapses importance 1–2 cards into monthly “maintenance” clusters.
4. Add a separate shutdown-node pass after future dates actually occur; do not infer retirement solely from a scheduled date.
5. Cross-deduplicate Enterprise/Business parity entries against the consumer timeline while preserving admin-only controls as separate events.

## Validation

- Both JSON files parse successfully.
- Every event has all requested fields, an ISO date, an importance value from 1 to 5, and an official OpenAI URL.
- Event IDs are unique.
- Dates are within the requested research window.
- Source registry explicitly records extraction status and gaps.
