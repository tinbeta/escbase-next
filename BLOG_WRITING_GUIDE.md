# Hướng dẫn viết bài trên Escbase cho AI Agents

> File này dành cho các AI agent (Devin, Claude, Cursor, v.v.) khi được yêu cầu viết bài mới trên Escbase.  
> Tuân thủ chính xác cấu trúc và conventions bên dưới để bài viết hiển thị đúng trên site.

---

## Tổng quan kiến trúc

- **Repo:** `tinbeta/escbase-next` (monorepo, npm workspaces)
- **Blog posts:** Static HTML files tại `apps/web/public/blog/{slug}/index.html`
- **Metadata:** `apps/web/public/blog.json` (mảng JSON, bài mới nhất ở đầu)
- **Preview images:** Ưu tiên PNG/JPG/WebP tại `apps/web/public/images/{slug}-thumb.{ext}`. SVG có thể dùng làm source, nhưng `og:image` nên trỏ tới PNG/JPG/WebP.
- **Shared CSS:** `apps/web/public/shared-article.css` + `apps/web/public/shared-article-footer.css`
- **Sitemap/RSS:** Auto-generate khi build (`npm run build`)
- **Domain:** `https://news.escbase.xyz`
- **Canonical URL:** Blog URLs dùng trailing slash: `https://news.escbase.xyz/blog/{slug}/`
- **Ngôn ngữ:** Tiếng Việt (có dấu đầy đủ), có thể mix thuật ngữ tiếng Anh khi cần

---

## Quy trình viết bài mới (Checklist)

### 1. Tạo slug cho bài viết
- Dùng kebab-case, không dấu tiếng Việt: `openclaw-2026-4-24-release`, `devin-ai-engineer-guide`
- Ngắn gọn, mô tả được nội dung chính

### 2. Tạo file HTML bài viết
- Đường dẫn: `apps/web/public/blog/{slug}/index.html`
- Xem template bên dưới

### 3. Tạo thumbnail / preview image
- Đường dẫn ưu tiên: `apps/web/public/images/{slug}-thumb.png`
- Kích thước khuyến nghị: `800x420` (width x height)
- Có thể tạo SVG source tại `apps/web/public/images/{slug}-thumb.svg`, nhưng cần export PNG/JPG/WebP cho social preview.

### 4. Nếu tạo SVG, export PNG cho og:image
- Chạy: `rsvg-convert -w 800 -h 420 apps/web/public/images/{slug}-thumb.svg -o apps/web/public/images/{slug}-thumb.png`
- macOS: `brew install librsvg`
- Linux: `sudo apt-get install -y librsvg2-bin`

### 5. Thêm metadata vào blog.json
- Thêm object mới vào **ĐẦU** mảng JSON (bài mới nhất luôn ở vị trí đầu)
- Xem format bên dưới

### 6. Build & verify
- Chạy `npm run build` từ root repo
- Kiểm tra sitemap.xml và feed.xml được cập nhật

### 7. Commit & tạo PR
- Branch: `devin/$(date +%s)-tên-bài`
- Commit message: `feat: Thêm bài viết {tên bài}`
- Files cần commit:
  - `apps/web/public/blog/{slug}/index.html`
  - `apps/web/public/images/{slug}-thumb.png`
  - `apps/web/public/images/{slug}-thumb.svg` (nếu có source SVG)
  - `apps/web/public/blog.json`

---

## Quy trình source từ X/Twitter thread

Khi bài viết xuất phát từ một thread trên X/Twitter, không viết từ một tweet đơn lẻ hoặc bản tóm tắt thiếu nguồn. Mặc định dùng `bird thread <url>` để đọc toàn bộ thread trước.

### 1. Tạo thư mục source cục bộ

Tạo thư mục theo mẫu:

`~/Downloads/escbase/content/<dd-mm-yyyy>/<title>/`

Ví dụ:

`~/Downloads/escbase/content/09-04-2026/claude-managed-agents-public-beta/`

### 2. Lưu source bắt buộc

Trong thư mục đó, lưu ít nhất:

