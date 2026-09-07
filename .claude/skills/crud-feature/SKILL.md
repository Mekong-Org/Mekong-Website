---
name: crud-feature
description: Scaffold CRUD (thêm/sửa/xóa/xem) cho một loại nội dung cụ thể trên site tĩnh này (ví dụ Events, Team members, Testimonials) — vì đây là Next.js static site deploy trên Vercel, không có database thật, nên phải "vibe code" CRUD bằng file JSON + API routes + trang admin. Dùng khi người dùng yêu cầu "thêm CRUD cho X", "cho phép thêm/xóa/sửa Y", "tạo trang quản lý Z", hoặc tương tự.
---

# CRUD Feature (Vibe-coded, no real backend)

Site này không có database — nó là Next.js App Router deploy trên Vercel (build production chạy trên serverless functions, **filesystem là read-only ở production** và không persist giữa các request/deploy). Vì vậy CRUD ở đây phải được "giả lập" bằng một trong vài chiến lược lưu trữ, và **chiến lược nào cũng có đánh đổi mà chỉ người dùng mới quyết định được** — không tự chọn thay họ.

## Bước 1 — Xác định entity và field

Nếu người dùng chưa nói rõ, hỏi bằng `AskUserQuestion`:
- Tên entity (ví dụ `events`, `team-members`) và các field của nó (title, date, description, image, v.v.)
- Có cần trang public để hiển thị danh sách/chi tiết không, hay chỉ cần trang admin quản lý dữ liệu dùng ở nơi khác trong site

## Bước 2 — Xác định chiến lược lưu trữ (BẮT BUỘC hỏi nếu chưa rõ)

Đây là quyết định kiến trúc, không được tự ý chọn. Dùng `AskUserQuestion` với các lựa chọn kiểu:

- **A. Chỉ sửa cục bộ (dev-only), rồi commit + deploy.** API route đọc/ghi trực tiếp file JSON trên đĩa bằng `fs`. Chỉ hoạt động khi chạy `pnpm dev`; ở production route ghi sẽ lỗi hoặc không persist vì Vercel read-only. Đơn giản nhất, phù hợp khi người biên tập nội dung chính là dev/người có quyền commit.
- **B. Ghi qua GitHub Contents API (hoạt động cả ở production).** API route dùng GitHub token để commit thay đổi thẳng vào file JSON trong repo — mỗi lần "Save" trên trang admin tạo 1 commit, Vercel tự deploy lại. Cần thêm secret (GitHub PAT) vào env, và có độ trễ vài chục giây/phút để thấy thay đổi (chờ deploy). Phù hợp khi cần người không phải dev (client) tự sửa nội dung qua UI.
- **C. Dùng dịch vụ ngoài (DB/headless CMS thật, ví dụ Supabase, Sanity).** Ngoài phạm vi "vibe code nhanh" — chỉ đề xuất nếu người dùng nói cần multi-user, nhiều bản ghi, hoặc auth thật.

Nếu người dùng chỉ nói chung chung "làm CRUD cho events", mặc định đề xuất **A** (rẻ, nhanh, đúng tinh thần "vibe code"), nhưng vẫn phải xác nhận lại trước khi build vì nó có giới hạn production quan trọng cần họ hiểu trước.

## Bước 3 — Scaffold dữ liệu

**Mặc định BẮT BUỘC: tái sử dụng quy ước co-location `content.json` của `AGENTS.md`, không tạo thư mục JSON dùng chung mới.** Đây là điểm hay bị làm sai nhất — xem "Rào chắn" bên dưới trước khi code.

- Nếu entity ứng với đúng 1 trang public (có sẵn hoặc sẽ tạo) dưới `src/app/(pages)/...`: lưu mảng item **ngay trong `content.json` của route đó**, dưới một key riêng (ví dụ `"items"`, hoặc tên mô tả hơn nếu trang có nhiều danh sách, như `"tools"` + `"items"`). Các field tĩnh khác của trang (`title`, `metaDescription`, `heading`, `cta`, ...) giữ nguyên trong cùng file. Mỗi item có `id` (string, dùng `crypto.randomUUID()` hoặc slug hoá từ field chính khi tạo mới) cộng các field đã thống nhất ở Bước 1.
- Trang public đọc dữ liệu bằng cách import thẳng `content.json` như bình thường (`content.items`, `content.tools`, ...) — không cần fetch qua API, không import từ file rời.
- Chỉ khi entity **không thuộc về đúng 1 route** (dữ liệu chỉ dùng nội bộ ở admin, hoặc bị nhiều route không liên quan cùng tham chiếu) mới tạo file riêng — và đặt ở `src/data/<entity>.json` (thư mục top-level ngang hàng `src/components/`, `src/constants/`, **tuyệt đối không phải `src/app/_data/` hay bất kỳ thư mục nào bên trong `src/app/`**). Xác nhận lại lựa chọn này với người dùng nếu không chắc entity có "trang chủ" hay không.

