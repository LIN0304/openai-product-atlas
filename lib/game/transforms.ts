import type { Point, WorldBounds } from "./world-model";

export interface CameraTransform extends Point {
  readonly zoom: number;
}

export interface ViewportSize {
  readonly width: number;
  readonly height: number;
}

export interface FitCameraOptions {
  readonly padding?: number;
  readonly minZoom?: number;
  readonly maxZoom?: number;
}

function positive(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function clampZoom(zoom: number, minZoom = 0.1, maxZoom = 4): number {
  const low = positive(Math.min(minZoom, maxZoom), 0.1);
  const high = positive(Math.max(minZoom, maxZoom), 4);
  return Math.min(high, Math.max(low, positive(zoom, low)));
}

export function worldToScreen(
  point: Point,
  camera: CameraTransform,
  viewport: ViewportSize,
): Point {
  const zoom = positive(camera.zoom, 1);
  return {
    x: (point.x - camera.x) * zoom + viewport.width / 2,
    y: (point.y - camera.y) * zoom + viewport.height / 2,
  };
}

export function screenToWorld(
  point: Point,
  camera: CameraTransform,
  viewport: ViewportSize,
): Point {
  const zoom = positive(camera.zoom, 1);
  return {
    x: (point.x - viewport.width / 2) / zoom + camera.x,
    y: (point.y - viewport.height / 2) / zoom + camera.y,
  };
}

export function fitCameraToBounds(
  bounds: WorldBounds,
  viewport: ViewportSize,
  options: FitCameraOptions = {},
): CameraTransform {
  const padding = Math.max(0, Number.isFinite(options.padding) ? (options.padding ?? 48) : 48);
  const usableWidth = Math.max(1, viewport.width - padding * 2);
  const usableHeight = Math.max(1, viewport.height - padding * 2);
  const worldWidth = Math.max(1, bounds.width);
  const worldHeight = Math.max(1, bounds.height);
  const zoom = clampZoom(
    Math.min(usableWidth / worldWidth, usableHeight / worldHeight),
    options.minZoom ?? 0.1,
    options.maxZoom ?? 4,
  );
  return {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2,
    zoom,
  };
}

export function clampPoint(point: Point, bounds: WorldBounds, padding = 0): Point {
  const inset = Math.max(0, Number.isFinite(padding) ? padding : 0);
  const minX = bounds.minX + inset;
  const maxX = bounds.maxX - inset;
  const minY = bounds.minY + inset;
  const maxY = bounds.maxY - inset;
  return {
    x:
      minX <= maxX
        ? Math.min(maxX, Math.max(minX, point.x))
        : (bounds.minX + bounds.maxX) / 2,
    y:
      minY <= maxY
        ? Math.min(maxY, Math.max(minY, point.y))
        : (bounds.minY + bounds.maxY) / 2,
  };
}
