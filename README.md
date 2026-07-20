# TỪ BẾN NHÀ RỒNG

**Một bến cảng – Một chuyến đi – Một hành trình lịch sử**

Website kể chuyện tương tác về Bến Nhà Rồng và hành trình bắt đầu ngày 05/06/1911. Sản phẩm được thiết kế như một chuyến đi điện ảnh xuyên thời gian: từ thương cảng Sài Gòn, khoảnh khắc tàu Amiral Latouche Tréville rời bến, các cảng biển tiêu biểu, đến vai trò bảo tàng của công trình hôm nay.

## Ý tưởng thiết kế

Ngôn ngữ thị giác dùng xanh biển đậm, vàng đồng, đỏ trầm và giấy cũ. Trải nghiệm ưu tiên nhịp kể, khoảng tối, ánh hoàng hôn, chuyển động mặt nước và các minh họa CSS nhẹ. Hiệu ứng phức tạp tự giảm trên màn hình nhỏ và được vô hiệu hóa khi hệ điều hành bật `prefers-reduced-motion`.

## Tính năng

- Trang chủ scroll-storytelling với hero điện ảnh, tàu rời bến, chuyển cảnh bản đồ, so sánh xưa–nay và màn kết.
- Bản đồ thế giới tương tác dùng TrackAsia GL: kéo, zoom, fit toàn tuyến, về Việt Nam, 7 địa điểm, đường hải trình, tàu chuyển động, panel chi tiết, điều hướng trước/sau và trạng thái đã khám phá.
- Quần đảo Hoàng Sa và quần đảo Trường Sa có marker, nhãn, popup riêng ghi rõ Việt Nam. Khi chưa cấu hình API key, website hiển thị cảnh báo và dùng bản đồ SVG nội bộ; không tự chuyển sang nguồn tile khác.
- Timeline 8 mốc, 4 nhóm lọc và panel tư liệu.
- Khám phá kiến trúc với 8 hotspot và chế độ đèn soi tương tác.
- Bảo tàng số gồm 15 tư liệu, 5 phòng, tìm kiếm, lọc, modal và phóng to.
- 10 câu trắc nghiệm có giải thích; trò kéo-thả timeline; trò tìm chi tiết kiến trúc.
- Hộ chiếu số, 6 huy hiệu, dấu hành trình, phần trăm hoàn thành, in/lưu PDF và đặt lại tiến độ.
- Form cảm nhận có validation, sanitize, rate limit, phân trang và trạng thái dữ liệu mẫu.
- Loading, error, empty state, toast, page transition, scroll progress, dark/light mode, âm nền chỉ bật sau thao tác người dùng.
- SEO theo route, Open Graph cơ bản, JSON-LD, favicon, robots và sitemap.
- Điều hướng bàn phím, focus rõ, nhãn biểu mẫu, alt/fallback minh họa và reduced motion.

## Công nghệ

### Client

React 18, TypeScript strict, Vite, React Router, Tailwind CSS, GSAP + ScrollTrigger, Framer Motion, TrackAsia GL JS 2.0.1, SVG fallback nội bộ và Lucide React.

### Server

Node.js, Express 5, TypeScript strict, Zod, Helmet, CORS, Express Rate Limit và JSON database. JSON được chọn để project chạy ổn định mà không cần native binary hoặc dịch vụ ngoài.

### Kiểm thử

Vitest, Supertest và các kiểm thử utility phía client.

## Cấu trúc thư mục

```text
.
├── client/
│   ├── public/                 # favicon, robots, sitemap
│   └── src/
│       ├── components/         # layout và UI dùng chung
│       │   └── journey/        # TrackAsia, lớp chủ quyền và SVG fallback
│       ├── config/             # cấu hình provider, không chứa API key thật
│       ├── context/            # lưu tiến độ localStorage
│       ├── data/               # tọa độ hành trình và hai cụm đảo
│       ├── hooks/              # hook tải API
│       ├── lib/                # API client, scoring, filter
│       └── pages/              # 9 trang chính + 404
├── server/
│   ├── data/                   # JSON database cảm nhận (sinh khi seed/chạy)
│   └── src/
│       ├── app.ts              # Express app và REST API
│       ├── data.ts             # dữ liệu lịch sử đã seed
│       ├── index.ts            # server entrypoint
│       └── seed.ts             # seed dữ liệu cảm nhận
├── .env.example
└── package.json                # workspace scripts
```

