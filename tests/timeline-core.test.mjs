import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  TimelineDataError,
  prepareExplorerDataset,
} from "../lib/timeline/schema.ts";
import {
  filterTimelineEvents,
  normalizeTimelineViewState,
  searchTimelineEvents,
} from "../lib/timeline/search-index.ts";
import {
  DEFAULT_VIEW_STATE,
  parseTimelineViewState,
  serializeTimelineViewState,
  timelineRouteEventFromHistory,
  TIMELINE_ROUTE_HISTORY_KEY,
} from "../lib/timeline/view-state.ts";
import { buildWorldModel } from "../lib/game/world-model.ts";
import {
  clampPoint,
  fitCameraToBounds,
  screenToWorld,
  worldToScreen,
} from "../lib/game/transforms.ts";
import {
  clampDeltaMs,
  isMovementKey,
  movementVectorFromKeys,
  stepMovement,
} from "../lib/game/input.ts";
import {
  advanceArrival,
  createArrivalState,
} from "../lib/game/arrival.ts";

const raw = JSON.parse(
  await readFile(new URL("../data/openai-product-timeline-v0.1.json", import.meta.url), "utf8"),
);
const dataset = prepareExplorerDataset(raw);
const world = buildWorldModel(dataset);

test("prepares a validated English-only client dataset with the real node-tier contract", () => {
  assert.equal(dataset.events.length, 326);
  assert.equal(dataset.taxonomy.length, 10);
  assert.equal(dataset.sources.length, 15);
  assert.deepEqual(
    Object.fromEntries(
      ["landmark", "major", "update"].map((tier) => [
        tier,
        dataset.events.filter((event) => event.node_tier === tier).length,
      ]),
    ),
    { landmark: 83, major: 227, update: 16 },
  );
  assert.equal(Object.hasOwn(dataset.events[0], "title_zh"), false);
  assert.equal(Object.hasOwn(dataset.events[0], "summary_zh"), false);
  assert.equal(Object.hasOwn(dataset.taxonomy[0], "name_zh"), false);
  assert.doesNotMatch(JSON.stringify(dataset), /[\u3400-\u9fff]/);
  assert.equal(dataset.events[0].title_en, "Introducing ChatGPT");
  assert.equal(dataset.events.at(-1).date, "2026-07-09");
});

test("rejects stale milestone tiers at the runtime data boundary", () => {
  const invalid = structuredClone(raw);
  invalid.events[0].node_tier = "milestone";
  assert.throws(
    () => prepareExplorerDataset(invalid),
    (error) => error instanceof TimelineDataError && /landmark, major, or update/.test(error.message),
  );
});

test("groups the canonical archive into deterministic same-family same-date stations", () => {
  const multiEventStations = world.stations.filter((station) => station.events.length > 1);
  assert.equal(world.stations.length, 283);
  assert.equal(multiEventStations.length, 36);
  assert.equal(multiEventStations.reduce((sum, station) => sum + station.events.length, 0), 79);
  assert.equal(Math.max(...multiEventStations.map((station) => station.events.length)), 4);
  assert.deepEqual(world.bounds, {
    minX: 220,
    minY: 131,
    maxX: 3580,
    maxY: 1540,
    width: 3360,
    height: 1409,
  });

  for (const station of world.stations) {
    assert.ok(station.events.every((event) => event.date === station.date));
    assert.ok(station.events.every((event) => event.product_family === station.familyId));
    assert.ok(station.events.every((event) => event.map_lane === station.lane));
    assert.equal(station.eventIds.length, station.events.length);
    assert.equal(world.stationById.get(station.id), station);
    assert.ok(station.eventIds.every((id) => world.eventToStationId.get(id) === station.id));
  }

  const gpt4o = world.stations.find(
    (station) => station.familyId === "models_reasoning" && station.date === "2024-05-13",
  );
  assert.ok(gpt4o);
  assert.equal(gpt4o.events.length, 2);
  assert.equal(gpt4o.primaryEventId, "evt-20240513-hello-gpt-4o");
  assert.equal(gpt4o.y, 330);
});

test("builds only same-family chronological routes", () => {
  assert.equal(world.routes.length, 10);
  const routedStationIds = new Set();
  for (const route of world.routes) {
    assert.equal(route.stationIds.length, route.points.length);
    let previousDate = "";
    for (const stationId of route.stationIds) {
      const station = world.stationById.get(stationId);
      assert.ok(station);
      assert.equal(station.familyId, route.familyId);
      assert.ok(station.date >= previousDate);
      previousDate = station.date;
      assert.equal(routedStationIds.has(stationId), false);
      routedStationIds.add(stationId);
    }
  }
  assert.equal(routedStationIds.size, world.stations.length);
});

