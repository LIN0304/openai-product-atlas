import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const START = "2022-11-30";
const CUTOFF = "2026-07-13";
const LATEST_EVENT = "2026-07-09";
const EXPECTED_CANONICAL = 326;
const EXPECTED_LANDMARKS = 83;
const EXPECTED_SOURCES = 15;
const EXPECTED_FAMILIES = 10;
const EVENT_TYPES = new Set([
  "launch", "model_release", "model_update", "feature", "platform", "integration",
  "availability", "pricing_quota", "safety", "deprecation", "retirement",
]);
const LIFECYCLES = new Set([
  "active", "research_preview", "beta", "general_availability", "deprecated", "retired",
]);
const NODE_TIERS = new Set(["landmark", "major", "update"]);
const CONFIDENCE_VALUES = new Set(["high", "medium", "low"]);
const EXPECTED_SOURCE_IDS = new Set([
  "chatgpt-release-notes", "model-release-notes", "chatgpt-agent-release-notes",
  "business-release-notes", "enterprise-edu-release-notes", "macos-release-notes",
  "windows-release-notes", "atlas-release-notes", "api-changelog", "api-deprecations",
  "codex-changelog", "apps-sdk-changelog", "introducing-chatgpt",
  "chatgpt-work-and-codex", "sora-discontinuation",
]);
const CSV_COLUMNS = [
  "event_id", "date", "year", "quarter", "day_index", "era", "product_family", "product",
  "event_type", "title_en", "title_zh", "summary_en", "summary_zh", "importance", "node_tier",
  "lifecycle", "map_region", "map_lane", "glyph", "pixel_icon", "x_hint", "y_hint", "source_name",
  "source_url", "source_kind", "coverage_status", "confidence", "tags",
];
const LANE_FILES = [
  "consumer-2022-2024.json",
  "consumer-2025-2026.json",
  "platform-lifecycle.json",
];
const TITLE_NOISE = [
  /^was this article helpful\??$/i,
  /^related articles?$/i,
  /^ask ai$/i,
  /^docs agent$/i,
  /^loading docs agent/i,
  /^submit(?: feedback)?$/i,
  /^skip to (?:main )?content$/i,
  /^openai help center$/i,
  /^cookie settings$/i,
  /^privacy policy$/i,
  /^terms of use$/i,
];
const SUMMARY_NOISE = /was this article helpful\?|loading docs agent|skip to main content/i;

function strictIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function normalizeTitle(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\b(openai|chatgpt|introducing|launching|released?|rolling out|updates?|new|now|available|the|a|an|to|for|in|on|with|and|of)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function officialOpenAiUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && new Set([
      "openai.com", "www.openai.com", "help.openai.com", "platform.openai.com", "developers.openai.com",
    ]).has(url.hostname);
  } catch {
    return false;
  }
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (quoted) throw new Error("CSV ended inside a quoted field");
  if (cell || row.length) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
}

async function loadJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function validateTextFields(record, label, errors, { requireChinese = true, maxTitleLength = 128 } = {}) {
  for (const field of ["title_en", "title_zh", "summary_en", "summary_zh"]) {
    if (typeof record[field] !== "string" || !record[field].trim()) errors.push(`${label}: ${field} must be non-empty`);
  }
  if (requireChinese && record.title_zh && !/[\u3400-\u9fff]/.test(record.title_zh)) errors.push(`${label}: title_zh has no Chinese text`);
  if (requireChinese && record.summary_zh && !/[\u3400-\u9fff]/.test(record.summary_zh)) errors.push(`${label}: summary_zh has no Chinese text`);
  const englishGlueWords = record.title_zh?.match(/\b(?:the|a|an|for|with|from|to|in|on|by|will|this|that|latest|new|used|point|and|or)\b/gi) || [];
  if (requireChinese && englishGlueWords.length >= 2) errors.push(`${label}: title_zh contains mechanically mixed English glue words`);
  if (maxTitleLength && record.title_en?.length > maxTitleLength) errors.push(`${label}: title_en exceeds ${maxTitleLength} characters`);
  if (TITLE_NOISE.some((pattern) => pattern.test(record.title_en || ""))) errors.push(`${label}: extraction chrome leaked into title_en`);
  if (SUMMARY_NOISE.test(record.summary_en || "")) errors.push(`${label}: extraction chrome leaked into summary_en`);
}

