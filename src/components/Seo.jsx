import { useEffect } from 'react'

// Per-page SEO head-setter (Rule 15). Sets <title> and <meta name="description">
// from the page's content.js keys. No dependency — pure useEffect. The editable
// fields are carried by hidden companion data-cms spans on each page so the CMS
// scanner maps them; this component does the actual head update at runtime.
export default function Seo({ title, description }) {
  useEffect(() => {
    if (title) document.title = title
    if (description) {
      let m = document.querySelector('meta[name="description"]')
      if (!m) {
        m = document.createElement('meta')
        m.setAttribute('name', 'description')
        document.head.appendChild(m)
      }
      m.setAttribute('content', description)
    }
  }, [title, description])
  return null
}