test("camera transforms round-trip and fit the complete world inside padding", () => {
  const viewport = { width: 1_200, height: 700 };
  const camera = { x: 500, y: 300, zoom: 1.75 };
  const worldPoint = { x: 941.25, y: 87.75 };
  const recovered = screenToWorld(worldToScreen(worldPoint, camera, viewport), camera, viewport);
  assert.ok(Math.abs(recovered.x - worldPoint.x) < 1e-9);
  assert.ok(Math.abs(recovered.y - worldPoint.y) < 1e-9);

  const fitted = fitCameraToBounds(world.bounds, viewport, {
    padding: 70,
    minZoom: 0.05,
    maxZoom: 3,
  });
  const topLeft = worldToScreen({ x: world.bounds.minX, y: world.bounds.minY }, fitted, viewport);
  const bottomRight = worldToScreen({ x: world.bounds.maxX, y: world.bounds.maxY }, fitted, viewport);
  assert.ok(topLeft.x >= 70 - 1e-9);
  assert.ok(topLeft.y >= 70 - 1e-9);
  assert.ok(bottomRight.x <= viewport.width - 70 + 1e-9);
  assert.ok(bottomRight.y <= viewport.height - 70 + 1e-9);
  assert.deepEqual(clampPoint({ x: -100, y: 9_000 }, world.bounds), { x: 220, y: 1540 });
});

test("movement input normalizes diagonals and clamps time and world bounds", () => {
  assert.equal(isMovementKey("KeyW"), true);
  assert.equal(isMovementKey("Enter"), false);
  const diagonal = movementVectorFromKeys(new Set(["w", "ArrowRight"]));
  assert.ok(Math.abs(Math.hypot(diagonal.x, diagonal.y) - 1) < 1e-12);
  assert.ok(Math.abs(diagonal.x - Math.SQRT1_2) < 1e-12);
  assert.ok(Math.abs(diagonal.y + Math.SQRT1_2) < 1e-12);
  assert.deepEqual(movementVectorFromKeys(["a", "d"]), { x: 0, y: 0 });
  assert.equal(clampDeltaMs(900), 50);
  assert.equal(clampDeltaMs(-1), 0);

  const bounds = { minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 };
  assert.deepEqual(
    stepMovement({ x: 80, y: 50 }, { x: 1, y: 0 }, { speed: 1_000, deltaMs: 900, bounds }),
    { x: 100, y: 50 },
  );
  assert.deepEqual(
    stepMovement({ x: 80, y: 50 }, { x: 1, y: 0 }, { speed: 1_000, deltaMs: -5, bounds }),
    { x: 80, y: 50 },
  );
});

test("arrival hysteresis opens once per entry and rearms only after exit", () => {
  const base = world.stations[0];
  const stationA = { ...base, id: "station:a", x: 0, y: 0 };
  const stationB = { ...base, id: "station:b", x: 100, y: 0 };
  let transition = advanceArrival({
    state: createArrivalState(),
    player: { x: 0, y: 0 },
    stations: [stationA, stationB],
  });
  assert.equal(transition.enteredStationId, "station:a");

  transition = advanceArrival({
    state: transition.state,
    player: { x: 0, y: 0 },
    stations: [stationA, stationB],
  });
  assert.equal(transition.enteredStationId, null);
  assert.equal(transition.state.latchedStationId, "station:a");

  transition = advanceArrival({
    state: transition.state,
    player: { x: 41.9, y: 0 },
    stations: [stationA, stationB],
  });
  assert.equal(transition.enteredStationId, null);
  assert.equal(transition.state.latchedStationId, "station:a");

  transition = advanceArrival({
    state: transition.state,
    player: { x: 50, y: 0 },
    stations: [stationA, stationB],
  });
  assert.equal(transition.enteredStationId, null);
  assert.equal(transition.state.latchedStationId, null);

  transition = advanceArrival({
    state: transition.state,
    player: { x: 0, y: 0 },
    stations: [stationA, stationB],
  });
  assert.equal(transition.enteredStationId, "station:a");
});

test("arrival ignores hidden stations and resolves exact overlaps by stable id", () => {
  const base = world.stations[0];
  const stationZ = { ...base, id: "station:z", x: 0, y: 0 };
  const stationA = { ...base, id: "station:a", x: 0, y: 0 };
  const hidden = advanceArrival({
    state: createArrivalState(),
    player: { x: 0, y: 0 },
    stations: [stationZ, stationA],
    eligibleStationIds: new Set(),
  });
  assert.equal(hidden.enteredStationId, null);
  assert.equal(hidden.nearestStationId, null);

  const tie = advanceArrival({
    state: createArrivalState(),
    player: { x: 0, y: 0 },
    stations: [stationZ, stationA],
  });
  assert.equal(tie.enteredStationId, "station:a");
});

