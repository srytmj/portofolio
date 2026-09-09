# AI Agent Development Guidelines & System Architecture

Dokumentasi ini dibuat khusus sebagai panduan operasional komprehensif bagi **AI Coding Agent** (Antigravity, Claude, Cursor, Copilot, dsb.) dan developer yang mengerjakan, memodifikasi, merawat, atau mendeploy codebase portofolio ini. **Seluruh AI Agent WAJIB membaca dan mematuhi seluruh aturan dalam dokumen ini sebelum melakukan perubahan kode.**

---

## 1. Identitas, Visi Proyek, & Desain YoRHa

- **Pemilik & Kontributor Tunggal**: Bakti Surya Atmaja (Maja) — *Full-Stack Developer & Cloud/Homelab Infrastructure Engineer*.
- **Konsep Desain**: **YoRHa Military Android Sci-Fi (NieR: Automata OS)** dipadukan dengan **Peta Rasi Bintang Interaktif (3D Celestial Constellations)**.
- **Filosofi Visual**:
  - **Zero Rounded (`rounded-none`)**: Sudut siku 90° murni tanpa radius pada semua kartu, tombol, badge, input, modal, dan thumbnail gambar.
  - **Flat & Brutalist (Zero Shadow)**: Dilarang keras menggunakan `box-shadow` atau `text-shadow` berlebih.
  - **Palet Tema**:
    - **Dark Mode (Default)**: 100% True Black OLED (`#000000`), teks krem gading (`#DCDACF`), garis pembatas abu-abu gelap (`#1E1E1E`), aksen gading militer (`#C4B693`), dan aksen **Neon Emerald (`#34D399`)** untuk telemetri jaringan / buffer aktif.
    - **Light Mode (Bunker Archive / Pod Menu)**: Krem keabu-abuan kusam khas menu pause NieR (`#D6D4C8` background, `#C8C6B9` surface, `#454138` teks cokelat-kelabu militer).
  - **Background Grid Teknis 3px**: Pola kisi crosshair mikro rapat (`background-size: 3px 3px`) dengan dua lapis linear-gradient (horizontal & vertikal 1px). Variabel `--cross-line` disetel `rgba(255, 255, 255, 0.07)` di Dark Mode dan `rgba(0, 0, 0, 0.06)` di Light Mode.
  - **Transisi Latar Belakang Hero ke About**: Dilengkapi atmospheric blend di bagian bawah Hero, garis pembatas taktis YoRHa HUD (`SYS_ENGAGE // SECTOR_02_MONITOR`), dan *grid dissolve mask* setinggi ~260px agar pola grid 3px meluruh halus tanpa potongan tajam (*hard cut*).
  - **Custom Cursor Plus (`+`)**: Menggunakan kursor tanda tambah crosshair SVG dengan efek inversi warna dinamis (`mix-blend-mode: difference; color: #ffffff`). Kursor otomatis membesar (`scale: 1.4`) saat hover ke elemen interaktif dan mengecil sejenak (`scale: 0.85`) saat diklik. Hanya aktif pada perangkat bermouse (`@media (pointer: fine)`).
  - **Tipografi Hybrid 3-Lapis**:
    - `font-display` (**Epilogue**): Judul utama, heading section, nama proyek, dan display angka.
    - `font-serif` (**Baskervville**): Narasi editorial prosa, kutipan filosofis, dan ringkasan artikel (*italic*).
    - `font-mono` (**Space Mono / Fira Code**): Kode indeks (`SEC // 01`), telemetri jam WIB, status Pod, label filter, dan syntax blok kode.
  - **ATURAN KETAT ANIMASI (ZERO STAGGER / NO AWKWARD DELAYS)**:
    - **DILARANG KERAS** menggunakan `stagger` bertingkat, delay domino beruntun, atau animasi memantul (`scale: 0.96/0.98`) pada kartu, filter tombol, kategori, tag, atau hasil pencarian.
    - Setiap animasi kemunculan atau perpindahan filter **WAJIB SIMULTAN & SEREMPAK**: Seluruh elemen muncul bersamaan secara instan (`duration: 0.16s - 0.22s`, `y: 4-8px -> 0`, `opacity: 0 -> 1`, `ease: power2.out`).
    - Interaksi tombol & kartu harus memberikan respon taktil instan (`hover:-translate-y-0.5 active:translate-y-0`).

