"use client";

import type { ReactNode } from "react";

export interface TooltipState {
  readonly x: number;
  readonly y: number;
  readonly content: ReactNode;
}

/**
 * Absolute HTML tooltip positioned within a `position: relative` chart body.
 * Flips to the left of the anchor near the right edge so it never overflows.
 * Tooltips only enhance — every value is also in the table view.
 */
export function Tooltip({ state, containerWidth }: { state: TooltipState | null; containerWidth: number }) {
  if (!state) return null;
  const flip = containerWidth > 0 && state.x > containerWidth - 190;
  return (
    <div
      className="analysis-tooltip"
      role="presentation"
      style={{
        left: state.x,
        top: state.y,
        transform: `translate(${flip ? "calc(-100% - 12px)" : "12px"}, -50%)`,
      }}
    >
      {state.content}
    </div>
  );
}
