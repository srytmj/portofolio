# Changelog

Semua perubahan, penambahan fitur, perbaikan bug, dan pembaruan kode pada proyek portofolio ini didokumentasikan di file ini.

Format changelog ini mengacu pada [Keep a Changelog](https://keepachangelog.com/id/1.0.0/).

---

## [Unreleased] - 2026-09-11

### Added
- **[12:40 WIB] Dockerfile & Nginx Config untuk Deployment Homelab (`Dockerfile`, `nginx.conf`):**
  - Mengimplementasikan **Opsi 3** dari panduan deployment yang sudah ada di `README.md`/`AI_GUIDELINES.md` (sebelumnya baru didokumentasikan, belum ada berkasnya di repo).
  - `Dockerfile` multi-stage: stage `builder` (`node:20-alpine`) menjalankan `npm ci` + `npm run build` menghasilkan folder `build/` statis (adapter-static), lalu stage runtime (`nginx:alpine`) hanya menyalin hasil build tersebut — image akhir tidak membawa toolchain Node.js sama sekali.
  - `nginx.conf` dipisah dari `Dockerfile` (bukan `COPY <<EOF` heredoc seperti di dokumentasi) supaya tidak bergantung pada BuildKit heredoc syntax dan lebih mudah diedit terpisah. Isinya sama persis dengan konfigurasi Nginx yang sudah didokumentasikan: security headers, gzip, cache-control untuk `_app/immutable/` dan `assets/`, fallback `try_files` ke `404.html`.
  - Dipicu oleh setup homelab (`homelab-ops` repo, sesi Claude Code terpisah) yang butuh berkas ini nyata untuk `docker compose up --build` di `docker-host` — bukan perubahan UI/fitur situs itu sendiri.

## [Unreleased] - 2026-09-10

### Fixed
- **[01:56 WIB] Eliminasi Tabrakan SideNav dengan Kolom Konten pada Layar 1024-1400px (`SideNav.svelte`, `CornerTelemetry.svelte`):**
  - *Root cause*: rail dipasang `fixed left-14` (56px) sementara tepi kiri konten dihitung `max(gutter, (100vw - 1152px) / 2 + gutter)`. Pada viewport 1280px konten baru mulai di 100px sedangkan rail membentang 56-128px (hingga 156px saat baris aktif mekar), sehingga tumpang tindih 28-56px persis di atas kolom potret/Snake pada section About.
  - *Solusi*: rail kini punya tiga mode. Di bawah 1280px rail disembunyikan sepenuhnya karena memang tidak ada gutter yang layak (navigasi tetap tersedia lewat tombol MENU dan Ctrl+K). Pada 1280-1439px rail menciut menjadi kolom nomor (`02`-`06`) di `left: 1.5rem`, dan labelnya baru mengembang ketika rail di-hover atau menerima fokus keyboard. Pada 1440px ke atas perilaku lama dipertahankan penuh di `left: 3.5rem`.
  - *Verifikasi terukur*: 1280px menghasilkan rail 24-38px versus konten 100px (jarak bersih 62px, sebelumnya tumpang tindih 28px), dan saat rail di-hover lebarnya hanya mencapai 96px sehingga tetap bersih. 1440px menghasilkan rail 56-128px versus konten 180px (jarak bersih 52px) dengan seluruh label tampil.
  - *Aksesibilitas*: setiap tautan rail diberi `aria-label` eksplisit sehingga pembaca layar tetap membacakan "About", "Skills", dan seterusnya walaupun label visualnya sedang menciut menjadi nomor.
  - `CornerTelemetry` disejajarkan ke geometri yang sama (`left-6` dengan `min-[1440px]:left-14`) supaya HUD jam tidak menindih konten pada laptop 1280 dan 1366.
- **[01:56 WIB] Variant `dark:` Tailwind Terlepas dari Sistem Tema Situs (`app.css`, `app.html`):**
  - *Root cause*: Tailwind v4 memetakan `dark:` ke `@media (prefers-color-scheme: dark)` secara bawaan, sedangkan situs ini bertema melalui atribut `data-theme`. Akibatnya pengunjung dengan OS mode terang yang membuka situs dalam tema Tactical (gelap) menerima layar putih penuh dari `bg-neutral-50` milik overlay intro selama sekitar tiga detik, lalu menjeblos ke hitam pekat.
  - *Solusi*: menambahkan `@custom-variant dark` yang menargetkan `:root:not([data-theme=light])` pada `app.css`, sehingga seluruh utilitas `dark:` mengikuti tema aplikasi dengan gelap sebagai default.
  - Melengkapi dengan stamping `data-theme` dan `data-blog-theme` ke elemen `html` di skrip inline `app.html` sebelum cat pertama, plus aturan `#boot-cover` yang mengikuti tema (`#000` untuk gelap, `#d1d2c5` untuk terang). Sebelumnya boot cover selalu hitam, jadi penutup anti-kedip itu sendiri yang menjadi kedipan pada mode terang.
  - *Verifikasi*: pada CSS hasil build sudah tidak ada `prefers-color-scheme` sama sekali, dan utilitas `dark:` terkompilasi menjadi selector `:root:not([data-theme=light])`.
- **[01:56 WIB] Opening Sequence Dapat Menggantung Permanen (`intro/IntroCalibration.svelte`):**
  - *Root cause*: timeline memanggil `tl.call` berisi `tl.pause()` tanpa syarat pada label `sync-wait` (sekitar detik 1,15), sedangkan satu-satunya yang membangunkannya kembali adalah `checkProceed()` yang dipicu timer 1200ms dan event `load`. Bila timeline baru mencapai titik pause setelah kedua kondisi itu sudah terpenuhi (sangat mungkin, karena hidrasi dan inisialisasi Three.js membuat frame awal tersendat), tidak ada lagi yang memanggil `play()` dan intro diam di reticle sampai pengunjung mengklik. Selisih amannya hanya 50ms.
  - *Solusi*: gerbang dibuat eksplisit melalui flag `cleared`. Timeline hanya menjeda dirinya bila gerbang belum dibuka, dan `clearGate()` selalu mampu melanjutkannya dari sisi mana pun. Ditambahkan failsafe `MAX_WAIT_MS` 2000ms yang membuka gerbang secara paksa bila `window.load` tidak kunjung datang karena font atau gambar yang macet.
  - Menambahkan penjagaan `document.hidden`: tab yang dibuka di latar belakang memiliki `requestAnimationFrame` yang dibekukan browser, sehingga timeline akan diam dengan scroll halaman terkunci sampai pengunjung berpindah ke tab itu. Kini intro langsung menyerahkan kendali ke Hero.
  - Durasi total dipangkas dari sekitar 3,5 detik menjadi sekitar 2,1 detik, dan waktu tampil minimum diturunkan dari 1200ms ke 700ms.
  - Seluruh warna overlay dipindahkan dari `neutral-50` dan `white` yang hardcoded ke token `--yorha-bg` dan `--yorha-text-primary`, sehingga intro selalu sewarna tema yang sedang aktif.
  - Tombol bypass kini juga menerima `Enter` dan mendeteksi `e.code` bernilai `Space`, bukan hanya `e.key` berupa spasi.
- **[01:56 WIB] Custom Cursor Ter-mount Ganda, Tidak Ikut Tema, dan Berisiko Menghilangkan Pointer (`(site)/+layout.svelte`, `CustomCursor.svelte`, `app.css`):**
  - `CustomCursor` ter-mount dua kali pada seluruh halaman `(site)`, yaitu di root layout dan di site layout, menghasilkan dua elemen kursor beserta dua set listener `mousemove`. Mount duplikat di site layout dihapus.
  - SVG crosshair yang sebelumnya dikunci `text-white` kini mewarisi `var(--yorha-text-primary)`, dan halo `drop-shadow` memakai `var(--yorha-bg)`. Pada tema Bunker yang berlatar krem, kursor putih praktis tidak terlihat.
  - Aturan `cursor: none` global kini dijaga `:has(.cursor-root)`, sehingga penunjuk bawaan hanya disembunyikan selama elemen penggantinya benar-benar ada di DOM. Sebelumnya satu kegagalan render membuat pengunjung kehilangan pointer sepenuhnya tanpa jalan keluar.
- **[01:56 WIB] Kontras Teks Mikro di Bawah Ambang WCAG AA (`app.css`, `About.svelte`, `Skills.svelte`, `Contact.svelte`):**
  - *Terukur*: `--yorha-text-muted` versi gelap `#686760` hanya mencapai rasio 3,70:1 di atas `#000000`, dan versi terang `#7d796c` hanya 2,85:1 di atas `#d1d2c5`. Padahal token itu justru dipakai untuk label berukuran 9 sampai 11 piksel.
  - Token dinaikkan menjadi `#767569` (4,52:1) untuk mode gelap dan digelapkan menjadi `#59564c` (4,80:1) untuk mode terang, termasuk pasangan `--blog-text-muted`.
  - Label 9-10px yang duduk di `opacity-50` (`ACTIVE TARGET SPEC`, `CLASSIFICATION`, alamat GitHub dan LinkedIn, baris `LOC:`) dinaikkan ke `opacity-75`.
- **[01:56 WIB] Penghitung Kunjungan Memanggil API Setiap Mount dengan Logika Cache Mati (`Contact.svelte`):**
  - *Root cause*: `localStorage.setItem` untuk `visitor_count_cache` langsung diikuti `localStorage.removeItem` tanpa syarat apa pun, sehingga cache tidak pernah berfungsi. Selain itu fallback lokal mengarang angka yang hanya bisa dilihat pengunjung itu sendiri, dan endpoint `/up` menaikkan hitungan pada setiap remount saat navigasi sisi klien.
  - *Solusi*: hitungan dinaikkan sekali per sesi lalu dibaca dari `sessionStorage`, request diberi `AbortSignal.timeout(4000)`, dan fallback yang mengarang angka dihapus seluruhnya. Bila API gagal atau diblokir, lencana cukup tidak ditampilkan.
- **[01:56 WIB] Panah CTA Arsip Proyek Tidak Pernah Bergerak (`Portfolio.svelte`):**
  - Tautan `Explore All Projects Archive` menganimasikan panahnya dengan `group-hover:translate-x-1`, padahal elemen `a` induknya tidak pernah diberi kelas `group`. Kelas `group` ditambahkan.

### Removed
- **[01:56 WIB] Route Eksperimen, Dependensi, dan Kode Mati (`(site)/sandbox/`, `(site)/test-intro/`, `package.json`, `Section.svelte`, `Contact.svelte`, `CommandPalette.svelte`):**
  - Menghapus route `sandbox` dan `test-intro`. Keduanya ikut ter-prerender ke `build/` karena `export const prerender = true` berlaku global di root layout, sehingga halaman eksperimen internal akan dapat diakses publik setelah deploy. Isinya tetap dapat dipulihkan dari commit `2ce3237`.
  - Menghapus dependensi `animejs` yang tidak pernah diimpor sama sekali. Proyek ini memakai GSAP sebagai satu-satunya pustaka animasi.
  - Membersihkan `const words` hasil `$derived` yang tidak terpakai di `Section.svelte` dan `Contact.svelte`, serta kelas mati `bg-black` pada panel CommandPalette yang sudah tertimpa `background-color` inline.

### Added
- **[01:20 WIB] Sistem Opening Sequence Baru Berbasis Kalibrasi Optik YoRHa (`lib/components/intro/`, `(site)/+page.svelte`):**
  - Menambahkan direktori `src/lib/components/intro/` berisi tiga konsep opening sequence: `IntroCalibration.svelte` (dipakai di produksi), `IntroTacticalCalibration.svelte`, dan `IntroConstellation.svelte`.
  - `IntroCalibration.svelte` menjalankan koreografi lima fase murni tanpa teks: scanline vertikal menyapu layar, reticle HUD dan crosshair menyala, rotasi ratchet 45 derajat dengan pulsa aperture radar, double-pulse lock-on, lalu shutter expansion yang membuka empat sudut bracket ke luar layar.
  - Timeline disinkronkan dengan status muat browser sungguhan (`window.load`) plus durasi tampil minimum 1200ms, sehingga intro tidak selesai sebelum halaman benar-benar siap.
  - Halaman utama beralih dari `IntroSequence.svelte` (konsep dot-field lama) ke `IntroCalibration.svelte`.
- **[01:20 WIB] Tombol Return to Hero pada Telemetri Sudut (`CornerTelemetry.svelte`):**
  - Menambahkan tombol `← RETURN TO HERO` yang muncul lewat animasi `grid-template-rows: 0fr → 1fr` hanya ketika pengunjung berada di subhalaman (`/blog`, `/projects`), tepat di atas LiveClock.
- **[01:20 WIB] Marquee Telemetri pada Seam Transisi Hero (`(site)/+page.svelte`, `app.css`):**
  - Mengganti seam HUD statis menjadi marquee horizontal berulang (`@keyframes marquee`, kelas `.animate-marquee`, siklus 20 detik) berisi empat blok telemetri: `SYS_ENGAGE // SECTOR_02_MONITOR`, `HUD_MATRIX_ONLINE`, `ORBIT → TERRESTRIAL`, dan `DATA_LINK_ESTABLISHED [0x00FF9]`.
  - Menambahkan keyframe `crtTurnOn` dan kelas `.animate-crt-on` untuk efek nyala layar CRT.
- **[01:20 WIB] Hook Animasi Header Section (`Section.svelte`):**
  - Menambahkan penanda `data-anim-badge` pada kode `SEC // 0x`, `data-anim-line` pada hairline, dan `data-anim-scan` pada berkas sapuan cahaya, agar `sectionAnim.js` dapat mengoreografikan header tiap section.
- **[01:20 WIB] Route Eksperimen (`(site)/sandbox/`, `(site)/test-intro/`):**
  - Menambahkan dua route lokal untuk membandingkan konsep opening sequence dan menguji komponen secara terisolasi.

### Changed
- **[01:20 WIB] Perombakan Custom Cursor Taktis (`CustomCursor.svelte`):**
  - Mengganti dua elemen `<line>` SVG 20px dengan satu `<path>` crosshair 24px bercelah plus titik pusat (`<circle r=1.5>`).
  - Meninggalkan `mix-blend-mode: difference` dan beralih ke `currentColor` putih dengan dua lapis `drop-shadow`, sehingga kursor tetap terbaca di atas permukaan terang maupun gelap tanpa bergantung pada mode blending.
  - Interaksi hover kini memutar crosshair 45 derajat (`scale(1.2) rotate(45deg)`) sebagai umpan balik lock-on, dan kembali lurus saat ditekan.
- **[01:20 WIB] Penyeragaman Tipografi Prosa ke Sans (`About.svelte`, `Hero.svelte`):**
  - Mengubah paragraf intro dan body About dari `font-serif italic` (Baskervville) menjadi `font-sans tracking-wide` (Epilogue) demi keterbacaan pada layar kecil.
  - Mengubah margin note rasi bintang di hero dari serif italic 13px menjadi sans 11px dengan opacity 70.
  - Menghapus empat corner bracket pada kartu Availability agar kartu tidak bersaing dengan kartu proyek.
- **[01:56 WIB] Penurunan Kebisingan Visual Halaman Utama (`(site)/+page.svelte`, `About.svelte`, `Skills.svelte`, `Contact.svelte`, `CurrentlyBuilding.svelte`, `app.css`):**
  - **Marquee seam dihapus**: seam transisi Hero ke About dikembalikan menjadi bilah statis. Marquee horizontal yang berjalan tanpa henti berada persis di titik pembaca seharusnya berhenti menatap langit dan mulai membaca, dan gerak berulang di posisi itu adalah magnet perhatian terkuat di seluruh halaman. `@keyframes marquee` dan `.animate-marquee` ikut dibersihkan dari `app.css`.
  - **Denyut dipangkas dari sembilan menjadi satu per section**: sebelumnya ada indikator berdenyut pada Node 01, Availability, Currently Building, Pod 042, bilah spesifikasi mobile Skills, lembar mobile Skills, Channel 01, badge COMMISSIONS, dan seam. Kini denyut hanya tersisa pada Availability di section About dan COMMISSIONS di section Contact, yaitu dua sinyal yang benar-benar dapat ditindaklanjuti pengunjung. Sisanya menjadi titik statis.
  - **Aksen emerald dikembalikan maknanya**: kode indeks `SEC // 0x` pada Skills serta label `[ DIRECT_INBOX ]` dan `[ EXTERNAL_NODES ]` pada Contact tidak lagi memakai warna aksen. Aksen kini disediakan untuk status yang hidup dan hal yang bisa diklik.
  - **Corner bracket menjadi umpan balik hover**: delapan bracket permanen pada dua kartu Contact kini hanya muncul saat hover, mengikuti pola kartu proyek. Bingkai Pod 042 diturunkan dari `border-current` penuh menjadi `border-current/35`.
  - **Bayangan dibersihkan**: empat pelanggaran aturan zero-shadow di `Skills.svelte` (`shadow-xs`, `shadow-sm`, `shadow-lg`, `shadow-2xl`) dihapus.
- **[01:56 WIB] Hero Memperoleh Aksi Utama (`Hero.svelte`):**
  - Menambahkan tombol primer `View projects` menuju `/projects` dengan gaya blok terbalik (`--yorha-invert-bg`), berdampingan dengan tombol `Engineering Journal` yang kini berperan sebagai aksi sekunder. Sebelumnya satu-satunya aksi di atas lipatan adalah tautan ke blog, padahal tugas pertama sebuah portofolio adalah menawarkan karyanya.
- **[01:56 WIB] Pod 042 Terbuka dengan Isi, dan Interaksi Rasi Bintang Dijelaskan (`Skills.svelte`, `stores/constellation.svelte.js`, `CornerTelemetry.svelte`):**
  - Inspector Pod 042 kini terbuka pada kapabilitas dengan `readiness` tertinggi, bukan bingkai kosong bertuliskan STANDBY setinggi 460px. Baris status bawah menampilkan `HOVER A NODE TO INSPECT` sampai pengunjung benar-benar menyentuh sebuah node, dan bilah spesifikasi mobile hanya muncul setelah ketukan yang disengaja.
  - Store rasi bintang memperoleh flag `traced`. Selama belum ada figur yang tersingkap, HUD sudut kiri bawah menampilkan `Move to trace a figure` alih-alih koordinat langit. Interaksi paling mahal secara teknis di proyek ini sebelumnya sama sekali tidak punya petunjuk keberadaan.
- **[02:54 WIB] Adapter Produksi dan Pipeline Deploy GitHub Pages (`svelte.config.js`, `package.json`, `.github/workflows/deploy.yml`):**
  - Mengganti `@sveltejs/adapter-auto` dengan `@sveltejs/adapter-static` memakai konfigurasi yang sudah didokumentasikan di README (`pages: build`, `assets: build`, `fallback: 404.html`, `strict: true`), lalu mencopot `adapter-auto` dari devDependencies. Sebelumnya setiap build ditutup peringatan `Could not detect a supported production environment` dan tidak ada artefak yang benar-benar siap dideploy.
  - `strict: true` lolos, artinya seluruh rute memang terprerender. Build menghasilkan 27 berkas HTML: beranda, `404.html`, indeks `projects` dan `blog`, enam halaman deep dive proyek, serta tujuh belas artikel.
  - Menambahkan `.github/workflows/deploy.yml` sesuai spesifikasi di README: `npm ci`, `npm run build`, lalu `upload-pages-artifact` dan `deploy-pages`, dengan `concurrency` yang tidak membatalkan deploy yang sedang berjalan.
  - Keluaran build tetap satu folder statis, jadi pindah ke nginx di EC2 atau kontainer homelab cukup dengan menghapus berkas workflow ini tanpa menyentuh konfigurasi build.
- **[02:54 WIB] Binding `bind:this` di Command Palette Bukan Runes (`CommandPalette.svelte`):**
  - `backdrop`, `panel`, `input`, dan `listEl` dideklarasikan sebagai `let` biasa padahal dipakai sebagai target `bind:this`. Svelte 5 menerbitkan empat peringatan `non_reactive_update` yang menyatakan perubahan nilainya tidak akan memicu update dengan benar, dan ini melanggar aturan runes murni pada AI_GUIDELINES.
  - Keempatnya kini `$state(null)` dengan tipe JSDoc yang diperlebar agar menerima `null`. Peringatan `non_reactive_update` turun dari empat menjadi nol.
- **[02:54 WIB] Selector CSS Mati di Halaman Blog Merusak Warna Hover Kartu (`blog/+page.svelte`, `blog/[slug]/+page.svelte`):**
  - *Root cause*: kedua halaman blog menyimpan blok `<style>` berisi override tema sepia yang menduplikasi aturan yang sudah ada di `app.css`. Karena selector seperti `:global([data-blog-theme]) .text-white` menargetkan kelas yang tidak pernah muncul di markup komponennya sendiri, Svelte menandai 52 selector sebagai tidak terpakai.
  - Dampaknya bukan sekadar kotor. Tiga selector berisi garis miring ter-escape (`.group\/link:hover .group-hover\/link\:text-emerald-400`) membuat esbuild salah parse saat minifikasi dan menyisipkan `*/` liar ke tengah daftar selector. Satu `*/` liar membatalkan seluruh aturan, sehingga warna aksen pada hover `[data-home-card] h2`, `[data-category-card] h3`, `[data-tag-post-item] h3`, dan navigasi sidebar blog **tidak pernah aktif di produksi**. Inilah sumber peringatan `Unexpected "/"` yang muncul di setiap build.
  - *Solusi*: menghapus tepat 52 selector yang ditandai Svelte, mempertahankan seluruh selector yang masih terpakai di dalam daftar yang sama. Total 21 aturan yang seluruh selectornya mati ikut dibuang.
  - *Verifikasi cold build* (`.svelte-kit` dan `build` dihapus lebih dulu): exit 0, peringatan `css_unused_selector` 52 ke 0, peringatan `Unexpected "/"` 2 ke 0, dan aturan hover blog kini terbit utuh tanpa `*/` liar. Tiga utilitas Tailwind yang ikut hilang (`bg-emerald-400`, `bg-ink-1`, `border-emerald-400`) terbukti kelas hantu: keduanya hanya pernah muncul sebagai teks selector di blok yang dihapus, tidak pernah dipakai di markup mana pun.

---

## [Unreleased] - 2026-09-09

### Fixed
- **[20:00 WIB] Penyelamatan & Penyempurnaan Animasi Filter Node Projects, Tombol Navigasi Blog, dan Animasi Filter Node Blog (`projects/+page.svelte`, `blog/+page.svelte`):**
  - **Animasi Cascade Staggered pada Filter Nodes Halaman Proyek (`projects/+page.svelte`)**:
    - Membungkus grid proyek dengan blok reaktif `{#key `${selectedKind}-${searchQuery}`}` dan menerapkan transisi Svelte bawaan `in:fly={{ y: reduce ? 0 : 20, duration: reduce ? 0 : 280, delay: reduce ? 0 : i * 40, easing: cubicOut }}` pada setiap kartu proyek.
    - Menghapus class CSS `transition-all duration-200` pada kartu proyek yang sebelumnya bertabrakan dengan interpolasi transform/opacity JS/GSAP (sehingga animasi terlihat tidak jalan atau dibatalkan browser).
    - Menghapus ketergantungan pada query selector manual DOM dan race condition `tick()` / Svelte 5 DOM node reuse, sehingga setiap kali pengguna mengklik tombol filter `ALL`, `INFRASTRUCTURE`, `AUTOMATION`, `SYSTEMS`, dsb., kartu-kartu proyek dijamin 100% meluncur masuk secara berurutan (*staggered cascade*) dengan sangat mulus.
  - **Kerapian Bilah Navigasi Sidebar Halaman Blog Desktop (`blog/+page.svelte`)**:
    - Memperbaiki kontainer `<nav>` dengan menambahkan `lg:items-stretch lg:overflow-visible` serta menerapkan `lg:w-full px-3.5 py-2.5` pada tombol navigasi sidebar (`01 Home`, `02 Categories`, `03 Tags`, `04 Archive`).
    - *Root cause*: Sebelumnya `<nav>` memiliki `items-center` yang membuat tombol menyusut selebar teksnya masing-masing di layar desktop monitor, tampak tidak rata dan bergerigi di tengah kolom. Sekarang seluruh tombol membentang penuh 100% dari tepi ke tepi kolom sidebar dengan panah `→` rata kanan sempurna dan presisi taktis khas konsol komando YoRHa.
  - **Animasi Masuk Berirama (*Staggered Cascade*) pada Seluruh Filter Node Halaman Blog (`blog/+page.svelte`)**:
    - **Filter Tag Cepat & Paginasi Beranda (`Home View`)**: Membungkus daftar kartu dengan `{#key `${homeFilterTag}-${currentPage}-${searchQuery}`}` dan menyematkan `in:fly={{ y: reduce ? 0 : 18, duration: reduce ? 0 : 250, delay: reduce ? 0 : i * 35, easing: cubicOut }}` serta membersihkan `transition-all duration-200`. Saat memilih tag cepat (`[ all ]`, `[ linux ]`, `[ devops ]`, dsb.) atau berpindah halaman paginasi, kartu artikel meluncur masuk berurutan secara nyata.
    - **Grid Kategori & Subgroup Filter (`Categories View`)**: Menambahkan animasi masuk `in:fly` berurutan pada kartu kategori, serta membungkus daftar artikel subkategori dengan `{#key `${selectedCategory.name}-${selectedSubcategory}`}` sehingga saat mengklik filter subgroup (`All`, subkategori tertentu), artikel yang cocok langsung mengalir masuk dengan animasi staggered.
    - **Tag Cloud & Detail Tag (`Tags View`)**: Menambahkan `in:fly` berurutan pada pill tag cloud dan membungkus daftar post tag dengan `{#key selectedTag}` agar saat tag diklik, seluruh artikel terkait muncul dengan animasi cascade.
    - **Timeline Arsip (`Archive View`)**: Membungkus grup tahun arsip dengan `{#key activeTab}` dan transisi `in:fly` berjenjang.
- **[19:50 WIB] Audit Menyeluruh Navigasi PC & Eliminasi Pemotongan Tombol Filter Node (`SideNav.svelte`, `Skills.svelte`, `projects/+page.svelte`):**
  - **Penyempurnaan Pemusatan Vertikal & Smooth Scrolling SideNav pada Layout PC (`SideNav.svelte`)**:
    - Memperbaiki kalkulasi transform GSAP pada `<nav>` SideNav dengan menyematkan `yPercent: -50` secara eksplisit pada `gsap.set()` dan `gsap.to()`. Sebelumnya pengaturan `xPercent` oleh GSAP menimpa class CSS `-translate-y-1/2`, menyebabkan bilah navigasi turun terlalu rendah di layar monitor PC.
    - Menambahkan fungsi `handleNavClick` untuk smooth scrolling via Lenis (`window.__lenis.scrollTo()`) langsung ke target section (`#about`, `#skills`, `#portfolio`, `#contact`, `#top`) saat berada di beranda. Sebelumnya tautan berawalan slash `/#about` memicu intersep router `onNavigate` SvelteKit yang me-reset scroll ke titik `(0, 0)` secara kasar.
  - **Eliminasi Bug Pemotongan Tombol & Reticle Filter Node (`Skills.svelte`, `projects/+page.svelte`):**
    - Menambahkan `pt-2` dan `sm:overflow-visible` pada kontainer tombol filter node di section Skills dan Projects.
    - *Root cause*: Keberadaan `overflow-x-auto` tanpa jarak atas memotong bagian atas tombol sebesar 2px ketika tombol terangkat ke atas saat di-hover (`hover:-translate-y-0.5`) dan memotong garis reticle sudut saat tombol berstatus aktif (`-top-px`).
- **[19:46 WIB] Penyelamatan Stabilitas Section Skills, Animasi Node Filter & Accordion, Stagger Filter Proyek, dan Penonaktifan Cursor Touch di Mobile (`CustomCursor.svelte`, `app.css`, `Skills.svelte`, `projects/+page.svelte`):**
  - **Penonaktifan Total Custom Cursor pada Perangkat Sentuh Ponsel (`CustomCursor.svelte`, `app.css`)**:
    - Membatasi inisialisasi custom cursor hanya pada perangkat yang memiliki kapabilitas pointer presisi dan hover sejati `(hover: hover) and (pointer: fine)`.
    - Menambahkan penangan event `touchstart` yang langsung mematikan flag visibilitas kursor dan mengabaikan event mouse tiruan (*synthetic mousemove*) saat layar sentuh diusap.
    - Menambahkan override CSS `@media (hover: none), (pointer: coarse) { .custom-cursor-wrapper { display: none !important; } }` dan `cursor: auto !important` di `app.css`.
  - **Penyelamatan Stabilitas Scroll Section Skills di Ponsel & Tablet (`Skills.svelte`)**:
    - Menghapus pemanggilan destruktif `ScrollTrigger.refresh()` pada saat filter node atau toggle accordion diklik.
    - *Root cause*: Pemanggilan `ScrollTrigger.refresh()` saat pengguna sedang berada di tengah halaman memicu *unpinning* sementara pada Hero ScrollTrigger di atasnya, yang mengubah kalkulasi offset scroll dan menyebabkan posisi section Skills bergeser/meloncat secara acak.
    - Menggantinya dengan `window.__lenis?.resize()` yang aman dan menjaga posisi scroll viewport tetap terkunci kokoh di tempatnya.
  - **Penambahan Animasi Staggered pada Filter Node & Transisi Masuk Expand/Minimize Skills (`Skills.svelte`)**:
    - Menambahkan penanda `data-skill-layer` pada kontainer layer dan menyematkan animasi masuk berirama (*staggered cascade*) GSAP (`y: 12, opacity: 0` → `y: 0, opacity: 1, stagger: 0.05`) saat memilih filter kategori node keahlian.
    - Menerapkan transisi masuk `in:fly={{ y: -4, duration: 160 }}` untuk chip ringkasan saat layer diminimalkan dan `in:fly={{ y: 8, duration: 180 }}` untuk grid kartu saat diekspansi (hanya transisi masuk murni tanpa transisi keluar bersamaan, sehingga menghasilkan animasi meluncur mulus 100% bebas dari bug penumpukan tinggi elemen).
  - **Penambahan Animasi Staggered pada Filter Nodes Halaman Proyek (`projects/+page.svelte`)**:
    - Memperbarui fungsi `setKind()` dan efek pencarian dengan animasi masuk beruntun GSAP (`y: 12, opacity: 0` → `y: 0, opacity: 1, duration: 0.24, stagger: 0.04, ease: 'power2.out'`), memberikan umpan balik visual yang jelas, taktis, dan responsif saat berganti kategori.
- **[19:40 WIB] Auto-Scroll ke Atas saat Paginasi di Mobile & Tablet serta Penyesuaian Ukuran Judul Blog Reader (`blog/+page.svelte`, `blog/[slug]/+page.svelte`):**
  - **Auto-Scroll ke Pucuk Atas saat Ganti Halaman Paginasi & Filter Tag (`blog/+page.svelte`)**:
    - Menambahkan mekanisme scroll otomatis (`window.__lenis.scrollTo(0, { duration: 0.5 })` / `window.scrollTo({ top: 0, behavior: 'smooth' })`) pada fungsi `goToPage()` dan `setHomeFilterTag()` khusus untuk tampilan ponsel dan tablet (`window.innerWidth < 1024`).
    - Sebelumnya, pengguna yang berada di bawah (dekat tombol paginasi) akan tetap tertinggal di dasar halaman saat beralih ke halaman 2, 3, dst. Kini posisi layar otomatis meluncur kembali ke atas menampilkan kartu-kartu baru dari awal.
  - **Pengecilan Proporsional Judul Blog Reader pada Tablet & Ponsel (`blog/[slug]/+page.svelte`)**:
    - Mengubah ukuran judul `H1` artikel dari `text-h1` kaku (`clamp(2.4rem, ...)` yang memakan ruang vertikal berlebih) menjadi `text-xl sm:text-2xl md:text-3xl lg:text-h1 font-bold leading-snug sm:leading-tight` dengan padding sorotan `px-1.5 sm:px-2 py-0.5`.
    - Di layar ponsel, judul kini hanya memakan 1-2 baris ringkas sehingga pembaca dapat langsung melihat deskripsi, kategori, tags, dan isi artikel tanpa harus scroll berlebihan.
- **[19:35 WIB] Perbaikan Animasi Accordion Skills & Pembukaan Kunci Touch-Scroll Halaman Blog Mobile (`Skills.svelte`, `blog/+page.svelte`):**
  - **Eliminasi Glitch/Height Jumping pada Accordion Skills (`Skills.svelte`)**:
    - Menghapus `transition:fly` pada blok kondisional Svelte chip ringkasan dan grid kartu.
    - *Root cause*: Penggunaan transisi `fly` keluar dan masuk secara simultan menyebabkan elemen keluar dan elemen masuk berada bersamaan di DOM flow selama durasi transisi (~180ms). Hal ini menggandakan tinggi kontainer seketika, mendorong kartu ke bawah, dan membuat perhitungan tinggi dinamis `ScrollTrigger` dan `Lenis` bergetar/meloncat (*awkward animation*).
    - Pergantian instan tanpa jeda transisi tumpang-tindih menghasilkan ekspansi dan minimisasi layer yang sangat responsif, stabil, dan bebas glitch visual.
  - **Penyelesaian Bug Macet Touch-Scroll pada Halaman Blog Mobile (`blog/+page.svelte`)**:
    - Menghapus atribut `data-lenis-prevent` dari 6 kontainer daftar internal (katalog beranda, grid kategori, daftar post kategori, grid tags, daftar post tag, dan timeline arsip).
    - Membatasi aturan layout viewport kaku 100vh (`overflow-hidden`, `min-h-0`, dan internal `overflow-y-auto`) hanya berlaku pada layar desktop (`lg:`).
    - *Root cause*: Pada desktop, halaman blog didesain sebagai 100vh HUD dua kolom dengan scroll mandiri di panel kanan. Namun di perangkat smartphone, pembatasan `overflow-hidden` pada elemen `<main>` dipadukan dengan `data-lenis-prevent` pada kontainer bertingkat mencegat semua event gesture sentuhan jari (`touchstart`/`touchmove`). Akibatnya, saat pengunjung menyentuh dan menggeser layar di area kartu blog, halaman sama sekali tidak bisa digulirkan.
    - Dengan penyesuaian ini, di layar smartphone pengguna dapat bebas mengusap kartu manapun untuk men-scroll halaman ke atas/bawah secara natural, sementara di layar desktop tampilan 100vh HUD dual-panel tetap terjaga sempurna.

### Added
- **[19:38 WIB] Pemisahan Baris Mandiri untuk Kategori & Tags di Halaman Blog Reader (`blog/[slug]/+page.svelte`):**
  - Memisahkan elemen metadata kategori dan tags artikel ke dalam **2 baris terpisah secara mandiri** (`2 dedicated rows`) pada semua resolusi layar (smartphone, tablet, dan desktop).
  - **Baris 1: `[ CATEGORY ]`**: Menampilkan chip kategori interaktif yang terhubung langsung ke filter tab Kategori di `/blog?category=...`, lengkap dengan styling YoRHa invert-hover.
  - **Baris 2: `[ TAGS ]`**: Menampilkan deretan badge tag interaktif dengan format `#{tag}` yang terhubung langsung ke filter tab Tags di `/blog?tag=...`.
  - Merapikan baris paling atas header artikel sehingga murni hanya menampilkan tanggal dan estimasi waktu baca (`date · readingTime`) secara bersih tanpa terjejali teks kategori.
  - Menyelaraskan posisi awal badge pada layar tablet dan desktop menggunakan lebar tetap `sm:w-24`, dengan fleksibilitas pembungkusan otomatis (*natural wrapping*) di layar smartphone.

- **[19:25 WIB] Penyelamatan & Pengaktifan Menyeluruh Animasi pada Layar Tablet & Smartphone (`device.js`, `sectionAnim.js`, `Skills.svelte`, `projects/+page.svelte`, `blog/+page.svelte`, `SnakePlaceholder.svelte`):**
  - **Perbaikan Deteksi Kemampuan Hardware (`device.js`)**:
    - Memperbaiki `detectTier()` yang sebelumnya salah mengklasifikasikan hampir seluruh tablet dan smartphone modern (iOS Safari, iPadOS, Android) ke dalam tier `'static'` karena pembatasan `cores <= 4`.
    - Mengaktifkan tier `'lite'` (dan `'full'` pada tablet bertenaga tinggi) sehingga **IntroSequence (opening cinematic)**, **Hero Three.js Constellations**, **auto-cycling perbintangan interaktif pada layar sentuh**, dan **GSAP pinned scroll choreography** kini aktif sepenuhnya pada tablet dan ponsel.
  - **Stabilisasi & Peremajaan Animasi Scroll Section (`sectionAnim.js`)**:
    - Memperbarui pemicu ScrollTrigger dari `top 78%` menjadi `top 88%` dan menghapus pemotongan dini `end: 'bottom 22%'` yang sebelumnya menyebabkan teks dan kartu tiba-tiba memudar buram saat pengguna sedang membaca di layar sempit.
    - Menambahkan `stagger: 0.05` pada animasi masuk konten section agar kartu, paragraf, dan statistik muncul mengalir secara berirama (*rippling staggered entrance*).
    - Memastikan pemeriksaan `st.progress > 0` saat mount sehingga tidak ada section yang tertinggal dalam kondisi `opacity: 0`.
  - **Staggered Entrance pada Arsip Proyek (`projects/+page.svelte`)**:
    - Menghadirkan animasi masuk awal kartu proyek saat halaman arsip dibuka pertama kali.
  - **Pembersihan `clearProps` pada Blog (`blog/+page.svelte`)**:
    - Mengganti `clearProps: 'all'` menjadi `clearProps: 'transform,opacity'` sesuai aturan SOP maintenance agar tidak menghapus style inline CSS.
- **[19:15 WIB] Penyempurnaan Khusus Pengalaman Mobile: About Sebaris, Auto-Minimize Skills dengan Ringkasan, Contact 2-in-1, Pangkas Scroll Hero, & Sembunyikan Back-to-Hero (`About.svelte`, `Skills.svelte`, `Contact.svelte`, `heroTransition.js`, `Section.svelte`, `LeftEdgeReturn.svelte`):**
  - **About Section (`About.svelte`)**:
    - Menata *Open for Opportunities* dan tombol *[ VIEW RESUME / CV ]* berada **sebaris sejajar dengan area foto** di sebelah kanan dan **posisinya persis di bawah Node 01 Status & Lokasi**, sehingga seluruh blok identitas mobile muat dalam tinggi kanvas foto tanpa membutuhkan card terpisah di bawahnya.
    - Menjaga tampilan kartu availability penuh dengan role tags tetap rapi untuk resolusi tablet dan desktop (`hidden sm:block`).
  - **Skills Matrix (`Skills.svelte`)**:
    - **Otomatis Terminimalkan Penuh Secara Default**: Menginisialisasi `collapsedLayers` dengan semua layer keahlian (`stack.map(l => l.layer)`), sehingga saat halaman pertama kali dibuka, semua layer langsung dalam posisi *minimized* yang rapi.
    - **Ringkasan Konten Taktis saat Terlipat**: Ketika suatu layer terminimalkan, sistem menampilkan deretan pill/chip interaktif ringkas yang memuat nama keahlian dan badgenya (`Go [CORE]`, `SvelteKit [FRONTEND]`, `Docker [CONTAINER]`, dll). Pengguna dapat langsung men-tap chip keahlian untuk memicu inspeksi Pod 042 tanpa harus membuka kartu penuh.
  - **Contact Section (`Contact.svelte`)**:
    - **Menggabungkan GitHub & LinkedIn Menjadi 1 Kartu Terpadu**: Mengubah grid 3 kartu menjadi **2 kartu simetris** (`md:grid-cols-2`). Kartu Channel 02 kini menggabungkan kanal GitHub dan LinkedIn dalam sub-card ringkas berdampingan, menghemat ruang scroll vertikal di layar smartphone secara signifikan.
  - **Pangkas Jarak Scroll Hero ke About (`heroTransition.js` & `Section.svelte`)**:
    - Mengurangi jarak pin scroll hero pada layar ponsel dari `+=110%/+=140%` menjadi **`+=40%`** (dan `+=60%` di tablet), membuat transisi dari Hero ke About terasa jauh lebih cepat dan tidak memakan scroll kosong berlebih.
    - Menyesuaikan vertical padding dasar pada `Section.svelte` menjadi `py-12 sm:py-24 md:py-36` dan margin header `mb-8 sm:mb-14` untuk merapatkan jarak antar section di layar mobile.
  - **Sembunyikan Trigger Back-to-Hero pada Mobile (`LeftEdgeReturn.svelte`)**:
    - Menambahkan `hidden md:flex` pada kapsul navigasi tepi kiri (*LeftEdgeReturn*), sehingga fitur "Return to Hero Section" tidak muncul atau mengganggu layar sempit pengguna smartphone pada halaman `/projects` dan `/blog`.
- **[18:50 WIB] Overhaul Layout Responsif untuk Mobile Smartphone & Tablet (`+layout.svelte`, `SideNav.svelte`, `CornerTelemetry.svelte`, `Skills.svelte`, `Portfolio.svelte`, `ProjectModal.svelte`, `projects/+page.svelte`, `blog/+page.svelte`, `blog/[slug]/+page.svelte`):**
  - **Global HUD & Navigasi Responsif**:
    - `SideNav.svelte`: Disembunyikan pada layar tablet portrait dan mobile smartphone (`hidden lg:flex`) guna mencegah tabrakan visual dan tumpang-tindih dengan container konten utama.
    - `CornerTelemetry.svelte`: Disembunyikan pada layar sempit (`hidden sm:block`) agar tidak menutupi tombol interaktif dan drawer bawah pada smartphone.
    - Top Right HUD Bar (`+layout.svelte`): Menampilkan tombol taktis `[ MENU ]` yang jelas dan mudah dijangkau jempol pada mobile, serta tetap menampilkan pintasan `⌘K` pada desktop.
    - `CommandPalette.svelte`: Menyesuaikan ukuran font input pencarian menjadi `text-base sm:text-xs` (mencegah Safari iOS melakukan *auto-zoom* saat fokus input) dan memperbarui petunjuk kontrol bawah menjadi *thumb-friendly*.
  - **Skills Matrix & Pod 042 Inspector**:
    - Layout split 2 kolom pada Tablet (`md:grid-cols-12`) sehingga kartu dan inspector tetap berdampingan.
    - Menghadirkan **Mobile Tactical Bottom Sheet Drawer** (`use:portal` + animasi transisi `fly`/`fade`) pada smartphone yang otomatis muncul saat kartu keahlian di-tap, memecahkan masalah inspector yang sebelumnya tertimbun 18 kartu ke bawah.
    - Menambahkan banner melayang ringkas (*Sticky Pod Mini Bar*) di bagian bawah layar smartphone dengan status target aktif dan tombol `[ SPECS ↗ ]`.
    - Chip filter kategori keahlian diubah menjadi *horizontal smooth scroll* (`overflow-x-auto no-scrollbar sm:flex-wrap`).
  - **Portfolio & Project Quick Specs Modal**:
    - `Portfolio.svelte`: Penyesuaian padding kartu menjadi `p-6 sm:p-10` agar nyaman dibaca di layar 360px–420px.
    - `ProjectModal.svelte`: Dioptimalkan menjadi **Full-screen Tactical Mobile Sheet** (`max-h-screen sm:max-h-[92vh]`) dengan scrolling inersia halus (`-webkit-overflow-scrolling: touch;`), tombol close besar 32px x 32px, dan tombol aksi case study yang mudah ditekan satu tangan.
  - **Halaman Arsip Proyek (`projects/+page.svelte`)**:
    - Input pencarian responsif (`text-base sm:text-xs`) bebas dari masalah auto-zoom iOS.
    - Filter kategori proyek diubah menjadi *horizontal scrollable chips* tanpa scrollbar kaku.
    - Padding kartu proyek disesuaikan (`p-5 sm:p-7 sm:p-8`) untuk estetika optimal di smartphone dan tablet.
  - **Blog Index & Blog Reader (`blog/+page.svelte` & `blog/[slug]/+page.svelte`)**:
    - Navigasi tab utama (`01 Home`, `02 Categories`, `03 Tags`, `04 Archive`) diubah menjadi **Horizontal Segmented Rail** yang dapat digeser mulus di ponsel.
    - Quick tag filter pills dibuat dapat di-scroll horizontal tanpa membuat layout melebar ke samping.
    - Pembaca artikel (`blog/[slug]`): Menghadirkan floating tactical toolbar ganda di pojok kanan bawah ponsel: tombol **`[ TOC ]`** (Daftar Isi) dan **`[ ↑ TOP ]`**.
    - Mengintegrasikan **Mobile TOC Bottom Sheet Drawer** yang menampilkan daftar bab artikel saat tombol `[ TOC ]` ditekan, dan otomatis meluncur ke bab tujuan begitu dipilih.
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
