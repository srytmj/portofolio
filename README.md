# porto-web

Immersive portfolio — SvelteKit + Threlte (Three.js) + GSAP ScrollTrigger + Lenis.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

> **3D layer:** this is a SvelteKit app, so the Three.js layer uses **Threlte**
> (`@threlte/core`), the Svelte renderer for Three.js. *TresJS is Vue-only and
> cannot be used here* — Threlte is its Svelte equivalent.

## Structure

```
src/
  app.css                       Tailwind v4 theme (monochrome tokens) + Lenis + reduced-motion
  routes/
    +layout.svelte              minimal shell: app.css + fonts (shared by every route)
    +layout.js                  prerender = true (applies to all routes)
    (site)/+layout.svelte       the portfolio chrome: SideNav, CommandPalette, Lenis init, scroll-spy, <main>
    (site)/+page.svelte         Hero + content sections  →  served at /
  lib/
    panel/services.js           homelab service list, one URL per env var
    palette/
      owner.js                  owner unlock (localStorage flag + passphrase)
      trivia.js                 constellation facts shown in the public palette
    content/site.js             all editable copy (identity, about, skills, projects, contact)
    data/
      constellations.lines.json   d3-celestial IAU figure lines (RA/Dec), 89 constellations
      constellation-names.json    abbreviation to full name
    three/
      constellationData.js        builds merged line + star geometry from the data
      shaders/constellations.glsl.js  progressive figure reveal + twinkling stars
    scroll/
      heroTransition.js         GSAP ScrollTrigger, pin + scrub, mode full|lite|static
      smoothScroll.js           Lenis, wired into GSAP ticker (no-op under reduced-motion)
    actions/reveal.js           IntersectionObserver reveal action (reduced-motion aware)
    utils/device.js             tier detection: full | lite | static (+ ?tier= override)
    components/
      Hero.svelte               orchestrates canvas + name + transition, owns shrink/dormant state
      HeroCanvas.svelte         <Canvas> (Threlte) wrapper, owns dpr / downgrade
      hero/Constellations.svelte  star field + figure reveal, useTask loop, FPS watchdog
      HeroName.svelte           avant-garde variable-font / skew distortion typography
      StaticHero.svelte         CSS-only star field (also SSR / no-JS)
      Section.svelte About.svelte Skills.svelte Portfolio.svelte Contact.svelte
      CommandPalette.svelte      Ctrl+K palette — public (nav + constellation trivia) / owner (homelab)
```

## Hero — constellations

