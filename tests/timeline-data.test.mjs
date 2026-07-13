import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

import { parseCsv, validateTimelineData } from "../scripts/validate-timeline-data.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function timeline() {
  return JSON.parse(await readFile(path.join(ROOT, "data/openai-product-timeline-v0.1.json"), "utf8"));
}

test("timeline data, source registry, raw archive, and exported copies pass the full contract", async () => {
  const result = await validateTimelineData({ root: ROOT });
  assert.deepEqual(result.errors, []);
  assert.equal(result.ok, true);
  assert.equal(result.summary.canonical_events, 326);
  assert.equal(result.summary.landmarks, 83);
  assert.equal(result.summary.source_groups, 15);
  assert.equal(result.summary.product_families, 10);
  assert.equal(result.summary.csv_rows, 326);
  assert.equal(result.summary.latest_event, "2026-07-09");
  assert.deepEqual(Object.keys(result.summary.lane_counts).sort(), [
    "consumer-2022-2024.json",
    "consumer-2025-2026.json",
    "platform-lifecycle.json",
  ]);
  assert.ok(Object.values(result.summary.lane_counts).every((count) => count > 0));
  assert.ok(result.summary.raw_entries >= result.summary.canonical_events);
});

test("canonical anchor events preserve product semantics across the full date range", async () => {
  const data = await timeline();
  const byTitle = new Map(data.events.map((event) => [`${event.date}|${event.title_en}`, event]));

  assert.match(byTitle.get("2022-11-30|Introducing ChatGPT")?.source_url || "", /^https:\/\/openai\.com\/index\/chatgpt\/$/);
  assert.deepEqual(
    [
      byTitle.get("2022-11-30|Introducing ChatGPT")?.product_family,
      byTitle.get("2022-11-30|Introducing ChatGPT")?.product,
      byTitle.get("2022-11-30|Introducing ChatGPT")?.event_type,
    ],
    ["chatgpt_core", "ChatGPT", "launch"],
  );
  assert.deepEqual(
    [
      byTitle.get("2023-02-01|Introducing ChatGPT Plus")?.product_family,
      byTitle.get("2023-02-01|Introducing ChatGPT Plus")?.product,
      byTitle.get("2023-02-01|Introducing ChatGPT Plus")?.event_type,
    ],
    ["chatgpt_core", "ChatGPT Plus", "launch"],
  );

  const sol = data.events.find((event) => event.date === "2026-07-09" && /GPT-5\.6 Sol/.test(event.title_en));
  const work = byTitle.get("2026-07-09|Introducing ChatGPT Work");
  const sites = byTitle.get("2026-07-09|Introducing ChatGPT Sites in public beta");
  assert.deepEqual([sol?.product_family, sol?.product, sol?.event_type], ["models_reasoning", "GPT-5.6 Sol", "model_release"]);
  assert.deepEqual([work?.product_family, work?.product, work?.event_type], ["agents_research", "ChatGPT Work", "launch"]);
  assert.deepEqual([sites?.product, sites?.event_type, sites?.lifecycle], ["ChatGPT Sites", "launch", "beta"]);
  assert.equal(data.events.at(-1)?.date, "2026-07-09");
});

test("CSV parser preserves quoted commas, quotes, and embedded newlines", () => {
  const csv = 'id,title,summary\n1,"GPT-5.6, Sol","A ""quoted"" line\ncontinues"\n';
  assert.deepEqual(parseCsv(csv), [
    ["id", "title", "summary"],
    ["1", "GPT-5.6, Sol", 'A "quoted" line\ncontinues'],
  ]);
});
