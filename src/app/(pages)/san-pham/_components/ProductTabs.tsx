"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { WordReveal } from "@/components/WordReveal";

export type Product = {
  slug: string;
  name: string;
  image: string;
  viscosity: string;
  standards: string[];
  packaging: string;
  recommendedFor: string;
  summary: string;
};

export type Category = {
  id: string;
  title: string;
  tagLabel: string;
  tagBgColor: string;
  products: Product[];
};

export type Tab = {
  id: string;
  label: string;
  hero: {
    banner: string;
    bannerAlt: string;
    title: string;
    description: string;
  };
  categories: Category[];
};

/** 3 across by default; a short category centres on 1–2 columns instead. */
function gridClass(count: number) {
  if (count === 1) return "plp-grid plp-grid--cols-1";
  if (count === 2) return "plp-grid plp-grid--cols-2";
  return "plp-grid";
}

function ProductCard({
  product,
  tag,
  tagColor,
  eager,
  index,
}: {
  product: Product;
  tag: string;
  tagColor: string;
  eager: boolean;
  index: number;
}) {
  return (
    <li
      className="plp-card"
      style={{ "--fx-i": index } as React.CSSProperties}
      data-fx-parallax=""
    >
      <Link
        href={`/san-pham/${product.slug}`}
        className="plp-card__link fx-rise flex w-full flex-col"
        data-fx-rise=""
      >
        <div className="plp-card__media">
          <span className="plp-card__glow" aria-hidden="true" />
          <span className="plp-card__tag" style={{ backgroundColor: tagColor }}>
            {tag}
          </span>
          <span className="plp-card__float">
            <span className="plp-card__lift">
              <Image
                src={product.image}
                alt={`Chai ${product.name}`}
                width={520}
                height={520}
                className="plp-card__img"
                sizes="(max-width: 430px) 280px, (max-width: 720px) 45vw, 280px"
                priority={eager}
              />
              {/* Same src and sizes as above on purpose: the browser reuses
                  the cached file for the gloss sweep. */}
              <Image
                src={product.image}
                alt=""
                aria-hidden="true"
                width={520}
                height={520}
                className="plp-card__shine"
                sizes="(max-width: 430px) 280px, (max-width: 720px) 45vw, 280px"
              />
            </span>
          </span>
        </div>
        <div className="plp-card__body">
          <h3 className="plp-card__name">{product.name}</h3>
          <p className="plp-card__spec">
            {[product.viscosity, ...product.standards].join(" · ")}
          </p>
          <p className="plp-card__desc">{product.summary}</p>
          <span className="plp-card__cta">Xem chi tiết</span>
        </div>
      </Link>
    </li>
  );
}

function TabPanel({ tab, active }: { tab: Tab; active: boolean }) {
  const total = tab.categories.reduce(
    (sum, category) => sum + category.products.length,
    0,
  );

  return (
    <div id={`nhom-${tab.id}`} role="tabpanel" hidden={!active}>
      <section className="plp-hero" data-fx-hero="">
        <Image
          src={tab.hero.banner}
          alt={tab.hero.bannerAlt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={active}
        />
        <span className="plp-hero__scrim" aria-hidden="true" />
        <div className="plp-hero__content">
          <WordReveal as="h1" text={tab.hero.title} className="plp-hero__title" />
          <p className="plp-hero__desc">{tab.hero.description}</p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-[clamp(32px,7vw,80px)] px-4 py-[clamp(32px,6vw,72px)] sm:px-8">
        <p className="text-center text-sm text-muted">
          {total} sản phẩm trong nhóm {tab.label.toLowerCase()}
        </p>

        {tab.categories.map((category, categoryIndex) => (
          <section
            key={category.id}
            className="flex flex-col items-center gap-[clamp(24px,4vw,40px)]"
          >
            <div className="flex flex-col items-center gap-3">
              <span
                className="h-1 w-12 rounded-full"
                style={{ backgroundColor: category.tagBgColor }}
                aria-hidden="true"
              />
              <WordReveal
                text={category.title}
                className="text-center text-[clamp(24px,3.6vw,38px)]"
              />
            </div>
            <ul className={gridClass(category.products.length)}>
              {category.products.map((product, productIndex) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  tag={category.tagLabel}
                  tagColor={category.tagBgColor}
                  eager={active && categoryIndex === 0 && productIndex < 2}
                  index={productIndex}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export function ProductTabs({ tabs }: { tabs: Tab[] }) {
  const [activeId, setActiveId] = useState(tabs[0].id);

  // Every group is rendered server-side; the hash only decides which one is
  // shown, so deep links work without giving up static HTML for the others.
  useEffect(() => {
    const fromHash = window.location.hash.replace("#", "");
    if (tabs.some((tab) => tab.id === fromHash)) setActiveId(fromHash);
  }, [tabs]);

  function selectTab(id: string) {
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <div className="bg-surface">
      <div className="plp-tabs" role="tablist" aria-label="Nhóm sản phẩm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeId}
            aria-controls={`nhom-${tab.id}`}
            className="plp-tab"
            onClick={() => selectTab(tab.id)}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <TabPanel key={tab.id} tab={tab} active={tab.id === activeId} />
      ))}
    </div>
  );
}
