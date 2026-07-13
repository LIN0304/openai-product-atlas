# OpenAI Product Atlas

An explorable pixel/ASCII history of OpenAI products, from the first public ChatGPT launch on 2022-11-30 through the latest official release-note events on 2026-07-09.

The experience has two complementary layers:

- a native **Godot 4.7** timeline world with 326 walkable/clickable nodes across 10 product regions;
- an accessible **Next.js** archive with search, filters, bilingual event details, official source links, deep links, and JSON/CSV/XLSX downloads.

## Dataset v0.1

| Layer | Records |
|---|---:|
| Raw official-source records | 948 |
| Canonical map nodes | 326 |
| Landmark nodes | 83 |
| Official source groups | 15 |
| Product regions | 10 |

The canonical layer is deliberately curated for a legible map. The raw layer is retained for provenance and future re-extraction. OpenAI release information lives across mutable Help Center pages, launch posts, and developer changelogs; this repository is therefore a reproducible official-source baseline, not a claim that every private or undocumented change is represented.

Primary entry points include [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes), [Model Release Notes](https://help.openai.com/en/articles/9624314-model-release-notes), the [API changelog](https://platform.openai.com/docs/changelog), and the [Codex changelog](https://developers.openai.com/codex/changelog/).

## Run locally

Prerequisites: Node.js 22+ and Godot 4.7 with Web export templates.

```bash
npm install
npm run data:build
npm run data:validate
npm run godot:export
npm run dev
```

If the Godot executable is not on `PATH`, prefix Godot commands with its path:

```bash
GODOT_BIN="/Applications/Godot.app/Contents/MacOS/Godot" npm run godot:export
```

Open `http://localhost:3000`. In the Godot world:

- drag to pan and use the wheel/pinch gesture to zoom;
- click or tap a node to inspect it;
- move with WASD or arrow keys, then press Enter for the nearest node;
- press `A` to toggle ASCII glyph mode and `Home` to reset the view.

## Rebuild and validate

```bash
npm run data:collect  # refresh official-source snapshots
npm run data:build
npm run godot:export
npm test
```

Research snapshots and lane QA notes live under `research/openai-timeline-v0.1/`. Generated public datasets live under `public/data/`; the canonical source copy is under `data/`.

## Architecture

```text
official OpenAI pages
        │
        ▼
source snapshots + lane records
        │
        ▼
canonical JSON / CSV / XLSX ─── accessible Next.js index
        │
        └─────────────────────── native Godot timeline world
```

## Attribution

This project is an independent historical visualization and is not an official OpenAI product. OpenAI product names belong to their respective owner. The Godot runtime is MIT-licensed. The embedded Traditional Chinese font subset is derived from Noto Sans TC under the SIL Open Font License; see `THIRD_PARTY_NOTICES.md` and the license included beside the asset.
