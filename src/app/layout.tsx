import type { Metadata } from "next";
import { Be_Vietnam_Pro, Big_Shoulders } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { BASE_URL, GOOGLE_VERIFICATION_TOKENS } from "@/constants/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollFX } from "@/components/ScrollFX";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Condensed display face for headlines, nav and product names.
const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  // No fallback metrics published for this family — skip the size-adjust
  // fallback rather than warn on every build.
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Katsuma - Nhớt Xe Máy Chính Hãng Từ Nhà Máy Hóa Dầu Mekong",
    template: "%s | Katsuma",
  },
  description:
    "Katsuma phân phối nhớt xe máy Access và Tapec do Hóa Dầu Mekong sản xuất: nhớt xe số, nhớt xe tay ga, dầu hộp số. Tìm đúng loại nhớt cho xe và đăng ký làm đại lý.",
  keywords: [
    "nhớt Katsuma",
    "nhớt xe máy",
    "nhớt xe số",
    "nhớt xe tay ga",
    "dầu hộp số xe tay ga",
    "nhớt Access",
    "nhớt Tapec",
    "đại lý nhớt xe máy",
    "Hóa Dầu Mekong",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Katsuma",
    title: "Katsuma - Nhớt Xe Máy Chính Hãng Từ Nhà Máy Hóa Dầu Mekong",
    description:
      "Nhớt xe số, nhớt xe tay ga và dầu hộp số Katsuma - sản xuất tại nhà máy Hóa Dầu Mekong, phân phối qua hệ thống đại lý và tiệm sửa xe trên toàn quốc.",
  },
  verification: {
    google: GOOGLE_VERIFICATION_TOKENS,
  },
  icons: {
    icon: { url: "/icon.png", sizes: "32x32", type: "image/png" },
    apple: { url: "/icon.png", sizes: "32x32", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${bigShoulders.variable} h-full antialiased`}
      // The <head> script below adds a class here before React hydrates, which
      // is a server/client difference by design — not a bug to warn about.
      suppressHydrationWarning
    >
      <head>
        {/* Marks the document as animation-capable before first paint, so the
            "hidden until scrolled into view" states only apply when the scroll
            engine is actually there to reveal them again. It has to be a plain
            inline <script> in <head>: a <script> is not valid as a direct child
            of <html>, and next/script's beforeInteractive only runs once its
            own runtime boots, which is after the first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("fx-on")`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-white text-ink-soft">
        <ScrollFX />
        <SiteHeader />
        <div className="flex flex-1 flex-col pt-[70px] lg:pt-[86px]">
          {children}
        </div>
        <SiteFooter />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
