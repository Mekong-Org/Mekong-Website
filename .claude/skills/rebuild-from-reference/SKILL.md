---
name: rebuild-from-reference
description: Clone toàn bộ website tham chiếu cho một thương hiệu demo mới — dựng lại mọi trang, mọi route, điều hướng, bố cục, thứ tự các phần, cấu trúc ưu đãi, chiến lược chuyển đổi VÀ phong cách hình ảnh (bảng màu/theme, cặp font chữ, độ bo góc, mật độ khoảng cách, tông giọng thiết kế) của trang tham chiếu, tái sử dụng gần nguyên văn nội dung (text, hình ảnh, toàn bộ entry của các trang danh sách) — chỉ thay thế bản sắc thương hiệu (tên thương hiệu, wordmark trên logo, thông tin liên hệ/pháp lý) bằng thương hiệu demo do người dùng cung cấp. Dùng khi người dùng yêu cầu "clone toàn bộ site X", "rebuild this site", "clone the layout of X", "build a demo based on this landing page", hoặc tương tự.
---

# Clone Toàn Bộ Website Tham Chiếu (Rebuild From Reference)

Clone lại **toàn bộ** một website tham chiếu — mọi loại trang (trang chủ, trang con, trang danh mục, trang chi tiết...), toàn bộ điều hướng, luồng bố cục, thứ tự các phần, cấu trúc ưu đãi/CTA, chiến lược chuyển đổi, **toàn bộ nội dung** (text, hình ảnh, và toàn bộ entry thật của các trang danh sách/phân trang — không chỉ 1 trang mẫu), **và theme thị giác** (bảng màu, cặp font chữ, độ bo góc, mật độ khoảng cách, tông giọng thiết kế tổng thể) — cho một thương hiệu demo mới trong dự án này.

**Ranh giới duy nhất còn lại: bản sắc thương hiệu.** Tên thương hiệu, wordmark hiển thị trên logo, và thông tin liên hệ/pháp lý (địa chỉ, số điện thoại, tên pháp nhân, link mạng xã hội) của trang tham chiếu phải được thay bằng thông tin thương hiệu demo do người dùng cung cấp — mọi thứ khác (text, ảnh, cấu trúc, toàn bộ entry) được tái sử dụng gần như nguyên văn.

## Các bước thực hiện

1. **Lấy URL trang tham chiếu.** Nếu người dùng chưa cung cấp, hãy hỏi bằng `AskUserQuestion` trước khi làm bất cứ điều gì khác — skill này không thể tiếp tục nếu thiếu URL.

2. **Lấy thông tin thương hiệu demo.** Nếu người dùng chưa nêu rõ trang mới này *dành cho* mục đích gì (tên thương hiệu, ngành/lĩnh vực, sản phẩm hoặc dịch vụ, thông tin liên hệ nếu có), hãy hỏi bằng `AskUserQuestion`. Không được tự bịa ra tên thương hiệu hay sản phẩm/dịch vụ mà người dùng chưa cung cấp hoặc chưa phê duyệt — đây là điều duy nhất tuyệt đối không được tự ý ứng biến.

3. **Hỏi ngôn ngữ chính của website sẽ được build.** Nếu người dùng chưa nói rõ, hãy hỏi bằng `AskUserQuestion` (ví dụ: Tiếng Việt hay Tiếng Anh). Nếu ngôn ngữ xác nhận khác với ngôn ngữ gốc của trang tham chiếu, nội dung copy lại cần được dịch sang ngôn ngữ đã xác nhận thay vì giữ nguyên ngôn ngữ gốc; nhãn UI và `metaDescription` luôn viết bằng ngôn ngữ đã xác nhận.

