"use client";

import { useMemo, useState } from "react";

import type { ExplorerEvent, ExplorerFamily } from "../../lib/timeline/schema";

type EventIndexProps = {
  events: readonly ExplorerEvent[];
  families: readonly ExplorerFamily[];
  selectedEventId: string;
  onRoute: (event: ExplorerEvent) => void;
  onOpen: (event: ExplorerEvent) => void;
};

const PAGE_SIZE = 64;

function tierMark(event: ExplorerEvent) {
  if (event.node_tier === "landmark") return `[${event.glyph}]*`;
  if (event.node_tier === "major") return `<${event.glyph}>`;
  return `${event.glyph}.`;
}

export function EventIndex({ events, families, selectedEventId, onRoute, onOpen }: EventIndexProps) {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const familyById = useMemo(() => new Map(families.map((family) => [family.id, family])), [families]);
  const selectedIndex = events.findIndex((event) => event.event_id === selectedEventId);
  const selectedLimit = selectedIndex >= 0
    ? Math.ceil((selectedIndex + 1) / PAGE_SIZE) * PAGE_SIZE
    : PAGE_SIZE;
  const visibleLimit = Math.max(limit, selectedLimit);

  return (
    <section className="archive-index" id="event-index" aria-labelledby="index-title">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">02 // SEMANTIC ARCHIVE</p>
          <h2 id="index-title">ALL EVENTS, WITHOUT THE MAP</h2>
        </div>
        <span className="count-chip">{events.length} MATCHING RECORDS</span>
      </div>

      <div className="index-table" role="list">
        {events.slice(0, visibleLimit).map((event) => {
          const family = familyById.get(event.product_family);
          const selected = event.event_id === selectedEventId;
          return (
            <article className={selected ? "index-record selected" : "index-record"} id={`event-${event.event_id}`} key={event.event_id} role="listitem">
              <time dateTime={event.date}>{event.date}</time>
              <span className="tier-mark" style={{ color: event.color }} aria-label={`${event.node_tier} node`}>{tierMark(event)}</span>
              <div className="index-record-title">
                <h3>{event.title_en}</h3>
                <p>{family?.glyph ?? event.glyph} {family?.name_en ?? event.map_region} / {event.product}</p>
              </div>
              <div className="index-record-actions">
                <button type="button" onClick={() => onRoute(event)} aria-label={`Route NOVA to ${event.title_en}`}>[ROUTE]</button>
                <button type="button" onClick={() => onOpen(event)} aria-label={`Open ${event.title_en}`}>[OPEN NOW]</button>
              </div>
            </article>
          );
        })}
        {!events.length && <p className="empty-state">NO SIGNAL // TRY A DIFFERENT SEARCH OR FILTER.</p>}
      </div>

      {visibleLimit < events.length && (
        <button className="load-more" type="button" onClick={() => setLimit(visibleLimit + PAGE_SIZE)}>
          [LOAD {Math.min(PAGE_SIZE, events.length - visibleLimit)} MORE]
        </button>
      )}
    </section>
  );
}
