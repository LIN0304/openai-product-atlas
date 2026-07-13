"use client";

import type { ExplorerFamily } from "../../lib/timeline/schema";

type FilterPanelProps = {
  query: string;
  family: string;
  year: string;
  landmarksOnly: boolean;
  families: readonly ExplorerFamily[];
  years: number[];
  resultCount: number;
  open: boolean;
  inactive: boolean;
  onQuery: (value: string) => void;
  onFamily: (value: string) => void;
  onYear: (value: string) => void;
  onLandmarksOnly: (value: boolean) => void;
  onReset: () => void;
  onClose: () => void;
};

export function FilterPanel(props: FilterPanelProps) {
  return (
    <aside
      className={props.open ? "command-rail open" : "command-rail"}
      aria-label="Timeline search and filters"
      aria-hidden={props.inactive || undefined}
      inert={props.inactive || undefined}
    >
      <div className="panel-label">+-- MISSION CONTROL --------------+</div>
      <button className="rail-close" type="button" onClick={props.onClose}>[CLOSE]</button>

      <label className="terminal-field">
        <span>SEARCH EVENTS [/]</span>
        <span className="input-wrap"><b aria-hidden="true">&gt;</b><input id="atlas-search" type="search" value={props.query} onChange={(event) => props.onQuery(event.target.value)} placeholder="GPT-4o, Codex, Voice..." /></span>
      </label>

      <label className="select-field">
        <span>YEAR</span>
        <select value={props.year} onChange={(event) => props.onYear(event.target.value)}>
          <option value="all">ALL YEARS</option>
          {props.years.map((value) => <option value={String(value)} key={value}>{value}</option>)}
        </select>
      </label>

      <fieldset className="family-filter">
        <legend>PRODUCT FAMILIES</legend>
        <button type="button" aria-label="Show all product families" aria-pressed={props.family === "all"} className={props.family === "all" ? "active" : ""} onClick={() => props.onFamily("all")}>
          <span>[*]</span><span>ALL FAMILIES</span><b>{props.families.length}</b>
        </button>
        {props.families.map((item) => (
          <button type="button" aria-label={`Filter by ${item.name_en}`} aria-pressed={props.family === item.id} className={props.family === item.id ? "active" : ""} key={item.id} onClick={() => props.onFamily(item.id)}>
            <span style={{ color: item.color }}>[{item.glyph}]</span><span>{item.name_en}</span><b>L{String(item.lane + 1).padStart(2, "0")}</b>
          </button>
        ))}
      </fieldset>

      <label className="check-control">
        <input type="checkbox" checked={props.landmarksOnly} onChange={(event) => props.onLandmarksOnly(event.target.checked)} />
        <span aria-hidden="true">[{props.landmarksOnly ? "x" : " "}]</span>
        <b>LANDMARKS ONLY</b>
      </label>

      <div className="rail-status">
        <span>VISIBLE SIGNALS</span>
        <strong>{String(props.resultCount).padStart(3, "0")}</strong>
      </div>
      <button className="secondary-action" type="button" onClick={props.onReset}>[RESET FILTERS]</button>
    </aside>
  );
}
