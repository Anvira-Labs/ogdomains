# OGDomains – The Domain Mall

A static 3D "mall" for showcasing premium domains. Scroll to walk a hallway; each storefront is a domain for sale. Built with Three.js (CDN importmap), plain ES modules, no build step.

## How it works
- **Hallway**: scrolling moves the camera down a 3D corridor (`js/main.js`); each door is a storefront themed per domain.
- **Stores**: clicking a storefront opens that domain's panel with tagline, price, why it's valuable, likely buyers and signals (`js/ui.js`, `js/art.js`).
- **Buy form**: a dummy form. It does not submit or store anything; wire it to a real backend/email service before relying on it.

## Run locally
```
python3 -m http.server 8000
```
Open http://localhost:8000 (ES modules need http, not `file://`).

## Domains
The mall holds every domain from the owner's category spreadsheet (144 doors in 12 wings). Doors are grouped by
category; each category has one storefront look, one store-panel wording and one concept-site theme
(`js/categories.js`). The mall is exactly the spreadsheet: no other domains are listed.

**Add or change an ordinary domain**
1. Edit the spreadsheet, then `python3 tools/build-catalogue.py ../temp/domain_categories.xlsx` (writes `js/catalogue.js`;
   only the domain and its category leave the sheet, never its risk/flip notes: this repo is public).
2. `node tools/build-index.mjs` (rewrites the crawlable list and JSON-LD in `index.html`).

**Hand-built stores** (optional, none now): add an entry to `HAND` in `js/domains.js` (with a `cat`, `site`, `facts` etc.) and a `sites/<id>/` folder. The old `sites/` folders (swami, bollywood, hindutample, vipan) are no longer linked from the mall.

**Concept sites**: every other domain opens `site/?d=<id>`: one template (`site/site.js`), one theme per category
(`site/themes/*.css`), brand name filled in from the domain. Personal-name domains open a **blank portfolio template**
(layout and rules in `site/PORTFOLIO.md`); fill one in via `js/profiles.js`.

**Scale**: only the stores near the camera are built (`streamStores` in `js/main.js`); the hall, ceiling lamps and
scroll length are sized from the number of doors.

## Structure
```
index.html   page, meta tags, importmap
404.html     not-found page
css/         styles
js/          domains.js (assembles stores), catalogue.js (generated), categories.js, profiles.js,
             main.js (scene + streaming), art.js (storefront art), ui.js (HUD/panels)
site/        concept-site template, themes/ (one per category), PORTFOLIO.md
tools/       build-catalogue.py, build-index.mjs
assets/      emblem.png
.github/workflows/pages.yml   GitHub Pages deploy
```

## Deploy
Push to `main`; the workflow publishes the repo root to GitHub Pages. Enable it once under Settings > Pages > Source: **GitHub Actions**. Before launch, replace the TODO placeholders (canonical, `og:image`, `twitter:image`) in `index.html` with absolute URLs.
