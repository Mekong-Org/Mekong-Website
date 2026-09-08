"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BLOG_TOPICS } from "@/constants/blog-topics";

const NAV_LEFT = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Chọn nhớt", href: "/#chon-nhot" },
];

const NAV_RIGHT = [
  // /blog is proxied to the external content app by middleware.ts, so it is a
  // real path here even though nothing under src/app serves it.
  { label: "Bài viết", href: "/blog" },
  { label: "Về Katsuma", href: "/ve-katsuma" },
  { label: "Làm đại lý", href: "/lam-dai-ly" },
];

const NAV_ALL = [...NAV_LEFT, ...NAV_RIGHT];

/**
 * Whether a path is served by the external content app rather than by us.
 *
 * Such a link must not be prefetched. Prefetch asks the route for a React
 * payload; middleware hands back the content app's finished HTML instead, and
 * the browser then resolves that page's own script tags against this origin —
 * nineteen 404s per page view, plus the blog's stylesheet and web fonts fetched
 * and never used, on every page whether or not anyone visits the blog.
 * Navigation is unaffected: it was always a full page load.
 */
function isProxied(href: string) {
  return href === "/blog" || href.startsWith("/blog/");
}

/**
 * Whether a nav item is the one you are currently looking at.
 *
 * Anchor links point at a section of the home page rather than a route, so they
 * are matched against whichever section holds the middle of the screen instead
 * of against the path. Once a section claims the nav, "Trang chủ" gives it up —
 * otherwise two items would be lit at once on /.
 *
 * Everything else matches its own path and anything beneath it, so a product
 * detail page still marks "Sản phẩm" as the section you are in.
 */
