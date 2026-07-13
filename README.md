# OpenAI Product Atlas

OpenAI Product Atlas is an English-first, ASCII/cyberpunk timeline game for exploring publicly documented OpenAI product history. It begins with the public ChatGPT launch on 2022-11-30 and currently ends with the latest event in the v0.1 source snapshot on 2026-07-09.

The experience is a native web application: React owns the controls, record views, deep links, and accessible event index; Canvas2D renders the dense timeline world and the movable character, NOVA. There is no game engine, iframe, WebAssembly game bundle, or WebGL dependency.

## Dataset v0.1

| Layer | Records |
|---|---:|
| Raw official-source records | 948 |
| Canonical map events | 326 |
| Landmark events | 83 |
| Official source groups | 15 |
| Product families | 10 |

The canonical layer is deliberately curated for a legible map. The raw layer is retained for provenance and future re-extraction. OpenAI release information lives across mutable Help Center pages, launch posts, and developer changelogs, so this repository is a reproducible official-source baseline rather than a claim that every private, undocumented, or subsequently edited change is represented.

Primary source entry points include [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes), [Model Release Notes](https://help.openai.com/en/articles/9624314-model-release-notes), the [API changelog](https://platform.openai.com/docs/changelog), [API deprecations](https://platform.openai.com/docs/deprecations), the [Codex changelog](https://developers.openai.com/codex/changelog/), and the [Apps SDK changelog](https://developers.openai.com/apps-sdk/changelog/).

The browser UI is English-only. Published JSON, CSV, and XLSX files retain bilingual fields so the historical dataset remains reusable outside the game.

## Run locally

Prerequisite: Node.js 22.13 or newer.

```bash
npm install
npm run data:build
npm run data:validate
npm run dev
```

Open `http://localhost:3000`.

## Play and explore

- Focus the map, then move NOVA with WASD or the arrow keys.
- Press Enter or use `[READ]` when NOVA reaches a station.
- Click or tap a station to select it and create a route; `[OPEN NOW]` provides a non-spatial shortcut.
- Press `/` to focus search, `+` or `-` to zoom, Home to fit the world, and Escape to close a record.
- On touch devices, use the on-map directional controls and `[READ]` button.
- Search and filters expose all 326 records without requiring Canvas interaction.

Arrival uses an enter radius and a larger exit radius, so a record opens once when NOVA enters a station instead of reopening continuously while the character stands still. Events sharing a product family and date occupy one station and can be stepped through in deterministic order.

## Shareable state

Meaningful view state uses compact query parameters:

- `q` for search;
- `family` and `year` for filters;
- `landmarks` for landmark-only mode;
- `event` for the selected record;
- `view` for a supported presentation mode.

Committed selections create browser-history entries, while transient changes replace the current entry. Character coordinates and animation frames are intentionally excluded from URLs. An incoming event link takes precedence over device-local progress.

## Architecture

```text
official OpenAI pages
        |
        v
source snapshots + extracted lane records
        |
        v
canonical JSON / CSV / XLSX + preserved raw JSON
        |
        +--> React controls, filters, record dialog, semantic index
        |
        +--> Canvas2D world, family routes, stations, NOVA movement
```

Time is encoded on the horizontal axis and product family on the vertical axis. Route segments connect only consecutive events in the same family; they do not claim causal relationships between products. A visited station means its record was opened in the current browser, not that it was completed, endorsed, or mastered.

Canvas rendering is split into stable world marks and frequently changing player/selection layers. Device pixel ratio is capped for mobile performance. React receives only discrete game events rather than per-frame character updates.

## Accessibility and responsive behavior

- The Canvas sits inside a labeled, keyboard-focusable group and is never exposed as an application role.
- A live region announces arrival and selection changes.
- Record content, source links, search, filters, downloads, and the complete event index remain semantic HTML.
- ASCII glyphs and labels repeat every color distinction, including landmark, major, update, selected, visited, waypoint, and lifecycle states.
- Reduced-motion mode removes smooth camera and decorative animation while preserving discrete navigation and record opening.
- Primary touch targets are at least 44 CSS pixels.
- Desktop, mobile portrait, and mobile landscape use purpose-built layouts that keep the map visible while controls or record details are open.

## Rebuild and validate

```bash
npm run data:collect   # refresh official-source snapshots
npm run data:build     # regenerate canonical JSON, raw JSON, and CSV
npm run data:validate  # verify counts, schema, anchors, sources, and public-copy parity
npm run test:unit
npm run lint
npm run build
```

Research snapshots and extraction notes live under `research/openai-timeline-v0.1/`. Generated public datasets live under `public/data/`; canonical source copies live under `data/`. The checked-in XLSX workbook is preserved as a distribution artifact and is not overwritten by the JSON/CSV build script.

## Attribution

This project is an independent historical visualization and is not an official OpenAI product. OpenAI product names belong to their respective owner. Source links point to the official pages used by the dataset; summaries are editorially normalized for the atlas.
