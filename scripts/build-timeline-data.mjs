import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SNAPSHOTS = path.join(ROOT, "research/openai-timeline-v0.1/source-snapshots");
const LANES = path.join(ROOT, "research/openai-timeline-v0.1/lane-results");
const DATA_DIR = path.join(ROOT, "data");
const PUBLIC_DATA = path.join(ROOT, "public/data");
const GODOT_DATA = path.join(ROOT, "godot/data");
const START = "2022-11-30";
const CUTOFF = "2026-07-13";
const TARGET_CANONICAL = 326;
const TARGET_LANDMARKS = 83;

const FAMILY_DEFS = [
  { id: "chatgpt_core", name_en: "ChatGPT Core", name_zh: "ChatGPT 核心", region: "Origin Plaza", glyph: "@", color: "#58f6d0", lane: 0, pixel_icon: "home" },
  { id: "models_reasoning", name_en: "Models & Reasoning", name_zh: "模型與推理", region: "Model Mountains", glyph: "^", color: "#f7d85b", lane: 1, pixel_icon: "peak" },
  { id: "agents_research", name_en: "Agents & Research", name_zh: "代理與研究", region: "Agentic Frontier", glyph: ">", color: "#ff8e5b", lane: 2, pixel_icon: "compass" },
  { id: "developer_platform", name_en: "Developer Platform", name_zh: "開發者平台", region: "Toolsmith Harbor", glyph: "#", color: "#6ec8ff", lane: 3, pixel_icon: "terminal" },
  { id: "multimodal", name_en: "Multimodal", name_zh: "多模態", region: "Multimodal Coast", glyph: "~", color: "#a995ff", lane: 4, pixel_icon: "wave" },
  { id: "memory_knowledge", name_en: "Memory & Knowledge", name_zh: "記憶與知識", region: "Memory Forest", glyph: "&", color: "#87e36f", lane: 5, pixel_icon: "tree" },
  { id: "search_commerce", name_en: "Search & Commerce", name_zh: "搜尋與商務", region: "Commerce Bazaar", glyph: "$", color: "#ffb65b", lane: 6, pixel_icon: "shop" },
  { id: "enterprise_vertical", name_en: "Enterprise & Vertical", name_zh: "企業與垂直領域", region: "Enterprise Citadel", glyph: "H", color: "#e69dff", lane: 7, pixel_icon: "citadel" },
  { id: "clients_surfaces", name_en: "Clients & Surfaces", name_zh: "客戶端與介面", region: "Client Archipelago", glyph: "+", color: "#7fd7ff", lane: 8, pixel_icon: "island" },
  { id: "safety_lifecycle", name_en: "Safety & Lifecycle", name_zh: "安全與生命週期", region: "Safety Wall", glyph: "!", color: "#ff6f75", lane: 9, pixel_icon: "shield" },
];

const FAMILY_BY_ID = Object.fromEntries(FAMILY_DEFS.map((family) => [family.id, family]));
const FAMILY_ALIASES = new Map();
for (const family of FAMILY_DEFS) {
  FAMILY_ALIASES.set(family.id, family.id);
  FAMILY_ALIASES.set(family.name_en.toLowerCase(), family.id);
  FAMILY_ALIASES.set(family.name_en.toLowerCase().replaceAll("&", "and"), family.id);
}
const EVENT_TYPES = new Set([
  "launch", "model_release", "model_update", "feature", "platform", "integration",
  "availability", "pricing_quota", "safety", "deprecation", "retirement",
]);
const LIFECYCLES = new Set([
  "active", "research_preview", "beta", "general_availability", "deprecated", "retired",
]);
const MONTHS = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3,
  apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7,
  aug: 8, august: 8, sep: 9, sept: 9, september: 9, oct: 10,
  october: 10, nov: 11, november: 11, dec: 12, december: 12,
};
const MONTH_PATTERN = Object.keys(MONTHS).sort((a, b) => b.length - a.length).join("|");