- `full_thread.txt`: toàn bộ nội dung thread gốc lấy từ `bird thread`.
- `links.txt`: các link xuất hiện trong thread, chỉ lấy link của chủ thread/source chính.
- Ảnh từ thread: bắt buộc tải và lưu tất cả ảnh của chủ thread/source chính.
- Video từ thread: bắt buộc tải tất cả video của chủ thread/source chính.
- `notebooklm.txt`: bắt buộc nếu có video dài cần tóm tắt thay vì nhúng nguyên bản.

### 3. Rule lọc source

- Chỉ lưu ảnh của chủ thread.
- Chỉ lưu link của chủ thread.
- Không gom ảnh/link từ user khác reply/comment vào source chính.
- Chỉ đọc phản ứng cộng đồng khi nó thật sự giúp bài tốt hơn.
- Nếu phân tích phản ứng cộng đồng, coi đó là lớp source phụ và không trộn vào source chính.

### 4. Cách dùng source trong bài

- Đọc lần lượt `full_thread.txt`, `links.txt`, `notebooklm.txt` nếu có.
- Mở và đọc các link quan trọng nhất trong thread.
- Phân tích ảnh trong thread để lấy thông tin, không chỉ chèn cho đẹp.
- Chèn tất cả ảnh/video phù hợp từ chủ thread vào bài.
- Video dưới 5 phút có thể chèn trực tiếp bằng thẻ `<video>`.
- Video dài hơn nên tóm tắt bằng NotebookLM và không nhúng nguyên bản nếu làm bài quá nặng.

---

## Template HTML bài viết

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{Tiêu đề bài viết} - Escbase</title>
    <meta name="description" content="{Mô tả ngắn ~150-160 ký tự}">
    <meta property="og:title" content="{Tiêu đề ngắn cho social sharing}">
    <meta property="og:description" content="{Mô tả ngắn cho social sharing}">
    <meta property="og:image" content="https://news.escbase.xyz/images/{slug}-thumb.png">
    <meta property="og:url" content="https://news.escbase.xyz/blog/{slug}/">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="/shared-article.css">
    <link rel="stylesheet" href="/shared-article-footer.css">
    <style>
        /* Post-specific styles (nếu cần) */
        /* Luôn thêm @media (max-width: 768px) cho mobile */
    </style>
</head>
<body>
    <div class="container">
        <article>
            <header class="article-header">
                <span class="category-badge"><i class="{tagIcon}"></i> {tag}</span>
                <h1>{Tiêu đề đầy đủ}</h1>
                <div class="meta">
                    <span><i class="far fa-calendar"></i> {DD/MM/YYYY}</span>
                    <span><i class="far fa-clock"></i> {X} phút đọc</span>
                    <span><i class="far fa-folder"></i> {Tag1}, {Tag2}</span>
                </div>
            </header>

            <div class="article-content">
                <!-- TL;DR (bắt buộc, luôn ở đầu) -->
                <div class="highlight-box">
                    <h4>TL;DR</h4>
                    <p style="margin-bottom:0">{Tóm tắt 2-3 câu, in đậm key points}</p>
                </div>

                <!-- Nội dung bài viết -->
                <h2>Heading cấp 2</h2>
                <p>Nội dung...</p>

                <h3>Heading cấp 3</h3>
                <p>Nội dung...</p>

                <!-- Nguồn tham khảo (bắt buộc) -->
                <div class="source-links">
                    <h4>Nguồn & tham khảo</h4>
                    <ul>
                        <li><a href="{url}" target="_blank">{Tên nguồn}</a></li>
                    </ul>
                </div>

                <!-- Footer navigation (bắt buộc) -->
                <div class="back-to-blog-footer">
                    <a href="/" class="back-to-blog-btn"><i class="fas fa-arrow-left"></i> Quay lại</a>
                </div>

                <div class="article-cta-stack">
                    <a href="/blog/{related-post-slug}" class="article-suggestion-card">
                        <span class="article-suggestion-label"><i class="fas fa-book-open"></i> Đọc tiếp</span>
                        <span class="article-suggestion-title">{Tiêu đề bài liên quan}</span>
                    </a>
                    <div class="article-cta-actions">
                        <a href="/blog" class="article-cta-btn article-cta-btn-secondary"><i class="fas fa-newspaper"></i> Xem tất cả bài viết</a>
                    </div>
                </div>

                <!-- Tags (bắt buộc) -->
                <div class="tags">
                    <span class="tag">Tag 1</span>
                    <span class="tag">Tag 2</span>
                    <span class="tag">Tag 3</span>
                </div>
            </div>
        </article>
    </div>