function isCurrentPage(
  href: string,
  pathname: string,
  activeSection: string | null,
) {
  if (href.startsWith("/#")) {
    return pathname === "/" && activeSection === href.slice(2);
  }
  if (href === "/") return pathname === "/" && activeSection === null;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Wordmark panel: parent-company logo (temporary) beside the Katsuma name. */
function LogoPanel() {
  return (
    <Link
      href="/"
      className="flex h-full shrink-0 items-stretch transition-opacity hover:opacity-90"
      aria-label="Katsuma - về trang chủ"
    >
      <span className="w-[10px] shrink-0 bg-brand-200" aria-hidden="true" />
      <span className="w-[10px] shrink-0 bg-brand-100" aria-hidden="true" />
      <span className="flex items-center gap-3 bg-white px-4 sm:px-7">
        <Image
          src="/images/brand/mekong-logo.svg"
          alt="Hóa Dầu Mekong"
          width={128}
          height={30}
          className="h-[22px] w-auto sm:h-[26px]"
          priority
        />
        <span className="h-7 w-px bg-line" aria-hidden="true" />
        <span className="font-display text-[24px] leading-none font-extrabold tracking-[0.04em] text-ink uppercase sm:text-[30px]">
          Katsuma
        </span>
      </span>
      <span className="w-[10px] shrink-0 bg-brand-100" aria-hidden="true" />
      <span className="w-[10px] shrink-0 bg-brand-200" aria-hidden="true" />
    </Link>
  );
}

/**
 * Marked with aria-current so the page is announced, not only drawn. The rule
 * underneath is a sibling element rather than a text-decoration: it needs to
 * sit clear of the descenders and the stacked Vietnamese marks above it.
 */
function NavLink({
  item,
  pathname,
  activeSection,
}: {
  item: { label: string; href: string };
  pathname: string;
  activeSection: string | null;
}) {
  const current = isCurrentPage(item.href, pathname, activeSection);
  return (
    <Link
      href={item.href}
      prefetch={isProxied(item.href) ? false : undefined}
      aria-current={current ? "page" : undefined}
      className={`relative font-display text-[20px] font-bold tracking-[0.02em] uppercase transition-opacity ${
        current ? "text-ink" : "text-ink/65 hover:text-ink"
      }`}
    >
      {item.label}
      {current && (
        <span
          className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full bg-ink"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

/**
 * "Bài viết" plus a caret that opens its topics.
 *
 * The label stays an ordinary link and the caret is its own button, so a tap
 * never has to mean both "open" and "go". Hover-to-open is gated on the device
 * actually having a hovering pointer: a touch browser synthesises mouseenter
 * just before the click of a tap, which would open the menu and let the tap
 * toggle it straight back shut, leaving the caret looking dead. Where hover
 * does work the caret only opens — a toggle would close what the pointer is
 * still hovering — and Escape or a click outside is what closes it.
 */
function NavMenu({
  item,
  pathname,
  activeSection,
}: {
  item: { label: string; href: string };
  pathname: string;
  activeSection: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Closing is deferred by a moment, and the panel is padded up to meet the
   * label rather than floating 14px clear of it.
   *
   * Both are needed. The padding removes the dead strip the pointer used to
   * cross on its way down — a gap belonging to neither the label nor the panel,
   * so leaving the label meant leaving the menu. The delay covers the rest:
   * the panel is wider than the label and hangs to its left, so reaching a row
   * often means cutting the corner across air that is still outside both.
   */
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const openNow = () => {
    cancelClose();
    setOpen(true);
  };

  const closeSoon = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 220);
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative flex items-center gap-1.5"
      onMouseEnter={canHover ? openNow : undefined}
      onMouseLeave={canHover ? closeSoon : undefined}
    >
      <NavLink item={item} pathname={pathname} activeSection={activeSection} />
      <button
        type="button"
        onClick={() => setOpen((value) => (canHover ? true : !value))}
        aria-expanded={open}
        aria-label="Mở danh mục bài viết"
        className="flex items-center text-ink"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Outer box is transparent and starts flush against the label: its
          padding is the 14px of daylight under the panel, and being part of
          the menu it keeps the pointer inside on the way down. */}
      <div hidden={!open} className="absolute top-full right-0 z-30 pt-3.5">
        <div className="min-w-[240px] rounded-lg bg-white p-2 shadow-[0_12px_32px_rgba(20,20,22,0.22)]">
          {BLOG_TOPICS.map((topic) => (
            <Link
              key={topic.href}
              href={topic.href}
              prefetch={false}
              className="block rounded-sm px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-brand-100"
            >
              {topic.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const pathname = usePathname();

  // Route change closes the drawer — otherwise it stays open over the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Follows whichever home-page section holds the middle of the screen, so the
  // nav item for it lights up on the way past rather than only when clicked.
  useEffect(() => {
    setActiveSection(null);
    if (pathname !== "/") return;

    const sections = NAV_ALL.filter((item) => item.href.startsWith("/#"))
      .map((item) => document.getElementById(item.href.slice(2)))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          setActiveSection((current) =>
            entry.isIntersecting ? id : current === id ? null : current,
          );
        }
      },
      // Counts only while the section crosses the middle band of the screen.
      // These sections are tall, and a plain intersection test would hand the
      // nav over the moment a top edge appeared and hold it long after.
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-y-[8px] border-white bg-gradient-to-b from-brand-500 to-brand-300">
      <div className="mx-auto hidden h-[70px] w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-stretch px-3 lg:grid xl:px-6">
        <nav
          className="flex items-center justify-evenly"
          aria-label="Điều hướng chính"
        >
          {NAV_LEFT.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              activeSection={activeSection}
            />
          ))}
        </nav>
        <LogoPanel />
        <nav
          className="flex items-center justify-evenly"
          aria-label="Liên kết phụ"
        >
          {NAV_RIGHT.map((item) =>
            item.href === "/blog" ? (
              <NavMenu
                key={item.href}
                item={item}
                pathname={pathname}
                activeSection={activeSection}
              />
            ) : (
              <NavLink
                key={item.href}
                item={item}
                pathname={pathname}
                activeSection={activeSection}
              />
            ),
          )}
        </nav>
      </div>

      <div className="flex h-[54px] items-stretch justify-between px-3 lg:hidden">
        <LogoPanel />
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="my-auto flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-sm border border-ink/20 bg-white/70"
        >
          <span className="sr-only">{open ? "Đóng menu" : "Mở menu"}</span>
          <span className="block h-[2px] w-5 bg-ink" aria-hidden="true" />
          <span className="block h-[2px] w-5 bg-ink" aria-hidden="true" />
          <span className="block h-[2px] w-5 bg-ink" aria-hidden="true" />
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-ink/10 bg-white px-4 py-2 lg:hidden"
          aria-label="Điều hướng chính"
        >
          {NAV_ALL.map((item) => {
            const current = isCurrentPage(item.href, pathname, activeSection);
            return (
              <div key={item.href} className="border-b border-line last:border-b-0">
                <Link
                  href={item.href}
                  prefetch={isProxied(item.href) ? false : undefined}
                  aria-current={current ? "page" : undefined}
                  className={`block py-3 font-display text-[22px] font-bold uppercase ${
                    current
                      ? "border-l-4 border-l-cta pl-3 text-brand-700"
                      : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
                {/* The drawer has room to list the topics outright; a second
                    thing to tap to reach them would only be in the way. */}
                {item.href === "/blog" && (
                  <div className="pb-3 pl-3">
                    {BLOG_TOPICS.map((topic) => (
                      <Link
                        key={topic.href}
                        href={topic.href}
                        prefetch={false}
                        className="block py-1.5 text-sm font-medium text-ink/70"
                      >
                        {topic.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      )}
    </header>
  );
}
