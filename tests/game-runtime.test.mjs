import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [controller, renderer, stage, touch] = await Promise.all([
  readFile(new URL("../lib/game/controller.ts", import.meta.url), "utf8"),
  readFile(new URL("../lib/game/renderer.ts", import.meta.url), "utf8"),
  readFile(new URL("../components/timeline-game/GameStage.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/timeline-game/TouchControls.tsx", import.meta.url), "utf8"),
]);

test("Canvas runtime keeps one-shot arrival hysteresis and filtered station eligibility wired", () => {
  assert.match(controller, /advanceArrival\(\{/);
  assert.match(controller, /const eligibleStationIds = this\.spatiallyEligibleStationIds\(\)/);
  assert.match(controller, /enterRadius:\s*ARRIVAL_ENTER_RADIUS/);
  assert.match(controller, /exitRadius:\s*ARRIVAL_EXIT_RADIUS/);
  assert.match(controller, /firstVisibleEventId\(station, this\.visibleEventIds\)/);
  assert.match(controller, /if \(paused\) \{[\s\S]*this\.pressedKeys\.clear\(\)/);
  assert.match(controller, /this\.arrivalState\.latchedStationId === nearest\.station\.id/);
  assert.match(controller, /const READ_RADIUS = ARRIVAL_ENTER_RADIUS/);
  assert.match(controller, /stationPassesLevelOfDetail\(station, this\.camera\)/);
  assert.match(controller, /eligibleStationIds,\s*enterRadius:/);
  assert.match(controller, /if \(this\.waypointStationId\) \{[\s\S]*this\.waypointStationId = null;[\s\S]*this\.checkArrival\(\)/);
});

test("renderer preserves the approved ASCII state grammar and bounded mobile DPR", () => {
  assert.match(renderer, /return `\[\$\{station\.glyph\}\]\*`/);
  assert.match(renderer, /return `<\$\{station\.glyph\}>`/);
  assert.match(renderer, /return `\$\{station\.glyph\}\.`/);
  assert.match(renderer, /`>\[\$\{station\.glyph\}\]<`/);
  assert.match(renderer, /`\[\$\{station\.glyph\}\]\+`/);
  assert.match(renderer, /coarsePointer \? 1\.5 : 2/);
  assert.match(renderer, /const MIN_ZOOM = 0\.075/);
  assert.match(renderer, /"→ waypoint"/);
  assert.match(renderer, /camera\.zoom >= 0\.28 \|\| station\.tier === "landmark"/);
  assert.match(renderer, /visibleStationIds\.has\(route\.stationIds\[index - 1\]/);
});

test("GameStage exposes a semantic group, fallback, render-ready gate, and no application role", () => {
  assert.match(stage, /role="group"/);
  assert.doesNotMatch(stage, /role="application"/);
  assert.match(stage, /aria-describedby=\{instructionsId\}/);
  assert.match(stage, /The interactive Canvas map is unavailable/);
  assert.match(stage, /callbacks:\s*\{[\s\S]*onRenderReady:/);
  assert.match(controller, /dataset\.renderReady = "true"/);
});

test("pointer controls terminate holds on cancellation, capture loss, and blur", () => {
  assert.match(controller, /setPointerCapture\(event\.pointerId\)/);
  assert.match(controller, /"pointercancel"/);
  assert.match(controller, /"lostpointercapture"/);
  assert.match(touch, /onPointerCancel=/);
  assert.match(touch, /onLostPointerCapture=/);
  assert.match(touch, /onBlur=/);
  assert.doesNotMatch(controller, /handleStageBlur[\s\S]{0,240}heldDirections\.clear/);
});

test("the hero renderer suspends its RAF loop when offscreen or tab-hidden", () => {
  assert.match(controller, /setActive\(active: boolean\)/);
  assert.match(controller, /if \(this\.frameId !== null\) cancelAnimationFrame\(this\.frameId\)/);
  assert.match(controller, /if \(!this\.running \|\| !this\.active\)/);
  assert.match(stage, /new IntersectionObserver/);
  assert.match(stage, /document\.addEventListener\("visibilitychange"/);
  assert.match(stage, /controller\.setActive\(stageVisible && pageVisible\)/);
});
