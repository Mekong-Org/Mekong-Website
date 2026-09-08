"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades and lifts its children into place the first time they scroll into
 * view — the reference site's section rhythm. Motion itself is defined in
 * globals.css (.kt-reveal), which also disables it under
 * prefers-reduced-motion.
 */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`kt-reveal ${className}`}>
      {children}
    </div>
  );
}
