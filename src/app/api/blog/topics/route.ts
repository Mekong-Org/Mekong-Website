import { NextResponse } from "next/server";
import { AEO_SECRET_KEY, CONTENT_BRAND_SLUG } from "@/constants/site";

// Topics + their latest articles for the "Tài nguyên" (Resources) mega-menu
// come from the external content API. We fetch them server-side here because
// the API does not send CORS headers, so the browser cannot call it directly.
const API_ORIGIN = "https://api.aeo.how";

// Refresh the topic list hourly — it changes rarely.
export const revalidate = 3600;

// Topics to hide from the mega-menu entirely.
const HIDDEN_TOPICS = new Set([
  "So sánh chi phí thuê CEO vận hành ngoài so với nội bộ",
]);

type ApiArticle = {
  title: string;
  excerpt?: string;
  slug: string;
};

type ApiTopic = {
  topicId: string;
  topicName: string;
  topicAlias?: string;
  articles?: ApiArticle[];
};

export async function GET() {
  try {
    const res = await fetch(
      `${API_ORIGIN}/api/public/${CONTENT_BRAND_SLUG}/topics/latest-articles?perTopic=6`,
      {
        headers: { "x-aeo-secret-key": AEO_SECRET_KEY },
        next: { revalidate },
      },
    );
    if (!res.ok) {
      return NextResponse.json([]);
    }

    const topics = (await res.json()) as ApiTopic[];

    // Shape into the mega-menu's group structure: each topic is a category on
    // the left, its articles are the cards on the right. The hrefs match the
    // external app's routes, which the middleware proxies under /blog.
    const groups = (Array.isArray(topics) ? topics : [])
      .filter((t) => t?.topicName && !HIDDEN_TOPICS.has(t.topicName))
      .map((t) => ({
        title: t.topicName,
        href: `/blog/articles?topic=${encodeURIComponent(t.topicName)}`,
        items: (t.articles ?? [])
          .filter((a) => a?.slug)
          .map((a) => ({
            title: a.title,
            desc: a.excerpt,
            href: `/blog/${a.slug}`,
          })),
      }));

    return NextResponse.json(groups);
  } catch {
    return NextResponse.json([]);
  }
}
