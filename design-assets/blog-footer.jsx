// Katsuma site footer, for the external content app that serves /blog.
//
// Same two rules as design-assets/blog-header.jsx, for the same reasons:
// layout is inline `style` rather than utility classes, and the fonts are
// loaded by the component itself. The previous version leaned on Tailwind
// classes that only happen to exist in that app's stylesheet — .grid, .mx-auto,
// .inline-flex and the rest are all there today, which is why the footer
// merely lost its fonts instead of collapsing the way the header did. That is
// luck, not a contract: the blog app regenerates its CSS from its own source,
// and any of those can stop being emitted without warning.
//
// Numbers below are measured off the live footer, not guessed. Keep them in
// step with src/components/SiteFooter.tsx: the two link lists, the contact
// block, SITE, and the 640/1024 column breakpoints.

function Footer() {
  const SITE = "https://mekong-website-vert.vercel.app";

  const PRODUCT_LINKS = [
    { label: "Nhớt xe số", href: SITE + "/san-pham#xe-so" },
    { label: "Nhớt xe tay ga", href: SITE + "/san-pham#xe-tay-ga" },
    { label: "Dầu hộp số xe tay ga", href: SITE + "/san-pham#hop-so-xe-ga" },
  ];

  const COMPANY_LINKS = [
    { label: "Về Katsuma", href: SITE + "/ve-katsuma" },
    { label: "Làm đại lý", href: SITE + "/lam-dai-ly" },
    { label: "Chọn nhớt cho xe", href: SITE + "/#chon-nhot" },
  ];

  const BODY =
    "'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif";
  const DISPLAY =
    "'Big Shoulders', 'Big Shoulders Display', 'Arial Narrow', sans-serif";

  const INK = "rgb(20, 20, 22)";
  const MUTED = "rgba(255, 255, 255, 0.7)";

  const heading = {
    margin: 0,
    fontFamily: DISPLAY,
    fontSize: "20px",
    fontWeight: 700,
    lineHeight: "24px",
    letterSpacing: "0.2px",
    textTransform: "uppercase",
    color: "#fff",
  };

  const list = {
    margin: "16px 0 0",
    padding: 0,
    listStyle: "none",
    fontSize: "14px",
    lineHeight: "20px",
  };

  const item = { marginBottom: "8px" };

  const renderLinks = (links) =>
    links.map((entry) => (
      <li key={entry.href} style={item}>
        <a className="ktf-link" href={entry.href} style={{ color: "inherit", textDecoration: "none" }}>
          {entry.label}
        </a>
      </li>
    ));

  return (
    <footer
      style={{
        display: "block",
        width: "100%",
        overflowX: "hidden",
        backgroundColor: INK,
        fontFamily: BODY,
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "24px",
        color: MUTED,
      }}
    >
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Big+Shoulders:wght@400..800&family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');

.ktf-link { transition: color 160ms ease; }
.ktf-link:hover, .ktf-link:focus-visible { color: #eec263; }

/* Same two steps as the site: one column, two from 640px, four from 1024px.
   A single 768px step leaves four columns crammed on a tablet. */
@media (min-width: 640px) {
  .ktf-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
}
@media (min-width: 1024px) {
  .ktf-grid { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
}
      `}</style>

      {/* Chequered band. Four diagonal gradients over white: the same trick the
          site uses, so the two edges line up pixel for pixel. */}
      <div
        aria-hidden="true"
        style={{
          display: "block",
          width: "100%",
          height: "12px",
          backgroundColor: "#fff",
          backgroundImage:
            "linear-gradient(45deg, " + INK + " 25%, transparent 25%)," +
            "linear-gradient(-45deg, " + INK + " 25%, transparent 25%)," +
            "linear-gradient(45deg, transparent 75%, " + INK + " 75%)," +
            "linear-gradient(-45deg, transparent 75%, " + INK + " 75%)",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
        }}
      />

      <div
        className="ktf-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: "40px",
          width: "100%",
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "56px 20px",
          boxSizing: "border-box",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 12px",
              borderRadius: "4px",
              backgroundColor: "#fff",
            }}
          >
            {/* Plain <img>: next/image is not available in this app. */}
            <img
              src={SITE + "/images/brand/mekong-logo.svg"}
              alt="Hóa Dầu Mekong"
              width="120"
              height="28"
              loading="lazy"
              decoding="async"
              style={{ display: "block", height: "24px", width: "auto" }}
            />
          </div>
          <p
            style={{
              margin: "16px 0 0",
              fontFamily: DISPLAY,
              fontSize: "28px",
              fontWeight: 800,
              lineHeight: "28px",
              letterSpacing: "1.12px",
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            Katsuma
          </p>
          <p style={{ margin: "12px 0 0", fontSize: "14px", lineHeight: "22.75px" }}>
            Phân phối nhớt xe máy do Công ty Cổ phần Hóa Dầu Mekong sản xuất, qua
            hệ thống đại lý và tiệm sửa xe trên toàn quốc.
          </p>
        </div>

        <div>
          <h2 style={heading}>Sản phẩm</h2>
          <ul style={list}>{renderLinks(PRODUCT_LINKS)}</ul>
        </div>

        <div>
          <h2 style={heading}>Công ty</h2>
          <ul style={list}>{renderLinks(COMPANY_LINKS)}</ul>
        </div>

        <div>
          <h2 style={heading}>Liên hệ</h2>
          {/* <address> is the right element for a contact block; the site sets
              it upright, since browsers italicise it by default. */}
          <address
            style={{
              margin: "16px 0 0",
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "22.75px",
            }}
          >
            <p style={{ margin: "0 0 8px" }}>
              Nhà máy: Ấp An Thạnh, Xã Bến Lức, Tỉnh Tây Ninh
            </p>
            <p style={{ margin: "0 0 8px" }}>
              Điện thoại:{" "}
              <a className="ktf-link" href="tel:02723635168" style={{ color: "inherit", textDecoration: "none" }}>
                02723 635 168
              </a>
            </p>
            <p style={{ margin: 0 }}>
              Email:{" "}
              <a className="ktf-link" href="mailto:info@mekongpetro.com" style={{ color: "inherit", textDecoration: "none" }}>
                info@mekongpetro.com
              </a>
            </p>
          </address>
        </div>
      </div>

      <div
        style={{
          display: "block",
          width: "100%",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <p
          style={{
            width: "100%",
            maxWidth: "1180px",
            margin: "0 auto",
            padding: "20px",
            boxSizing: "border-box",
            fontSize: "12px",
            lineHeight: "19.5px",
          }}
        >
          Katsuma là đơn vị phân phối sản phẩm của Công ty Cổ phần Hóa Dầu
          Mekong. Logo và hình ảnh sản phẩm đang dùng tạm của công ty mẹ, sẽ cập
          nhật khi bộ nhận diện Katsuma hoàn thiện.
        </p>
      </div>
    </footer>
  );
}
