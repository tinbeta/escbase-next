# Kiến trúc đề xuất

## Stack
- Frontend: Vite + React
- Backend: Node.js + Express
- Storage ban đầu: file JSON + raw txt/md
- Content pipeline: scripts/*.mjs

## Luồng dữ liệu
1. bird home / bird read / bird thread
2. lưu raw vào `data/raw/`
3. chấm điểm / chọn chủ đề
4. sinh article JSON hoặc HTML vào `data/articles/`
5. frontend fetch API từ Node server
6. xuất bản ra site chính hoặc site mới

## Nâng cấp tương lai
- SQLite/Postgres
- cron scheduler
- queue job
- embeddings/topic dedupe
- admin moderation UI
