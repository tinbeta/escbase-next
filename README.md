# ESCBase Next

Bản kế thừa của ESC Base cũ, được đặt trong một project mới để dễ nâng cấp dần mà không phá site đang chạy.

## Hiện trạng

Project này đang dùng lại toàn bộ:
- giao diện ESC Base cũ
- bài viết cũ
- assets cũ
- cấu trúc nội dung cũ

Mục tiêu là giữ nguyên thứ đã ổn, rồi nâng cấp từng bước sau.

## Chạy local

```bash
cd ~/Desktop/escbase-next
npm install
npm run dev
```

Mở tại:
- http://localhost:5173

## Hướng nâng cấp tiếp theo

- tối ưu mobile
- làm đẹp article page
- cải thiện tốc độ tải
- nâng SEO / sitemap / metadata
- thêm quy trình xuất bản nội dung mới
- sau này mới nối cron job scan X

## Ghi chú

Site ESC Base cũ đã được copy vào:
- `apps/web/public/legacy/`

Homepage của Vite đang chuyển thẳng vào giao diện legacy để bạn xem đúng bản cũ ngay.
