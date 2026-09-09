# Changelog

Semua perubahan, penambahan fitur, perbaikan bug, dan pembaruan kode pada proyek portofolio ini didokumentasikan di file ini.

Format changelog ini mengacu pada [Keep a Changelog](https://keepachangelog.com/id/1.0.0/).

---

## [Unreleased] - 2026-09-09

### Added
- **[18:25 WIB] Dokumentasi Panduan Manajemen Konten (Skills & Portfolio) dan Deployment Homelab (`AI_GUIDELINES.md`, `README.md`, `CHANGELOG.md`):**
  - **Panduan Edit Konten Keahlian (Skills Matrix) & Pod 042 Inspector**:
    - Dokumentasi schema data `export const stack` di `src/lib/content/site.js` lengkap dengan field `id`, `name`, `badge`, `readiness`, `detail`, `role`, `deployedAt`, dan `command`.
    - Prosedur sinkronisasi jumlah kartu keahlian (*category count*) pada `src/lib/components/Skills.svelte`.
  - **Panduan Edit Konten Portfolio & Proyek Arsitektur**:
    - Dokumentasi schema data `export const projects` di `src/lib/content/site.js` lengkap dengan field `slug`, `title`, `kind`, `year`, `summary`, `detail`, `stack`, `images`, dan `links`.
    - Aturan 4 proyek teratas sebagai featured showcase di landing page (`Portfolio.svelte`) dan integrasi rute arsip `/projects` serta deep dive `/projects/[slug]`.
  - **Panduan Deployment Homelab Self-Hosted**:
    - Penulisan `Dockerfile` multi-stage (Node.js 20 Alpine builder + Nginx Alpine) dan file `docker-compose.yml`.
    - Integrasi remote access tanpa port forwarding menggunakan **Cloudflare Zero Trust Tunnel** (`cloudflared`) dan **Tailscale Tailnet** (`tailscale serve`).
    - Konfigurasi environment `.env` untuk integrasi homelab launcher pada Command Palette (Ctrl+K).

- **[18:10 WIB] Overhaul Dokumentasi AI Agent, Deployment Pipeline (GitHub Pages & AWS EC2), & SOP Pemeliharaan (`AI_GUIDELINES.md`, `README.md`, `CHANGELOG.md`):**
  - **Panduan Penulisan Artikel Blog untuk AI Agent**:
    - Spesifikasi format nama file `YYYY-MM-DD-slug.md` dan struktur YAML frontmatter lengkap (`title`, `date`, `description`, `categories`, `tags`, `author`, `published`, `cover`).
    - Panduan integrasi diagram arsitektur Mermaid.js dan syntax highlighting Prism.js beserta identifier bahasa yang didukung.
    - Struktur penyimpanan aset gambar artikel di `static/assets/img/posts/` dan integrasi Table of Contents (TOC) otomatis.
  - **SOP Maintenance & Pemeliharaan Codebase**:
    - Aturan mutlak larangan `clearProps: 'all'` pada elemen dengan inline styles (wajib gunakan `clearProps: 'transform,opacity'`).
    - Prosedur sinkronisasi `ScrollTrigger.refresh()` dan `window.__lenis?.resize()` pada setiap perubahan ukuran DOM dinamis.
    - Aturan konsistensi Svelte 5 Runes murni (`$state`, `$derived`, `$effect`, `$props`).
  - **Panduan Lengkap Deployment Produksi**:
    - **GitHub Pages**: Konfigurasi `@sveltejs/adapter-static` dengan `prerender = true` dan workflow otomatis GitHub Actions `.github/workflows/deploy.yml`.
    - **AWS EC2 (Ubuntu Linux)**: Konfigurasi Security Group (port 80, 443, 22), instalasi Nginx, Node.js 20 LTS, PM2 Process Manager, setup Nginx server block dengan caching immutable assets, SSL otomatis Certbot Let's Encrypt, dan script deployment otomatis `deploy.sh`.
  - **Kewajiban Penggunaan CHANGELOG & Standar Git Commit**:
    - Mewajibkan AI Agent memperbarui `CHANGELOG.md` pada setiap perubahan kode.
    - Menetapkan standar format pesan commit Conventional Commits / Commitlint.
    - Menegaskan aturan kontributor tunggal: dilarang keras menambahkan bot AI atau Antigravity sebagai co-author/contributor.

- **[17:07 WIB] Implementasi Custom Plus Cursor dengan Dynamic Color Inversion (`CustomCursor.svelte`, `+layout.svelte`, `src/app.css`):**
  - **Bentuk Plus (`+`) Crosshair Taktis**:
    - Menghadirkan kursor SVG tanda tambah minimalis presisi tinggi (20px x 20px) yang titik potong sumbunya tepat berada di koordinat klik pointer.
  - **Efek Inversi Warna Dinamis (`mix-blend-mode: difference`)**:
    - Kursor otomatis ter-invert secara matematis terhadap warna elemen di bawahnya: tampil putih di atas background hitam OLED, dan ter-invert menjadi hitam/charcoal saat melintasi elemen terang, teks, atau button hover.
  - **Responsivitas Interaktif & Tactile Feedback**:
    - Kursor otomatis membesar (`scale: 1.4`) saat hover ke elemen interaktif (`<a>`, `<button>`, `<input>`, `.cursor-pointer`) dan mengecil sejenak (`scale: 0.85`) saat diklik (`mousedown`).
  - **Proteksi Mobile & Performa 0-Latency**:
    - Kursor hanya aktif pada perangkat bermouse (`@media (pointer: fine)`). Transformasi diproses langsung via GPU (`translate3d` & `will-change: transform`) tanpa lag frame.

### Changed
- **[17:30 WIB] Penonaktifan Border Putih pada Project Modal Dialog (`ProjectModal.svelte`, `ResumeModal.svelte`):**
  - **Menonaktifkan Border Luar Panel**:
    - Mengganti kelas `border` menjadi `border-0` dan menyetel `border: none;` serta menambahkan scoped style `div[role="dialog"] { border: none !important; }` pada panel modal.
    - Mengubah `clearProps: 'all'` menjadi `clearProps: 'transform,opacity'` pada animasi masuk modal agar GSAP tidak menghapus deklarasi style panel setelah animasi selesai.
    - Mempertahankan reticle corner brackets aksen amber pada empat sudut modal tanpa ada garis putih pembatas yang mengelilingi kotak modal.

- **[17:28 WIB] Perbaikan Bug Border Putih Kartu Proyek Akibat clearProps GSAP (`projects/+page.svelte`, `Skills.svelte`):**
  - **Penyebab**: Fungsi `clearProps: 'all'` pada animasi filter kartu menghapus seluruh atribut `style` inline (`border-color` dan `background-color`), sehingga border kartu jatuh ke warna teks bawaan Tailwind (`currentColor` = putih terang).
  - **Solusi**: Mengubah seluruh `clearProps: 'all'` menjadi `clearProps: 'transform,opacity'` pada handler filter dan search `$effect`, serta menambahkan aturan scoped CSS `:global([data-card-anim])` untuk mengunci warna border kartu ke `var(--yorha-border)`.

- **[17:14 WIB] Perbaikan Bug Scroll Delay Tech Skills & Transisi Latar Belakang Hero ke About (`sectionAnim.js`, `Skills.svelte`, `Hero.svelte`, `+page.svelte`):**
  - **Perbaikan Scroll Delay pada Filter Kategori**:
    - Menambahkan `ResizeObserver` pada action `sectionAnim` agar setiap perubahan tinggi elemen section langsung memperbarui koordinat `ScrollTrigger` dan batas scroll `Lenis`.
    - Menambahkan pemanggilan langsung `ScrollTrigger.refresh()` dan `window.__lenis?.resize()` di `Skills.svelte` saat filter diklik sehingga seksi Portfolio langsung muncul tepat waktu tanpa jeda.
  - **Transisi Latar Belakang Hero ke About yang Mulus**:
    - Menambahkan gradien transisi vertikal lembut di bagian bawah pin Hero (`Hero.svelte`) yang membaurkan canvas 3D ke latar belakang YoRHa.
    - Menambahkan batas taktis YoRHa HUD (`SYS_ENGAGE // SECTOR_02_MONITOR`) dengan indikator pulsa amber di antara Hero dan About.
    - Menambahkan *grid dissolve mask* setinggi ~260px di bagian atas kontainer konten agar kisi grid 3px meluruh masuk secara bertahap tanpa potongan garis tajam.

- **[17:04 WIB] Pembaruan Pola Grid Latar Belakang Menjadi Exact Cross Grid 3px (`src/app.css`, `+page.svelte`, `projects/+page.svelte`, `blog/+page.svelte`):**
  - Mengubah pola background kisi garis menjadi *exact cross grid* dua lapis (`linear-gradient` vertikal & horizontal 1px) dengan ukuran kotak mikro rapat **3px x 3px**.
  - Mengonfigurasi variabel `--cross-line` pada Dark Mode (`rgba(255, 255, 255, 0.07)`) dan Light Mode (`rgba(0, 0, 0, 0.06)`).
  - Memastikan background grid membentang penuh 100% (*edge-to-edge*) pada halaman `/projects` dan `/blog` tanpa terpotong batas kontainer `.wrap`.
  - Memberikan latar belakang solid (`var(--yorha-surface)`) pada seluruh kartu keahlian dan panel diagnostik Pod 042 agar pola grid tidak tembus di belakang teks.
  - Menjaga *radial vignette mask* pada pembaca artikel blog agar area teks tetap bersih dan nyaman dibaca.
- **[12:59 WIB] Auto-Scroll Table of Contents (TOC) di Blog Reader Mengikuti Progres Baca Pengguna (`blog/[slug]/+page.svelte`):**
  - **Auto-Follow Heading Aktif pada Daftar Isi Panjang**:
    - Menyelesaikan masalah daftar isi artikel panjang (seperti *Apa-apa aja tentang Fighting Game*) yang melebihi batas tinggi `max-h-[50vh]`, di mana sebelumnya pengguna harus men-scroll manual container TOC untuk melihat heading yang sedang aktif.
    - Menghubungkan `$effect` reaktif dengan `tocNavRef` dan `data-toc-id`: setiap kali heading aktif berpindah saat pengguna membaca ke bawah atau ke atas, container TOC secara otomatis melakukan `scrollBy({ behavior: 'smooth' })` agar heading aktif selalu berada dalam jangkauan pandang dengan batas bantalan (*padding*) yang nyaman.
    - **Peningkatan ScrollSpy Presisi**:
      - Memperbarui pendeteksian heading aktif menggunakan `getBoundingClientRect().top` viewport langsung (bebas dari distorsi offset parent `relative`).
      - Menambahkan deteksi posisi akhir halaman (*bottom-of-page*) sehingga heading paling akhir otomatis aktif ketika pembaca mencapai bagian penutup artikel.

- **[12:55 WIB] Penyederhanaan Navigasi Balik (Back Feature) Selalu Mengarah ke Hero Section (`navigationState.js`, `LeftEdgeReturn.svelte`, `+layout.svelte`, `Hero.svelte`, `Contact.svelte`, `Portfolio.svelte`):**
  - **Kembali Pasti ke Hero Section (Top 0, 0)**:
    - Mengubah perilaku tombol back dan hover rail sisi kiri (`LeftEdgeReturn.svelte`) agar selalu kembali ke Hero section (koordinat puncak `0, 0`) tanpa perlu mencoba memulihkan posisi scroll terakhir.
    - Menghilangkan kalkulasi rumit penyimpanan dan pemulihan posisi scroll/section (`saveMainPageScroll` diubah menjadi no-op bersih dan `returnToMainPage` langsung mengeksekusi reset ke `(0, 0)` secara instan pada browser dan Lenis smooth scroll).
    - Memperbarui label indikator hover pada `LeftEdgeReturn.svelte` menjadi `RETURN TO HERO` dan telemetry label `[ RETURN // HERO SECTION ]`.
    - Membersihkan listener scroll `saveMainPageScroll` pada layout utama (`+layout.svelte`) dan event handler manual pada tombol blog/proyek.

### Added
- **[12:47 WIB] Penghapusan [ Arrow ] pada Tombol Blog & Fitur Hover Navigasi Balik ke Page Utama dengan Posisi Scroll Sebelumnya (`Hero.svelte`, `Contact.svelte`, `LeftEdgeReturn.svelte`, `navigationState.js`, `+layout.svelte`, `projects/+page.svelte`, `blog/+page.svelte`):**
  - **Penghapusan Ikon Panah [ ↗ ] pada Tombol Navigasi Blog**:
    - Menghapus elemen ikon panah `[ ↗ ]` di sebelah kiri teks tombol pada section utama / Hero (`Hero.svelte`) dan section Contact (`Contact.svelte`), menyisakan teks label bersih `Engineering Journal →` dan `ACCESS JOURNAL / BLOG →`.
  - **Fitur Hover Area Kiri Kosong untuk Kembali ke Page Utama (`LeftEdgeReturn.svelte` & `navigationState.js`)**:
    - Menghadirkan zona interaktif taktis di sepanjang margin/area kiri kosong pada halaman `/projects` dan `/blog` (`LeftEdgeReturn.svelte`).
    - **Interaksi Hover Halus & Cerdas**:
      - Pada kondisi normal (*idle*), indikator tampil sangat minimalis dan tidak mengganggu konten baca.
      - Ketika kursor mouse diarahkan ke area kosong sebelah kiri, kapsul taktis `← RETURN TO MAIN` muncul secara presisi dengan sudut reticle braket `[ ┌ ┐ └ ┘ ]` dan indikator status telemetri seksi sebelumnya (misal: `[ RESTORE // PORTFOLIO ]` atau `[ RESTORE // CONTACT ]`).
    - **Pemulihan Posisi Scroll Presisi (Exact Scroll Position Restoration)**:
      - Sistem secara otomatis mencatat koordinat scroll vertikal (`window.scrollY` dan Lenis scroll) serta section aktif ketika pengunjung berada di halaman utama (`/`).
      - Saat tombol kembali diklik, pengunjung diarahkan kembali ke halaman utama dan posisi scroll dikembalikan secara mulus ke posisi sebelum mereka membuka halaman proyek/blog.

- **[12:45 WIB] Theming Halaman Blog (`/blog`), Navigasi Cepat Blog di Contact, Penyelarasan Titik Status & Pembaruan Hak Cipta (`blog/+page.svelte`, `Contact.svelte`, `About.svelte`, `site.js`):**
  - **Theming Komprehensif Halaman Blog & Kartu Artikel (`blog/+page.svelte`)**:
    - Seluruh kartu artikel (`[data-home-card]`), kartu kategori (`[data-category-card]`), item artikel kategori (`[data-category-post-item]`), item artikel tag (`[data-tag-post-item]`), dan item arsip (`[data-archive-item]`) diubah menjadi **`rounded-none`** dan zero-shadow murni.
    - Menambahkan braket sudut reticle CSS presisi (`h-2.5 w-2.5 border-l-2 border-t-2`) berkoordinat tepat di `-top-px -left-px` pada setiap sudut kartu saat hover yang terintegrasi dinamis dengan tema OLED Black dan Sepia.
    - Menerapkan kombinasi tipografi konsisten: judul menggunakan `font-display` (Epilogue), deskripsi artikel menggunakan `font-serif italic` (Baskervville), dan metadata menggunakan `font-mono`.
    - Seluruh kontrol input pencarian, tombol tab navigasi sidebar, tag pill filter, dan tombol paginasi diubah menjadi `rounded-none`.
  - **Navigasi Cepat Blog di Section Contact (`Contact.svelte`)**:
    - Menambahkan tombol navigasi taktis `[ ↗ ] ACCESS JOURNAL / BLOG →` di samping paragraf pengantar pada section kontak untuk akses langsung ke Engineering Journal.
  - **Penyelarasan Vertikal Presisi Titik Status (`Contact.svelte`, `About.svelte`)**:
    - Menyelaraskan titik hijau neon berdenyut dengan baseline teks huruf kapital pada status komisi footer (`COMMISSIONS: OPEN // UTC+7`), status channel (`[ DIRECT_INBOX ]`), status telemetri About (`about.status`), dan kartu ketersediaan (`Open for opportunities`) menggunakan `leading-none` dan penyesuaian optikal `-translate-y-[0.5px]`.
  - **Pembaruan Hak Cipta & Identitas Legal (`site.js`, `Contact.svelte`)**:
    - Memperbarui nama pemegang hak cipta pada footer dari `Suryatmaja` menjadi `Bakti Surya Atmaja` (`© 2026 Bakti Surya Atmaja`).

- **[12:35 WIB] Penyederhanaan Section Contact (3 Saluran Taktis) & Perbaikan Presisi Sudut Reticle (`Contact.svelte`, `Portfolio.svelte`, `projects/+page.svelte`, `Skills.svelte`, `ProjectModal.svelte`, `ResumeModal.svelte`, `CommandPalette.svelte`):**
  - **Penyederhanaan Layout Kontak Menjadi 3 Saluran Inti (Email, GitHub, LinkedIn)**:
    - Menghapus kartu Instagram dan kartu ketersediaan terpisah agar section tidak memakan ruang vertikal berlebih (`py-20 sm:py-28` tanpa `min-h-[100svh]`).
    - Menyusun layout simetris 3 kolom taktis dalam satu baris:
      - `CHANNEL // 01` (Email Dispatch): Alamat email monospace + tombol salin taktis `[ ┌ COPY ADDRESS ┘ ]` dengan feedback instan buffer.
      - `CHANNEL // 02` (GitHub Repositories): Akses repo open-source, homelab automation, dan arsitektur sistem.
      - `CHANNEL // 03` (LinkedIn Professional): Riwayat karir, latar belakang network enterprise, dan jejaring profesional.
    - Mengintegrasikan status ketersediaan komisi (`COMMISSIONS: OPEN // UTC+7`) dan visitor counter secara kompak pada baris footer bawah.
  - **Perbaikan Bug Sudut Reticle Melayang / Kelewatan (Pixel-Perfect Corner Reticles)**:
    - Mengeliminasi ketidaksejajaran vertikal sudut reticle atas yang sebelumnya melayang/kelewatan akibat karakter teks Unicode (`┌ ┐ └ ┘`) yang terpengaruh font baseline dan line-height.
    - Menggantinya dengan braket sudut CSS presisi (`h-2.5 w-2.5 border-l-2 border-t-2`) berkoordinat tepat di `-top-px -left-px` yang 100% menempel pas (*flush*) pada setiap sudut elemen kartu portfolio, proyek, modal, konsol, dan kontak tanpa distorsi visual.
- **[12:30 WIB] Overhaul Section Contact — YoRHa Minimalist Black Box Transceiver & Combo Typography (`Contact.svelte`, `About.svelte`, `site.js`):**
  - Mengimplementasikan **Konsep 3 (Minimalist YoRHa Black Box Transceiver)** pada section Kontak (`SEC // 05`) dengan frame tajam `rounded-none`, zero-shadow, dan sudut reticle bidik militer `[ ┌ ┐ └ ┘ ]`.
  - Menghadirkan **Giant Direct Frequency HUD** dengan alamat email monospace berukuran besar (`srytmj@gmail.com`), status buffer aktif berdenyut hijau neon (`[ BUFFER_STATUS: ACTIVE ]`), dan tombol salin taktis `[ ┌ COPY ADDRESS ┘ ]` dengan feedback instan `[ ┌ COPIED TO BUFFER ┘ ]`.
  - Mengintegrasikan **4-Grid Tactical Relay Nodes**:
    - `ENDPOINT_01 // GITHUB [srytmj]` (`PROTOCOL: GIT+SSH`)
    - `ENDPOINT_02 // LINKEDIN [suryatmaja]` (`PROTOCOL: BGP_PEER`)
    - `ENDPOINT_03 // INSTAGRAM [@symjaaa]` (`PROTOCOL: SOCIAL_FEED`) — menghubungkan profil personal Instagram `https://www.instagram.com/symjaaa/`.
    - `ENDPOINT_04 // AVAILABILITY TELEMETRY` (`STATUS: OPEN FOR COMMISSIONS // UTC+7 / WIB`).
  - Mempertegas penerapan **kombinasi font Epilogue + Baskervville + Monospace**:
    - `font-display` (**Epilogue**): Judul section (`SEC // 05`), nama kartu endpoint, dan elemen struktural display.
    - `font-serif` (**Baskervville**): Teks pengantar naratif prose, kutipan reflektif, dan deskripsi isi kartu bernuansa editorial sastra.
    - `font-mono` (**Space Mono / Fira Code**): Kode indeks, alamat email, frekuensi transmisi, status telemetri, dan footer.
  - Memperbarui `About.svelte` agar paragraf narasi `{about.intro}` dan `{about.body}` secara konsisten mengadopsi `font-serif` (Baskervville).
- **[12:14 WIB] Overhaul Modal Proyek, Resume Modal & Command Palette ke Estetika Taktis YoRHa (`ProjectModal.svelte`, `ResumeModal.svelte`, `CommandPalette.svelte`):**
  - Mengubah seluruh modal detail proyek, modal resume CV, dan command palette (Ctrl+K) menjadi **`rounded-none`** dan zero-shadow murni dengan sudut bidik reticle militer YoRHa `[ ┌ ┐ └ ┘ ]`.
  - Mengimplementasikan top toolbar taktis `POD // SPEC_INSPECTOR_{num}` pada modal proyek lengkap dengan lampu indikator telemetri berdenyut hijau neon (`animate-pulse`), badge klasifikasi militer, panduan `[ ESC TO DISMISS ]`, serta tombol exit berbingkai kotak.
  - Memisahkan tampilan modal proyek menjadi 2 kolom taktis: kolom kiri berisi index telemetri (`UNIT_INDEX`, `SYSTEM_NAME`, spesifikasi `YEAR`, `CLASSIFICATION`, `CORE_STACK`), dan kolom kanan berisi narrative logs, border aksen emerald vertikal, galeri preview tajam, serta link terminal `[ ↗ LINK ]`.
  - Menghilangkan seluruh scale bounce / distorsi skala pada transisi buka-tutup modal dan command palette; transisi kini berjalan serempak dan instan (`duration: 0.16s - 0.18s`, `y: 8px -> 0`, zero stagger).
- **[11:45 WIB] Penyelarasan Theming & Animasi Projects Archive dan Portfolio Section (`projects/+page.svelte`, `Portfolio.svelte`):**
  - Mengubah seluruh kartu proyek di halaman `/projects` menjadi **`rounded-none`**, menghapus bayangan besar `shadow-[0_16px_36px_rgba(...)]`, dan menambahkan reticle brackets `[ ┌ ┐ └ ┘ ]` saat hover.
  - Menyelaraskan tombol filter kategori dengan penanda reticle `┌ ┘` dan search bar bergaya konsol.
  - Menghapus benturan ganda handler klik dan `$effect` pencarian serta menghilangkan springy scale bounce `1.025` di `Portfolio.svelte`; filter kini berganti seketika (`y: 4 -> 0` dalam 0.16s, zero delay).
- **[11:15 WIB] Overhaul Section Skills — YoRHa Tactical Tech Matrix & Pod 042 Diagnostic HUD (`Skills.svelte` & `site.js`):**
  - Mengubah section Skills yang sebelumnya sepi menjadi split-view 2 kolom interaktif bergaya sistem operasi Bunker/Pod YoRHa (NieR: Automata).
  - Menyediakan filter kluster taktis: `[ ALL CAPABILITIES ]`, `[ 01 // CLOUD & AUTOMATION ]`, `[ 02 // SYSTEMS & VIRT ]`, `[ 03 // NETWORKING ]`, dan `[ 04 // APP RUNTIME ]`.
  - Memperluas katalog dari sekadar web dev menjadi 18 unit keahlian riil Network, Homelab, Cloud, dan Systems Engineering (MikroTik RouterOS, Proxmox VE, WireGuard/Tailscale, Cloudflare Zero Trust, VLANs, Terraform, Docker, AWS, SvelteKit, Laravel, PostgreSQL, Redis).
  - Setiap kartu memiliki reticle brackets sudut `[ ┌ ┐ └ ┘ ]`, ID taktis unik, badge klasifikasi militer, dan mini readiness bar.
  - Menghadirkan monitor Pod 042 di kolom kanan dengan status telemetri berdenyut hijau neon (`ONLINE`), rincian target aktif, persentase kesiapan produksi, peran arsitektur, lokasi deploy nyata, dan CLI console output simulator ($ command).
- **[10:30 WIB] Eliminasi Total Stagger Delay Awkward Menjadi Animasi Simultan Instan (Zero-Stagger Motion):**
  - Menghapus seluruh efek domino / `stagger` delay bertingkat di seluruh komponen: filter `Skills.svelte`, katalog `projects/+page.svelte`, artikel & paginasi `blog/+page.svelte`, halaman detail `projects/[slug]`, `blog/[slug]`, `CommandPalette.svelte`, `ProjectModal.svelte`, dan scroll reveal `sectionAnim.js`.
  - Menggantinya dengan transisi serempak yang *clean*, instan, dan *snappy* (`y: 4-8px -> 0`, `opacity: 0 -> 1`, `duration: 0.16s - 0.22s`, `ease: power2.out`) tanpa distorsi `scale` atau jeda tunggu antar kartu.
  - Memformalkan aturan ketat zero-stagger ke dalam `AI_GUIDELINES.md` agar agen AI di masa depan tidak mengulangi animasi delay bertingkat.
- **[09:45 WIB] YoRHa Tactical Reticle Favicon Upgrade (`static/favicon.svg` & `src/app.html`):**
  - Mengganti favicon dengan ikon SVG reticle bidik militer YoRHa bersudut tajam (`┌ ┐ └ ┘`), sumbu crosshair aksial, dan node inti neon emerald (`#34D399`) yang konsisten dengan tema sci-fi android.
- **[09:10 WIB] Shortcut Akses Cepat Blog di Hero Section (`src/lib/components/Hero.svelte`):**
  - Menambahkan link navigasi taktis `[ ↗ ] ENGINEERING JOURNAL` tepat di atas kutipan trivia `"Every point of light..."` pada section pertama (Hero) sehingga pengunjung dapat langsung melompat ke blog tanpa perlu scroll ke bawah.
- **[08:40 WIB] Badge Telemetri Visitor Counter di Kontak (`src/lib/components/Contact.svelte`):**
  - Menambahkan badge live telemetry `Visited by {visitorCount} people` di bagian bawah form kontak lengkap dengan pulsing emerald status dot dan mekanisme fallback tangguh (localStorage + sessionStorage) jika terjadi limit API atau akses offline.
- **[08:15 WIB] Transisi Pergantian Tema Sutra (Silk-Smooth Transition) (`blogTheme.js` & `app.css`):**
  - Mengeliminasi delay artifisial 120ms dan lapisan veil gelap yang sebelumnya memicu kedipan visual; kini peralihan antara OLED Black dan Warm Sepia berjalan instan dengan interpolasi kurva halus `cubic-bezier(0.16, 1, 0.3, 1)` berdurasi 380ms yang sangat nyaman di mata.
- **[07:30 WIB] Dokumentasi Komprehensif AI Guidelines (`AI_GUIDELINES.md` & `README.md`):**
  - Menyusun panduan operasional lengkap untuk AI agent dan developer masa depan mencakup arsitektur, standar penulisan Svelte 5 Runes, styling tokens YoRHa, skema frontmatter artikel blog, integrasi layanan homelab, dan alur deployment.
- **[06:45 WIB] Tombol Theme Ikon Murni Tanpa Border Kotak (Borderless Google Icons):**
  - Menghilangkan border kotak pada `<ThemeToggle />` (`border-0 bg-transparent`) sehingga tampil bersih dan elegan dengan Google Material Symbols `dark_mode` dan `light_mode` serta animasi tilt mikro saat di-hover.
- **[06:15 WIB] Pemindahan Posisi Bagian Stats Langsung di Bawah Menu Navigasi (`blog/+page.svelte`):**
  - Memindahkan informasi statistik (Articles, Categories, Topics / Tags) tepat di bawah menu navigasi sidebar (Home, Categories, Tags, Archive) dengan penanda section `[ STATS ]`.
- **[05:45 WIB] Penghapusan Total Seluruh Shadow pada Dark Mode & White/Sepia Mode (`app.css`, `+page.svelte`, `[slug]/+page.svelte`, `LiveClock.svelte`):**
  - Mengeliminasi seluruh `box-shadow` dan `text-shadow` pada **semua mode tema blog** (`:root[data-blog-theme] * { box-shadow: none !important; text-shadow: none !important; }`), termasuk Dark OLED mode dan Warm Sepia mode.
- **[05:00 WIB] Theming Dinamis HUD Jam Regional (UTC+7 dan WIB) (`LiveClock.svelte`):**
  - Teks metadata jam regional di sudut kiri bawah layar ("UTC+7" dan "WIB") kini secara dinamis mengikuti sistem tema aktif (Warm Sepia vs Dark OLED).
- **[04:15 WIB] Garis Border Hover Putih Bersih pada Mode Dark (Tanpa Aksen Hijau):**
  - Mengubah warna garis border saat kartu di-hover pada tema OLED Black menjadi **putih bersih** (`rgba(255, 255, 255, 0.45)` / `--blog-hover-border`), bukan warna hijau neon, berlaku untuk kartu artikel, kartu kategori, tag pills, navigasi sidebar, dan timeline arsip.
- **[03:30 WIB] Penghapusan Permanen Badge Entries di Samping Judul (`blog/+page.svelte`):**
  - Menghapus badge `17 entries` di sebelah kanan teks "Engineering Journal" pada header blog untuk menjaga header tetap bersih dan minimalis.
- **[03:00 WIB] Penghapusan Tooltip Hover pada Tombol Tema (`ThemeToggle.svelte`):**
  - Menghapus atribut `title` dari tombol tema sehingga browser tidak lagi menampilkan tooltip pesan "Switch to Dark Mode" / "Switch to Sepia Paper Mode" saat kursor diarahkan ke tombol.
  - Mengeliminasi seluruh `box-shadow` dan `text-shadow` pada **semua mode tema blog** (`:root[data-blog-theme] * { box-shadow: none !important; text-shadow: none !important; }`), termasuk Dark OLED mode dan Warm Sepia mode.
  - Menghapus seluruh kelas utilitas bayangan hijau (`shadow-[0_0_14px_rgba(...)]`, `shadow-[0_0_10px_rgba(...)]`, `shadow-[0_0_8px_rgba(...)]`, `shadow-2xl`, `shadow-lg`) dari tombol navigasi aktif, tag filter aktif, tombol nomor paginasi, indikator timeline arsip, modal pencarian, dan quick action button.
  - Tampilan visual kini 100% flat, tajam, presisi, dan konsisten tanpa glow atau bayangan yang mengaburkan elemen.
- **Perbaikan Animasi Instan pada Categories & Tags (Tanpa Delay Awkward) (`blog/+page.svelte`):**
  - Menghilangkan *parent panel opacity blanking* (`contentPanel opacity: 0`) saat berpindah tab yang sebelumnya menimbulkan jeda kosong sebelum konten tampak.
  - Mengeliminasi jeda stagger domino bertingkat yang lambat pada puluhan kartu kategori dan tag pills. Seluruh elemen kini bertransisi secara serempak, instan, dan *snappy* (`duration: 0.2s, ease: power2.out`).
  - Menghilangkan benturan *race condition* pada `$effect` subkategori (`lastSubcategory` state guard) sehingga klik ke detail kategori dan tag langsung memunculkan artikel secara mulus tanpa efek terhenti atau kedipan delay.
- **Theming Dinamis HUD Jam Regional (UTC+7 dan WIB) (`LiveClock.svelte`):**
  - Teks metadata jam regional di sudut kiri bawah layar ("UTC+7" dan "WIB") kini secara dinamis mengikuti sistem tema aktif:
    - Pada Mode Sepia / White: UTC+7 berwarna warm muted espresso (`--blog-text-muted`), WIB berwarna aksen terracotta hangat (`--blog-accent`), dan text shadow gelap dinonaktifkan sepenuhnya sehingga teks tampak tajam dan elegan di atas latar kertas perkamen.
    - Pada Mode OLED Black: UTC+7 berwarna muted gray, WIB berwarna neon emerald, dan text shadow dinonaktifkan.
- **Theming Titik Indikator Filter Aktif (`homeFilterTag`):**
  - Titik indikator lingkaran kecil pada tag filter yang aktif di halaman blog kini secara dinamis mengadopsi variabel aksen tema (`var(--blog-accent)`): berubah menjadi terracotta hangat di mode Sepia dan neon emerald di mode Dark OLED, tidak lagi terkunci warna hijau statis.
- **Garis Border Hover Putih Bersih pada Mode Dark (Tanpa Aksen Hijau):**
  - Mengubah warna garis border saat kartu di-hover pada tema OLED Black menjadi **putih bersih** (`rgba(255, 255, 255, 0.45)` / `--blog-hover-border`), bukan warna hijau neon, berlaku untuk kartu artikel, kartu kategori, tag pills, navigasi sidebar, dan timeline arsip.
  - Garis aksen atas kartu (*top sweep line*) pada mode Dark kini juga menyapu dengan garis putih elegan (`--blog-hover-top-line: rgba(255, 255, 255, 0.85)`).
- **Restorasi Penuh Warna & Responsivitas Interaktif Hover (`/blog`, `/blog/[slug]`):**
  - Mengatasi masalah hilangnya warna hover pada kartu, judul artikel, tombol baca, navigasi sidebar, katalog kategori, tag pills, dan timeline arsip akibat aturan CSS tema yang menimpa pseudo-class `:hover`.
  - Mengembalikan sweep garis atas kartu (`origin-left scale-x-100`), iluminasi teks judul artikel, dan translasi panah `→` meluncur ke kanan.
- **Penghapusan Shadow Kartu yang Terpotong pada Mode Terang / Sepia:**
  - Menonaktifkan seluruh box shadow kartu pada mode Warm Sepia (`box-shadow: none !important`) sehingga tampilan kartu artikel tetap rapi dan bebas dari efek bayangan terpotong oleh kontainer `overflow-y-auto`.
- **Pemulihan Menyeluruh Animasi pada Semua Interaksi Tanpa Terkecuali:**
  - Mengeliminasi benturan *race condition* antara Svelte `$effect` dan `switchTab` yang sebelumnya membatalkan animasi kartu saat berpindah tab.
  - Menjamin animasi masuk dan keluar (GSAP stagger) berjalan mulus di setiap interaksi: pergantian tab (Home, Categories, Tags, Archive), klik kartu kategori ke detail dan tombol *Back*, klik tag pill ke detail dan tombol *Back*, klik filter subgroup, input pencarian, paginasi (Next/Prev/Page Num), dan navigasi breadcrumb.
- **Perbaikan Keterbacaan Teks Putih pada Mode Warm Sepia:**
  - Mengimplementasikan CSS overrides komprehensif untuk mode Sepia (`[data-blog-theme='sepia']`) yang memetakan seluruh kelas utilitas teks putih (`.text-white`, `[class*='text-white']`), abu-abu (`.text-ash-2`, `.text-ash-3`), serta border/background putih agar otomatis berubah ke warna espresso gelap (`--blog-text-primary`) dan muted brown (`--blog-text-muted`), menjamin keterbacaan 100% sempurna tanpa kontras teks putih yang hilang.
- **Perbaikan Inisialisasi Diagram Mermaid pada Pembaca Artikel:**
  - Mengeliminasi bug *early return* pada `onMount` yang sebelumnya memutus eksekusi `mermaid.run()`.

### Added
- **Blog Theme Engine (OLED Black Mode & Warm Sepia Mode) (`/blog`, `/blog/[slug]`):**
  - Mengimplementasikan sistem tema khusus halaman blog dengan dua mode warna presisi:
    - **Black Mode (Default)**: Latar `#000000` (100% True Black OLED), Surface/Card `#0D0D0D`, Teks Utama `#EDEDED`, Teks Sekunder `#888888`, Border `#1F1F1F`, Codeblock `#0A0A0A`, dan Aksen `#34d399` (Neon Emerald).
    - **Warm Sepia Mode**: Latar `#FBF0D9` (Warm Parchment Paper), Surface/Card `#F4E3C1`, Teks Utama `#3D2E24` (Dark Espresso), Teks Sekunder `#7A6251`, Border `#EAD3AF`, Codeblock `#F2DFB8`, dan Aksen `#9E4712` (Terracotta).
  - Menyediakan tombol switch tema interaktif brutalist `<ThemeToggle />` pada header `/blog` dan `/blog/[slug]`.
  - Preferensi tema pengunjung otomatis tersimpan di `localStorage` (`blog-theme`).
- **Animasi Transisi Sinematik Saat Kembali ke Portofolio Default Dark:**
  - Saat pengunjung berada dalam mode Warm Sepia dan menavigasi kembali ke halaman utama portofolio (`/`) atau rute non-blog lainnya, dipicu animasi *cinematic dark curtain transition* berdurasi 0.38s yang memudarkan layar secara mulus ke hitam sebelum memuat rute tujuan, menjamin transisi dari kertas perkamen ke tema dark portofolio terasa sangat halus tanpa kedipan kasar.
- **Pemadatan Header Blog & Pemindahan Teks Deskripsi ke Subtitle Badge (`/blog`):**
  - Mengintegrasikan teks deskripsi blog ke dalam badge ramping di samping judul utama: `{data.posts.length} entries · cloud & systems notes`.
  - Menghapus paragraf teks pengantar terpisah sehingga header menjadi satu baris kompak (*single-row header*), menghemat ruang vertikal secara signifikan dan menarik panel konten serta sidebar lebih tinggi ke atas.
- **Animasi Transisi Paginasi dengan Exit & Cascade Entrance (`/blog`):**
  - Mengimplementasikan animasi dua fase saat berpindah halaman: kartu lama keluar dengan cepat (*lift & fade* 0.14s), scroll kontainer di-reset secara instan, lalu 10 kartu baru masuk dengan kaskade GSAP stagger (`y: 22 -> 0, opacity: 0 -> 1, scale: 0.96 -> 1`).
  - Menambahkan perlindungan *race condition* (`isPaginating`) agar klik beruntun tidak merusak alur animasi kartu.
- **Animasi Menyeluruh di Semua Interaksi Tanpa Terkecuali (`/blog`):**
  - Memastikan seluruh pergantian tab (*Home, Categories, Tags, Archive*), pemilihan kategori/tag, filter subgroup, dan aksi tombol *Back* memiliki animasi transisi masuk dan keluar dengan GSAP stagger.
  - Memasang atribut penanda `data-category-card`, `data-tag-pill`, dan `data-archive-item` untuk penargetan animasi yang konsisten dan presisi.
- **Sistem Paginasi pada Home View Blog (`/blog`):**
  - Mengimplementasikan sistem paginasi 10 artikel per halaman dengan navigasi tombol `← Previous`, nomor halaman (`[ 1 ] [ 2 ] ...`), dan `Next →`.
  - Berpindah halaman memicu transisi kartu GSAP stagger dan melakukan *smooth scroll* kembali ke artikel teratas pada kontainer kartu.
  - Paginasi otomatis menyesuaikan dengan hasil pencarian dan filter tag (`Page X of Y · N posts`), serta kembali ke halaman 1 setiap kali filter berubah.
- **Penguncian Total Scroll Halaman Mode Desktop pada Seluruh Tab (`/blog`):**
  - Mengunci tinggi section di mode desktop (`lg:h-screen lg:max-h-screen lg:overflow-hidden`) sehingga halaman luar (*outer window*) tidak pernah bisa di-scroll sama sekali dalam resolusi atau tingkat *scale / browser zoom* berapa pun.
  - Memanfaatkan hirarki Flexbox dinamis (`flex-1 min-h-0 overflow-y-auto`) di mana seluruh konten (Home list, Categories grid/detail, Tags cloud/detail, dan Archive timeline) secara otomatis mengisi sisa ruang vertikal tanpa menyebabkan scrollbar pada jendela browser.
  - Menghentikan pergerakan Lenis window scroll saat berada di halaman blog desktop (`window.__lenis.stop()`) dan me-restore saat keluar dari halaman.
  - Menerapkan *smooth scrolling* internal (`scroll-smooth`, `scroll-behavior: smooth`) pada semua area scroll di setiap tab.

### Fixed
- **Perbaikan Clipping Sisi Atas Kartu Post Saat Mouse Hover (`/blog`):**
  - Mengatasi masalah terpotongnya sisi atas kartu artikel dan berkas aksen border saat kursor mouse di-hover (`hover:-translate-y-0.5`).
  - Menambahkan padding `pt-2.5 pb-3 px-1` pada seluruh kontainer kartu di tab *Home*, *Categories*, dan *Tags* sehingga pergeseran elemen ke atas memiliki ruang bebas yang cukup dan tidak terpotong oleh batas `overflow-y-auto`.
  - Menambahkan `hover:z-10` pada elemen kartu artikel sehingga border atas, garis cahaya, dan bayangan kartu (*box-shadow*) selalu berada di atas kartu tetangga tanpa terpotong.
- **Perbaikan Text & Badge Clipping Sisi Kiri pada Tab Archive (`/blog`):**
  - Memperbaiki lingkaran simbol ✦ dan garis timeline tahun yang sebelumnya terpotong di bagian kiri scroll container.
  - Memberikan padding kiri `pl-4` pada kontainer scroll dan margin kiri `ml-4` pada timeline wrapper sehingga seluruh elemen visual berada dengan aman di dalam area pandang tanpa terpotong.
- **Pencegahan Layout Shift / Konten Bergerak Saat Scrollbar Muncul/Hilang:**
  - Menambahkan `scrollbar-gutter: stable` pada elemen `html` di `src/app.css` untuk memesan ruang scrollbar secara permanen, mengeliminasi masalah pergeseran posisi maupun perubahan ukuran konten (*jitter / layout jump*) saat berpindah tab atau saat scrollbar berganti status antara muncul dan tersembunyi.

### Added
- **Pager Navigasi Antar Artikel Post Blog (`/blog/[slug]`):**
  - Menambahkan panel navigasi dua sisi (*Post Navigation Pager*) tepat di atas footer navigasi bawah artikel:
    - Sisi Kiri: Artikel terbaru berikutnya (*Newer Article*) dengan judul, tanggal, dan panah `←`. Jika pengunjung sedang membaca artikel yang paling baru (*newest post*), sisi kiri otomatis disembunyikan.
    - Sisi Kanan: Artikel sebelumnya (*Previous Article*) dengan judul, tanggal, dan panah `→`.
  - Terintegrasi langsung dengan data post hasil sort kronologis `getAllPosts()` di SvelteKit load function (`+page.js`).

### Fixed
- **Perbaikan Text Clipping pada Table of Contents Sidebar (`/blog/[slug]`):**
  - Memperbaiki teks judul heading pada Table of Contents yang sebelumnya terpotong di bagian sisi kiri akibat pemakaian margin negatif `-ml-[25px]` di dalam kontainer `overflow-y-auto`. Digantikan dengan padding bersih `pl-3` (level 2) dan `pl-5` (level 3) sehingga seluruh teks tampil utuh dan rapi.
- **Pembersihan Modul Duplikat Back to Top pada Sidebar Sticky:**
  - Menghapus tombol *Back to Top* pada flying sticky sidebar sebelah kanan untuk menghindari redundansi, karena fungsi *Top of Article* sudah tersedia di footer navigasi bawah artikel.

### Added
- **Optimasi Posisi Konten Blog Home (`/blog`):**
  - Menggeser konten utama artikel ke atas dengan merampingkan padding atas section (`pt-20 sm:pt-24`), memperkecil jarak margin, dan merapikan bar pencarian serta quick filter pills agar daftar kartu artikel langsung terlihat seketika saat halaman dibuka tanpa perlu scroll ke bawah.
  - Mempertahankan teks pengantar deskriptif (*"A digital workspace for technical documentation, cloud architecture design, and systems engineering field notes."*) tepat di bawah judul *Engineering Journal*.
- **Direct View Kategori & Tag dengan Tombol Back (`/blog`):**
  - Mengganti sistem dropdown/akordeon pada tab *Categories* menjadi *direct view*: mengklik kategori langsung menampilkan nama kategori dan seluruh artikel di dalamnya, dilengkapi tombol navigasi `[ ← All Categories ]` di samping judul kategori untuk kembali ke katalog kategori.
  - Menerapkan sistem serupa pada tab *Tags*: mengklik tag langsung membuka tampilan khusus tag beserta artikel terkait dengan tombol `[ ← All Tags ]` di samping nama tag untuk kembali ke cloud tags.
  - Mendukung deep-linking query URL (`/blog?tag=...` atau `/blog?category=...`) yang otomatis mengarahkan ke tab dan item yang bersangkutan.
  - Menambahkan animasi transisi GSAP yang halus saat membuka dan kembali dari tampilan detail kategori maupun tag.
- **Flying Content Sticky Sidebar pada Blog Reading View (`/blog/[slug]`):**
  - Mengatur struktur hirarki sidebar kanan: *Recently Updated* di bagian atas, diikuti *Trending Topics (Tags)*, dan *Contents (Table of Contents / TOC)* serta tombol *Back to Top* di bagian bawah.
  - **Selective Sticky Behavior:** Saat pengguna scroll ke bawah, modul *Recently Updated* dan *Trending Topics* akan bergulir ke atas seperti konten artikel awal, sedangkan modul *Contents (TOC)* dan tombol *Back to Top* akan mengunci (*sticky*) di posisi `top-20` dan mengikuti scroll pengguna hingga akhir artikel.
  - Mengganti `overflow-x: hidden` pada `body` menjadi `overflow-x: clip` di `src/app.css` untuk menjamin `position: sticky` bekerja 100% tanpa batas scroll container.
- **Reading Navigation Header & Quick Search Modal (`/blog/[slug]`):**
  - Mengembalikan bar navigasi atas reader ke posisi alaminya di bagian atas artikel (non-sticky, tidak menempel saat di-scroll) seperti layout awal.
  - Menonaktifkan listener shortcut keyboard `Ctrl+K` / `⌘K` pada halaman blog reading agar tidak bertabrakan dengan menu global Command Palette.
  - Tombol trigger pencarian menampilkan label bersih `[ SEARCH ]` (dapat dibuka dengan klik atau shortcut `/`).
- **Tipografi Khusus Terisolasi untuk Blog Post Reading:**
  - Menerapkan tipografi presisi yang diisolasi ketat hanya untuk halaman membaca artikel blog:
    - Heading (Judul): `Space Grotesk` (Weight 600 / 700)
    - Body (Teks): `Plus Jakarta Sans` (Weight 400 / 500)
    - Code (Blok Kode): `Fira Code`
  - Font tidak bocor ke halaman lain (*zero font leakage*) dengan selector scoped `.blog-reading-view` dan `.blog-prose`.
- **Perbaikan Rendering Tabel Markdown & Rewriting Link Internal (`src/lib/blog/posts.js`):**
  - Memperbaiki handler renderer tabel Markdown pada `marked` sehingga tabel ter-generate sebagai elemen HTML table lengkap dengan wrapper kontainer responsif `overflow-x-auto` dan styling border monokrom minimalis.
  - Menambahkan rewrite otomatis untuk relative link Jekyll `../[slug]/` ke rute SvelteKit `/blog/[slug]`.
- **Luminous Scroll Beacon pada Hero Section (`Hero.svelte`):**
  - Mengganti icon panah scroll `↓` dengan garis ramping 1px vertikal minimalis beranimasi pulsa cahaya berpendar (*flowing beam glow*) yang mengalir ke bawah secara halus dan berulang untuk memandu pengunjung menuju section About.
- **Sistem Jurnal Teknik Multi-View dengan Sidebar (`/blog`):**
  - Merancang layout jurnal teknis bergaya brutalist split (Sidebar + Main Panel) dengan 4 view dinamis:
    - `01 Home`: Daftar seluruh artikel urut tanggal terbaru, pencarian real-time, dan filter pill topik cepat.
    - `02 Categories`: Struktur hirarki kategori bersarang (*Primary Category* ➔ *Subcategory* ➔ *Post List*) dengan akordeon interaktif dan indikator jumlah post.
    - `03 Tags`: Tag cloud teknis lengkap dengan badge jumlah post (*count*), animasi seleksi aktif, dan filter daftar post terkait.
    - `04 Archive`: Garis waktu (*chronological timeline*) vertikal terorganisir per tahun dan tanggal rilis artikel dengan node waktu berpendar.
  - Menambahkan animasi GSAP di seluruh interaksi: transisi pergantian tab, akordeon kategori, klik filter tag, dan stagger entrance kartu artikel.
- **Animasi Reaktif Filter Kartu Proyek (`/projects`):**
  - Menambahkan re-trigger animasi stagger GSAP saat pengguna menyaring proyek berdasarkan kategori atau melakukan pencarian di halaman arsip proyek.
- **Seamless Page View Transitions & Motion Choreography:**
  - Menambahkan integrasi SvelteKit `onNavigate` dengan native browser View Transitions API (`document.startViewTransition`) pada `src/routes/(site)/+layout.svelte`.
  - Menambahkan styling dan keyframes `@keyframes vt-fade-out` dan `@keyframes vt-fade-in` dengan perpaduan subtle slide, blur, dan fade di `src/app.css`.
  - Mengimplementasikan penanganan transisi halus pada tombol `[ Explore All Projects Archive → ]` di `Portfolio.svelte` menuju bagian teratas halaman `/projects` lengkap dengan sinkronisasi Lenis smooth scroll (`window.__lenis?.scrollTo(0, { immediate: true })`).
- **Dedicated Project Case Study Pages (`/projects/[slug]`):**
  - Menambahkan rute dinamis `src/routes/(site)/projects/[slug]/` dengan prerendering otomatis untuk seluruh 6 proyek:
    - `/projects/white-archive`
    - `/projects/homelab`
    - `/projects/ha-web-server-aws`
    - `/projects/realtime-group-checklist`
    - `/projects/laravel-pos-accounting`
    - `/projects/atm-cli-banking-system`
  - Halaman proyek mencakup: Breadcrumbs, category badge, timeline tahun, specs sidebar, detail breakdown arsitektur, diagram/mockup, link repository/live, dan navigasi pager bolak-balik (`← Previous Project` / `Next Project →`).
  - Menambahkan properti `slug` pada setiap entri proyek di `src/lib/content/site.js`.
- **Global Command Palette (`⌘K`) Search Integration:**
  - Menambahkan navigasi instan ke halaman `Projects Archive` dan `Blog (Ngoprek Aja)`.
  - Menambahkan pencarian instan untuk seluruh 6 proyek berdasarkan judul, kategori, dan teknologi stack.
- **Pojok Kiri Dinamis Telemetri (`CornerTelemetry.svelte`):**
  - Menampilkan nama rasi bintang dan koordinat astronomi saat berada di section Hero.
  - Berganti secara halus (*crossfade cubic-bezier*) dengan Realtime Clock saat pengguna scroll masuk ke section About dan seterusnya.
  - Kembali menampilkan koordinat bintang saat scroll naik ke section Hero.
  - Selalu menampilkan Realtime Clock pada sub-halaman (`/projects`, `/blog`).
- **Reactive Constellation Store (`src/lib/stores/constellation.svelte.js`):**
  - Mengelola sinkronisasi reaktif data konstelasi antara canvas 3D Three.js dan HUD telemetri pojok kiri.
- **In-Modal Curriculum Vitae Document Reader (`ResumeModal.svelte`):**
  - Menampilkan dokumen CV teknis responsif (Bakti Surya Atmaja, Full-stack & Cloud Infrastructure) langsung di dalam modal tanpa memicu download otomatis dari browser.
  - Dilengkapi tombol eksplisit `[ DOWNLOAD PDF ]` dan `[ PRINT / SAVE ]`.
- **Native SvelteKit Blog Engine (`/blog` & `/blog/[slug]`):**
  - Migrasi 18 artikel teknis dari repositori Jekyll `srytmj.github.io` ke `src/posts/`.
  - Integrasi rendering diagram Mermaid.js dinamis dengan dark monochrome theme.
  - Parser Markdown kustom (`src/lib/blog/posts.js`) dengan estimasi reading time, lazy image loading, dan header file tabs (`{: file='...'}`).
  - Tombol copy kode interaktif pada setiap blok kode.
- **Dedicated Projects Archive (`/projects`):**
  - Katalog arsip 6 proyek rekayasa nyata dengan filter kategori (*Platform, Infrastructure, Web app, System*) dan pencarian teks.
  - Opsi kartu ganda: `Quick Specs ↗` (modal) dan `Deep Dive →` (halaman artikel proyek).
- **Home Page Engineering Telemetry:**
  - `StatsTelemetry.svelte`: Kartu metrik rekayasa (pengalaman, proyek, layanan homelab, target uptime).
  - `SiteTelemetry.svelte`: Panel drawer interaktif diagnosa perangkat pengunjung (Device Tier, CPU cores, RAM, network type, FPS) dan edukasi safety nets (FPS Watchdog, WebGL Context Loss Guard).
  - Availability status card (*Open for opportunities* dengan target roles dan preferensi kerja).
- **Data Model Terpusat (`src/lib/content/site.js`):**
  - Menambahkan konfigurasi `availability`, `stats`, `building`, `engineTrivia`, `resume`, dan `slug` proyek.

### Fixed
- **Perbaikan Total Internal Error 500 pada Halaman Blog (`/blog` & `/blog/[slug]`):**
  - Mengganti dependensi `gray-matter` dengan parser frontmatter berbasis `js-yaml` murni tanpa ketergantungan pada modul Node.js `Buffer` yang memicu crash `ReferenceError: Buffer is not defined` / HTTP 500 pada lingkungan browser Vite.
  - Menambahkan pengamanan parsing tanggal (`formatDisplayDate`) untuk menangani format timezone Jekyll (`+0800` / `+0700`) secara aman.
  - Memperbaiki parsing tag kustom Chirpy/Jekyll: styling callout prompts (`{: .prompt-tip }`, `{: .prompt-info }`, `{: .prompt-warning }`, `{: .prompt-danger }`), embed video YouTube responsif 16:9 (`{% include embed/youtube.html id='...' %}`), dan pembersihan atribut kramdown.
  - Menyalin aset gambar demo ke direktori `static/` dan menambahkan konfigurasi toleransi `handleMissingId: 'warn'` di `svelte.config.js`.
  - Mengubah teks breadcrumb navigasi halaman artikel ke bahasa Inggris (`All Articles`).

### Changed
- **Pembaruan Informasi Lokasi Domisili (`site.js` & `About.svelte`):**
  - Mengubah penanda lokasi dari `WIB · UTC+7` menjadi `Bandung, West Java` (`LOC: BANDUNG, WEST JAVA`) pada telemetry identitas About serta preferensi kerja `Remote / Hybrid (Bandung, West Java)`.
- **Konfigurasi Konten Showcase Blog (Template & Dummy Posts):**
  - Mengaktifkan 4 artikel referensi di `src/posts/` untuk pengujian ragam template dan tipografi:
    1. `2019-08-08-text-and-typography.md` (Showcase lengkap tipografi, tabel, rumus matematika, diagram Mermaid SVG, video YouTube, dan mockup multi-device).
    2. `2019-08-08-write-a-new-post.md` (Panduan penulisan post).
    3. `2019-08-09-getting-started.md` (Panduan instalasi & konfigurasi).
    4. `2026-05-19-keputusan-yang-tepat.md` (Artikel refleksi personal).
- **Akselerasi Kecepatan & Responsivitas Animasi Kartu Proyek:**
  - Menghilangkan delay berlebih pada kartu proyek di `/projects` dengan memisahkan timeline header/filter (`data-page-header`) dan kartu (`data-card-anim`), memotong durasi dari `0.75s` ke `0.38s`, serta memotong stagger dari `0.07s` ke `0.025s` dengan overlap `-=0.2s` sehingga kartu langsung muncul tanpa jeda menunggu.
  - Mempercepat animasi entrance section items di halaman beranda (`src/lib/scroll/sectionAnim.js`) dengan memotong initial delay dari `0.1s` ke `0.02s`, durasi dari `0.8s` ke `0.45s`, dan stagger dari `0.06s` ke `0.03s`.
- **Standardisasi Penuh Bahasa Inggris (100% English UI Copy & Metadata):**
  - Mengubah seluruh label antarmuka, metadata halaman, placeholder pencarian, filter kategori, badge status, tombol navigasi, dan deskripsi sistem ke dalam bahasa Inggris di seluruh rute situs (`/`, `/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`).
  - Mempertahankan konten asli isi artikel blog di `src/posts/` yang ditulis dalam bahasa Indonesia/Inggris sesuai tulisan aslinya.
- **Desain & Layout Realtime Clock (`LiveClock.svelte`):**
  - Mengubah layout jam menjadi: sisi kiri jam (`HH:mm:ss`), sisi kanan bertumpuk atas `UTC+7` dan bawah `WIB`.
  - Menghilangkan seluruh border, background box, dan pill container agar tampil *borderless* dan menyatu dengan atmosfer gelap kanvas web.
- **Relokasi Komponen "Currently Building":**
  - Memindahkan `CurrentlyBuilding.svelte` dari section About ke bagian atas section Portfolio (`Portfolio.svelte`), memberikan konteks proyek aktif sebelum daftar karya lampau.
- **Sinkronisasi Animasi Kolom Profil About (`About.svelte`):**
  - Menggabungkan elemen foto profil, status node, kartu Availability, dan tombol Resume ke dalam satu blok animasi container (`data-anim`).
  - Memperbaiki isu di mana status Availability muncul terlambat karena antrean stagger terpisah.
- **SideNav & Navigation:**
  - Menambahkan item rute internal `06 Blog`.
  - Menghubungkan seluruh navigasi secara konsisten di seluruh halaman situs.

### Removed
- **Eliminasi Total Icon (100% Pure Brutalist Typography):**
  - Menghapus seluruh tag `<svg>` icon dari komponen:
    - Tombol Menu di `+layout.svelte` (ikon kaca pembesar diganti `MENU [ ⌘K ]`).
    - Tombol copy email di `Contact.svelte` (ikon diganti feedback teks `[ COPY ]` → `[ COPIED ]`).
    - Tombol close di `ProjectModal.svelte` (ikon silang diganti karakter monospace `✕`).
    - Scroll cue di `Hero.svelte` (ikon panah diganti karakter `↓`).
    - Navigasi di `SideNav.svelte` (ikon bintang dan external diganti simbol tipografi `✦`).
  - Menghapus emoji icon dari komponen:
    - Menghapus emoji dokumen `📄` pada tombol CV di `About.svelte`.
    - Menghapus emoji bintang `★` pada badge pin di `blog/+page.svelte`.
- **Eliminasi Tag `<iframe>` pada Resume Modal:**
  - Menghapus iframe PDF yang menyebabkan download otomatis yang tidak diinginkan di browser Chromium/Windows.

---

## [0.1.0] - 2026-09-08
- Inisialisasi awal arsitektur web portofolio monokrom brutalist berbasis SvelteKit 2, Svelte 5 runes, Tailwind CSS v4, dan Three.js (Threlte).
- Starfield canvas 3D interaktif dengan konstelasi bintang zodiak dan tiering performa adaptif (`full`, `lite`, `static`).
