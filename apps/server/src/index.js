import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '../../..')
const app = express()
const port = 8787

app.use(cors())
app.use(express.json())

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return fallback
  }
}

app.get('/api/dashboard', (req, res) => {
  const signals = readJson(path.join(root, 'data', 'raw', 'signals.json'), [
    {
      slug: 'swift-ethereum-style-signal',
      tag: 'tradfi',
      title: 'Tín hiệu kiểu SWIFT x blockchain',
      summary: 'Các câu chuyện nơi tài chính truyền thống dùng hạ tầng blockchain luôn là nguồn bài mạnh cho ESC Base.'
    },
    {
      slug: 'vn-crypto-regulation',
      tag: 'regulation',
      title: 'Việt Nam siết khung pháp lý crypto',
      summary: 'Các bài liên quan pháp lý tại Việt Nam có tiềm năng hút đúng tệp độc giả của ESC Base.'
    },
    {
      slug: 'ai-agent-crypto',
      tag: 'ai',
      title: 'AI agents + crypto workflow',
      summary: 'Góc giao thoa AI x crypto x creator tools là một mảng rất hợp để làm thương hiệu khác biệt.'
    }
  ])

  const articles = readJson(path.join(root, 'data', 'articles', 'articles.json'), [
    {
      slug: 'demo-article-1',
      category: 'Pháp Lý Crypto',
      title: 'Admin Group Crypto Tại Việt Nam Sắp Hết Vùng Xám',
      excerpt: 'Một dạng bài phân tích dài, xuất phát từ tín hiệu X và được biên tập lại thành bài báo chất lượng cao.',
      readTime: '9 min read',
      date: 'Apr 06, 2026'
    }
  ])

  res.json({ signals, articles })
})

app.listen(port, () => {
  console.log(`ESCBase Next API running at http://localhost:${port}`)
})
