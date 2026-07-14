"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import type { Granularity } from "../../lib/analysis/buckets";
import { usePrefersReducedMotion } from "./hooks";

export interface AnalysisScopeValue {
  readonly granularity: Granularity;
  readonly setGranularity: (value: Granularity) => void;
  /** Family currently hovered/focused anywhere in the dashboard (cross-highlight). */
  readonly hoveredFamily: string | null;
  readonly setHoveredFamily: (value: string | null) => void;
  /** Families toggled off via the legend (removed from cadence + dimmed elsewhere). */
  readonly mutedFamilies: ReadonlySet<string>;
  readonly toggleMuted: (id: string) => void;
  readonly prefersStream: boolean;
  readonly setPrefersStream: (value: boolean) => void;
  readonly reducedMotion: boolean;
}

const AnalysisScopeContext = createContext<AnalysisScopeValue | null>(null);

export function AnalysisScopeProvider({ children }: { children: ReactNode }) {
  const [granularity, setGranularity] = useState<Granularity>("quarter");
  const [hoveredFamily, setHoveredFamily] = useState<string | null>(null);
  const [mutedFamilies, setMutedFamilies] = useState<ReadonlySet<string>>(() => new Set());
  const [prefersStream, setPrefersStream] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const value = useMemo<AnalysisScopeValue>(() => ({
    granularity,
    setGranularity,
    hoveredFamily,
    setHoveredFamily,
    mutedFamilies,
    toggleMuted: (id: string) =>
      setMutedFamilies((current) => {
        const next = new Set(current);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      }),
    prefersStream,
    setPrefersStream,
    reducedMotion,
  }), [granularity, hoveredFamily, mutedFamilies, prefersStream, reducedMotion]);

  return <AnalysisScopeContext.Provider value={value}>{children}</AnalysisScopeContext.Provider>;
}

export function useAnalysisScope(): AnalysisScopeValue {
  const value = useContext(AnalysisScopeContext);
  if (!value) throw new Error("useAnalysisScope must be used within AnalysisScopeProvider");
  return value;
}
