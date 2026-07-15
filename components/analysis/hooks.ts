"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Measured content width of a container, via ResizeObserver. Returns 0 until
 * measured (SSR-safe); charts that need pixel scales render once width > 0.
 */
export function useElementWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setWidth(Math.round(element.getBoundingClientRect().width));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}

/** SSR-safe prefers-reduced-motion, defaulting to false on the server. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

/**
 * Runs `onReveal` once the element first scrolls into view (for count-ups and
 * draw-on reveals). Fires immediately when reduced motion is requested.
 */
export function useInViewOnce<T extends HTMLElement>(onReveal: () => void, reducedMotion: boolean): React.RefObject<T | null> {
  const ref = useRef<T>(null);
  const firedRef = useRef(false);
  const callbackRef = useRef(onReveal);
  useEffect(() => { callbackRef.current = onReveal; });

  useEffect(() => {
    if (firedRef.current) return;
    const element = ref.current;
    if (!element) return;
    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      firedRef.current = true;
      callbackRef.current();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          callbackRef.current();
          observer.disconnect();
        }
      }
    }, { threshold: 0.25 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return ref;
}
