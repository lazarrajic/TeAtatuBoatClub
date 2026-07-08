// ── Pubd edit bridge (v5 — Phase 1) ──────────────────────────────────────────
// Loaded ONLY when this site runs inside the Pubd CMS visual editor (see the
// guard in main.jsx — an iframe + ?pubd-edit). Normal visitors never fetch this.
//
// Jobs: ① map data-cms elements, ② report the active section as the user scrolls
// (TERRITORY model — see below), ③ apply live text edits, ④ scroll/navigate on
// command (suppressing self-triggered scroll reports).

const ALLOWED_PARENTS = ['https://cms.pubd.io', 'http://localhost:3000']
let cmsOrigin = null

// "Home - Hero - Heading" → prefix "Home - Hero" (page-qualified section id)
function prefixOf(key) { return key.split(' - ').slice(0, 2).join(' - ') }

// key → [elements]. Rebuilt on load + after SPA navigation.
const fieldMap = new Map()
// Elements that vote for the active section: not inside a fixed/sticky container
// (the sticky navbar carries data-cms fields and would otherwise claim every
// scroll position).
let voters = []

function isPinned(el) {
  let n = el
  while (n && n !== document.body) {
    const pos = getComputedStyle(n).position
    if (pos === 'fixed' || pos === 'sticky') return true
    n = n.parentElement
  }
  return false
}

const repeaterMap = new Map() // repeater key → container element

function scan() {
  fieldMap.clear()
  repeaterMap.clear()
  voters = []
  document.querySelectorAll('[data-cms]').forEach((el) => {
    const key = el.getAttribute('data-cms')
    if (!key) return
    if (!fieldMap.has(key)) fieldMap.set(key, [])
    fieldMap.get(key).push(el)
  })
  document.querySelectorAll('[data-cms-repeater]').forEach((el) => {
    const key = el.getAttribute('data-cms-repeater')
    if (key) repeaterMap.set(key, el)
  })
  fieldMap.forEach((els, key) => {
    const prefix = prefixOf(key)
    for (const el of els) if (!isPinned(el)) voters.push({ el, prefix })
  })
  repeaterMap.forEach((el, key) => {
    if (!isPinned(el)) voters.push({ el, prefix: prefixOf(key) })
  })
}

// Template items of a repeater = direct children that carry/contain a field tag.
function itemsOf(container) {
  return Array.from(container.children).filter(
    (ch) => ch.matches('[data-cms-field]') || ch.querySelector('[data-cms-field]'),
  )
}

function post(msg) {
  window.parent.postMessage({ source: 'pubd-bridge', ...msg }, cmsOrigin || '*')
}

// ── Active section: the TERRITORY model (deterministic scrollspy) ─────────────
// Sections are ordered by where they currently start; each owns the page from
// its start until the next section's start. Untagged stretches (a video, a
// decorative block) belong to the section above them — no dead zones, no
// nearest-neighbour guessing. Active = the last section whose start sits above
// the anchor line (upper third of the viewport).
function activeSectionNow() {
  const anchor = window.innerHeight * 0.35
  const tops = new Map() // prefix → current min top
  for (const { el, prefix } of voters) {
    if (!el.getClientRects().length) continue
    const t = el.getBoundingClientRect().top
    const cur = tops.get(prefix)
    if (cur === undefined || t < cur) tops.set(prefix, t)
  }
  let best = null
  let bestTop = -Infinity
  tops.forEach((t, prefix) => {
    if (t <= anchor && t > bestTop) { bestTop = t; best = prefix }
  })
  if (best) return best
  // Above the first section (page top) → the first section
  let first = null
  let firstTop = Infinity
  tops.forEach((t, prefix) => { if (t < firstTop) { firstTop = t; first = prefix } })
  return first
}

let lastPrefix = null
function report() {
  const prefix = activeSectionNow()
  if (prefix && prefix !== lastPrefix) {
    lastPrefix = prefix
    post({ type: 'section', prefix })
  }
}

// ── Scroll handling + programmatic-scroll suppression ─────────────────────────
// While a `goto` smooth-scroll is in flight, the page sweeps past intermediate
// sections — reporting those would fight the user's chosen target. So during a
// commanded scroll we stay quiet until the scroll settles, then declare the
// target as the active section outright.
let debounceT = null
let suppress = false
let suppressTarget = null
let settleT = null
let safetyT = null

function finishSuppress() {
  if (!suppress) return
  suppress = false
  clearTimeout(settleT)
  clearTimeout(safetyT)
  if (suppressTarget) {
    lastPrefix = suppressTarget
    post({ type: 'section', prefix: suppressTarget })
    suppressTarget = null
  }
}

