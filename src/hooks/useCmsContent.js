import { useEffect, useState } from 'react'

// Fetches the live CMS content map at runtime so values the office edits
// (pricing, notice wording, office email) appear without a rebuild.
//
// The CMS API returns the content map DIRECTLY as the response body — keyed by
// the 3-level data-cms strings, e.g. data['Pricing - Work Bay - Member Booked Rate'].
// It is NOT wrapped in { content: ... }.
//
// `fallback` is an object of { 'CMS Key': defaultValue } used until the fetch
// resolves, or permanently if VITE_CMS_API is unset / the request fails. This
// keeps the booking flow working from content.js defaults during local dev.
const CMS_API = import.meta.env.VITE_CMS_API

export function useCmsContent(fallback = {}) {
  const [content, setContent] = useState(fallback)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!CMS_API) {
      setLoaded(true)
      return
    }
    let active = true
    fetch(CMS_API)
      .then((r) => r.json())
      .then((data) => {
        if (!active) return
        const raw = data ?? {}
        // Merge: prefer live CMS values, fall back to provided defaults.
        const merged = { ...fallback }
        for (const key of Object.keys(fallback)) {
          if (raw[key] != null && raw[key] !== '') merged[key] = raw[key]
        }
        setContent(merged)
        setLoaded(true)
      })
      .catch(() => {
        if (!active) return
        setLoaded(true) // keep fallback values
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { content, loaded }
}
