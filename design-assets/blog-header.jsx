// Katsuma site header, for the external content app that serves /blog.
//
// Written for that app's editor, which requires a single self-contained
// component: no imports, no exports, no next/* and no external packages.
//
// Two rules follow from where this runs, and both are why the previous version
// broke on the live blog:
//
//   1. Layout is inline `style`, never utility classes. The blog app builds its
//      own Tailwind from its own source; this component arrives as data, so its
//      classes are never generated. Its stylesheet has no `.justify-evenly` and
//      no `.no-underline` at all — the nav lost `display:flex` and collapsed
//      into one run of text. The editor preview looks right because Tailwind is
//      loaded there, which is what makes the fault easy to miss.
//
//   2. The fonts are loaded here. The main site gets Big Shoulders through
//      next/font under a generated family name that exists only in that build,
//      so naming it here matched nothing and fell through to Arial Narrow.
//
// The <style> block below carries only the font import and the niceties —
// hover, focus, and the narrow-screen layout. If a sanitiser ever strips it the
// header still lays out correctly on the inline styles alone; it just loses the
// brand face.
//
// Three things to keep in step with src/components/SiteHeader.tsx in the main
// site repo: the six nav entries, SITE (once a real domain replaces the
// vercel.app one), and the wordmark image URL.

function Header() {
  const SITE = "https://mekong-website-vert.vercel.app";

  const NAV_LEFT = [
    { label: "Trang chủ", href: SITE + "/" },
    { label: "Sản phẩm", href: SITE + "/san-pham" },
    { label: "Chọn nhớt", href: SITE + "/#chon-nhot" },
  ];

  // The blog is the only page this header is ever served on, so the active item
  // is fixed here rather than derived from the URL.
  const NAV_RIGHT = [
    { label: "Bài viết", href: SITE + "/blog", current: true },
    { label: "Về Katsuma", href: SITE + "/ve-katsuma" },
    { label: "Làm đại lý", href: SITE + "/lam-dai-ly" },
  ];

  const DISPLAY =
    "'Big Shoulders', 'Big Shoulders Display', 'Arial Narrow', sans-serif";

  const link = {
    position: "relative",
    fontSize: "20px",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    textDecoration: "none",
    whiteSpace: "nowrap",
    color: "rgba(20, 20, 22, 0.65)",
  };

  const linkCurrent = { ...link, color: "#141416" };

  const navSide = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: "16px",
    minWidth: 0,
  };

  const edge = (background) => ({
    width: "10px",
    flex: "0 0 10px",
    background,
  });

  const renderLink = (item) => (
    <a
      key={item.label}
      href={item.href}
      className="ktm-link"
      style={item.current ? linkCurrent : link}
      aria-current={item.current ? "page" : undefined}
    >
      {item.label}
      {item.current ? (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            bottom: "-8px",
            width: "100%",
            height: "3px",
            borderRadius: "999px",
            background: "#141416",
          }}
        />
      ) : null}
    </a>
  );

  return (
    <header
      style={{
        position: "relative",
        width: "100%",
        boxSizing: "border-box",
        borderTop: "8px solid #fff",
        borderBottom: "8px solid #fff",
        background: "linear-gradient(to bottom, #d99522, #eec263)",
        fontFamily: DISPLAY,
      }}
    >
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Big+Shoulders:wght@400..800&family=Be+Vietnam+Pro:wght@400;600;700&display=swap');

.ktm-link { transition: color 160ms ease; }
.ktm-link:hover, .ktm-link:focus-visible { color: #141416; }

/* Under ~900px the three columns squeeze the wordmark to nothing, so the bar
   stacks into three centred rows instead: links, wordmark, links. */
@media (max-width: 900px) {
  .ktm-bar { display: block !important; height: auto !important; padding: 14px 16px !important; }
  .ktm-brand { justify-content: center; margin: 0 auto 12px; width: max-content; }
  .ktm-nav { justify-content: center !important; flex-wrap: wrap; gap: 8px 20px !important; }
}
      `}</style>

      <div
        className="ktm-bar"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "stretch",
          width: "100%",
          maxWidth: "1440px",
          height: "70px",
          margin: "0 auto",
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        <nav
          className="ktm-nav"
          aria-label="Điều hướng chính"
          style={navSide}
        >
          {NAV_LEFT.map(renderLink)}
        </nav>

        <a
          className="ktm-brand"
          href={SITE + "/"}
          aria-label="Katsuma — về trang chủ"
          style={{
            display: "flex",
            alignItems: "stretch",
            flex: "0 0 auto",
            textDecoration: "none",
          }}
        >
          <span style={edge("#f4d99b")} />
          <span style={edge("#faedcf")} />
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "0 28px",
              background: "#fff",
            }}
          >
            {/* Plain <img>: next/image is not available in this app. */}
            <img
              src={SITE + "/images/brand/mekong-logo.svg"}
              alt="Hóa Dầu Mekong"
              style={{ display: "block", height: "26px", width: "auto" }}
            />
            <span
              aria-hidden="true"
              style={{ width: "1px", height: "28px", background: "#e4e4e4" }}
            />
            <span
              style={{
                fontSize: "30px",
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                color: "#141416",
              }}
            >
              Katsuma
            </span>
          </span>
          <span style={edge("#faedcf")} />
          <span style={edge("#f4d99b")} />
        </a>

        <nav className="ktm-nav" aria-label="Liên kết phụ" style={navSide}>
          {NAV_RIGHT.map(renderLink)}
        </nav>
      </div>
    </header>
  );
}
