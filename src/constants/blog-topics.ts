/**
 * Topics of the external blog, listed in the header menu and the footer.
 *
 * Written out rather than fetched: api/blog/topics needs AEO_SECRET_KEY, which
 * would turn the header into a server component or add a loading state, and
 * topics change a few times a year. Paths go through /blog, which middleware.ts
 * proxies to the content app.
 *
 * `label` is what the menus show and need not be the topic's own name — the one
 * topic that exists is titled as a whole question, which reads fine at the top
 * of a page and far too long in a menu. `href` must be its real slug.
 *
 * Four entries is the target, one per product line, so a reader who came for an
 * article lands on the matching oil. Below three the header menu is not worth
 * opening: drop the NavMenu branch in SiteHeader and "Bài viết" goes back to
 * being a plain link.
 *
 * design-assets/blog-header.jsx and blog-footer.jsx carry this same list for
 * the content app's own copies of the bar and footer, which cannot import from
 * here. Update all three together.
 */
export const BLOG_TOPICS = [
  {
    label: "Nhớt xe số & chuẩn JASO",
    href: "/blog/topic/tieu-chuan-jaso-ma2-cho-xe-so-la-gi-va-tai-sao-quan-trong",
  },
  { label: "Tất cả bài viết", href: "/blog/topic" },
];
