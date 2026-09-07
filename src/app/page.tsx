import type { Metadata } from "next";
import content from "./content.json";

export const metadata: Metadata = {
  title: content.title,
  description: content.metaDescription,
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-600">
          {content.eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-serif-hero text-ink sm:text-5xl">
          {content.heading}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted">
          {content.subheading}
        </p>
      </div>
    </main>
  );
}
