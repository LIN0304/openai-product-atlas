import {
  advanceArrival,
  ARRIVAL_ENTER_RADIUS,
  ARRIVAL_EXIT_RADIUS,
  createArrivalState,
  distanceBetween,
  type ArrivalState,
} from "./arrival";
import { isMovementKey, movementVectorFromKeys, stepMovement } from "./input";
import {
  clampCameraZoom,
  drawDynamicWorld,
  drawStaticWorld,
  fitWorldCamera,
  nearestStationAtScreenPoint,
  resizeCanvas,
  stationPassesLevelOfDetail,
  type CanvasMetrics,
} from "./renderer";
import type { CameraTransform } from "./transforms";
import type { Point, TimelineStation, WorldModel } from "./world-model";

export type MoveDirection = "up" | "down" | "left" | "right";
export type SelectionReason = "pointer" | "keyboard" | "route";

export interface GameSelectionPayload {
  readonly stationId: string;
  readonly eventId: string;
  readonly reason: SelectionReason;
}

export interface GameArrivalPayload {
  readonly stationId: string;
  readonly eventId: string;
}

export interface GameControllerCallbacks {
  readonly onArrival?: (payload: GameArrivalPayload) => void;
  readonly onSelect?: (payload: GameSelectionPayload) => void;
  readonly onStatus?: (message: string) => void;
  readonly onRenderReady?: () => void;
}

interface PointerGesture {
  readonly pointerId: number;
  readonly start: Point;
  moved: boolean;
}

const MANUAL_SPEED = 255;
const ROUTE_SPEED = 720;
const DISCRETE_STEP_MS = 130;
const READ_RADIUS = ARRIVAL_ENTER_RADIUS;
const CAMERA_EPSILON = 0.002;
const DIRECTION_KEYS: Readonly<Record<MoveDirection, string>> = {
  up: "arrowup",
  down: "arrowdown",
  left: "arrowleft",
  right: "arrowright",
};

function stationIdsForVisibleEvents(
  world: WorldModel,
  visibleEventIds: ReadonlySet<string>,
): Set<string> {
  const ids = new Set<string>();
  for (const station of world.stations) {
    if (station.eventIds.some((eventId) => visibleEventIds.has(eventId))) ids.add(station.id);
  }
  return ids;
}

function stationIdsForVisitedEvents(
  world: WorldModel,
  visitedEventIds: ReadonlySet<string>,
): Set<string> {
  const ids = new Set<string>();
  for (const station of world.stations) {
    if (station.eventIds.some((eventId) => visitedEventIds.has(eventId))) ids.add(station.id);
  }
  return ids;
}

function firstVisibleEventId(
  station: TimelineStation,
  visibleEventIds: ReadonlySet<string>,
): string | null {
  return station.events.find((event) => visibleEventIds.has(event.event_id))?.event_id ?? null;
}

function playerPositionNearStation(world: WorldModel, station: TimelineStation): Point {
  const offset = station.y + 68 <= world.bounds.maxY ? 68 : -68;
  return {
    x: station.x,
    y: Math.min(world.bounds.maxY, Math.max(world.bounds.minY, station.y + offset)),
  };
}

function initialPlayerPosition(world: WorldModel): Point {
  const first = world.stations[0];
  return first
    ? playerPositionNearStation(world, first)
    : { x: world.bounds.minX, y: world.bounds.minY };
}

function pointFromPointer(event: PointerEvent, canvas: HTMLCanvasElement): Point {
  const bounds = canvas.getBoundingClientRect();
  return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
}

function isEditableTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

function cameraChanged(a: CameraTransform, b: CameraTransform): boolean {
  return (
    Math.abs(a.x - b.x) > CAMERA_EPSILON ||
    Math.abs(a.y - b.y) > CAMERA_EPSILON ||
    Math.abs(a.zoom - b.zoom) > CAMERA_EPSILON
  );
}

