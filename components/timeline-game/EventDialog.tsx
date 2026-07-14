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
          <span>Node decoded · {family?.region ?? event.map_region}</span>
          <button type="button" onClick={onClose} aria-label="Close event record">×</button>
        </header>

        <div className="dialog-body">
          <div className="dialog-coordinate">
            <time dateTime={event.date}>{formatDate(event.date)}</time>
            <span>{event.event_id}</span>
          </div>
          <p className="eyebrow"><span aria-hidden="true" style={{ color: family?.color ?? event.color }}>{family?.glyph ?? event.glyph}</span> {family?.name_en ?? event.product_family} · {humanize(event.event_type)}</p>
          <h2 id="event-dialog-title">{event.title_en}</h2>
          <p id="event-dialog-summary" className="event-summary">{event.summary_en}</p>

          <dl className="event-facts">
            <div><dt>Product</dt><dd>{event.product}</dd></div>
            <div><dt>Lifecycle</dt><dd>{humanize(event.lifecycle)}</dd></div>
            <div><dt>Node tier</dt><dd>{event.node_tier.toUpperCase()} · {event.importance}</dd></div>
            <div><dt>Confidence</dt><dd>{event.confidence.toUpperCase()}</dd></div>
            <div><dt>Source group</dt><dd>{event.source_name}</dd></div>
            <div><dt>Corroboration</dt><dd>{event.source_refs.length} official ref{event.source_refs.length === 1 ? "" : "s"}</dd></div>
          </dl>

          <a className="primary-action" href={event.source_url} target="_blank" rel="noreferrer">
            Open official source ↗
          </a>

          {events.length > 1 && (
            <div className="station-pagination" aria-label="Events at this station">
              <button type="button" onClick={() => onStep((activeIndex - 1 + events.length) % events.length)}>← Prev</button>
              <span>Record {activeIndex + 1} / {events.length}</span>
              <button type="button" onClick={() => onStep((activeIndex + 1) % events.length)}>Next →</button>
            </div>
          )}
        </div>

        <footer className="dialog-footer">
          <span>Arrival latched — exit the station to re-arm</span>
          <button type="button" onClick={onClose}>Continue</button>
        </footer>
      </div>
    </dialog>
  );
}
