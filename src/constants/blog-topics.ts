/**
 * Topics of the external blog, listed in the header menu and the footer.
 *
 * Written out rather than fetched: api/blog/topics needs AEO_SECRET_KEY, which
 * would turn the header into a server component or add a loading state, and
 * topics change a few times a year. Paths go through /blog, which middleware.ts
 * proxies to the content app.
 *
 * `label` is what the menus show and need not be the topic's own name — every
 * topic over there is titled as a whole question, which reads fine at the top
 * of a page and far too long in a menu. Keep the labels short and, above all,
 * distinct in their first word or two: a menu is scanned down the left edge, so
 * two entries opening on the same words are the ones a reader has to stop and
 * read in full. `href` must be the topic's real slug.
 *
 * One entry per product line is the aim, so a reader who came for an article
 * lands on the matching oil. Below three the header menu is not worth opening:
 * drop the NavMenu branch in SiteHeader and "Bài viết" goes back to being a
 * plain link. Two of the blog's topics are deliberately left out — "nhớt cho xe
 * máy cũ" and "bảo dưỡng đội xe cho công ty logistics" — as neither belongs to
 * a product line; add them if that changes.
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
  {
    label: "Xe tay ga bị nóng máy",
    href: "/blog/topic/xe-tay-ga-bi-nong-may-khi-chay-duong-dai-phai-lam-sao",
  },
  {
    label: "Nhớt nội hay nhập cho xe ga",
    href: "/blog/topic/so-sanh-dau-nhot-san-xuat-trong-nuoc-va-nhap-khau-cho-xe-tay-ga",
  },
  { label: "Tất cả bài viết", href: "/blog/topic" },
];