4. **Khảo sát toàn bộ trang web tham chiếu, không chỉ trang chủ.** Bắt đầu từ điều hướng chính (header nav, footer nav, megamenu nếu có) để lập bản đồ đầy đủ các loại trang tồn tại trên site, sau đó dùng `WebFetch` đi theo từng trang để ghi lại:
   - Thứ tự các phần và luồng bố cục của từng loại trang (ví dụ trang chủ: hero → bằng chứng xã hội → lưới tính năng → bảng giá → đánh giá khách hàng → FAQ → CTA cuối cùng)
   - Nội dung text thật của từng phần (heading, mô tả, copy CTA, câu hỏi FAQ...) — ghi lại gần nguyên văn để tái sử dụng ở bước 7, không chỉ tóm tắt ý.
   - URL của các hình ảnh dùng trên trang (hero image, ảnh minh hoạ, icon, ảnh sản phẩm, logo...) để tải/tái sử dụng ở bước 7.
   - Cấu trúc ưu đãi (cách trình bày giá/gói/combo, những gì được đóng gói chung, các mẫu hình giá neo/giá mồi)
   - Chiến lược chuyển đổi (CTA chính so với CTA phụ, các thủ thuật tạo cảm giác khẩn cấp/khan hiếm, tín hiệu tin cậy, vị trí đặt biểu mẫu, những chỗ được giảm ma sát)
   - Điều hướng và hệ thống phân cấp thông tin (bao gồm cấu trúc URL/route nếu có thể suy ra)
   - Với các trang danh sách/phân trang (blog, tin tức, sản phẩm...): cách hiển thị danh sách (lưới/list, filter, tab), cơ chế phân trang hoặc "tải thêm", và **liệt kê toàn bộ entry thật** hiện có (tiêu đề, nội dung, ảnh của từng entry) — không chỉ 1 ví dụ điển hình.

   Đồng thời ghi chú lại **phong cách hình ảnh (visual style)** của trang tham chiếu để tái hiện ở bước xây dựng:
   - **Bảng màu**: màu chủ đạo, màu nhấn/CTA, màu nền (sáng/tối/trung tính), mức độ tương phản — mô tả bằng tên màu hoặc mã hex ước lượng.
   - **Typography**: kiểu chữ tiêu đề so với phần thân (serif/sans-serif, đậm/nhẹ, cỡ chữ tương đối), có phải là một cặp font đặc trưng hay không.
   - **Ngôn ngữ hình khối**: độ bo góc, độ dùng bóng đổ (shadow) hay phẳng (flat), mật độ khoảng trắng, phong cách nút bấm/thẻ.
   - **Tông giọng thiết kế tổng thể**: trang trọng/doanh nghiệp, tối giản/hiện đại, ấm áp/thân thiện, táo bạo/nổi bật, v.v.

   Nếu trang tham chiếu yêu cầu đăng nhập/trả phí hoặc không thể lấy được nội dung/cấu trúc của nó, hãy báo cho người dùng biết thay vì đoán mò nội dung.

5. **Thay thế bản sắc thương hiệu.** Trước khi viết bất kỳ đoạn code nào, xác định trong nội dung đã khảo sát ở bước 4 những chỗ nào là **bản sắc thương hiệu gốc** cần thay: tên thương hiệu/công ty, wordmark hiển thị trên logo, tên miền/email, số điện thoại, địa chỉ, tên pháp nhân, link mạng xã hội. Mọi chỗ này được thay bằng thông tin thương hiệu demo do người dùng cung cấp ở bước 2 — kể cả khi nó xuất hiện lồng trong một đoạn text đã copy gần nguyên văn (ví dụ testimonial nhắc tên thương hiệu, footer, trang liên hệ). Phần còn lại của nội dung (mô tả tính năng, copy marketing, FAQ, ảnh minh hoạ không mang tên thương hiệu...) được giữ nguyên/gần nguyên văn.

   Nếu logo gốc là một biểu tượng đồ hoạ đi kèm wordmark, giữ lại kiểu bố cục logo (icon + tên) nhưng đổi phần chữ sang tên thương hiệu demo; không tái tạo y hệt một biểu tượng có tính nhận diện thương hiệu quá đặc trưng của bên thứ ba nổi tiếng.

6. **Áp dụng phong cách hình ảnh của trang tham chiếu vào bộ quy ước kỹ thuật hiện có của dự án này** — *theme* (màu sắc, font, bo góc, khoảng cách, tông giọng) đi theo trang tham chiếu, còn *cách hiện thực* (component pattern, cấu trúc file, kỹ thuật ảnh) vẫn đi theo quy ước sẵn có của dự án. Đây là dự án Next.js (App Router) + TypeScript + Tailwind CSS v4 sử dụng `lucide-react` cho icon. Trước khi xây dựng:
   - Kiểm tra `src/app/` để xem các trang hiện đang được cấu tạo như thế nào (ví dụ: `page.tsx` import các component phần từ thư mục `_components` cục bộ) và làm theo cùng mẫu đó cho bất kỳ trang mới nào.
   - **Cập nhật token theme trong `src/app/globals.css`** (khối `@theme` của Tailwind v4: `--color-brand-*`, `--color-*` khác, `--font-sans`...) để phản ánh bảng màu và mức độ bo góc/khoảng cách đã ghi nhận ở bước 4.
   - **Đổi font chữ** trong `src/app/layout.tsx` (hiện đang dùng `next/font/google` với font Roboto) sang một font Google Fonts có phong cách gần nhất với cặp font tiêu đề/thân đã quan sát được ở trang tham chiếu — không tải hay nhúng file font độc quyền thật của trang tham chiếu (rủi ro cấp phép font khác với rủi ro nội dung/hình ảnh, nên vẫn giữ nguyên tắc dùng font thay thế được cấp phép tự do).
   - Tuân theo quy tắc về hình ảnh trong `AGENTS.md` ở thư mục gốc dự án: luôn dùng `next/image` (không bao giờ dùng `<img>`), dùng `fill` + wrapper có `position` và `overflow-hidden` cho ảnh có kích thước theo CSS kèm `sizes`, dùng `width`/`height` tường minh cho ảnh kích thước cố định, và chỉ dùng `priority` cho ảnh hero nằm phía trên màn hình đầu tiên (above-the-fold).
   - Nếu trang sẽ được index, hãy đặt cho nó một `metaDescription` riêng biệt, viết bằng ngôn ngữ đã xác nhận ở bước 3 — không được để trống hoặc trùng lặp với trang khác.
   - Tái sử dụng các component/quy ước cấu trúc chung đã có sẵn trong codebase (co-location `content.json`, mẫu `_components`...) thay vì tạo ra một hệ thống mới — chỉ token theme và font là được điều chỉnh theo trang tham chiếu.

