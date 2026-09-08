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
            <Link
              key={item.href}
              href={item.href}
              className="font-display text-[20px] font-bold tracking-[0.02em] text-ink uppercase transition-opacity hover:opacity-70"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <LogoPanel />
        <nav className="flex items-center justify-evenly" aria-label="Liên kết phụ">
          {NAV_RIGHT.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-display text-[20px] font-bold tracking-[0.02em] text-ink uppercase transition-opacity hover:opacity-70"
            >
              {item.label}
            </Link>
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
          {NAV_ALL.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block border-b border-line py-3 font-display text-[22px] font-bold uppercase last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
