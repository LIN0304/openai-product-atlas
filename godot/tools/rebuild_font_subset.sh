#!/usr/bin/env bash
set -euo pipefail

GODOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_FONT="${TMPDIR:-/tmp}/NotoSansCJKtc-Regular.otf"
CORPUS="${TMPDIR:-/tmp}/openai-timeline-glyph-corpus.txt"
OUTPUT="$GODOT_DIR/assets/fonts/NotoSansCJKtc-TimelineSubset.otf"

if ! command -v pyftsubset >/dev/null 2>&1; then
  echo "FontTools is required (missing pyftsubset)." >&2
  exit 1
fi

if [[ ! -s "$SOURCE_FONT" ]]; then
  curl -fL \
    "https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/OTF/TraditionalChinese/NotoSansCJKtc-Regular.otf" \
    -o "$SOURCE_FONT"
fi

{
  jq -r '.. | strings' "$GODOT_DIR/data/openai-product-timeline-v0.1.json"
  sed -n '1,900p' "$GODOT_DIR/main.gd"
} > "$CORPUS"

pyftsubset "$SOURCE_FONT" \
  --text-file="$CORPUS" \
  --output-file="$OUTPUT" \
  --layout-features='*' \
  --glyph-names \
  --symbol-cmap \
  --legacy-cmap \
  --notdef-glyph \
  --notdef-outline \
  --recommended-glyphs \
  --name-IDs='*' \
  --name-legacy \
  --name-languages='*' \
  --no-hinting

echo "Rebuilt $OUTPUT"
