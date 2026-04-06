import { useEffect, useState } from 'react'

export default function App() {
  const [data, setData] = useState({ articles: [], signals: [] })

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  return (
    <div className="page">
      <header className="hero">
        <div className="badge">ESCBase Next</div>
        <h1>Crypto Intelligence Newsroom</h1>
        <p>
          Một phiên bản xịn hơn của ESC Base: quét X tự động, gom tín hiệu, đề xuất chủ đề,
          và xuất bản bài phân tích hằng ngày.
        </p>
      </header>

      <section className="grid two">
        <div className="panel">
          <div className="panel-head">
            <h2>Đề xuất kiến trúc</h2>
          </div>
          <ul className="list">
            <li>Frontend React + Vite, giao diện kiểu intelligence dashboard</li>
            <li>Backend Node.js phục vụ API bài viết, raw signal, publishing state</li>
            <li>Pipeline tự động scan X → lưu raw → generate article → publish</li>
            <li>Hỗ trợ mở rộng sang RSS, YouTube, alerts, internal admin</li>
          </ul>
        </div>

        <div className="panel accent">
          <div className="panel-head">
            <h2>Tại sao hướng này ngon hơn ESC Base hiện tại?</h2>
          </div>
          <ul className="list">
            <li>Không còn chỉ là static blog</li>
            <li>Có “nguồn sống” từ X/Twitter scan hằng ngày</li>
            <li>Dễ xây workflow biên tập + duyệt + xuất bản</li>
            <li>Dễ scale thành newsroom thực thụ</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>X Radar</h2>
          <span className="muted">Raw signals đã scan / demo</span>
        </div>
        <div className="cards">
          {data.signals.map((item) => (
            <article key={item.slug} className="card signal">
              <div className="tag">{item.tag}</div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Bài phân tích gần nhất</h2>
          <span className="muted">Generated / curated content</span>
        </div>
        <div className="cards">
          {data.articles.map((item) => (
            <article key={item.slug} className="card article">
              <div className="tag secondary">{item.category}</div>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
              <div className="meta">{item.readTime} • {item.date}</div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
