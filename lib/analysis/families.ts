import type { ExplorerFamily } from "../timeline/schema";

/**
 * Bottom-to-top stack order for Chart 1 and top-to-bottom is irrelevant; this
 * order is CVD-verified: the confusable blue pair (developer_platform #6ec8ff /
 * clients_surfaces #7fd7ff) and purple pair (multimodal #a995ff /
 * enterprise_vertical #e69dff) are never adjacent, so touching stacked bands are
 * always separable — reinforced by glyph + label + legend + surface gaps.
 */
export const FAMILY_STACK_ORDER: readonly string[] = [
  "safety_lifecycle",
  "developer_platform",
  "models_reasoning",
  "multimodal",
  "agents_research",
  "clients_surfaces",
  "memory_knowledge",
  "enterprise_vertical",
  "search_commerce",
  "chatgpt_core",
];

export interface FamilyMeta {
  readonly id: string;
  readonly name: string;
  readonly glyph: string;
  readonly color: string;
  readonly lane: number;
}

/** Families sorted into the CVD-verified stack order (Chart 1). */
export function orderedFamilies(taxonomy: readonly ExplorerFamily[]): ExplorerFamily[] {
  const rank = new Map(FAMILY_STACK_ORDER.map((id, index) => [id, index]));
  return [...taxonomy].sort((a, b) => (rank.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.id) ?? Number.MAX_SAFE_INTEGER));
}

/** Families in their canonical lane order (Chart 3 heatmap rows). */
export function laneFamilies(taxonomy: readonly ExplorerFamily[]): ExplorerFamily[] {
  return [...taxonomy].sort((a, b) => a.lane - b.lane);
}

export function familyMetaMap(taxonomy: readonly ExplorerFamily[]): Map<string, FamilyMeta> {
  return new Map(
    taxonomy.map((family) => [
      family.id,
      { id: family.id, name: family.name_en, glyph: family.glyph, color: family.color, lane: family.lane },
    ]),
  );
}
