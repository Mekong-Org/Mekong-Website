import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import content from "./content.json";
import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/Reveal";
import { WordReveal } from "@/components/WordReveal";

export const metadata: Metadata = {
  title: content.title,
  description: content.metaDescription,
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="bg-ink">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-[clamp(56px,9vw,110px)]">
          <WordReveal
            as="h1"
            text={content.hero.heading}
            className="max-w-[16ch] text-[clamp(40px,9vw,96px)] leading-[1.15] text-white"
          />
          <p className="mt-5 max-w-[58ch] leading-relaxed text-white/80">
            {content.hero.subheading}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1180px] px-5 py-[clamp(48px,8vw,88px)]">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <WordReveal
                text={content.story.heading}
                className="text-[clamp(28px,4.5vw,46px)]"
              />
              {content.story.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-4 leading-relaxed text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="relative aspect-[16/7] overflow-hidden rounded-lg border border-line">
              <Image
                src={content.story.image}
                alt={content.story.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <dl className="mt-12 grid gap-6 sm:grid-cols-3">
            {content.stats.map((item) => (
              <div
                key={item.label}
                className="border-t-4 border-brand-500 bg-surface px-6 py-7"
              >
                <dt className="sr-only">{item.label}</dt>
                <dd>
                  <CountUp
                    value={item.value}
                    className="font-display text-[clamp(40px,5.5vw,62px)] leading-none font-extrabold text-ink tabular-nums"
                  />
                  <span className="ml-2 font-display text-[20px] font-bold text-brand-700 uppercase">
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

      <section className="bg-surface">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-[clamp(48px,8vw,88px)]">
          <Reveal>
            <WordReveal
              text={content.model.heading}
              className="text-[clamp(28px,4.5vw,46px)]"
            />
            <ol className="mt-8 grid gap-6 md:grid-cols-3">
              {content.model.steps.map((step, index) => (
                <li key={step.title} className="bg-white p-6">
                  <span className="font-display text-[38px] leading-none font-extrabold text-brand-400 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-[22px]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1180px] px-5 py-[clamp(48px,8vw,88px)]">
        <Reveal>
          <WordReveal
            text={content.commitments.heading}
            className="text-[clamp(28px,4.5vw,46px)]"
          />
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {content.commitments.items.map((item) => (
              <li key={item.title} className="border-l-4 border-cta pl-5">
                <h3 className="text-[22px]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/san-pham"
              className="inline-flex items-center rounded-full bg-brand-500 px-8 py-4 font-display text-[20px] font-bold text-ink uppercase transition-colors hover:bg-brand-400"
            >
              Xem danh mục sản phẩm
            </Link>
            <Link
              href="/lam-dai-ly"
              className="inline-flex items-center rounded-full border-2 border-ink px-8 py-4 font-display text-[20px] font-bold text-ink uppercase transition-colors hover:bg-ink hover:text-white"
            >
              Đăng ký làm đại lý
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
