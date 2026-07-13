import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const rootUrl = new URL("../", import.meta.url);
const rootPath = fileURLToPath(rootUrl);

async function sourceFiles(directory, extensions = null) {
  const absolute = path.join(rootPath, directory);
  let entries;
  try {
    entries = await readdir(absolute, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  const files = [];
  for (const entry of entries) {
    const relative = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await sourceFiles(relative, extensions));
    else if (!extensions || extensions.has(path.extname(entry.name))) files.push(relative);
  }
  return files.sort();
}

async function readSources(directories, extensions = new Set([".ts", ".tsx", ".css"])) {
  const files = (await Promise.all(directories.map((directory) => sourceFiles(directory, extensions)))).flat();
  const contents = await Promise.all(files.map(async (file) => `\n/* ${file} */\n${await readFile(path.join(rootPath, file), "utf8")}`));
  return { files, text: contents.join("\n") };
}

function expectMatch(text, pattern, message) {
  assert.ok(pattern.test(text), message);
}

function expectNoMatch(text, pattern, message) {
  assert.equal(pattern.test(text), false, message);
}

test("ships an English native-web timeline game with an accessible HTML path", async () => {
  const [{ files, text: uiSource }, layout, css] = await Promise.all([
    readSources(["app", "components"]),
    readFile(new URL("app/layout.tsx", rootUrl), "utf8"),
    readFile(new URL("app/globals.css", rootUrl), "utf8"),
  ]);

  assert.ok(files.some((file) => file.endsWith(".tsx")), "expected React UI source files");
  expectMatch(layout, /<html\s+lang=["']en["']/, "the root document must declare English");
  expectMatch(layout, /OpenAI Product Atlas/i, "metadata must name the finished product");
  expectMatch(uiSource, /OPENAI PRODUCT ATLAS/i, "the product wordmark must be visible");
  expectMatch(uiSource, /NOVA/, "the playable character must be named NOVA");
  expectMatch(uiSource, /OPEN NOW/, "the semantic archive must offer a direct-open path");
  expectMatch(uiSource, /OPEN OFFICIAL SOURCE/, "event records must link to official sources");
  expectMatch(uiSource, /<canvas\b/, "the native timeline world must render on Canvas2D");
  expectMatch(uiSource, /role=["']group["']/, "the game stage must expose a labeled group");
  expectMatch(uiSource, /aria-live=["']polite["']/, "arrival changes must use a polite live region");
  expectMatch(uiSource, /TouchControls/, "the mobile game must include explicit touch controls");
  expectMatch(uiSource, /READ/, "the non-pointer read action must remain visible");
  expectNoMatch(uiSource, /[\u3400-\u9fff]/, "visible app/components source must remain English-only");

  expectMatch(css, /prefers-reduced-motion\s*:\s*reduce/, "CSS must provide a reduced-motion mode");
  expectMatch(css, /@media[^\{]*max-width/i, "CSS must include a narrow-screen layout");
  expectMatch(css, /(?:44|48)px/, "touch controls must expose a 44-48px sizing rule");
  expectMatch(css, /input:focus-visible,[\s\S]*select:focus-visible,[\s\S]*outline:\s*2px/, "form controls must retain a visible keyboard focus indicator");
  expectNoMatch(css, /\.input-wrap input,[\s\S]{0,260}outline:\s*0/, "component styling must not suppress form-control focus outlines");
});

test("removes the Godot iframe and game-engine distribution footprint", async () => {
  const [{ text: productSource }, packageJson, vercelConfig, vercelIgnore, buildScript, validateScript] = await Promise.all([
    readSources(["app", "components", "lib"]),
    readFile(new URL("package.json", rootUrl), "utf8"),
    readFile(new URL("vercel.json", rootUrl), "utf8"),
    readFile(new URL(".vercelignore", rootUrl), "utf8"),
    readFile(new URL("scripts/build-timeline-data.mjs", rootUrl), "utf8"),
    readFile(new URL("scripts/validate-timeline-data.mjs", rootUrl), "utf8"),
  ]);
  const shippedSource = [productSource, packageJson, vercelConfig, vercelIgnore, buildScript, validateScript].join("\n");

  expectNoMatch(productSource, /<iframe\b|\/godot\/|Godot/i, "product source must not embed or name the old game runtime");
  expectNoMatch(shippedSource, /godot:|run-godot|\.pck\b|public\/godot|godot\/data/i, "build and deployment source must not reference Godot artifacts");
  expectNoMatch(vercelConfig, /\.wasm\b|\.pck\b|\/godot\//i, "Vercel config must not retain game-engine asset headers");

  const [godotFiles, publicGodotFiles] = await Promise.all([sourceFiles("godot"), sourceFiles("public/godot")]);
  assert.deepEqual(godotFiles, [], "the legacy Godot project must not retain files");
  assert.deepEqual(publicGodotFiles, [], "the public Godot export must not retain files");
  await assert.rejects(access(new URL("scripts/run-godot.mjs", rootUrl)), { code: "ENOENT" });
});

test("publishes every machine-readable timeline download", async () => {
  const files = [
    "public/data/openai-product-timeline-v0.1.json",
    "public/data/openai-product-timeline-v0.1.csv",
    "public/data/openai-product-timeline-v0.1.xlsx",
    "public/data/openai-product-timeline-raw-v0.1.json",
  ];
  await Promise.all(files.map((file) => access(new URL(file, rootUrl))));
});

test("does not retain the previous ECLIPSE product surface", async () => {
  const { text: productSource } = await readSources(["app", "components"]);
  expectNoMatch(productSource, /Sol teaches Luna|CAPABILITY EVOLUTION LAB|RUN EXPERIMENT/, "the prior product concept must not leak into this experience");
});