A monochrome star field. When the pointer moves near a constellation, its real
IAU figure lines draw in and its stars brighten; move away and it fades back to
plain stars. Pointer off the page = just stars. Touch devices auto-cycle through
the figures (brightest first). All 89 figures, data from
[d3-celestial](https://github.com/ofrohn/d3-celestial).

Each figure has a `uProgress` value (0..1) driven by pointer proximity on the
CPU; the shader reveals line segments in draw order and lifts star brightness
from it. On scroll the whole sky shrinks and fades (`shrink`, scrubbed by
ScrollTrigger).

## Fallback behaviour — works on any device

The tier is decided in `src/lib/utils/device.js` **before Three.js is downloaded**,
so weak devices never pay for the WebGL bundle at all.

| tier | when | hero |
|---|---|---|
| `full` | desktop + discrete/capable GPU | ~3200 background stars, antialiased lines, near-native dpr, pointer reveal, pinned scroll transition |
| `lite` | mobile, integrated GPU (Intel/Adreno/Mali/…), coarse pointer, ≤6 cores, 3G | ~1400 stars, dpr 1, touch auto-cycle, gentler transition |
| `static` | no WebGL, ≤4 cores, ≤3 GB RAM, `save-data`, 2G, or `prefers-reduced-motion` — **and SSR / no-JS** | `StaticHero.svelte`, CSS-only star field, no pin |

Runtime safety nets (`hero/Constellations.svelte`):

- **FPS watchdog** — samples frame time in ~1 s windows; first drops star count / twinkle / dpr, then falls back to `static` if it still can't hold 30 fps.
- **`webglcontextlost`** — mobile browsers killing the GL context under memory pressure → clean fall back to `static` instead of a frozen canvas.
- `<Canvas renderMode>` flips to `manual` and the sky hides once the hero scrolls fully out of view (`dormant`).
- QA overrides: `?tier=full|lite|static|auto`, `?watchdog=off`, live FPS on `canvas.dataset.fps`.

`prefers-reduced-motion` also stops the drift and twinkle, disables the name animation and the touch auto-cycle, drops the scroll pin, disables Lenis, and collapses reveal transitions. Pointer reveal still works.
The prerendered HTML already contains the static hero + all content, so the site is fully readable with JS disabled or on the slowest connection.

## Command palette (Ctrl+K / ⌘K)

One palette, two menus, decided by whether the visitor is the owner.
`src/lib/components/CommandPalette.svelte`, mounted once in `(site)/+layout.svelte`.
Desktop only — there is no mobile trigger yet.

| | public visitor | owner |
|---|---|---|
| menu | **Navigate** (jump to sections) · **Links** (blog, GitHub, LinkedIn, email) · **The night sky** (constellation facts — picking one loads the hero centred on that figure via `?find=`) | **only** the homelab launcher: every service grouped (Projects / Media / Tools / Infra) |
| source | `src/lib/palette/trivia.js` + `src/lib/content/site.js` | `src/lib/panel/services.js`, loaded with a dynamic `import()` so it never sits in the main bundle |

### Owner unlock

There is no backend and no login. "Owner" is a single `localStorage` flag
(`porto_owner`) set once per device: open the palette, type the passphrase,
press Enter. It sticks until you clear site data. A visitor never has the flag
and only ever sees the public menu.

- **Passphrase** lives at the top of `src/lib/palette/owner.js`
  (`const PASSPHRASE`). Change it to rotate access. Currently `sudo`.
- **Not a secret gate.** The real access control is your **Tailscale tailnet** —
  every service URL is a `*.ts.net` subdomain that only resolves for devices on
  your tailnet, so someone reading the service names out of the built JS still
  can't reach anything.
- To clear owner mode on a device, run `localStorage.removeItem('porto_owner')`
  in its console (or use `lock()` from `owner.js`).

### Service URLs (env vars)

Every link's `href` comes from an env var — nothing is hard-coded. One
`PUBLIC_<SERVICE>_URL` per service (SvelteKit's `PUBLIC_` prefix = exposed to
the client via `$env/static/public`).

```bash
cp .env.example .env
# then fill each line, e.g.:
#   PUBLIC_JELLYFIN_URL=http://jellyfin.<your-tailnet>.ts.net
```

A var left blank shows as a greyed-out "no url set" row. These are **baked in at
build time**, so run `npm run build` again after editing `.env`. (To set them at
runtime with no rebuild, switch to `@sveltejs/adapter-node` and read from
`$env/dynamic/public`.)

## AI Agent & Developer Guidelines

For AI coding agents working on this project (Antigravity, Claude, Cursor, Copilot, etc.), comprehensive instructions, architectural rules, blog authoring guides, and active roadmap tracking are maintained in:

👉 **[AI_GUIDELINES.md](./AI_GUIDELINES.md)**

**Key Ground Rules for AI Agents:**
- **Content lives in data files, not components**: Copy → `src/lib/content/site.js`. Homelab services → `src/lib/panel/services.js`. Constellation facts → `src/lib/palette/trivia.js`. Never hardcode copy into `.svelte` files.
- **Design Philosophy**: Brutalist, flat, `rounded-none` (zero border radius), and zero-shadow aesthetic inspired by **YoRHa (NieR: Automata OS)**.
- **Dark Mode Telemetry**: Preserve neon emerald accents (`#34D399`) for live network indicators, telemetry clocks, and active status dots.
- **Blog Engine**: Articles live in `src/posts/YYYY-MM-DD-slug.md` with YAML frontmatter, supporting Prism.js syntax highlighting and Mermaid.js architecture diagrams.
- **Always verify build**: `npm run build` must pass cleanly before finishing any turn.

## Deployment & Production

```bash
# Build the application
npm run build

# Preview production build locally
npm run preview
```

The application uses SvelteKit with `@sveltejs/adapter-auto`. It can easily be adapted for:
- **Static Hosting (Cloudflare Pages, GitHub Pages, Vercel, S3)**: via `@sveltejs/adapter-static` (all routes support SSG/prerendering).
- **Self-Hosted Homelab (Docker / Node server)**: via `@sveltejs/adapter-node`.

