import type { CameraTransform, ViewportSize } from "./transforms";
import { fitCameraToBounds, worldToScreen } from "./transforms";
import type { Point, TimelineStation, WorldModel } from "./world-model";

export type GameWorld = WorldModel;

export interface CanvasMetrics extends ViewportSize {
  readonly pixelRatio: number;
  readonly coarsePointer: boolean;
}

export interface StaticSceneState {
  readonly camera: CameraTransform;
  readonly visibleStationIds: ReadonlySet<string>;
}

export interface DynamicSceneState extends StaticSceneState {
  readonly player: Point;
  readonly selectedStationId: string | null;
  readonly visitedStationIds: ReadonlySet<string>;
  readonly waypointStationId: string | null;
  readonly hoveredStationId: string | null;
  readonly reducedMotion: boolean;
  readonly timestamp: number;
}

export interface GamePalette {
  readonly background: string;
  readonly surface: string;
  readonly grid: string;
  readonly text: string;
  readonly muted: string;
  readonly cyan: string; // visited / hover
  readonly acid: string; // NOVA + waypoints
  readonly magenta: string; // active selection
  readonly warning: string;
}

/**
 * Two skins share one layout. "openai" is the calm neutral+green mode;
 * "cyber" restores the original restrained-cyberpunk neon palette.
 */
export const THEME_PALETTES = {
  openai: {
    background: "#0d0d0d",
    surface: "#191919",
    grid: "rgba(255,255,255,0.05)",
    text: "#ececec",
    muted: "#8a8a8a",
    cyan: "#8f9a96", // muted — reads as already-read
    acid: "#25c98f", // NOVA + waypoints — the OpenAI-green marker
    magenta: "#ffffff", // active selection — clean high-contrast
    warning: "#f2b34b",
  },
  cyber: {
    background: "#05070b",
    surface: "#09110f",
    grid: "#17312d",
    text: "#e9f0e8",
    muted: "#87928a",
    cyan: "#00f0ff",
    acid: "#e6ff4a",
    magenta: "#ff4fd8",
    warning: "#ff6f75",
  },
} as const satisfies Record<string, GamePalette>;

export type GameTheme = keyof typeof THEME_PALETTES;

let ACTIVE_THEME: GameTheme = "openai";
let GAME_COLORS: GamePalette = THEME_PALETTES.openai;

/** Swap the active canvas palette + glyph mode. The controller marks the
 *  static layer dirty so the change is repainted on the next frame. */
export function setRendererTheme(theme: GameTheme): void {
  ACTIVE_THEME = theme;
  GAME_COLORS = THEME_PALETTES[theme];
}

const FONT_STACK = 'ui-monospace, "SF Mono", "SFMono-Regular", "Cascadia Mono", Menlo, Consolas, "Liberation Mono", monospace';
const MIN_ZOOM = 0.075;
const MAX_ZOOM = 3.2;

function finiteSize(value: number): number {
  return Math.max(1, Math.round(Number.isFinite(value) ? value : 1));
}

export function resizeCanvas(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  coarsePointer: boolean,
): CanvasMetrics {
  const width = finiteSize(cssWidth);
  const height = finiteSize(cssHeight);
  const pixelRatio = Math.max(
    1,
    Math.min(coarsePointer ? 1.5 : 2, globalThis.devicePixelRatio || 1),
  );
  const bitmapWidth = Math.max(1, Math.round(width * pixelRatio));
  const bitmapHeight = Math.max(1, Math.round(height * pixelRatio));

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  if (canvas.width !== bitmapWidth || canvas.height !== bitmapHeight) {
    canvas.width = bitmapWidth;
    canvas.height = bitmapHeight;
  }
  const context = canvas.getContext("2d");
  context?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  return { width, height, pixelRatio, coarsePointer };
}

export function fitWorldCamera(world: WorldModel, viewport: ViewportSize): CameraTransform {
  return fitCameraToBounds(world.bounds, viewport, {
    padding: Math.min(72, Math.max(30, Math.min(viewport.width, viewport.height) * 0.08)),
    minZoom: MIN_ZOOM,
    maxZoom: 1.45,
  });
}

export function clampCameraZoom(camera: CameraTransform, nextZoom: number): CameraTransform {
  return {
    x: camera.x,
    y: camera.y,
    zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom)),
  };
}

