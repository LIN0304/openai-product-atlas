import type { ExplorerDataset, ExplorerEvent, InitialViewState } from "./schema";

export interface TimelineFilters {
  readonly query?: string;
  readonly family?: string;
  readonly year?: string | number;
  readonly landmarksOnly?: boolean;
}

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-US")
    .replace(/\s+/g, " ")
    .trim();
}

/** English-authoritative fields only; Chinese display fields never reach this index. */
export function eventSearchText(event: ExplorerEvent): string {
  return normalizeSearchText(
    [
      event.title_en,
      event.summary_en,
      event.product,
      event.map_region,
      event.era,
      event.event_type.replaceAll("_", " "),
      event.lifecycle.replaceAll("_", " "),
      ...event.tags,
    ].join(" "),
  );
}

export function searchTimelineEvents(
  events: readonly ExplorerEvent[],
  query: string,
): ExplorerEvent[] {
  const tokens = normalizeSearchText(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return [...events];
  return events.filter((event) => {
    const haystack = eventSearchText(event);
    return tokens.every((token) => haystack.includes(token));
  });
}

export function filterTimelineEvents(
  events: readonly ExplorerEvent[],
  filters: TimelineFilters,
): ExplorerEvent[] {
  const family = filters.family?.trim() ?? "all";
  const year = filters.year === undefined ? "all" : String(filters.year).trim();
  const scoped = events.filter((event) => {
    if (family && family !== "all" && event.product_family !== family) return false;
    if (year && year !== "all" && String(event.year) !== year) return false;
    if (filters.landmarksOnly && event.node_tier !== "landmark") return false;
    return true;
  });
  return searchTimelineEvents(scoped, filters.query ?? "");
}

/**
 * Keeps a deep-linked event authoritative over incompatible filters and gives
 * filter-only URLs a deterministic active record.
 */
export function normalizeTimelineViewState(
  state: InitialViewState,
  dataset: Pick<ExplorerDataset, "events" | "taxonomy">,
): InitialViewState {
  const matches = filterTimelineEvents(dataset.events, state);
  if (state.selectedId && !matches.some((event) => event.event_id === state.selectedId)) {
    return {
      query: "",
      family: "all",
      year: "all",
      landmarksOnly: false,
      selectedId: state.selectedId,
      view: state.view,
    };
  }
  return {
    ...state,
    selectedId: state.selectedId || matches[0]?.event_id || "",
  };
}
