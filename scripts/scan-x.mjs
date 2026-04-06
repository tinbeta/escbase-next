import fs from 'fs'
import path from 'path'

const out = path.resolve('/Users/friday/Desktop/escbase-next/data/raw/signals.json')
const now = new Date().toISOString()
const sample = [
  {
    slug: `signal-${Date.now()}`,
    tag: 'xscan',
    title: 'Demo signal từ X scan pipeline',
    summary: `Lần scan gần nhất lúc ${now}. Bước tiếp theo là nối script này với bird home/read/thread thật.`
  }
]

fs.writeFileSync(out, JSON.stringify(sample, null, 2))
console.log(`Updated ${out}`)
