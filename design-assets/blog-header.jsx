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
    { label: "Bài viết", href: SITE + "/blog", current: true, topics: true },
    { label: "Về Katsuma", href: SITE + "/ve-katsuma" },
    { label: "Làm đại lý", href: SITE + "/lam-dai-ly" },
  ];

  // Topics in the "Bài viết" menu. Hard-coded on purpose: the topics endpoint
  // needs a secret key and sends no CORS headers, so the browser cannot read it
  // from here, and topics change far too rarely to be worth a proxy.
  //
  // `label` is what the menu shows; `href` must be the topic's real slug. The
  // one topic that exists is named as a whole question — fine as a page title,
  // far too long for a menu — hence the short label.
  //
  // Add a row per topic as the content team creates them. Aim for four, named
  // after the product lines (Nhớt xe số / Nhớt xe tay ga / Dầu hộp số xe tay ga
  // / Chọn nhớt & bảo dưỡng) so a reader lands on the matching product. Below
  // three rows the menu is not worth opening: drop `topics: true` above and
  // "Bài viết" goes back to being a plain link.
  const BLOG_TOPICS = [
    {
      label: "Nhớt xe số & chuẩn JASO",
      href:
        SITE +
        "/blog/topic/tieu-chuan-jaso-ma2-cho-xe-so-la-gi-va-tai-sao-quan-trong",
    },
    { label: "Tất cả bài viết", href: SITE + "/blog/topic" },
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

  // Open state for the topics menu. The label itself stays an ordinary link to
  // /blog and the caret beside it is a separate button, so a touch device never
  // has to guess whether a tap means "open" or "go" — there is no hover there
  // to tell them apart.
  const [openTopics, setOpenTopics] = React.useState(false);
  const menuRef = React.useRef(null);

  // Whether hovering means anything here. A touch browser still synthesises
  // mouseenter just before the click of a tap, so leaving the hover handlers
  // live on a phone opens the menu and the tap immediately toggles it shut —
  // the caret looks dead. Ask the device instead of guessing from width: a
  // laptop with a touchscreen has both.
  const [canHover, setCanHover] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  React.useEffect(() => {
    if (!openTopics) return;
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenTopics(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpenTopics(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openTopics]);

  const renderLink = (item) =>
    item.topics ? (
      <span
        key={item.label}
        ref={menuRef}
        className="ktm-menu"
        style={{ position: "relative", display: "flex", alignItems: "center", gap: "6px" }}
        onMouseEnter={canHover ? () => setOpenTopics(true) : undefined}
        onMouseLeave={canHover ? () => setOpenTopics(false) : undefined}
      >
        {renderPlainLink(item)}
        <button
          type="button"
          aria-label="Mở danh mục bài viết"
          aria-expanded={openTopics}
          // Where hover already opens the menu, the caret only ever opens it:
          // a toggle there would close what the pointer is still hovering.
          // Escape and clicking away are what close it. Without hover it is a
          // plain toggle, which is the only control a phone has.
          onClick={() => setOpenTopics((v) => (canHover ? true : !v))}
          style={{
            display: "flex",
            alignItems: "center",
            padding: 0,
            border: 0,
            background: "none",
            cursor: "pointer",
            color: "#141416",
          }}
        >
          {/* Hand-drawn caret: icon packages are not available in this app. */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            style={{
              transition: "transform 160ms ease",
              transform: openTopics ? "rotate(180deg)" : "none",
            }}
          >
            <path
              d="M2.5 4.5 6 8l3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <span
          role="menu"
          hidden={!openTopics}
          style={{
            position: "absolute",
            top: "calc(100% + 14px)",
            left: 0,
            zIndex: 30,
            minWidth: "240px",
            padding: "8px",
            borderRadius: "8px",
            background: "#fff",
            boxShadow: "0 12px 32px rgba(20, 20, 22, 0.22)",
          }}
        >
          {BLOG_TOPICS.map((topic) => (
            <a
              key={topic.href}
              role="menuitem"
              className="ktm-topic"
              href={topic.href}
              style={{
                display: "block",
                padding: "9px 12px",
                borderRadius: "5px",
                fontFamily: "'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "20px",
                letterSpacing: 0,
                textTransform: "none",
                textDecoration: "none",
                color: "#141416",
              }}
            >
              {topic.label}
            </a>
          ))}
        </span>
      </span>
    ) : (
      renderPlainLink(item)
    );

  const renderPlainLink = (item) => (
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

.ktm-topic { transition: background-color 140ms ease; }
.ktm-topic:hover, .ktm-topic:focus-visible { background-color: #f6efe0; }

/* The panel hangs off the left edge of "Bài viết", which is the last third of
   the bar — near the right edge it would run off screen, so flip it. */
@media (min-width: 901px) {
  .ktm-menu [role="menu"] { left: auto !important; right: 0 !important; }
}

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
