"use client";

import { useMemo, useRef, useState } from "react";

import type { ExplorerDataset } from "../../lib/timeline/schema";
import { computeFamilyHeatmap, heatIntensityPct } from "../../lib/analysis/heatmap";
import { ChartCard } from "./ChartCard";
import { useAnalysisScope } from "./AnalysisScope";
import { useElementWidth } from "./hooks";
import { Tooltip, type TooltipState } from "./Tooltip";

const LG = 178;
const HEADER = 44;

function cellFill(value: number, max: number): string {
  if (value <= 0) return "var(--surface)";
  return `color-mix(in srgb, var(--accent-text) ${heatIntensityPct(value, max)}%, var(--surface))`;
}

export function FamilyHeatmap({ dataset }: { dataset: ExplorerDataset }) {
  const { granularity, hoveredFamily, setHoveredFamily, mutedFamilies } = useAnalysisScope();
  const model = useMemo(
    () => computeFamilyHeatmap(dataset.events, dataset.taxonomy, granularity),
    [dataset.events, dataset.taxonomy, granularity],
  );
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [scrollRef, avail] = useElementWidth<HTMLDivElement>();
  const wrapRef = useRef<HTMLDivElement>(null);

  const cols = model.columns.length;
  // Fixed-size square cells: fill the card on wide screens, scroll on narrow.
  const cellSize = avail > 0 ? Math.max(26, Math.min(44, Math.floor((avail - LG - 8) / cols))) : 34;
  const step = cellSize + 2;
  const plotW = cols * step;
  const width = LG + plotW + 6;
  const rowsH = model.rows.length * step;
  const height = HEADER + rowsH;

  let peak = { row: -1, col: -1, value: 0 };
  model.rows.forEach((row, r) =>
    row.cells.forEach((cell) => {
      if (cell.value > peak.value) peak = { row: r, col: cell.colIndex, value: cell.value };
    }),
  );

  const unit = granularity === "quarter" ? "quarter" : "month";

  const table = (
    <table className="analysis-table">
      <caption>Releases per product family per {unit}</caption>
      <thead>
        <tr>
          <th scope="col">Family</th>
          {model.columns.map((col) => <th scope="col" key={col.key}>{col.label}</th>)}
          <th scope="col">Total</th>
        </tr>
      </thead>
      <tbody>
        {model.rows.map((row) => (
          <tr key={row.familyId}>
            <th scope="row">{row.glyph} {row.name}</th>
            {row.cells.map((cell) => <td key={cell.colIndex}>{cell.value || ""}</td>)}
            <td>{row.rowTotal}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const legendStops = [0.15, 0.4, 0.62, 0.82, 1];

  return (
    <ChartCard
      eyebrow="03 · Where the work happened"
      title={`Family activity by ${unit}`}
      insight="Models & Reasoning and Agents & Research carry the recent surge; brighter cells are busier quarters."
      table={table}
      className="dash-card--heatmap"
    >
      <div className="svg-scroll" ref={scrollRef}>
        <div className="heatmap-wrap" ref={wrapRef} onPointerLeave={() => setTooltip(null)}>
          <svg
            className="heatmap-svg"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={`Heatmap of product-family releases per ${unit}, 10 families by ${cols} ${unit}s. Busiest cell: ${peak.value} releases.`}
          >
            {model.columns.map((col) =>
              col.isYearStart ? (
                <g key={`year-${col.key}`}>
                  <line className="heat-year-rule" x1={LG + col.index * step - 1} y1={HEADER - 16} x2={LG + col.index * step - 1} y2={HEADER + rowsH} />
                  <text className="heat-year" x={LG + col.index * step + 2} y={14}>{col.year}</text>
                </g>
              ) : null,
            )}

            {model.columns.map((col) => {
              const tick = granularity === "quarter"
                ? col.key.slice(col.key.indexOf("-") + 1)
                : (col.index % 3 === 0 ? col.shortLabel.split(" ")[0] : "");
              return tick ? (
                <text key={`tick-${col.key}`} className="heat-tick" x={LG + col.index * step + cellSize / 2} y={HEADER - 6} textAnchor="middle">{tick}</text>
              ) : null;
            })}

            {model.rows.map((row, r) => {
              const dim = mutedFamilies.has(row.familyId);
              const lit = hoveredFamily === row.familyId;
              const y = HEADER + r * step;
              return (
                <g key={row.familyId} className={`heat-row${dim ? " dim" : ""}${lit ? " lit" : ""}`}>
                  <rect className="heat-rowlabel-hit" x={0} y={y} width={LG - 6} height={cellSize}
                    onPointerEnter={() => setHoveredFamily(row.familyId)} onPointerLeave={() => setHoveredFamily(null)} />
                  <rect className="heat-swatch" x={8} y={y + cellSize / 2 - 4} width={8} height={8} style={{ fill: row.color }} />
                  <text className="heat-glyph" x={22} y={y + cellSize / 2 + 4}>{row.glyph}</text>
                  <text className="heat-name" x={36} y={y + cellSize / 2 + 4}>{row.name}</text>
                  <text className="heat-rowtotal" x={LG - 10} y={y + cellSize / 2 + 4} textAnchor="end">{row.rowTotal}</text>
                  {row.cells.map((cell) => {
                    const x = LG + cell.colIndex * step;
                    const isPeak = peak.row === r && peak.col === cell.colIndex;
                    return (
                      <g key={cell.colIndex}>
                        <rect
                          className={`heat-cell${cell.value === 0 ? " empty" : ""}${isPeak ? " peak" : ""}`}
                          x={x} y={y} width={cellSize} height={cellSize} rx={2}
                          style={{ fill: cellFill(cell.value, model.maxCell) }}
                          onPointerEnter={(event) => {
                            const rect = wrapRef.current?.getBoundingClientRect();
                            if (!rect) return;
                            setTooltip({
                              x: event.clientX - rect.left,
                              y: event.clientY - rect.top,
                              content: (
                                <>
                                  <strong>{row.glyph} {row.name}</strong>
                                  <span>{model.columns[cell.colIndex].label}</span>
                                  <span>{cell.value} release{cell.value === 1 ? "" : "s"}{isPeak ? " · peak" : ""}</span>
                                </>
                              ),
                            });
                          }}
                        />
                        {cell.value >= 3 && cellSize >= 28 && (
                          <text className="heat-value" x={x + cellSize / 2} y={y + cellSize / 2 + 4} textAnchor="middle">{cell.value}</text>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
          <Tooltip state={tooltip} containerWidth={width} />
        </div>
      </div>

      <div className="heat-legend" aria-hidden="true">
        <span className="heat-legend-label">Fewer</span>
        <span className="heat-legend-swatch empty" />
        {legendStops.map((stop) => (
          <span key={stop} className="heat-legend-swatch"
            style={{ background: `color-mix(in srgb, var(--accent-text) ${heatIntensityPct(stop * model.maxCell, model.maxCell)}%, var(--surface))` }} />
        ))}
        <span className="heat-legend-label">More · up to {model.maxCell}</span>
      </div>
    </ChartCard>
  );
}
