"use client";

import { useMemo, useState } from "react";

import type { ExplorerDataset } from "../../lib/timeline/schema";
import { deriveModelLineage, type ModelNode } from "../../lib/analysis/lineage";
import { ChartCard } from "./ChartCard";
import { useAnalysisScope } from "./AnalysisScope";
import { useElementWidth } from "./hooks";
import { Tooltip, type TooltipState } from "./Tooltip";

const GUTTER = 150;
const TOP = 34;
const BOTTOM = 26;
const LANE_H = 54;

function humanizeType(value: string): string {
  const spaced = value.replaceAll("_", " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function ModelLineageChart({ dataset, onOpenEvent }: { dataset: ExplorerDataset; onOpenEvent?: (eventId: string) => void }) {
  const { hoveredFamily, setHoveredFamily } = useAnalysisScope();
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const model = useMemo(() => deriveModelLineage(dataset.events), [dataset.events]);

  const height = TOP + model.lanes.length * LANE_H + BOTTOM;
  const plotW = Math.max(10, (width || 800) - GUTTER - 20);
  const span = Math.max(1, model.span.maxDay - model.span.minDay);
  const xForT = (t: number) => GUTTER + t * plotW;
  const xForDay = (day: number) => GUTTER + ((day - model.span.minDay) / span) * plotW;
  const laneBaseline = (index: number) => TOP + index * LANE_H + LANE_H * 0.58;

  const epoch = dataset.period.start;
  const dayNumber = (iso: string) =>
    Math.round(
      (Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10))) -
        Date.UTC(Number(epoch.slice(0, 4)), Number(epoch.slice(5, 7)) - 1, Number(epoch.slice(8, 10)))) /
        86_400_000,
    );

  const tipContent = (node: ModelNode, x: number, y: number): TooltipState => ({
    x,
    y,
    content: (
        <>
          <strong>{node.title}</strong>
          <span className="tt-total">{node.date} · {humanizeType(node.tier === "landmark" ? "landmark" : node.tier)}</span>
          <span className="tt-row"><span className="tt-glyph">{node.glyph}</span>{humanizeType(node.familyId)}</span>
        </>
      ),
  });

  const showTipFromPointer = (event: React.PointerEvent, node: ModelNode) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip(tipContent(node, event.clientX - rect.left, event.clientY - rect.top));
  };

  const table = (
    <table className="analysis-table">
      <caption>Model releases by lineage</caption>
      <thead><tr><th scope="col">Lineage</th><th scope="col">Model</th><th scope="col">Date</th><th scope="col">Tier</th></tr></thead>
      <tbody>
        {model.lanes.flatMap((lane) =>
          lane.nodes.map((node) => (
            <tr key={node.eventId}>
              <td>{lane.label}</td>
              <td>
                {onOpenEvent
                  ? <button type="button" className="table-link" onClick={() => onOpenEvent(node.eventId)}>{node.product}</button>
                  : node.product}
              </td>
              <td>{node.date}</td><td>{node.tier}</td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  );

  return (
    <ChartCard
      eyebrow="02 · Model lineage"
      title="Every model, on one timeline"
      insight="79 model releases across six lineages. Bigger marks are landmark launches; the GPT-5 line now drives the cadence."
      table={table}
      className="dash-card--lineage"
    >
      <div className="svg-scroll">
        <div className="lineage-wrap" ref={wrapRef} onPointerLeave={() => setTooltip(null)}>
          {width > 0 && (
            <svg className="lineage-svg" width={Math.max(width, 560)} height={height} role="img"
              aria-label={`Model release timeline, ${model.lanes.reduce((sum, lane) => sum + lane.count, 0)} models across ${model.lanes.length} lineages from ${model.span.minDate} to ${model.span.maxDate}.`}>
              {/* Year gridlines */}
              {model.years.map((year) => {
                const day = dayNumber(`${year}-01-01`);
                if (day < model.span.minDay - 30 || day > model.span.maxDay + 30) return null;
                const gx = xForDay(day);
                return (
                  <g key={year}>
                    <line className="year-rule" x1={gx} y1={TOP - 10} x2={gx} y2={height - BOTTOM + 4} />
                    <text className="year-label" x={gx + 3} y={height - 8}>{year}</text>
                  </g>
                );
              })}

              {model.lanes.map((lane, laneIndex) => {
                const baseY = laneBaseline(laneIndex);
                const thread = lane.nodes.map((node) => `${xForT(node.t)},${baseY}`).join(" ");
                let lastLabelRight = -Infinity;
                return (
                  <g key={lane.id} className="lineage-lane">
                    <line className="lane-base" x1={GUTTER} y1={baseY} x2={GUTTER + plotW} y2={baseY} />
                    <text className="lane-title" x={12} y={baseY - 4}>{lane.label}</text>
                    <text className="lane-blurb" x={12} y={baseY + 12}>{lane.blurb} · {lane.count}</text>
                    {lane.nodes.length > 1 && <polyline className="lane-thread" points={thread} />}

                    {lane.nodes.map((node) => {
                      const cx = xForT(node.t);
                      const dim = hoveredFamily && hoveredFamily !== node.familyId;
                      const label = node.isKey ? node.label : "";
                      let placeLabel = false;
                      if (label) {
                        const estWidth = label.length * 6 + 10;
                        if (cx - estWidth / 2 > lastLabelRight + 6) { placeLabel = true; lastLabelRight = cx + estWidth / 2; }
                      }
                      return (
                        <g key={node.eventId} className={`model-node${dim ? " dim" : ""}`}
                          onPointerEnter={(event) => { setHoveredFamily(node.familyId); showTipFromPointer(event, node); }}
                          onPointerLeave={() => setHoveredFamily(null)}>
                          {node.tier === "landmark" ? (
                            <>
                              <rect className="node-landmark" x={cx - node.radius} y={baseY - node.radius}
                                width={node.radius * 2} height={node.radius * 2} transform={`rotate(45 ${cx} ${baseY})`} />
                              <text className="node-glyph" x={cx} y={baseY + 3} textAnchor="middle">{node.glyph}</text>
                            </>
                          ) : node.tier === "major" ? (
                            <circle className="node-major" cx={cx} cy={baseY} r={node.radius} />
                          ) : (
                            <circle className="node-update" cx={cx} cy={baseY} r={node.radius} />
                          )}
                          {placeLabel && (
                            <>
                              <line className="node-leader" x1={cx} y1={baseY - node.radius - 2} x2={cx} y2={baseY - LANE_H * 0.32} />
                              <text className="node-label" x={cx} y={baseY - LANE_H * 0.32 - 3} textAnchor="middle">{node.label}</text>
                            </>
                          )}
                          <circle className="node-hit" cx={cx} cy={baseY} r={Math.max(node.radius + 5, 13)}
                            tabIndex={node.isKey ? 0 : -1}
                            role={onOpenEvent ? "button" : undefined}
                            aria-label={`${node.title}, ${node.date}`}
                            onClick={() => onOpenEvent?.(node.eventId)}
                            onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && onOpenEvent) { event.preventDefault(); onOpenEvent(node.eventId); } }}
                            onFocus={() => setTooltip(tipContent(node, cx, baseY))}
                            onBlur={() => setTooltip(null)} />
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          )}
          <Tooltip state={tooltip} containerWidth={Math.max(width, 560)} />
        </div>
      </div>
    </ChartCard>
  );
}
