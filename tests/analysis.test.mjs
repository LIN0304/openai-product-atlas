import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { prepareExplorerDataset } from "../lib/timeline/schema.ts";
import {
  buildTimeBuckets,
  bucketKeyOf,
  bucketIndexForDay,
} from "../lib/analysis/buckets.ts";
import { FAMILY_STACK_ORDER, orderedFamilies, laneFamilies } from "../lib/analysis/families.ts";
import { ERA_ORDER, computeEraBands } from "../lib/analysis/eras.ts";
import { computeKpis, computeBreakdown, perYearCounts } from "../lib/analysis/breakdowns.ts";
import { computeCadence, selectCadenceLandmarks, streamBaseline } from "../lib/analysis/cadence.ts";
import { classifyLineage, deriveModelLineage, tierRadius, LINEAGES } from "../lib/analysis/lineage.ts";
import { computeFamilyHeatmap, heatIntensityPct } from "../lib/analysis/heatmap.ts";

const raw = JSON.parse(await readFile(new URL("../data/openai-product-timeline-v0.1.json", import.meta.url), "utf8"));
const dataset = prepareExplorerDataset(raw);
const events = dataset.events;
const taxonomy = dataset.taxonomy;

test("buildTimeBuckets is contiguous, index-ordered, and spans the data (quarter + month)", () => {
  for (const granularity of ["quarter", "month"]) {
    const buckets = buildTimeBuckets(events, granularity);
    assert.ok(buckets.length > 0);
    buckets.forEach((bucket, index) => {
      assert.equal(bucket.index, index, "index is dense and ordered");
      assert.ok(bucket.endDay >= bucket.startDay, "day span is non-negative");
      assert.ok(bucket.midDay >= bucket.startDay && bucket.midDay <= bucket.endDay);
      if (index > 0) {
        assert.equal(bucket.startDay, buckets[index - 1].endDay + 1, "no gap or overlap between buckets");
      }
    });
    // First and last events land inside the first and last buckets.
    assert.equal(bucketKeyOf(events[0], granularity), buckets[0].key);
    assert.equal(bucketKeyOf(events.at(-1), granularity), buckets.at(-1).key);
    // Year-start flags fire exactly when the year changes.
    buckets.forEach((bucket, index) => {
      const expected = index === 0 || buckets[index - 1].year !== bucket.year;
      assert.equal(bucket.isYearStart, expected);
    });
  }
  const quarters = buildTimeBuckets(events, "quarter");
  assert.match(quarters[0].key, /^\d{4}-Q[1-4]$/);
  assert.equal(bucketIndexForDay(quarters, -99), 0, "days before the range clamp to the first bucket");
  assert.equal(bucketIndexForDay(quarters, 999999), quarters.length - 1, "days after clamp to the last");
});

test("FAMILY_STACK_ORDER is the full CVD-verified taxonomy with confusable hues non-adjacent", () => {
  assert.equal(FAMILY_STACK_ORDER.length, taxonomy.length);
  const ids = new Set(taxonomy.map((f) => f.id));
  for (const id of FAMILY_STACK_ORDER) assert.ok(ids.has(id), `${id} exists in taxonomy`);
  const pos = (id) => FAMILY_STACK_ORDER.indexOf(id);
  // Adjacent-CVD hazards must never be neighbours in the stack.
  assert.ok(Math.abs(pos("developer_platform") - pos("clients_surfaces")) > 1, "blues non-adjacent");
  assert.ok(Math.abs(pos("multimodal") - pos("enterprise_vertical")) > 1, "purples non-adjacent");
  assert.ok(Math.abs(pos("clients_surfaces") - pos("enterprise_vertical")) > 1, "worst pair non-adjacent");
  assert.deepEqual(orderedFamilies(taxonomy).map((f) => f.id), [...FAMILY_STACK_ORDER]);
  assert.deepEqual(laneFamilies(taxonomy).map((f) => f.lane), taxonomy.map((_, i) => i));
});