export function stationTierGlyph(station: TimelineStation): string {
  if (station.tier === "landmark") return `[${station.glyph}]*`;
  if (station.tier === "major") return `<${station.glyph}>`;
  return `${station.glyph}.`;
}

function context2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  const context = canvas.getContext("2d");
  if (!context) return null;
  return context;
}

function resetContext(context: CanvasRenderingContext2D, metrics: CanvasMetrics): void {
  context.setTransform(metrics.pixelRatio, 0, 0, metrics.pixelRatio, 0, 0);
  context.globalAlpha = 1;
  context.globalCompositeOperation = "source-over";
  context.lineWidth = 1;
  context.setLineDash([]);
  context.shadowBlur = 0;
  context.shadowColor = "transparent";
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
}

function isOnScreen(point: Point, viewport: ViewportSize, margin = 48): boolean {
  return (
    point.x >= -margin &&
    point.y >= -margin &&
    point.x <= viewport.width + margin &&
    point.y <= viewport.height + margin
  );
}

function yearGuides(world: WorldModel): Array<{ year: number; x: number }> {
  const first = world.stations[0];
  const last = world.stations.at(-1);
  if (!first || !last) return [];
  const startTime = Date.parse(`${first.date}T00:00:00Z`);
  const endTime = Date.parse(`${last.date}T00:00:00Z`);
  const duration = Math.max(1, endTime - startTime);
  const guides: Array<{ year: number; x: number }> = [];
  for (let year = first.year; year <= last.year; year += 1) {
    const yearStart = Date.UTC(year, 0, 1);
    const progress = Math.min(1, Math.max(0, (yearStart - startTime) / duration));
    guides.push({ year, x: first.x + (last.x - first.x) * progress });
  }
  return guides;
}

export function stationPassesLevelOfDetail(
  station: TimelineStation,
  camera: Pick<CameraTransform, "zoom">,
): boolean {
  return camera.zoom >= 0.28 || station.tier === "landmark";
}

function drawGrid(context: CanvasRenderingContext2D, metrics: CanvasMetrics): void {
  context.save();
  context.fillStyle = GAME_COLORS.background;
  context.fillRect(0, 0, metrics.width, metrics.height);

  context.strokeStyle = GAME_COLORS.grid;
  context.lineWidth = 1;
  if (ACTIVE_THEME === "cyber") {
    // Original dense dotted crosshatch — a terminal texture.
    context.globalAlpha = 0.34;
    context.setLineDash([1, 9]);
  }
  // Calm plotting grid in openai; denser step in cyber.
  const step = ACTIVE_THEME === "cyber"
    ? (metrics.width < 520 ? 32 : 48)
    : (metrics.width < 520 ? 44 : 64);
  for (let x = 0.5; x <= metrics.width; x += step) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, metrics.height);
    context.stroke();
  }
  for (let y = 0.5; y <= metrics.height; y += step) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(metrics.width, y);
    context.stroke();
  }
  context.restore();
}

function drawYearGuides(
  context: CanvasRenderingContext2D,
  metrics: CanvasMetrics,
  world: WorldModel,
  camera: CameraTransform,
): void {
  const cyber = ACTIVE_THEME === "cyber";
  context.save();
  context.font = `600 ${cyber ? 10 : 11}px ${FONT_STACK}`;
  context.textAlign = "center";
  context.textBaseline = "top";
  let lastLabelRight = Number.NEGATIVE_INFINITY;
  for (const guide of yearGuides(world)) {
    const screen = worldToScreen({ x: guide.x, y: world.bounds.minY }, camera, metrics);
    if (screen.x < -24 || screen.x > metrics.width + 24) continue;
    context.strokeStyle = cyber ? GAME_COLORS.muted : "rgba(255,255,255,0.08)";
    context.globalAlpha = cyber ? 0.7 : 1;
    context.setLineDash(cyber ? [4, 8] : [2, 6]);
    context.beginPath();
    context.moveTo(Math.round(screen.x) + 0.5, cyber ? 22 : 24);
    context.lineTo(Math.round(screen.x) + 0.5, metrics.height);
    context.stroke();
    const label = cyber ? `YEAR // ${guide.year}` : `${guide.year}`;
    const width = context.measureText(label).width;
    const left = screen.x - width / 2;
    if (left > lastLabelRight + 8) {
      context.setLineDash([]);
      context.fillStyle = GAME_COLORS.muted;
      context.globalAlpha = cyber ? 0.7 : 0.92;
      context.fillText(label, screen.x, cyber ? 7 : 8);
      lastLabelRight = left + width;
    }
  }
  context.restore();
}

