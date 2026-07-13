import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("ships the Godot product atlas and accessible HTML index", async () => {
  const [page, explorer, css, layout, godotHtml, godotPreset, vercelIgnore] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/timeline-explorer.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("public/godot/index.html", root), "utf8"),
    readFile(new URL("godot/export_presets.cfg", root), "utf8"),
    readFile(new URL(".vercelignore", root), "utf8"),
  ]);
  assert.match(page, /<TimelineExplorer initialData=.*initialFilters=/);
  assert.match(explorer, /\/godot\/index\.html/);
  assert.match(explorer, /產品世界地圖/);
  assert.match(explorer, /事件索引/);
  assert.match(explorer, /OPEN OFFICIAL SOURCE/);
  assert.match(explorer, /aria-live="polite"/);
  assert.match(explorer, /title="OpenAI Product Atlas interactive Godot timeline"/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /@media\(max-width:680px\)/);
  assert.match(css, /height:44px/);
  assert.match(layout, /OpenAI Product Atlas/);
  assert.match(godotHtml, /"focusCanvas":false/);
  assert.match(godotPreset, /html\/focus_canvas_on_start=false/);
  assert.match(vercelIgnore, /^\/godot\/$/m);
  assert.doesNotMatch(vercelIgnore, /^godot\/$/m);
});

test("publishes all machine-readable downloads", async () => {
  const files = [
    "public/data/openai-product-timeline-v0.1.json",
    "public/data/openai-product-timeline-v0.1.csv",
    "public/data/openai-product-timeline-v0.1.xlsx",
    "public/data/openai-product-timeline-raw-v0.1.json",
  ];
  await Promise.all(files.map((file) => access(new URL(file, root))));
});

test("does not retain the previous ECLIPSE product surface", async () => {
  const page = await readFile(new URL("app/timeline-explorer.tsx", root), "utf8");
  assert.doesNotMatch(page, /Sol teaches Luna|CAPABILITY EVOLUTION LAB|RUN EXPERIMENT/);
});
