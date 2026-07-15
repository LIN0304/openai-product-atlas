import type { ExplorerEvent, ExplorerFamily } from "../timeline/schema";
import { bucketIndexByKey, bucketKeyOf, buildTimeBuckets, type Granularity, type TimeBucket } from "./buckets.ts";
import { orderedFamilies } from "./families.ts";

export interface FamilyBand {
  readonly familyId: string;
  readonly name: string;
  readonly glyph: string;
  readonly color: string;
  /** Per-bucket release count, aligned 1:1 with `buckets`. */
  readonly values: number[];
  /** Cumulative count at the band's top edge, in stack order. */
  readonly cumTop: number[];
  /** Cumulative count at the band's bottom edge. */
  readonly cumBottom: number[];
  readonly total: number;
}

export interface LandmarkMark {
  readonly eventId: string;
  readonly date: string;
  readonly day: number;
  readonly bucketIndex: number;
  readonly title: string;
  readonly product: string;
  readonly familyId: string;
  readonly glyph: string;
  readonly importance: number;
}

export interface CadenceModel {
  readonly granularity: Granularity;
  readonly buckets: TimeBucket[];
  readonly bands: FamilyBand[];
  readonly totals: number[];
  readonly maxTotal: number;
  readonly peak: { index: number; bucketKey: string; value: number };
  readonly domain: { d0: number; dN: number };
}

export interface CadenceOptions {
  readonly muted?: ReadonlySet<string>;
}

/**
 * Stacked release counts per time bucket, one band per product family in the
 * CVD-verified stack order. Muted families are dropped and totals re-summed so
 * the total line stays honest.
 */
export function computeCadence(
  events: readonly ExplorerEvent[],
  taxonomy: readonly ExplorerFamily[],
  granularity: Granularity,
  options: CadenceOptions = {},
): CadenceModel {
  const muted = options.muted ?? new Set<string>();
  const buckets = buildTimeBuckets(events, granularity);
  const indexByKey = bucketIndexByKey(buckets);
  const families = orderedFamilies(taxonomy).filter((family) => !muted.has(family.id));

  const perFamily = new Map<string, number[]>();
  for (const family of families) perFamily.set(family.id, new Array(buckets.length).fill(0));

  for (const event of events) {
    const row = perFamily.get(event.product_family);
    if (!row) continue; // muted or unknown family
    const index = indexByKey.get(bucketKeyOf(event, granularity));
    if (index !== undefined) row[index] += 1;
  }

  const totals = new Array(buckets.length).fill(0);
  const bands: FamilyBand[] = [];
  const runningBottom = new Array(buckets.length).fill(0);

  for (const family of families) {
    const values = perFamily.get(family.id) ?? new Array(buckets.length).fill(0);
    const cumBottom = runningBottom.slice();
    const cumTop = cumBottom.map((bottom, index) => bottom + values[index]);
    let total = 0;
    for (let index = 0; index < values.length; index += 1) {
      runningBottom[index] += values[index];
      totals[index] += values[index];
      total += values[index];
    }
    bands.push({
      familyId: family.id,
      name: family.name_en,
      glyph: family.glyph,
      color: family.color,
      values,
      cumTop,
      cumBottom,
      total,
    });
  }

  let peakIndex = 0;
  for (let index = 1; index < totals.length; index += 1) {
    if (totals[index] > totals[peakIndex]) peakIndex = index;
  }
  const maxTotal = totals.length ? totals[peakIndex] : 0;

  return {
    granularity,
    buckets,
    bands,
    totals,
    maxTotal,
    peak: {
      index: peakIndex,
      bucketKey: buckets[peakIndex]?.key ?? "",
      value: maxTotal,
    },
    domain: {
      d0: buckets[0]?.midDay ?? 0,
      dN: buckets[buckets.length - 1]?.midDay ?? 1,
    },
  };
}

/** Landmark markers ranked by importance then recency, capped to `limit`. */
export function selectCadenceLandmarks(
  events: readonly ExplorerEvent[],
  buckets: readonly TimeBucket[],
  granularity: Granularity,
  limit = 6,
): LandmarkMark[] {
  const indexByKey = bucketIndexByKey(buckets);
  return events
    .filter((event) => event.node_tier === "landmark")
    .slice()
    .sort((a, b) => b.importance - a.importance || b.date.localeCompare(a.date))
    .slice(0, limit)
    .map((event) => ({
      eventId: event.event_id,
      date: event.date,
      day: event.day_index,
      bucketIndex: indexByKey.get(bucketKeyOf(event, granularity)) ?? 0,
      title: event.title_en,
      product: event.product,
      familyId: event.product_family,
      glyph: event.glyph,
      importance: event.importance,
    }))
    .sort((a, b) => a.day - b.day);
}

/**
 * Per-bucket bottom offset (in count units) that vertically centres each
 * bucket's stack — the "silhouette" streamgraph baseline. Reduced-motion just
 * snaps between this and a flat zero baseline.
 */
export function streamBaseline(totals: readonly number[]): number[] {
  let max = 0;
  for (const total of totals) if (total > max) max = total;
  return totals.map((total) => (max - total) / 2);
}
