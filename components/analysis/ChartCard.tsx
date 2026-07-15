"use client";

import { useId, useState, type ReactNode } from "react";

interface ChartCardProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly insight: string;
  readonly children: ReactNode;
  readonly legend?: ReactNode;
  /** Always-in-DOM semantic table twin (the non-visual alternative). */
  readonly table: ReactNode;
  readonly className?: string;
}

/**
 * Shared analytics card: eyebrow + heading + insight caption, a [Table] toggle
 * that reveals the always-present semantic table (WCAG-clean twin of the SVG),
 * a chart body slot, and an optional legend footer.
 */
export function ChartCard({ eyebrow, title, insight, children, legend, table, className }: ChartCardProps) {
  const [tableOpen, setTableOpen] = useState(false);
  const titleId = useId();
  const tableId = useId();

  return (
    <section className={className ? `dash-card ${className}` : "dash-card"} aria-labelledby={titleId}>
      <header className="card-head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3 id={titleId}>{title}</h3>
          <p className="card-insight">{insight}</p>
        </div>
        <div className="card-tools">
          <button
            type="button"
            className={tableOpen ? "active" : ""}
            aria-expanded={tableOpen}
            aria-controls={tableId}
            onClick={() => setTableOpen((open) => !open)}
          >
            {tableOpen ? "Hide table" : "Table"}
          </button>
        </div>
      </header>

      <div className="card-body">{children}</div>

      {legend && <div className="card-legend">{legend}</div>}

      <div id={tableId} className={tableOpen ? "card-table" : "card-table sr-only"}>
        {table}
      </div>
    </section>
  );
}
