export type NodeTier = "landmark" | "major" | "update";

export type TimelineViewMode = "map" | "index";

export interface ExplorerSourceRef {
  readonly id: string;
  readonly name: string;
  readonly url: string;
}

export interface ExplorerFamily {
  readonly id: string;
  readonly name_en: string;
  readonly region: string;
  readonly glyph: string;
  readonly color: string;
  readonly lane: number;
}

export interface ExplorerEvent {
  readonly event_id: string;
  readonly date: string;
  readonly year: number;
  readonly quarter: string;
  readonly day_index: number;
  readonly era: string;
  readonly product_family: string;
  readonly product: string;
  readonly event_type: string;
  readonly title_en: string;
  readonly summary_en: string;
  readonly importance: number;
  readonly node_tier: NodeTier;
  readonly lifecycle: string;
  readonly map_region: string;
  readonly map_lane: number;
  readonly glyph: string;
  readonly color: string;
  readonly x_hint: number;
  readonly y_hint: number;
  readonly source_name: string;
  readonly source_url: string;
  readonly source_kind: string;
  readonly source_refs: readonly ExplorerSourceRef[];
  readonly coverage_status: string;
  readonly confidence: string;
  readonly tags: readonly string[];
}

export interface ExplorerSource {
  readonly id: string;
  readonly title: string;
  readonly url: string;
  readonly source_kind: string;
  readonly product_scope: readonly string[];
  readonly retrieved_at: string;
  readonly status: string;
  readonly coverage_status: string;
}

export interface ExplorerPeriod {
  readonly start: string;
  readonly cutoff: string;
  readonly latest_event: string;
}

export interface ExplorerStats {
  readonly raw_official_entries: number;
  readonly canonical_map_nodes: number;
  readonly landmarks: number;
  readonly official_source_records: number;
  readonly product_families: number;
  readonly cross_source_corroborations: number;
}

export interface ExplorerMethodology {
  readonly scope: string;
  readonly source_policy: string;
  readonly canonicalization: string;
  readonly completeness_boundary: string;
  readonly translation_boundary: string;
}

export interface ExplorerDataset {
  readonly schema_version: string;
  readonly title_en: string;
  readonly generated_at: string;
  readonly retrieved_at: string;
  readonly period: ExplorerPeriod;
  readonly stats: ExplorerStats;
  readonly methodology: ExplorerMethodology;
  readonly taxonomy: readonly ExplorerFamily[];
  readonly sources: readonly ExplorerSource[];
  readonly events: readonly ExplorerEvent[];
}

/** Compatibility name for server modules that refer to the canonical payload. */
export type TimelineDataset = ExplorerDataset;

export interface InitialViewState {
  readonly query: string;
  readonly family: string;
  readonly year: string;
  readonly landmarksOnly: boolean;
  readonly selectedId: string;
  readonly view: TimelineViewMode;
}

type UnknownRecord = Record<string, unknown>;

const NODE_TIERS = new Set<NodeTier>(["landmark", "major", "update"]);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export class TimelineDataError extends TypeError {
  constructor(message: string) {
    super(`Invalid timeline dataset: ${message}`);
    this.name = "TimelineDataError";
  }
}

function record(value: unknown, path: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TimelineDataError(`${path} must be an object`);
  }
  return value as UnknownRecord;
}

function array(value: unknown, path: string): readonly unknown[] {
  if (!Array.isArray(value)) {
    throw new TimelineDataError(`${path} must be an array`);
  }
  return value;
}

function string(value: unknown, path: string, allowEmpty = false): string {
  if (typeof value !== "string" || (!allowEmpty && value.trim().length === 0)) {
    throw new TimelineDataError(`${path} must be ${allowEmpty ? "a string" : "a non-empty string"}`);
  }
  return value;
}

function finiteNumber(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TimelineDataError(`${path} must be a finite number`);
  }
  return value;
}

function integer(value: unknown, path: string): number {
  const result = finiteNumber(value, path);
  if (!Number.isInteger(result)) {
    throw new TimelineDataError(`${path} must be an integer`);
  }
  return result;
}

