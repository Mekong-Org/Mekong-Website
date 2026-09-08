import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import content from "../content.json";
import type { Category, Product, Tab } from "../_components/ProductTabs";
import { WordReveal } from "@/components/WordReveal";

type FullProduct = Product & {
  description: string;
  benefitsIntro: string;
  benefits: string[];
};

type Entry = {
  product: FullProduct;
  category: Category;
  tab: Tab;
};

// One flat index over the co-located catalogue — the detail route has no
// content.json of its own, it reads the parent's.
const ENTRIES: Entry[] = (content.tabs as Tab[]).flatMap((tab) =>
  tab.categories.flatMap((category) =>
    category.products.map((product) => ({
      product: product as FullProduct,
      category,
      tab,
    })),
  ),
);

function findEntry(slug: string) {
  return ENTRIES.find((entry) => entry.product.slug === slug);
}

export function generateStaticParams() {
  return ENTRIES.map((entry) => ({ slug: entry.product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = findEntry(slug);
  if (!entry) return {};

  const { product, tab } = entry;
  return {
    title: `${product.name} - ${tab.label}`,
    description: `${product.name} (${[product.viscosity, ...product.standards].join(", ")}) - ${product.summary}`,
  };
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line py-3 sm:flex-row sm:gap-6">
      <dt className="w-44 shrink-0 text-xs font-semibold tracking-[0.12em] text-muted uppercase">
        {label}
      </dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findEntry(slug);
  if (!entry) notFound();

  const { product, category, tab } = entry;
  const related = category.products.filter((item) => item.slug !== product.slug);

  return (
    <main className="flex-1 bg-surface">
      <section className="pdp-hero" data-fx-hero="">
        <Image
          src={tab.hero.banner}
          alt={tab.hero.bannerAlt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <span className="plp-hero__scrim" aria-hidden="true" />
        <div className="plp-hero__content">
          <p className="text-xs font-semibold tracking-[0.16em] text-white/80 uppercase">
            <Link href="/san-pham" className="hover:text-brand-300">
              Sản phẩm
            </Link>
            <span aria-hidden="true"> / </span>
            <Link
              href={`/san-pham#${tab.id}`}
              className="hover:text-brand-300"
            >
              {tab.label}
            </Link>
          </p>
          <WordReveal
            as="h1"
            text={product.name}
            className="plp-hero__title not-italic"
          />
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1080px] px-4 py-[clamp(32px,6vw,64px)] sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-14">
          <div
            className="pdp-stage flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-line bg-gradient-to-b from-white to-[#f3f3f3]"
            data-fx-parallax=""
          >
            <span className="pdp-stage__glow" aria-hidden="true" />
            <span
              className="absolute top-4 left-4 z-10 rounded-[10px_4px] px-3 py-1.5 text-[11px] font-bold tracking-[0.04em] text-white uppercase"
              style={{ backgroundColor: category.tagBgColor }}
            >
              {category.tagLabel}
            </span>
            <span className="pdp-stage__float">
              <span className="pdp-stage__lift">
                <Image
                  src={product.image}
                  alt={`Chai ${product.name}`}
                  width={720}
                  height={720}
                  className="h-[82%] w-auto max-w-[78%] object-contain drop-shadow-[0_16px_22px_rgba(0,0,0,0.2)]"
                  sizes="(max-width: 1024px) 90vw, 420px"
                  priority
                />
                {/* Same src, sizes and box as above so the gloss sweep lands on
                    the bottle and reuses the already-downloaded file. */}
                <Image
                  src={product.image}
                  alt=""
                  aria-hidden="true"
                  width={720}
                  height={720}
                  className="pdp-stage__shine h-[82%] w-auto max-w-[78%] object-contain"
                  sizes="(max-width: 1024px) 90vw, 420px"
                />
              </span>
            </span>
          </div>

          <div>
            <p className="text-sm leading-relaxed text-ink-soft">
              {product.summary}
            </p>

            <dl className="mt-6">
              <SpecRow label="Khuyên dùng" value={product.recommendedFor} />
              {product.standards.length > 0 && (
                <SpecRow
                  label="Tiêu chuẩn"
                  value={product.standards.join(" · ")}
                />
              )}
              <SpecRow label="Độ nhớt (SAE)" value={product.viscosity} />
              <SpecRow label="Bao bì" value={product.packaging} />
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/lam-dai-ly"
                className="inline-flex items-center rounded-full bg-cta px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-cta-dark"
              >
                Hỏi giá đại lý
              </Link>
              <a
                href="tel:02723635168"
                className="inline-flex items-center rounded-full border border-ink px-7 py-3 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-white"
              >
                Gọi 02723 635 168
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <section>
            <WordReveal
              text="Thông tin sản phẩm"
              className="text-[clamp(22px,3vw,30px)]"
            />
            <p className="mt-4 leading-relaxed text-ink-soft">
              {product.description}
            </p>
          </section>

          <section>
            <WordReveal
              text="Ưu điểm sản phẩm"
              className="text-[clamp(22px,3vw,30px)]"
            />
            <p className="mt-4 leading-relaxed text-ink-soft">
              {product.benefitsIntro}
            </p>
            <ul className="mt-4 space-y-3">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-ink-soft">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                    aria-hidden="true"
                  />
                  <span className="leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <WordReveal
              text={`Sản phẩm cùng nhóm ${category.title.toLowerCase()}`}
              className="text-[clamp(22px,3vw,30px)]"
            />
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <li
                  key={item.slug}
                  style={{ "--fx-i": index } as React.CSSProperties}
                >
                  <Link
                    href={`/san-pham/${item.slug}`}
                    className="fx-rise flex items-center gap-4 rounded-lg border border-line bg-white p-4 transition-colors hover:border-brand-400"
                    data-fx-rise=""
                  >
                    <Image
                      src={item.image}
                      alt={`Chai ${item.name}`}
                      width={120}
                      height={120}
                      className="h-20 w-20 shrink-0 object-contain"
                    />
                    <span>
                      <span className="block font-display text-[22px] leading-[1.15] font-bold text-ink uppercase">
                        {item.name}
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-brand-700">
                        {[item.viscosity, ...item.standards].join(" · ")}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
