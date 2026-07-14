import type { ExplorerEvent } from "../timeline/schema";

export type Granularity = "month" | "quarter";

export interface TimeBucket {
  readonly key: string;
  readonly label: string;
  readonly shortLabel: string;
  readonly year: number;
  readonly index: number;
  /** Day offset (day_index units) of the bucket's first calendar day. */
  readonly startDay: number;
  readonly midDay: number;
  readonly endDay: number;
  /** First bucket of a calendar year (drives axis year separators). */
  readonly isYearStart: boolean;
}

const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function epochDay(year: number, month: number, day: number): number {
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

function parseIso(iso: string): { year: number; month: number; day: number } {
  return { year: Number(iso.slice(0, 4)), month: Number(iso.slice(5, 7)), day: Number(iso.slice(8, 10)) };
}

/** quarter -> `${year}-Q${n}` (e.g. "2025-Q1"); month -> ISO year-month (e.g. "2025-03"). */
export function bucketKeyOf(event: ExplorerEvent, granularity: Granularity): string {
  if (granularity === "month") return event.date.slice(0, 7);
  const { month } = parseIso(event.date);
  const quarter = Math.floor((month - 1) / 3) + 1;
  return `${event.year}-Q${quarter}`;
}

/**
 * Contiguous, gap-filled buckets from the first to the last event, index-ordered.
 * Empty buckets are retained (they render as zeros) so time reads to scale. Day
 * offsets are measured from the first event's calendar day so they line up with
 * `event.day_index` (which is days since the first event).
 */
export function buildTimeBuckets(events: readonly ExplorerEvent[], granularity: Granularity): TimeBucket[] {
  if (events.length === 0) return [];
  const first = parseIso(events[0].date);
  const last = parseIso(events[events.length - 1].date);
  const origin = epochDay(first.year, first.month, first.day);
  const dayOffset = (year: number, month: number, day: number): number => epochDay(year, month, day) - origin;

  const buckets: TimeBucket[] = [];

  if (granularity === "quarter") {
    let year = first.year;
    let quarter = Math.floor((first.month - 1) / 3) + 1;
    const lastQuarter = Math.floor((last.month - 1) / 3) + 1;
    let index = 0;
    while (year < last.year || (year === last.year && quarter <= lastQuarter)) {
      const startMonth = (quarter - 1) * 3 + 1;
      let nextYear = year;
      let nextQuarter = quarter + 1;
      if (nextQuarter > 4) { nextQuarter = 1; nextYear += 1; }
      const startDay = dayOffset(year, startMonth, 1);
      const endDay = dayOffset(nextYear, (nextQuarter - 1) * 3 + 1, 1) - 1;
      buckets.push({
        key: `${year}-Q${quarter}`,
        label: `Q${quarter} ${year}`,
        shortLabel: `Q${quarter} '${String(year).slice(2)}`,
        year,
        index,
        startDay,
        midDay: (startDay + endDay) / 2,
        endDay,
        isYearStart: index === 0 || buckets[index - 1].year !== year,
      });
      index += 1;
      quarter = nextQuarter;
      year = nextYear;
    }
    return buckets;
  }

  let year = first.year;
  let month = first.month;
  let index = 0;
  while (year < last.year || (year === last.year && month <= last.month)) {
    let nextYear = year;
    let nextMonth = month + 1;
    if (nextMonth > 12) { nextMonth = 1; nextYear += 1; }
    const startDay = dayOffset(year, month, 1);
    const endDay = dayOffset(nextYear, nextMonth, 1) - 1;
    buckets.push({
      key: `${year}-${String(month).padStart(2, "0")}`,
      label: `${MONTHS_FULL[month - 1]} ${year}`,
      shortLabel: `${MONTHS_ABBR[month - 1]} '${String(year).slice(2)}`,
      year,
      index,
      startDay,
      midDay: (startDay + endDay) / 2,
      endDay,
      isYearStart: index === 0 || buckets[index - 1].year !== year,
    });
    index += 1;
    month = nextMonth;
    year = nextYear;
  }
  return buckets;
}

/** Index of the bucket whose day span contains `day`, clamped to the ends. */
export function bucketIndexForDay(buckets: readonly TimeBucket[], day: number): number {
  if (buckets.length === 0) return -1;
  for (const bucket of buckets) {
    if (day >= bucket.startDay && day <= bucket.endDay) return bucket.index;
  }
  return day < buckets[0].startDay ? 0 : buckets.length - 1;
}

/** Map of bucket key -> column index for O(1) event bucketing. */
export function bucketIndexByKey(buckets: readonly TimeBucket[]): Map<string, number> {
  return new Map(buckets.map((bucket) => [bucket.key, bucket.index]));
}
