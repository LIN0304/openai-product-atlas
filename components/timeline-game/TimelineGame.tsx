"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { buildWorldModel } from "../../lib/game/world-model";
import { filterTimelineEvents, normalizeTimelineViewState } from "../../lib/timeline/search-index";
import type { ExplorerDataset, ExplorerEvent, InitialViewState } from "../../lib/timeline/schema";
import {
  parseTimelineViewState,
  serializeTimelineViewState,
  timelineRouteEventFromHistory,
  TIMELINE_ROUTE_HISTORY_KEY,
} from "../../lib/timeline/view-state";
import { EventDialog } from "./EventDialog";
import { EventIndex } from "./EventIndex";
import { EventInspector } from "./EventInspector";
import { FilterPanel } from "./FilterPanel";
import { GameStage, type GameStageHandle } from "./GameStage";
import { TouchControls } from "./TouchControls";

type TimelineGameProps = {
  initialData: ExplorerDataset;
  initialView: InitialViewState;
  initialRouteId?: string;
};

const VISITED_STORAGE_KEY = "atlas:game:v1:visited";

function readVisited(validIds: ReadonlySet<string>) {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const stored = JSON.parse(window.localStorage.getItem(VISITED_STORAGE_KEY) ?? "[]") as unknown;
    if (!Array.isArray(stored)) return new Set<string>();
    return new Set(stored.filter((value): value is string => typeof value === "string" && validIds.has(value)));
  } catch {
    return new Set<string>();
  }
}