function cleanInline(value = "") {
  return value
    .replace(/\*\*/g, "")
    .replace(/__+/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanSummary(lines) {
  const parts = [];
  for (const raw of lines) {
    const value = cleanInline(raw.replace(/^[-*]\s+/, ""));
    if (!value || /^Build:/i.test(value) || /^Image\b/i.test(value)) continue;
    if (/^(Learn more|Public link|Related articles|Was this article helpful)/i.test(value)) continue;
    if (/^(New features|Fixes|Bug fixes|Improvements|Performance improvements)$/i.test(value)) continue;
    if (/^\|/.test(raw) || /^---/.test(value)) continue;
    if (value.length < 18 && !/[.!?]$/.test(value)) continue;
    parts.push(value);
    if (parts.join(" ").length >= 360 || parts.length >= 2) break;
  }
  const summary = parts.join(" ").replace(/\s+/g, " ").trim();
  return summary.length > 440 ? `${summary.slice(0, 437).trim()}…` : summary;
}

function apiTitleFromText(value) {
  const original = cleanInline(value);
  let title = original
    .replace(/^v1\/[a-z0-9_./-]+\s+(?=(?:released|added|updated|introduced|launched|fixed|expanded|announced)\b)/i, "")
    .split(/(?<=[.!?])\s/)[0]
    .split(/\s+(?=(?:Deprecated|Added|Updated|Introduced|Launched|Released|Fixed|Expanded|Announced)\b)/)[0]
    .split(/\s*[:—]\s*/)[0]
    .replace(/\s*,\s*(?:including|which|with support for|allowing|enabling|along with|updated|our newest|a new|an updated)\b.*$/i, "")
    .replace(/\s+([,.;:])/g, "$1")
    .trim();
  if (title.length > 128 && title.includes(",")) title = title.split(",")[0].trim();
  if (title.length > 128) {
    const clipped = title.slice(0, 124).replace(/\s+\S*$/, "").replace(/[,:;.-]+$/, "");
    title = `${clipped}…`;
  }
  return title || original;
}

function isoDate(year, month, day) {
  const candidate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const parsed = new Date(`${candidate}T00:00:00Z`);
  return Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== candidate ? null : candidate;
}

function parseDate(value, fallbackYear = null) {
  const text = cleanInline(value)
    .replace(/(\d)(st|nd|rd|th)\b/gi, "$1")
    .replace(/([A-Za-z]+),\s*(\d)/, "$1 $2");
  const explicit = text.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (explicit) return isoDate(Number(explicit[1]), Number(explicit[2]), Number(explicit[3]));
  const monthDate = text.match(new RegExp(`\\b(${MONTH_PATTERN})\\s+(\\d{1,2})(?:,)?\\s+(20\\d{2})\\b`, "i"));
  if (monthDate) return isoDate(Number(monthDate[3]), MONTHS[monthDate[1].toLowerCase()], Number(monthDate[2]));
  if (fallbackYear) {
    const shortDate = text.match(new RegExp(`\\b(${MONTH_PATTERN})\\s+(\\d{1,2})\\b`, "i"));
    if (shortDate) return isoDate(Number(fallbackYear), MONTHS[shortDate[1].toLowerCase()], Number(shortDate[2]));
  }
  return null;
}

function withinScope(date) {
  return Boolean(date && date >= START && date <= CUTOFF);
}

function slugify(value) {
  return cleanInline(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 58) || "update";
}

function normalizeTitle(value) {
  return cleanInline(value)
    .toLowerCase()
    .replace(/\b(openai|chatgpt|introducing|launching|released?|rolling out|updates?|new|now|available|the|a|an|to|for|in|on|with|and|of)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSimilarity(a, b) {
  const left = new Set(normalizeTitle(a).split(" ").filter(Boolean));
  const right = new Set(normalizeTitle(b).split(" ").filter(Boolean));
  if (!left.size || !right.size) return 0;
  let overlap = 0;
  for (const token of left) if (right.has(token)) overlap += 1;
  return overlap / Math.max(left.size, right.size);
}

function normalizeFamilyId(value) {
  if (!value) return null;
  const raw = String(value).trim().toLowerCase();
  if (FAMILY_BY_ID[raw]) return raw;
  const normalized = cleanInline(raw).replaceAll("&", "and");
  return FAMILY_ALIASES.get(normalized) || FAMILY_ALIASES.get(normalized.replaceAll(" ", "_")) || null;
}

function inferFamily(title, summary, sourceId, suggested = null) {
  const familyHint = normalizeFamilyId(suggested);
  if (familyHint) return familyHint;
  const text = `${title} ${summary} ${sourceId}`.toLowerCase();
  if (/(\bretir|\bdeprecat|\bsunset\b|\bshutdown\b|\bsafety\b|\bsecurity\b|\bmodel spec\b|\bmoderation\b|\btrusted contact\b|\bage prediction\b|\blockdown\b)/.test(text)) return "safety_lifecycle";
  if (/\bchatgpt (?:plus|free|pro)\b/.test(text)) return "chatgpt_core";
  if (/(\bmacos\b|\bwindows\b|\bdesktop\b|\bios\b|\bandroid\b|\bmobile\b|\batlas\b|\bcarplay\b|\bcompanion window\b)/.test(text)) return "clients_surfaces";
  if (/(\benterprise\b|\bbusiness\b|\bteam plan\b|\bedu\b|\badmin\b|\bworkspace\b|\bcompliance\b|\bdata residency\b|\brbac\b|\bekm\b|\bhealth\b|\bclinician\b)/.test(text)) return "enterprise_vertical";
  if (/(\bcodex\b|\bagents?\b|\bagentic\b|\bdeep research\b|\boperator\b|\bchatgpt work\b|\bscheduled tasks?\b|\bpulse\b|\bcomputer use\b|\brecord & replay\b)/.test(text)) return "agents_research";
  if (/(\bvoice\b|\baudio\b|\bimages?\b|\bimage generation\b|\bdall|\bsora\b|\bvideo\b|\bvision\b|\bcamera\b|\bphoto\b|\bdictation\b|\bmultimodal\b|\brealtime voice\b)/.test(text)) return "multimodal";
  if (/(\bgpt[-\s]?\d|\bgpt-oss\b|\bo[134](?:-|\b)|\bmodel\b|\breasoning\b|\bturbo\b)/.test(text)) return "models_reasoning";
  if (/(\bapi\b|\bsdk\b|\bmcp\b|\bresponses\b|\bassistants\b|\bbatch\b|\bfine.?tun|\bembedding\b|\bwebhook\b|\bfunction calling\b|\btool calling\b|\bdeveloper\b|\bplayground\b)/.test(text)) return "developer_platform";
  if (/(\bmemory\b|\bprojects?\b|\bfile library\b|\blibrary\b|\bcanvas\b|\bknowledge\b|\bconversation history\b|\bsources tab\b)/.test(text)) return "memory_knowledge";
  if (/(\bsearch\b|\bshopping\b|\bcommerce\b|\bcheckout\b|\bads?\b|\badvertis|\bfinance\b|\bjobs?\b|\blocal business\b)/.test(text)) return "search_commerce";
  return "chatgpt_core";
}

function inferProduct(title, summary, sourceId) {
  const text = `${title} ${summary}`;
  const checks = [
    [/GPT-5\.6\s*Sol/i, "GPT-5.6 Sol"],
    [/GPT-5\.5/i, "GPT-5.5"],
    [/GPT-5\.4/i, "GPT-5.4"],
    [/GPT-5\.3[-\s]?Codex[-\s]?Spark/i, "GPT-5.3-Codex-Spark"],
    [/GPT-5\.3[-\s]?Codex/i, "GPT-5.3-Codex"],
    [/GPT-5\.3/i, "GPT-5.3"],
    [/GPT-5\.2/i, "GPT-5.2"],
    [/GPT-5\.1/i, "GPT-5.1"],
    [/GPT-5\b/i, "GPT-5"],
    [/GPT-4\.5/i, "GPT-4.5"],
    [/GPT-4\.1/i, "GPT-4.1"],
    [/GPT-4o/i, "GPT-4o"],
    [/\bo3-pro\b/i, "o3-pro"],
    [/\bo4-mini\b/i, "o4-mini"],
    [/\bo3\b/i, "o3"],
    [/\bo1\b/i, "o1"],
    [/ChatGPT Work/i, "ChatGPT Work"],
    [/ChatGPT Sites|\bSites\b/i, "ChatGPT Sites"],
    [/ChatGPT Plus/i, "ChatGPT Plus"],
    [/Codex/i, "Codex"],
    [/deep research/i, "Deep Research"],
    [/ChatGPT agent|agent mode/i, "ChatGPT Agent"],
    [/Operator/i, "Operator"],
    [/Atlas/i, "ChatGPT Atlas"],
    [/Sora/i, "Sora"],
    [/Voice|audio/i, "ChatGPT Voice"],
    [/Images|image generation|DALL/i, "ChatGPT Images"],
    [/\bSearch\b/i, "ChatGPT Search"],
    [/Memory/i, "ChatGPT Memory"],
    [/Projects?/i, "ChatGPT Projects"],
    [/Apps SDK/i, "Apps SDK"],
    [/Responses API/i, "Responses API"],
    [/Realtime API/i, "Realtime API"],
    [/API/i, "OpenAI API"],
    [/macOS/i, "ChatGPT macOS"],
    [/Windows/i, "ChatGPT Windows"],
    [/Enterprise|Edu/i, "ChatGPT Enterprise & Edu"],
    [/Business|Team/i, "ChatGPT Business"],
  ];
  for (const [pattern, product] of checks) if (pattern.test(text)) return product;
  if (sourceId === "api-changelog" || sourceId === "api-deprecations") return "OpenAI API";
  if (sourceId === "apps-sdk-changelog") return "Apps SDK";
  return "ChatGPT";
}

function inferEventType(title, summary) {
  const text = `${title} ${summary}`.toLowerCase();
  const titleText = title.toLowerCase();
  if (/(retir|sunset|shut down|discontinu)/.test(text)) return "retirement";
  if (/(deprecat|legacy)/.test(text)) return "deprecation";
  const launchLike = /(introduc|launch|debut|research preview|public beta|released?)/.test(text);
  const modelTitle = /(\bgpt[-\s]?\d|\bgpt-oss\b|\bo[134](?:-|\b)|\bmodel\b)/.test(titleText);
  if (launchLike && modelTitle) return "model_release";
  if (/(safety|security|moderation|trusted contact|model spec|age prediction|lockdown)/.test(text)) return "safety";
  if (/(pricing|price|credits|limits|quota|billing|subscription|plan)/.test(text)) return "pricing_quota";
  if (launchLike) return "launch";
  if (/(available|availability|rolling out|expands? to|for all)/.test(text)) return "availability";
  if (/(api|sdk|mcp|platform|endpoint|developer)/.test(text)) return "platform";
  if (/(integration|connector|app for|with apps)/.test(text)) return "integration";
  if (/(fix|improv|update|redesign)/.test(text)) return "model_update";
  return "feature";
}

function normalizeEventType(value, title, summary) {
  const normalized = String(value || "").trim().toLowerCase().replace(/[-\s]+/g, "_");
  if (EVENT_TYPES.has(normalized)) return normalized;
  if (normalized === "security") return "safety";
  if (normalized === "rebrand") return "feature";
  return inferEventType(title, summary);
}

function lifecycleFor(eventType, title) {
  if (eventType === "retirement") return "retired";
  if (eventType === "deprecation") return "deprecated";
  if (/preview/i.test(title)) return "research_preview";
  if (/beta/i.test(title)) return "beta";
  if (/general availability|\bGA\b/i.test(title)) return "general_availability";
  return "active";
}

function normalizeLifecycle(value, eventType, title) {
  const normalized = String(value || "").trim().toLowerCase().replace(/[-\s]+/g, "_");
  if (eventType === "retirement") return "retired";
  if (eventType === "deprecation") return "deprecated";
  if (LIFECYCLES.has(normalized)) return normalized;
  if (/retir|discontinu|sunset/.test(normalized)) return "retired";
  if (/deprecat/.test(normalized)) return "deprecated";
  if (/beta/.test(normalized)) return "beta";
  if (/general_availability|\bga\b/.test(normalized)) return "general_availability";
  if (/preview|alpha|experiment|prototype|early_access|limited_time/.test(normalized)) return "research_preview";
  return lifecycleFor(eventType, title);
}

function translateTitle(title) {
  let value = cleanInline(title);
  const replacements = [
    [/^Introducing\s+/i, "推出"], [/^Launching\s+/i, "推出"],
    [/^Released?\s+/i, "發布"], [/^Retiring\s+/i, "退役："],
    [/^Deprecating\s+/i, "淘汰："], [/^Updates? to\s+/i, "更新："],
    [/^Improvements? to\s+/i, "改進："], [/^Improved\s+/i, "改進："],
    [/^New\s+/i, "新增"], [/\bin ChatGPT\b/gi, "於 ChatGPT"],
    [/\bfor all users\b/gi, "面向所有使用者"], [/\bfor paid users\b/gi, "面向付費使用者"],
    [/\bpublic beta\b/gi, "公開測試"], [/\bresearch preview\b/gi, "研究預覽"],
    [/\bgeneral availability\b/gi, "正式開放"], [/\brelease notes\b/gi, "發布說明"],
  ];
  for (const [pattern, replacement] of replacements) value = value.replace(pattern, replacement);
  return value;
}

function ensureZhTitle(title, proposed, eventType, product) {
  const translated = cleanInline(proposed || translateTitle(title));
  const prefix = {
    launch: "推出：", model_release: "模型發布：", model_update: "模型更新：",
    feature: "功能更新：", platform: "平台更新：", integration: "整合更新：",
    availability: "開放使用：", pricing_quota: "方案更新：", safety: "安全更新：",
    deprecation: "淘汰通知：", retirement: "退役：",
  }[eventType] || "產品更新：";
  const englishGlueWords = translated.match(/\b(?:the|a|an|for|with|from|to|in|on|by|will|this|that|latest|new|used|point|and|or)\b/gi) || [];
  if (/[\u3400-\u9fff]/.test(translated) && englishGlueWords.length < 2) return translated;
  if (englishGlueWords.length >= 2) return `${prefix}${product}`;
  return `${prefix}${translated}`;
}

function translateSummary(event) {
  const action = {
    launch: "推出新產品或能力",
    model_release: "發布模型",
    model_update: "更新模型或體驗",
    feature: "新增功能",
    platform: "更新開發者平台",
    integration: "新增整合",
    availability: "擴大開放範圍",
    pricing_quota: "調整方案、額度或計費",
    safety: "更新安全與治理機制",
    deprecation: "公布淘汰計畫",
    retirement: "完成退役或停止服務",
  }[event.event_type] ?? "發布更新";
  return `OpenAI 於 ${event.date} 為 ${event.product} ${action}；此節點依官方發布記錄整理，完整能力、適用方案與限制請見來源。`;
}

function makeEvent({ date, title, summary, source, sourceUrl, sourceName, sourceKind, suggestedFamily, ...extra }) {
  const originalTitle = cleanInline(title);
  const isApiChangelog = source === "api-changelog" || /\/api\/docs\/changelog|\/docs\/changelog/i.test(sourceUrl || "");
  const cleanTitle = isApiChangelog ? apiTitleFromText(originalTitle) : originalTitle;
  const cleanBody = cleanSummary(Array.isArray(summary) ? summary : [summary]);
  if (!withinScope(date) || !cleanTitle) return null;
  if (/^(was this article helpful\?|related articles|ask ai|docs agent|loading docs agent|submit)$/i.test(cleanTitle)) return null;
  const family = inferFamily(cleanTitle, cleanBody, source, suggestedFamily);
  const eventType = normalizeEventType(extra.event_type, cleanTitle, cleanBody);
  const product = cleanInline(extra.product || inferProduct(cleanTitle, cleanBody, source));
  const event = {
    date,
    title_en: cleanTitle,
    title_zh: ensureZhTitle(cleanTitle, extra.title_zh, eventType, product),
    summary_en: cleanBody || `${originalTitle || cleanTitle}.`,
    summary_zh: cleanInline(extra.summary_zh || ""),
    product_family: family,
    product,
    event_type: eventType,
    lifecycle: normalizeLifecycle(extra.lifecycle, eventType, cleanTitle),
    source_id: source,
    source_name: sourceName,
    source_url: sourceUrl,
    source_kind: sourceKind,
    coverage_status: extra.coverage_status || "parsed",
    confidence: extra.confidence || "high",
    tags: Array.isArray(extra.tags) ? extra.tags : [],
    supplied_importance: Number(extra.importance || 0),
  };
  event.summary_zh ||= translateSummary(event);
  return event;
}

function parseH1Dated(markdown, source) {
  const lines = markdown.split(/\r?\n/);
  const events = [];
  let date = null;
  let current = null;
  const flush = () => {
    if (!current || !date) return;
    const event = makeEvent({ date, title: current.title, summary: current.body, ...source });
    if (event) events.push(event);
    current = null;
  };
  for (const line of lines) {
    const h1 = line.match(/^#\s+(.+)$/);
    const h2 = line.match(/^##\s+(.+)$/);
    if (h1) {
      flush();
      date = parseDate(h1[1]);
      continue;
    }
    if (h2 && date) {
      flush();
      current = { title: h2[1], body: [] };
      continue;
    }
    if (current) current.body.push(line);
  }
  flush();
  return events;
}

function parseAtlas(markdown, source) {
  const lines = markdown.split(/\r?\n/);
  const events = [];
  let date = null;
  let current = null;
  const flush = () => {
    if (!current || !date) return;
    const event = makeEvent({ date, title: current.title, summary: current.body, ...source });
    if (event) events.push(event);
    current = null;
  };
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      const candidateDate = parseDate(h2[1]);
      if (candidateDate) {
        flush();
        date = candidateDate;
      } else if (date) {
        flush();
        current = { title: h2[1], body: [] };
      }
      continue;
    }
    if (current) current.body.push(line);
  }
  flush();
  return events;
}

const MODEL_DATE_FALLBACKS = new Map([
  ["gpt-5", "2025-08-07"],
  ["introducing gpt-5-codex-mini", "2025-11-07"],
]);

function parseModelNotes(markdown, source) {
  const lines = markdown.split(/\r?\n/);
  const events = [];
  for (let index = 0; index < lines.length; index += 1) {
    const h2 = lines[index].match(/^##\s+(.+)$/);
    if (!h2) continue;
    const title = cleanInline(h2[1]);
    let date = parseDate(title) || MODEL_DATE_FALLBACKS.get(normalizeTitle(title)) || null;
    if (!date) continue;
    const body = [];
    for (let cursor = index + 1; cursor < lines.length && !/^##\s+/.test(lines[cursor]); cursor += 1) body.push(lines[cursor]);
    const titleWithoutDate = title.replace(/\s*\([^)]*20\d{2}[^)]*\)\s*$/, "").trim();
    const event = makeEvent({ date, title: titleWithoutDate, summary: body, ...source });
    if (event) events.push(event);
  }
  return events;
}

function parseDatedH3(markdown, source) {
  const lines = markdown.split(/\r?\n/);
  const events = [];
  let date = null;
  for (let index = 0; index < lines.length; index += 1) {
    const dateLine = lines[index].match(/^\*\s+(20\d{2}-\d{2}-\d{2})\s*$/);
    if (dateLine) {
      date = dateLine[1];
      continue;
    }
    const h3 = lines[index].match(/^###\s+(.+)$/);
    if (!h3 || !date) continue;
    const title = cleanInline(h3[1]);
    if (/^(new features|bug fixes|fixes|improvements|performance improvements)/i.test(title)) continue;
    const body = [];
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      if (/^\*\s+20\d{2}-\d{2}-\d{2}/.test(lines[cursor]) || /^###\s+/.test(lines[cursor]) || /^##\s+/.test(lines[cursor])) break;
      body.push(lines[cursor]);
    }
    const event = makeEvent({ date, title, summary: body, ...source });
    if (event) events.push(event);
  }
  return events;
}

function parseApiChangelog(markdown, source) {
  const lines = markdown.split(/\r?\n/);
  const events = [];
  let year = null;
  for (let index = 0; index < lines.length; index += 1) {
    const monthHeading = lines[index].match(/^###\s+([A-Za-z]+),\s*(20\d{2})/);
    if (monthHeading) {
      year = Number(monthHeading[2]);
      continue;
    }
    if (!year) continue;
    const shortDate = lines[index].match(new RegExp(`^(${MONTH_PATTERN})\\s+(\\d{1,2})$`, "i"));
    if (!shortDate) continue;
    const date = isoDate(year, MONTHS[shortDate[1].toLowerCase()], Number(shortDate[2]));
    const body = [];
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      if (/^###\s+/.test(lines[cursor]) || new RegExp(`^(${MONTH_PATTERN})\\s+\\d{1,2}$`, "i").test(lines[cursor])) break;
      body.push(lines[cursor]);
    }
    const summary = cleanSummary(body);
    if (!summary) continue;
    const title = summary.split(/(?<=[.!?])\s/)[0].slice(0, 150);
    const event = makeEvent({ date, title, summary, ...source });
    if (event) events.push(event);
  }
  return events;
}

function parseDeprecations(markdown, source) {
  const lines = markdown.split(/\r?\n/);
  const events = [];
  for (let index = 0; index < lines.length; index += 1) {
    const h3 = lines[index].match(/^###\s+(.+)$/);
    if (!h3) continue;
    const date = parseDate(h3[1]);
    if (!date) continue;
    const body = [];
    for (let cursor = index + 1; cursor < lines.length && !/^###\s+/.test(lines[cursor]); cursor += 1) body.push(lines[cursor]);
    const title = cleanInline(h3[1]).replace(/^20\d{2}-\d{2}-\d{2}:\s*/, "");
    const event = makeEvent({ date, title, summary: body, event_type: "deprecation", lifecycle: "deprecated", ...source });
    if (event) events.push(event);
  }
  return events;
}

function parseLaunchSeeds(sourceMap) {
  const source = sourceMap["introducing-chatgpt"];
  return [
    makeEvent({
      date: "2022-11-30",
      title: "Introducing ChatGPT",
      title_zh: "ChatGPT 正式誕生",
      summary: "OpenAI introduced ChatGPT as a free research preview, using a conversational format that could answer follow-up questions, acknowledge mistakes, challenge incorrect premises, and reject inappropriate requests.",
      summary_zh: "OpenAI 以免費研究預覽形式推出 ChatGPT；對話介面可回答追問、承認錯誤、質疑錯誤前提並拒絕不當請求。",
      event_type: "launch",
      importance: 5,
      lifecycle: "research_preview",
      suggestedFamily: "chatgpt_core",
      ...source,
    }),
    makeEvent({
      date: "2025-07-17",
      title: "Introducing ChatGPT agent",
      title_zh: "推出 ChatGPT Agent",
      summary: "ChatGPT agent combined research and action in a virtual browser, integrated Operator capabilities, and launched for Pro, Plus, and Team users.",
      summary_zh: "ChatGPT Agent 把研究與操作整合到虛擬瀏覽器，吸收 Operator 核心能力，並首先向 Pro、Plus 與 Team 使用者開放。",
      event_type: "launch",
      importance: 5,
      lifecycle: "active",
      ...(sourceMap["chatgpt-agent-release-notes"] || source),
    }),
    makeEvent({
      date: "2025-08-08",
      title: "ChatGPT agent available for Enterprise and Edu",
      title_zh: "ChatGPT Agent 開放 Enterprise 與 Edu",
      summary: "ChatGPT agent availability expanded to Enterprise and Edu plans.",
      summary_zh: "ChatGPT Agent 的使用範圍擴大至 Enterprise 與 Edu 方案。",
      event_type: "availability",
      importance: 4,
      ...(sourceMap["chatgpt-agent-release-notes"] || source),
    }),
  ].filter(Boolean);
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function laneEvents(payload, sourceMap) {
  const records = Array.isArray(payload) ? payload : payload?.events;
  if (!Array.isArray(records)) return [];
  return records.map((record) => {
    const source = Object.values(sourceMap).find((candidate) => candidate.sourceUrl === record.source_url)
      || Object.values(sourceMap).find((candidate) => record.source_url?.startsWith(candidate.sourceUrl))
      || {
        source: `lane-${slugify(record.source_name || "official")}`,
        sourceUrl: record.source_url,
        sourceName: record.source_name || "OpenAI official source",
        sourceKind: record.source_kind || "official",
      };
    return makeEvent({
      date: record.date,
      title: record.title_en || record.title,
      summary: record.summary_en || record.summary || "",
      title_zh: record.title_zh,
      summary_zh: record.summary_zh,
      product: record.product,
      suggestedFamily: record.product_family,
      event_type: record.event_type,
      lifecycle: record.lifecycle,
      importance: record.importance,
      coverage_status: record.coverage_status || "manually_extracted",
      confidence: record.confidence || "high",
      tags: record.tags,
      ...source,
    });
  }).filter(Boolean);
}

function eventScore(event) {
  const sourceScore = {
    "introducing-chatgpt": 34,
    "chatgpt-release-notes": 30,
    "model-release-notes": 28,
    "chatgpt-agent-release-notes": 27,
    "api-changelog": 24,
    "api-deprecations": 23,
    "codex-changelog": 22,
    "apps-sdk-changelog": 20,
    "macos-release-notes": 15,
    "windows-release-notes": 15,
    "atlas-release-notes": 14,
    "enterprise-edu-release-notes": 13,
    "business-release-notes": 12,
  }[event.source_id] ?? 16;
  const typeScore = {
    launch: 48, model_release: 44, retirement: 31, deprecation: 29,
    safety: 27, availability: 24, platform: 22, integration: 18,
    pricing_quota: 16, feature: 14, model_update: 11,
  }[event.event_type] ?? 10;
  const text = `${event.title_en} ${event.summary_en}`.toLowerCase();
  const landmarkBonus = /(introducing chatgpt|gpt-4\b|gpt-4o\b|gpt-5\b|gpt-5\.6|sora|dall·e 3|voice|chatgpt search|deep research|operator|chatgpt agent|codex|responses api|realtime api|gpts|gpt store|memory|canvas|projects|chatgpt work|chatgpt sites|atlas|enterprise|team|business)/.test(text) ? 22 : 0;
  const genericPenalty = /^(fixes|bug fixes|performance improvements|chatgpt app experience updates|codex app\s+\d)/i.test(event.title_en) ? 14 : 0;
  return sourceScore + typeScore + landmarkBonus + Math.min(event.supplied_importance * 5, 25) - genericPenalty;
}

function deduplicate(events) {
  const sorted = [...events].sort((a, b) => eventScore(b) - eventScore(a));
  const canonical = [];
  for (const event of sorted) {
    const match = canonical.find((candidate) =>
      candidate.date === event.date
      && candidate.product_family === event.product_family
      && (normalizeTitle(candidate.title_en) === normalizeTitle(event.title_en)
        || tokenSimilarity(candidate.title_en, event.title_en) >= 0.72),
    );
    if (!match) {
      canonical.push({ ...event, source_refs: [{ id: event.source_id, name: event.source_name, url: event.source_url }] });
      continue;
    }
    if (!match.source_refs.some((ref) => ref.url === event.source_url)) {
      match.source_refs.push({ id: event.source_id, name: event.source_name, url: event.source_url });
      match.coverage_status = "corroborated";
    }
    if ((!match.title_zh || /[A-Za-z]{12}/.test(match.title_zh)) && event.title_zh) match.title_zh = event.title_zh;
    if (event.summary_zh?.length > match.summary_zh?.length) match.summary_zh = event.summary_zh;
    if (event.summary_en?.length > match.summary_en?.length) match.summary_en = event.summary_en;
    match.supplied_importance = Math.max(match.supplied_importance, event.supplied_importance);
  }
  return canonical;
}

function selectCanonical(events) {
  if (events.length <= TARGET_CANONICAL) return events;
  const chosen = new Map();
  const rank = [...events].sort((a, b) => eventScore(b) - eventScore(a) || a.date.localeCompare(b.date));
  const add = (event) => { if (event && chosen.size < TARGET_CANONICAL) chosen.set(`${event.date}|${event.title_en}`, event); };
  add(rank.find((event) => event.date === START && /Introducing ChatGPT/i.test(event.title_en)));
  for (const family of FAMILY_DEFS) {
    rank.filter((event) => event.product_family === family.id).slice(0, 14).forEach(add);
  }
  const quarters = [...new Set(events.map((event) => `${event.date.slice(0, 4)}-Q${Math.floor((Number(event.date.slice(5, 7)) - 1) / 3) + 1}`))];
  for (const quarter of quarters) {
    rank.filter((event) => `${event.date.slice(0, 4)}-Q${Math.floor((Number(event.date.slice(5, 7)) - 1) / 3) + 1}` === quarter).slice(0, 8).forEach(add);
  }
  rank.forEach(add);
  return [...chosen.values()];
}

function eraFor(date) {
  if (date < "2023-03-14") return "Research Preview";
  if (date < "2024-05-13") return "Platform Expansion";
  if (date < "2025-01-01") return "Omni & Reasoning";
  if (date < "2025-08-07") return "Agentic Shift";
  return "Unified Intelligence";
}

function hash(value) {
  let result = 2166136261;
  for (const char of value) {
    result ^= char.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function enrichCanonical(events) {
  const startMs = Date.parse(`${START}T00:00:00Z`);
  const endMs = Date.parse("2026-07-09T00:00:00Z");
  const ranked = [...events].sort((a, b) => eventScore(b) - eventScore(a));
  const landmarkKeys = new Set(ranked.slice(0, Math.min(TARGET_LANDMARKS, ranked.length)).map((event) => `${event.date}|${event.title_en}`));
  const slugCounts = new Map();
  return [...events].sort((a, b) => a.date.localeCompare(b.date) || eventScore(b) - eventScore(a)).map((event) => {
    const family = FAMILY_BY_ID[event.product_family];
    const key = `${event.date}|${event.title_en}`;
    const isLandmark = landmarkKeys.has(key);
    const score = eventScore(event);
    const baseSlug = `evt-${event.date.replaceAll("-", "")}-${slugify(event.title_en)}`;
    const count = (slugCounts.get(baseSlug) || 0) + 1;
    slugCounts.set(baseSlug, count);
    const eventId = count === 1 ? baseSlug : `${baseSlug}-${count}`;
    const dateMs = Date.parse(`${event.date}T00:00:00Z`);
    const ratio = Math.max(0, Math.min(1, (dateMs - startMs) / (endMs - startMs)));
    const jitter = (hash(eventId) % 79) - 39;
    const dayIndex = Math.round((dateMs - startMs) / 86_400_000);
    const month = Number(event.date.slice(5, 7));
    const importance = isLandmark ? 5 : score >= 78 ? 4 : score >= 60 ? 3 : score >= 46 ? 2 : 1;
    return {
      event_id: eventId,
      date: event.date,
      year: Number(event.date.slice(0, 4)),
      quarter: `Q${Math.floor((month - 1) / 3) + 1}`,
      day_index: dayIndex,
      era: eraFor(event.date),
      product_family: event.product_family,
      product: event.product,
      event_type: event.event_type,
      title_en: event.title_en,
      title_zh: event.title_zh,
      summary_en: event.summary_en,
      summary_zh: event.summary_zh,
      importance,
      node_tier: isLandmark ? "landmark" : importance >= 4 ? "major" : "update",
      lifecycle: event.lifecycle,
      map_region: family.region,
      map_lane: family.lane,
      glyph: family.glyph,
      pixel_icon: family.pixel_icon,
      color: family.color,
      x_hint: Math.round(220 + ratio * 3360),
      y_hint: Math.round(170 + family.lane * 148 + jitter),
      source_name: event.source_name,
      source_url: event.source_url,
      source_kind: event.source_kind,
      source_refs: event.source_refs,
      coverage_status: event.coverage_status,
      confidence: event.confidence,
      tags: [...new Set([event.product_family, event.event_type, event.product, ...event.tags])],
    };
  });
}

function csvCell(value) {
  const text = Array.isArray(value) || (value && typeof value === "object") ? JSON.stringify(value) : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(events) {
  const columns = [
    "event_id", "date", "year", "quarter", "day_index", "era", "product_family", "product",
    "event_type", "title_en", "title_zh", "summary_en", "summary_zh", "importance", "node_tier",
    "lifecycle", "map_region", "map_lane", "glyph", "pixel_icon", "x_hint", "y_hint", "source_name",
    "source_url", "source_kind", "coverage_status", "confidence", "tags",
  ];
  return `${columns.join(",")}\n${events.map((event) => columns.map((column) => csvCell(event[column])).join(",")).join("\n")}\n`;
}

await Promise.all([DATA_DIR, PUBLIC_DATA, GODOT_DATA].map((directory) => mkdir(directory, { recursive: true })));
const manifest = JSON.parse(await readFile(path.join(SNAPSHOTS, "manifest.json"), "utf8"));
const sourceMap = Object.fromEntries(manifest.sources.map((source) => [source.id, {
  source: source.id,
  sourceUrl: source.url,
  sourceName: source.title,
  sourceKind: source.sourceKind,
}]));

const rawEvents = [];
const parserBySource = {
  "chatgpt-release-notes": parseH1Dated,
  "business-release-notes": parseH1Dated,
  "enterprise-edu-release-notes": parseH1Dated,
  "macos-release-notes": parseH1Dated,
  "windows-release-notes": parseH1Dated,
  "atlas-release-notes": parseAtlas,
  "model-release-notes": parseModelNotes,
  "api-changelog": parseApiChangelog,
  "api-deprecations": parseDeprecations,
  "codex-changelog": parseDatedH3,
  "apps-sdk-changelog": parseDatedH3,
};
const parserFamilyHints = {
  "model-release-notes": "models_reasoning",
  "business-release-notes": "enterprise_vertical",
  "enterprise-edu-release-notes": "enterprise_vertical",
  "macos-release-notes": "clients_surfaces",
  "windows-release-notes": "clients_surfaces",
  "atlas-release-notes": "clients_surfaces",
  "api-deprecations": "safety_lifecycle",
  "codex-changelog": "agents_research",
  "apps-sdk-changelog": "developer_platform",
};

for (const source of manifest.sources) {
  const parser = parserBySource[source.id];
  if (!parser) continue;
  const markdown = await readFile(path.join(ROOT, source.snapshotPath), "utf8");
  rawEvents.push(...parser(markdown, {
    ...sourceMap[source.id],
    suggestedFamily: parserFamilyHints[source.id],
  }));
}
rawEvents.push(...parseLaunchSeeds(sourceMap));

for (const laneFile of ["consumer-2022-2024.json", "consumer-2025-2026.json", "platform-lifecycle.json"]) {
  const payload = await readJsonIfExists(path.join(LANES, laneFile));
  if (payload) rawEvents.push(...laneEvents(payload, sourceMap));
}

const uniqueRaw = [];
const rawIndexByKey = new Map();
for (const event of rawEvents) {
  const key = `${event.source_id}|${event.date}|${normalizeTitle(event.title_en)}`;
  const existingIndex = rawIndexByKey.get(key);
  if (existingIndex === undefined) {
    rawIndexByKey.set(key, uniqueRaw.length);
    uniqueRaw.push(event);
    continue;
  }
  const existing = uniqueRaw[existingIndex];
  const preferred = eventScore(event) > eventScore(existing) ? event : existing;
  const alternate = preferred === event ? existing : event;
  const product = preferred.product.length >= alternate.product.length ? preferred.product : alternate.product;
  uniqueRaw[existingIndex] = {
    ...preferred,
    product,
    title_zh: /[\u3400-\u9fff]/.test(alternate.title_zh) && !/[\u3400-\u9fff]/.test(preferred.title_zh)
      ? alternate.title_zh
      : preferred.title_zh,
    summary_en: preferred.summary_en.length >= alternate.summary_en.length ? preferred.summary_en : alternate.summary_en,
    summary_zh: preferred.summary_zh.length >= alternate.summary_zh.length ? preferred.summary_zh : alternate.summary_zh,
    coverage_status: preferred.coverage_status === "complete" || alternate.coverage_status === "complete" ? "complete" : preferred.coverage_status,
    supplied_importance: Math.max(preferred.supplied_importance, alternate.supplied_importance),
    tags: [...new Set([...preferred.tags, ...alternate.tags])],
  };
}

const candidates = deduplicate(uniqueRaw);
const canonical = enrichCanonical(selectCanonical(candidates));
const latestEventDate = canonical.reduce((latest, event) => event.date > latest ? event.date : latest, START);
const corroborated = canonical.filter((event) => event.source_refs.length > 1).length;
const timeline = {
  schema_version: "0.1.0",
  title: "OpenAI 產品時間線資料集 v0.1",
  title_en: "OpenAI Product Timeline Dataset v0.1",
  generated_at: new Date().toISOString(),
  retrieved_at: manifest.retrievedAt,
  period: { start: START, cutoff: CUTOFF, latest_event: latestEventDate },
  methodology: {
    scope: "Publicly observable OpenAI product, model, platform, client, enterprise, safety, and lifecycle updates after ChatGPT's launch.",
    source_policy: "Official OpenAI pages only; extraction uses read-through snapshots while every delivered citation points to the canonical official URL.",
    canonicalization: "Raw source entries are parsed, normalized, deduplicated by date/product/title similarity, scored, and sampled across every family and quarter for the 326-node map edition.",
    completeness_boundary: "Living changelogs can be edited retroactively. Raw parsed entries and explicit coverage records are preserved so gaps remain inspectable.",
    translation_boundary: "Curated lane records carry reviewed Traditional Chinese text. Parser-only records use concise bilingual labels and a factual Chinese provenance summary; the official English source remains authoritative for detailed wording.",
  },
  stats: {
    raw_official_entries: uniqueRaw.length,
    canonical_map_nodes: canonical.length,
    landmarks: canonical.filter((event) => event.node_tier === "landmark").length,
    official_source_records: manifest.sources.length,
    product_families: FAMILY_DEFS.length,
    cross_source_corroborations: corroborated,
  },
  taxonomy: FAMILY_DEFS,
  sources: manifest.sources.map((manifestSource) => ({
    ...Object.fromEntries(Object.entries(manifestSource).filter(([key]) => !["snapshotPath", "extractionTransport"].includes(key))),
    coverage_status: "parsed",
  })),
  events: canonical,
};

const rawPayload = {
  schema_version: "0.1.0-raw",
  retrieved_at: manifest.retrievedAt,
  source_count: manifest.sources.length,
  entry_count: uniqueRaw.length,
  entries: uniqueRaw.sort((a, b) => a.date.localeCompare(b.date) || a.title_en.localeCompare(b.title_en)),
};

const jsonPath = path.join(DATA_DIR, "openai-product-timeline-v0.1.json");
const rawPath = path.join(DATA_DIR, "openai-product-timeline-raw-v0.1.json");
const csvPath = path.join(DATA_DIR, "openai-product-timeline-v0.1.csv");
await writeFile(jsonPath, `${JSON.stringify(timeline, null, 2)}\n`, "utf8");
await writeFile(rawPath, `${JSON.stringify(rawPayload, null, 2)}\n`, "utf8");
await writeFile(csvPath, toCsv(canonical), "utf8");
await Promise.all([
  copyFile(jsonPath, path.join(PUBLIC_DATA, path.basename(jsonPath))),
  copyFile(rawPath, path.join(PUBLIC_DATA, path.basename(rawPath))),
  copyFile(csvPath, path.join(PUBLIC_DATA, path.basename(csvPath))),
  copyFile(jsonPath, path.join(GODOT_DATA, path.basename(jsonPath))),
]);

process.stdout.write(`${JSON.stringify(timeline.stats)}\n`);
