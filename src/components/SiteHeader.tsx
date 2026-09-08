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
 * Whether a nav item points at the page being shown.
 *
 * Anchor links never match. "Chọn nhớt" points at a section of the home page
 * rather than a route of its own, so treating it as a route would light it up
 * alongside "Trang chủ" every time someone is on /.
 *
 * Everything else matches its own path and anything beneath it, so a product
 * detail page still marks "Sản phẩm" as the section you are in.
 */
function isCurrentPage(href: string, pathname: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
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
}: {
  item: { label: string; href: string };
  pathname: string;
}) {
  const current = isCurrentPage(item.href, pathname);
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
  const pathname = usePathname();

  // Route change closes the drawer — otherwise it stays open over the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-y-[8px] border-white bg-gradient-to-b from-brand-500 to-brand-300">
      <div className="mx-auto hidden h-[70px] w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-stretch px-3 lg:grid xl:px-6">
        <nav
          className="flex items-center justify-evenly"
          aria-label="Điều hướng chính"
        >
          {NAV_LEFT.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>
        <LogoPanel />
        <nav className="flex items-center justify-evenly" aria-label="Liên kết phụ">
          {NAV_RIGHT.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
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
            const current = isCurrentPage(item.href, pathname);
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
