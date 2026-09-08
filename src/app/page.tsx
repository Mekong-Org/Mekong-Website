import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import content from "./content.json";
import catalog from "./(pages)/san-pham/content.json";
import type { Tab } from "./(pages)/san-pham/_components/ProductTabs";
import {
  OilPicker,
  type PickerProduct,
  type PickerVehicle,
} from "./_components/OilPicker";
import { CountUp } from "@/components/CountUp";
import { Marquee } from "@/components/Marquee";
import { OilSlick } from "@/components/OilSlick";
import { Reveal } from "@/components/Reveal";
import { WordReveal } from "@/components/WordReveal";

export const metadata: Metadata = {
  title: content.title,
  description: content.metaDescription,
};

// One flat view of the catalogue, reused by the picker and the featured row.
const CATALOG = (catalog.tabs as Tab[]).flatMap((tab) =>
  tab.categories.flatMap((category) =>
    category.products.map((product) => ({
      ...product,
      spec: [product.viscosity, ...product.standards].join(" · "),
      vehicle: tab.id,
      tier: category.id,
      tierLabel: category.tagLabel,
      tierColor: category.tagBgColor,
    })),
  ),
);

const PICKER_PRODUCTS: PickerProduct[] = CATALOG.filter(
  // Tacoma 50 is a low-load machine lubricant, not a motorcycle oil — it stays
  // in the catalogue but never comes back as a recommendation for a bike.
  (product) => product.tier !== "boi-tron-khac",
).map(({ slug, name, image, spec, summary, vehicle, tier }) => ({
  slug,
  name,
  image,
  spec,
  summary,
  vehicle,
  tier,
}));

const PICKER_VEHICLES: PickerVehicle[] = [
  {
    id: "xe-so",
    label: "Xe số",
    hint: "Wave, Sirius, Dream…",
    tiers: [
      {
        id: "cao-cap",
        label: "Bảo vệ tối đa",
        hint: "Xe đời mới, chạy nhiều",
      },
      {
        id: "tam-trung",
        label: "Cân bằng",
        hint: "Đi làm hằng ngày",
      },
      {
        id: "pho-thong",
        label: "Tiết kiệm",
        hint: "Xe đã chạy nhiều năm",
      },
    ],
  },
  {
    id: "xe-tay-ga",
    label: "Xe tay ga",
    hint: "Vision, Air Blade, Vario…",
    tiers: [],
  },
  {
    id: "hop-so-xe-ga",
    label: "Dầu hộp số xe ga",
    hint: "Thay kèm nhớt máy",
    tiers: [],
  },
];

// Three bottles, picked for contrast: red, gold and green side by side. The
// gear oil is a slim tube rather than a bottle, so it reads as the odd one out
// in a line-up and stays out of this one.
const LINEUP = ["access-3000-pro", "access-9000-extreme", "tapec-xtreme-2"]
  .map((slug) => CATALOG.find((product) => product.slug === slug))
  .filter((product): product is (typeof CATALOG)[number] => Boolean(product));

const FEATURED = content.featured.slugs
  .map((slug) => CATALOG.find((product) => product.slug === slug))
  .filter((product): product is (typeof CATALOG)[number] => Boolean(product));