test("arrival latch survives filter hiding until NOVA exits the station", () => {
  const base = world.stations[0];
  const station = { ...base, id: "station:filtered", x: 0, y: 0 };
  let transition = advanceArrival({
    state: createArrivalState(),
    player: { x: 0, y: 0 },
    stations: [station],
    eligibleStationIds: new Set([station.id]),
  });
  assert.equal(transition.enteredStationId, station.id);

  transition = advanceArrival({
    state: transition.state,
    player: { x: 0, y: 0 },
    stations: [station],
    eligibleStationIds: new Set(),
  });
  assert.equal(transition.enteredStationId, null);
  assert.equal(transition.state.latchedStationId, station.id);

  transition = advanceArrival({
    state: transition.state,
    player: { x: 0, y: 0 },
    stations: [station],
    eligibleStationIds: new Set([station.id]),
  });
  assert.equal(transition.enteredStationId, null);
  assert.equal(transition.state.latchedStationId, station.id);

  transition = advanceArrival({
    state: transition.state,
    player: { x: 50, y: 0 },
    stations: [station],
    eligibleStationIds: new Set(),
  });
  assert.equal(transition.state.latchedStationId, null);
});

test("search and filters inspect English-authoritative fields only", () => {
  const results = searchTimelineEvents(dataset.events, "GPT-4o API");
  assert.ok(results.length > 0);
  assert.ok(results.every((event) => /gpt-4o/i.test(`${event.title_en} ${event.summary_en} ${event.product}`)));
  assert.deepEqual(searchTimelineEvents(dataset.events, "正式誕生"), []);

  const scoped = filterTimelineEvents(dataset.events, {
    query: "ChatGPT",
    family: "chatgpt_core",
    year: 2024,
    landmarksOnly: true,
  });
  assert.ok(scoped.length > 0);
  assert.ok(scoped.every((event) => event.product_family === "chatgpt_core"));
  assert.ok(scoped.every((event) => event.year === 2024));
  assert.ok(scoped.every((event) => event.node_tier === "landmark"));
});

test("URL view state validates ids, omits defaults, and serializes in stable order", () => {
  assert.equal(serializeTimelineViewState(DEFAULT_VIEW_STATE), "");
  assert.deepEqual(
    parseTimelineViewState(
      {
        q: ["  GPT-4o   voice  ", "ignored"],
        family: "not-a-family",
        year: "1999",
        landmarks: "true",
        event: "not-an-event",
        view: "unknown",
      },
      dataset,
    ),
    { ...DEFAULT_VIEW_STATE, query: "GPT-4o voice" },
  );

  const selectedId = dataset.events.find((event) => event.year === 2025).event_id;
  const state = parseTimelineViewState(
    `?q=Codex&family=agents_research&year=2025&landmarks=1&event=${selectedId}&view=index`,
    dataset,
  );
  assert.deepEqual(state, {
    query: "Codex",
    family: "agents_research",
    year: "2025",
    landmarksOnly: true,
    selectedId,
    view: "index",
  });
  assert.equal(
    serializeTimelineViewState(state),
    `q=Codex&family=agents_research&year=2025&landmarks=1&event=${selectedId}&view=index`,
  );
});

test("history replays only explicit route intent for the selected event", () => {
  const selectedId = dataset.events[12].event_id;
  const otherId = dataset.events[13].event_id;
  const validIds = new Set(dataset.events.map((event) => event.event_id));

  assert.equal(timelineRouteEventFromHistory({}, selectedId, validIds), "");
  assert.equal(
    timelineRouteEventFromHistory({ [TIMELINE_ROUTE_HISTORY_KEY]: selectedId }, selectedId, validIds),
    selectedId,
  );
  assert.equal(
    timelineRouteEventFromHistory({ [TIMELINE_ROUTE_HISTORY_KEY]: otherId }, selectedId, validIds),
    "",
  );
  assert.equal(
    timelineRouteEventFromHistory({ [TIMELINE_ROUTE_HISTORY_KEY]: "evt-not-real" }, "evt-not-real", validIds),
    "",
  );
});

test("URL normalization keeps explicit events authoritative without inventing routes for empty results", () => {
  const deepResearch = dataset.events.find((event) => event.event_id === "evt-20250202-introducing-deep-research");
  assert.ok(deepResearch);
  const incompatible = normalizeTimelineViewState({
    query: "",
    family: "chatgpt_core",
    year: "2023",
    landmarksOnly: false,
    selectedId: deepResearch.event_id,
    view: "map",
  }, dataset);
  assert.deepEqual(incompatible, {
    query: "",
    family: "all",
    year: "all",
    landmarksOnly: false,
    selectedId: deepResearch.event_id,
    view: "map",
  });

  const empty = normalizeTimelineViewState({
    ...DEFAULT_VIEW_STATE,
    query: "no-such-signal-zzzz",
  }, dataset);
  assert.equal(empty.selectedId, "");
  assert.equal(empty.query, "no-such-signal-zzzz");
});
