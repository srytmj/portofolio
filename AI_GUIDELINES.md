# AI Agent Development Guidelines & System Architecture

Dokumentasi ini dibuat khusus sebagai panduan operasional bagi **AI Coding Agent** (Antigravity, Claude, Cursor, Copilot, dsb.) yang mengerjakan, memodifikasi, atau memelihara codebase portofolio ini. Baca dokumen ini sebelum melakukan perubahan agar eksekusi konsisten, aman, dan selaras dengan arsitektur proyek.

---

## 1. Identitas & Visi Proyek

- **Pemilik**: Bakti Surya Atmaja (Maja) — *Full-Stack Developer & Cloud/Homelab Infrastructure Engineer*.
- **Konsep Desain**: **YoRHa Military Android Sci-Fi (NieR: Automata OS)** dipadukan dengan **Peta Rasi Bintang Interaktif (3D Celestial Constellations)**.
- **Filosofi Visual**:
  - **Zero Rounded (`rounded-none`)**: Sudut siku 90° murni tanpa radius pada kartu, tombol, badge, input, modal, dan thumbnail.
  - **Flat & Brutalist**: Dilarang menggunakan `box-shadow` atau `text-shadow` berlebih (zero shadow visual language).
  - **Palet Tema**:
    - **Dark Mode (Default)**: 100% True Black OLED (`#000000`), teks krem gading (`#DCDACF`), garis abu-abu tipis (`#1E1E1E`), dengan aksen **Neon Emerald (`#34D399`)** untuk telemetri jaringan.
    - **Light Mode (Bunker Archive)**: Krem keabu-abuan kusam khas menu pause NieR (`#D1D2C5` background, `#C5C6B8` surface, `#454138` teks cokelat-kelabu militer).
  - **Gaya Teks**: Monospace uppercase bergaya Pod/Bunker (`[ SYSTEM STATUS // ACTIVE ]`, `[ DIRECTORY // 01_HOME ]`).
  - **ATURAN KETAT ANIMASI (ZERO STAGGER / NO AWKWARD DELAYS)**:
    - **DILARANG KERAS** menggunakan `stagger` bertingkat, delay domino beruntun, atau animasi memantul (`scale: 0.96/0.98`) pada daftar kartu, filter tombol, kategori, tag, atau hasil pencarian. Pengguna sangat tidak menyukai penundaan kemunculan elemen.
    - Setiap animasi kemunculan atau perpindahan filter **WAJIB SIMULTAN & SEREMPAK**: Seluruh elemen muncul bersamaan secara instan (`duration: 0.16s - 0.22s`, `y: 4-8px -> 0`, `opacity: 0 -> 1`, `ease: power2.out`).
    - Interaksi tombol & kartu harus memberikan respon taktil instan (`hover:-translate-y-0.5 active:translate-y-0`).

---

## 2. Tech Stack & Dependencies Utama

| Lapisan | Teknologi | Keterangan Penting |
| :--- | :--- | :--- |
| **Framework** | SvelteKit 2 + Svelte 5 | Menggunakan **Svelte 5 Runes** (`$state`, `$derived`, `$effect`, `$props`). |
| **Styling** | Tailwind CSS v4 | CSS Variables untuk dynamic theming di `src/app.css`. |
| **3D Canvas** | Three.js + Threlte (`@threlte/core`) | Render rasi bintang 89 konstelasi IAU berbasis data astronomi d3-celestial. |
| **Animasi** | GSAP 3 (ScrollTrigger) + Lenis | Smooth scrolling Lenis terintegrasi ke ticker GSAP. |
| **Diagram & Kode** | Mermaid.js + Prism.js | Render flowchart arsitektur dan syntax highlighting otomatis pada blog. |

---

## 3. Struktur Direktori & Aturan File

