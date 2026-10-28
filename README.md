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

## Add a domain
Edit `js/domains.js` and add an entry:

```js
{
  id: 'example',          // unique slug
  name: 'Example.com',
  tagline: 'Short hook.',
  theme: '...',           // storefront theme (match existing entries)
  accent: '#f5c26b',      // primary colour
  accent2: '#...',        // secondary colour
  sale: true,             // for sale?
  price: '...',
  why: '...',             // why it's valuable
  buyers: ['...'],        // likely buyers
  signals: ['...']        // supporting signals/metrics
}
```
Copy an existing entry to see the exact value formats. Also update the JSON-LD list in `index.html`.

## Structure
```
index.html   page, meta tags, importmap
404.html     not-found page
css/         styles
js/          domains.js (data), main.js (scene), art.js (storefront art), ui.js (HUD/panels)
assets/      emblem.png
.github/workflows/pages.yml   GitHub Pages deploy
```

## Deploy
Push to `main`; the workflow publishes the repo root to GitHub Pages. Enable it once under Settings > Pages > Source: **GitHub Actions**. Before launch, replace the TODO placeholders (canonical, `og:image`, `twitter:image`) in `index.html` with absolute URLs.