function drawRoutes(
  context: CanvasRenderingContext2D,
  metrics: CanvasMetrics,
  world: WorldModel,
  camera: CameraTransform,
  visibleStationIds: ReadonlySet<string>,
): void {
  context.save();
  context.lineCap = "square";
  context.lineJoin = "miter";
  for (const route of world.routes) {
    const visibleIndexes = route.stationIds
      .map((stationId, index) => (visibleStationIds.has(stationId) ? index : -1))
      .filter((index) => index >= 0);
    if (visibleIndexes.length === 0) continue;
    context.strokeStyle = route.color;
    context.globalAlpha = 0.7;
    context.lineWidth = 1.25;
    context.setLineDash([7, 5]);
    for (let index = 1; index < route.points.length; index += 1) {
      if (
        !visibleStationIds.has(route.stationIds[index - 1] ?? "") ||
        !visibleStationIds.has(route.stationIds[index] ?? "")
      ) continue;
      const start = worldToScreen(route.points[index - 1], camera, metrics);
      const end = worldToScreen(route.points[index], camera, metrics);
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    }

    const firstVisiblePoint = visibleIndexes
      .map((index) => worldToScreen(route.points[index], camera, metrics))
      .find((point) => isOnScreen(point, metrics, 12));
    if (firstVisiblePoint) {
      context.globalAlpha = 0.95;
      context.fillStyle = route.color;
      context.font = `700 11px ${FONT_STACK}`;
      context.textAlign = "right";
      context.textBaseline = "middle";
      context.fillText(`[${route.glyph}]`, Math.max(26, firstVisiblePoint.x - 12), firstVisiblePoint.y);
    }
  }
  context.restore();
}

function drawStations(
  context: CanvasRenderingContext2D,
  metrics: CanvasMetrics,
  world: WorldModel,
  camera: CameraTransform,
  visibleStationIds: ReadonlySet<string>,
): void {
  const labelRightByLane = new Map<number, number>();
  const glyphRightByLane = new Map<number, number>();
  context.save();
  context.textBaseline = "middle";
  for (const station of world.stations) {
    if (!visibleStationIds.has(station.id)) continue;
    if (!stationPassesLevelOfDetail(station, camera)) continue;
    const screen = worldToScreen(station, camera, metrics);
    if (!isOnScreen(screen, metrics)) continue;

    if (camera.zoom < 0.28) {
      const previousRight = glyphRightByLane.get(station.lane) ?? Number.NEGATIVE_INFINITY;
      const glyphHalfWidth = metrics.width < 560 ? 11 : 13;
      if (screen.x - glyphHalfWidth <= previousRight + 4) continue;
      glyphRightByLane.set(station.lane, screen.x + glyphHalfWidth);
    }

    const glyph = stationTierGlyph(station);
    const fontSize = station.tier === "landmark" ? 12 : station.tier === "major" ? 10 : 9;
    context.font = `${station.tier === "landmark" ? 800 : 650} ${fontSize}px ${FONT_STACK}`;
    context.textAlign = "center";
    context.fillStyle = station.color;
    context.globalAlpha = station.tier === "update" ? 0.78 : 0.98;
    context.fillText(glyph, screen.x, screen.y);

    const minimumLabelZoom = metrics.width < 560 ? 0.3 : 0.18;
    if (station.tier !== "landmark" || camera.zoom < minimumLabelZoom) continue;
    const label = station.events[0]?.title_en ?? station.mapRegion;
    const maximumLength = metrics.width < 560 ? 18 : 26;
    const clippedLabel = label.length > maximumLength ? `${label.slice(0, maximumLength - 1)}...` : label;
    context.font = `600 ${metrics.width < 560 ? 8 : 10}px ${FONT_STACK}`;
    const labelWidth = context.measureText(clippedLabel).width;
    const labelLeft = screen.x - labelWidth / 2;
    const previousRight = labelRightByLane.get(station.lane) ?? Number.NEGATIVE_INFINITY;
    if (labelLeft <= previousRight + 16) continue;
    labelRightByLane.set(station.lane, labelLeft + labelWidth);
    context.textBaseline = "bottom";
    context.fillStyle = GAME_COLORS.text;
    context.globalAlpha = 0.9;
    context.fillText(clippedLabel, screen.x, screen.y - 10);
    context.textBaseline = "middle";
  }
  context.restore();
}

