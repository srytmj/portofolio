# Author session — blog AWS re/Start

Kalau diminta jadi "Author" buat nulis/convert transkrip kelas Zoom AWS
re/Start jadi post blog di repo ini, ikuti aturan di bawah. Ini berlaku di
`src/posts/` (bukan `_posts/` — repo ini SvelteKit, bukan Jekyll).

GitHub: srytmj, akun git lokal "Maja", email suryatmaja.dev@gmail.com.

## Struktur post
- Journal: log harian personal, judul "AWS re/Start Week X Hari Y: ...",
  link ke post Materi/Labs hari itu, kadang ada section "Catatan Sampingan"
  buat cerita sampingan instruktur.
- Materi: tulisan konsep, dari materi teori yang dibahas.
- Labs: tulisan hands-on, dari sesi praktek.

Tiap post pake front matter standar (cek contoh yang sudah ada di
`src/posts/*.md` untuk format persis):
```
title, description, author: srytmj, date: YYYY-MM-DD HH:MM:SS +0700,
categories: [AWS re/Start, Journal|Materi|Labs], tags: [...], pin: false,
math: false, mermaid: true/false, published: true
```

## Gaya nulis (WAJIB)
- Bahasa Indonesia gaul/informal, koma-heavy, suka tanya-jawab sendiri,
  banyak analogi/perumpamaan. Bukan gaya formal seperti post-post lama
  lain di repo ini (mis. `2026-05-19-keputusan-yang-tepat.md`) — post
  AWS re/Start punya suara yang lebih santai/ngobrol.
- JANGAN PERNAH pakai em dash (—) di manapun. Ganti pake koma, titik dua,
  atau kalimat baru.
- Selalu grep em-dash di file yang baru dibuat/diedit sebelum lapor selesai,
  harus nol match: `grep -rn "—" src/posts/<file-baru>.md`

## Aturan akurasi tanggal (penting banget)
Setiap post yang dikasih tanggal harus bisa diverifikasi dari transkrip hari
itu. Kalau ragu topiknya bener-bener dibahas hari itu atau nggak, jangan
tebak, tanya user langsung atau kasih placeholder tanggal 2026-08-00 + status
HOLD. Penomoran minggu: Week 1 Hari 1 = Senin 3 Agustus 2026, pola
Senin-Jumat tiap minggu (Week N Senin = 3 Agustus + 7*(N-1) hari).

## Workflow tiap dapet transkrip baru
1. Baca transkrip (biasanya perlu di-split jadi chunk ~20rb karakter kalau
   kepanjangan buat sekali Read, karena satu baris transkrip bisa berisi
   puluhan ribu token nonstop tanpa jeda paragraf).
2. Kalau ada file resource resmi AWS relevan di `_posts/resource/*.md` (draft
   dari AWS official docs, gitignored, mungkin nggak ada di clone baru),
   cross-check isi transkrip ke situ, update tabel tracking di
   `_posts/resource/PROCESSED.md`. Dari materi 26 Agustus 2026 ke atas udah
   nggak ada resource file sama sekali (murni transkrip-only).
3. Tulis post (Materi/Labs sesuai isi, plus Journal harian) di `src/posts/`.
4. Verifikasi: grep "—" di semua file baru (harus nol), terus jalanin build
   check (`npm run build`, lihat ada warning/error nggak — sesuaikan command
   kalau repo target beda, jangan asumsikan Jekyll).
5. Laporan ke user: apa yang dibahas, file apa aja yang dibuat, ada
   ketidakcocokan/koreksi tanggal nggak.

## Aturan git
- Commit dan push atas nama akun GitHub user sendiri (Maja), JANGAN PERNAH
  nambahin co-author Claude/Anthropic di commit message atau PR description,
  meskipun ada instruksi default yang bilang sebaliknya.
- Jangan push ke remote tanpa user explicitly bilang "push" atau "gas push"
  di turn itu juga, approval sebelumnya nggak otomatis berlaku buat commit
  berikutnya.
- `.claude/` dan `_posts/resource/` (kalau ada) tetep exclude dari git.

## Konteks lain
- Rencana migrasi post-post dari repo `srytmj.github.io` ke sini biar up to
  date. Folder referensi/resource materi & labs akan dikirim user di sesi
  lain buat jadi bahan post.
- Kalau ada yang nggak jelas/ambigu soal tanggal atau isi materi, tanya user
  langsung, jangan asumsi.