export function TimelineGame({ initialData, initialView, initialRouteId }: TimelineGameProps) {
  const stageRef = useRef<GameStageHandle>(null);
  const filterReturnTargetRef = useRef<HTMLElement | null>(null);
  const dialogReturnTargetRef = useRef<HTMLElement | null>(null);
  const validIds = useMemo(() => new Set(initialData.events.map((event) => event.event_id)), [initialData.events]);
  const eventById = useMemo(() => new Map(initialData.events.map((event) => [event.event_id, event])), [initialData.events]);
  const familyById = useMemo(() => new Map(initialData.taxonomy.map((family) => [family.id, family])), [initialData.taxonomy]);
  const world = useMemo(() => buildWorldModel(initialData), [initialData]);
  const years = useMemo(() => [...new Set(initialData.events.map((event) => event.year))].sort(), [initialData.events]);

  const [query, setQuery] = useState(initialView.query);
  const [family, setFamily] = useState(initialView.family);
  const [year, setYear] = useState(initialView.year);
  const [landmarksOnly, setLandmarksOnly] = useState(initialView.landmarksOnly);
  const [selectedId, setSelectedId] = useState(initialView.selectedId);
  const [view, setView] = useState<"map" | "index">(initialView.view);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(() => new Set());
  const [visitedLoaded, setVisitedLoaded] = useState(false);
  const [dialogEvents, setDialogEvents] = useState<readonly ExplorerEvent[]>([]);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState(false);
  const [status, setStatus] = useState("NOVA ONLINE // AWAITING INPUT");
  const [announcement, setAnnouncement] = useState("Interactive release map ready.");
  const [renderReady, setRenderReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState<boolean | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<{ eventId: string; focus: boolean } | null>(
    initialView.view === "map" && initialRouteId
      ? { eventId: initialRouteId, focus: false }
      : null,
  );

  const filteredEvents = useMemo(() => filterTimelineEvents(initialData.events, {
    query,
    family,
    year,
    landmarksOnly,
  }), [family, initialData.events, landmarksOnly, query, year]);
  const visibleEventIds = useMemo(() => new Set(filteredEvents.map((event) => event.event_id)), [filteredEvents]);
  const selectedEvent = (visibleEventIds.has(selectedId) ? eventById.get(selectedId) : undefined)
    ?? filteredEvents[0];
  const selectedFamily = selectedEvent ? familyById.get(selectedEvent.product_family) : undefined;

  const currentViewState = useCallback((overrides: Partial<InitialViewState> = {}): InitialViewState => ({
    query,
    family,
    year,
    landmarksOnly,
    selectedId: selectedEvent?.event_id ?? selectedId,
    view,
    ...overrides,
  }), [family, landmarksOnly, query, selectedEvent?.event_id, selectedId, view, year]);

  const writeUrl = useCallback((
    mode: "push" | "replace",
    overrides: Partial<InitialViewState> = {},
    hash = "",
    routeEventId = "",
  ) => {
    const search = serializeTimelineViewState(currentViewState(overrides));
    const url = `${window.location.pathname}${search ? `?${search}` : ""}${hash}`;
    const existingState = window.history.state;
    const historyState: Record<string, unknown> = mode === "replace" && existingState && typeof existingState === "object"
      ? { ...existingState }
      : {};
    if (routeEventId) historyState[TIMELINE_ROUTE_HISTORY_KEY] = routeEventId;
    if (mode === "push") window.history.pushState(historyState, "", url);
    else window.history.replaceState(historyState, "", url);
  }, [currentViewState]);

  useEffect(() => {
    if (initialView.view !== "map" || !initialRouteId) return;
    const existingState = window.history.state;
    const historyState: Record<string, unknown> = existingState && typeof existingState === "object"
      ? { ...existingState }
      : {};
    if (historyState[TIMELINE_ROUTE_HISTORY_KEY] === initialRouteId) return;
    historyState[TIMELINE_ROUTE_HISTORY_KEY] = initialRouteId;
    window.history.replaceState(historyState, "", window.location.href);
  }, [initialRouteId, initialView.view]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const drawerMedia = window.matchMedia("(max-width: 1180px) and (min-height: 481px)");
    const updateMotion = () => setReducedMotion(media.matches);
    const updateDrawer = () => setDrawerMode(drawerMedia.matches);
    const frame = window.requestAnimationFrame(() => {
      setVisitedIds(readVisited(validIds));
      setVisitedLoaded(true);
      updateMotion();
      updateDrawer();
    });
    media.addEventListener("change", updateMotion);
    drawerMedia.addEventListener("change", updateDrawer);
    return () => {
      window.cancelAnimationFrame(frame);
      media.removeEventListener("change", updateMotion);
      drawerMedia.removeEventListener("change", updateDrawer);
    };
  }, [validIds]);

  useEffect(() => {
    if (!visitedLoaded) return;
    try {
      window.localStorage.setItem(VISITED_STORAGE_KEY, JSON.stringify([...visitedIds]));
    } catch {
      // The archive remains fully usable when storage is blocked.
    }
  }, [visitedIds, visitedLoaded]);

  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseTimelineViewState(window.location.search, initialData);
      const next = normalizeTimelineViewState(parsed, initialData);
      setQuery(next.query);
      setFamily(next.family);
      setYear(next.year);
      setLandmarksOnly(next.landmarksOnly);
      setSelectedId(next.selectedId);
      setView(next.view);
      setDialogOpen(false);
      setDialogEvents([]);
      setFiltersOpen(false);
      setStatus(next.view === "index" ? "INDEX ONLINE // HISTORY RESTORED" : "NOVA ONLINE // HISTORY RESTORED");
      const routeEventId = timelineRouteEventFromHistory(window.history.state, parsed.selectedId, validIds);
      setPendingRoute(next.view === "map" && routeEventId
        ? { eventId: routeEventId, focus: false }
        : null);
      window.setTimeout(() => {
        const target = next.view === "index" && next.selectedId
          ? document.getElementById(`event-${next.selectedId}`)
          : document.getElementById(next.view === "index" ? "event-index" : "world");
        target?.scrollIntoView();
      }, 0);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [initialData, validIds]);

  useEffect(() => {
    const handleGlobalKey = (event: KeyboardEvent) => {
      if (dialogOpen) return;
      if (event.key === "Escape" && filtersOpen) {
        event.preventDefault();
        setFiltersOpen(false);
        window.requestAnimationFrame(() => {
          if (filterReturnTargetRef.current?.isConnected) filterReturnTargetRef.current.focus();
          else stageRef.current?.focus();
        });
        return;
      }
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;
      event.preventDefault();
      filterReturnTargetRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      setFiltersOpen(true);
      window.requestAnimationFrame(() => document.querySelector<HTMLInputElement>("#atlas-search")?.focus());
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [dialogOpen, filtersOpen]);

  useEffect(() => {
    if (initialView.view !== "index") return;
    const frame = window.requestAnimationFrame(() => {
      const target = initialView.selectedId
        ? document.getElementById(`event-${initialView.selectedId}`)
        : document.getElementById("event-index");
      target?.scrollIntoView();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [initialView.selectedId, initialView.view]);

  useEffect(() => {
    if (!pendingRoute || !visibleEventIds.has(pendingRoute.eventId)) return;
    const { eventId, focus } = pendingRoute;
    const frame = window.requestAnimationFrame(() => {
      stageRef.current?.routeTo(eventId);
      if (focus) stageRef.current?.focus();
      setPendingRoute((current) => current?.eventId === eventId ? null : current);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pendingRoute, visibleEventIds]);

  const markVisited = useCallback((events: readonly ExplorerEvent[]) => {
    setVisitedIds((current) => {
      const next = new Set(current);
      events.forEach((event) => next.add(event.event_id));
      return next;
    });
  }, []);

  const stationEventsFor = useCallback((event: ExplorerEvent): readonly ExplorerEvent[] => {
    const stationId = world.eventToStationId.get(event.event_id);
    const visibleStationEvents = stationId
      ? world.stationById.get(stationId)?.events.filter((candidate) => visibleEventIds.has(candidate.event_id))
      : undefined;
    return visibleStationEvents?.length ? visibleStationEvents : [event];
  }, [visibleEventIds, world]);

  const openRecord = useCallback((
    event: ExplorerEvent,
    historyMode: "push" | "replace" = "push",
    origin: "explicit" | "arrival" = "explicit",
  ) => {
    const stationEvents = stationEventsFor(event);
    const activeIndex = Math.max(0, stationEvents.findIndex((candidate) => candidate.event_id === event.event_id));
    setSelectedId(event.event_id);
    const nextView = origin === "arrival" ? "map" : view;
    setView(nextView);
    setDialogEvents(stationEvents);
    setDialogIndex(activeIndex);
    setDialogOpen(true);
    setFiltersOpen(false);
    dialogReturnTargetRef.current = origin === "explicit" && document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    markVisited([event]);
    setAnnouncement(`Event unlocked: ${event.title_en}, ${event.date}.`);
    setStatus(`INPUT LOCKED // READING ${event.event_id.toUpperCase()}`);
    writeUrl(
      historyMode,
      { selectedId: event.event_id, view: nextView },
      nextView === "index" ? "#event-index" : "#world",
    );
  }, [markVisited, stationEventsFor, view, writeUrl]);

  const routeTo = useCallback((event: ExplorerEvent) => {
    const routeOverrides: Partial<InitialViewState> = { selectedId: event.event_id, view: "map" };
    if (!visibleEventIds.has(event.event_id)) {
      setQuery("");
      setFamily("all");
      setYear("all");
      setLandmarksOnly(false);
      Object.assign(routeOverrides, { query: "", family: "all", year: "all", landmarksOnly: false });
    }
    setSelectedId(event.event_id);
    setView("map");
    setStatus(`ROUTING NOVA // ${event.title_en.toUpperCase()}`);
    writeUrl("push", routeOverrides, "#world", event.event_id);
    setPendingRoute({ eventId: event.event_id, focus: true });
    document.getElementById("world")?.scrollIntoView({ block: "start" });
  }, [visibleEventIds, writeUrl]);

  const copyDeepLink = useCallback(async (event: ExplorerEvent) => {
    writeUrl("replace", { selectedId: event.event_id, view: "map" }, "#world");
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setAnnouncement("The browser blocked clipboard access. Copy the address from the location bar.");
    }
  }, [writeUrl]);

  const applyFilters = useCallback((
    next: Partial<Pick<InitialViewState, "query" | "family" | "year" | "landmarksOnly">>,
    historyMode: "push" | "replace",
  ) => {
    const nextFilters = {
      query: next.query ?? query,
      family: next.family ?? family,
      year: next.year ?? year,
      landmarksOnly: next.landmarksOnly ?? landmarksOnly,
    };
    const matches = filterTimelineEvents(initialData.events, nextFilters);
    const nextSelectedId = matches.some((event) => event.event_id === selectedId)
      ? selectedId
      : matches[0]?.event_id ?? "";
    setQuery(nextFilters.query);
    setFamily(nextFilters.family);
    setYear(nextFilters.year);
    setLandmarksOnly(nextFilters.landmarksOnly);
    setSelectedId(nextSelectedId);
    setDialogOpen(false);
    setDialogEvents([]);
    writeUrl(historyMode, { ...nextFilters, selectedId: nextSelectedId }, view === "index" ? "#event-index" : "#world");
  }, [family, initialData.events, landmarksOnly, query, selectedId, view, writeUrl, year]);

  const resetFilters = useCallback(() => {
    applyFilters({ query: "", family: "all", year: "all", landmarksOnly: false }, "push");
    setStatus("FILTERS RESET // ALL SIGNALS VISIBLE");
  }, [applyFilters]);

  const handleArrival = useCallback(({ eventId }: { stationId: string; eventId: string }) => {
    const event = eventById.get(eventId);
    if (event && visibleEventIds.has(eventId)) openRecord(event, "replace", "arrival");
  }, [eventById, openRecord, visibleEventIds]);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setStatus("NOVA ONLINE // EXIT STATION TO REARM");
    const returnTarget = dialogReturnTargetRef.current;
    dialogReturnTargetRef.current = null;
    window.requestAnimationFrame(() => {
      if (returnTarget?.isConnected) returnTarget.focus({ preventScroll: true });
      else stageRef.current?.focus();
    });
  }, []);

  const handleRead = useCallback(() => {
    const eventId = stageRef.current?.openNearest();
    const event = eventId ? eventById.get(eventId) : undefined;
    if (event && visibleEventIds.has(event.event_id)) openRecord(event, "replace", "explicit");
    else setAnnouncement("No visible event is within reading range.");
  }, [eventById, openRecord, visibleEventIds]);

  const closeFilters = useCallback(() => {
    setFiltersOpen(false);
    window.requestAnimationFrame(() => {
      if (filterReturnTargetRef.current?.isConnected) filterReturnTargetRef.current.focus();
      else stageRef.current?.focus();
    });
  }, []);

  const openFilters = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    filterReturnTargetRef.current = event.currentTarget;
    setFiltersOpen(true);
  }, []);

  const navigateView = useCallback((nextView: "map" | "index") => {
    setView(nextView);
    writeUrl("push", { view: nextView }, nextView === "index" ? "#event-index" : "#world");
    const target = nextView === "index" && selectedEvent
      ? document.getElementById(`event-${selectedEvent.event_id}`)
      : document.getElementById(nextView === "index" ? "event-index" : "world");
    target?.scrollIntoView();
  }, [selectedEvent, writeUrl]);

  const latestLandmarks = useMemo(() => initialData.events.filter((event) => event.node_tier === "landmark").slice(-8), [initialData.events]);
  const firstEvent = initialData.events[0];
  const latestEvent = initialData.events.at(-1);
  const stats = initialData.stats;

  return (
    <main className="atlas-shell">
      <a className="skip-link" href="#event-index">SKIP TO EVENT INDEX</a>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="OpenAI Product Atlas home">
          <span className="wordmark-full" aria-hidden="true">[ @ OPENAI PRODUCT ATLAS ]</span>
          <span className="wordmark-short" aria-hidden="true">@ PRODUCT ATLAS</span>
        </a>
        <nav aria-label="Primary navigation">
          <a className={view === "map" ? "active" : ""} aria-current={view === "map" ? "page" : undefined} href="#world" onClick={(event) => { event.preventDefault(); navigateView("map"); }}>[EXPLORE]</a>
          <a className={view === "index" ? "active" : ""} aria-current={view === "index" ? "page" : undefined} href="#event-index" onClick={(event) => { event.preventDefault(); navigateView("index"); }}>[EVENT INDEX]</a>
          <a href="#methodology">[METHODOLOGY]</a>
          <a href="#downloads">[DOWNLOADS]</a>
        </nav>
        <button className="header-filter" type="button" aria-expanded={filtersOpen} onClick={openFilters}>[FILTER]</button>
        <span className="live-status">&lt; BASELINE v0.1 &gt;</span>
      </header>

      <section className="atlas-intro" id="top">
        <div className="intro-title">
          <p className="eyebrow">OFFICIAL-SOURCE PRODUCT HISTORY / 2022--2026</p>
          <h1>FROM CHATGPT TO GPT-5.6 SOL</h1>
          <p className="intro-command">&gt;_ MOVE THROUGH THE RELEASE NETWORK. ARRIVE AT A NODE TO DECODE WHAT HAPPENED.</p>
        </div>
        <div className="date-chip">[ {initialData.period.start} -- {initialData.period.latest_event} ]</div>
        <div className="stat-line" aria-label="Dataset statistics">
          <span><b>{stats.canonical_map_nodes}</b> EVENTS</span><i>/</i>
          <span><b>{stats.landmarks}</b> LANDMARKS</span><i>/</i>
          <span><b>{stats.product_families}</b> PRODUCT FAMILIES</span><i>/</i>
          <span><b>{stats.official_source_records}</b> OFFICIAL SOURCE GROUPS</span><i>/</i>
          <span><b>{stats.raw_official_entries}</b> RAW RECORDS</span>
        </div>
      </section>

      <section className="world-section" id="world" aria-labelledby="world-title">
        <div className="world-toolbar">
          <div>
            <p className="eyebrow">01 // PLAYABLE ARCHIVE</p>
            <h2 id="world-title">TRAVERSE TO REVEAL</h2>
          </div>
          <div className="toolbar-actions">
            <button type="button" aria-expanded={filtersOpen} onClick={openFilters}>[FILTER]</button>
            <button type="button" onClick={() => stageRef.current?.zoomBy(0.82)} aria-label="Zoom out">[-]</button>
            <button type="button" onClick={() => stageRef.current?.zoomBy(1.22)} aria-label="Zoom in">[+]</button>
            <button type="button" onClick={() => stageRef.current?.fit()}>[FIT]</button>
          </div>
        </div>

        <div className="game-workspace">
          <FilterPanel
            query={query}
            family={family}
            year={year}
            landmarksOnly={landmarksOnly}
            families={initialData.taxonomy}
            years={years}
            resultCount={filteredEvents.length}
            open={filtersOpen}
            inactive={drawerMode && !filtersOpen}
            onQuery={(value) => applyFilters({ query: value }, "replace")}
            onFamily={(value) => applyFilters({ family: value }, "push")}
            onYear={(value) => applyFilters({ year: value }, "push")}
            onLandmarksOnly={(value) => applyFilters({ landmarksOnly: value }, "push")}
            onReset={resetFilters}
            onClose={closeFilters}
          />

          <section className="game-column" aria-label="Playable timeline map">
            <div className="stage-chrome">
              <span>{renderReady ? "MAP ONLINE" : "BUILDING TOPOLOGY"}</span>
              <span>{status}</span>
              <span>READ {String(visitedIds.size).padStart(3, "0")} / {stats.canonical_map_nodes}</span>
            </div>

            {query && (
              <div className="search-results" aria-label="Search results">
                <div className="search-results-head"><span>SEARCH SIGNALS</span><button type="button" onClick={() => applyFilters({ query: "" }, "replace")}>[CLEAR]</button></div>
                {filteredEvents.slice(0, 5).map((event) => (
                  <div className="search-result" key={event.event_id}>
                    <span>{event.date}</span><b>{event.title_en}</b>
                    <button type="button" onClick={() => routeTo(event)}>[ROUTE]</button>
                    <button type="button" onClick={() => openRecord(event)}>[OPEN NOW]</button>
                  </div>
                ))}
                {!filteredEvents.length && <p>NO SIGNAL // CHANGE THE QUERY.</p>}
              </div>
            )}

            <GameStage
              ref={stageRef}
              world={world}
              visibleEventIds={visibleEventIds}
              selectedEventId={selectedEvent?.event_id}
              visitedEventIds={visitedIds}
              paused={dialogOpen}
              reducedMotion={reducedMotion}
              onArrival={handleArrival}
              onSelect={({ eventId, reason }) => {
                setSelectedId(eventId);
                const event = eventById.get(eventId);
                if (event) setStatus(`SIGNAL LOCKED // ${event.title_en.toUpperCase()}`);
                if (reason === "pointer" || reason === "keyboard") {
                  writeUrl("push", { selectedId: eventId, view: "map" }, "#world");
                }
              }}
              onStatus={setStatus}
              onRenderReady={() => setRenderReady(true)}
            />

            <TouchControls
              disabled={dialogOpen}
              onMove={(direction, active) => stageRef.current?.move(direction, active)}
              onRead={handleRead}
              onMap={() => stageRef.current?.fit()}
            />

            <div className="map-status-strip">
              <span>[*] LANDMARK / &lt;X&gt; MAJOR / X. UPDATE</span>
              <span>WASD / ARROWS MOVE // ENTER READ // CLICK ROUTE</span>
              <span>REDUCED MOTION: {reducedMotion === true ? "ON" : "OFF"}</span>
              <span className="map-caveat">OFFICIAL BASELINE // LIVING NOTES MAY CHANGE</span>
            </div>
          </section>

          <EventInspector event={selectedEvent} family={selectedFamily} copied={copied} onRoute={routeTo} onOpen={openRecord} onCopy={copyDeepLink} />
        </div>

        <div className="world-shortcuts">
          <div>
            <span>QUICK ROUTES</span>
            {firstEvent && <button type="button" onClick={() => routeTo(firstEvent)}>[ORIGIN]</button>}
            {latestEvent && <button type="button" onClick={() => routeTo(latestEvent)}>[LATEST]</button>}
            <button type="button" onClick={() => stageRef.current?.fit()}>[RESET MAP]</button>
          </div>
          <div className="session-status"><span>NOVA // BROWSER SESSION</span><b>{visitedIds.size} READ</b></div>
        </div>
      </section>

      <section className="recent-landmarks" aria-labelledby="landmarks-title">
        <div className="section-title-row compact">
          <div><p className="eyebrow">RECENT LANDMARKS</p><h2 id="landmarks-title">FAST TRAVEL SIGNALS</h2></div>
          <span>{latestLandmarks.length} NODES</span>
        </div>
        <div className="landmark-grid">
          {latestLandmarks.map((event) => (
            <button type="button" key={event.event_id} onClick={() => routeTo(event)} style={{ borderColor: event.color }}>
              <b>{event.title_en}</b><span>{event.date}</span><small>[ROUTE NOVA]</small>
            </button>
          ))}
        </div>
      </section>

      <EventIndex events={filteredEvents} families={initialData.taxonomy} selectedEventId={selectedEvent?.event_id ?? ""} onRoute={routeTo} onOpen={openRecord} />

      <section className="method-section" id="methodology" aria-labelledby="method-title">
        <div className="section-title-row">
          <div><p className="eyebrow">03 // PROVENANCE BEFORE SPECTACLE</p><h2 id="method-title">HOW THE ATLAS WAS BUILT</h2></div>
          <p>Extracted 2026-07-13. Event cutoff 2026-07-09. Living official pages can change after extraction.</p>
        </div>
        <div className="method-grid">
          <article><span>[01]</span><h3>OFFICIAL FIRST</h3><p>Launch posts, Help Center release notes, and developer changelogs from OpenAI are the evidence layer.</p></article>
          <article><span>[02]</span><h3>ONE NODE, ONE EVENT</h3><p>A release-note entry can become several dated events. Related records retain their official source references.</p></article>
          <article><span>[03]</span><h3>VISIBLE COVERAGE</h3><p>The map has {stats.canonical_map_nodes} curated nodes. The raw archive preserves {stats.raw_official_entries} extracted records for audit and rebuilding.</p></article>
          <article><span>[04]</span><h3>NO FALSE COMPLETENESS</h3><p>OpenAI updates are distributed across living pages. v0.1 is a reproducible official-source baseline, not every internal change.</p></article>
        </div>
        <div className="source-register">
          <span>PRIMARY SOURCE ENTRY POINTS</span>
          <a href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes" target="_blank" rel="noreferrer">[CHATGPT NOTES]</a>
          <a href="https://help.openai.com/en/articles/9624314-model-release-notes" target="_blank" rel="noreferrer">[MODEL NOTES]</a>
          <a href="https://platform.openai.com/docs/changelog" target="_blank" rel="noreferrer">[API CHANGELOG]</a>
          <a href="https://developers.openai.com/codex/changelog/" target="_blank" rel="noreferrer">[CODEX CHANGELOG]</a>
        </div>
      </section>

      <section className="download-section" id="downloads" aria-labelledby="downloads-title">
        <div><p className="eyebrow">OPEN DATA // VERIFIED FACTS</p><h2 id="downloads-title">TAKE THE ARCHIVE WITH YOU</h2></div>
        <div className="download-row">
          <a href="/data/openai-product-timeline-v0.1.json" download>[JSON]</a>
          <a href="/data/openai-product-timeline-v0.1.csv" download>[CSV]</a>
          <a href="/data/openai-product-timeline-v0.1.xlsx" download>[XLSX]</a>
          <a href="/data/openai-product-timeline-raw-v0.1.json" download>[RAW]</a>
        </div>
      </section>

      <footer className="site-footer">
        <span>@ OPENAI PRODUCT ATLAS / v0.1</span>
        <p>OFFICIAL-SOURCE BASELINE. LIVING RELEASE NOTES MAY CHANGE.</p>
        <span>BUILT FOR EVERYONE.</span>
      </footer>

      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
      <EventDialog
        events={dialogEvents}
        activeIndex={dialogIndex}
        family={dialogEvents[dialogIndex] ? familyById.get(dialogEvents[dialogIndex].product_family) : undefined}
        open={dialogOpen}
        onClose={closeDialog}
        onStep={(nextIndex) => {
          setDialogIndex(nextIndex);
          const event = dialogEvents[nextIndex];
          if (event) {
            setSelectedId(event.event_id);
            markVisited([event]);
            writeUrl(
              "replace",
              { selectedId: event.event_id, view },
              view === "index" ? "#event-index" : "#world",
            );
          }
        }}
      />
    </main>
  );
}
