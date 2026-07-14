import type { ExplorerDataset, InitialViewState, TimelineViewMode } from "./schema";

export type TimelineSearchRecord = Record<string, string | readonly string[] | undefined>;
export type TimelineViewStateInput = string | URLSearchParams | TimelineSearchRecord;

export const DEFAULT_VIEW_STATE: InitialViewState = Object.freeze({
  query: "",
  family: "all",
  year: "all",
  landmarksOnly: false,
  selectedId: "",
  view: "map",
});

export const TIMELINE_ROUTE_HISTORY_KEY = "atlasRouteEventId";

/**
 * A selected event is not necessarily a route request. Only history entries
 * created by an explicit NOVA route may replay character movement.
 */
export function timelineRouteEventFromHistory(
  historyState: unknown,
  selectedId: string,
  validIds: ReadonlySet<string>,
): string {
  if (!historyState || typeof historyState !== "object") return "";
  const candidate = (historyState as Record<string, unknown>)[TIMELINE_ROUTE_HISTORY_KEY];
  return typeof candidate === "string" && candidate === selectedId && validIds.has(candidate)
    ? candidate
    : "";
}

function first(value: string | readonly string[] | undefined): string {
  if (typeof value === "string") return value;
  return value?.[0] ?? "";
}

function toSearchParams(input: TimelineViewStateInput): URLSearchParams {
  if (input instanceof URLSearchParams) return new URLSearchParams(input);
  if (typeof input === "string") return new URLSearchParams(input.startsWith("?") ? input.slice(1) : input);
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    const resolved = first(value);
    if (resolved) params.set(key, resolved);
  }
  return params;
}

function cleanQuery(value: string): string {
  return value.replace(/\s+/g, " ").trim().slice(0, 200);
}

export function parseTimelineViewState(
  input: TimelineViewStateInput,
  dataset: Pick<ExplorerDataset, "events" | "taxonomy">,
): InitialViewState {
  const params = toSearchParams(input);
  const families = new Set(dataset.taxonomy.map((family) => family.id));
  const years = new Set(dataset.events.map((event) => String(event.year)));
  const eventIds = new Set(dataset.events.map((event) => event.event_id));
  const family = params.get("family") ?? "";
  const year = params.get("year") ?? "";
  const event = params.get("event") ?? "";
  const rawView = params.get("view");
  const view: TimelineViewMode = rawView === "index" ? "index" : rawView === "analysis" ? "analysis" : "map";

  return {
    query: cleanQuery(params.get("q") ?? ""),
    family: families.has(family) ? family : "all",
    year: years.has(year) ? year : "all",
    landmarksOnly: params.get("landmarks") === "1",
    selectedId: eventIds.has(event) ? event : "",
    view,
  };
}

export function timelineViewStateSearchParams(state: InitialViewState): URLSearchParams {
  const params = new URLSearchParams();
  const query = cleanQuery(state.query);
  if (query) params.set("q", query);
  if (state.family && state.family !== "all") params.set("family", state.family);
  if (state.year && state.year !== "all") params.set("year", state.year);
  if (state.landmarksOnly) params.set("landmarks", "1");
  if (state.selectedId) params.set("event", state.selectedId);
  if (state.view !== "map") params.set("view", state.view);
  return params;
}

/** Stable parameter order: q, family, year, landmarks, event, view. */
export function serializeTimelineViewState(state: InitialViewState): string {
  return timelineViewStateSearchParams(state).toString();
}
