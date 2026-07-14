"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { ExplorerDataset } from "../../lib/timeline/schema";
import {
  computeCadence,
  selectCadenceLandmarks,
  streamBaseline,
  type CadenceModel,
} from "../../lib/analysis/cadence";
import { computeEraBands } from "../../lib/analysis/eras";
import { ChartCard } from "./ChartCard";
import { useAnalysisScope } from "./AnalysisScope";
import { useElementWidth } from "./hooks";
import { Tooltip, type TooltipState } from "./Tooltip";
import { axisTicks, niceMax } from "./svg";

const MARGIN = { top: 26, right: 92, bottom: 40, left: 42 };

function chartHeight(width: number): number {
  if (width >= 900) return 360;
  if (width >= 560) return 300;
  return 240;
}

/** Animate a 0..1 morph factor toward `target`; instant under reduced motion. */
function useMorph(target: number, reducedMotion: boolean): number {
  const [value, setValue] = useState(target);
  const currentRef = useRef(target);
  const frameRef = useRef<number | null>(null);
  useEffect(() => {
    const from = currentRef.current;
    const start = performance.now();
    const duration = reducedMotion ? 0 : 380;
    const tick = (now: number) => {
      const progress = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const next = from + (target - from) * eased;
      currentRef.current = next;
      setValue(next);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, reducedMotion]);
  return value;
}

export function ReleaseCadenceChart({ dataset }: { dataset: ExplorerDataset }) {
  const { granularity, hoveredFamily, mutedFamilies, prefersStream, reducedMotion } = useAnalysisScope();
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [activeBucket, setActiveBucket] = useState<number | null>(null);

  const model: CadenceModel = useMemo(
    () => computeCadence(dataset.events, dataset.taxonomy, granularity, { muted: mutedFamilies }),
    [dataset.events, dataset.taxonomy, granularity, mutedFamilies],
  );
  const eraBands = useMemo(() => computeEraBands(dataset.events, model.buckets), [dataset.events, model.buckets]);
  const landmarks = useMemo(
    () => selectCadenceLandmarks(dataset.events, model.buckets, granularity, 3),
    [dataset.events, model.buckets, granularity],
  );
  const silhouette = useMemo(() => streamBaseline(model.totals), [model.totals]);
  const morph = useMorph(prefersStream ? 1 : 0, reducedMotion);

  const height = chartHeight(width || 800);
  const plotW = Math.max(10, (width || 800) - MARGIN.left - MARGIN.right);
  const plotH = height - MARGIN.top - MARGIN.bottom;
  const yMax = niceMax(model.maxTotal);
  const { d0, dN } = model.domain;
  const x = (day: number) => MARGIN.left + (dN === d0 ? 0.5 : (day - d0) / (dN - d0)) * plotW;
  const y = (count: number) => MARGIN.top + plotH - (count / yMax) * plotH;
  const offset = (index: number) => morph * silhouette[index];

  const buildBand = (top: number[], bottom: number[]): string => {
    const forward = model.buckets.map((bucket, i) => `${x(bucket.midDay)},${y(top[i] + offset(i))}`);
    const back = model.buckets.map((bucket, i) => `${x(bucket.midDay)},${y(bottom[i] + offset(i))}`).reverse();
    return `M${forward.join(" L")} L${back.join(" L")} Z`;
  };

  const totalLine = model.buckets
    .map((bucket, i) => `${x(bucket.midDay)},${y(model.totals[i] + offset(i))}`)
    .join(" ");

  const handleMove = (event: React.PointerEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || model.buckets.length === 0) return;
    const px = event.clientX - rect.left;
    let nearest = 0;
    let best = Infinity;
    model.buckets.forEach((bucket) => {
      const distance = Math.abs(x(bucket.midDay) - px);
      if (distance < best) { best = distance; nearest = bucket.index; }
    });
    setActiveBucket(nearest);
    const nonZero = model.bands
      .filter((band) => band.values[nearest] > 0)
      .sort((a, b) => b.values[nearest] - a.values[nearest]);
    setTooltip({
      x: x(model.buckets[nearest].midDay),
      y: event.clientY - rect.top,
      content: (
        <>
          <strong>{model.buckets[nearest].label}</strong>
          <span className="tt-total">{model.totals[nearest]} release{model.totals[nearest] === 1 ? "" : "s"}</span>
          {nonZero.slice(0, 6).map((band) => (
            <span key={band.familyId} className="tt-row">
              <span className="tt-swatch" style={{ background: band.color }} />
              <span className="tt-glyph">{band.glyph}</span>
              {band.name}<b>{band.values[nearest]}</b>
            </span>
          ))}
        </>
      ),
    });
  };

  const clear = () => { setTooltip(null); setActiveBucket(null); };

  const table = (
    <table className="analysis-table">
      <caption>Releases per {granularity} by product family</caption>
      <thead>
        <tr>
          <th scope="col">{granularity === "quarter" ? "Quarter" : "Month"}</th>
          {model.bands.map((band) => <th scope="col" key={band.familyId}>{band.glyph} {band.name}</th>)}
          <th scope="col">Total</th>
        </tr>
      </thead>
      <tbody>
        {model.buckets.map((bucket) => (
          <tr key={bucket.key}>
            <th scope="row">{bucket.label}</th>
            {model.bands.map((band) => <td key={band.familyId}>{band.values[bucket.index] || ""}</td>)}
            <td>{model.totals[bucket.index]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const yTicks = axisTicks(yMax, 4);

  return (
    <ChartCard
      eyebrow="01 · Release cadence"
      title="From a trickle to a torrent"
      insight={prefersStream
        ? "Stream view — the wiggle shows family mix over time; totals are not comparable across the baseline."
        : "Releases per quarter, stacked by family. 2025 is the peak of a steep acceleration."}
      table={table}
      className="dash-card--cadence"
    >
      <div className="cadence-wrap" ref={wrapRef} onPointerLeave={clear}>
        {width > 0 && (
          <svg className="cadence-svg" width={width} height={height} role="img"
            aria-label={`Stacked area of releases per ${granularity} by product family, ${model.buckets.length} buckets. Peak ${model.peak.value} in ${model.peak.bucketKey}.`}>
            {/* Era annotation bands. The label is drawn only when it fits its
                band, so narrow early eras don't collide with their neighbour. */}
            {eraBands.map((band, i) => {
              const bandW = Math.max(0, x(band.endDay) - x(band.startDay));
              return (
                <g key={band.era}>
                  <rect className={`era-band ${i % 2 === 0 ? "era-a" : "era-b"}`}
                    x={x(band.startDay)} y={MARGIN.top} width={bandW} height={plotH} />
                  {bandW > band.era.length * 6.2 && (
                    <text className="era-name" x={x(band.startDay) + 4} y={MARGIN.top - 9}>{band.era}</text>
                  )}
                </g>
              );
            })}

            {/* Y grid + ticks (hidden in stream mode where the count axis is meaningless) */}
            {!prefersStream && yTicks.map((tick) => (
              <g key={tick}>
                <line className="grid-line" x1={MARGIN.left} y1={y(tick)} x2={MARGIN.left + plotW} y2={y(tick)} />
                <text className="axis-tick" x={MARGIN.left - 8} y={y(tick) + 3} textAnchor="end">{tick}</text>
              </g>
            ))}

            {/* Year separators + labels */}
            {model.buckets.filter((bucket) => bucket.isYearStart).map((bucket) => (
              <g key={`yr-${bucket.key}`}>
                <line className="year-rule" x1={x(bucket.startDay)} y1={MARGIN.top} x2={x(bucket.startDay)} y2={MARGIN.top + plotH} />
                <text className="year-label" x={x(bucket.startDay) + 3} y={MARGIN.top + plotH + 16}>{bucket.year}</text>
              </g>
            ))}

            {/* Family bands */}
            {model.bands.map((band) => {
              const dimmed = hoveredFamily && hoveredFamily !== band.familyId;
              return (
                <path key={band.familyId} className="cadence-band" d={buildBand(band.cumTop, band.cumBottom)}
                  style={{ fill: band.color, opacity: dimmed ? 0.24 : 0.82 }}>
                  <title>{`${band.name}: ${band.total} releases`}</title>
                </path>
              );
            })}

            {/* Total envelope + peak marker */}
            <polyline className="total-line" points={totalLine} />
            {!prefersStream && model.peak.value > 0 && (
              <g>
                <circle className="peak-dot" cx={x(model.buckets[model.peak.index].midDay)} cy={y(model.peak.value)} r={4} />
                <text className="peak-label" x={x(model.buckets[model.peak.index].midDay)} y={y(model.peak.value) - 9} textAnchor="middle">
                  peak {model.peak.value}
                </text>
              </g>
            )}

            {/* Landmark ticks */}
            {landmarks.map((mark) => (
              <line key={mark.eventId} className="landmark-tick"
                x1={x(mark.day)} y1={MARGIN.top} x2={x(mark.day)} y2={MARGIN.top + plotH}>
                <title>{`${mark.title} — ${mark.date}`}</title>
              </line>
            ))}

            {/* Crosshair */}
            {activeBucket !== null && (
              <line className="crosshair" x1={x(model.buckets[activeBucket].midDay)} y1={MARGIN.top}
                x2={x(model.buckets[activeBucket].midDay)} y2={MARGIN.top + plotH} />
            )}

            {/* Pointer capture overlay */}
            <rect className="cadence-hit" x={MARGIN.left} y={MARGIN.top} width={plotW} height={plotH}
              onPointerMove={handleMove} onPointerDown={handleMove} />
          </svg>
        )}
        <Tooltip state={tooltip} containerWidth={width} />
      </div>
    </ChartCard>
  );
}