## Cài đặt và chạy development

Yêu cầu Node.js 20 trở lên.

```bash
npm install
npm run seed
npm run dev
```

- Website: `http://localhost:5173`
- API: `http://localhost:4000/api`
- Health check: `http://localhost:4000/api/health`

Vite tự proxy `/api` tới Express trong development.

## Biến môi trường

Sao chép `.env.example` nếu cần đổi cổng hoặc origin. Bản đồ TrackAsia cần một API key dành cho web:

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
VITE_API_URL=/api
VITE_TRACKASIA_API_KEY=
```

Đăng ký và lấy API key theo [tài liệu TrackAsia](https://docs.track-asia.com/guides/), thêm khóa vào `client/.env`, rồi khởi động lại Vite. Cần giới hạn key theo domain/referrer và hạn mức sử dụng trong tài khoản TrackAsia. Biến `VITE_` được trình duyệt đọc nên không phải secret phía server; không commit khóa thật và luôn cấu hình giới hạn domain.

Vite thay thế `VITE_TRACKASIA_API_KEY` ngay trong lúc build, không đọc biến này khi bundle đã được khởi chạy. Vì vậy môi trường deploy phải cung cấp biến cho **build command** và phải build/deploy lại sau mỗi lần thêm hoặc đổi key. Production build sẽ dừng sớm với thông báo cấu hình nếu biến bị thiếu hoặc rỗng.

Trong danh sách domain/referrer của TrackAsia, thêm hostname production `bennharong.onrender.com` (không thêm `/journey`). Nếu có custom domain hoặc biến thể `www`, cần thêm riêng từng hostname thực sự phục vụ website. Server gửi referrer theo chính sách `strict-origin-when-cross-origin`; CSP mở style/TileJSON/sprite/glyph tại `https://maps.track-asia.com`, vector tile tại `https://tiles.track-asia.com`, và `blob:` cho TrackAsia Web Worker. Nếu nền tảng deploy ghi đè response headers, cần giữ tương đương các directive `connect-src`, `img-src`, `font-src`, `worker-src` và `child-src` trong cấu hình của nền tảng.

Có thể kiểm tra lại dependency host và HTTP status mà không in key bằng `npm run inspect:trackasia`. Script đọc `client/.env`, gọi tuần tự style, TileJSON, sprite JSON/PNG, glyph và một vector tile mẫu rồi chỉ xuất hostname/status. Sau deploy, mở `/journey?mapDebug=1` để xem state, resource type, hostname, status và gợi ý CSP đã được sanitize; panel này không hiển thị key hoặc URL query.

Nếu khóa trống, `/journey` giữ SVG nội bộ làm fallback và hiển thị hướng dẫn cấu hình. Nếu khóa sai hoặc bị chặn domain, giao diện báo lỗi TrackAsia; project không fallback sang OpenStreetMap hay provider thứ ba.

## Seed dữ liệu

```bash
npm run seed
```

Lệnh này tạo lại `server/data/reflections.json` với 5 cảm nhận minh họa. Nội dung lịch sử, hành trình, hiện vật, quiz, nguồn, hotspot và huy hiệu được seed từ `server/src/data.ts`.

## Kiểm tra chất lượng

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Build production tạo `client/dist` và `server/dist`. Để Express phục vụ cả API và frontend đã build:

```bash
$env:NODE_ENV="production"   # PowerShell
npm start
```

## REST API

