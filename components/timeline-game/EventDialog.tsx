"use client";

import { useEffect, useRef } from "react";

import type { ExplorerEvent, ExplorerFamily } from "../../lib/timeline/schema";

type EventDialogProps = {
  events: readonly ExplorerEvent[];
  activeIndex: number;
  family?: ExplorerFamily;
  open: boolean;
  onClose: () => void;
  onStep: (nextIndex: number) => void;
};

function humanize(value: string) {
  return value.replaceAll("_", " ").toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

export function EventDialog({ events, activeIndex, family, open, onClose, onStep }: EventDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const event = events[activeIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!event) return null;

  return (
    <dialog
      ref={dialogRef}
      className="event-dialog"
      aria-labelledby="event-dialog-title"
      aria-describedby="event-dialog-summary"
      onKeyDown={(browserEvent) => {
        if (browserEvent.key !== "Escape") return;
        browserEvent.preventDefault();
        browserEvent.stopPropagation();
        onClose();
      }}
      onCancel={(browserEvent) => {
        browserEvent.preventDefault();
        onClose();
      }}
    >
      <div className="dialog-frame">
        <header className="dialog-header">
          <span>+-- NODE DECODED // {family?.region.toUpperCase() ?? event.map_region.toUpperCase()}</span>
          <button type="button" onClick={onClose} aria-label="Close event record">[X]</button>
        </header>

        <div className="dialog-body">
          <div className="dialog-coordinate">
            <time dateTime={event.date}>{formatDate(event.date)}</time>
            <span>{event.event_id}</span>
          </div>
          <p className="eyebrow">{family?.glyph ?? event.glyph} {family?.name_en.toUpperCase() ?? event.product_family.toUpperCase()} / {humanize(event.event_type)}</p>
          <h2 id="event-dialog-title">{event.title_en}</h2>
          <p id="event-dialog-summary" className="event-summary">{event.summary_en}</p>

          <dl className="event-facts">
            <div><dt>PRODUCT</dt><dd>{event.product}</dd></div>
            <div><dt>LIFECYCLE</dt><dd>{humanize(event.lifecycle)}</dd></div>
            <div><dt>NODE TIER</dt><dd>{event.node_tier.toUpperCase()} / {event.importance}</dd></div>
            <div><dt>CONFIDENCE</dt><dd>{event.confidence.toUpperCase()}</dd></div>
            <div><dt>SOURCE GROUP</dt><dd>{event.source_name}</dd></div>
            <div><dt>CORROBORATION</dt><dd>{event.source_refs.length} OFFICIAL REF{event.source_refs.length === 1 ? "" : "S"}</dd></div>
          </dl>

          <a className="primary-action" href={event.source_url} target="_blank" rel="noreferrer">
            [OPEN OFFICIAL SOURCE]
          </a>

          {events.length > 1 && (
            <div className="station-pagination" aria-label="Events at this station">
              <button type="button" onClick={() => onStep((activeIndex - 1 + events.length) % events.length)}>[PREV]</button>
              <span>RECORD {activeIndex + 1} / {events.length}</span>
              <button type="button" onClick={() => onStep((activeIndex + 1) % events.length)}>[NEXT]</button>
            </div>
          )}
        </div>

        <footer className="dialog-footer">
          <span>ARRIVAL LATCHED // EXIT STATION TO REARM</span>
          <button type="button" onClick={onClose}>[CONTINUE]</button>
        </footer>
      </div>
    </dialog>
  );
}
