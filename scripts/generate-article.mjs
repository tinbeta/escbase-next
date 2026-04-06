import fs from 'fs'
import path from 'path'

const rawPath = path.resolve('/Users/friday/Desktop/escbase-next/data/raw/signals.json')
const articlePath = path.resolve('/Users/friday/Desktop/escbase-next/data/articles/articles.json')

const raws = JSON.parse(fs.readFileSync(rawPath, 'utf8'))
const first = raws[0] || {
  title: 'No signal',
  summary: 'No signal'
}

const articles = [
  {
    slug: 'generated-from-xscan',
    category: 'AI Generated Draft',
    title: `Bài nháp từ tín hiệu: ${first.title}`,
    excerpt: first.summary,
    readTime: '6 min read',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }
]

fs.writeFileSync(articlePath, JSON.stringify(articles, null, 2))
console.log(`Updated ${articlePath}`)