function approachCamera(
  current: CameraTransform,
  target: CameraTransform,
  deltaMs: number,
): CameraTransform {
  const amount = Math.min(1, 1 - Math.exp(-Math.max(0, deltaMs) / 95));
  return {
    x: current.x + (target.x - current.x) * amount,
    y: current.y + (target.y - current.y) * amount,
    zoom: current.zoom + (target.zoom - current.zoom) * amount,
  };
}

export class CanvasGameController {
  private world: WorldModel;
  private readonly stage: HTMLElement;
  private readonly staticCanvas: HTMLCanvasElement;
  private readonly dynamicCanvas: HTMLCanvasElement;
  private callbacks: GameControllerCallbacks;
  private metrics: CanvasMetrics = { width: 1, height: 1, pixelRatio: 1, coarsePointer: false };
  private camera: CameraTransform;
  private targetCamera: CameraTransform;
  private player: Point;
  private visibleEventIds = new Set<string>();
  private visibleStationIds = new Set<string>();
  private visitedStationIds = new Set<string>();
  private selectedStationId: string | null = null;
  private waypointStationId: string | null = null;
  private hoveredStationId: string | null = null;
  private arrivalState: ArrivalState = createArrivalState();
  private pressedKeys = new Set<string>();
  private heldDirections = new Set<MoveDirection>();
  private pointerGesture: PointerGesture | null = null;
  private paused = false;
  private reducedMotion = false;
  private staticDirty = true;
  private dynamicDirty = true;
  private readyEmitted = false;
  private frameId: number | null = null;
  private lastFrameTime = 0;
  private running = false;
  private active = true;

  constructor(options: {
    stage: HTMLElement;
    staticCanvas: HTMLCanvasElement;
    dynamicCanvas: HTMLCanvasElement;
    world: WorldModel;
    callbacks?: GameControllerCallbacks;
  }) {
    this.stage = options.stage;
    this.staticCanvas = options.staticCanvas;
    this.dynamicCanvas = options.dynamicCanvas;
    this.world = options.world;
    this.callbacks = options.callbacks ?? {};
    this.player = initialPlayerPosition(this.world);
    this.camera = fitWorldCamera(this.world, this.metrics);
    this.targetCamera = this.camera;
    this.visibleEventIds = new Set(this.world.stations.flatMap((station) => station.eventIds));
    this.visibleStationIds = new Set(this.world.stations.map((station) => station.id));

    this.dynamicCanvas.style.touchAction = "manipulation";
    this.stage.addEventListener("keydown", this.handleKeyDown);
    this.stage.addEventListener("keyup", this.handleKeyUp);
    this.stage.addEventListener("blur", this.handleStageBlur, true);
    this.dynamicCanvas.addEventListener("pointerdown", this.handlePointerDown);
    this.dynamicCanvas.addEventListener("pointermove", this.handlePointerMove);
    this.dynamicCanvas.addEventListener("pointerup", this.handlePointerUp);
    this.dynamicCanvas.addEventListener("pointercancel", this.handlePointerCancel);
    this.dynamicCanvas.addEventListener("lostpointercapture", this.handleLostPointerCapture);
    this.dynamicCanvas.addEventListener("pointerleave", this.handlePointerLeave);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    if (!this.active) return;
    this.lastFrameTime = performance.now();
    this.frameId = requestAnimationFrame(this.frame);
  }

  setActive(active: boolean): void {
    if (active === this.active) return;
    this.active = active;
    if (!active) {
      if (this.frameId !== null) cancelAnimationFrame(this.frameId);
      this.frameId = null;
      this.pressedKeys.clear();
      this.heldDirections.clear();
      if (this.pointerGesture) {
        const pointerId = this.pointerGesture.pointerId;
        if (this.dynamicCanvas.hasPointerCapture(pointerId)) {
          this.dynamicCanvas.releasePointerCapture(pointerId);
        }
        this.pointerGesture = null;
      }
      return;
    }
    if (!this.running || this.frameId !== null) return;
    this.lastFrameTime = performance.now();
    this.staticDirty = true;
    this.dynamicDirty = true;
    this.frameId = requestAnimationFrame(this.frame);
  }

