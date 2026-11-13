# ALAZAZI SOFT | العزعزي سوفت: Official website (V2)

Static bilingual site (Arabic RTL / English LTR). Plain HTML, CSS and one tiny JS file. No backend, no keys, no build step, no external requests.

## Structure
- `index.html`: language redirect (saved choice, else browser language, default Arabic)
- `ar/` and `en/`: the 8 pages each (index, about, products, services, contact, privacy, terms, brand)
- `css/style.css`: single stylesheet with design tokens (colors, type)
- `js/site.js`: saves the language choice in localStorage
- `assets/brand/`: original logo (PNG reference), SVG variants, PNG icons. `favicon.svg`
- `404.html`

## Run locally
`python3 -m http.server 8000` in this folder, then open http://localhost:8000

## Deploy to GitHub Pages (not done yet)
1. Create a repository and upload the contents of this folder to its root.
2. Settings > Pages > Source: Deploy from a branch > `main` / root.
3. Open the URL GitHub shows. All paths are relative, so project sites work.

## Editing
Edit the HTML files directly. Both language versions of a page must be changed together. Colors live in `:root` in `css/style.css`.

## Status
- Privacy policy and terms are UNAPPROVED DRAFTS. ALAYA's code has not been inspected; every unverified item is marked.
- SVG logos are approximate redraws of the original; a designer should refine them. Lockup text uses system fonts.
- Contact form is intentionally disabled; use the email link.
- Not published. Tested locally in headless Chromium (desktop 1280px and mobile 390px: no horizontal overflow, no console errors, language switch and mobile menu work). Not tested on real phones or other browsers.
- No sitemap.xml yet: it needs the final domain.

## V2 changes
New dark hero with animated orbit visual, principles strip, numbered cards, ALAYA showcase panel, process timeline, FAQ, call-to-action band, richer footer, mobile menu and scroll reveal (respects reduced motion). All pages, content and both languages are kept. No statistics, clients or testimonials were added.
