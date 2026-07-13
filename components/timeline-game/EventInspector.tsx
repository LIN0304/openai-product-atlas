"use client";

import type { ExplorerEvent, ExplorerFamily } from "../../lib/timeline/schema";

type EventInspectorProps = {
  event?: ExplorerEvent;
  family?: ExplorerFamily;
  copied: boolean;
  onRoute: (event: ExplorerEvent) => void;
  onOpen: (event: ExplorerEvent) => void;
  onCopy: (event: ExplorerEvent) => void;
};

function formatType(value: string) {
  return value.replaceAll("_", " ").toUpperCase();
}

export function EventInspector({ event, family, copied, onRoute, onOpen, onCopy }: EventInspectorProps) {
  if (!event) {
    return (
      <aside className="event-inspector empty" aria-label="Event inspector">
        <div className="panel-label">+-- EVENT FEED ------------------+</div>
        <p>MOVE NOVA TO A NODE.</p>
        <pre>{`WASD / ARROWS : MOVE\nENTER         : READ\nCLICK NODE    : ROUTE\n/             : SEARCH`}</pre>
      </aside>
    );
  }

  return (
    <aside className="event-inspector" aria-labelledby="inspector-title">
      <div className="panel-label">+-- ACTIVE RECORD ----------------+</div>
      <div className="inspector-date">
        <time dateTime={event.date}>{event.date}</time>
        <span>{event.node_tier.toUpperCase()}</span>
      </div>
      <p className="eyebrow">{family?.glyph ?? event.glyph} {family?.name_en.toUpperCase() ?? event.map_region.toUpperCase()}</p>
      <h2 id="inspector-title">{event.title_en}</h2>
      <p className="inspector-summary">{event.summary_en}</p>
      <dl className="compact-facts">
        <div><dt>TYPE</dt><dd>{formatType(event.event_type)}</dd></div>
        <div><dt>PRODUCT</dt><dd>{event.product}</dd></div>
        <div><dt>LIFECYCLE</dt><dd>{formatType(event.lifecycle)}</dd></div>
        <div><dt>CONFIDENCE</dt><dd>{event.confidence.toUpperCase()}</dd></div>
      </dl>
      <div className="inspector-actions">
        <button type="button" onClick={() => onRoute(event)}>[ROUTE]</button>
        <button type="button" className="primary-action" onClick={() => onOpen(event)}>[OPEN NOW]</button>
      </div>
      <a className="source-link" href={event.source_url} target="_blank" rel="noreferrer">[OFFICIAL SOURCE]</a>
      <button className="copy-link" type="button" onClick={() => onCopy(event)}>{copied ? "[LINK COPIED]" : "[COPY DEEP LINK]"}</button>
    </aside>
  );
}
