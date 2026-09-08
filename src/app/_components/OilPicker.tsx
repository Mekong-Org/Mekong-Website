"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type PickerProduct = {
  slug: string;
  name: string;
  image: string;
  spec: string;
  summary: string;
  vehicle: string;
  tier: string;
};

export type PickerVehicle = {
  id: string;
  label: string;
  hint: string;
  tiers: { id: string; label: string; hint: string }[];
};

export function OilPicker({
  vehicles,
  products,
  note,
}: {
  vehicles: PickerVehicle[];
  products: PickerProduct[];
  note: string;
}) {
  const [vehicleId, setVehicleId] = useState(vehicles[0].id);
  const [tierId, setTierId] = useState<string | null>(null);

  const vehicle =
    vehicles.find((item) => item.id === vehicleId) ?? vehicles[0];
  const tiers = vehicle.tiers;
  const activeTier = tiers.find((tier) => tier.id === tierId) ?? null;

  const matches = products.filter(
    (product) =>
      product.vehicle === vehicle.id &&
      (activeTier ? product.tier === activeTier.id : true),
  );

  function chooseVehicle(id: string) {
    setVehicleId(id);
    setTierId(null);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-[0_20px_50px_-30px_rgba(0,0,0,0.45)]">
      <div className="border-b border-line bg-gradient-to-br from-brand-100 to-white px-5 py-6 sm:px-8">
        <p className="text-xs font-bold tracking-[0.16em] text-brand-700 uppercase">
          Bước 1 — Xe của bạn là loại nào?
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {vehicles.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === vehicle.id}
              onClick={() => chooseVehicle(item.id)}
              className={`rounded-sm border px-5 py-3 text-left transition-transform duration-150 hover:-translate-y-0.5 ${
                item.id === vehicle.id
                  ? "border-brand-500 bg-brand-500 text-ink"
                  : "border-ink/20 bg-white text-ink hover:border-brand-400"
              }`}
            >
              <span className="block font-display text-[22px] leading-[1.15] font-bold uppercase">
                {item.label}
              </span>
              <span className="mt-1 block text-xs opacity-70">{item.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {tiers.length > 1 && (
        <div className="border-b border-line px-5 py-6 sm:px-8">
          <p className="text-xs font-bold tracking-[0.16em] text-brand-700 uppercase">
            Bước 2 — Bạn cần gì ở chai nhớt?
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {tiers.map((tier) => (
              <button
                key={tier.id}
                type="button"
                aria-pressed={tier.id === activeTier?.id}
                onClick={() =>
                  setTierId((current) => (current === tier.id ? null : tier.id))
                }
                className={`rounded-sm border px-4 py-2.5 text-left transition-transform duration-150 hover:-translate-y-0.5 ${
                  tier.id === activeTier?.id
                    ? "border-ink bg-ink text-white"
                    : "border-ink/20 bg-white text-ink hover:border-brand-400"
                }`}
              >
                <span className="block text-sm font-semibold">{tier.label}</span>
                <span className="mt-0.5 block text-xs opacity-70">
                  {tier.hint}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 py-6 sm:px-8">
        <p className="text-xs font-bold tracking-[0.16em] text-brand-700 uppercase">
          Nhớt phù hợp với xe của bạn
        </p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {matches.map((product) => (
            <li key={product.slug}>
              <Link
                href={`/san-pham/${product.slug}`}
                className="kt-pick flex h-full items-center gap-4 p-3"
              >
                <span className="kt-pick__media">
                  <span className="kt-pick__glow" aria-hidden="true" />
                  <span className="kt-pick__lift">
                    <Image
                      src={product.image}
                      alt={`Chai ${product.name}`}
                      width={140}
                      height={140}
                      className="kt-pick__img"
                      sizes="96px"
                    />
                  </span>
                </span>
                <span>
                  <span className="kt-pick__name block font-display text-[22px] leading-[1.15] font-bold text-ink uppercase">
                    {product.name}
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-brand-700">
                    {product.spec}
                  </span>
                  <span className="mt-2 block text-[13px] leading-snug text-muted">
                    {product.summary}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs leading-relaxed text-muted">{note}</p>
      </div>
    </div>
  );
}
