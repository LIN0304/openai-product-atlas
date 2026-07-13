# OpenAI Product Atlas: approved implementation contract

## Approval

- Approved by the user on 2026-07-13.
- Approved references:
  - Desktop: `exec-6723d441-5028-45e3-9099-ccf88f153c28.png`
  - Mobile portrait: `exec-10b9baa4-c210-4a28-919e-8ea7e3a23bb9.png`
  - Mobile landscape: `exec-35d4864f-1f83-407c-98cc-97b538169b62.png`
- Direction: combine the editorial hierarchy of concept 1 with the transit-map workspace of concept 3.
- Presentation: English-only, ASCII-first, with a restrained cyberpunk palette.
- Runtime: native React and Canvas2D. No game engine, iframe, WebAssembly, WebGL, or Godot.

## Product truth

The map is an official-source baseline, not a claim of mathematical completeness. It contains 326 canonical events, 83 landmarks, 10 product families, 15 official source groups, and 948 preserved raw records from 2022-11-30 through 2026-07-09. Living release-note pages may change after extraction.

Time maps to the horizontal axis. Product family maps to the vertical axis. Only consecutive events in the same product family may be connected. Year guides and gameplay waypoints must never look like evidence of causal relationships. A visited event means that its record was opened in this browser, not that it was completed or endorsed.

## Interaction contract

- The playable character is `NOVA`.
- Keyboard: WASD or arrow keys move while the stage has focus; Enter reads; `/` focuses search; `+` and `-` zoom; Home fits the world; Escape closes a record.
- Pointer: selecting a station creates a waypoint; explicit `[ROUTE]` and `[OPEN NOW]` actions remain available.
- Touch: four 48-pixel directional controls plus `[READ]`; pointer cancellation and lost capture clear held movement.
- Arrival enters at 26 world units and rearms only after leaving 42 world units. A record opens once per entry and never storms while the player is stationary.
- Manual input cancels automatic routing. Opening a record pauses movement. Closing restores focus without clearing the arrival latch.
- Same-family, same-date events form one station. Multi-event stations expose deterministic previous/next navigation.
- URL state is limited to `q`, `family`, `year`, `landmarks`, `event`, and optional `view`; per-frame position is never serialized.

## Responsive contract

- Desktop at 1440 x 1024: compact editorial header, a 224-pixel command rail, dominant map, and roughly 328-pixel event inspector.
- Portrait at 390 x 844: the map appears immediately; controls overlay its lower edge; event and filter panels are bottom sheets that leave map context visible.
- Landscape at 844 x 390: 40-pixel header, compact family rail, dominant map, and docked right-side record panel.
- A full semantic event index is the non-spatial alternative at every viewport.

## ASCII and color grammar

- Landmark: `[X]*`
- Major: `<X>`
- Update: `X.`
- Selected: `>[X]<`
- Visited: `[X]+`
- Waypoint: `...>`
- Distant player: `@`
- Close player: `[::]`, `/|\\`, `/ \\`
- Background: `#05070B`
- Surface: `#09110F`
- Structural line: `#17312D`
- Primary cyan: `#58F6D0`
- Selection acid: `#D8FF5B`
- Waypoint magenta: `#FF4FD8`
- Lifecycle warning: `#FF6F75`
- Primary text: `#E9F0E8`
- Muted text: `#87928A`

Square corners, one-pixel borders, no gradients, no emoji, and no Unicode graphic symbols. Color is always redundant with text, glyph, tier, or state.

## Accessibility and motion

The Canvas is wrapped by a focusable labeled group, never `role="application"`. It has visible instructions, fallback text, a live arrival region, a real HTML record dialog or equivalent semantic panel, and a complete searchable HTML index. Focus returns to the stage after close. Coarse-pointer targets are at least 44 pixels. Reduced motion removes smooth camera movement, pulsing, and leg animation while preserving discrete navigation, record opening, search, filters, and source access.

## Release gates

- All 326 events remain searchable, selectable, and source-linked.
- All 10 family routes remain identifiable without color.
- All visible product copy and metadata are English.
- No Godot, iframe, `.wasm`, or `.pck` runtime remains.
- Arrival, close/re-entry, URL restoration, keyboard, touch, reduced motion, and the semantic index are verified.
- Desktop, portrait, and landscape implementations are compared directly with their approved references.
- `design-qa.md` records visual and interaction evidence and ends with `final result: passed`.
