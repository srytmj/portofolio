# porto-web — Bakti Surya Atmaja (Maja)

Personal production engineering portfolio, technical architecture archive, and engineering journal built with **SvelteKit**, **Threlte (Three.js)**, **Tailwind CSS v4**, **GSAP ScrollTrigger**, and **Lenis Smooth Scroll**.

Designed in an uncompromising **YoRHa Military Android OS (NieR: Automata)** aesthetic merged with **3D Interactive Celestial Constellations (IAU 89 Figures)**.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview built site locally
```

---

## Key Highlights & Architecture

- **YoRHa Military OS Visual Language**:
  - **Zero Rounded (`rounded-none`)**: Pure 90° brutalist corners across all cards, modals, buttons, badges, inputs, and imagery.
  - **Zero Shadow / Flat**: Elimination of soft elevation drop-shadows in favor of razor-sharp hairline borders and tactical HUD corner brackets (`[ ┌ ┐ └ ┘ ]`).
  - **3px Technical Cross-Grid Background**: Dense micro-crosshair background grid (`background-size: 3px 3px`) running edge-to-edge across Home, Projects, and Blog pages.
  - **Seamless Atmospheric Hero Transition**: Smooth 260px grid dissolve mask and tactical HUD telemetry seam (`SYS_ENGAGE // SECTOR_02_MONITOR`) bridging the 3D celestial canvas into the content matrix.
  - **Interactive Crosshair Plus Custom Cursor**: Pixel-perfect SVG plus (`+`) cursor utilizing `mix-blend-mode: difference` for real-time mathematical color inversion over light/dark surfaces, scaling up dynamically on interactive targets (`scale: 1.4`).
- **Interactive 3D Celestial Sky (Hero)**:
  - Powered by **Threlte** (`@threlte/core`) with custom GLSL shaders.
  - Pointer proximity reveals true IAU constellation line figures and brightens star clusters across all 89 constellations (data derived from `d3-celestial`).
  - Automatic tier degradation: `full` (desktop/dedicated GPU), `lite` (mobile/integrated GPU), and `static` (CSS-only starfield for low-power, SSR, or `prefers-reduced-motion`).
- **Engineering Journal (Blog Engine)**:
  - Markdown-driven publishing via Vite eager glob (`import.meta.glob('/src/posts/*.md')`).
  - Full syntax highlighting powered by Prism.js with copy-to-clipboard buttons and language badges.
  - Interactive Mermaid.js architectural flowchart and sequence rendering.
  - Dual reading mode: OLED Black and Sepia Bunker Archive.
  - Responsive Table of Contents (TOC) with scroll-spy and auto-following viewport synchronization.
- **Projects & Production Architecture Archive**:
  - Filterable production archive by classification (`cloud`, `homelab`, `fullstack`, `automation`, `systems`).
  - Real-time search query filtering with zero-stagger instantaneous transitions.
  - Tactical specification inspector modal dialog with deep-dive routing (`/projects/[slug]`).
- **Tactical Command Palette (Ctrl+K / ⌘K)**:
  - Public visitor menu (site navigation, external profiles, constellation trivia launcher).
  - Owner-exclusive homelab infrastructure launcher (unlocked via passphrase and protected by Tailscale tailnet).

---

## Directory Structure