test("computeEraBands returns present eras in chronological order and accounts for every event", () => {
  const buckets = buildTimeBuckets(events, "quarter");
  const bands = computeEraBands(events, buckets);
  assert.deepEqual(bands.map((b) => b.era), ERA_ORDER.filter((era) => events.some((e) => e.era === era)));
  assert.equal(bands.reduce((sum, b) => sum + b.count, 0), events.length);
  for (const band of bands) {
    assert.ok(band.startIndex >= 0 && band.endIndex < buckets.length);
    assert.ok(band.endIndex >= band.startIndex);
    assert.ok(band.lastDate >= band.firstDate);
  }
});

test("computeKpis reproduces the known dataset constants", () => {
  const kpis = computeKpis(dataset);
  assert.equal(kpis.totalEvents, 326);
  assert.equal(kpis.modelReleases, 79);
  assert.equal(kpis.landmarks, 83);
  assert.equal(kpis.families, 10);
  assert.equal(kpis.sources, 15);
  assert.equal(kpis.spanMonths, 44);
  assert.equal(kpis.peakYear.year, 2025);
  assert.equal(kpis.peakYear.count, 130);
  assert.deepEqual(kpis.perYear.map((y) => y.year), [2022, 2023, 2024, 2025, 2026]);
  assert.deepEqual(kpis.perYear.map((y) => y.count), [4, 31, 53, 130, 108]);
});

test("computeBreakdown totals the dataset, sorts count-desc, and keeps era chronological", () => {
  for (const dim of ["event_type", "lifecycle"]) {
    const bars = computeBreakdown(events, dim);
    assert.equal(bars.reduce((sum, b) => sum + b.count, 0), events.length);
    for (let i = 1; i < bars.length; i += 1) assert.ok(bars[i - 1].count >= bars[i].count, "count descending");
    assert.ok(Math.abs(bars.reduce((sum, b) => sum + b.pct, 0) - 1) < 1e-9, "percentages sum to 1");
  }
  const eventTypes = computeBreakdown(events, "event_type");
  assert.equal(eventTypes[0].key, "launch");
  assert.equal(eventTypes[0].count, 87);
  assert.equal(eventTypes.find((b) => b.key === "model_release").label, "Model release");
  const eras = computeBreakdown(events, "era");
  assert.deepEqual(eras.map((b) => b.key), ERA_ORDER.filter((era) => events.some((e) => e.era === era)));
  assert.deepEqual(perYearCounts(events).map((y) => y.count), [4, 31, 53, 130, 108]);
});

test("computeCadence: per-bucket totals equal the sum of bands and the filtered counts, in stack order", () => {
  const model = computeCadence(events, taxonomy, "quarter");
  assert.deepEqual(model.bands.map((b) => b.familyId), [...FAMILY_STACK_ORDER]);
  // Column totals equal both the band sum and the raw event count per bucket.
  model.buckets.forEach((bucket, col) => {
    const bandSum = model.bands.reduce((sum, band) => sum + band.values[col], 0);
    const rawCount = events.filter((e) => bucketKeyOf(e, "quarter") === bucket.key).length;
    assert.equal(model.totals[col], bandSum);
    assert.equal(model.totals[col], rawCount);
  });
  // Grand total is every event.
  assert.equal(model.bands.reduce((sum, b) => sum + b.total, 0), events.length);
  // Cumulative edges stack correctly.
  model.bands.forEach((band) => band.cumTop.forEach((top, i) => assert.equal(top, band.cumBottom[i] + band.values[i])));
  assert.equal(model.peak.value, model.maxTotal);
  assert.ok(model.maxTotal >= 1);

  // Muting a family drops its band and re-sums honest totals.
  const muted = new Set(["models_reasoning"]);
  const mutedModel = computeCadence(events, taxonomy, "quarter", { muted });
  assert.ok(!mutedModel.bands.some((b) => b.familyId === "models_reasoning"));
  const droppedTotal = events.filter((e) => e.product_family === "models_reasoning").length;
  assert.equal(
    mutedModel.totals.reduce((a, b) => a + b, 0),
    events.length - droppedTotal,
  );

  const landmarks = selectCadenceLandmarks(events, model.buckets, "quarter", 6);
  assert.ok(landmarks.length <= 6);
  landmarks.forEach((mark, i) => { if (i > 0) assert.ok(mark.day >= landmarks[i - 1].day, "landmarks are date-ordered"); });
  assert.equal(streamBaseline([4, 10, 6]).length, 3);
  assert.deepEqual(streamBaseline([4, 10, 6]), [3, 0, 2]);
});

