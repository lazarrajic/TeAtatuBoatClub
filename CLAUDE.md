# SiteMog client site

This site is managed by the SiteMog CMS: the CMS scans this repo for `data-cms*` fields and **publishes content commits to `main`**. Netlify auto-deploys `main`.

## Working rules

1. **Pull before editing.** The CMS may have published content commits since you last looked.
2. **All code work happens on a branch.** Never commit code directly to `main` — a client can trigger a deploy of `main` at any moment by clicking Publish in the CMS, which would ship half-finished work. Merge to `main` only when shippable. (Docs-only changes may go direct.)
3. **`content.js` belongs to the CMS** for any field it maps. Don't hand-edit mapped values — change them in the CMS dashboard. Structural additions (new keys for new sections) are fine in code.
4. **After changing JSX structure** (new `data-cms` fields, repeaters, galleries), the CMS must **re-scan** this repo before the new fields appear in the dashboard.
5. **Validate before pushing structural changes:** `node ~/.claude/skills/cms-check/check.mjs .` — ship only at 0 fails.

Conventions: `~/Documents/code/sitemog-toolkit/CMS_WEBSITE_PROMPT.md`.

## One-time setup per clone

```bash
git config core.hooksPath .githooks   # enables the push guard (scaffold.sh does this for you)
```

## Site-specific

- `src/booking/` is a dynamic app module (Netlify Functions + Supabase) — it must contain **zero** `data-cms*` attributes. Spec: `~/Documents/code/sitemog-toolkit/modules/BOOKING_MODULE.md`.
