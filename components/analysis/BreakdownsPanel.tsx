"use client";

import { useEffect, useRef, useState } from "react";

import type { ExplorerDataset } from "../../lib/timeline/schema";
import {
  computeBreakdown,
  computeKpis,
  type BreakdownBar,
  type Dimension,
} from "../../lib/analysis/breakdowns";
import { ChartCard } from "./ChartCard";
import { useAnalysisScope } from "./AnalysisScope";
import { useInViewOnce } from "./hooks";
import { barPathRight } from "./svg";

const WARN_KEYS = new Set(["deprecation", "retirement", "deprecated", "retired"]);

function useCountUp(target: number, reducedMotion: boolean): [React.RefObject<HTMLDivElement | null>, number] {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number | null>(null);
  const ref = useInViewOnce<HTMLDivElement>(() => {
    if (reducedMotion) { setDisplay(target); return; }
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(target * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  }, reducedMotion);
  useEffect(() => () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); }, []);
  return [ref, display];
}

function Sparkline({ values, peakIndex }: { values: readonly number[]; peakIndex: number }) {
  const max = Math.max(1, ...values);
  const width = 88;
  const height = 26;
  const gap = 3;
  const barW = (width - gap * (values.length - 1)) / values.length;
  return (
    <svg className="kpi-spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {values.map((value, index) => {
        const h = Math.max(1.5, (value / max) * (height - 2));
        return (
          <rect
            key={index}
            x={index * (barW + gap)}
            y={height - h}
            width={barW}
            height={h}
            rx={1.5}
            className={index === peakIndex ? "spark-peak" : "spark-bar"}
          />
        );
      })}
    </svg>
  );
}

export function KpiBand({ dataset }: { dataset: ExplorerDataset }) {
  const { reducedMotion } = useAnalysisScope();
  const kpis = computeKpis(dataset);
  const [heroRef, heroValue] = useCountUp(kpis.totalEvents, reducedMotion);
  const peakIndex = kpis.perYear.findIndex((entry) => entry.year === kpis.peakYear.year);

  const tiles: { label: string; value: string; hint?: string }[] = [
    { label: "Model releases", value: String(kpis.modelReleases), hint: "GPT-4 → GPT-5.6 Sol" },
    { label: "Landmark moments", value: String(kpis.landmarks) },
    { label: "Product families", value: String(kpis.families) },
    { label: "Official sources", value: String(kpis.sources) },
    { label: "Coverage", value: kpis.spanLabel, hint: `${kpis.spanMonths} months` },
  ];

  return (
    <dl className="kpi-band" aria-label="Headline metrics">
      <div className="kpi-hero" ref={heroRef}>
        <dt>Documented events</dt>
        <dd>{heroValue.toLocaleString("en-US")}</dd>
        <p className="kpi-hero-note">official-source product moments, 2022–2026</p>
      </div>
      {tiles.map((tile) => (
        <div className="stat-tile" key={tile.label}>
          <dt>{tile.label}</dt>
          <dd>{tile.value}</dd>
          {tile.hint && <p className="stat-hint">{tile.hint}</p>}
        </div>
      ))}
      <div className="stat-tile stat-tile--peak">
        <dt>Peak year</dt>
        <dd>{kpis.peakYear.year}</dd>
        <div className="stat-spark">
          <Sparkline values={kpis.perYear.map((entry) => entry.count)} peakIndex={peakIndex} />
          <span className="stat-hint">{kpis.peakYear.count} events</span>
        </div>
      </div>
    </dl>
  );
}

function BarGroup({ title, bars, ordinal }: { title: string; bars: BreakdownBar[]; ordinal?: boolean }) {
  const max = Math.max(1, ...bars.map((bar) => bar.count));
  const rowH = 30;
  const width = 400;
  const height = bars.length * rowH + 6;
  const x0 = 118;
  const trackW = 200;

  return (
    <div className="bar-group">
      <h4 className="bar-title">{title}</h4>
      <svg
        className="bar-svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${title}: ${bars.map((bar) => `${bar.label} ${bar.count}`).join(", ")}`}
      >
        {bars.map((bar, index) => {
          const y = index * rowH + 4;
          const length = Math.max(2, (bar.count / max) * trackW);
          const opacity = ordinal ? 0.55 + 0.45 * (index / Math.max(1, bars.length - 1)) : 1;
          const warn = WARN_KEYS.has(bar.key);
          return (
            <g key={bar.key}>
              <text className="bar-label" x={x0 - 8} y={y + 12} textAnchor="end">
                {warn ? "! " : ""}{bar.label}
              </text>
              <path className="bar-mark" d={barPathRight(x0, y + 2, length, 15)} style={{ opacity }}>
                <title>{`${bar.label}: ${bar.count} (${Math.round(bar.pct * 100)}%)`}</title>
              </path>
              <text className="bar-value" x={x0 + length + 6} y={y + 12}>
                {bar.count}
                <tspan className="bar-pct"> · {Math.round(bar.pct * 100)}%</tspan>
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const DIMENSIONS: { dim: Dimension; title: string; ordinal?: boolean }[] = [
  { dim: "event_type", title: "Event type" },
  { dim: "lifecycle", title: "Lifecycle stage" },
  { dim: "era", title: "Era (chronological)", ordinal: true },
];

export function BreakdownsPanel({ dataset }: { dataset: ExplorerDataset }) {
  const groups = DIMENSIONS.map((entry) => ({ ...entry, bars: computeBreakdown(dataset.events, entry.dim) }));

  const table = (
    <table className="analysis-table">
      <caption>Event counts by type, lifecycle, and era</caption>
      <thead>
        <tr><th scope="col">Dimension</th><th scope="col">Value</th><th scope="col">Count</th><th scope="col">Share</th></tr>
      </thead>
      <tbody>
        {groups.flatMap((group) =>
          group.bars.map((bar) => (
            <tr key={`${group.dim}-${bar.key}`}>
              <td>{group.title}</td><td>{bar.label}</td><td>{bar.count}</td><td>{Math.round(bar.pct * 100)}%</td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  );

  return (
    <ChartCard
      eyebrow="04 · Composition"
      title="What kind of moments, and when"
      insight="Launches and model releases dominate; the era ramp shows the shift from research previews to a unified-intelligence cadence."
      table={table}
      className="dash-card--breakdowns"
    >
      <div className="breakdowns-grid">
        {groups.map((group) => (
          <BarGroup key={group.dim} title={group.title} bars={group.bars} ordinal={group.ordinal} />
        ))}
      </div>
    </ChartCard>
  );
}
