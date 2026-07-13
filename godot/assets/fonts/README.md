# Embedded font attribution

`NotoSansCJKtc-TimelineSubset.otf` is a glyph subset of **Noto Sans CJK TC
Regular**, used so the native Godot/Web build can render the Traditional
Chinese timeline copy consistently.

- Upstream: https://github.com/notofonts/noto-cjk
- Source file: `Sans/OTF/TraditionalChinese/NotoSansCJKtc-Regular.otf`
- Copyright: © 2014–2021 Adobe (http://www.adobe.com/).
- License: SIL Open Font License 1.1; see `OFL.txt` in this directory.
- Modification: only glyphs referenced by the v0.1 timeline JSON and Godot HUD
  were retained; font hinting was removed. No visual or metric edits were made.

This font subset is the Godot project's sole third-party visual asset. All map
geometry, icons, lane treatments, nodes, landmarks, and HUD components are
drawn at runtime with Godot primitives.

Rebuild after any timeline-data change (requires FontTools, `jq`, and `curl`):

```sh
godot/tools/rebuild_font_subset.sh
```