function onScroll() {
  if (suppress) {
    clearTimeout(settleT)
    settleT = setTimeout(finishSuppress, 170) // no scroll events for 170ms = settled
    return
  }
  clearTimeout(debounceT)
  debounceT = setTimeout(report, 100)
}

// ── Commands from the CMS ─────────────────────────────────────────────────────
// Apply a value to an element. Images: swap the src AND any CSS-background twin
// that painted the same source (the hidden-companion convention). Scope the
// twin search to the whole doc for flat fields, or the item for repeater fields.
function applyValue(el, value, scope) {
  if (el.tagName === 'IMG') {
    const old = el.getAttribute('src')
    el.src = value
    if (old) {
      ;(scope || document).querySelectorAll('[style]').forEach((n) => {
        if (n.style.backgroundImage && n.style.backgroundImage.includes(old)) {
          n.style.backgroundImage = `url(${value})`
        }
      })
    }
  } else {
    el.textContent = value
  }
}

function setField(key, value) {
  const els = fieldMap.get(key)
  if (!els) return
  for (const el of els) applyValue(el, value, document)
}

function setItemField(repeaterKey, index, field, value) {
  const container = repeaterMap.get(repeaterKey)
  if (!container) return
  const item = itemsOf(container)[index]
  if (!item) return
  const targets = item.matches(`[data-cms-field="${field}"]`)
    ? [item]
    : Array.from(item.querySelectorAll(`[data-cms-field="${field}"]`))
  for (const el of targets) applyValue(el, value, item)
}

// Add = clone the last template item (a clone IS what React would render),
// fill its fields, append. Remove/move = plain DOM surgery. Preview-only —
// the truth is the draft the panel saves.
function itemAdd(repeaterKey, values) {
  const container = repeaterMap.get(repeaterKey)
  if (!container) return
  const items = itemsOf(container)
  const template = items[items.length - 1]
  if (!template) return
  const clone = template.cloneNode(true)
  container.appendChild(clone)
  Object.entries(values || {}).forEach(([field, value]) => {
    const targets = clone.matches(`[data-cms-field="${field}"]`)
      ? [clone]
      : Array.from(clone.querySelectorAll(`[data-cms-field="${field}"]`))
    for (const el of targets) applyValue(el, String(value ?? ''), clone)
  })
}

function itemRemove(repeaterKey, index) {
  const container = repeaterMap.get(repeaterKey)
  if (!container) return
  itemsOf(container)[index]?.remove()
}

function itemMove(repeaterKey, from, to) {
  const container = repeaterMap.get(repeaterKey)
  if (!container) return
  const items = itemsOf(container)
  const node = items[from]
  if (!node || !items[to]) return
  container.insertBefore(node, from < to ? items[to].nextSibling : items[to])
}

function goTo(prefix) {
  for (const [key, els] of fieldMap) {
    if (!key.startsWith(prefix + ' - ')) continue
    const el = els.find((e) => e.getClientRects().length) || els[0]
    if (el) {
      suppress = true
      suppressTarget = prefix
      clearTimeout(safetyT)
      safetyT = setTimeout(finishSuppress, 1800) // never stay muted forever
      el.style.scrollMarginTop = '96px' // clear the sticky navbar
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      clearTimeout(settleT)
      settleT = setTimeout(finishSuppress, 300) // already-in-view = no scroll events
      return
    }
  }
}

function navigate(path) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate')) // react-router follows
  setTimeout(() => {
    scan()
    lastPrefix = null
    post({ type: 'page', path: window.location.pathname })
    report()
  }, 400)
}

window.addEventListener('message', (event) => {
  if (!ALLOWED_PARENTS.includes(event.origin)) return
  const msg = event.data
  if (!msg || msg.source !== 'pubd-cms') return
  cmsOrigin = event.origin
  if (msg.type === 'hydrate') Object.entries(msg.diff || {}).forEach(([k, v]) => setField(k, v))
  if (msg.type === 'set') setField(msg.key, msg.value)
  if (msg.type === 'set-item') setItemField(msg.key, msg.index, msg.field, msg.value)
  if (msg.type === 'item-add') itemAdd(msg.key, msg.values)
  if (msg.type === 'item-remove') itemRemove(msg.key, msg.index)
  if (msg.type === 'item-move') itemMove(msg.key, msg.from, msg.to)
  if (msg.type === 'goto') goTo(msg.prefix)
  if (msg.type === 'navigate') navigate(msg.path)
})

// ── Boot ──────────────────────────────────────────────────────────────────────
scan()
window.addEventListener('scroll', onScroll, { passive: true })
window.addEventListener('resize', onScroll, { passive: true })
post({ type: 'hello', version: 5, path: window.location.pathname })
setTimeout(report, 300)
