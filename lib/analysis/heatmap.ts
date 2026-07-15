import type { ExplorerEvent, ExplorerFamily } from "../timeline/schema";
import { bucketIndexByKey, bucketKeyOf, buildTimeBuckets, type Granularity, type TimeBucket } from "./buckets.ts";
import { laneFamilies } from "./families.ts";

export interface HeatCell {
  readonly colIndex: number;
  readonly value: number;
  /** value / maxCell, 0..1. */
  readonly intensity01: number;
}

export interface HeatRow {
  readonly familyId: string;
  readonly name: string;
  readonly glyph: string;
  readonly color: string;
  readonly cells: HeatCell[];
  readonly rowTotal: number;
}

export interface HeatmapModel {
  readonly columns: TimeBucket[];
  readonly rows: HeatRow[];
  readonly maxCell: number;
}

/** Family (lane order) × time-bucket release matrix. Defaults to quarters. */
export function computeFamilyHeatmap(
  events: readonly ExplorerEvent[],
  taxonomy: readonly ExplorerFamily[],
  granularity: Granularity = "quarter",
): HeatmapModel {
  const columns = buildTimeBuckets(events, granularity);
  const indexByKey = bucketIndexByKey(columns);
  const families = laneFamilies(taxonomy);

  const grid = new Map<string, number[]>();
  for (const family of families) grid.set(family.id, new Array(columns.length).fill(0));

  for (const event of events) {
    const row = grid.get(event.product_family);
    if (!row) continue;
    const index = indexByKey.get(bucketKeyOf(event, granularity));
    if (index !== undefined) row[index] += 1;
  }

  let maxCell = 0;
  for (const row of grid.values()) {
    for (const value of row) if (value > maxCell) maxCell = value;
  }

  const rows: HeatRow[] = families.map((family) => {
    const values = grid.get(family.id) ?? new Array(columns.length).fill(0);
    return {
      familyId: family.id,
      name: family.name_en,
      glyph: family.glyph,
      color: family.color,
      rowTotal: values.reduce((sum, value) => sum + value, 0),
      cells: values.map((value, colIndex) => ({
        colIndex,
        value,
        intensity01: maxCell > 0 ? value / maxCell : 0,
      })),
    };
  });

  return { columns, rows, maxCell };
}

/**
 * Percent of the `--accent-text` hue mixed over `--surface` for a cell fill.
 * Zero is handled separately (bare surface). sqrt keeps sparse 1–2 counts
 * visible; the floor clears the 2:1 contrast band and the cap keeps in-cell
 * text legible in both skins.
 */
export function heatIntensityPct(value: number, max: number): number {
  if (value <= 0 || max <= 0) return 0;
  return Math.min(85, 20 + 65 * Math.sqrt(value / max));
}
