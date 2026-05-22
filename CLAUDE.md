# MayasPortfolio

Personal portfolio website for Maya Walsh — live at https://bymayawalsh.design

## Stack
- React + Vite (not plain HTML)
- Tailwind CSS
- Deployed via GitHub → https://github.com/mayawalsh19-art/mayas-portfolio
- Auto-deploys on push to `main`

## Dev server
```
npm run dev
```

## Fonts loaded (index.html)
- Lexend 400/500/700/900
- Bely Display (Wild Fire card)
- Libre Caslon Display
- Space Grotesk 700
- Ultra

## IMPORTANT — Images
All images must be saved as local files in `public/` and referenced with a root-relative path like `/folder/file.png`.

**Never use `https://www.figma.com/api/mcp/asset/...` URLs in source code.** These are temporary session URLs that expire when the terminal closes and will show as broken images on the live site. Always download assets and save them to `public/` first.

Current image folders:
- `public/credify/` — Credify icon
- `public/dutchbros/` — Dutch Bros app screenshots + redesign
- `public/selfportrait/` — portrait poster + single icon crop
- `public/wildfire/` — spread images + title crop
- `public/hellgrim/` — slides, hero, glyphs, title crop
- `public/fanformation/` — posters + showcase
- `public/hero/` — hero animation frames
- `public/mw_logo_clean.png` — MW logo mark, transparent background
- `public/mw_hero_logo.png` — original MW logo with background

## Figma MCP
Connected for design reference. Use `get_screenshot` / `get_design_context` to pull assets, then immediately `curl` them into `public/` before referencing in code.
