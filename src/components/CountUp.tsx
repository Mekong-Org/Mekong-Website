"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1400;

/**
 * Counts a figure up from zero the first time it scrolls into view.
 *
 * The server still renders the final number, so it is what search engines index
 * and what anyone whose JavaScript never arrives reads — the count-up is only
 * layered on top afterwards.
 *
 * `value` is passed through untouched unless we can round-trip it exactly
 * (parse to a number, format it back, get the same string). Anything else — a
 * range, a "24/7", a figure written some other way — simply renders as given
 * rather than being reformatted behind the author's back.
 */
export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = Number(value.replace(/[^\d]/g, ""));
    // "38.084" groups thousands, "26" does not — mirror whichever the copy used.
    const grouped = /\d[.,]\d{3}/.test(value);
    const format = (n: number) =>
      grouped ? new Intl.NumberFormat("vi-VN").format(n) : String(n);

    if (!Number.isFinite(target) || format(target) !== value) return;

    let frame = 0;

    function run() {
      const start = performance.now();
      function tick(now: number) {
        const t = Math.min(1, (now - start) / DURATION_MS);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(format(Math.round(target * eased)));
        if (t < 1) frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
    }

    // Only rewind to zero when the figure is still off screen; rewinding one
    // the reader is already looking at would just flicker.
    if (node.getBoundingClientRect().top > window.innerHeight) {
      setDisplay(format(0));
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          run();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