test("classifyLineage routes known models correctly and every release lands in a fixed lane", () => {
  const sample = (product, title) => classifyLineage({ product, title_en: title });
  assert.equal(sample("GPT-4o", "Hello GPT-4o"), "gpt4");
  assert.equal(sample("GPT-4 Turbo", "GPT-4 Turbo preview"), "gpt4");
  assert.equal(sample("OpenAI o1", "Full OpenAI o1 released"), "o_series");
  assert.equal(sample("OpenAI o3 and o3-mini", "Introducing o3"), "o_series");
  assert.equal(sample("GPT-5", "GPT-5 is here"), "gpt5");
  assert.equal(sample("GPT-5-Codex", "GPT-5-Codex"), "gpt5");
  assert.equal(sample("GPT-5.6 Sol", "GPT-5.6 Sol"), "gpt5");
  assert.equal(sample("Sora", "Sora research preview"), "sora");
  assert.equal(sample("gpt-oss", "Open weights gpt-oss"), "open");

  const lineage = deriveModelLineage(events);
  assert.deepEqual(lineage.lanes.map((l) => l.id), LINEAGES.map((l) => l.id));
  const totalNodes = lineage.lanes.reduce((sum, lane) => sum + lane.nodes.length, 0);
  assert.equal(totalNodes, 79, "every model_release is placed in exactly one lane");
  // GPT-5 line is the largest; o1/GPT-5 never leak into GPT-4.
  assert.ok(lineage.lanes.find((l) => l.id === "gpt5").count >= lineage.lanes.find((l) => l.id === "gpt4").count);
  for (const lane of lineage.lanes) {
    lane.nodes.forEach((node, i) => {
      assert.ok(node.t >= 0 && node.t <= 1, "normalised position in range");
      if (i > 0) assert.ok(node.dayIndex >= lane.nodes[i - 1].dayIndex, "nodes date-sorted");
      if (node.isLandmark) assert.ok(node.isKey, "landmarks are always key");
    });
  }
  assert.equal(tierRadius("landmark", 5), Math.min(11, 9 + (5 - 3.5) * 0.6));
  assert.ok(tierRadius("update", 2) >= 4, "minimum radius honoured (>=8px diameter)");
});

test("computeFamilyHeatmap: lane-ordered rows, correct max cell, intensity ramp behaviour", () => {
  const model = computeFamilyHeatmap(events, taxonomy, "quarter");
  assert.deepEqual(model.rows.map((r) => r.familyId), laneFamilies(taxonomy).map((f) => f.id));
  assert.equal(model.maxCell, 15);
  // Row totals equal the family's event count; cells sum to 326.
  let grandTotal = 0;
  for (const row of model.rows) {
    const familyCount = events.filter((e) => e.product_family === row.familyId).length;
    assert.equal(row.rowTotal, familyCount);
    grandTotal += row.rowTotal;
    for (const cell of row.cells) {
      assert.ok(cell.value >= 0);
      assert.ok(Math.abs(cell.intensity01 - cell.value / model.maxCell) < 1e-9);
    }
  }
  assert.equal(grandTotal, events.length);
  // Ramp: zero is empty; a lone release in the busiest quarter still clears the contrast floor.
  assert.equal(heatIntensityPct(0, 15), 0);
  assert.ok(heatIntensityPct(1, 15) >= 30, "sparse cells stay above the ~2:1 contrast band");
  assert.ok(heatIntensityPct(15, 15) <= 85, "capped so in-cell text stays legible");
  assert.ok(heatIntensityPct(8, 15) > heatIntensityPct(2, 15), "monotonic in value");
});
