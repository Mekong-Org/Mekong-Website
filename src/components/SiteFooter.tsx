import Image from "next/image";
import Link from "next/link";
import { BLOG_TOPICS } from "@/constants/blog-topics";

const PRODUCT_LINKS = [
  { label: "Nhớt xe số", href: "/san-pham#xe-so" },
  { label: "Nhớt xe tay ga", href: "/san-pham#xe-tay-ga" },
  { label: "Dầu hộp số xe tay ga", href: "/san-pham#hop-so-xe-ga" },
];

const COMPANY_LINKS = [
  { label: "Về Katsuma", href: "/ve-katsuma" },
  { label: "Làm đại lý", href: "/lam-dai-ly" },
  { label: "Chọn nhớt cho xe", href: "/#chon-nhot" },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="checker-band h-3" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-flex items-center gap-3 rounded-sm bg-white px-3 py-2">
            <Image
              src="/images/brand/mekong-logo.svg"
              alt="Hóa Dầu Mekong"
              width={120}
              height={28}
              className="h-6 w-auto"
            />
          </div>
          <p className="mt-4 font-display text-[28px] leading-none font-extrabold tracking-[0.04em] text-white uppercase">
            Katsuma
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Phân phối nhớt xe máy do Công ty Cổ phần Hóa Dầu Mekong sản xuất,
            qua hệ thống đại lý và tiệm sửa xe trên toàn quốc.
          </p>
        </div>

        <div>
          <h2 className="text-[20px] text-white">Sản phẩm</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {PRODUCT_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brand-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[20px] text-white">Công ty</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {COMPANY_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brand-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Second group in this column rather than a fifth column: four
              columns already fill the row, and a fifth would squeeze the
              contact address and the brand paragraph onto twice the lines.
              This column is the shortest, so the topics land in space the
              footer was leaving empty. */}
          <h2 className="mt-8 text-[20px] text-white">Bài viết</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {BLOG_TOPICS.map((topic) => (
              <li key={topic.href}>
                <Link href={topic.href} className="hover:text-brand-300">
                  {topic.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[20px] text-white">Liên hệ</h2>
          <address className="mt-4 space-y-2 text-sm not-italic leading-relaxed">
            <p>
              Nhà máy: Ấp An Thạnh, Xã Bến Lức, Tỉnh Tây Ninh
            </p>
            <p>
              Điện thoại:{" "}
              <a href="tel:02723635168" className="hover:text-brand-300">
                02723 635 168
              </a>
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:info@mekongpetro.com"
                className="hover:text-brand-300"
              >
                info@mekongpetro.com
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-[1180px] px-5 py-5 text-xs leading-relaxed">
          Katsuma là đơn vị phân phối sản phẩm của Công ty Cổ phần Hóa Dầu
          Mekong. Logo và hình ảnh sản phẩm đang dùng tạm của công ty mẹ, sẽ cập
          nhật khi bộ nhận diện Katsuma hoàn thiện.
        </p>
      </div>
    </footer>
  );
}
