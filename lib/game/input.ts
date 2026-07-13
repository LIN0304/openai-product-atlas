import type { Point, WorldBounds } from "./world-model";

export interface MovementStepOptions {
  readonly speed: number;
  readonly deltaMs: number;
  readonly bounds: WorldBounds;
  readonly maxDeltaMs?: number;
  readonly padding?: number;
}

const DIRECTIONS: Readonly<Record<string, Point>> = {
  arrowup: { x: 0, y: -1 },
  keyw: { x: 0, y: -1 },
  w: { x: 0, y: -1 },
  arrowdown: { x: 0, y: 1 },
  keys: { x: 0, y: 1 },
  s: { x: 0, y: 1 },
  arrowleft: { x: -1, y: 0 },
  keya: { x: -1, y: 0 },
  a: { x: -1, y: 0 },
  arrowright: { x: 1, y: 0 },
  keyd: { x: 1, y: 0 },
  d: { x: 1, y: 0 },
};

function keyName(key: string): string {
  return key.trim().toLowerCase();
}

export function isMovementKey(key: string): boolean {
  return Object.hasOwn(DIRECTIONS, keyName(key));
}

export function normalizeVector(vector: Point): Point {
  const magnitude = Math.hypot(vector.x, vector.y);
  if (!Number.isFinite(magnitude) || magnitude === 0) return { x: 0, y: 0 };
  if (magnitude <= 1) return { x: vector.x, y: vector.y };
  return { x: vector.x / magnitude, y: vector.y / magnitude };
}

export function movementVectorFromKeys(keys: Iterable<string>): Point {
  let x = 0;
  let y = 0;
  for (const key of keys) {
    const direction = DIRECTIONS[keyName(key)];
    if (!direction) continue;
    x += direction.x;
    y += direction.y;
  }
  return normalizeVector({ x, y });
}

export function clampDeltaMs(deltaMs: number, maxDeltaMs = 50): number {
  const safeMax = Number.isFinite(maxDeltaMs) && maxDeltaMs > 0 ? maxDeltaMs : 50;
  if (!Number.isFinite(deltaMs) || deltaMs <= 0) return 0;
  return Math.min(safeMax, deltaMs);
}

function clampAxis(value: number, minimum: number, maximum: number): number {
  if (minimum > maximum) return (minimum + maximum) / 2;
  return Math.min(maximum, Math.max(minimum, value));
}

export function stepMovement(
  position: Point,
  direction: Point,
  options: MovementStepOptions,
): Point {
  const vector = normalizeVector(direction);
  const speed = Number.isFinite(options.speed) ? Math.max(0, options.speed) : 0;
  const seconds = clampDeltaMs(options.deltaMs, options.maxDeltaMs) / 1_000;
  const padding = Number.isFinite(options.padding) ? Math.max(0, options.padding ?? 0) : 0;
  const next = {
    x: position.x + vector.x * speed * seconds,
    y: position.y + vector.y * speed * seconds,
  };
  return {
    x: clampAxis(next.x, options.bounds.minX + padding, options.bounds.maxX - padding),
    y: clampAxis(next.y, options.bounds.minY + padding, options.bounds.maxY - padding),
  };
}
