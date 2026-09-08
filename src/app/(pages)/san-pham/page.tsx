import type { Metadata } from "next";
import content from "./content.json";
import { ProductTabs, type Tab } from "./_components/ProductTabs";

export const metadata: Metadata = {
  title: content.title,
  description: content.metaDescription,
};

export default function ProductsPage() {
  return (
    <main className="flex-1">
      <ProductTabs tabs={content.tabs as Tab[]} />
    </main>
  );
}