  destroy(): void {
    this.running = false;
    if (this.frameId !== null) cancelAnimationFrame(this.frameId);
    this.frameId = null;
    this.stage.removeEventListener("keydown", this.handleKeyDown);
    this.stage.removeEventListener("keyup", this.handleKeyUp);
    this.stage.removeEventListener("blur", this.handleStageBlur, true);
    this.dynamicCanvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.dynamicCanvas.removeEventListener("pointermove", this.handlePointerMove);
    this.dynamicCanvas.removeEventListener("pointerup", this.handlePointerUp);
    this.dynamicCanvas.removeEventListener("pointercancel", this.handlePointerCancel);
    this.dynamicCanvas.removeEventListener("lostpointercapture", this.handleLostPointerCapture);
    this.dynamicCanvas.removeEventListener("pointerleave", this.handlePointerLeave);
    this.pressedKeys.clear();
    this.heldDirections.clear();
    this.pointerGesture = null;
  }

  setCallbacks(callbacks: GameControllerCallbacks): void {
    this.callbacks = callbacks;
  }

  setWorld(world: WorldModel): void {
    if (world === this.world) return;
    this.world = world;
    this.player = initialPlayerPosition(world);
    this.camera = fitWorldCamera(world, this.metrics);
    this.targetCamera = this.camera;
    this.arrivalState = createArrivalState();
    this.visibleStationIds = stationIdsForVisibleEvents(world, this.visibleEventIds);
    this.waypointStationId = null;
    this.staticDirty = true;
    this.dynamicDirty = true;
  }

  resize(width: number, height: number, coarsePointer: boolean): void {
    const firstResize = this.metrics.width <= 1 && this.metrics.height <= 1;
    this.metrics = resizeCanvas(this.staticCanvas, width, height, coarsePointer);
    resizeCanvas(this.dynamicCanvas, width, height, coarsePointer);
    const fitted = fitWorldCamera(this.world, this.metrics);
    if (firstResize && this.metrics.width <= 520) {
      const focused = { x: this.player.x, y: this.player.y, zoom: 0.34 };
      this.camera = focused;
      this.targetCamera = focused;
    } else if (firstResize || this.camera.zoom < fitted.zoom * 0.65) {
      this.camera = fitted;
      this.targetCamera = fitted;
    }
    this.staticDirty = true;
    this.dynamicDirty = true;
    this.render(performance.now());
  }

  setVisibleEventIds(eventIds: ReadonlySet<string>): void {
    this.visibleEventIds = new Set(eventIds);
    this.visibleStationIds = stationIdsForVisibleEvents(this.world, this.visibleEventIds);
    if (this.waypointStationId && !this.visibleStationIds.has(this.waypointStationId)) {
      this.waypointStationId = null;
      this.callbacks.onStatus?.("ROUTE CANCELLED // SIGNAL FILTERED OUT");
    }
    if (this.hoveredStationId && !this.visibleStationIds.has(this.hoveredStationId)) {
      this.hoveredStationId = null;
    }
    this.staticDirty = true;
    this.dynamicDirty = true;
  }

  setVisitedEventIds(eventIds: ReadonlySet<string>): void {
    this.visitedStationIds = stationIdsForVisitedEvents(this.world, eventIds);
    this.dynamicDirty = true;
  }

  setSelectedEventId(eventId: string | undefined): void {
    this.selectedStationId = eventId ? this.world.eventToStationId.get(eventId) ?? null : null;
    if (!this.readyEmitted && this.selectedStationId) {
      const station = this.world.stationById.get(this.selectedStationId);
      if (station) this.player = playerPositionNearStation(this.world, station);
    }
    this.dynamicDirty = true;
  }

