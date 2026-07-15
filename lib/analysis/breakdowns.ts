import type { ExplorerDataset, ExplorerEvent } from "../timeline/schema";
import { ERA_ORDER } from "./eras.ts";

const MONTHS_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface YearCount {
  readonly year: number;
  readonly count: number;
}

export interface Kpis {
  readonly totalEvents: number;
  readonly modelReleases: number;
  readonly landmarks: number;
  readonly families: number;
  readonly sources: number;
  readonly spanMonths: number;
  readonly spanLabel: string;
  readonly peakYear: YearCount;
  readonly perYear: readonly YearCount[];
}

function sentenceCase(value: string): string {
  const spaced = value.replaceAll("_", " ").trim();
  return spaced.length === 0 ? spaced : spaced[0].toUpperCase() + spaced.slice(1);
}

function monthLabel(iso: string): string {
  return `${MONTHS_ABBR[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
}

/** Zero-filled per-year counts across the full span, ascending by year. */
export function perYearCounts(events: readonly ExplorerEvent[]): YearCount[] {
  if (events.length === 0) return [];
  let min = events[0].year;
  let max = events[0].year;
  const counts = new Map<number, number>();
  for (const event of events) {
    counts.set(event.year, (counts.get(event.year) ?? 0) + 1);
    if (event.year < min) min = event.year;
    if (event.year > max) max = event.year;
  }
  const result: YearCount[] = [];
  for (let year = min; year <= max; year += 1) {
    result.push({ year, count: counts.get(year) ?? 0 });
  }
  return result;
}

export function computeKpis(
  dataset: Pick<ExplorerDataset, "events" | "sources" | "taxonomy" | "period">,
): Kpis {
  const { events, sources, taxonomy, period } = dataset;
  const perYear = perYearCounts(events);
  const peakYear = perYear.reduce<YearCount>(
    (peak, current) => (current.count > peak.count ? current : peak),
    perYear[0] ?? { year: 0, count: 0 },
  );
  const start = period.start;
  const end = period.latest_event;
  const spanMonths =
    (Number(end.slice(0, 4)) - Number(start.slice(0, 4))) * 12 +
    (Number(end.slice(5, 7)) - Number(start.slice(5, 7)));

  return {
    totalEvents: events.length,
    modelReleases: events.filter((event) => event.event_type === "model_release").length,
    landmarks: events.filter((event) => event.node_tier === "landmark").length,
    families: taxonomy.length,
    sources: sources.length,
    spanMonths,
    spanLabel: `${monthLabel(start)} – ${monthLabel(end)}`,
    peakYear,
    perYear,
  };
}

export type Dimension = "event_type" | "lifecycle" | "era";

export interface BreakdownBar {
  readonly key: string;
  readonly label: string;
  readonly count: number;
  /** Share of the whole dataset, 0..1. */
  readonly pct: number;
}

/**
 * Counts per dimension value. `era` keeps chronological ERA_ORDER (time's
 * arrow); every other dimension is count-descending, ties broken by key.
 */
export function computeBreakdown(events: readonly ExplorerEvent[], dimension: Dimension): BreakdownBar[] {
  const total = events.length || 1;
  const counts = new Map<string, number>();
  for (const event of events) {
    const key = event[dimension];
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const toBar = (key: string, count: number): BreakdownBar => ({
    key,
    label: dimension === "era" ? key : sentenceCase(key),
    count,
    pct: count / total,
  });

  if (dimension === "era") {
    return ERA_ORDER.filter((era) => counts.has(era)).map((era) => toBar(era, counts.get(era) ?? 0));
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([key, count]) => toBar(key, count));
}
