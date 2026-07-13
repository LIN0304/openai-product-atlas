import type { Point, TimelineStation } from "./world-model";

export const ARRIVAL_ENTER_RADIUS = 26;
export const ARRIVAL_EXIT_RADIUS = 42;

export interface ArrivalState {
  readonly latchedStationId: string | null;
}

export interface AdvanceArrivalOptions {
  readonly state: ArrivalState;
  readonly player: Point;
  readonly stations: readonly TimelineStation[];
  readonly eligibleStationIds?: ReadonlySet<string>;
  readonly enterRadius?: number;
  readonly exitRadius?: number;
}

export interface ArrivalTransition {
  readonly state: ArrivalState;
  readonly enteredStationId: string | null;
  readonly nearestStationId: string | null;
  readonly distance: number;
}

export function createArrivalState(latchedStationId: string | null = null): ArrivalState {
  return { latchedStationId };
}

export function distanceBetween(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function radius(value: number | undefined, fallback: number): number {
  return Number.isFinite(value) && (value ?? 0) >= 0 ? (value as number) : fallback;
}

function isEligible(station: TimelineStation, ids: ReadonlySet<string> | undefined): boolean {
  return ids === undefined || ids.has(station.id);
}

function nearestEligible(
  player: Point,
  stations: readonly TimelineStation[],
  eligibleStationIds: ReadonlySet<string> | undefined,
): { station: TimelineStation | null; distance: number } {
  let nearest: TimelineStation | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (const station of stations) {
    if (!isEligible(station, eligibleStationIds)) continue;
    const distance = distanceBetween(player, station);
    if (
      nearest === null ||
      distance < nearestDistance ||
      (distance === nearestDistance && station.id.localeCompare(nearest.id) < 0)
    ) {
      nearest = station;
      nearestDistance = distance;
    }
  }
  return { station: nearest, distance: nearestDistance };
}

/**
 * Pure arrival state machine. Closing a record or filtering its station must
 * keep the returned latch; only moving beyond the exit radius rearms it.
 */
export function advanceArrival(options: AdvanceArrivalOptions): ArrivalTransition {
  const enterRadius = radius(options.enterRadius, ARRIVAL_ENTER_RADIUS);
  const exitRadius = Math.max(enterRadius, radius(options.exitRadius, ARRIVAL_EXIT_RADIUS));
  const nearest = nearestEligible(options.player, options.stations, options.eligibleStationIds);
  const latched = options.state.latchedStationId
    ? options.stations.find((station) => station.id === options.state.latchedStationId)
    : undefined;

  if (
    latched &&
    distanceBetween(options.player, latched) <= exitRadius
  ) {
    return {
      state: options.state,
      enteredStationId: null,
      nearestStationId: nearest.station?.id ?? null,
      distance: nearest.distance,
    };
  }

  if (nearest.station && nearest.distance <= enterRadius) {
    return {
      state: { latchedStationId: nearest.station.id },
      enteredStationId: nearest.station.id,
      nearestStationId: nearest.station.id,
      distance: nearest.distance,
    };
  }

  return {
    state: { latchedStationId: null },
    enteredStationId: null,
    nearestStationId: nearest.station?.id ?? null,
    distance: nearest.distance,
  };
}
