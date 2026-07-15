import type { ExplorerEvent, NodeTier } from "../timeline/schema";

export type LineageId = "gpt4" | "o_series" | "gpt5" | "sora" | "open" | "other";

export interface LineageInfo {
  readonly id: LineageId;
  readonly label: string;
  readonly blurb: string;
}

/** Fixed lane order, top to bottom. */
export const LINEAGES: readonly LineageInfo[] = [
  { id: "gpt4", label: "GPT-4 line", blurb: "GPT-4 → 4 Turbo → 4o → 4.1 / 4.5" },
  { id: "o_series", label: "o-series reasoning", blurb: "o1 · o3 · o-series" },
  { id: "gpt5", label: "GPT-5 line", blurb: "GPT-5 → 5.6 Sol · Codex" },
  { id: "sora", label: "Sora", blurb: "Video generation" },
  { id: "open", label: "Open weights", blurb: "gpt-oss" },
  { id: "other", label: "Other models & API", blurb: "Audio, image & API snapshots" },
];

/**
 * Ordered classification on product + title. o-series and GPT-5 are tested
 * BEFORE GPT-4 so "o1" / "GPT-5" / "GPT-5-Codex" never fall through to the
 * GPT-4 rule; Sora and open weights are matched first.
 */
export function classifyLineage(event: ExplorerEvent): LineageId {
  const text = `${event.product} ${event.title_en}`;
  if (/sora/i.test(text)) return "sora";
  if (/gpt-?oss|open[- ]?weight/i.test(text)) return "open";
  if (/\bo[134](\b|-|\s|mini|preview)|o-series/i.test(text)) return "o_series";
  if (/gpt-?5|\bsol\b|codex/i.test(text)) return "gpt5";
  if (/gpt-?4|\b4o\b|4\.1|4\.5/i.test(text)) return "gpt4";
  return "other";
}

/** Marker radius by tier, nudged +/-0.9px by importance (2..5). Min r = 4 (>=8px). */
export function tierRadius(tier: NodeTier, importance: number): number {
  const base = tier === "landmark" ? 9 : tier === "major" ? 6 : 4;
  const nudge = (importance - 3.5) * 0.6;
  return Math.max(4, Math.min(11, base + nudge));
}

export interface ModelNode {
  readonly eventId: string;
  readonly date: string;
  readonly dayIndex: number;
  /** Normalised 0..1 position across the model-release span. */
  readonly t: number;
  readonly title: string;
  readonly product: string;
  readonly tier: NodeTier;
  readonly importance: number;
  readonly radius: number;
  readonly familyId: string;
  readonly glyph: string;
  readonly color: string;
  readonly isLandmark: boolean;
  readonly isKey: boolean;
  readonly label: string;
}

export interface LineageLane {
  readonly id: LineageId;
  readonly label: string;
  readonly blurb: string;
  readonly count: number;
  readonly nodes: ModelNode[];
}

export interface LineageModel {
  readonly lanes: LineageLane[];
  readonly span: { minDate: string; maxDate: string; minDay: number; maxDay: number };
  readonly years: number[];
}

/**
 * The 79 model-release events grouped into fixed lineage lanes, each lane's
 * nodes sorted by date. Node x is normalised over the full model-release span.
 */
export function deriveModelLineage(events: readonly ExplorerEvent[]): LineageModel {
  const releases = events.filter((event) => event.event_type === "model_release");
  if (releases.length === 0) {
    return { lanes: LINEAGES.map((l) => ({ ...l, count: 0, nodes: [] })), span: { minDate: "", maxDate: "", minDay: 0, maxDay: 1 }, years: [] };
  }

  let minDay = releases[0].day_index;
  let maxDay = releases[0].day_index;
  let minDate = releases[0].date;
  let maxDate = releases[0].date;
  for (const event of releases) {
    if (event.day_index < minDay) minDay = event.day_index;
    if (event.day_index > maxDay) maxDay = event.day_index;
    if (event.date < minDate) minDate = event.date;
    if (event.date > maxDate) maxDate = event.date;
  }
  const span = Math.max(1, maxDay - minDay);

  const grouped = new Map<LineageId, ModelNode[]>(LINEAGES.map((lineage) => [lineage.id, []]));
  for (const event of releases) {
    const lineageId = classifyLineage(event);
    const isLandmark = event.node_tier === "landmark";
    grouped.get(lineageId)?.push({
      eventId: event.event_id,
      date: event.date,
      dayIndex: event.day_index,
      t: (event.day_index - minDay) / span,
      title: event.title_en,
      product: event.product,
      tier: event.node_tier,
      importance: event.importance,
      radius: tierRadius(event.node_tier, event.importance),
      familyId: event.product_family,
      glyph: event.glyph,
      color: event.color,
      isLandmark,
      isKey: false,
      label: event.product,
    });
  }

  const lanes: LineageLane[] = LINEAGES.map((lineage) => {
    const nodes = (grouped.get(lineage.id) ?? []).sort((a, b) => a.dayIndex - b.dayIndex || a.eventId.localeCompare(b.eventId));
    // Key nodes get direct labels: every landmark plus each lane's endpoints.
    nodes.forEach((node, index) => {
      const isEndpoint = index === 0 || index === nodes.length - 1;
      (node as { isKey: boolean }).isKey = node.isLandmark || isEndpoint;
    });
    return { id: lineage.id, label: lineage.label, blurb: lineage.blurb, count: nodes.length, nodes };
  });

  const startYear = Number(minDate.slice(0, 4));
  const endYear = Number(maxDate.slice(0, 4));
  const years: number[] = [];
  for (let year = startYear; year <= endYear; year += 1) years.push(year);

  return { lanes, span: { minDate, maxDate, minDay, maxDay }, years };
}
