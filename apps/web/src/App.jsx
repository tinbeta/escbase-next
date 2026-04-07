import { useEffect, useMemo, useState } from 'react'

function SocialLink({ href, label }) {
  return (
    <a className="social-link" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  )
}

function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

function dedupeVideos(items) {
  const seen = new Set()
  return items.filter((item) => {
    const normalized = item.title.replace(/\s*-\s*full$/i, '').trim().toLowerCase()
    if (seen.has(normalized)) return false
    seen.add(normalized)
    return true
  })
}

export default function App() {
  const [posts, setPosts] = useState([])
  const [videos, setVideos] = useState([])

  useEffect(() => {
    fetch('/blog.json')
      .then((res) => res.json())
      .then(setPosts)
      .catch(() => setPosts([]))

    fetch('/videos-feed.json')
      .then((res) => res.json())
      .then(setVideos)
      .catch(() => setVideos([]))
  }, [])

  const featuredPost = useMemo(() => posts.find((post) => post.featured) || posts[0], [posts])
  const latestPosts = useMemo(
    () => posts.filter((post) => post.url !== featuredPost?.url).slice(0, 3),
    [posts, featuredPost]
  )
  const latestVideos = useMemo(() => dedupeVideos(videos).slice(0, 3), [videos])
  const topicChips = useMemo(() => {
    const seen = new Set()
    return posts.filter((post) => {
      if (!post.tag || seen.has(post.tag)) return false
      seen.add(post.tag)
      return true
    }).slice(0, 5)
  }, [posts])

  return (
    <div className="shell">
      <aside className="sidebar">
        <a className="brand" href="/">
          <img src="/esclogo.png" alt="Escbase" />
          <div>
            <h1>Escbase</h1>
            <p>Crypto Intelligence</p>
          </div>
        </a>

        <p className="sidebar-copy">
          Báo cáo crypto hằng ngày, phân tích blockchain, AI và những chuyển động quan trọng của thị trường.
        </p>

        <nav className="nav-list">
          <a className="nav-item active" href="/">Trang chủ</a>
          <a className="nav-item" href="/blog">Bài viết</a>
          <a className="nav-item" href="/videos">Video</a>
        </nav>

        <div className="sidebar-note">
          <span className="sidebar-note-label">Trọng tâm</span>
          <strong>Crypto • AI • Policy • Market Structure</strong>
          <p>Giữ layout cũ, nhưng đậm chất newsroom hơn và bớt khoảng trống vô nghĩa.</p>
        </div>

        <div className="social-stack">
          <SocialLink href="https://www.youtube.com/@ESCBase" label="YouTube" />
          <SocialLink href="https://x.com/escbasexyz" label="X" />
        </div>
      </aside>

      <main className="main-column">
        <section className="hero-card hero-grid">
          <div>
            <span className="hero-badge">Escbase</span>
            <h2>Trang chủ nên nhìn như một media desk, không phải một bãi card rải đều.</h2>
            <p>
              Mình giữ tinh thần cũ của Escbase nhưng siết lại nhịp đọc: một bài lead rõ ràng,
              3 bài mới để quét nhanh, và video mới để kéo người đọc sang YouTube khi cần.
            </p>
            <div className="hero-actions">
              <a className="primary-btn" href="/blog">Xem bài viết</a>
              <a className="ghost-btn" href="/videos">Xem video</a>
            </div>
          </div>

          <div className="hero-panel-grid">
            <div className="hero-mini-panel stats-panel">
              <span className="mini-kicker">Snapshot</span>
              <div className="stat-row">
                <strong>{posts.length}+</strong>
                <span>bài phân tích</span>
              </div>
              <div className="stat-row">
                <strong>{dedupeVideos(videos).length}+</strong>
                <span>video nổi bật</span>
              </div>
              <div className="stat-row">
                <strong>{topicChips.length}</strong>
                <span>cụm chủ đề chính</span>
              </div>
            </div>

            <div className="hero-mini-panel topic-panel">
              <span className="mini-kicker">Narratives đang chạy</span>
              <div className="topic-list">
                {topicChips.map((topic) => (
                  <span
                    key={topic.tag}
                    className="topic-chip"
                    style={{ color: topic.tagColor, borderColor: `${topic.tagColor}44` }}
                  >
                    {topic.tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {featuredPost && (
          <section className="section-block featured-block">
            <div className="section-head">
              <div>
                <span className="section-kicker">Featured story</span>
                <h3>Bài đang đáng đọc nhất</h3>
              </div>
              <a href={featuredPost.url}>Mở bài</a>
            </div>

            <a className="featured-story" href={featuredPost.url}>
              <div className="featured-copy">
                <div className="meta-row">
                  <span
                    className="tag-chip"
                    style={{ color: featuredPost.tagColor, borderColor: `${featuredPost.tagColor}44` }}
                  >
                    {featuredPost.tag}
                  </span>
                  <span>{featuredPost.date}</span>
                </div>
                <h4>{featuredPost.title}</h4>
                <p>{featuredPost.excerpt}</p>
                <div className="meta-row bottom-row">
                  <span>{featuredPost.readTime}</span>
                  <span>→</span>
                </div>
              </div>

              <div className="featured-side-note">
                <span className="mini-kicker">Tại sao nó nên ở vị trí này?</span>
                <p>
                  Homepage cần một điểm neo biên tập rõ ràng. Nếu không có lead story, toàn bộ trang
                  sẽ trông như feed ngẫu nhiên — đọc xong không nhớ được Escbase đang ưu tiên điều gì.
                </p>
              </div>
            </a>
          </section>
        )}

        <section className="section-block">
          <div className="section-head">
            <div>
              <span className="section-kicker">Bài viết</span>
              <h3>3 bài mới để quét nhanh</h3>
            </div>
            <a href="/blog">Xem tất cả</a>
          </div>

          <div className="card-grid three-up">
            {latestPosts.map((post) => (
              <a key={post.url} className="content-card" href={post.url}>
                <div className="meta-row">
                  <span className="tag-chip" style={{ color: post.tagColor, borderColor: `${post.tagColor}44` }}>
                    {post.tag}
                  </span>
                  <span>{post.date}</span>
                </div>
                <h4>{post.title}</h4>
                <p>{post.excerpt}</p>
                <div className="meta-row bottom-row">
                  <span>{post.readTime}</span>
                  <span>→</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="section-head">
            <div>
              <span className="section-kicker">Video</span>
              <h3>3 video mới nhất</h3>
            </div>
            <a href="/videos">Xem tất cả</a>
          </div>

          <div className="card-grid three-up">
            {latestVideos.map((video) => (
              <a key={video.id} className="content-card video-card" href={video.url} target="_blank" rel="noreferrer">
                <div className="thumb-wrap">
                  <img src={video.thumb} alt={video.title} />
                </div>
                <div className="meta-row">
                  <span className="tag-chip video-chip">YouTube</span>
                  <span>{formatDate(video.published)}</span>
                </div>
                <h4>{video.title}</h4>
                <p>Video mới nhất từ kênh Escbase trên YouTube, đã lọc bớt duplicate title kiểu “Full”.</p>
                <div className="meta-row bottom-row">
                  <span>Xem video</span>
                  <span>→</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
