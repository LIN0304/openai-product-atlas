import type { ExplorerEvent } from "../timeline/schema";
import { bucketIndexForDay, type TimeBucket } from "./buckets.ts";

/** OpenAI's product phases in chronological order (annotation, never causation). */
export const ERA_ORDER: readonly string[] = [
  "Research Preview",
  "Platform Expansion",
  "Omni & Reasoning",
  "Agentic Shift",
  "Unified Intelligence",
];

export interface EraBand {
  readonly era: string;
  readonly startIndex: number;
  readonly endIndex: number;
  readonly startDay: number;
  readonly endDay: number;
  readonly count: number;
  readonly firstDate: string;
  readonly lastDate: string;
}

/**
 * The first/last occupied day + bucket index of each era present, ordered
 * chronologically. Purely an annotation layer for the cadence chart.
 */
export function computeEraBands(
  events: readonly ExplorerEvent[],
  buckets: readonly TimeBucket[],
): EraBand[] {
  const byEra = new Map<string, ExplorerEvent[]>();
  for (const event of events) {
    const list = byEra.get(event.era);
    if (list) list.push(event);
    else byEra.set(event.era, [event]);
  }

  const bands: EraBand[] = [];
  for (const era of ERA_ORDER) {
    const list = byEra.get(era);
    if (!list || list.length === 0) continue;
    let startDay = list[0].day_index;
    let endDay = list[0].day_index;
    let firstDate = list[0].date;
    let lastDate = list[0].date;
    for (const event of list) {
      if (event.day_index < startDay) startDay = event.day_index;
      if (event.day_index > endDay) endDay = event.day_index;
      if (event.date < firstDate) firstDate = event.date;
      if (event.date > lastDate) lastDate = event.date;
    }
    bands.push({
      era,
      count: list.length,
      startDay,
      endDay,
      startIndex: bucketIndexForDay(buckets, startDay),
      endIndex: bucketIndexForDay(buckets, endDay),
      firstDate,
      lastDate,
    });
  }
  return bands;
}