---

## 2. Struktur Direktori & Aturan Single Source of Truth

```
src/
├── app.css                    # Global tokens, theme variables, grid 3px, custom cursor
├── app.html                   # HTML shell, favicon dinamis SVG, boot-cover
├── posts/                     # Markdown file artikel blog (Sumber data artikel)
├── lib/
│   ├── blog/                  # posts.js (parser markdown), blogTheme.js
│   ├── components/            # Komponen UI utama
│   │   ├── hero/              # Constellations.svelte (Three.js WebGL rendering loop)
│   │   ├── CustomCursor.svelte     # Cursor plus dengan difference blending
│   │   ├── LeftEdgeReturn.svelte   # Hover rail margin kiri untuk balik ke Hero
│   │   ├── CornerTelemetry.svelte  # HUD astronomi & LiveClock sudut kiri bawah
│   │   ├── LiveClock.svelte        # Jam real-time Asia/Jakarta (WIB)
│   │   ├── ThemeToggle.svelte      # Switch tema global
│   │   ├── CommandPalette.svelte   # Ctrl+K launcher publik & homelab owner
│   │   ├── ProjectModal.svelte     # Modal inspektor spesifikasi proyek (borderless)
│   │   └── ResumeModal.svelte      # Modal curriculum vitae interaktif
│   ├── content/
│   │   └── site.js            # SEMUA COPY / TEKS PORTFOLIO DIEDIT DI SINI (Single Source of Truth)
│   ├── panel/
│   │   └── services.js        # Daftar service homelab untuk command palette
│   ├── scroll/
│   │   ├── heroTransition.js  # GSAP pin & scrub transisi Hero
│   │   ├── sectionAnim.js     # ScrollTrigger per-seksi + ResizeObserver otomatis
│   │   └── smoothScroll.js    # Lenis smooth scroll terintegrasi ke ticker GSAP
│   └── stores/                # State rasi bintang, tema, dsb.
├── routes/
│   ├── +layout.svelte         # Root layout: CustomCursor, Google Fonts, global CSS
│   ├── (site)/
│   │   ├── +page.svelte       # Landing page (Hero, About, Skills, Portfolio, Contact)
│   │   ├── blog/              # Engineering Journal (/blog & /blog/[slug])
│   │   └── projects/          # Projects catalogue (/projects & /projects/[slug])
static/
├── assets/                    # Gambar profil, cover artikel, icon
├── favicon.svg                # Favicon default YoRHa reticle
├── favicon-dark.svg           # Favicon khusus tema OLED Black
├── favicon-light.svg          # Favicon khusus tema Krem/Sepia
└── cv-suryatmaja.pdf          # Berkas CV offline
```