</body>
</html>
```

---

## Format blog.json entry

```json
{
    "url": "/blog/{slug}/",
    "title": "{Tiêu đề đầy đủ - tối đa ~80 ký tự}",
    "excerpt": "{Tóm tắt 1-2 câu cho card preview - tối đa ~250 ký tự}",
    "date": "Apr 25, 2026",
    "tag": "{Tag chính}",
    "tagIcon": "fas fa-robot",
    "tagColor": "#ef4444",
    "readTime": "9 min read",
    "featured": true,
    "image": "/images/{slug}-thumb.png"
}
```

### Quy tắc blog.json:
- **Thêm vào đầu mảng** (index 0), KHÔNG thêm vào cuối
- **date format:** `"MMM DD, YYYY"` — ví dụ: `"Apr 25, 2026"`
- **readTime:** Ước tính: ~200 từ/phút → chia tổng số từ cho 200, làm tròn
- **featured:** `true` cho bài mới, có thể chuyển bài cũ thành `false` nếu cần
- **url:** Luôn có trailing slash: `"/blog/{slug}/"`
- **image:** Trỏ tới file preview có thật trong `apps/web/public/images`. Ưu tiên PNG/JPG/WebP; SVG chỉ nên dùng khi đã chắc ảnh render ổn ở nơi hiển thị.

### Tag colors đã dùng:

| Tag | tagIcon | tagColor |
|-----|---------|----------|
| AI Agent | `fas fa-robot` | `#ef4444` (đỏ) |
| AI Tools | `fas fa-robot` | `#6366f1` (tím) |
| AI Agents | `fas fa-terminal` | `#a78bfa` (tím nhạt) |
| AI Coding | `fas fa-code` | `#f59e0b` (vàng) |
| Geospatial AI | `fas fa-satellite` hoặc `fas fa-map-location-dot` | `#4285f4` (xanh dương) |
| Founder Stack | `fas fa-user-astronaut` | `#2563eb` (xanh đậm) |
| Crypto | `fab fa-bitcoin` | `#f7931a` (cam bitcoin) |
| Market Structure | `fas fa-chart-line` | `#10b981` (xanh lá) |
| Policy | `fas fa-gavel` | `#8b5cf6` (tím) |

> Khi tạo tag mới, chọn Font Awesome icon phù hợp và color hex tương ứng. Tham khảo palette: https://tailwindcss.com/docs/colors

---

## CSS Components có sẵn trong shared-article.css

### Highlight Boxes (dùng cho callout, TL;DR, cảnh báo)

```html
<!-- Mặc định (xanh lá) — dùng cho TL;DR -->
<div class="highlight-box">
    <h4>TL;DR</h4>
    <p>Nội dung...</p>
</div>

<!-- Xanh dương — thông tin bổ sung -->
<div class="highlight-box-blue">
    <h4>💡 Lưu ý</h4>
    <p>Nội dung...</p>
</div>

<!-- Xanh lá — tích cực, thành công -->
<div class="highlight-box-green">
    <h4>Điểm tích cực</h4>
    <p>Nội dung...</p>
</div>

<!-- Vàng — cảnh báo nhẹ -->
<div class="highlight-box-yellow">
    <h4>⚠️ Lưu ý</h4>
    <p>Nội dung...</p>
</div>

<!-- Đỏ — cảnh báo quan trọng -->
<div class="highlight-box-red">
    <h4>🚨 Breaking Change</h4>
    <p>Nội dung...</p>
</div>
```

### Quote Block (trích dẫn)

```html
<blockquote class="quote-block">
    "Nội dung trích dẫn..."
    <br><strong>— Tên người nói, Chức vụ</strong>
</blockquote>
```