  setPaused(paused: boolean): void {
    this.paused = paused;
    if (paused) {
      this.pressedKeys.clear();
      this.heldDirections.clear();
    }
    this.dynamicDirty = true;
  }

  setReducedMotion(reduced: boolean): void {
    const becameReduced = reduced && !this.reducedMotion;
    this.reducedMotion = reduced;
    if (becameReduced) {
      this.pressedKeys.clear();
      this.heldDirections.clear();
      if (this.waypointStationId) {
        const station = this.world.stationById.get(this.waypointStationId);
        if (station && this.visibleStationIds.has(station.id)) {
          this.player = { x: station.x, y: station.y };
          this.targetCamera = {
            x: station.x,
            y: station.y,
            zoom: Math.max(this.targetCamera.zoom, 0.58),
          };
        }
        this.waypointStationId = null;
        this.checkArrival();
      }
      this.camera = this.targetCamera;
    }
    this.staticDirty = true;
    this.dynamicDirty = true;
  }

  focus(): void {
    this.stage.focus({ preventScroll: true });
  }

  fit(): void {
    const next = fitWorldCamera(this.world, this.metrics);
    this.targetCamera = next;
    if (this.reducedMotion) this.camera = next;
    this.staticDirty = true;
    this.dynamicDirty = true;
    this.callbacks.onStatus?.("MAP FIT // FULL TIMELINE VISIBLE");
  }

  zoomBy(factor: number): void {
    if (!Number.isFinite(factor) || factor <= 0) return;
    const next = clampCameraZoom(
      { x: this.player.x, y: this.player.y, zoom: this.targetCamera.zoom },
      this.targetCamera.zoom * factor,
    );
    this.targetCamera = next;
    if (this.reducedMotion) this.camera = next;
    this.staticDirty = true;
    this.dynamicDirty = true;
  }

  routeTo(eventId: string): boolean {
    const stationId = this.world.eventToStationId.get(eventId);
    const station = stationId ? this.world.stationById.get(stationId) : undefined;
    if (!station || !this.visibleStationIds.has(station.id) || !this.visibleEventIds.has(eventId)) {
      this.callbacks.onStatus?.("ROUTE BLOCKED // EVENT IS NOT VISIBLE");
      return false;
    }
    return this.startRoute(station, eventId, "route");
  }

  private startRoute(
    station: TimelineStation,
    eventId: string,
    reason: SelectionReason,
  ): boolean {
    this.selectedStationId = station.id;
    this.callbacks.onSelect?.({ stationId: station.id, eventId, reason });
    if (this.reducedMotion) {
      this.player = { x: station.x, y: station.y };
      const zoom = Math.max(this.targetCamera.zoom, 0.58);
      this.camera = { x: station.x, y: station.y, zoom };
      this.targetCamera = this.camera;
      this.waypointStationId = null;
      this.checkArrival();
      this.staticDirty = true;
      this.dynamicDirty = true;
      return true;
    }
    this.waypointStationId = station.id;
    this.targetCamera = {
      x: this.player.x,
      y: this.player.y,
      zoom: Math.max(this.targetCamera.zoom, 0.58),
    };
    this.callbacks.onStatus?.(`WAYPOINT SET // ${station.date} // ${station.mapRegion.toUpperCase()}`);
    this.staticDirty = true;
    this.dynamicDirty = true;
    return true;
  }

  openNearest(): string | undefined {
    const nearest = this.nearestVisibleStation();
    if (!nearest || nearest.distance > READ_RADIUS) {
      this.callbacks.onStatus?.("NO SIGNAL IN RANGE // MOVE CLOSER OR USE ROUTE");
      return undefined;
    }
    if (this.arrivalState.latchedStationId === nearest.station.id) {
      this.callbacks.onStatus?.("STATION LATCHED // EXIT THE NODE TO READ AGAIN");
      return undefined;
    }
    const eventId = firstVisibleEventId(nearest.station, this.visibleEventIds);
    if (!eventId) return undefined;
    this.arrivalState = createArrivalState(nearest.station.id);
    this.selectedStationId = nearest.station.id;
    this.callbacks.onSelect?.({ stationId: nearest.station.id, eventId, reason: "keyboard" });
    this.dynamicDirty = true;
    return eventId;
  }

