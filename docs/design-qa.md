# OpenAI Product Atlas design QA

## Result

The final native-web implementation has no remaining actionable P0, P1, or P2 design-QA findings at the three required viewports. The comparison state is the decoded Deep Research record (`evt-20250202-introducing-deep-research`) so the map, NOVA, record surface, controls, and responsive composition can be judged together.

## Visual truth and implementation evidence

Approved source visual truth:

- Desktop: `/Users/raylin/.codex/generated_images/019f5a87-9b76-70b0-aa12-352d39ff86ed/exec-6723d441-5028-45e3-9099-ccf88f153c28.png`
- Portrait: `/Users/raylin/.codex/generated_images/019f5a87-9b76-70b0-aa12-352d39ff86ed/exec-10b9baa4-c210-4a28-919e-8ea7e3a23bb9.png`
- Landscape: `/Users/raylin/.codex/generated_images/019f5a87-9b76-70b0-aa12-352d39ff86ed/exec-35d4864f-1f83-407c-98cc-97b538169b62.png`

Final browser-rendered implementation captures:

- Desktop, 1440 x 1024: `/Users/raylin/Coolest thing/qa-desktop-1440x1024.jpg`
- Portrait, 390 x 844: `/Users/raylin/Coolest thing/qa-portrait-390x844.jpg`
- Landscape, 844 x 390: `/Users/raylin/Coolest thing/qa-landscape-844x390.jpg`

The references and matching implementation captures were opened together at original detail for each viewport. The reference raster dimensions differ from the CSS viewport dimensions, but their aspect ratios match the intended desktop, portrait, and landscape frames. Browser chrome is absent from both sides, so the comparison uses the full product frame.

## Full-view comparison

| Viewport | State and evidence | Comparison outcome |
| --- | --- | --- |
| 1440 x 1024 | Deep Research record open over the playable archive. The implementation retains the compact editorial header, command rail, dominant release map, recent-landmark row, and high-contrast decoded-record treatment. | The source's cyan structure, magenta selected record, acid actions, square one-pixel frames, terminal density, and map-first hierarchy are preserved. The implementation uses the canonical title and longer official-source summary, so its decoded record is intentionally more information-dense than the concept copy. |
| 390 x 844 | Deep Research bottom sheet open with map context still visible above it. The measured stage is 368 x 362.9 CSS pixels. | The map appears immediately, the compact header exposes `[FILTER]`, only `[-]`, `[+]`, and `[FIT]` remain in the narrow toolbar, and the decoded-record sheet preserves title, summary, facts, source access, and close/continue actions without horizontal overflow. |
| 844 x 390 | Deep Research record docked at the right, 270 x 330.7 CSS pixels, beside the compact family rail and dominant map. | The three-column landscape composition, persistent map context, overlaid touch pad, cyan route network, magenta selected station, and docked record match the approved landscape intent. The official-source action remains visible at top 250.7 and bottom 298.7 CSS pixels. |

All three browser checks reported `document.scrollWidth === document.clientWidth`; no persistent control is clipped by horizontal viewport overflow.

## Focused-region comparison

Separate crops were not needed because the original-detail paired views made the two fidelity-critical regions legible in the same comparison input:

1. **Map and NOVA:** route lines remain family-identifiable through lane position and ASCII glyphs, selected Deep Research is magenta, NOVA is visibly distinct, and the Canvas uses the approved landmark/major/update grammar rather than conventional iconography.
2. **Decoded record and controls:** the source and implementation both use a magenta framed record, cyan metadata, white primary title and body copy, an acid official-source action, and square cyan/acid control targets. The responsive placement changes from overlay/bottom sheet/docked panel without changing information hierarchy.

No reference logo, illustration, photograph, or non-standard icon is omitted or replaced. The visual target is intentionally an ASCII/Canvas interface; no production raster imagery, emoji, handcrafted SVG, or gradient substitute is used. Canvas text and one-pixel route work remain sharp in the final captures.

## Required fidelity surfaces

- **Fonts and typography:** the implementation uses a ligature-disabled system monospace stack throughout. Uppercase labels, tight tracking, bold display headings, muted microcopy, and the white/cyan/magenta hierarchy visibly follow the source. The canonical `Introducing deep research` title wraps differently from the concept's shorter `Deep Research` label; this is expected content-driven wrapping, not truncation.
- **Spacing and layout rhythm:** square frames, one-pixel separators, compact gutters, dense command surfaces, and map-first proportions remain consistent across all three views. Portrait and landscape collapse secondary editorial material so the stage and record remain usable in the first viewport.
- **Colors and visual tokens:** the implementation visibly maps the contract palette to structure and state: `#05070B` background, `#09110F` surface, `#17312D` lines, `#58F6D0` cyan, `#D8FF5B` acid, `#FF4FD8` magenta, `#FF6F75` lifecycle warning, `#E9F0E8` text, and `#87928A` muted text. Color is redundant with text, glyph, tier, or selection state. No gradients are present.
- **Image quality and asset fidelity:** there are no source image assets to reproduce. The code-native map is the approved product surface rather than a placeholder for missing imagery, and its ASCII labels, station marks, route lines, and character are readable in the final browser captures.
- **Copy and content:** all visible product UI is English. The record title, summary, lifecycle, tier, confidence, source group, event id, date, and official-source link come from the canonical event rather than the concept's abbreviated mock copy. The baseline caveat remains visible so the archive does not overstate completeness.
- **Affordances and accessibility:** `[FILTER]`, zoom, fit, directional, read, map, source, close, and continue actions retain explicit text labels and visible focus treatment. The Canvas is a labeled focusable group with fallback instructions and a complete semantic index rather than an application role.