function isoDate(value: unknown, path: string): string {
  const result = string(value, path);
  const match = ISO_DATE.exec(result);
  if (!match) {
    throw new TimelineDataError(`${path} must be an ISO date`);
  }
  const [year, month, day] = result.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new TimelineDataError(`${path} must be a valid calendar date`);
  }
  return result;
}

function httpUrl(value: unknown, path: string): string {
  const result = string(value, path);
  let parsed: URL;
  try {
    parsed = new URL(result);
  } catch {
    throw new TimelineDataError(`${path} must be an absolute URL`);
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new TimelineDataError(`${path} must use http or https`);
  }
  return result;
}

function stringArray(value: unknown, path: string): readonly string[] {
  return array(value, path).map((item, index) => string(item, `${path}[${index}]`, true));
}

function sourceRef(value: unknown, path: string): ExplorerSourceRef {
  const input = record(value, path);
  return {
    id: string(input.id, `${path}.id`),
    name: string(input.name, `${path}.name`),
    url: httpUrl(input.url, `${path}.url`),
  };
}

function family(value: unknown, index: number): ExplorerFamily {
  const path = `taxonomy[${index}]`;
  const input = record(value, path);
  return {
    id: string(input.id, `${path}.id`),
    name_en: string(input.name_en, `${path}.name_en`),
    region: string(input.region, `${path}.region`),
    glyph: string(input.glyph, `${path}.glyph`),
    color: string(input.color, `${path}.color`),
    lane: integer(input.lane, `${path}.lane`),
  };
}

function event(value: unknown, index: number): ExplorerEvent {
  const path = `events[${index}]`;
  const input = record(value, path);
  const nodeTier = string(input.node_tier, `${path}.node_tier`);
  if (!NODE_TIERS.has(nodeTier as NodeTier)) {
    throw new TimelineDataError(`${path}.node_tier must be landmark, major, or update`);
  }

  const date = isoDate(input.date, `${path}.date`);
  const year = integer(input.year, `${path}.year`);
  if (year !== Number(date.slice(0, 4))) {
    throw new TimelineDataError(`${path}.year must match ${path}.date`);
  }

  return {
    event_id: string(input.event_id, `${path}.event_id`),
    date,
    year,
    quarter: string(input.quarter, `${path}.quarter`),
    day_index: integer(input.day_index, `${path}.day_index`),
    era: string(input.era, `${path}.era`),
    product_family: string(input.product_family, `${path}.product_family`),
    product: string(input.product, `${path}.product`),
    event_type: string(input.event_type, `${path}.event_type`),
    title_en: string(input.title_en, `${path}.title_en`),
    summary_en: string(input.summary_en, `${path}.summary_en`),
    importance: integer(input.importance, `${path}.importance`),
    node_tier: nodeTier as NodeTier,
    lifecycle: string(input.lifecycle, `${path}.lifecycle`),
    map_region: string(input.map_region, `${path}.map_region`),
    map_lane: integer(input.map_lane, `${path}.map_lane`),
    glyph: string(input.glyph, `${path}.glyph`),
    color: string(input.color, `${path}.color`),
    x_hint: finiteNumber(input.x_hint, `${path}.x_hint`),
    y_hint: finiteNumber(input.y_hint, `${path}.y_hint`),
    source_name: string(input.source_name, `${path}.source_name`),
    source_url: httpUrl(input.source_url, `${path}.source_url`),
    source_kind: string(input.source_kind, `${path}.source_kind`),
    source_refs: array(input.source_refs, `${path}.source_refs`).map((item, sourceIndex) =>
      sourceRef(item, `${path}.source_refs[${sourceIndex}]`),
    ),
    coverage_status: string(input.coverage_status, `${path}.coverage_status`),
    confidence: string(input.confidence, `${path}.confidence`),
    tags: stringArray(input.tags, `${path}.tags`),
  };
}

function source(value: unknown, index: number): ExplorerSource {
  const path = `sources[${index}]`;
  const input = record(value, path);
  return {
    id: string(input.id, `${path}.id`),
    title: string(input.title, `${path}.title`),
    url: httpUrl(input.url, `${path}.url`),
    source_kind: string(input.sourceKind, `${path}.sourceKind`),
    product_scope: stringArray(input.productScope, `${path}.productScope`),
    retrieved_at: string(input.retrievedAt, `${path}.retrievedAt`),
    status: string(input.status, `${path}.status`),
    coverage_status: string(input.coverage_status, `${path}.coverage_status`),
  };
}