### Source Links (nguồn tham khảo)

```html
<div class="source-links">
    <h4>Nguồn & tham khảo</h4>
    <ul>
        <li><a href="..." target="_blank">Tên nguồn — Tổ chức</a></li>
    </ul>
</div>
```

### Tags (cuối bài)

```html
<div class="tags">
    <span class="tag">Keyword 1</span>
    <span class="tag">Keyword 2</span>
</div>
```

### Images (trong bài)

```html
<!-- Ảnh đơn (tự động responsive, bo góc, viền) -->
<img src="/blog/{slug}/image.jpg" alt="Mô tả ảnh" style="width:100%">

<!-- Ảnh từ URL ngoài -->
<img src="https://..." alt="Mô tả ảnh" style="width:100%">
```

### Code Block

```html
<pre style="background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-md);padding:1.25rem;overflow-x:auto;font-size:.9rem;line-height:1.6"><code># Command
npm install openclaw</code></pre>
```

### Tables (bọc trong table-scroll để responsive)

```html
<div class="table-scroll">
    <table class="pricing-table">
        <thead>
            <tr><th>Cột 1</th><th>Cột 2</th><th>Cột 3</th></tr>
        </thead>
        <tbody>
            <tr><td>Data</td><td>Data</td><td>Data</td></tr>
        </tbody>
    </table>
</div>
```

> **Lưu ý:** `.pricing-table` và `.table-scroll` cần định nghĩa trong inline `<style>` của bài viết nếu chưa có. Copy từ bài Devin AI guide.

---

## Post-specific CSS patterns (inline `<style>`)

Khi bài viết cần components đặc biệt, thêm CSS vào `<style>` trong `<head>`. **LUÔN** thêm `@media (max-width: 768px)` cho mobile.

### Feature Grid (2 cột → 1 cột trên mobile)

```css
.feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0; }
.feature-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.25rem; }
.feature-card h4 { color: var(--text); margin-bottom: .5rem; font-size: 1rem; }
.feature-card .icon { font-size: 1.5rem; margin-bottom: .75rem; }
.feature-card p { font-size: .9rem; margin-bottom: 0; }
@media (max-width: 768px) {
    .feature-grid { grid-template-columns: 1fr; }
    .feature-card { padding: 1rem; }
}
```

### Stats Row (flex → wrap trên mobile)

```css
.stats-row { display: flex; gap: 1.5rem; flex-wrap: wrap; margin: 1.5rem 0; }
.stat-item { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1rem 1.25rem; text-align: center; flex: 1; min-width: 120px; }
.stat-item .number { font-size: 1.5rem; font-weight: 800; color: var(--accent); }
.stat-item .label { font-size: .8rem; color: var(--text-secondary); margin-top: .25rem; }
@media (max-width: 768px) {
    .stats-row { gap: .75rem; }
    .stat-item { padding: .75rem; min-width: 0; }
    .stat-item .number { font-size: 1.25rem; }
}
```

### Community Quotes (dùng cho phần "Cộng đồng nói gì")

```css
.community-quote { border-left: 3px solid var(--accent); padding: .75rem 1rem; margin: 1rem 0; background: rgba(99,102,241,.05); border-radius: 0 var(--radius-md) var(--radius-md) 0; }
.community-quote .author { color: var(--accent); font-weight: 600; font-size: .85rem; }
.community-quote p { margin-bottom: .25rem; font-size: .95rem; }
.community-quote.positive { border-left-color: var(--accent-green); background: rgba(34,197,94,.05); }
.community-quote.positive .author { color: var(--accent-green); }
.community-quote.negative { border-left-color: var(--accent-red); background: rgba(239,68,68,.05); }
.community-quote.negative .author { color: var(--accent-red); }
@media (max-width: 768px) {
    .community-quote { padding: .6rem .85rem; margin: .75rem 0; }
    .community-quote p { font-size: .9rem; }
    .community-quote .author { font-size: .8rem; }
}
```

