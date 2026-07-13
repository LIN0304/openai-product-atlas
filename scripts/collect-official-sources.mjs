import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SNAPSHOT_DIR = path.join(
  ROOT,
  "research/openai-timeline-v0.1/source-snapshots",
);

export const OFFICIAL_SOURCES = [
  {
    id: "chatgpt-release-notes",
    title: "ChatGPT — Release Notes",
    url: "https://help.openai.com/en/articles/6825453-chatgpt-release-notes",
    sourceKind: "help_center_release_notes",
    productScope: ["chatgpt_core", "multimodal", "memory_knowledge", "search_commerce"],
  },
  {
    id: "model-release-notes",
    title: "Model Release Notes",
    url: "https://help.openai.com/en/articles/9624314-model-release-notes",
    sourceKind: "help_center_release_notes",
    productScope: ["models_reasoning", "safety_lifecycle"],
  },
  {
    id: "chatgpt-agent-release-notes",
    title: "ChatGPT agent — Release Notes",
    url: "https://help.openai.com/en/articles/11794368-chatgpt-agent-release-notes",
    sourceKind: "help_center_release_notes",
    productScope: ["agents_research"],
  },
  {
    id: "business-release-notes",
    title: "ChatGPT Business — Release Notes",
    url: "https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes",
    sourceKind: "help_center_release_notes",
    productScope: ["enterprise_vertical"],
  },
  {
    id: "enterprise-edu-release-notes",
    title: "ChatGPT Enterprise & Edu — Release Notes",
    url: "https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes",
    sourceKind: "help_center_release_notes",
    productScope: ["enterprise_vertical"],
  },
  {
    id: "macos-release-notes",
    title: "ChatGPT macOS app release notes",
    url: "https://help.openai.com/en/articles/9703738-desktop-app-release-notes",
    sourceKind: "help_center_release_notes",
    productScope: ["clients_surfaces"],
  },
  {
    id: "windows-release-notes",
    title: "Windows App — Release Notes",
    url: "https://help.openai.com/en/articles/10003026-windows-app-release-notes",
    sourceKind: "help_center_release_notes",
    productScope: ["clients_surfaces"],
  },
  {
    id: "atlas-release-notes",
    title: "ChatGPT Atlas — Release Notes",
    url: "https://help.openai.com/en/articles/12591856-chatgpt-atlas-release-notes",
    sourceKind: "help_center_release_notes",
    productScope: ["clients_surfaces", "agents_research"],
  },
  {
    id: "api-changelog",
    title: "OpenAI API Changelog",
    url: "https://platform.openai.com/docs/changelog",
    sourceKind: "developer_changelog",
    productScope: ["developer_platform", "models_reasoning"],
  },
  {
    id: "api-deprecations",
    title: "OpenAI API Deprecations",
    url: "https://platform.openai.com/docs/deprecations",
    sourceKind: "developer_deprecations",
    productScope: ["developer_platform", "safety_lifecycle"],
  },
  {
    id: "codex-changelog",
    title: "Codex Changelog",
    url: "https://developers.openai.com/codex/changelog/",
    sourceKind: "developer_changelog",
    productScope: ["agents_research", "developer_platform"],
  },
  {
    id: "apps-sdk-changelog",
    title: "Apps SDK Changelog",
    url: "https://developers.openai.com/apps-sdk/changelog/",
    sourceKind: "developer_changelog",
    productScope: ["developer_platform"],
  },
  {
    id: "introducing-chatgpt",
    title: "Introducing ChatGPT",
    url: "https://openai.com/index/chatgpt/",
    sourceKind: "official_launch_post",
    productScope: ["chatgpt_core"],
  },
  {
    id: "chatgpt-work-and-codex",
    title: "ChatGPT Work and Codex",
    url: "https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex",
    sourceKind: "official_product_guide",
    productScope: ["agents_research"],
  },
  {
    id: "sora-discontinuation",
    title: "What to know about the Sora discontinuation",
    url: "https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation",
    sourceKind: "official_lifecycle_notice",
    productScope: ["multimodal", "safety_lifecycle"],
  },
];

function extractionUrl(url) {
  return `https://r.jina.ai/${url}`;
}

async function fetchText(source) {
  const response = await fetch(extractionUrl(source.url), {
    headers: { "user-agent": "openai-product-timeline-v0.1/1.0" },
    signal: AbortSignal.timeout(90_000),
  });
  if (!response.ok) {
    throw new Error(`${source.id}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

await mkdir(SNAPSHOT_DIR, { recursive: true });
const retrievedAt = new Date().toISOString();
const manifest = [];

for (const source of OFFICIAL_SOURCES) {
  const markdown = await fetchText(source);
  const snapshotPath = path.join(SNAPSHOT_DIR, `${source.id}.md`);
  await writeFile(snapshotPath, markdown, "utf8");
  manifest.push({
    ...source,
    retrievedAt,
    extractionTransport: "r.jina.ai read-through of the official URL",
    snapshotPath: path.relative(ROOT, snapshotPath),
    bytes: Buffer.byteLength(markdown),
    status: "retrieved",
  });
  process.stdout.write(`${source.id}: ${Buffer.byteLength(markdown)} bytes\n`);
}

await writeFile(
  path.join(SNAPSHOT_DIR, "manifest.json"),
  `${JSON.stringify({ schemaVersion: "1.0", retrievedAt, sources: manifest }, null, 2)}\n`,
  "utf8",
);

process.stdout.write(`Saved ${manifest.length} official-source snapshots.\n`);
