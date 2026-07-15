"use client";

import type { ExplorerDataset } from "../../lib/timeline/schema";
import { laneFamilies } from "../../lib/analysis/families";
import { AnalysisScopeProvider, useAnalysisScope } from "./AnalysisScope";
import { FamilyLegend } from "./FamilyLegend";
import { BreakdownsPanel, KpiBand } from "./BreakdownsPanel";
import { ReleaseCadenceChart } from "./ReleaseCadenceChart";
import { ModelLineageChart } from "./ModelLineageChart";
import { FamilyHeatmap } from "./FamilyHeatmap";

function DashboardControls() {
  const { granularity, setGranularity, prefersStream, setPrefersStream } = useAnalysisScope();
  return (
    <div className="analysis-controls">
      <div className="seg" role="group" aria-label="Time granularity">
        <button type="button" aria-pressed={granularity === "quarter"} className={granularity === "quarter" ? "active" : ""} onClick={() => setGranularity("quarter")}>Quarter</button>
        <button type="button" aria-pressed={granularity === "month"} className={granularity === "month" ? "active" : ""} onClick={() => setGranularity("month")}>Month</button>
      </div>
      <div className="seg" role="group" aria-label="Cadence baseline">
        <button type="button" aria-pressed={!prefersStream} className={!prefersStream ? "active" : ""} onClick={() => setPrefersStream(false)}>Stacked</button>
        <button type="button" aria-pressed={prefersStream} className={prefersStream ? "active" : ""} onClick={() => setPrefersStream(true)}>Stream</button>
      </div>
    </div>
  );
}

interface AnalysisDashboardProps {
  readonly dataset: ExplorerDataset;
  readonly onOpenEvent?: (eventId: string) => void;
}

export function AnalysisDashboard({ dataset, onOpenEvent }: AnalysisDashboardProps) {
  const families = laneFamilies(dataset.taxonomy);

  return (
    <section id="analysis" className="analysis-section" aria-labelledby="analysis-title">
      <AnalysisScopeProvider>
        <div className="analysis-head">
          <div>
            <p className="eyebrow">02 · Signals & analytics</p>
            <h2 id="analysis-title">The shape of the release history</h2>
            <p className="analysis-lead">
              Four professional views over all {dataset.events.length} official-source events — cadence, model lineage,
              family activity, and composition. Hover a family to trace it across every chart.
            </p>
          </div>
          <DashboardControls />
        </div>

        <FamilyLegend families={families} />
        <KpiBand dataset={dataset} />

        <div className="analysis-stack">
          <ReleaseCadenceChart dataset={dataset} />
          <ModelLineageChart dataset={dataset} onOpenEvent={onOpenEvent} />
          <FamilyHeatmap dataset={dataset} />
          <BreakdownsPanel dataset={dataset} />
        </div>
      </AnalysisScopeProvider>
    </section>
  );
}
