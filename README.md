# ESCBase Next

Một bản nâng cấp cho ESC Base dùng Vite + Node.js, thiết kế để:
- quét X/Twitter tự động
- lưu raw posts
- gợi ý chủ đề
- sinh bài phân tích hằng ngày
- xuất dữ liệu ra frontend hiện đại hơn

## Ý tưởng sản phẩm

### 1. Frontend mới
- Vite + React
- Trang chủ kiểu newsroom / intelligence dashboard
- Hero lớn + latest signals + featured analysis
- Card bài viết đẹp hơn, filter theo chủ đề: Crypto / AI / Geopolitics / Regulation
- Có khu vực “X Radar” hiển thị tín hiệu vừa scan

### 2. Backend Node.js
- API đơn giản để phục vụ bài viết, raw signals, publishing state
- Có thể nâng dần lên cron jobs + queue + SQLite/Postgres sau

### 3. Pipeline nội dung tự động
- `scan-x.mjs`: gọi bird home, chọn bài đáng chú ý, lưu raw
- `generate-article.mjs`: tạo bài phân tích từ raw đã chọn
- `publish-local.mjs`: xuất JSON/article để frontend hiển thị

## Chạy local

```bash
cd ~/Desktop/escbase-next
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:8787

## Tầm nhìn bản xịn hơn

Nếu làm tới nơi tới chốn, mình đề xuất roadmap này:

### Phase 1 — MVP chạy được
- Scan X bằng bird
- Lưu raw + metadata JSON
- Viết bài semi-auto
- Frontend đọc article JSON/HTML

### Phase 2 — Intelligence site
- Score bài theo impact / novelty / relevance
- Dashboard biên tập: duyệt bài, sửa title, đổi tag, lên lịch
- RSS / sitemap / OG image tự sinh

### Phase 3 — AI newsroom
- Agent tự chia cluster theo narrative
- Daily brief tự động
- Topic memory: tránh viết trùng, theo dõi câu chuyện nhiều ngày
- Multi-source: X + RSS + blog + YouTube transcript

## Gợi ý tên sản phẩm
- ESCBase Next
- ESC Radar
- ESC Alpha Desk
- ESC Signal
- BaseWire

## Mình nghĩ hướng ngon nhất
Nếu bạn muốn “xịn xò hơn ESC Base hiện tại”, mình sẽ chọn style:

**crypto intelligence newsroom**

không chỉ là blog tĩnh nữa, mà là:
- báo điện tử mini
- terminal/dashboard vibe
- có dữ liệu sống từ X scan
- mỗi ngày tự đẻ ra topic đáng viết

Nếu bạn muốn, bước tiếp theo mình có thể làm luôn:
1. dựng UI đẹp hơn nữa
2. nối thật với bird + raw storage
3. thêm SQLite để quản lý pipeline bài viết
4. thêm trang admin nội bộ
