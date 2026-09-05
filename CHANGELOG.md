# Changelog

Semua perubahan pada proyek portofolio ini didokumentasikan di sini secara terstruktur agar mudah dilacak, dimodifikasi, atau dikembalikan (*revert*) jika diperlukan.

Format berbasis pada [Keep a Changelog](https://keepachangelog.com/id/1.0.0/).

---

## [0.2.6] - 2026-09-06

### Changed & Improved
- **Peleburan Sinergis Opsi 2 & Opsi 3 (Kinetic Typography Split + Technical Scanline & Badges)**:
  - *Berkas:* `src/lib/scroll/sectionAnim.js`, `src/lib/components/Section.svelte`, `src/lib/components/Contact.svelte`.
  - *Latar Belakang & Konsep:* Menggabungkan kekuatan ekspresi tipografi dinamis dari Opsi 2 dengan identitas telemetri teknik dan presisi CAD dari Opsi 3 untuk menciptakan transisi visual yang berkarakter kuat, elegan, dan profesional.
  - *Detail Implementasi Hybrid:*
    1. **Kinetic Word Masking (Opsi 2):** Kata-kata pada judul (`GET TO KNOW ME`, `TECH STACK`, `THINGS I HAVE BUILT`, `LET'S TALK`) meluncur masuk dari vektor berlawanan (`left/right`, kemiringan dinamis `±3°`) dengan kurva `power4.out`.
    2. **Technical System Badges (Opsi 3):** Indeks bagian monospaced menggunakan identitas modul lengkap: `SEC // 02`, `SEC // 03`, `SEC // 04`, `SEC // 05` yang meluncur dari balik mask.
    3. **Laser Scanline Beam Sweep (Opsi 3):** Garis pembatas *hairline* presisi terbuka dari kiri ke kanan disertai sapuan horizontal berkas laser putih cerah (`[data-anim-scan]`).
    4. **Blur-to-Focus Telemetry Unblur (Opsi 3):** Blok-blok konten di bawah header naik secara halus dari fokus optik optik `blur(4px)` ke `blur(0px)` dengan kurva pegas `power3.out`.
    5. **100% Upright Stability:** Seluruh elemen halaman tetap tegak lurus dan stabil tanpa ada efek distorsi miring (*velocity skew*).
  - *Cara revert/edit:* Cek `sectionAnim.js` untuk parameter durasi dan easing atau modifikasi template header di `Section.svelte` dan `Contact.svelte`.

---

## [0.2.5] - 2026-09-06

### Changed & Improved
- **Implementasi Opsi 2 (Kinetic Typography Split & Directional Masking)**:
  - *Berkas:* `src/lib/scroll/sectionAnim.js`, `src/lib/components/Section.svelte`, `src/lib/components/Contact.svelte`.
  - *Latar Belakang & Konsep:* Menguji Opsi 2 dengan gaya tipografi kinetik yang bold, punchy, dan berenergi tinggi ala studio kreatif / *contemporary brutalist portfolio*.
  - *Fitur & Perubahan:*
    1. **Kinetic Word Split (Directional Masking):** Kata-kata pada judul setiap section (`GET TO KNOW ME`, `TECH STACK`, `THINGS I HAVE BUILT`, `LET'S TALK`) kini di-render terpisah dalam kontainer *masked overflow-hidden*, meluncur masuk dari vektor berlawanan (`left/right`, rotasi dinamis `±3°`) dengan akselerasi tajam `power4.out`.
    2. **Section Index Counter (`// 02`, `// 03`, `// 04`, `// 05`):** Indeks monospaced meluncur vertikal dari balik mask dengan delay teratur.
    3. **Center-Outward Hairline Snap:** Garis pembatas teknik mekar secara simetris dari titik tengah (`origin-center`) ke kedua sisi dengan kurva `power4.out`.
    4. **Crisp Typographic Item Snap:** Elemen konten di bawahnya naik secara tegas dan reaktif tanpa blur (`filter: none`), memberikan kesan responsif instan.
  - *Cara revert/edit:* Cek easing dan stagger di `sectionAnim.js` atau kembalikan template header di `Section.svelte` dan `Contact.svelte`.

---

## [0.2.4] - 2026-09-06

### Changed & Improved
- **Pembaruan Transisi Antar-Section (Opsi 3: Technical Scanline & Hairline Wireframe)**:
  - *Berkas:* `src/lib/scroll/smoothScroll.js`, `src/lib/scroll/sectionAnim.js`, `src/lib/components/Section.svelte`, `src/lib/components/Contact.svelte`.
  - *Latar Belakang & Masalah:* Animasi transisi section sebelumnya menggunakan velocity skew (`skewY`) yang membuat elemen terlihat miring/melengkung saat di-scroll cepat. Efek ini terasa melelahkan mata dan kurang selaras dengan konsep *technical blueprint / engineering portfolio*.
  - *Implementasi Opsi 3:*
    1. **Penghapusan Efek Miring (*Velocity Skew*):** Menghapus ticker kalkulasi `skewY` dari Lenis di `smoothScroll.js` dan mencabut atribut `data-skew` dari semua kontainer. Sekarang seluruh elemen halaman tetap tegak lurus (*upright*), stabil, dan tajam saat di-scroll.
    2. **Technical Section Badges:** Menambahkan penanda sistem monospaced di header setiap seksi (`SEC // 02` About, `SEC // 03` Skills, `SEC // 04` Portfolio, `SEC // 05` Contact).
    3. **Laser Scanline Beam Sweep:** Menambahkan hairline divider dengan berkas cahaya *scanline* horizontal (`[data-anim-scan]`) yang menyapu dari kiri ke kanan saat seksi memasuki layar (*viewport*).
    4. **Subtle Blur-to-Focus Unblur:** Elemen konten muncul secara bertahap (*staggered rise*) dari `blur(4px)` menjadi `blur(0px)` yang memberikan kesan data instrumen presisi yang sedang di-*render* secara live.
  - *Cara revert/edit:* Cek `sectionAnim.js` untuk durasi/gaya scanline atau kembalikan template header di `Section.svelte` dan `Contact.svelte`.

---

## [0.2.3] - 2026-09-06

### Fixed
- **Deteksi Hover Rasi Bintang Lintas Semua Perangkat (Hardware Tiering Fix)**:
  - *Berkas:* `src/lib/components/hero/Constellations.svelte`, `src/lib/components/Hero.svelte`.
  - *Penyebab:* Callback `onActive` sebelumnya dikunci oleh kondisi `labelsOn = full && !reducedMotion`. Pada perangkat dengan GPU terintegrasi (Intel Iris/UHD, AMD Radeon, atau CPU <= 6 core), sistem mendeteksi tier sebagai `'lite'`, sehingga callback pelaporan nama dan koordinat dinonaktifkan secara total. Selain itu, cone deteksi `pick()` sebelumnya terlalu sempit (`0.93` / ~21.5°).
  - *Perbaikan:*
    1. Mengaktifkan `labelsOn = !reducedMotion` agar berjalan di seluruh tingkatan perangkat (`full` maupun `lite`).
    2. Memperluas sudut deteksi kursor `pick()` menjadi `0.82` (~35°) agar segera mendeteksi rasi bintang saat kursor berada di dekatnya.
    3. Mendaftarkan listener `pointermove` secara universal agar tidak terblokir oleh deteksi layar sentuh laptop.
    4. Menyimpan retensi `lastRevealedFigure` di `Hero.svelte` sehingga transisi antar rasi bintang saat mouse digerakkan berjalan mulus tanpa kedip (*smooth transition*).
  - *Hasil Verifikasi:* Nama dan koordinat kini berganti secara instan dan akurat ke rasi bintang terkait (`Pisces`, `Aquarius`, `Equuleus`, `Sculptor`, `Aquila`, dll.) saat kursor digerakkan di atas langit malam.

---

## [0.2.2] - 2026-09-06

### Fixed
- **Tampilan Utuh Gambar Blueprint Modal Portofolio**:
  - *Berkas:* `src/lib/components/ProjectModal.svelte`, `static/projects/homelab-1.svg`, `static/projects/homelab-2.svg`, `static/projects/white-archive-1.svg`, `static/projects/white-archive-2.svg`.
  - *Penyebab:* Penegasan `aspect-ratio: 16/9` dengan `object-cover` memotong gambar blueprint yang beresolusi asli 1600x1000 (16:10). Selain itu, flexbox container tanpa `shrink-0` sempat menekan tinggi gambar.
  - *Perbaikan:* Menghapus pembatasan `aspect-ratio: 16/9`, mengganti ke `object-contain block h-auto w-full`, menambahkan `shrink-0` pada pembungkus gambar agar tidak terkompresi flexbox, dan menambahkan atribut eksplisit `width="1600" height="1000"` pada root SVG. Semua gambar dan teks diagram kini tampil 100% utuh tanpa terpotong.
  - *Cara revert/edit:* Sesuaikan pembungkus gambar di `ProjectModal.svelte`.

---

## [0.2.1] - 2026-09-06

### Fixed & Refined
- **Nama & Koordinat Astronomi Dinamis Hero**:
  - *Berkas:* `src/lib/three/constellationData.js`, `src/lib/components/hero/Constellations.svelte`, `src/lib/components/HeroCanvas.svelte`, `src/lib/components/Hero.svelte`.
  - *Perbaikan:* Menghitung rata-rata RA & Dec dari dataset d3-celestial untuk setiap 89 rasi bintang. Nama rasi bintang kini selalu terpampang di atas koordinatnya (`Capricornus` saat idle, dan langsung berubah dinamis saat kursor mengarahkan ke rasi bintang lain seperti `Aquila`, `Orion`, `Aquarius`, lengkap dengan koordinat RA & Dec spesifik rasi tersebut).
  - *Cara revert/edit:* Cek komponen `Hero.svelte` dan fungsi `formatRaDec` di `constellationData.js`.

- **Perlebaran Teks Narasi Modal Proyek**:
  - *Berkas:* `src/lib/components/ProjectModal.svelte`.
  - *Perbaikan:* Menghilangkan pembatasan `max-w-[26ch]` yang membuat teks paragraf pembuka terlalu sempit. Menyesuaikan lebar kolom narasi kanan menjadi proporsional (`minmax(18rem, 28%) 1fr`) dan teks prose memanfaatkan ruang modal secara nyaman dan leluasa.
  - *Cara revert/edit:* Sesuaikan kelas kolom di `ProjectModal.svelte`.

- **Peniadaan Border/Ring Putih Saat Kartu Portfolio Diklik**:
  - *Berkas:* `src/lib/components/Portfolio.svelte`, `src/lib/components/ProjectModal.svelte`.
  - *Perbaikan:* Menambahkan `outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none` pada tombol kartu portofolio dan kontainer modal dialog sehingga tidak ada lagi garis putih kotak aktif bawaan browser saat diklik.
  - *Cara revert/edit:* Cek kelas tombol di `Portfolio.svelte`.

- **Animasi Tombol Copy Email**:
  - *Berkas:* `src/lib/components/Contact.svelte`.
  - *Perbaikan:* Menambahkan transisi mikro-interaksi yang halus: ikon copy berputar dan mengecil (-90° scale-0) berganti menjadi ikon centang hijau (rotate-0 scale-100), border dan background berubah ke nuansa emerald transparan, dan teks bertransformasi menjadi `copied to clipboard` dengan tactile spring `active:scale-95`.
  - *Cara revert/edit:* Sesuaikan markup tombol di `Contact.svelte`.

---

## [0.2.0] - 2026-09-06

### Added
- **Floating Command Palette Trigger (`[ ⌘K ]`)**:
  - *Berkas:* `src/routes/(site)/+layout.svelte`, `src/lib/components/CommandPalette.svelte`.
  - *Deskripsi:* Tombol mengambang elegan di pojok kanan atas dengan latar belakang kaca gelap (`backdrop-blur-md`) dan badge `⌘K`. Membuka Command Palette di smartphone/tablet maupun desktop via custom event `open-command-palette`.
  - *Cara revert/edit:* Hapus atau modifikasi elemen `<button>` di `src/routes/(site)/+layout.svelte`.

- **Interaksi Copy Email to Clipboard**:
  - *Berkas:* `src/lib/components/Contact.svelte`.
  - *Deskripsi:* Tombol salin satu-klik di samping alamat email `contact@suryatmaja.dev` dengan mikro-feedback visual (`COPIED` selama 2 detik) dan fallback `mailto:`.
  - *Cara revert/edit:* Atur fungsi `copyEmail()` atau tombol copy di `src/lib/components/Contact.svelte`.

- **Indikator Koordinat Astronomi Hero**:
  - *Berkas:* `src/lib/components/Hero.svelte`.
  - *Deskripsi:* Menampilkan koordinat astronomi presisi (`RA 21h 00m · Dec -20° · Cap`) di pojok kanan bawah saat idle, dan nama rasi bintang saat kursor menyorot bintang.
  - *Cara revert/edit:* Sesuaikan kontainer koordinat di bagian bawah `src/lib/components/Hero.svelte`.

- **Lab Status Pill**:
  - *Berkas:* `src/lib/components/About.svelte`, `src/lib/content/site.js`.
  - *Deskripsi:* Indikator status homelab aktif dengan animasi titik hijau berdenyut halus (*subtle pulsing dot*): `Node 01: Staging & Lab Assembly` di bawah indikator zona waktu `WIB · UTC+7`.
  - *Cara revert/edit:* Hapus properti `status` di `about` pada `src/lib/content/site.js` atau markup pendukungnya di `About.svelte`.

- **Spesifikasi Hardware & Jaringan Homelab**:
  - *Berkas:* `src/lib/content/site.js`.
  - *Deskripsi:* Memperbarui detail proyek Homelab dengan rincian hardware fisik nyata (Intel 4-Core mini-PC, Proxmox VE, Tailscale Zero-Trust mesh `*.ts.net`, ZFS RAID, automated Restic offsite backup).
  - *Cara revert/edit:* Ubah array `projects` di `src/lib/content/site.js`.

- **Blueprint Skematis Topologi & Telemetri Homelab (SVG)**:
  - *Berkas:* `static/projects/homelab-1.svg`, `static/projects/homelab-2.svg`.
  - *Deskripsi:* Mengganti gambar placeholder kotak biasa dengan ilustrasi CAD/Architecture Blueprint monokromatik beresolusi tinggi (Topologi Ingress ZTNA, Proxmox, Traefik, Kontainer, dan Uptime Kuma Status Table).
  - *Cara revert/edit:* Ganti atau sesuaikan berkas SVG di folder `static/projects/`.

- **Ekspansi Rasi Bintang di Command Palette Trivia**:
  - *Berkas:* `src/lib/palette/trivia.js`.
  - *Deskripsi:* Menambahkan rasi bintang utama: Capricornus (`Cap` - rasi bintang tanda tangan hero), Canis Major (`CMa` - Sirius), Centaurus (`Cen`), Carina (`Car`), dan Auriga (`Aur`).
  - *Cara revert/edit:* Ubah array `trivia` di `src/lib/palette/trivia.js`.

- **OpenGraph (OG) Meta Tags & Banner Sosial**:
  - *Berkas:* `src/routes/(site)/+layout.svelte`, `static/og-preview.png`, `static/og-preview.jpg`.
  - *Deskripsi:* Banner preview sosial monokromatik 16:9 bernuansa konstelasi astronomi & tipografi editorial untuk preview di WhatsApp, LinkedIn, Discord, Twitter/X.
  - *Cara revert/edit:* Ubah tag `<meta property="og:*">` di `src/routes/(site)/+layout.svelte`.

---

## [0.1.0] - 2026-09-06

### Fixed
- **Konflik Rute SvelteKit**: Menghapus duplikat file `src/routes/+page.svelte` yang menyebabkan error HTTP 500 karena bertabrakan dengan `src/routes/(site)/+page.svelte`.
- Layout utama `(site)` dengan fitur lengkap ([SideNav](file:///src/lib/components/SideNav.svelte), [CommandPalette](file:///src/lib/components/CommandPalette.svelte), Lenis smooth scroll) kini aktif melayani rute root `/`.