  move(direction: MoveDirection, active: boolean): void {
    if (this.paused) return;
    if (active && this.reducedMotion) {
      this.cancelWaypoint();
      this.stepDiscrete(DIRECTION_KEYS[direction]);
      return;
    }
    if (active) {
      this.cancelWaypoint();
      this.heldDirections.add(direction);
    } else {
      this.heldDirections.delete(direction);
    }
  }

  private readonly frame = (timestamp: number): void => {
    if (!this.running || !this.active) {
      this.frameId = null;
      return;
    }
    const deltaMs = Math.min(50, Math.max(0, timestamp - this.lastFrameTime));
    this.lastFrameTime = timestamp;

    if (!this.paused) {
      this.advancePlayer(deltaMs);
      this.advanceCamera(deltaMs);
      this.checkArrival();
    }
    this.render(timestamp);
    if (this.running && this.active) this.frameId = requestAnimationFrame(this.frame);
  };

  private render(timestamp: number): void {
    let staticRendered = true;
    let dynamicRendered = true;
    if (this.staticDirty) {
      staticRendered = drawStaticWorld(this.staticCanvas, this.metrics, this.world, {
        camera: this.camera,
        visibleStationIds: this.visibleStationIds,
      });
      this.staticDirty = false;
    }
    if (this.dynamicDirty) {
      dynamicRendered = drawDynamicWorld(this.dynamicCanvas, this.metrics, this.world, {
        camera: this.camera,
        player: this.player,
        visibleStationIds: this.visibleStationIds,
        selectedStationId: this.selectedStationId,
        visitedStationIds: this.visitedStationIds,
        waypointStationId: this.waypointStationId,
        hoveredStationId: this.hoveredStationId,
        reducedMotion: this.reducedMotion,
        timestamp,
      });
      this.dynamicDirty = false;
    }
    if (!this.readyEmitted && staticRendered && dynamicRendered && this.metrics.width > 1) {
      this.readyEmitted = true;
      this.stage.dataset.renderReady = "true";
      this.callbacks.onRenderReady?.();
    }
  }

  private advancePlayer(deltaMs: number): void {
    const movementKeys = [
      ...this.pressedKeys,
      ...[...this.heldDirections].map((direction) => DIRECTION_KEYS[direction]),
    ];
    const direction = movementVectorFromKeys(movementKeys);
    if (direction.x !== 0 || direction.y !== 0) {
      const next = stepMovement(this.player, direction, {
        speed: MANUAL_SPEED,
        deltaMs,
        bounds: this.world.bounds,
        maxDeltaMs: 50,
      });
      if (next.x !== this.player.x || next.y !== this.player.y) {
        this.player = next;
        if (this.targetCamera.zoom >= 0.28) {
          this.targetCamera = { ...this.targetCamera, x: next.x, y: next.y };
        }
        this.staticDirty = this.targetCamera.zoom >= 0.28;
        this.dynamicDirty = true;
      }
      return;
    }

    if (!this.waypointStationId) return;
    const waypoint = this.world.stationById.get(this.waypointStationId);
    if (!waypoint || !this.visibleStationIds.has(waypoint.id)) {
      this.waypointStationId = null;
      this.dynamicDirty = true;
      return;
    }
    const distance = distanceBetween(this.player, waypoint);
    if (distance <= ARRIVAL_ENTER_RADIUS) {
      this.player = { x: waypoint.x, y: waypoint.y };
      this.waypointStationId = null;
      this.dynamicDirty = true;
      return;
    }
    const directionToWaypoint = {
      x: (waypoint.x - this.player.x) / distance,
      y: (waypoint.y - this.player.y) / distance,
    };
    this.player = stepMovement(this.player, directionToWaypoint, {
      speed: ROUTE_SPEED,
      deltaMs,
      bounds: this.world.bounds,
      maxDeltaMs: 50,
    });
    this.targetCamera = {
      x: this.player.x,
      y: this.player.y,
      zoom: Math.max(this.targetCamera.zoom, 0.58),
    };
    this.staticDirty = true;
    this.dynamicDirty = true;
  }