```html
<!-- Usage -->
<div class="community-quote positive">
    <p>"Nội dung quote tích cực..."</p>
    <span class="author">— @username trên X</span>
</div>

<div class="community-quote negative">
    <p>"Nội dung quote tiêu cực..."</p>
    <span class="author">— @username trên X</span>
</div>
```

### Comparison Box (2 cột Nên/Không nên)

```css
.comparison-box { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0; }
.comparison-col { padding: 1.25rem; border-radius: var(--radius-md); }
.comparison-col.good { background: linear-gradient(135deg, rgba(34,197,94,.12) 0%, rgba(34,197,94,.05) 100%); border: 1px solid rgba(34,197,94,.2); }
.comparison-col.bad { background: linear-gradient(135deg, rgba(239,68,68,.12) 0%, rgba(239,68,68,.05) 100%); border: 1px solid rgba(239,68,68,.2); }
.comparison-col.good h4 { color: var(--accent-green); }
.comparison-col.bad h4 { color: var(--accent-red); }
@media (max-width: 768px) { .comparison-box { grid-template-columns: 1fr; } }
```

### Workflow Steps (numbered steps)

```css
.workflow-step { display: flex; gap: 1rem; margin: 1rem 0; align-items: flex-start; }
.workflow-step .step-number { background: var(--accent); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: .85rem; flex-shrink: 0; }
.workflow-step .step-content h4 { margin-bottom: .25rem; color: var(--text); }
.workflow-step .step-content p { margin-bottom: 0; font-size: .95rem; }
```

---

## CSS Variables có sẵn

```css
--bg: #09090b;           /* Nền chính */
--card-bg: #18181b;      /* Nền card/box */
--border: #27272a;       /* Viền */
--text: #fafafa;         /* Chữ chính (trắng) */
--text-secondary: #a1a1aa; /* Chữ phụ (xám nhạt) */
--text-muted: #71717a;   /* Chữ mờ (xám) */
--accent: #16a34a;       /* Accent chính (xanh lá) */
--accent-blue: #60a5fa;  /* Xanh dương */
--accent-yellow: #f59e0b; /* Vàng */
--accent-red: #ef4444;   /* Đỏ */
--accent-green: #22c55e; /* Xanh lá sáng */
--radius-md: 16px;       /* Bo góc trung bình */
--radius-lg: 24px;       /* Bo góc lớn */
```

---

## Thumbnail SVG Convention

Kích thước: `800 x 420`  
Font: `Inter, system-ui, sans-serif`

### Cấu trúc SVG:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f0f1a"/>
      <stop offset="100%" style="stop-color:#1a0f2e"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:{accent-color-1}"/>
      <stop offset="100%" style="stop-color:{accent-color-2}"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="800" height="420" fill="url(#bg)"/>
  <!-- Grid pattern (subtle) -->
  <g opacity="0.05">
    <!-- Horizontal + vertical lines -->
  </g>
  <!-- Glow effect -->
  <ellipse cx="400" cy="160" rx="280" ry="110" fill="url(#glow)"/>
  <!-- Accent bar -->
  <rect x="60" y="90" width="4" height="80" rx="2" fill="url(#accent)"/>
  <!-- Title text -->
  <text x="80" y="120" font-family="Inter,system-ui,sans-serif" font-size="28" font-weight="800" fill="#f8fafc">
    {Tiêu đề ngắn}
  </text>
  <!-- Subtitle -->
  <text x="80" y="155" font-family="Inter,system-ui,sans-serif" font-size="16" font-weight="500" fill="#94a3b8">
    {Mô tả ngắn}
  </text>
  <!-- Feature pills, stats, icons tùy nội dung -->
  <!-- Escbase branding -->
  <text x="80" y="390" font-family="Inter,system-ui,sans-serif" font-size="13" font-weight="700" fill="#64748b">
    news.escbase.xyz
  </text>
