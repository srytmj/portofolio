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
    +layout.svelte              fonts, fixed nav, Lenis init, <main>
    +layout.js                  prerender = true
    +page.svelte                Hero + content sections
  lib/
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

## Next steps

- Replace placeholder projects and links in `src/lib/content/site.js`
- Pick a deploy adapter (`@sveltejs/adapter-static` for a pure static host) — currently `adapter-auto`
- Add real project detail pages / images
