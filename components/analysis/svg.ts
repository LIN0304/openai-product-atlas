/** SVG geometry + number helpers shared across the analysis charts. */

/** Round a value up to a "nice" axis maximum (1/2/5 × 10^k). */
export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const exponent = Math.floor(Math.log10(value));
  const base = 10 ** exponent;
  const fraction = value / base;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return nice * base;
}

/** Evenly spaced axis ticks from 0..max inclusive. */
export function axisTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0];
  const step = max / count;
  return Array.from({ length: count + 1 }, (_, index) => Math.round(step * index));
}

/** Path for a horizontal bar: square at the x0 baseline, `r`-rounded data-end. */
export function barPathRight(x0: number, y: number, length: number, height: number, r = 4): string {
  const radius = Math.max(0, Math.min(r, length, height / 2));
  if (length <= radius) {
    return `M${x0},${y} h${length} v${height} h${-length} Z`;
  }
  const right = x0 + length;
  return [
    `M${x0},${y}`,
    `H${right - radius}`,
    `Q${right},${y} ${right},${y + radius}`,
    `V${y + height - radius}`,
    `Q${right},${y + height} ${right - radius},${y + height}`,
    `H${x0}`,
    "Z",
  ].join(" ");
}

/** Compact number for stat tiles (1,284 / 12.9K). */
export function formatCompact(value: number): string {
  if (value < 1000) return String(value);
  if (value < 10_000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${Math.round(value / 1000)}K`;
}
