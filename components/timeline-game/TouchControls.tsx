"use client";

import { useRef, type MouseEvent, type PointerEvent } from "react";

import type { MoveDirection } from "../../lib/game/controller";

export interface TouchControlsProps {
  readonly onMove: (direction: MoveDirection, active: boolean) => void;
  readonly onRead: () => void;
  readonly onMap?: () => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

type DirectionButtonProps = {
  readonly direction: MoveDirection;
  readonly label: string;
  readonly shortLabel: string;
  readonly disabled: boolean;
  readonly onMove: TouchControlsProps["onMove"];
};

function DirectionButton({ direction, label, shortLabel, disabled, onMove }: DirectionButtonProps) {
  const activePointer = useRef<number | null>(null);
  const pressStartedAt = useRef(0);

  const stop = (pointerId?: number) => {
    if (activePointer.current === null) return;
    if (pointerId !== undefined && activePointer.current !== pointerId) return;
    activePointer.current = null;
    onMove(direction, false);
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (disabled || (event.pointerType === "mouse" && event.button !== 0)) return;
    event.preventDefault();
    activePointer.current = event.pointerId;
    pressStartedAt.current = performance.now();
    event.currentTarget.setPointerCapture(event.pointerId);
    onMove(direction, true);
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const elapsed = performance.now() - pressStartedAt.current;
    if (activePointer.current === event.pointerId && elapsed < 90) {
      activePointer.current = null;
      window.setTimeout(() => onMove(direction, false), 90 - elapsed);
    } else {
      stop(event.pointerId);
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // Native keyboard and assistive-tech activation has detail 0. Pointer holds
    // are already handled above and must not gain an extra movement step.
    if (event.detail !== 0 || disabled) return;
    onMove(direction, true);
    window.setTimeout(() => onMove(direction, false), 140);
  };

  return (
    <button
      className={`touch-controls__button touch-controls__button--${direction}`}
      type="button"
      disabled={disabled}
      aria-label={label}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={(event) => stop(event.pointerId)}
      onLostPointerCapture={(event) => stop(event.pointerId)}
      onBlur={() => stop()}
      onClick={handleClick}
    >
      <span aria-hidden="true">{shortLabel}</span>
    </button>
  );
}

export function TouchControls({ onMove, onRead, onMap, disabled = false, className }: TouchControlsProps) {
  return (
    <div className={className ? `touch-controls ${className}` : "touch-controls"} aria-label="NOVA movement controls">
      <div className="touch-controls__pad">
        <DirectionButton direction="up" label="Move NOVA up" shortLabel="↑" disabled={disabled} onMove={onMove} />
        <DirectionButton direction="left" label="Move NOVA left" shortLabel="←" disabled={disabled} onMove={onMove} />
        <span className="touch-controls__center" aria-hidden="true">◈</span>
        <DirectionButton direction="right" label="Move NOVA right" shortLabel="→" disabled={disabled} onMove={onMove} />
        <DirectionButton direction="down" label="Move NOVA down" shortLabel="↓" disabled={disabled} onMove={onMove} />
      </div>
      <div className="touch-controls__actions">
        <button className="touch-controls__action touch-controls__action--read" type="button" disabled={disabled} onClick={onRead}>
          Read
        </button>
        {onMap && (
          <button className="touch-controls__action touch-controls__action--map" type="button" disabled={disabled} onClick={onMap}>
            Fit map
          </button>
        )}
      </div>
    </div>
  );
}