function compareEvents(a: ExplorerEvent, b: ExplorerEvent): number {
  return a.date.localeCompare(b.date) || a.map_lane - b.map_lane || a.event_id.localeCompare(b.event_id);
}

function assertUnique(values: readonly string[], path: string): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      throw new TimelineDataError(`${path} contains duplicate id ${value}`);
    }
    seen.add(value);
  }
}

/**
 * Validates the canonical dataset at the server boundary and strips every
 * Chinese-only/display-only field before the payload crosses into the client.
 */
export function prepareExplorerDataset(value: unknown): ExplorerDataset {
  const input = record(value, "root");
  const taxonomy = array(input.taxonomy, "taxonomy").map(family);
  const sources = array(input.sources, "sources").map(source);
  const events = array(input.events, "events").map(event).sort(compareEvents);

  assertUnique(taxonomy.map((item) => item.id), "taxonomy");
  assertUnique(sources.map((item) => item.id), "sources");
  assertUnique(events.map((item) => item.event_id), "events");

  const familyById = new Map(taxonomy.map((item) => [item.id, item]));
  for (const item of events) {
    const owningFamily = familyById.get(item.product_family);
    if (!owningFamily) {
      throw new TimelineDataError(`event ${item.event_id} references unknown family ${item.product_family}`);
    }
    if (item.map_lane !== owningFamily.lane) {
      throw new TimelineDataError(`event ${item.event_id} map_lane does not match family lane`);
    }
  }

  const periodInput = record(input.period, "period");
  const statsInput = record(input.stats, "stats");
  const methodologyInput = record(input.methodology, "methodology");
  const period: ExplorerPeriod = {
    start: isoDate(periodInput.start, "period.start"),
    cutoff: isoDate(periodInput.cutoff, "period.cutoff"),
    latest_event: isoDate(periodInput.latest_event, "period.latest_event"),
  };
  const stats: ExplorerStats = {
    raw_official_entries: integer(statsInput.raw_official_entries, "stats.raw_official_entries"),
    canonical_map_nodes: integer(statsInput.canonical_map_nodes, "stats.canonical_map_nodes"),
    landmarks: integer(statsInput.landmarks, "stats.landmarks"),
    official_source_records: integer(statsInput.official_source_records, "stats.official_source_records"),
    product_families: integer(statsInput.product_families, "stats.product_families"),
    cross_source_corroborations: integer(
      statsInput.cross_source_corroborations,
      "stats.cross_source_corroborations",
    ),
  };

  if (stats.canonical_map_nodes !== events.length) {
    throw new TimelineDataError("stats.canonical_map_nodes must match events.length");
  }
  if (stats.landmarks !== events.filter((item) => item.node_tier === "landmark").length) {
    throw new TimelineDataError("stats.landmarks must match landmark events");
  }
  if (stats.official_source_records !== sources.length) {
    throw new TimelineDataError("stats.official_source_records must match sources.length");
  }
  if (stats.product_families !== taxonomy.length) {
    throw new TimelineDataError("stats.product_families must match taxonomy.length");
  }
  if (events[0]?.date !== period.start || events.at(-1)?.date !== period.latest_event) {
    throw new TimelineDataError("period boundaries must match the canonical event range");
  }

  return {
    schema_version: string(input.schema_version, "schema_version"),
    title_en: string(input.title_en, "title_en"),
    generated_at: string(input.generated_at, "generated_at"),
    retrieved_at: string(input.retrieved_at, "retrieved_at"),
    period,
    stats,
    methodology: {
      scope: string(methodologyInput.scope, "methodology.scope"),
      source_policy: string(methodologyInput.source_policy, "methodology.source_policy"),
      canonicalization: string(methodologyInput.canonicalization, "methodology.canonicalization"),
      completeness_boundary: string(methodologyInput.completeness_boundary, "methodology.completeness_boundary"),
      translation_boundary: string(methodologyInput.translation_boundary, "methodology.translation_boundary"),
    },
    taxonomy,
    sources,
    events,
  };
}
