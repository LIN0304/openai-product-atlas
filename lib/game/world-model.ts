import type { ExplorerDataset, ExplorerEvent, NodeTier } from "../timeline/schema";

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface WorldBounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
  readonly width: number;
  readonly height: number;
}

export interface TimelineStation extends Point {
  readonly id: string;
  readonly familyId: string;
  readonly lane: number;
  readonly date: string;
  readonly year: number;
  readonly eventIds: readonly string[];
  readonly events: readonly ExplorerEvent[];
  readonly primaryEventId: string;
  readonly tier: NodeTier;
  readonly importance: number;
  readonly glyph: string;
  readonly color: string;
  readonly mapRegion: string;
}

export interface FamilyRoute {
  readonly familyId: string;
  readonly name: string;
  readonly region: string;
  readonly glyph: string;
  readonly color: string;
  readonly lane: number;
  readonly stationIds: readonly string[];
  readonly points: readonly Point[];
}

export interface WorldModel {
  readonly stations: readonly TimelineStation[];
  readonly stationById: ReadonlyMap<string, TimelineStation>;
  readonly eventToStationId: ReadonlyMap<string, string>;
  readonly routes: readonly FamilyRoute[];
  readonly bounds: WorldBounds;
}

const TIER_ORDER: Readonly<Record<NodeTier, number>> = {
  landmark: 3,
  major: 2,
  update: 1,
};

function compareStationEvents(a: ExplorerEvent, b: ExplorerEvent): number {
  return (
    b.importance - a.importance ||
    TIER_ORDER[b.node_tier] - TIER_ORDER[a.node_tier] ||
    a.product.localeCompare(b.product, "en") ||
    a.title_en.localeCompare(b.title_en, "en") ||
    a.event_id.localeCompare(b.event_id)
  );
}

function compareStations(a: TimelineStation, b: TimelineStation): number {
  return (
    a.date.localeCompare(b.date) ||
    a.lane - b.lane ||
    a.familyId.localeCompare(b.familyId) ||
    a.id.localeCompare(b.id)
  );
}

function stationId(familyId: string, lane: number, date: string): string {
  return `station:${familyId}:${lane}:${date}`;
}

function boundsFor(stations: readonly TimelineStation[]): WorldBounds {
  if (stations.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const station of stations) {
    minX = Math.min(minX, station.x);
    minY = Math.min(minY, station.y);
    maxX = Math.max(maxX, station.x);
    maxY = Math.max(maxY, station.y);
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

/**
 * Collapses same-family, same-lane, same-date records into a playable station.
 * Routes join consecutive stations inside one family only; they never encode
 * causality or cross-family relationships.
 */
export function buildWorldModel(dataset: Pick<ExplorerDataset, "events" | "taxonomy">): WorldModel {
  const groups = new Map<string, ExplorerEvent[]>();
  for (const event of dataset.events) {
    const key = `${event.product_family}\u0000${event.map_lane}\u0000${event.date}`;
    const existing = groups.get(key);
    if (existing) existing.push(event);
    else groups.set(key, [event]);
  }

  const stations = [...groups.values()]
    .map((group): TimelineStation => {
      const events = [...group].sort(compareStationEvents);
      const primary = events[0];
      if (!primary) throw new TypeError("A timeline station cannot be empty");
      const x = events.reduce((sum, item) => sum + item.x_hint, 0) / events.length;
      const y = events.reduce((sum, item) => sum + item.y_hint, 0) / events.length;
      return {
        id: stationId(primary.product_family, primary.map_lane, primary.date),
        familyId: primary.product_family,
        lane: primary.map_lane,
        date: primary.date,
        year: primary.year,
        x,
        y,
        eventIds: events.map((item) => item.event_id),
        events,
        primaryEventId: primary.event_id,
        tier: primary.node_tier,
        importance: primary.importance,
        glyph: primary.glyph,
        color: primary.color,
        mapRegion: primary.map_region,
      };
    })
    .sort(compareStations);

  const stationById = new Map(stations.map((station) => [station.id, station]));
  const eventToStationId = new Map<string, string>();
  for (const station of stations) {
    for (const eventId of station.eventIds) eventToStationId.set(eventId, station.id);
  }

  const routes = dataset.taxonomy.map((family): FamilyRoute => {
    const routeStations = stations
      .filter((station) => station.familyId === family.id)
      .sort((a, b) => a.date.localeCompare(b.date) || a.x - b.x || a.id.localeCompare(b.id));
    return {
      familyId: family.id,
      name: family.name_en,
      region: family.region,
      glyph: family.glyph,
      color: family.color,
      lane: family.lane,
      stationIds: routeStations.map((station) => station.id),
      points: routeStations.map(({ x, y }) => ({ x, y })),
    };
  });

  return {
    stations,
    stationById,
    eventToStationId,
    routes,
    bounds: boundsFor(stations),
  };
}
