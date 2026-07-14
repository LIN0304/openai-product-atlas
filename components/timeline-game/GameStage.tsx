"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  CanvasGameController,
  type GameArrivalPayload,
  type GameSelectionPayload,
  type MoveDirection,
} from "../../lib/game/controller";
import type { WorldModel } from "../../lib/game/world-model";

export interface GameStageHandle {
  routeTo: (eventId: string) => boolean;
  openNearest: () => string | undefined;
  zoomBy: (factor: number) => void;
  fit: () => void;
  move: (direction: MoveDirection, active: boolean) => void;
  focus: () => void;
}

export interface GameStageProps {
  readonly world: WorldModel;
  readonly visibleEventIds?: ReadonlySet<string> | readonly string[];
  readonly selectedEventId?: string;
  readonly visitedEventIds?: ReadonlySet<string> | readonly string[];
  readonly paused?: boolean;
  readonly focusNonce?: number;
  readonly reducedMotion?: boolean;
  readonly className?: string;
  readonly onArrival?: (payload: GameArrivalPayload) => void;
  readonly onSelect?: (payload: GameSelectionPayload) => void;
  readonly onStatus?: (message: string) => void;
  readonly onRenderReady?: () => void;
}

function setFrom(values: ReadonlySet<string> | readonly string[] | undefined, fallback: readonly string[]): Set<string> {
  if (values === undefined) return new Set(fallback);
  return values instanceof Set ? new Set(values) : new Set(values);
}

function composeClassName(base: string, extra: string | undefined): string {
  return extra ? `${base} ${extra}` : base;
}

export const GameStage = forwardRef<GameStageHandle, GameStageProps>(function GameStage(
  {
    world,
    visibleEventIds,
    selectedEventId,
    visitedEventIds,
    paused = false,
    focusNonce,
    reducedMotion,
    className,
    onArrival,
    onSelect,
    onStatus,
    onRenderReady,
  },
  forwardedRef,
) {
  const stageRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  const dynamicCanvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<CanvasGameController | null>(null);
  const instructionsId = useId();
  const [liveText, setLiveText] = useState("NOVA ready. Focus the map to move.");
  const [renderReady, setRenderReady] = useState(false);

  useImperativeHandle(forwardedRef, () => ({
    routeTo: (eventId) => controllerRef.current?.routeTo(eventId) ?? false,
    openNearest: () => controllerRef.current?.openNearest(),
    zoomBy: (factor) => controllerRef.current?.zoomBy(factor),
    fit: () => controllerRef.current?.fit(),
    move: (direction, active) => controllerRef.current?.move(direction, active),
    focus: () => controllerRef.current?.focus(),
  }), []);

  useEffect(() => {
    const stage = stageRef.current;
    const surface = surfaceRef.current;
    const staticCanvas = staticCanvasRef.current;
    const dynamicCanvas = dynamicCanvasRef.current;
    if (!stage || !surface || !staticCanvas || !dynamicCanvas) return;

    setRenderReady(false);
    delete stage.dataset.renderReady;
    const controller = new CanvasGameController({
      stage,
      staticCanvas,
      dynamicCanvas,
      world,
      callbacks: {
        onArrival,
        onSelect,
        onStatus: (message) => {
          setLiveText(message);
          onStatus?.(message);
        },
        onRenderReady: () => {
          setRenderReady(true);
          onRenderReady?.();
        },
      },
    });
    controllerRef.current = controller;

    const coarseMedia = window.matchMedia("(pointer: coarse)");
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      controller.resize(bounds.width, bounds.height, coarseMedia.matches);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    window.addEventListener("resize", resize);
    coarseMedia.addEventListener("change", resize);

    const initialBounds = stage.getBoundingClientRect();
    let stageVisible = initialBounds.bottom > 0 && initialBounds.top < window.innerHeight;
    let pageVisible = document.visibilityState !== "hidden";
    const syncActivity = () => controller.setActive(stageVisible && pageVisible);
    const intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries.find((candidate) => candidate.target === stage);
      if (!entry) return;
      stageVisible = entry.isIntersecting && entry.intersectionRatio > 0;
      syncActivity();
    });
    const handleVisibilityChange = () => {
      pageVisible = document.visibilityState !== "hidden";
      syncActivity();
    };
    intersectionObserver.observe(stage);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    controller.setVisibleEventIds(setFrom(visibleEventIds, world.stations.flatMap((station) => station.eventIds)));
    controller.setVisitedEventIds(setFrom(visitedEventIds, []));
    controller.setSelectedEventId(selectedEventId);
    controller.setPaused(paused);
    controller.setReducedMotion(reducedMotion ?? motionMedia.matches);
    resize();
    syncActivity();
    controller.start();

    return () => {
      observer.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", resize);
      coarseMedia.removeEventListener("change", resize);
      controller.destroy();
      if (controllerRef.current === controller) controllerRef.current = null;
    };
    // A new world is a new retained scene. Other props update imperatively below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [world]);

  useEffect(() => {
    controllerRef.current?.setCallbacks({
      onArrival,
      onSelect,
      onStatus: (message) => {
        setLiveText(message);
        onStatus?.(message);
      },
      onRenderReady: () => {
        setRenderReady(true);
        onRenderReady?.();
      },
    });
  }, [onArrival, onRenderReady, onSelect, onStatus]);

  useEffect(() => {
    controllerRef.current?.setVisibleEventIds(
      setFrom(visibleEventIds, world.stations.flatMap((station) => station.eventIds)),
    );
  }, [visibleEventIds, world]);

  useEffect(() => {
    controllerRef.current?.setVisitedEventIds(setFrom(visitedEventIds, []));
  }, [visitedEventIds]);

  useEffect(() => {
    controllerRef.current?.setSelectedEventId(selectedEventId);
  }, [selectedEventId]);

  useEffect(() => {
    controllerRef.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller) return;
    if (reducedMotion !== undefined) {
      controller.setReducedMotion(reducedMotion);
      return;
    }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => controller.setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [reducedMotion, world]);

  useEffect(() => {
    if (focusNonce === undefined) return;
    controllerRef.current?.focus();
  }, [focusNonce]);

  const fallback: ReactNode = (
    <span>
      The interactive Canvas map is unavailable. Use the semantic event index below to route or open every record.
    </span>
  );

  return (
    <div
      ref={stageRef}
      className={composeClassName("game-stage", className)}
      role="group"
      tabIndex={0}
      aria-label="Playable OpenAI release timeline"
      aria-describedby={instructionsId}
      aria-busy={!renderReady}
      data-paused={paused ? "true" : "false"}
    >
      <p className="game-stage__instructions sr-only" id={instructionsId}>
        Use W A S D or the arrow keys to move NOVA. Press Enter to read a nearby event. Press plus or minus to zoom and Home to fit the complete timeline. Clicking a visible node sets a waypoint. The event index below provides the same records without the Canvas map.
      </p>
      <div className="game-stage__surface" ref={surfaceRef}>
        <canvas
          ref={staticCanvasRef}
          className="game-stage__canvas game-stage__canvas--static"
          aria-hidden="true"
        >
          {fallback}
        </canvas>
        <canvas
          ref={dynamicCanvasRef}
          className="game-stage__canvas game-stage__canvas--dynamic"
          aria-hidden="true"
        >
          {fallback}
        </canvas>
        {!renderReady && <div className="game-stage__boot" aria-hidden="true">Building timeline topology…</div>}
      </div>
      <output className="game-stage__live sr-only" aria-live="polite" aria-atomic="true">
        {liveText}
      </output>
    </div>
  );
});