export default function Home() {
  const { hero } = content;

  return (
    <main className="flex-1">
      <section
        className="relative flex min-h-[calc(100svh-70px)] items-end overflow-hidden"
        data-fx-hero=""
      >
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <span
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex w-full max-w-[1180px] flex-col items-start gap-6 px-5 pt-24 pb-14">
          <p className="text-xs font-bold tracking-[0.2em] text-brand-300 uppercase">
            {hero.eyebrow}
          </p>
          <WordReveal
            as="h1"
            text={hero.heading}
            className="max-w-[16ch] text-[clamp(52px,12vw,132px)] leading-[1.15] text-white"
          />
          <p className="max-w-[52ch] text-base leading-relaxed text-white/85">
            {hero.subheading}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={hero.primaryCta.href}
              className="inline-flex items-center rounded-full bg-brand-500 px-8 py-4 font-display text-[20px] font-bold text-ink uppercase transition-transform duration-150 hover:-translate-y-0.5 hover:bg-brand-400"
            >
              {hero.primaryCta.label}
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className="inline-flex items-center rounded-full border-2 border-white px-8 py-4 font-display text-[20px] font-bold text-white uppercase transition-colors hover:bg-white hover:text-ink"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
          <p className="kt-scroll-cue mt-4 self-center text-[11px] font-semibold tracking-[0.16em] text-white/80 uppercase">
            <span className="kt-scroll-cue__wheel" aria-hidden="true" />
            {hero.scrollCue}
          </p>
        </div>
      </section>

      <Marquee text={content.marquee} />

      {/* data-fx-parallax is the whole integration: the shared scroll engine
          publishes --fx-d here and the oil layers read it from CSS. */}
      <section className="kt-liquid" data-fx-parallax="">
        <span className="kt-liquid__pool" aria-hidden="true" />
        <OilSlick className="kt-liquid__canvas" />
        <div className="kt-liquid__content kt-breathe mx-auto w-full max-w-[1180px] px-5 py-[clamp(48px,8vw,96px)]">
          <Reveal>
            <div className="max-w-[52ch]">
              <WordReveal
                text={content.vehicleTypes.heading}
                className="text-[clamp(30px,5vw,52px)]"
              />
            </div>
          </Reveal>
          {/* No <Reveal> wrapper here: each card reveals itself via data-fx-rise,
            and a block-level fade on top of that swallows the per-card stagger. */}
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {content.vehicleTypes.items.map((item, index) => (
              <li
                key={item.id}
                style={{ "--fx-i": index } as React.CSSProperties}
              >
                <Link
                  href={`/san-pham#${item.id}`}
                  className="fx-rise group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-lg"
                  data-fx-rise=""
                >
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span
                    className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/10"
                    aria-hidden="true"
                  />
                  <span className="relative p-5">
                    <span className="block font-display text-[30px] leading-[1.15] font-extrabold text-white uppercase">
                      {item.label}
                    </span>
                    <span className="mt-2 block text-xs font-semibold tracking-[0.08em] text-brand-300 uppercase">
                      {item.note}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Inside the oil band, not after it: the pool and the WebGL slicks
            run the full height of this section, so they carry on down and
            pool behind the bottles instead of stopping at a divider. */}
        <div className="kt-lineup" data-fx-parallax="">
          <div className="kt-lineup__row">
            {LINEUP.map((product) => (
              <span key={product.slug} className="kt-lineup__item">
                <Image
                  src={product.image}
                  alt={`Chai ${product.name}`}
                  width={520}
                  height={520}
                  className="kt-lineup__img"
                  sizes="(max-width: 768px) 42vw, 460px"
                />
                <span className="kt-lineup__contact" aria-hidden="true" />
                {/* Same src and sizes again: the browser serves the reflection
                    from cache, so the extra depth cue costs no bytes. */}
                <Image
                  src={product.image}
                  alt=""
                  aria-hidden="true"
                  width={520}
                  height={520}
                  className="kt-lineup__reflection"
                  sizes="(max-width: 768px) 42vw, 460px"
                />
              </span>
            ))}
            {/* Last, not first: the item rules below are indexed by child
                position, and a leading element shifts every one of them. */}
            <span className="kt-lineup__ground" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Pulled up so it starts inside the oil band rather than butting against
          it. Two blocks meeting exactly edge to edge is what reads as a seam. */}
      <section
        id="chon-nhot"
        className="relative z-[1] -mt-[clamp(40px,5vw,90px)]"
        data-fx-parallax=""
      >
        <div className="kt-breathe mx-auto w-full max-w-[1180px] px-5 py-[clamp(48px,8vw,96px)]">
          <Reveal>
            <div className="max-w-[52ch]">
              <WordReveal
                text={content.picker.heading}
                className="text-[clamp(30px,5vw,52px)]"
              />
            </div>
          </Reveal>
          <Reveal className="mt-8">
            <OilPicker
              vehicles={PICKER_VEHICLES}
              products={PICKER_PRODUCTS}
              note={content.picker.note}
            />
          </Reveal>
        </div>
      </section>

      <section
        className="kt-breathe mx-auto w-full max-w-[1180px] px-5 py-[clamp(48px,8vw,96px)]"
        data-fx-parallax=""
      >
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-[52ch]">
              <WordReveal
                text={content.featured.heading}
                className="text-[clamp(30px,5vw,52px)]"
              />
            </div>
            <Link
              href="/san-pham"
              className="font-display text-[20px] font-bold text-brand-700 uppercase hover:text-brand-500"
            >
              Xem tất cả sản phẩm →
            </Link>
          </div>
        </Reveal>
        {/* fx-strong: this is a single row, so every bottle swells in unison and
            the default amplitude reads as no motion at all. See globals.css. */}
        <ul className="plp-grid plp-grid--cols-4 fx-strong mt-10">
          {FEATURED.map((product, index) => (
            <li
              key={product.slug}
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
                  <span
                    className="plp-card__tag"
                    style={{ backgroundColor: product.tierColor }}
                  >
                    {product.tierLabel}
                  </span>
                  <span className="plp-card__float">
                    <span className="plp-card__lift">
                      <Image
                        src={product.image}
                        alt={`Chai ${product.name}`}
                        width={520}
                        height={520}
                        className="plp-card__img"
                        sizes="(max-width: 1024px) 45vw, 260px"
                      />
                      {/* Same src and sizes as above on purpose: the browser
                          reuses the cached file for the gloss sweep. */}
                      <Image
                        src={product.image}
                        alt=""
                        aria-hidden="true"
                        width={520}
                        height={520}
                        className="plp-card__shine"
                        sizes="(max-width: 1024px) 45vw, 260px"
                      />
                    </span>
                  </span>
                </div>
                <div className="plp-card__body">
                  <h3 className="plp-card__name">{product.name}</h3>
                  <p className="plp-card__spec">{product.spec}</p>
                  <p className="plp-card__desc">{product.summary}</p>
                  <span className="plp-card__cta">Xem chi tiết</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 py-[clamp(28px,4vw,56px)]" data-fx-parallax="">
        <div className="kt-slab kt-breathe mx-auto grid w-full max-w-[1240px] gap-10 px-6 py-[clamp(44px,7vw,88px)] sm:px-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <WordReveal
              text={content.technology.heading}
              className="text-[clamp(30px,5vw,52px)] text-white"
            />
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {content.technology.items.map((item) => (
                <li key={item.title}>
                  <h3 className="text-[22px] text-brand-300">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{item.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={content.technology.image}
                alt={content.technology.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <Marquee text={content.marquee} reverse />

      <section
        className="kt-breathe mx-auto w-full max-w-[1180px] px-5 py-[clamp(48px,8vw,96px)]"
        data-fx-parallax=""
      >
        <Reveal>
          <div className="max-w-[56ch]">
            <WordReveal
              text={content.stats.heading}
              className="text-[clamp(30px,5vw,52px)]"
            />
            <p className="mt-4 leading-relaxed text-ink-soft">
              {content.stats.subheading}
            </p>
          </div>
          <dl className="mt-10 grid gap-6 sm:grid-cols-3">
            {content.stats.items.map((item) => (
              <div
                key={item.label}
                className="border-t-4 border-brand-500 bg-surface px-6 py-7"
              >
                <dt className="sr-only">{item.label}</dt>
                <dd>
                  <CountUp
                    value={item.value}
                    className="font-display text-[clamp(44px,6vw,68px)] leading-none font-extrabold text-ink tabular-nums"
                  />
                  <span className="ml-2 font-display text-[22px] font-bold text-brand-700 uppercase">
                    {item.unit}
                  </span>
                  <span className="mt-3 block text-sm text-muted">
                    {item.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section data-fx-parallax="">
        <div className="kt-breathe mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-[clamp(48px,8vw,96px)] lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
              <Image
                src={content.dealerCta.image}
                alt={content.dealerCta.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal>
            <p className="text-xs font-bold tracking-[0.16em] text-cta uppercase">
              {content.dealerCta.eyebrow}
            </p>
            <WordReveal
              text={content.dealerCta.heading}
              className="mt-3 text-[clamp(30px,5vw,52px)]"
            />
            <p className="mt-4 leading-relaxed text-ink-soft">
              {content.dealerCta.body}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {content.dealerCta.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-ink-soft"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cta"
                    aria-hidden="true"
                  />
                  <span className="text-sm">{point}</span>
                </li>
              ))}
            </ul>
            <Link
              href={content.dealerCta.cta.href}
              className="mt-8 inline-flex items-center rounded-full bg-cta px-8 py-4 font-display text-[20px] font-bold text-white uppercase transition-colors hover:bg-cta-dark"
            >
              {content.dealerCta.cta.label}
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
