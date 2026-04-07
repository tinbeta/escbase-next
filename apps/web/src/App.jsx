import { useEffect, useMemo, useState } from 'react'

function SocialLink({ href, label }) {
  return (
    <a className="social-link" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  )
}

function ArticleCard({ item }) {
  return (
    <article className="content-card article-card">
      <div className="card-top">
        <span className="tiny-tag">{item.category}</span>
        <span className="tiny-date">{item.date}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.excerpt}</p>
      <div className="meta-line small">
        <span>{item.readTime}</span>
      </div>
    </article>
  )
}

function SignalCard({ item }) {
  return (
    <article className="content-card signal-card">
      <div className="card-top">
        <span className="tiny-tag alt">{item.tag}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
    </article>
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
    () => data.articles.filter((item) => !featured || item.slug !== featured.slug).slice(0, 4),
    [data.articles, featured]
  )

  return (
    <div className="page kitze-style">
      <section className="intro-block">
        <div className="intro-grid">
          <div className="intro-main">
            <div className="eyebrow">Crypto media • Phân tích • Tiếng Việt</div>
            <h1>Escbase</h1>
            <h2>Trang tin crypto dành cho người Việt — rõ, sâu, và đủ sắc để đọc mỗi ngày</h2>
            <p className="lead">
              Mình định hướng bản mới của Escbase theo kiểu landing page rất mạnh về thương hiệu,
              giống vibe của kitze.io: gọn, sang, nhiều block nội dung rõ ràng, nhưng tối ưu cho một
              media brand Việt Nam về crypto, blockchain, AI và bối cảnh thị trường.
            </p>

            <div className="quick-links">
              <a href="#featured">Bài nổi bật</a>
              <a href="#latest">Bài mới</a>
              <a href="#signals">Tín hiệu biên tập</a>
              <a href="#social">Mạng xã hội</a>
            </div>
          </div>

          <aside className="intro-side">
            <div className="profile-card">
              <div className="profile-label">Định vị thương hiệu</div>
              <h3>Crypto Intelligence cho người Việt</h3>
              <p>
                Không chỉ là nơi đăng bài. Đây nên là một “media home” — nơi người đọc vào để theo dõi
                narrative, pháp lý, dòng tiền và các xu hướng quan trọng nhất mỗi ngày.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section id="social" className="section-block">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Mạng xã hội</div>
            <h2>Kết nối với Escbase</h2>
          </div>
        </div>
        <div className="social-grid">
          <SocialLink href="https://www.youtube.com/@ESCBase" label="YouTube" />
          <SocialLink href="https://discord.gg/SMhy8RjDCf" label="Discord" />
          <SocialLink href="https://twitter.com/escbase" label="X / Twitter" />
          <SocialLink href="https://t.me/escbase" label="Telegram" />
        </div>
      </section>

      {featured && (
        <section id="featured" className="section-block feature-layout">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Bài nổi bật</div>
              <h2>Nội dung nên được đẩy lên hero position</h2>
            </div>
          </div>

          <div className="feature-grid">
            <article className="feature-card big">
              <div className="card-top">
                <span className="tiny-tag red">Featured</span>
                <span className="tiny-date">{featured.date}</span>
              </div>
              <h3>{featured.title}</h3>
              <p>{featured.excerpt}</p>
              <div className="meta-line">
                <span>{featured.category}</span>
                <span>{featured.readTime}</span>
              </div>
            </article>

            <div className="stack-cards">
              <div className="content-card note-card">
                <div className="eyebrow small">Vì sao bố cục này hợp?</div>
                <h3>Giống một media landing page hơn là blog cổ điển</h3>
                <p>
                  Kiểu bố cục này tạo cảm giác chuyên nghiệp, hiện đại, và rất hợp nếu sau này bạn đổ dữ liệu từ cron job vào đều đặn mỗi ngày.
                </p>
              </div>
              <div className="content-card note-card">
                <div className="eyebrow small">Phong cách</div>
                <h3>Tối giản, hiện đại, thiên về brand</h3>
                <p>
                  Ít chi tiết thừa, nhiều khoảng trắng, headline lớn, block rõ ràng — đúng tinh thần mà bạn nhắc tới với kitze.io.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="latest" className="section-block">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Bài viết mới</div>
            <h2>Các mảng nội dung chính</h2>
          </div>
        </div>
        <div className="cards-grid two">
          {latest.map((item) => (
            <ArticleCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      <section id="signals" className="section-block">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Editorial Radar</div>
            <h2>Tín hiệu biên tập</h2>
          </div>
        </div>
        <div className="cards-grid three">
          {data.signals.map((item) => (
            <SignalCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      <section className="section-block split-showcase">
        <div className="content-card showcase-card">
          <div className="eyebrow">Chuyên mục nên có</div>
          <h3>Thị trường, Pháp lý, AI & Crypto, Geopolitics, Góc nhìn</h3>
          <p>
            Đây là những trục nội dung rất hợp với độc giả Việt Nam và cũng giúp site có cấu trúc rõ để SEO tốt hơn về sau.
          </p>
        </div>
        <div className="content-card showcase-card">
          <div className="eyebrow">Bước tiếp theo</div>
          <h3>Làm tiếp trang bài viết chi tiết và trang chuyên mục</h3>
          <p>
            Khi đã có homepage đúng vibe, bước tiếp theo nên là article page đẹp và category page sạch để toàn bộ site nhìn ra đúng chất “newsroom premium”.
          </p>
        </div>
      </section>
    </div>
  )
}