| Phương thức | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/health` | Trạng thái dịch vụ |
| GET | `/api/events` | Danh sách mốc thời gian |
| GET | `/api/events/:id` | Chi tiết mốc |
| GET | `/api/journey` | Danh sách địa điểm hành trình |
| GET | `/api/journey/:id` | Chi tiết địa điểm |
| GET | `/api/artifacts` | Danh sách tư liệu |
| GET | `/api/artifacts/:id` | Chi tiết tư liệu |
| GET | `/api/quiz` | 10 câu trắc nghiệm |
| GET | `/api/quiz/:id` | Chi tiết câu hỏi |
| GET | `/api/hotspots` | 8 hotspot kiến trúc |
| GET | `/api/badges` | 6 huy hiệu |
| GET | `/api/sources` | Danh sách nguồn |
| GET | `/api/reflections?page=1&limit=6` | Cảm nhận đã duyệt |
| POST | `/api/reflections` | Gửi cảm nhận |

Payload POST mẫu:

```json
{
  "name": "Người xem",
  "content": "Một hành trình lịch sử được kể rất trang trọng và dễ nhớ.",
  "emotion": "Xúc động",
  "confirmed": true
}
```

## Nguồn dữ liệu và hình ảnh

Nội dung được đối chiếu từ Bảo tàng Hồ Chí Minh, Cổng thông tin điện tử Hồ Chí Minh, Sở Văn hóa và Thể thao TP.HCM, Thành ủy TP.HCM và Tư liệu – Văn kiện Đảng. Danh sách URL, ngày truy cập và phạm vi sử dụng nằm tại route `/sources` và trong `server/src/data.ts`.

Kho ảnh Wikimedia Commons được ghi nhận để tham chiếu giấy phép. Do môi trường tự động bị giới hạn tải ảnh tại thời điểm xây dựng, bản chạy hiện tại dùng hệ minh họa CSS có chủ đích và fallback nội bộ, không có watermark, không phụ thuộc mạng và không có ảnh vỡ.

Nền bản đồ tương tác dùng TrackAsia Streets V2 và giữ attribution `Bản đồ © TrackAsia`. Lớp marker, đường hành trình và nội dung Hoàng Sa–Trường Sa do dự án thiết kế cho mục đích giáo dục. Tuyến hành trình chỉ trực quan hóa các địa điểm tiêu biểu được tư liệu ghi nhận, không phải tuyến hàng hải chính xác tuyệt đối.

Trước khi đưa bản đồ tile vào trình bày/production, người vận hành phải dùng key hợp lệ và kiểm tra trực quan hai vị trí `16.5, 112.0` và `10.0, 114.0` tại zoom 4–10. Không được nghiệm thu chỉ dựa trên lớp marker riêng. Bản build không có khóa vẫn an toàn vì không gọi nguồn tile nào và chỉ dùng SVG nội bộ.

## Giới hạn hiện tại

- Bản đồ là trực quan hóa các địa điểm tiêu biểu, không khẳng định tuyến hàng hải tuyệt đối đầy đủ.
- Repository không chứa API key TrackAsia. Vì vậy tile thực tế và nội dung tại từng mức zoom phải được nghiệm thu với key đã giới hạn domain trước khi triển khai chính thức.
- Minh họa kiến trúc không thay thế bản vẽ hoặc hồ sơ kiến trúc chính thức.
- Cảm nhận được lưu trong JSON và có trường `status`, phù hợp demo/đồ án một tiến trình; triển khai nhiều máy chủ nên chuyển sang SQLite/PostgreSQL.
- Chưa có trang quản trị kiểm duyệt; project chủ động không thêm đăng nhập ngoài phạm vi.
- Âm nền là âm sắc Web Audio tối giản, không dùng nhạc hoặc tư liệu âm thanh có bản quyền.

## Hướng phát triển

- Thay các minh họa dự phòng bằng bộ ảnh đã xin phép và tối ưu WebP/AVIF.
- Chuyển reflections sang SQLite/Prisma hoặc PostgreSQL khi triển khai nhiều instance.
- Thêm dashboard kiểm duyệt và tài khoản nếu có yêu cầu vận hành thực tế.
- Bổ sung thuyết minh tiếng Việt, phụ đề và phiên bản đa ngôn ngữ.
- Thêm kiểm thử screenshot định kỳ cho các mức zoom chủ quyền khi CI có browser và TrackAsia API key dành riêng cho kiểm thử.

## Screenshot

Không đưa ảnh chụp tự động vào repository vì phiên kiểm thử không có browser renderer khả dụng và không có TrackAsia API key. Giao diện có thể được chụp trực tiếp tại `/journey` sau khi cấu hình key và chạy `npm run dev`.