export function drawStaticWorld(
  canvas: HTMLCanvasElement,
  metrics: CanvasMetrics,
  world: WorldModel,
  state: StaticSceneState,
): boolean {
  const context = context2d(canvas);
  if (!context) return false;
  resetContext(context, metrics);
  drawGrid(context, metrics);
  drawYearGuides(context, metrics, world, state.camera);
  drawRoutes(context, metrics, world, state.camera, state.visibleStationIds);
  drawStations(context, metrics, world, state.camera, state.visibleStationIds);
  return true;
}

function drawWaypoint(
  context: CanvasRenderingContext2D,
  metrics: CanvasMetrics,
  world: WorldModel,
  state: DynamicSceneState,
): void {
  if (!state.waypointStationId) return;
  const waypoint = world.stationById.get(state.waypointStationId);
  if (!waypoint) return;
  const cyber = ACTIVE_THEME === "cyber";
  const guideColor = cyber ? GAME_COLORS.magenta : GAME_COLORS.acid;
  const player = worldToScreen(state.player, state.camera, metrics);
  const target = worldToScreen(waypoint, state.camera, metrics);
  context.save();
  context.strokeStyle = guideColor;
  context.fillStyle = guideColor;
  context.globalAlpha = cyber ? 0.88 : 0.85;
  context.lineWidth = cyber ? 1 : 1.25;
  context.setLineDash(cyber ? [2, 6] : [3, 5]);
  context.beginPath();
  context.moveTo(player.x, player.y);
  context.lineTo(target.x, target.y);
  context.stroke();
  context.font = `${cyber ? "700 9px" : "600 10px"} ${FONT_STACK}`;
  context.textAlign = "center";
  context.textBaseline = "bottom";
  if (!cyber) context.setLineDash([]);
  context.fillText(cyber ? "...> WAYPOINT" : "→ waypoint", (player.x + target.x) / 2, (player.y + target.y) / 2 - (cyber ? 4 : 5));
  context.restore();
}

function drawVisitedAndSelection(
  context: CanvasRenderingContext2D,
  metrics: CanvasMetrics,
  world: WorldModel,
  state: DynamicSceneState,
): void {
  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `800 11px ${FONT_STACK}`;
  for (const stationId of state.visitedStationIds) {
    if (!state.visibleStationIds.has(stationId)) continue;
    const station = world.stationById.get(stationId);
    if (!station) continue;
    if (!stationPassesLevelOfDetail(station, state.camera)) continue;
    const screen = worldToScreen(station, state.camera, metrics);
    if (!isOnScreen(screen, metrics)) continue;
    context.fillStyle = GAME_COLORS.cyan;
    context.globalAlpha = 0.92;
    context.fillText(`[${station.glyph}]+`, screen.x, screen.y);
  }

  if (state.selectedStationId && state.visibleStationIds.has(state.selectedStationId)) {
    const station = world.stationById.get(state.selectedStationId);
    if (station && stationPassesLevelOfDetail(station, state.camera)) {
      const screen = worldToScreen(station, state.camera, metrics);
      context.fillStyle = GAME_COLORS.magenta;
      context.globalAlpha = 1;
      context.font = `900 12px ${FONT_STACK}`;
      context.fillText(`>[${station.glyph}]<`, screen.x, screen.y);
    }
  }

  if (state.hoveredStationId && state.hoveredStationId !== state.selectedStationId) {
    const station = world.stationById.get(state.hoveredStationId);
    if (station && state.visibleStationIds.has(station.id)) {
      const screen = worldToScreen(station, state.camera, metrics);
      context.strokeStyle = GAME_COLORS.cyan;
      context.globalAlpha = 0.9;
      context.setLineDash([3, 3]);
      context.strokeRect(Math.round(screen.x - 18) + 0.5, Math.round(screen.y - 12) + 0.5, 36, 24);
    }
  }
  context.restore();
}