  private advanceCamera(deltaMs: number): void {
    if (!cameraChanged(this.camera, this.targetCamera)) {
      if (this.camera !== this.targetCamera) this.camera = this.targetCamera;
      return;
    }
    this.camera = this.reducedMotion
      ? this.targetCamera
      : approachCamera(this.camera, this.targetCamera, deltaMs);
    this.staticDirty = true;
    this.dynamicDirty = true;
  }

  private checkArrival(): void {
    const eligibleStationIds = this.spatiallyEligibleStationIds();
    const transition = advanceArrival({
      state: this.arrivalState,
      player: this.player,
      stations: this.world.stations,
      eligibleStationIds,
      enterRadius: ARRIVAL_ENTER_RADIUS,
      exitRadius: ARRIVAL_EXIT_RADIUS,
    });
    this.arrivalState = transition.state;
    if (!transition.enteredStationId) return;
    const station = this.world.stationById.get(transition.enteredStationId);
    if (!station) return;
    const eventId = firstVisibleEventId(station, this.visibleEventIds);
    if (!eventId) return;
    this.waypointStationId = null;
    this.selectedStationId = station.id;
    this.visitedStationIds.add(station.id);
    this.dynamicDirty = true;
    this.callbacks.onArrival?.({ stationId: station.id, eventId });
  }

  private nearestVisibleStation(): { station: TimelineStation; distance: number } | null {
    let nearest: TimelineStation | null = null;
    let distance = Number.POSITIVE_INFINITY;
    for (const station of this.world.stations) {
      if (
        !this.visibleStationIds.has(station.id) ||
        !stationPassesLevelOfDetail(station, this.camera)
      ) continue;
      const nextDistance = distanceBetween(this.player, station);
      if (
        nextDistance < distance ||
        (nextDistance === distance && nearest !== null && station.id.localeCompare(nearest.id) < 0)
      ) {
        nearest = station;
        distance = nextDistance;
      }
    }
    return nearest ? { station: nearest, distance } : null;
  }

  private spatiallyEligibleStationIds(): Set<string> {
    const ids = new Set<string>();
    for (const station of this.world.stations) {
      if (
        this.visibleStationIds.has(station.id) &&
        stationPassesLevelOfDetail(station, this.camera)
      ) {
        ids.add(station.id);
      }
    }

    return ids;
  }

  private cancelWaypoint(): void {
    if (!this.waypointStationId) return;
    this.waypointStationId = null;
    this.callbacks.onStatus?.("MANUAL OVERRIDE // WAYPOINT CANCELLED");
    this.dynamicDirty = true;
  }

