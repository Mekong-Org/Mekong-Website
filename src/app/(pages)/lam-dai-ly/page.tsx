import type { Metadata } from "next";
import Image from "next/image";
import content from "./content.json";
import { DealerForm } from "./_components/DealerForm";
import { Reveal } from "@/components/Reveal";
import { WordReveal } from "@/components/WordReveal";

export const metadata: Metadata = {
  title: content.title,
  description: content.metaDescription,
};

export default function DealerPage() {
  return (
    <main className="flex-1">
      <section className="relative flex min-h-[46vh] items-end overflow-hidden">
        <Image
          src={content.hero.image}
          alt={content.hero.imageAlt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <span
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-[1180px] px-5 py-12">
          <WordReveal
            as="h1"
            text={content.hero.heading}
            className="max-w-[18ch] text-[clamp(36px,8vw,84px)] leading-[1.15] text-white"
          />
          <p className="mt-4 max-w-[54ch] leading-relaxed text-white/85">
            {content.hero.subheading}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1180px] px-5 py-[clamp(48px,8vw,88px)]">
        <Reveal>
          <WordReveal
            text={content.benefits.heading}
            className="text-[clamp(28px,4.5vw,46px)]"
          />
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.benefits.items.map((item) => (
              <li
                key={item.title}
                className="border-t-4 border-brand-500 bg-surface px-6 py-7"
              >
                <h3 className="text-[22px]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="bg-ink text-white/75">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-[clamp(48px,8vw,88px)]">
          <Reveal>
            <WordReveal
              text={content.process.heading}
              className="text-[clamp(28px,4.5vw,46px)] text-white"
            />
            <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {content.process.steps.map((step, index) => (
                <li key={step.title}>
                  <span className="font-display text-[40px] leading-none font-extrabold text-brand-400 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-[22px] text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{step.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-[clamp(48px,8vw,88px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
          <Reveal>
            <WordReveal
              text={content.form.heading}
              className="text-[clamp(28px,4.5vw,46px)]"
            />
            <p className="mt-4 max-w-[56ch] leading-relaxed text-ink-soft">
              {content.form.body}
            </p>
            <div className="mt-8">
              <DealerForm note={content.form.note} />
            </div>
          </Reveal>
          <Reveal>
            <aside className="rounded-lg border border-line bg-white p-6">
              <h3 className="text-[22px]">Gọi trực tiếp</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Nhiều chủ tiệm thích gọi hơn điền form. Số này gặp bộ phận kinh
                doanh trong giờ hành chính.
              </p>
              <a
                href={content.contact.phoneHref}
                className="mt-5 inline-flex items-center rounded-full border-2 border-ink px-6 py-3 font-display text-[20px] font-bold text-ink uppercase transition-colors hover:bg-ink hover:text-white"
              >
                {content.contact.phone}
              </a>
              <p className="mt-5 text-sm text-muted">
                Hoặc email{" "}
                <a
                  href={`mailto:${content.contact.email}`}
                  className="font-semibold text-brand-700 hover:text-brand-500"
                >
                  {content.contact.email}
                </a>
              </p>
            </aside>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