```
src/
├── app.css                    # Global tokens, theming variables, font setup
├── app.html                   # Shell HTML dasar, favicon SVG, boot cover
├── posts/                     # Markdown file artikel blog (sumber konten artikel)
├── lib/
│   ├── blog/                  # Store tema blog, parser markdown, utils blog
│   ├── components/            # Komponen UI utama (Hero, About, Skills, Portfolio, Contact)
│   │   ├── hero/              # Constellations.svelte (Three.js WebGL rendering loop)
│   │   ├── CornerTelemetry.svelte  # HUD astronomi & LiveClock sudut kiri bawah
│   │   ├── LiveClock.svelte   # Jam real-time Asia/Jakarta (WIB)
│   │   ├── ThemeToggle.svelte # Tombol switch tema
│   │   ├── CommandPalette.svelte # Ctrl+K launcher publik & homelab owner
│   ├── content/
│   │   └── site.js            # SEMUA COPY / TEKS PORTFOLIO DIEDIT DI SINI (Single Source of Truth)
│   ├── panel/
│   │   └── services.js        # Daftar service homelab untuk command palette
│   └── stores/                # State rasi bintang, tema, dsb.
└── routes/
    ├── (site)/
    │   ├── +page.svelte       # Landing page (Hero, About, Skills, Portfolio, Contact)
    │   ├── blog/              # Multi-view blog (/blog & /blog/[slug])
    │   └── projects/          # Projects catalogue & detail modal
```

> [!IMPORTANT]
> **Aturan Pemisahan Konten**: Dilarang melakukan *hardcode* teks profil atau data proyek ke dalam komponen `.svelte`. Selalu edit atau tambahkan di `src/lib/content/site.js`.

---

## 4. Cara Membuat & Menulis Artikel Blog Baru

1. Buat file baru di folder `src/posts/` dengan format nama file:
   `YYYY-MM-DD-slug-judul-artikel.md` (Contoh: `2026-07-03-membangun-ha-web-server-aws.md`).
2. Struktur Frontmatter Wajib:
   ```markdown
   ---
   title: "Membangun High-Availability Web Server di AWS"
   date: "2026-07-03"
   description: "Panduan implementasi arsitektur web server tangguh dengan ALB, Auto Scaling, dan Multi-AZ RDS."
   categories: ["Cloud Infrastructure", "AWS Architecture"]
   tags: ["AWS", "Terraform", "DevOps", "Linux"]
   author: "Bakti Surya Atmaja"
   published: true
   ---

   Tulis konten markdown Anda di sini...
   ```
3. **Menambahkan Diagram Arsitektur (Mermaid)**:
   Gunakan fenced code block `mermaid`:
   ```markdown
   ```mermaid
   graph TD
     Client --> ALB[Application Load Balancer]
     ALB --> EC2_A[EC2 Node 1 - AZ-a]
     ALB --> EC2_B[EC2 Node 2 - AZ-b]
   ```
   ```
4. **Menambahkan Blok Kode**:
   Sertakan nama bahasa (misal `bash`, `javascript`, `json`, `yaml`) agar di-highlight oleh Prism.js.
5. **Menambahkan Gambar**:
   Simpan aset gambar di `static/posts/YYYYMMDD/nama-gambar.png` dan referensikan dengan path `/posts/YYYYMMDD/nama-gambar.png`.

---

## 5. Panduan Maintenance, Build, & Deployment

### Perintah Utama:
```bash
# Menjalankan local development server
npm run dev

# Membangun produksi (Wajib dipastikan exit code 0)
npm run build

# Menjalankan preview hasil build lokal
npm run preview
```

### Membersihkan Cache jika Route Mengalami Kendala:
Jika menambah/menghapus route dan Vite mengalami kendala cache stale:
```bash
rm -rf .svelte-kit node_modules/.vite
npm run dev
```

### Opsi Deployment:
- **Cloudflare Pages / Vercel / Netlify**: Default menggunakan `@sveltejs/adapter-auto`.
- **Static Hosting (GitHub Pages / S3)**: Pasang `@sveltejs/adapter-static` di `svelte.config.js` karena seluruh halaman telah mendukung SSG/prerender.
- **Homelab Docker Container**: Pasang `@sveltejs/adapter-node` dan build ke image Docker Node.js ringan (Alpine).

---

## 6. Status Roadmap & Task Berjalan (YoRHa Transformation)

Rencana kerja besar saat ini adalah **Transformasi YoRHa (NieR: Automata) UI System**:
- **Fase 1**: Core Foundation, Tokens, & Global Theme Store.
- **Fase 2**: Halaman Utama (`/`), Hero Section, SideNav, Bio Spec Sheet, & Telemetry HUD.
- **Fase 3**: Halaman Projects (`/projects`) & Seluruh Modal Dialog.
- **Fase 4**: Halaman Blog (`/blog`) & Reader Artikel (`/blog/[slug]`).
- **Fase 5**: QA Aksesibilitas WCAG, Polishing Animasi, & Production Build Verification.

Detail lengkap per sub-task dapat dilihat pada file `implementation_plan.md`.