  private stepDiscrete(key: string): void {
    const direction = movementVectorFromKeys([key]);
    this.player = stepMovement(this.player, direction, {
      speed: MANUAL_SPEED,
      deltaMs: DISCRETE_STEP_MS,
      bounds: this.world.bounds,
      maxDeltaMs: DISCRETE_STEP_MS,
    });
    if (this.targetCamera.zoom >= 0.28) {
      this.camera = { ...this.camera, x: this.player.x, y: this.player.y };
      this.targetCamera = this.camera;
      this.staticDirty = true;
    }
    this.dynamicDirty = true;
    this.checkArrival();
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (this.paused || isEditableTarget(event.target)) return;
    if (isMovementKey(event.key) || isMovementKey(event.code)) {
      event.preventDefault();
      this.cancelWaypoint();
      if (this.reducedMotion) {
        if (!event.repeat) this.stepDiscrete(isMovementKey(event.code) ? event.code : event.key);
      } else {
        this.pressedKeys.add(isMovementKey(event.code) ? event.code : event.key);
      }
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const eventId = this.openNearest();
      if (eventId && this.selectedStationId) {
        this.callbacks.onArrival?.({ stationId: this.selectedStationId, eventId });
      }
      return;
    }
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      this.zoomBy(1.22);
      return;
    }
    if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      this.zoomBy(0.82);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      this.fit();
    }
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    if (!isMovementKey(event.key) && !isMovementKey(event.code)) return;
    this.pressedKeys.delete(event.code);
    this.pressedKeys.delete(event.key);
  };

  private readonly handleStageBlur = (event: FocusEvent): void => {
    const nextFocus = event.relatedTarget;
    if (nextFocus instanceof Node && this.stage.contains(nextFocus)) return;
    this.pressedKeys.clear();
  };

  private readonly handlePointerDown = (event: PointerEvent): void => {
    if (this.paused || (event.pointerType === "mouse" && event.button !== 0)) return;
    this.focus();
    const point = pointFromPointer(event, this.dynamicCanvas);
    this.pointerGesture = { pointerId: event.pointerId, start: point, moved: false };
    this.dynamicCanvas.setPointerCapture(event.pointerId);
  };

  private readonly handlePointerMove = (event: PointerEvent): void => {
    const point = pointFromPointer(event, this.dynamicCanvas);
    if (this.pointerGesture?.pointerId === event.pointerId) {
      if (Math.hypot(point.x - this.pointerGesture.start.x, point.y - this.pointerGesture.start.y) > 9) {
        this.pointerGesture.moved = true;
      }
    }
    const hit = nearestStationAtScreenPoint(
      point,
      this.world,
      this.camera,
      this.metrics,
      this.visibleStationIds,
      this.metrics.coarsePointer ? 24 : 15,
    );
    const nextHover = hit?.id ?? null;
    if (nextHover !== this.hoveredStationId) {
      this.hoveredStationId = nextHover;
      this.dynamicCanvas.style.cursor = nextHover ? "crosshair" : "default";
      this.dynamicDirty = true;
    }
  };

  private readonly handlePointerUp = (event: PointerEvent): void => {
    const gesture = this.pointerGesture;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const point = pointFromPointer(event, this.dynamicCanvas);
    if (this.dynamicCanvas.hasPointerCapture(event.pointerId)) {
      this.dynamicCanvas.releasePointerCapture(event.pointerId);
    }
    this.pointerGesture = null;
    if (gesture.moved || this.paused) return;
    const station = nearestStationAtScreenPoint(
      point,
      this.world,
      this.camera,
      this.metrics,
      this.visibleStationIds,
      this.metrics.coarsePointer ? 24 : 15,
    );
    if (!station) return;
    const eventId = firstVisibleEventId(station, this.visibleEventIds);
    if (!eventId) return;
    this.startRoute(station, eventId, "pointer");
  };

  private readonly handlePointerCancel = (event: PointerEvent): void => {
    if (this.pointerGesture?.pointerId === event.pointerId) this.pointerGesture = null;
  };

  private readonly handleLostPointerCapture = (event: PointerEvent): void => {
    if (this.pointerGesture?.pointerId === event.pointerId) this.pointerGesture = null;
  };

  private readonly handlePointerLeave = (): void => {
    if (this.pointerGesture) return;
    if (this.hoveredStationId) {
      this.hoveredStationId = null;
      this.dynamicCanvas.style.cursor = "default";
      this.dynamicDirty = true;
    }
  };
}

export const controllerTestHelpers = {
  stationIdsForVisibleEvents,
  firstVisibleEventId,
  initialPlayerPosition,
};
