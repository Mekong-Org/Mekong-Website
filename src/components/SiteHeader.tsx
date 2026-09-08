"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LEFT = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Chọn nhớt", href: "/#chon-nhot" },
];

const NAV_RIGHT = [
  { label: "Về Katsuma", href: "/ve-katsuma" },
  { label: "Làm đại lý", href: "/lam-dai-ly" },
];

const NAV_ALL = [...NAV_LEFT, ...NAV_RIGHT];

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
          {NAV_RIGHT.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              activeSection={activeSection}
            />
          ))}
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
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`block border-b border-line py-3 font-display text-[22px] font-bold uppercase last:border-b-0 ${
                  current
                    ? "border-l-4 border-l-cta pl-3 text-brand-700"
                    : "text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
