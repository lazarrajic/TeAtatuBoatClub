// One-off: downloads the club's anniversary gallery photos into public/images/gallery/.
// Reads scripts/gallery-urls.txt (URLs separated by literal or real newlines),
// downloads each at the web-sized Wix transform, and writes gallery-001.jpg … etc.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'images', 'gallery')
await mkdir(outDir, { recursive: true })

let raw = await readFile(join(root, 'scripts', 'gallery-urls.txt'), 'utf8')
raw = raw.trim().replace(/^"|"$/g, '') // strip wrapping quotes if present
const urls = raw
  .split(/\\n|\n/) // handle both literal "\n" and real newlines
  .map((s) => s.trim())
  .filter((s) => s.startsWith('http'))

console.log(`Found ${urls.length} URLs`)

const pad = (n) => String(n).padStart(3, '0')
let ok = 0
let fail = 0

async function fetchWithRetry(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return Buffer.from(await res.arrayBuffer())
    } catch (e) {
      if (i === tries - 1) throw e
      await new Promise((r) => setTimeout(r, 500 * (i + 1)))
    }
  }
}

// Simple concurrency pool
const CONCURRENCY = 6
let idx = 0
async function worker() {
  while (idx < urls.length) {
    const myIdx = idx++
    const url = urls[myIdx]
    const name = `gallery-${pad(myIdx + 1)}.jpg`
    try {
      const buf = await fetchWithRetry(url)
      await writeFile(join(outDir, name), buf)
      ok++
      if (ok % 20 === 0) console.log(`  …${ok} downloaded`)
    } catch (e) {
      fail++
      console.warn(`  ✗ ${name}: ${e.message}`)
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker))
console.log(`Done. ${ok} downloaded, ${fail} failed → public/images/gallery/`)

// Emit the content.js array for convenience
const list = Array.from({ length: ok }, (_, i) => `    '/images/gallery/gallery-${pad(i + 1)}.jpg'`).join(',\n')
console.log(`\nPaste into content.js gallery_photos:\n[\n${list}\n]`)
