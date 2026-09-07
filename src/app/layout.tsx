import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { BASE_URL, GOOGLE_VERIFICATION_TOKENS } from "@/constants/site";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "GCW - Đối Tác Phát Triển Lãnh Đạo & Hiệu Suất Tổ Chức",
    template: "%s | GCW",
  },
  description:
    "GCW (GCW JSC) là đối tác phát triển lãnh đạo và hiệu suất tổ chức, đồng hành thực thi cùng doanh nghiệp Việt Nam: phát triển lãnh đạo, xây dựng văn hoá tin cậy và tạo kết quả đột phá.",
  keywords: [
    "GCW",
    "GCW JSC",
    "phát triển lãnh đạo",
    "đào tạo lãnh đạo doanh nghiệp",
    "xây dựng văn hoá tin cậy",
    "thực thi chiến lược 4DX",
    "coaching lãnh đạo",
    "hiệu suất tổ chức",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "GCW",
    title: "GCW - Đối Tác Phát Triển Lãnh Đạo & Hiệu Suất Tổ Chức",
    description:
      "GCW mang đến lợi thế con người cho chiến lược của bạn — đồng hành thực thi phát triển lãnh đạo cùng doanh nghiệp Việt Nam, không chỉ tư vấn lý thuyết.",
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
      className={`${beVietnamPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink-soft">
        {children}
        <Script id="rocketchat-livechat" strategy="afterInteractive">
          {`(function(w, d, s, u) {
    w.RocketChat = function(c) { w.RocketChat._.push(c) }; w.RocketChat._ = []; w.RocketChat.url = u;
    var h = d.getElementsByTagName(s)[0], j = d.createElement(s);
    j.async = true; j.src = 'https://livechat.jarvis.cx/livechat/rocketchat-livechat.min.js?_=201903270000';
    h.parentNode.insertBefore(j, h);
    w.ticketplus = w.ticketplus || {};
    w.ticketplus.tenantid = 'ca965aac-e908-408e-bc8b-15c93eb31233';
    w.RocketChat(function() { this.setLanguage('vi-VN') });
  })(window, document, 'script', 'https://livechat.jarvis.cx/livechat');`}
        </Script>
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