function validateEventSource(record, label, errors) {
  if (!record.source_name?.trim()) errors.push(`${label}: source_name must be non-empty`);
  if (!record.source_kind?.trim()) errors.push(`${label}: source_kind must be non-empty`);
  if (!officialOpenAiUrl(record.source_url)) errors.push(`${label}: source_url is not an official OpenAI HTTPS URL (${record.source_url})`);
  if (/r\.jina\.ai/i.test(record.source_url || "")) errors.push(`${label}: extraction transport leaked into source_url`);
}

function anchor(events, predicate, description, errors) {
  const match = events.find(predicate);
  if (!match) errors.push(`missing anchor event: ${description}`);
  return match;
}

export async function validateTimelineData({ root = process.cwd() } = {}) {
  const errors = [];
  const warnings = [];
  const dataDir = path.join(root, "data");
  const publicDataDir = path.join(root, "public/data");
  const timelinePath = path.join(dataDir, "openai-product-timeline-v0.1.json");
  const rawPath = path.join(dataDir, "openai-product-timeline-raw-v0.1.json");
  const csvPath = path.join(dataDir, "openai-product-timeline-v0.1.csv");
  const manifestPath = path.join(root, "research/openai-timeline-v0.1/source-snapshots/manifest.json");

  const [timelineText, rawText, csvText, manifestText] = await Promise.all([
    readFile(timelinePath, "utf8"),
    readFile(rawPath, "utf8"),
    readFile(csvPath, "utf8"),
    readFile(manifestPath, "utf8"),
  ]);
  const timeline = JSON.parse(timelineText);
  const raw = JSON.parse(rawText);
  const manifest = JSON.parse(manifestText);

  if (timeline.schema_version !== "0.1.0") errors.push(`unexpected canonical schema_version: ${timeline.schema_version}`);
  if (raw.schema_version !== "0.1.0-raw") errors.push(`unexpected raw schema_version: ${raw.schema_version}`);
  if (!Number.isFinite(Date.parse(timeline.generated_at))) errors.push("generated_at is not a valid timestamp");
  if (!Number.isFinite(Date.parse(timeline.retrieved_at))) errors.push("retrieved_at is not a valid timestamp");
  if (timeline.period?.start !== START) errors.push(`period.start must be ${START}`);
  if (timeline.period?.cutoff !== CUTOFF) errors.push(`period.cutoff must be ${CUTOFF}`);
  if (timeline.period?.latest_event !== LATEST_EVENT) errors.push(`period.latest_event must be ${LATEST_EVENT}`);
  if (!timeline.methodology?.translation_boundary?.trim()) errors.push("methodology.translation_boundary must document bilingual coverage limits");

  if (!Array.isArray(timeline.taxonomy) || timeline.taxonomy.length !== EXPECTED_FAMILIES) {
    errors.push(`taxonomy must contain exactly ${EXPECTED_FAMILIES} families`);
  }
  const taxonomy = Array.isArray(timeline.taxonomy) ? timeline.taxonomy : [];
  const familyById = new Map();
  const laneIds = new Set();
  for (const family of taxonomy) {
    if (!family.id || familyById.has(family.id)) errors.push(`duplicate or missing taxonomy id: ${family.id}`);
    familyById.set(family.id, family);
    if (!Number.isInteger(family.lane) || family.lane < 0 || family.lane >= EXPECTED_FAMILIES || laneIds.has(family.lane)) {
      errors.push(`invalid or duplicate taxonomy lane for ${family.id}: ${family.lane}`);
    }
    laneIds.add(family.lane);
    for (const field of ["name_en", "name_zh", "region", "glyph", "color", "pixel_icon"]) {
      if (typeof family[field] !== "string" || !family[field].trim()) errors.push(`taxonomy ${family.id}: ${field} must be non-empty`);
    }
    if (!/^#[0-9a-f]{6}$/i.test(family.color || "")) errors.push(`taxonomy ${family.id}: invalid color`);
  }

  if (!Array.isArray(timeline.sources) || timeline.sources.length !== EXPECTED_SOURCES) {
    errors.push(`source registry must contain exactly ${EXPECTED_SOURCES} records`);
  }
  const sourceIds = new Set();
  for (const source of timeline.sources || []) {
    if (!source.id || sourceIds.has(source.id)) errors.push(`duplicate or missing source id: ${source.id}`);
    sourceIds.add(source.id);
    if (!officialOpenAiUrl(source.url)) errors.push(`source registry URL is not official: ${source.url}`);
    if (/r\.jina\.ai/i.test(source.url || "")) errors.push(`source registry leaks extraction transport: ${source.url}`);
  }
  for (const sourceId of EXPECTED_SOURCE_IDS) if (!sourceIds.has(sourceId)) errors.push(`source registry missing ${sourceId}`);
  for (const sourceId of sourceIds) if (!EXPECTED_SOURCE_IDS.has(sourceId)) errors.push(`unexpected source registry id ${sourceId}`);
  if (manifest.sources?.length !== EXPECTED_SOURCES) errors.push(`snapshot manifest must contain ${EXPECTED_SOURCES} sources`);
  const manifestById = new Map((manifest.sources || []).map((source) => [source.id, source]));
  for (const source of timeline.sources || []) {
    const manifestSource = manifestById.get(source.id);
    if (!manifestSource) errors.push(`timeline source ${source.id} missing from manifest`);
    else if (manifestSource.url !== source.url) errors.push(`source URL mismatch for ${source.id}`);
  }

  const events = Array.isArray(timeline.events) ? timeline.events : [];
  if (events.length !== EXPECTED_CANONICAL) errors.push(`canonical timeline must contain exactly ${EXPECTED_CANONICAL} events, got ${events.length}`);
  const eventIds = new Set();
  let priorDate = START;
  const startMs = Date.parse(`${START}T00:00:00Z`);
  const endMs = Date.parse(`${LATEST_EVENT}T00:00:00Z`);
  for (const [index, event] of events.entries()) {
    const label = `events[${index}] ${event.event_id || "<missing-id>"}`;
    if (!/^evt-\d{8}-[a-z0-9-]+$/.test(event.event_id || "")) errors.push(`${label}: invalid event_id format`);
    if (eventIds.has(event.event_id)) errors.push(`${label}: duplicate event_id`);
    eventIds.add(event.event_id);
    if (!strictIsoDate(event.date) || event.date < START || event.date > CUTOFF) errors.push(`${label}: invalid or out-of-scope date ${event.date}`);
    if (event.date < priorDate) errors.push(`${label}: events are not chronological`);
    priorDate = event.date;
    if (event.year !== Number(event.date?.slice(0, 4))) errors.push(`${label}: year does not match date`);
    const month = Number(event.date?.slice(5, 7));
    const expectedQuarter = `Q${Math.floor((month - 1) / 3) + 1}`;
    if (event.quarter !== expectedQuarter) errors.push(`${label}: quarter does not match date`);
    const eventMs = Date.parse(`${event.date}T00:00:00Z`);
    const expectedDayIndex = Math.round((eventMs - startMs) / 86_400_000);
    if (event.day_index !== expectedDayIndex) errors.push(`${label}: day_index does not match date`);
    if (!familyById.has(event.product_family)) errors.push(`${label}: unknown product_family ${event.product_family}`);
    if (!event.product?.trim()) errors.push(`${label}: product must be non-empty`);
    if (!EVENT_TYPES.has(event.event_type)) errors.push(`${label}: invalid event_type ${event.event_type}`);
    if (!LIFECYCLES.has(event.lifecycle)) errors.push(`${label}: invalid lifecycle ${event.lifecycle}`);
    if (event.event_type === "deprecation" && event.lifecycle !== "deprecated") errors.push(`${label}: deprecation must use deprecated lifecycle`);
    if (event.event_type === "retirement" && event.lifecycle !== "retired") errors.push(`${label}: retirement must use retired lifecycle`);
    validateTextFields(event, label, errors);
    if (/OpenAI API Changelog/i.test(event.source_name || "") && event.summary_en.length < event.title_en.length) {
      errors.push(`${label}: shortened API title must retain fuller text in summary_en`);
    }
    if (!Number.isInteger(event.importance) || event.importance < 1 || event.importance > 5) errors.push(`${label}: importance must be an integer from 1 to 5`);
    if (!NODE_TIERS.has(event.node_tier)) errors.push(`${label}: invalid node_tier ${event.node_tier}`);
    const expectedTier = event.node_tier === "landmark" ? 5 : event.importance;
    if (event.node_tier === "landmark" && expectedTier !== event.importance) errors.push(`${label}: landmark importance must be 5`);
    if (event.node_tier === "major" && event.importance < 4) errors.push(`${label}: major node importance must be at least 4`);
    if (event.node_tier === "update" && event.importance >= 4) errors.push(`${label}: update node importance must be below 4`);
    const family = familyById.get(event.product_family);
    if (family) {
      if (event.map_region !== family.region || event.map_lane !== family.lane || event.glyph !== family.glyph
        || event.pixel_icon !== family.pixel_icon || event.color !== family.color) {
        errors.push(`${label}: map metadata does not match taxonomy`);
      }
      const expectedX = Math.round(220 + Math.max(0, Math.min(1, (eventMs - startMs) / (endMs - startMs))) * 3360);
      const laneCenter = 170 + family.lane * 148;
      if (event.x_hint !== expectedX || event.x_hint < 220 || event.x_hint > 3580) errors.push(`${label}: invalid x_hint ${event.x_hint}`);
      if (!Number.isInteger(event.y_hint) || Math.abs(event.y_hint - laneCenter) > 39) errors.push(`${label}: invalid y_hint ${event.y_hint}`);
    }
    validateEventSource(event, label, errors);
    if (!Array.isArray(event.source_refs) || event.source_refs.length === 0) errors.push(`${label}: source_refs must be non-empty`);
    else {
      if (!event.source_refs.some((source) => source.url === event.source_url)) errors.push(`${label}: source_refs must include the primary source_url`);
      for (const [refIndex, source] of event.source_refs.entries()) {
        if (!source.id?.trim() || !source.name?.trim() || !officialOpenAiUrl(source.url)) errors.push(`${label}: invalid source_refs[${refIndex}]`);
      }
    }
    if (!CONFIDENCE_VALUES.has(event.confidence)) errors.push(`${label}: invalid confidence ${event.confidence}`);
    if (!event.coverage_status?.trim()) errors.push(`${label}: coverage_status must be non-empty`);
    if (!Array.isArray(event.tags) || !event.tags.includes(event.product_family) || !event.tags.includes(event.event_type) || !event.tags.includes(event.product)) {
      errors.push(`${label}: tags must include product_family, event_type, and product`);
    }
  }

  const landmarkCount = events.filter((event) => event.node_tier === "landmark").length;
  const latestDate = events.reduce((latest, event) => event.date > latest ? event.date : latest, START);
  const corroborationCount = events.filter((event) => event.source_refs?.length > 1).length;
  if (landmarkCount !== EXPECTED_LANDMARKS) errors.push(`landmark count must be ${EXPECTED_LANDMARKS}, got ${landmarkCount}`);
  if (latestDate !== LATEST_EVENT) errors.push(`latest event date must be ${LATEST_EVENT}, got ${latestDate}`);
  for (const familyId of familyById.keys()) if (!events.some((event) => event.product_family === familyId)) errors.push(`no canonical events for family ${familyId}`);
  const expectedStats = {
    canonical_map_nodes: events.length,
    landmarks: landmarkCount,
    official_source_records: timeline.sources?.length,
    product_families: taxonomy.length,
    cross_source_corroborations: corroborationCount,
  };
  for (const [field, value] of Object.entries(expectedStats)) {
    if (timeline.stats?.[field] !== value) errors.push(`stats.${field} must be ${value}, got ${timeline.stats?.[field]}`);
  }

  const launch = anchor(events, (event) => event.date === START && event.title_en === "Introducing ChatGPT", "ChatGPT launch on 2022-11-30", errors);
  if (launch && (launch.product_family !== "chatgpt_core" || launch.product !== "ChatGPT" || launch.event_type !== "launch"
    || launch.lifecycle !== "research_preview" || launch.source_url !== "https://openai.com/index/chatgpt/")) {
    errors.push("ChatGPT launch anchor has incorrect product, family, lifecycle, type, or source");
  }
  const plus = anchor(events, (event) => event.date === "2023-02-01" && event.title_en === "Introducing ChatGPT Plus", "ChatGPT Plus launch", errors);
  if (plus && (plus.product_family !== "chatgpt_core" || plus.product !== "ChatGPT Plus" || plus.event_type !== "launch")) {
    errors.push("ChatGPT Plus anchor is misclassified");
  }
  const sol = anchor(events, (event) => event.date === LATEST_EVENT && /GPT-5\.6 Sol/.test(event.title_en), "GPT-5.6 Sol on 2026-07-09", errors);
  if (sol && (sol.product_family !== "models_reasoning" || sol.product !== "GPT-5.6 Sol" || sol.event_type !== "model_release")) {
    errors.push("GPT-5.6 Sol anchor is misclassified");
  }
  const work = anchor(events, (event) => event.date === LATEST_EVENT && event.title_en === "Introducing ChatGPT Work", "ChatGPT Work on 2026-07-09", errors);
  if (work && (work.product_family !== "agents_research" || work.product !== "ChatGPT Work" || work.event_type !== "launch")) {
    errors.push("ChatGPT Work anchor is misclassified");
  }
  const sites = anchor(events, (event) => event.date === LATEST_EVENT && event.title_en === "Introducing ChatGPT Sites in public beta", "ChatGPT Sites on 2026-07-09", errors);
  if (sites && (sites.product !== "ChatGPT Sites" || sites.event_type !== "launch" || sites.lifecycle !== "beta")) {
    errors.push("ChatGPT Sites anchor is misclassified");
  }

  const rawEntries = Array.isArray(raw.entries) ? raw.entries : [];
  if (raw.entry_count !== rawEntries.length) errors.push(`raw.entry_count must equal entries.length (${rawEntries.length})`);
  if (raw.source_count !== timeline.sources?.length) errors.push("raw.source_count must equal source registry length");
  if (timeline.stats?.raw_official_entries !== rawEntries.length) errors.push("stats.raw_official_entries must equal raw entry count");
  const rawKeys = new Set();
  let rawPriorDate = START;
  for (const [index, event] of rawEntries.entries()) {
    const label = `raw.entries[${index}] ${event.date || "<missing-date>"} ${event.title_en || "<missing-title>"}`;
    if (!strictIsoDate(event.date) || event.date < START || event.date > CUTOFF) errors.push(`${label}: invalid or out-of-scope date`);
    if (event.date < rawPriorDate) errors.push(`${label}: raw entries are not chronological`);
    rawPriorDate = event.date;
    if (!familyById.has(event.product_family)) errors.push(`${label}: unknown product_family ${event.product_family}`);
    if (!EVENT_TYPES.has(event.event_type)) errors.push(`${label}: invalid event_type ${event.event_type}`);
    if (!LIFECYCLES.has(event.lifecycle)) errors.push(`${label}: invalid lifecycle ${event.lifecycle}`);
    if (event.event_type === "deprecation" && event.lifecycle !== "deprecated") errors.push(`${label}: deprecation must use deprecated lifecycle`);
    if (event.event_type === "retirement" && event.lifecycle !== "retired") errors.push(`${label}: retirement must use retired lifecycle`);
    validateTextFields(event, label, errors);
    if (/OpenAI API Changelog/i.test(event.source_name || "") && event.summary_en.length < event.title_en.length) {
      errors.push(`${label}: shortened API title must retain fuller text in summary_en`);
    }
    validateEventSource(event, label, errors);
    const key = `${event.source_id}|${event.date}|${normalizeTitle(event.title_en)}`;
    if (rawKeys.has(key)) errors.push(`${label}: duplicate normalized raw key`);
    rawKeys.add(key);
  }
  for (const event of events) {
    if (!rawEntries.some((rawEvent) => rawEvent.date === event.date && rawEvent.title_en === event.title_en && rawEvent.product_family === event.product_family)) {
      errors.push(`canonical event has no matching raw record: ${event.event_id}`);
    }
  }

  let csvRows;
  try {
    csvRows = parseCsv(csvText);
  } catch (error) {
    errors.push(`CSV parse failed: ${error.message}`);
    csvRows = [];
  }
  const header = csvRows[0] || [];
  if (header.length !== CSV_COLUMNS.length || !CSV_COLUMNS.every((column, index) => header[index] === column)) errors.push("CSV header does not match canonical schema");
  if (csvRows.length !== events.length + 1) errors.push(`CSV must contain ${events.length} data rows, got ${Math.max(0, csvRows.length - 1)}`);
  for (let index = 0; index < Math.min(events.length, Math.max(0, csvRows.length - 1)); index += 1) {
    const row = csvRows[index + 1];
    if (row.length !== CSV_COLUMNS.length) {
      errors.push(`CSV row ${index + 2} has ${row.length} fields instead of ${CSV_COLUMNS.length}`);
      continue;
    }
    for (let columnIndex = 0; columnIndex < CSV_COLUMNS.length; columnIndex += 1) {
      const column = CSV_COLUMNS[columnIndex];
      const expected = column === "tags" ? JSON.stringify(events[index][column]) : String(events[index][column] ?? "");
      if (row[columnIndex] !== expected) errors.push(`CSV parity mismatch at row ${index + 2}, column ${column}`);
    }
  }

  const copyChecks = [
    [path.join(publicDataDir, "openai-product-timeline-v0.1.json"), timelineText, "public canonical JSON"],
    [path.join(publicDataDir, "openai-product-timeline-raw-v0.1.json"), rawText, "public raw JSON"],
    [path.join(publicDataDir, "openai-product-timeline-v0.1.csv"), csvText, "public CSV"],
  ];
  for (const [filePath, expected, label] of copyChecks) {
    try {
      if (await readFile(filePath, "utf8") !== expected) errors.push(`${label} is not byte-for-byte in sync with data/`);
    } catch (error) {
      errors.push(`${label} is missing or unreadable: ${error.message}`);
    }
  }

  const laneDir = path.join(root, "research/openai-timeline-v0.1/lane-results");
  const laneCounts = {};
  for (const laneFile of LANE_FILES) {
    try {
      const payload = await loadJson(path.join(laneDir, laneFile));
      const records = Array.isArray(payload) ? payload : payload.events;
      if (!Array.isArray(records) || records.length === 0) {
        errors.push(`${laneFile}: expected a non-empty event array`);
        continue;
      }
      laneCounts[laneFile] = records.length;
      for (const [index, record] of records.entries()) {
        const label = `${laneFile}[${index}]`;
        if (!strictIsoDate(record.date) || record.date < START || record.date > CUTOFF) errors.push(`${label}: invalid or out-of-scope date`);
        validateTextFields(record, label, errors, { requireChinese: false, maxTitleLength: null });
        validateEventSource(record, label, errors);
        if (!record.product_family?.trim() || !record.product?.trim() || !record.event_type?.trim() || !record.lifecycle?.trim()) {
          errors.push(`${label}: family, product, type, and lifecycle must be non-empty`);
        }
      }
    } catch (error) {
      errors.push(`${laneFile}: missing or invalid (${error.message})`);
    }
  }
  try {
    const registry = await loadJson(path.join(laneDir, "platform-source-registry.json"));
    if (!Array.isArray(registry.sources) || registry.sources.length === 0) errors.push("platform source registry must be non-empty");
    for (const [index, source] of (registry.sources || []).entries()) {
      if (!officialOpenAiUrl(source.source_url)) errors.push(`platform-source-registry.sources[${index}]: non-official URL`);
    }
  } catch (error) {
    errors.push(`platform-source-registry.json: missing or invalid (${error.message})`);
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    summary: {
      canonical_events: events.length,
      landmarks: landmarkCount,
      source_groups: timeline.sources?.length || 0,
      product_families: taxonomy.length,
      raw_entries: rawEntries.length,
      csv_rows: Math.max(0, csvRows.length - 1),
      lane_counts: laneCounts,
      latest_event: latestDate,
    },
  };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const result = await validateTimelineData();
  if (result.ok) {
    process.stdout.write(`Timeline data validation passed\n${JSON.stringify(result.summary, null, 2)}\n`);
  } else {
    process.stderr.write(`Timeline data validation failed with ${result.errors.length} error(s):\n`);
    for (const error of result.errors) process.stderr.write(`- ${error}\n`);
    process.exitCode = 1;
  }
}