## Interaction, overflow, targets, and console evidence

Final checks in the local in-app browser verified:

- `[OPEN NOW]` opened the Deep Research record; `Escape` closed it and left the filter drawer closed.
- Closing an arrival-opened record and waiting 500 ms while NOVA remained stationary did not reopen the dialog.
- Five down and six up touch pulses moved NOVA out of and back into the station; the record reopened on re-entry, confirming the arrival latch rearms only after exit.
- The touch-focus interruption found during iteration was fixed by preserving held directions when the stage loses focus; the re-entry sequence above is the post-fix interaction evidence.
- Portrait: the header filter measured 44 CSS pixels high, and all D-pad and action controls measured 48 CSS pixels.
- Landscape: visible touch, header, and dialog controls measured at least 44 CSS pixels; the official-source action measured 48 CSS pixels high and remained inside the visible dialog.
- Desktop, portrait, and landscape each had equal document scroll and client widths.
- Browser console warnings: `[]`. Browser console errors: `[]`.

## Comparison history

| Iteration | Earlier finding | Fix | Post-fix evidence |
| --- | --- | --- | --- |
| Interaction | **P1:** touch-button focus transfer could interrupt a held direction before movement completed. | The runtime no longer clears `heldDirections` merely because the Canvas stage blurs; pointer-up, pointer-cancel, lost capture, button blur, pause, and teardown still terminate input. | Five down plus six up touch pulses completed, NOVA exited and re-entered the station, and the dialog reopened exactly once after re-entry. `tests/game-runtime.test.mjs` also covers cancellation and capture-loss wiring. |
| Arrival dialog | **P1 risk under test:** closing a record while still inside the station could create a reopen storm if the arrival latch were cleared. | Manual reading latches the nearest station, and close preserves the latch until the 42-unit exit threshold is crossed. | After close, a 500 ms stationary wait produced no dialog; exiting and returning produced one new dialog. The arrival-hysteresis unit test also passes. |
| Portrait resilience | **P2:** the narrow layout needed a guaranteed visible map and coarse-pointer targets rather than desktop controls compressed into the viewport. | The portrait layout gives the stage its own bounded row, moves controls into a dedicated touch region, reduces the toolbar to zoom/fit, and uses a bottom-sheet record. | `qa-portrait-390x844.jpg`: 368 x 362.9 stage, 44-pixel header filter, 48-pixel D-pad/actions, and no horizontal document overflow. |
| Landscape resilience | **P2:** source access and close controls had to remain visible beside a dominant map within 390 CSS pixels of height. | The short-landscape layout uses a 64-pixel family rail, flexible map, 270-pixel docked record, clamped copy, and 44-pixel minimum controls. | `qa-landscape-844x390.jpg`: 270 x 330.7 record, 48-pixel source action fully visible at 250.7-298.7, minimum 44-pixel controls, and no horizontal document overflow. |

No P0 finding occurred. The final paired comparison found no new actionable P0, P1, or P2 mismatch after these fixes.

## Automated release evidence

The final local verification run produced:

- TypeScript: `npx tsc --noEmit` passed.
- Lint: `npm run lint` passed.
- Unit/source contracts: 25 tests passed, 0 failed.
- Data validation: 326 canonical events, 83 landmarks, 15 official source groups, 10 product families, 948 raw records, 326 CSV rows, latest event `2026-07-09`.
- Production build: `next build` compiled successfully and generated the application routes.
- Patch hygiene: `git diff --check` passed.
- Contract coverage includes English-only client data, 283 deterministic same-family/same-date stations, 10 same-family chronological routes, search/filter behavior, stable URL state, one-shot arrival hysteresis, hidden-station exclusion, touch cancellation, reduced-motion wiring, semantic Canvas fallback, and removal of the Godot/WebAssembly distribution footprint.

## Residual P3 polish

- The desktop modal is intentionally more prominent than the concept's slim inspector because the working record includes canonical summary and provenance fields. A future density toggle could offer a compact reading mode, but the current treatment is coherent and does not block map use or source access.
- The portrait bottom sheet starts higher than the abbreviated concept sheet because the actual record title, summary, and provenance are longer. It remains bounded, scrollable, and leaves map context visible; further compression would reduce source readability.

## Implementation checklist

- [x] Compare each required viewport and Deep Research state directly with its approved reference.
- [x] Verify full-view composition and the map/NOVA plus decoded-record focused regions.
- [x] Verify English copy, ASCII grammar, palette, square surfaces, and absence of gradients or substitute imagery.
- [x] Verify arrival close/re-entry behavior and explicit record opening/closing.
- [x] Verify horizontal overflow, coarse-pointer target sizes, visible source access, and clean console output.
- [x] Pass TypeScript, lint, unit/source contracts, data validation, production build, and diff hygiene.

final result: passed