7. **Xây dựng lại toàn bộ site** theo luồng cấu trúc và điều hướng của trang tham chiếu — mỗi loại trang đã khảo sát ở bước 4 đều có một route tương ứng trong dự án này, với nội dung tái sử dụng gần nguyên văn từ trang tham chiếu (đã dịch sang ngôn ngữ xác nhận ở bước 3 nếu cần) và đã thay bản sắc thương hiệu theo bước 5:
   - **Text**: copy lại nội dung gần nguyên văn (heading, mô tả, CTA, FAQ...) đã ghi nhận ở bước 4, chỉ chỉnh sửa những chỗ nhắc tên thương hiệu/sản phẩm gốc.
   - **Hình ảnh**: tải và lưu lại các ảnh đã ghi nhận URL ở bước 4 vào dự án (ví dụ `public/images/...`) rồi dùng qua `next/image` theo quy ước ở bước 6, thay vì dùng placeholder — trừ ảnh nào chứa logo/wordmark thương hiệu gốc thì cần thay bằng logo demo mới dựng theo bước 5.
   - **Trang danh sách/phân trang** (blog, tin tức, sản phẩm...): dựng đầy đủ trang danh sách kèm phân trang/filter như bản gốc, và dựng **toàn bộ entry thật** đã khảo sát được ở bước 4 (không giới hạn ở 1 trang mẫu), dùng route động sẵn có của dự án (ví dụ `news/[slug]`) theo đúng quy ước hiện tại (xem `news/[slug]` hiện tại làm ví dụ tham khảo).

8. **Xác nhận phạm vi trước khi xây dựng quy mô lớn.** Vì phạm vi mặc định của skill này là toàn site với toàn bộ entry thật, hãy liệt kê ngắn gọn danh sách trang/route dự kiến dựng lại và số lượng entry thật sẽ dựng cho mỗi trang danh sách (rút ra từ bước khảo sát), **và** tóm tắt ngắn gọn theme thị giác dự kiến áp dụng (bảng màu, font, độ bo góc/khoảng cách) rồi xác nhận với người dùng trước khi bắt đầu tạo hàng loạt.

## Rào chắn an toàn (Guardrails)

- Bản sắc thương hiệu (tên thương hiệu, wordmark trên logo, thông tin liên hệ/pháp lý) của trang tham chiếu **luôn luôn** phải được thay bằng thông tin thương hiệu demo do người dùng cung cấp — không bao giờ tự động giữ nguyên "cho mục đích giữ chỗ", kể cả khi nó xuất hiện lồng trong nội dung đã copy gần nguyên văn.
- Trang tham chiếu dùng để **clone lại toàn bộ nội dung, cấu trúc/chức năng, và phong cách hình ảnh ở mức toàn site** (mọi loại trang, điều hướng, bố cục, toàn bộ entry của trang danh sách, bảng màu, font, tông giọng thiết kế). Đây là skill duy nhất được phép tái hiện nội dung và style gần nguyên văn của một tham chiếu — khác với quy ước toàn cục mặc định của người dùng (vốn chỉ coi ảnh chụp UI tham chiếu là cảm hứng bố cục/chức năng, giữ nguyên style của app hiện có); trong phạm vi skill này, cả nội dung lẫn theme thị giác của trang tham chiếu được chủ động tái hiện.
- Ranh giới không được vượt qua dù đang tái hiện gần nguyên văn: không dùng đúng biểu tượng logo có tính nhận diện thương hiệu quá đặc trưng của bên thứ ba (chỉ giữ kiểu bố cục icon + wordmark, đổi phần chữ), không tải hay nhúng file font độc quyền thật của trang tham chiếu (dùng font thay thế được cấp phép tự do có phong cách tương đồng), không giữ lại thông tin liên hệ/pháp lý thật của thương hiệu gốc.
- Luôn xây dựng lại cho thương hiệu demo của riêng người dùng — hỏi nếu chưa có thông tin thương hiệu; không tự bịa tên thương hiệu/sản phẩm.
- Luôn xác nhận ngôn ngữ chính của website trước khi viết nội dung — không tự mặc định theo ngôn ngữ của trang tham chiếu hay ngôn ngữ hội thoại.
- Nếu trang tham chiếu yêu cầu đăng nhập/trả phí hoặc không thể lấy được cấu trúc/nội dung của nó, hãy báo cho người dùng biết thay vì đoán mò bố cục hoặc nội dung.
