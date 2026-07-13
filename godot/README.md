# OpenAI Product Atlas — Godot world

This directory is a standalone Godot 4.7 project. It renders the canonical
timeline JSON as a navigable pixel/ASCII map; the surrounding Next.js app is
not required to run the world locally.

## Run locally

```sh
/path/to/Godot --editor --path godot
```

Or start the project directly:

```sh
/path/to/Godot --path godot
```

## Controls

| Input | Action |
| --- | --- |
| Mouse/touch drag | Pan the map |
| Wheel/pinch or `+` / `-` | Zoom |
| Click/tap a node | Inspect the event |
| WASD / arrow keys | Move the archivist |
| Enter | Inspect the nearest node |
| `A` | Toggle pixel/ASCII nodes |
| `R` or Home | Reset the camera |
| `F` | Focus the selected node |

## Data contract

The world loads `data/openai-product-timeline-v0.1.json` at runtime and checks
its manifest counts before drawing. The v0.1 map contract is 326 event nodes,
83 landmarks, and 10 product-family regions. Every source button opens the
canonical OpenAI URL stored on the selected event.

If the timeline JSON changes, regenerate the embedded CJK glyph subset:

```sh
godot/tools/rebuild_font_subset.sh
```

## Web export

Install the Godot 4.7 Web export templates, then run:

```sh
/path/to/Godot --headless --path godot \
  --export-release Web ../public/godot/index.html
```

The Web preset is single-threaded, uses the compatibility renderer, and does
not require cross-origin isolation headers. The generated `public/godot/`
bundle is ready to be served as static assets or embedded in an iframe.

The only bundled third-party visual asset is the OFL-licensed Noto Sans CJK TC
glyph subset used for portable Traditional Chinese rendering; see
`assets/fonts/README.md` and `assets/fonts/OFL.txt`.