</svg>
```

### Convert SVG → PNG:
```bash
rsvg-convert -w 800 -h 420 apps/web/public/images/{slug}-thumb.svg -o apps/web/public/images/{slug}-thumb.png
```

---

## Quy tắc nội dung

### Cấu trúc bài viết chuẩn:

1. **TL;DR** (highlight-box) — 2-3 câu tóm tắt, in đậm key points
2. **Giới thiệu** — {Sản phẩm/chủ đề} là gì? Context ngắn gọn
3. **Nội dung chính** — Phân tích chi tiết, chia theo h2/h3
4. **Cộng đồng nói gì** (nếu có nguồn từ X/Reddit/HN) — Community quotes
5. **Đánh giá / Nhận xét** — Quan điểm phân tích của Escbase
6. **Kết luận / Khuyến nghị** — Tóm lại nên làm gì
7. **Nguồn & tham khảo** — Links gốc
8. **Footer navigation** — Back button + bài đề xuất
9. **Tags** — Keywords liên quan

### Giọng văn:
- Phân tích khách quan, không PR hay quảng cáo
- Ngắn gọn, dễ đọc, không dài dòng
- Dùng **in đậm** cho key points
- Dùng *in nghiêng* ít, chỉ khi cần nhấn mạnh
- Thuật ngữ tiếng Anh giữ nguyên nếu phổ biến (API, agent, deploy, PR, v.v.)
- Tiếng Việt có dấu đầy đủ
- Mỗi đoạn văn 2-4 câu, không viết đoạn dài

### Phần "Cộng đồng nói gì":
- Lấy từ X replies, Reddit, Hacker News, hoặc các nguồn cộng đồng khác
- Dùng bird CLI để đọc thread/replies: `bird thread {url}` hoặc `bird replies {url}`
- Dịch sang tiếng Việt (giữ nguyên username gốc)
- Phân loại `.positive` và `.negative`
- Cân bằng ý kiến — không chỉ lấy ý kiến tích cực

---

## Mobile Responsive (BẮT BUỘC)

Mọi CSS custom trong `<style>` đều **PHẢI** có `@media (max-width: 768px)` tương ứng.

### Checklist mobile:
- [ ] Grid 2 cột → 1 cột trên mobile
- [ ] Font-size giảm ~10-15% trên mobile
- [ ] Padding giảm trên mobile (1.25rem → 1rem)
- [ ] Tables bọc trong `<div class="table-scroll">` cho horizontal scroll
- [ ] `min-width` trên flex items → `min-width: 0` trên mobile
- [ ] Không có element nào overflow ngang

---

## Lưu ý quan trọng

### PHẢI làm:
- Luôn dùng `shared-article.css` và `shared-article-footer.css` (KHÔNG viết inline CSS cho base styles)
- Luôn có TL;DR highlight-box ở đầu bài
- Luôn có source-links ở cuối
- Luôn có back-to-blog-footer + article-cta-stack + tags
- Luôn tạo preview image dùng được cho social sharing; nếu tạo SVG thì export thêm PNG
- Luôn thêm entry vào blog.json ở đầu mảng
- Luôn có mobile responsive cho CSS custom
- og:image phải trỏ tới PNG/JPG/WebP, không trỏ tới SVG
- og:url phải có trailing slash: `https://news.escbase.xyz/blog/{slug}/`

### KHÔNG được làm:
- KHÔNG duplicate CSS từ shared-article.css vào inline styles
- KHÔNG quên mobile responsive
- KHÔNG dùng ảnh base64 inline — upload lên hoặc link URL
- KHÔNG hardcode secrets/API keys trong bài viết
- KHÔNG thêm blog.json entry vào cuối mảng (phải ở đầu)
- KHÔNG trỏ `image` trong blog.json tới file không tồn tại
- KHÔNG quên `target="_blank"` cho external links trong source-links

---

## Ví dụ tham khảo

Xem các bài viết mẫu đã hoàn chỉnh:

| Bài viết | Đặc điểm |
|----------|----------|
| `blog/devin-ai-engineer-guide/` | Tables, use-case grid, comparison box, workflow steps |
| `blog/openclaw-2026-4-24-release/` | Feature grid, community quotes, stats row, code block |
| `blog/google-maps-imagery-insights-cloud-next-2026/` | Image grid, stat grid, community quotes, external images |
| `blog/google-maps-population-dynamics-insights/` | Minimal custom CSS (chủ yếu dùng shared-article.css) |