function drawPlayer(
  context: CanvasRenderingContext2D,
  metrics: CanvasMetrics,
  state: DynamicSceneState,
): void {
  const screen = worldToScreen(state.player, state.camera, metrics);
  const detailed = state.camera.zoom >= 0.42 && metrics.width >= 460;
  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = GAME_COLORS.acid;
  context.strokeStyle = GAME_COLORS.acid;

  if (ACTIVE_THEME === "cyber") {
    // Original ASCII avatar: a flickering dashed halo and a stick figure.
    if (!state.reducedMotion) {
      const phase = (state.timestamp % 1_500) / 1_500;
      const radius = 16 + phase * 7;
      context.globalAlpha = 0.45 * (1 - phase);
      context.setLineDash([3, 5]);
      context.strokeRect(
        Math.round(screen.x - radius) + 0.5,
        Math.round(screen.y - radius) + 0.5,
        Math.round(radius * 2),
        Math.round(radius * 2),
      );
      context.setLineDash([]);
      context.globalAlpha = 1;
    }
    if (detailed) {
      context.font = `900 11px ${FONT_STACK}`;
      context.fillText("[::]", screen.x, screen.y - 13);
      context.fillText("/|\\", screen.x, screen.y);
      context.fillText("/ \\", screen.x, screen.y + 13);
      context.font = `800 9px ${FONT_STACK}`;
      context.fillText("NOVA", screen.x, screen.y + 29);
    } else {
      context.font = `900 15px ${FONT_STACK}`;
      context.fillText("@", screen.x, screen.y);
    }
    context.restore();
    return;
  }

  // OpenAI mode: a clean "you-are-here" marker with a soft pulse.
  if (!state.reducedMotion) {
    const phase = (state.timestamp % 2_200) / 2_200;
    const radius = 9 + phase * 16;
    context.globalAlpha = 0.28 * (1 - phase);
    context.beginPath();
    context.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 0.9;
  context.lineWidth = 1.5;
  context.beginPath();
  context.arc(screen.x, screen.y, detailed ? 8 : 6, 0, Math.PI * 2);
  context.stroke();
  context.globalAlpha = 1;
  context.beginPath();
  context.arc(screen.x, screen.y, detailed ? 4.5 : 3.5, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = GAME_COLORS.background;
  context.beginPath();
  context.arc(screen.x, screen.y, detailed ? 1.6 : 1.3, 0, Math.PI * 2);
  context.fill();
  if (detailed) {
    context.fillStyle = GAME_COLORS.acid;
    context.font = `600 10px ${FONT_STACK}`;
    context.textBaseline = "top";
    context.fillText("NOVA", screen.x, screen.y + 12);
  }
  context.restore();
}

export function drawDynamicWorld(
  canvas: HTMLCanvasElement,
  metrics: CanvasMetrics,
  world: WorldModel,
  state: DynamicSceneState,
): boolean {
  const context = context2d(canvas);
  if (!context) return false;
  resetContext(context, metrics);
  context.clearRect(0, 0, metrics.width, metrics.height);
  drawWaypoint(context, metrics, world, state);
  drawVisitedAndSelection(context, metrics, world, state);
  drawPlayer(context, metrics, state);
  return true;
}

export function nearestStationAtScreenPoint(
  point: Point,
  world: WorldModel,
  camera: CameraTransform,
  viewport: ViewportSize,
  visibleStationIds: ReadonlySet<string>,
  hitRadius: number,
): TimelineStation | null {
  let nearest: TimelineStation | null = null;
  let distance = Math.max(1, hitRadius);
  for (const station of world.stations) {
    if (!visibleStationIds.has(station.id)) continue;
    if (!stationPassesLevelOfDetail(station, camera)) continue;
    const screen = worldToScreen(station, camera, viewport);
    const nextDistance = Math.hypot(point.x - screen.x, point.y - screen.y);
    if (
      nextDistance < distance ||
      (nextDistance === distance && nearest !== null && station.id.localeCompare(nearest.id) < 0)
    ) {
      nearest = station;
      distance = nextDistance;
    }
  }
  return nearest;
}