## Bước 4 — API routes (CRUD backend)

Tạo dưới `src/app/api/<entity>/`:
- `route.ts` — `GET` trả danh sách, `POST` tạo mới (validate field bắt buộc, gán `id`).
- `[id]/route.ts` — `PATCH` sửa theo id, `DELETE` xóa theo id.

Với chiến lược A:
- Trường hợp co-locate trong `content.json` (mặc định): route đọc **toàn bộ object** của `src/app/(pages)/<route>/content.json` bằng `fs/promises`, lấy mảng ở key tương ứng (ví dụ `data.items`), thêm/sửa/xóa phần tử trong mảng đó, rồi ghi lại **toàn bộ object** (không chỉ mảng) để không làm mất các field tĩnh khác của trang.
- Trường hợp fallback `src/data/<entity>.json`: đọc/ghi trực tiếp mảng JSON tại `path.join(process.cwd(), "src/data/<entity>.json")`.
- Ghi log rõ trong comment ngắn rằng route này chỉ dùng được khi chạy local/dev (filesystem read-only ở production).

Với chiến lược B: dùng GitHub REST API (`PUT /repos/{owner}/{repo}/contents/{path}`) để commit nội dung JSON mới, cần base64-encode nội dung và truyền `sha` hiện tại của file (lấy qua `GET` trước). Token đọc từ biến môi trường (ví dụ `GITHUB_ADMIN_TOKEN`), không hardcode.

Luôn validate input tối thiểu (field bắt buộc không rỗng) trước khi ghi — API route là boundary hệ thống thật sự duy nhất ở đây.

## Bước 5 — Trang admin

Tạo `src/app/(pages)/admin/<entity>/page.tsx` (client component): danh sách hiện có + form thêm/sửa + nút xóa, gọi các API route ở Bước 4 bằng `fetch`. Theo đúng conventions ảnh trong `AGENTS.md` nếu entity có field ảnh (dùng `next/image`, không `<img>`).

**Cảnh báo bắt buộc phải nói với người dùng:** trang `/admin/...` này chưa có auth — bất kỳ ai biết URL đều sửa/xóa được dữ liệu. Trước khi họ deploy thật, đề xuất chặn tối thiểu bằng 1 trong: middleware kiểm tra header/cookie password đơn giản (biến env), Vercel password protection (nếu có gói phù hợp), hoặc không deploy trang admin lên production (chỉ dùng ở dev — hợp với chiến lược A).

## Bước 6 — Kiểm tra

- Chạy `pnpm run check:content` — khi entity co-locate trong `content.json`, script này vẫn quét file đó bình thường (chỉ kiểm tra `title`/`metaDescription` ở top level, mảng item lồng bên trong không ảnh hưởng), nên phải pass.
- Chạy `pnpm lint`.
- Nếu có trang public đọc dữ liệu, dùng skill `run-project` để chạy dev server và test thật luồng thêm/sửa/xóa trên trình duyệt trước khi báo hoàn thành.

## Rào chắn

- Không tự chọn chiến lược lưu trữ (Bước 2) khi chưa hỏi — production read-only filesystem khiến lựa chọn sai gây ra tính năng "trông như chạy" ở dev nhưng vỡ hoàn toàn khi lên Vercel.
- Không claim tính năng "hoàn thành" nếu chưa cảnh báo về thiếu auth ở trang admin.
- **TUYỆT ĐỐI không tạo `src/app/_data/` hay bất kỳ thư mục JSON dùng chung nào khác bên trong `src/app/`** (kể cả tên khác `_data`) để né quy ước co-location. Đây là lỗi đã xảy ra thật trong repo này (13 file JSON tách khỏi `content.json`, phải dọn lại toàn bộ) — nguyên nhân là bỏ qua quy ước "## Page content structure" của `AGENTS.md`. Trước khi tạo file JSON mới cho entity, luôn tự hỏi: "entity này có đúng 1 trang public sở hữu nó không?" — nếu có, field phải nằm trong `content.json` của trang đó, không nơi nào khác.
- Nếu bắt buộc phải dùng file rời (entity không thuộc route nào), chỉ đặt ở `src/data/<entity>.json` (ngoài `src/app/`) — không đặt trùng tên với entity đã tồn tại, kiểm tra `src/data/` trước khi tạo.
