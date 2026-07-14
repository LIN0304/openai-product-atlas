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
        <div className="panel-label">Event feed</div>
        <p>Move NOVA to a node to read its record.</p>
        <pre>{`WASD / arrows   move\nEnter           read\nClick a node    route\n/               search`}</pre>
      </aside>
    );
  }

  return (
    <aside className="event-inspector" aria-labelledby="inspector-title">
      <div className="panel-label">Active record</div>
      <div className="inspector-date">
        <time dateTime={event.date}>{event.date}</time>
        <span>{event.node_tier.toUpperCase()}</span>
      </div>
      <p className="eyebrow"><span aria-hidden="true" style={{ color: family?.color ?? event.color }}>{family?.glyph ?? event.glyph}</span> {family?.name_en ?? event.map_region}</p>
      <h2 id="inspector-title">{event.title_en}</h2>
      <p className="inspector-summary">{event.summary_en}</p>
      <dl className="compact-facts">
        <div><dt>Type</dt><dd>{formatType(event.event_type)}</dd></div>
        <div><dt>Product</dt><dd>{event.product}</dd></div>
        <div><dt>Lifecycle</dt><dd>{formatType(event.lifecycle)}</dd></div>
        <div><dt>Confidence</dt><dd>{event.confidence.toUpperCase()}</dd></div>
      </dl>
      <div className="inspector-actions">
        <button type="button" onClick={() => onRoute(event)}>Route</button>
        <button type="button" className="primary-action" onClick={() => onOpen(event)}>Open</button>
      </div>
      <a className="source-link" href={event.source_url} target="_blank" rel="noreferrer">Official source ↗</a>
      <button className="copy-link" type="button" onClick={() => onCopy(event)}>{copied ? "Link copied ✓" : "Copy deep link"}</button>
    </aside>
  );
}
