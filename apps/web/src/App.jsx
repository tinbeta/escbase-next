import { useEffect, useMemo, useState } from 'react'

function SectionTitle({ title, sub }) {
  return (
    <div className="section-head">
      <div>
        <h2>{title}</h2>
        <p className="section-sub">{sub}</p>
      </div>
    </div>
  )
}

export default function App() {
  const [data, setData] = useState({ articles: [], signals: [] })

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  const featured = useMemo(
    () => data.articles.find((item) => item.featured) || data.articles[0],
    [data.articles]
  )

  const latest = useMemo(
    () => data.articles.filter((item) => !featured || item.slug !== featured.slug),
    [data.articles, featured]
  )

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">E</div>
          <div>
            <div className="brand-name">ESCBase Next</div>
            <div className="brand-sub">Tin tức Crypto & Blockchain cho người Việt</div>
          </div>
        </div>
        <nav className="topnav">
          <a href="#">Trang chủ</a>
          <a href="#latest">Bài mới</a>
          <a href="#signals">Tín hiệu</a>
          <a href="#vision">Định hướng</a>
        </nav>
      </header>

      <section className="hero-news">
        <div className="hero-left">
          <div className="label-hot">Chuyên trang đề xuất</div>
          <h1>Một web tin tức crypto chuyên nghiệp, đậm chất Việt, dễ mở rộng thành newsroom thực thụ</h1>
          <p>
            Đây là hướng mình đề xuất cho bản ESC Base mới: giao diện hiện đại hơn, ngôn ngữ tiếng Việt rõ ràng hơn,
            cấu trúc giống một trang tin chuyên ngành thay vì blog tĩnh, và sẵn sàng để sau này nối với cron job quét X tự động.
          </p>
          <div className="hero-pills">
            <span>Crypto</span>
            <span>Pháp lý Việt Nam</span>
            <span>AI & Blockchain</span>
            <span>Dòng tiền thị trường</span>
          </div>
        </div>
        <div className="hero-right">
          <div className="mini-stat">
            <strong>Phong cách</strong>
            <span>Tạp chí / Newsroom</span>
          </div>
          <div className="mini-stat">
            <strong>Ngôn ngữ</strong>
            <span>Ưu tiên tiếng Việt</span>
          </div>
          <div className="mini-stat">
            <strong>Định vị</strong>
            <span>Crypto intelligence cho người Việt</span>
          </div>
        </div>
      </section>

      {featured && (
        <section className="featured-block">
          <div className="featured-main">
            <div className="tag red">Bài nổi bật</div>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <div className="meta-line">
              <span>{featured.category}</span>
              <span>{featured.readTime}</span>
              <span>{featured.date}</span>
            </div>
          </div>
          <div className="featured-side">
            <div className="side-card">
              <h3>Điểm mạnh của hướng này</h3>
              <ul>
                <li>Giao diện hợp độc giả Việt hơn blog cũ</li>
                <li>Có thể mở rộng rất tốt cho SEO và nhịp xuất bản hàng ngày</li>
                <li>Dễ thêm trang chuyên mục, trang bài viết, trang dữ liệu</li>
                <li>Phù hợp để bạn vận hành như một media brand thực sự</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      <section id="latest" className="section">
        <SectionTitle
          title="Bài viết mới"
          sub="Cấu trúc phù hợp với một chuyên trang tin tức: bài nổi bật, bài mới, chuyên mục rõ ràng"
        />
        <div className="article-grid">
          {latest.map((item) => (
            <article key={item.slug} className="news-card">
              <div className="tag blue">{item.category}</div>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
              <div className="meta-line small">
                <span>{item.readTime}</span>
                <span>{item.date}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="signals" className="section">
        <SectionTitle
          title="Tín hiệu biên tập"
          sub="Khu vực này sau này có thể nối với cron job quét X của bạn để đổ tín hiệu vào mỗi ngày"
        />
        <div className="signal-grid">
          {data.signals.map((item) => (
            <article key={item.slug} className="signal-card">
              <div className="tag dark">{item.tag}</div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="vision" className="section vision-grid">
        <div className="vision-card large">
          <h2>Mình đề xuất tone & structure như sau</h2>
          <ul>
            <li><strong>Trang chủ:</strong> headline lớn, bài nổi bật, bài mới, tín hiệu thị trường, chuyên mục</li>
            <li><strong>Chuyên mục:</strong> Thị trường, Pháp lý, AI & Crypto, Geopolitics, On-chain, Góc nhìn</li>
            <li><strong>Chi tiết bài:</strong> typography đẹp, đọc thoải mái trên mobile, có box tóm tắt</li>
            <li><strong>Ngôn ngữ:</strong> ưu tiên tiếng Việt tự nhiên, gãy gọn, bớt “mùi dịch máy”</li>
            <li><strong>Thương hiệu:</strong> nhìn như một media brand thật, không chỉ là nơi đăng bài</li>
          </ul>
        </div>
        <div className="vision-card">
          <h3>Hợp với người Việt vì:</h3>
          <ul>
            <li>Bài ngắn gọn hơn, rõ ý hơn</li>
            <li>Ưu tiên chủ đề sát nhà đầu tư Việt</li>
            <li>Phần pháp lý và bối cảnh Việt Nam được đẩy mạnh</li>
            <li>Dễ đọc trên điện thoại</li>
          </ul>
        </div>
        <div className="vision-card">
          <h3>Bước tiếp theo mình khuyên làm</h3>
          <ol>
            <li>Thiết kế trang article riêng</li>
            <li>Thêm danh sách chuyên mục</li>
            <li>Làm header/footer xịn hơn</li>
            <li>Thêm chế độ xuất bản bài thật từ JSON/Markdown</li>
          </ol>
        </div>
      </section>
    </div>
  )
}
