"use client";

import type { ExplorerFamily } from "../../lib/timeline/schema";
import { useAnalysisScope } from "./AnalysisScope";

/**
 * Shared family key. Each chip triple-encodes identity (color swatch + glyph +
 * name) so the CVD-floor palette is legal. Hover cross-highlights the family
 * across every chart; click mutes it (removed from cadence, dimmed elsewhere).
 * Colour follows the family entity — muting never repaints the survivors.
 */
export function FamilyLegend({ families }: { families: readonly ExplorerFamily[] }) {
  const { hoveredFamily, setHoveredFamily, mutedFamilies, toggleMuted } = useAnalysisScope();

  return (
    <div className="family-legend" role="group" aria-label="Product families — hover to highlight, click to toggle">
      {families.map((family) => {
        const muted = mutedFamilies.has(family.id);
        const active = hoveredFamily === family.id;
        return (
          <button
            key={family.id}
            type="button"
            className={`legend-chip${muted ? " muted" : ""}${active ? " active" : ""}`}
            aria-pressed={!muted}
            aria-label={`${family.name_en}${muted ? " (hidden)" : ""}`}
            onPointerEnter={() => setHoveredFamily(family.id)}
            onPointerLeave={() => setHoveredFamily(null)}
            onFocus={() => setHoveredFamily(family.id)}
            onBlur={() => setHoveredFamily(null)}
            onClick={() => toggleMuted(family.id)}
          >
            <span className="legend-swatch" style={{ background: family.color }} aria-hidden="true" />
            <span className="legend-glyph" aria-hidden="true">{family.glyph}</span>
            <span className="legend-name">{family.name_en}</span>
          </button>
        );
      })}
    </div>
  );
}