```
src/
├── app.css                    # Tailwind v4 variables, 3px tech grid, custom cursor rules
├── app.html                   # HTML document root, dynamic SVG favicons, boot-cover
├── posts/                     # Markdown source files for engineering journal articles
├── lib/
│   ├── blog/                  # Blog post parser (posts.js) & theme store (blogTheme.js)
│   ├── components/            # UI components (Hero, About, Skills, Portfolio, Contact)
│   │   ├── hero/              # Constellations.svelte (Threlte render loop & FPS watchdog)
│   │   ├── CustomCursor.svelte     # Inverting crosshair plus custom cursor
│   │   ├── LeftEdgeReturn.svelte   # Left margin hover trigger to return to Hero
│   │   ├── CornerTelemetry.svelte  # Astronomy HUD & LiveClock in bottom-left
│   │   ├── LiveClock.svelte        # Real-time WIB (Asia/Jakarta) digital clock
│   │   ├── ThemeToggle.svelte      # Global OLED / Sepia theme switch
│   │   ├── CommandPalette.svelte   # Ctrl+K modal launcher
│   │   ├── ProjectModal.svelte     # Specification inspector modal (borderless)
│   │   └── ResumeModal.svelte      # Interactive curriculum vitae modal
│   ├── content/
│   │   └── site.js            # SINGLE SOURCE OF TRUTH: all editable copy and projects
│   ├── panel/
│   │   └── services.js        # Homelab service endpoints (backed by env vars)
│   ├── scroll/
│   │   ├── heroTransition.js  # GSAP pin & scrub transition choreography
│   │   ├── sectionAnim.js     # ScrollTrigger per section with ResizeObserver
│   │   └── smoothScroll.js    # Lenis smooth scroll wired to GSAP ticker
│   └── stores/                # Svelte 5 state stores (theme, constellation)
├── routes/
│   ├── +layout.svelte         # Global layout shell (CustomCursor, fonts, app.css)
│   ├── (site)/
│   │   ├── +page.svelte       # Landing page (Hero, About, Skills, Portfolio, Contact)
│   │   ├── blog/              # Blog index (/blog) and article reader (/blog/[slug])
│   │   └── projects/          # Projects archive (/projects) & deep dive (/projects/[slug])
static/
├── assets/                    # Static image assets, covers, avatars
├── favicon.svg                # Default YoRHa reticle favicon
├── favicon-dark.svg           # OLED dark theme favicon
├── favicon-light.svg          # Sepia light theme favicon
└── cv-suryatmaja.pdf          # Downloadable curriculum vitae
```

---

## Content Management (How to Edit Skills, Projects, & Blog)

All public content is decoupled from layout components and lives in structured data files:

### 1. Editing Skills & Tech Stack Matrix
- **File**: [`src/lib/content/site.js`](./src/lib/content/site.js) (`export const stack`)
- **Layers**: `cloud & automation`, `systems & virtualization`, `networking & security`, `application runtime`.
- Each skill entry includes telemetry data for the **Pod 042 System Inspector**:
  ```javascript
  {
    id: 'NET-05',
    name: 'BGP Routing',
    badge: 'PROD',          // CORE | PROD | DAILY | LAB
    readiness: 94,          // 0-100% production readiness
    detail: 'Brief 1-sentence synopsis for the mini card...',
    role: 'Detailed architecture description for the inspector...',
    deployedAt: 'Real-world deployment topology (e.g. MikroTik CCR2004, WireGuard)',
    command: '$ bgpctl show summary\nTerminal simulator output...'
  }
  ```
- *Note*: If adding/removing skills, update the `count` numbers in `categories` inside [`src/lib/components/Skills.svelte`](./src/lib/components/Skills.svelte).

### 2. Editing Portfolio & Projects
- **File**: [`src/lib/content/site.js`](./src/lib/content/site.js) (`export const projects`)
- **Landing Page Featured**: The top 4 items (`projects.slice(0, 4)`) are highlighted on the main page. Put your most important work at the top of the array.
- **Projects Archive & Modals**: All items are accessible at `/projects` with instant search and category filters.
- **Deep-Dive Pages**: Each project with a `slug` automatically generates a dedicated technical page at `/projects/[slug]`.

### 3. Publishing New Blog Articles
- **Directory**: [`src/posts/`](./src/posts/)
- **File Convention**: `YYYY-MM-DD-slug-title.md` (e.g. `2026-07-03-membangun-ha-web-server-aws.md`)
- **Features**: YAML frontmatter (`title`, `date`, `description`, `categories`, `tags`, `cover`), Prism.js syntax highlighting with copy buttons, interactive Mermaid.js diagrams, and auto-following Table of Contents (TOC).

---

## Deployment Guide

### Option 1: GitHub Pages (Static Hosting)

All routes support static site generation (SSG) with `prerender = true`.

1. **Install Static Adapter**:
   ```bash
   npm install -D @sveltejs/adapter-static
   ```
