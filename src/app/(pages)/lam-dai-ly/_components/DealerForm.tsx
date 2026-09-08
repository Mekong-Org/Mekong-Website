"use client";

import { useState } from "react";

const RECIPIENT = "info@mekongpetro.com";

/**
 * Phase-1 registration form: submitting composes a pre-filled email to the
 * sales inbox. Swap the handler for a POST to a real endpoint (or a CRM
 * webhook) once one exists — the fields are already the ones sales asks for.
 */
export function DealerForm({ note }: { note: string }) {
  const [shop, setShop] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = `Đăng ký làm đại lý Katsuma - ${shop || name}`;
    const body = [
      `Tên tiệm: ${shop}`,
      `Người liên hệ: ${name}`,
      `Số điện thoại: ${phone}`,
      `Tỉnh/Thành: ${province}`,
    ].join("\n");
    window.location.href = `mailto:${RECIPIENT}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  const fieldClass =
    "mt-1.5 w-full rounded-sm border border-ink/20 bg-white px-4 py-3 text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200";
  const labelClass = "block text-xs font-bold tracking-[0.12em] uppercase text-muted";

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className={labelClass}>Tên tiệm</span>
        <input
          className={fieldClass}
          value={shop}
          onChange={(event) => setShop(event.target.value)}
          required
          autoComplete="organization"
        />
      </label>
      <label className="block">
        <span className={labelClass}>Người liên hệ</span>
        <input
          className={fieldClass}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoComplete="name"
        />
      </label>
      <label className="block">
        <span className={labelClass}>Số điện thoại</span>
        <input
          className={fieldClass}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
          inputMode="tel"
          autoComplete="tel"
        />
      </label>
      <label className="block">
        <span className={labelClass}>Tỉnh / Thành</span>
        <input
          className={fieldClass}
          value={province}
          onChange={(event) => setProvince(event.target.value)}
          required
          autoComplete="address-level1"
        />
      </label>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="inline-flex items-center rounded-full bg-cta px-8 py-4 font-display text-[20px] font-bold text-white uppercase transition-colors hover:bg-cta-dark"
        >
          Gửi đăng ký
        </button>
        <p className="mt-3 text-xs text-muted">{note}</p>
      </div>
    </form>
  );
}
