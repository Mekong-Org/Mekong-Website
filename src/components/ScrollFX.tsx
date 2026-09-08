"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One shared scroll engine for the whole site. Elements opt in by attribute:
 *
 *   data-fx-rise      — fades, lifts and un-blurs the first time it scrolls in
 *                       (stagger comes from the --fx-i index on the element)
 *   data-fx-parallax  — publishes scroll progress to its subtree as unitless
 *                       signals: --fx-d (drift, -0.5…0.5), --fx-c (swell,
 *                       peaks at 1 when centred) and --fx-g (glow, same peak)
 *   data-fx-hero      — publishes --fx-hp so a hero photo drifts slower than
 *                       the page
 *
 * The amplitudes those signals get multiplied by are CSS custom properties
 * (--fx-drift / --fx-swell / --fx-glow), so a section can turn the motion up
 * or down on its own — see .fx-strong in globals.css.
 *
 * Everything runs on one rAF-throttled scroll listener over the elements that
 * are actually on screen, and the whole thing stays off under
 * prefers-reduced-motion.
 */
export function ScrollFX() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const riseObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          riseObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    document
      .querySelectorAll("[data-fx-rise]")
      .forEach((element) => riseObserver.observe(element));

    const onScreen = new Set<HTMLElement>();
    let frame = 0;

    function update() {
      frame = 0;
      const viewportHeight = window.innerHeight;

      for (const element of onScreen) {
        const rect = element.getBoundingClientRect();
        if (!rect.height) continue;

        // 0 = element's top just entered from below, 1 = it has left the top.
        const progress = Math.min(
          1,
          Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)),
        );
        // Peaks at 1 when the element sits in the middle of the viewport.
        const centred = Math.sin(Math.PI * progress);

        // Publish the raw signals only — every amplitude lives in CSS, so a
        // section can dial the motion up or down with a custom property
        // instead of needing its own branch in here.
        if (element.hasAttribute("data-fx-hero")) {
          element.style.setProperty("--fx-hp", (progress - 0.5).toFixed(4));
        } else {
          element.style.setProperty("--fx-d", (0.5 - progress).toFixed(4));
          element.style.setProperty("--fx-c", centred.toFixed(4));
          element.style.setProperty("--fx-g", (centred * centred).toFixed(4));
        }
      }
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    const viewObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) onScreen.add(element);
          else onScreen.delete(element);
        }
        schedule();
      },
      { rootMargin: "25% 0px 25% 0px" },
    );
    document
      .querySelectorAll("[data-fx-parallax], [data-fx-hero]")
      .forEach((element) => viewObserver.observe(element));

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      riseObserver.disconnect();
      viewObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