2. **Update `svelte.config.js`**:
   ```javascript
   import adapter from '@sveltejs/adapter-static';

   export default {
     kit: {
       adapter: adapter({
         pages: 'build',
         assets: 'build',
         fallback: '404.html',
         precompress: false,
         strict: true
       })
     }
   };
   ```
3. **Build & Deploy via GitHub Actions**:
   Push to `main` branch with a GitHub Actions workflow uploading the `build/` artifact to GitHub Pages.

---

### Option 2: AWS EC2 (Ubuntu Linux Production)

For self-hosted production servers running on AWS EC2:

1. **Security Group Configuration**:
   - Inbound **Port 80 (HTTP)**: `0.0.0.0/0`
   - Inbound **Port 443 (HTTPS)**: `0.0.0.0/0`
   - Inbound **Port 22 (SSH)**: Your Administrator IP
2. **Server Setup (Ubuntu 22.04 / 24.04 LTS)**:
   ```bash
   # Update packages & install dependencies
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y nginx git curl certbot python3-certbot-nginx

   # Install Node.js 20 LTS
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```
3. **Deploy & Build**:
   ```bash
   sudo mkdir -p /var/www/portfolio
   sudo chown -R $USER:$USER /var/www/portfolio
   git clone https://github.com/srytmj/portofolio.git /var/www/portfolio
   cd /var/www/portfolio
   npm ci
   npm run build
   ```
4. **Nginx Configuration (`/etc/nginx/sites-available/portfolio`)**:
   ```nginx
   server {
       server_name suryatmaja.dev www.suryatmaja.dev;
       root /var/www/portfolio/build;
       index index.html;

       location / {
           try_files $uri $uri/ $uri.html /404.html;
       }

       location /_app/immutable/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       location /assets/ {
           expires 30d;
           add_header Cache-Control "public";
       }
   }
   ```
5. **SSL Certificate**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo certbot --nginx -d suryatmaja.dev -d www.suryatmaja.dev
   ```

---

### Option 3: Homelab Self-Hosted (Docker, Tailscale, & Cloudflare Tunnel)

For hosting in a local homelab cluster (mini-PC, Proxmox VE, Debian node):

1. **Containerization via Docker**:
   Build using a lightweight multi-stage Dockerfile:
   ```dockerfile
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/build /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```
2. **Run with Docker Compose (`docker-compose.yml`)**:
   ```yaml
   services:
     portfolio:
       build: .
       container_name: yorha-portfolio
       restart: unless-stopped
       ports:
         - "3080:80"
   ```
3. **Homelab Remote Access**:
   - **Cloudflare Zero Trust Tunnel**: Expose publicly without port forwarding:
     ```bash
     cloudflared tunnel route dns <tunnel-id> porto.suryatmaja.dev
     ```
   - **Tailscale Tailnet Ingress**: Serve privately within your tailnet:
     ```bash
     tailscale serve --bg 3080
     ```

---

## AI Agent & Developer Guidelines

If you are an AI Coding Agent (Antigravity, Claude, Cursor, Copilot, etc.) working on this repository, you **MUST** review:

👉 **[AI_GUIDELINES.md](./AI_GUIDELINES.md)**

**Critical Rules:**
- **Zero-Stagger Motion**: Animations must be instantaneous and simultaneous (`0.16s - 0.22s`). Domino delays and scale bounces are prohibited.
- **GSAP `clearProps` Safeguard**: Never use `clearProps: 'all'` on elements with inline styles; always use `clearProps: 'transform,opacity'` to avoid wiping out border and surface colors.
- **Changelog Obligation**: Any meaningful change, feature addition, or bugfix **must** be recorded in [`CHANGELOG.md`](./CHANGELOG.md) before committing.
- **Git Attribution**: AI agents must never add themselves as authors or co-authors. All commits must be 100% attributed to the repository owner (`Maja <suryatmaja.dev@gmail.com>`).
- **Commitlint Standard**: All commit messages must follow Conventional Commits (e.g. `feat: ...`, `fix: ...`, `docs: ...`).

---

## License & Copyright

© 2026 **Bakti Surya Atmaja**. All rights reserved.
All source code, design systems, and written articles are proprietary unless specified otherwise.