> [!IMPORTANT]
> **Aturan Pemisahan Konten**: Dilarang keras melakukan *hardcode* teks profil, data proyek, deskripsi keahlian, atau tautan kontak langsung ke dalam file komponen `.svelte`. Seluruh data publik wajib didefinisikan di [`src/lib/content/site.js`](file:///c:/Users/saket/Documents/Github/portofolio/src/lib/content/site.js).

---

## 3. Panduan AI Agent: Menulis & Menerbitkan Artikel Blog Baru

Modul Engineering Journal membaca file Markdown mentah dari `src/posts/*.md` via Vite glob (`import.meta.glob`). Ikuti format ketat di bawah saat membuat atau menyunting artikel.

### A. Format Nama File
File wajib disimpan di folder `src/posts/` dengan konvensi nama:
`YYYY-MM-DD-kebab-case-judul-artikel.md`  
*(Contoh: `2026-07-03-membangun-ha-web-server-aws.md`)*

### B. Frontmatter Wajib (YAML)
Setiap artikel harus diawali dengan frontmatter valid:
```markdown
---
title: "Membangun High-Availability Web Server di AWS"
date: "2026-07-03"
description: "Panduan implementasi arsitektur web server tangguh dengan Application Load Balancer, Auto Scaling Group, dan Multi-AZ RDS."
categories: ["Cloud Infrastructure", "AWS Architecture"]
tags: ["AWS", "Terraform", "Nginx", "Docker", "DevOps"]
author: "Bakti Surya Atmaja"
published: true
cover: "/assets/img/posts/260703/cover.png"
---
```

### C. Pedoman Konten & Fitur Khusus:
1. **Diagram Arsitektur (Mermaid.js)**:
   Gunakan fenced code block `mermaid`. Parser blog otomatis merender flowchart SVG taktis yang responsif terhadap tema:
   ````markdown
   ```mermaid
   graph TD
     Client[HTTPS Client Traffic] --> ALB[Application Load Balancer]
     ALB --> Web1[EC2 Node AZ-a: Nginx]
     ALB --> Web2[EC2 Node AZ-b: Nginx]
     Web1 --> DB[(Aurora Multi-AZ Primary)]
     Web2 --> DB
   ```
   ````
2. **Blok Kode & Syntax Highlighting (Prism.js)**:
   Sertakan selalu identifier bahasa. Bahasa yang didukung:
   `bash`, `javascript`, `typescript`, `json`, `yaml`, `python`, `sql`, `docker`, `nginx`, `ini`, `markdown`, `css`, `html`.
   Setiap blok kode otomatis dilengkapi tombol salin (*one-click copy button*) dan label bahasa.
3. **Penyimpanan Aset Gambar**:
   - Simpan gambar di folder `static/assets/img/posts/YYMMDD/slug-artikel/nama-gambar.png`.
   - Di Markdown, panggil menggunakan path absolut `/assets/img/posts/YYMMDD/slug-artikel/nama-gambar.png`.
4. **Heading untuk Table of Contents (TOC)**:
   Gunakan struktur `## Subheading 1` (H2) dan `### Sub-point` (H3). Reader blog otomatis membuat navigasi Table of Contents di sidebar yang menyorot heading aktif dan auto-scroll mengikuti progres pembaca.
5. **Callout / Alerts**:
   Gunakan format alert standar GitHub:
   ```markdown
   > [!NOTE]
   > Konfigurasi ini memerlukan IAM Role dengan policy minimal.

   > [!WARNING]
   > Pastikan Security Group tidak membuka port 22 ke public 0.0.0.0/0.
   ```

---

## 4. SOP Maintenance & Pemeliharaan Codebase

Setiap AI Agent yang menjalankan tugas pemeliharaan atau debugging wajib mematuhi aturan berikut:

### A. Larangan Keras GSAP `clearProps: 'all'`
- **PANTANGAN FATAL**: Jangan pernah menggunakan `clearProps: 'all'` pada animasi elemen kartu, panel modal, atau elemen yang memiliki inline style `border-color` atau `background-color`.
- **Alasan**: `clearProps: 'all'` menghapus seluruh deklarasi inline style setelah animasi selesai, menyebabkan warna border jatuh ke `currentColor` bawaan Tailwind (putih terang pada Dark Mode).
- **Solusi Wajib**: Selalu gunakan `clearProps: 'transform,opacity'` agar hanya properti posisi dan transparansi yang dibersihkan.

### B. Sinkronisasi ScrollTrigger & Lenis pada DOM Dinamis
- Jika menambahkan fitur yang mengubah tinggi section secara dinamis (seperti filter kartu, accordion, paginasi, atau tab):
  1. Jalankan `await tick();` di Svelte.
  2. Panggil `window.__lenis?.resize();`.
  3. Panggil `ScrollTrigger.refresh();`.
  4. Jalankan timeout kedua (~220ms) setelah animasi elemen selesai agar titik picu (*trigger bounds*) section berikutnya tidak tertunda (*delay*).
- Setiap section utama yang dibungkus `Section.svelte` telah dilengkapi `ResizeObserver` otomatis di `src/lib/scroll/sectionAnim.js`. Pertahankan mekanisme ini.

### C. Konsistensi Svelte 5 Runes
- Codebase ini menggunakan **Svelte 5 Runes murni**.
- Gunakan `$state()`, `$derived()`, `$derived.by()`, `$effect()`, dan `$props()`.
- **Dilarang keras** menggunakan sintaks usang Svelte 3/4 seperti `export let prop`, `$: reactiveVar = ...`, atau deklarasi `let x` tanpa `$state()`.

### D. Verifikasi Build Sebelum Mengakhiri Giliran
- Setiap perubahan kode **WAJIB diverifikasi** dengan menjalankan:
  ```bash
  npm run build
  ```
- Pastikan build selesai dengan **exit code 0** tanpa syntax error atau chunk missing.

---

## 5. Panduan Deployment: GitHub Pages & AWS EC2

### A. Opsi 1: Deploy ke GitHub Pages (Static Hosting)

Aplikasi telah mendukung full prerendering (SSG) via `src/routes/+layout.js` (`export const prerender = true;`).

1. **Konfigurasi Adapter**:
   Instal `@sveltejs/adapter-static` jika belum ada:
   ```bash
   npm install -D @sveltejs/adapter-static
   ```
   Perbarui `svelte.config.js`:
   ```javascript
   import adapter from '@sveltejs/adapter-static';

   const config = {
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
   export default config;
   ```
2. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy Portfolio to GitHub Pages

   on:
     push:
       branches: [main]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: "pages"
     cancel-in-progress: false

   jobs:
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - name: Checkout Code
           uses: actions/checkout@v4

         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: 'npm'

         - name: Install Dependencies
           run: npm ci

         - name: Build Project
           run: npm run build

         - name: Setup Pages
           uses: actions/configure-pages@v5

         - name: Upload Artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: 'build/'

         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

---

### B. Opsi 2: Deploy ke AWS EC2 (Ubuntu Linux Production)

Arsitektur produksi direkomendasikan menggunakan Ubuntu 22.04 / 24.04 LTS, Nginx web server, Node.js 20 LTS, PM2 Process Manager, dan SSL gratis Let's Encrypt Certbot.

#### 1. Persiapan AWS Security Group
Pastikan Security Group instance EC2 membuka port berikut:
- **Port 80 (HTTP)**: Inbound `0.0.0.0/0` (untuk validasi Let's Encrypt & redirect ke HTTPS).
- **Port 443 (HTTPS)**: Inbound `0.0.0.0/0` (lalu lintas aman publik).
- **Port 22 (SSH)**: Inbound IP admin Anda (akses maintenance terminal).

#### 2. Setup Server EC2 (SSH First-Time Init):
```bash
# Update sistem dan instal paket dasar
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git curl certbot python3-certbot-nginx

# Instal Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instal PM2 Process Manager
sudo npm install -g pm2
```

#### 3. Clone Repository & Build Aplikasi:
```bash
# Clone repo ke direktori aplikasi
sudo mkdir -p /var/www/portfolio
sudo chown -R $USER:$USER /var/www/portfolio
git clone https://github.com/srytmj/portofolio.git /var/www/portfolio
cd /var/www/portfolio

# Instal dependensi dan build
npm ci
npm run build
```

#### 4. Konfigurasi Nginx Server Block:
Buat file konfigurasi `/etc/nginx/sites-available/portfolio`:
```nginx
server {
    server_name suryatmaja.dev www.suryatmaja.dev;

    # Static prerendered hosting
    root /var/www/portfolio/build;
    index index.html;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    location / {
        try_files $uri $uri/ $uri.html /404.html;
    }

    # Cache Control untuk static immutable assets
    location /_app/immutable/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Static assets (images, fonts, favicons)
    location /assets/ {
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

Aktifkan konfigurasi dan generate sertifikat SSL otomatis:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Generate SSL Let's Encrypt
sudo certbot --nginx -d suryatmaja.dev -d www.suryatmaja.dev
```

#### 5. Script Deployment Cepat (`deploy.sh` di server):
```bash
#!/bin/bash
set -e
cd /var/www/portfolio
git pull origin main
npm ci
npm run build
sudo systemctl reload nginx
echo "Deployment berhasil diperbarui pada $(date)!"
```

---

## 6. SOP Menambah & Memodifikasi Fitur (Adding / Modifying Features)

Setiap penambahan fitur baru atau modifikasi fitur yang sudah ada wajib mengikuti alur kerja berikut:

1. **Analisis Dampak Visual & Theming**:
   - Pastikan fitur baru mendukung penuh **Dark Mode (OLED Black)** dan **Light Mode (YoRHa Krem)**.
   - Gunakan CSS variables dari `src/app.css` (`var(--yorha-bg)`, `var(--yorha-surface)`, `var(--yorha-border)`, `var(--yorha-text-primary)`, `var(--yorha-accent)`). Dilarang hardcode warna heksadesimal baru sembarangan.
   - Elemen baru **harus `rounded-none`** dan bebas dari bayangan melayang.
2. **Kustom Kursor Compatibility**:
   - Elemen yang dapat diklik wajib memiliki kelas `cursor-pointer` atau tag semantik (`<button>`, `<a>`, `<input>`) agar custom plus cursor otomatis membesar (`scale: 1.4`).
3. **Dukungan Responsif & Mobile**:
   - Uji tampilan pada breakpoint `sm` (640px), `md` (768px), dan `lg` (1024px+).
   - Pastikan padding dan touch target nyaman di layar kecil tanpa horizontal overflow.
4. **Verifikasi Build**:
   - Eksekusi `npm run build` dan pastikan tidak ada error kompilasi Svelte/Vite.

---

## 7. Kewajiban Penggunaan CHANGELOG & Standar Git Commit

> [!CAUTION]
> **ATURAN MUTLAK AGEN AI TERKAIT GIT & DOKUMENTASI**:
> 1. **DILARANG MENGAKU-NGAKU / MENAMBAHKAN AI SEBAGAI KONTRIBUTOR**:
>    - Dilarang keras menambahkan baris `Co-authored-by: Antigravity <...>`, `Co-authored-by: Claude <...>`, atau atribusi bot AI apapun ke dalam pesan git commit ataupun konfigurasi git.
>    - Seluruh commit **WAJIB 100% diatribusikan secara murni kepada pemilik repositori**:  
>      `Author: Maja <suryatmaja.dev@gmail.com>`  
>      `Committer: Maja <suryatmaja.dev@gmail.com>`
> 2. **KEWAJIBAN UPDATE CHANGELOG**:
>    - Setiap kali melakukan penambahan fitur, perbaikan bug, atau refaktoring kode, AI Agent **WAJIB** mencatat perubahan di [`CHANGELOG.md`](file:///c:/Users/saket/Documents/Github/portofolio/CHANGELOG.md) sebelum melakukan commit.
>    - Format pencatatan wajib menyertakan:
>      - Waktu WIB (misal: `[18:15 WIB]`)
>      - Judul deskriptif perubahan beserta daftar file terkait dalam kurung.
>      - Rincian latar belakang masalah/kebutuhan, solusi teknis yang diterapkan, dan dampak fungsionalnya.
> 3. **STANDAR COMMITLINT / CONVENTIONAL COMMITS**:
>    Pesan commit harus mematuhi format standar Conventional Commits:
>    ```
>    <type>(<scope>): <subject>
> 
>    <body>
>    ```
>    - **Type**: `feat` (fitur baru), `fix` (perbaikan bug), `docs` (dokumentasi), `style` (formatting/css), `refactor` (restrukturisasi kode), `perf` (optimasi performa), `chore` (pemeliharaan/tooling).
>    - **Subject**: Seluruhnya huruf kecil, kalimat imperatif, tanpa tanda titik di akhir.
>    - **Body**: Penjelasan ringkas mengapa perubahan dilakukan dan apa dampaknya.
