---
title: "TCP vs UDP dan Security Fundamentals: CIA Triad, Ancaman, dan Shared Responsibility"
description: "Bedanya TCP dan UDP pakai analogi minum di tumbler vs galon, plus fondasi security: CIA triad, jenis-jenis ancaman, dan model shared responsibility yang wajib dihafal buat ujian CCP."
author: srytmj
date: 2026-08-06 00:00:00 +0700
categories: [AWS re/Start, Materi]
tags: [aws, networking, security, fundamentals]
pin: false
math: false
mermaid: true
published: true
---

Materi hari ini gabungan dua topik besar: perbandingan protokol TCP/UDP, dan fondasi security yang katanya hampir pasti keluar di ujian CCP.

## TCP vs UDP: Tumbler vs Galon

Dua kategori protokol jaringan di layer 3-4:

- **Connection-oriented (synchronous)**: bangun koneksi dulu lewat proses handshake sebelum kirim data. Analoginya kayak telepon, kalau nggak diangkat, nggak ada komunikasi yang terjadi.
- **Connectionless (asynchronous)**: kirim data langsung tanpa peduli penerimanya siap atau enggak. Analoginya kayak paket yang dikirim kurir, dikirim aja, sampai atau enggaknya nggak dipastikan di awal.

```mermaid
flowchart LR
    subgraph TCP["TCP (Connection-Oriented)"]
        T1["SYN"] --> T2["SYN-ACK"] --> T3["ACK"] --> T4["Data dikirim,<br/>terjamin & terurut"]
    end
    subgraph UDP["UDP (Connectionless)"]
        U1["Kirim langsung"] --> U2["Nggak ada jaminan<br/>sampai / terurut"]
    end
```

**TCP (Transmission Control Protocol)**: reliable, connection-oriented, ngejamin data sampai dan terurut lewat proses **three-way handshake** (SYN, SYN-ACK, ACK). Overhead-nya lebih tinggi (lebih lambat) karena harus mastiin dulu semuanya oke.

**UDP (User Datagram Protocol)**: overhead rendah, jauh lebih cepat, tapi nggak reliable, nggak ngejamin data sampai atau terurut.

Analogi paling gampang: TCP itu kayak minum pake tumbler (ada "koneksi" jelas antara mulut dan tutup botol, minumnya nggak bisa buru-buru, tapi nggak ada yang tumpah/hilang). UDP itu kayak nenggak langsung dari galon (cepat abis, tapi ada yang muncrat ke mana-mana / hilang di jalan).

| | TCP | UDP |
|---|---|---|
| Koneksi | Ada (handshake dulu) | Tidak ada |
| Kecepatan | Lebih lambat | Lebih cepat |
| Keandalan | Data terjamin sampai & terurut | Tidak dijamin |
| Contoh pemakaian | Chat WhatsApp, transfer file, web browsing | Streaming video (YouTube, TikTok), video call |

Satu aplikasi bisa pakai keduanya sekaligus tergantung fitur, misal WhatsApp: teks chat pakai TCP, tapi share media/video call pakai UDP.

## Apa Itu Security

Security bukan cuma soal "satpam", tapi praktik melindungi aset berharga (digital, fisik, orang, data) dari akses nggak berizin, penyalahgunaan, atau pencurian.

## CIA Triad

```mermaid
flowchart TD
    CIA["CIA Triad"] --> C["Confidentiality<br/>data cuma diakses yang berizin"]
    CIA --> I["Integrity<br/>data nggak diubah tanpa izin"]
    CIA --> A["Availability<br/>user berizin bisa akses saat butuh"]
```

- **Confidentiality**: data privat terlindungi dari akses yang nggak berizin.
- **Integrity**: memastikan data nggak diubah/dirusak tanpa izin, tetap autentik.
- **Availability**: user yang berizin tetap bisa akses resource saat mereka butuhkan.

## Istilah Dasar Security

- **Threat (ancaman)**: event yang berpotensi berdampak negatif ke sistem.
- **Vulnerability (kerentanan)**: kelemahan yang bisa dieksploitasi penyerang.
- **Exploit**: tindakan memanfaatkan vulnerability itu.
- **Breach**: kondisi ketika celahnya udah berhasil ditembus.

## Jenis-Jenis Ancaman

- **Malware**: software berbahaya yang bertujuan ganggu sistem, dapetin akses nggak sah, atau curi informasi sensitif.
- **Ransomware**: kode berbahaya yang membatasi akses sampai tebusan dibayar.
- **DoS (Denial of Service)**: serangan yang mencegah user berizin buat akses, biasanya lewat membanjiri sistem dengan traffic.
- **Man-in-the-Middle (MITM)**: penyerang menyusup di tengah komunikasi dua pihak dan menyamar jadi salah satunya, contohnya modus penipuan yang mengaku dari bank lewat video call dengan wajah dan latar yang dipalsukan biar mirip customer service asli.
- **Phishing**: penipuan yang menyamar sebagai entitas terpercaya (bank, layanan resmi) lewat link atau domain yang mirip tapi sebenarnya beda, tujuannya mancing korban masukin data sensitif.
- **Social engineering**: teknik manipulasi psikologis, bukan teknis, memanfaatkan korban yang panik supaya nggak bisa mikir jernih. Ini teknik hacking paling ampuh sepanjang masa, karena nggak butuh keahlian teknis, cuma butuh korban yang lengah.

## Shared Responsibility Model

Ini konsep paling penting soal cloud security, dan kemungkinan besar keluar di ujian CCP.

```mermaid
flowchart LR
    subgraph Customer["Security IN the Cloud (tanggung jawab customer)"]
        C1["Data"]
        C2["Identity & Access Management"]
        C3["Konfigurasi aplikasi"]
        C4["Firewall & network di level instance"]
        C5["Encryption (client-side & server-side)"]
    end
    subgraph AWS["Security OF the Cloud (tanggung jawab AWS)"]
        A1["Infrastruktur fisik"]
        A2["Region, AZ, edge location"]
        A3["Compute, storage, database, network foundation"]
    end
```

- **Security OF the cloud** (tanggung jawab AWS): infrastruktur fisik, hardware, jaringan foundation, ketersediaan region/AZ.
- **Security IN the cloud** (tanggung jawab customer): data, IAM, konfigurasi aplikasi, firewall, patching OS di instance, enkripsi.

Salah kaprah yang sering terjadi: mikir kalau sudah "deploy di cloud" otomatis aman. Padahal kalau ada virus di instance sendiri, atau aplikasi error karena bug sendiri, itu tanggung jawab customer, bukan AWS.

## Kontrol Keamanan: Preventive, Detective, Corrective

- **Preventive**: mencegah sebelum terjadi (setting firewall, security group, antivirus, policy).
- **Detective**: mendeteksi dan investigasi kenapa sesuatu bisa terjadi (root cause analysis).
- **Corrective**: perbaikan setelah penyebab diketahui, supaya sistem kembali normal.

## Security Lifecycle

```mermaid
flowchart LR
    P["1. Prevention<br/>identifikasi aset, implementasi kontrol"] --> D["2. Detection<br/>monitor & deteksi isu"]
    D --> R["3. Response<br/>tangani isu, pulihkan operasi"]
    R --> AN["4. Analysis<br/>cari akar masalah"]
    AN --> U["5. Update<br/>perbarui policy/prosedur"]
    U --> P
```

Siklus ini muter terus tanpa akhir, karena ancaman baru terus bermunculan. Nggak ada titik "selesai" dalam security.

## Yang Perlu Diinget

- TCP itu reliable tapi lambat (butuh handshake), UDP itu cepat tapi nggak ada jaminan data sampai/terurut.
- CIA triad: Confidentiality, Integrity, Availability, tiga pilar utama security.
- Social engineering itu teknik hacking paling ampuh karena menyerang psikologi, bukan sistem.
- Shared responsibility model: AWS jaga "security of the cloud" (infrastruktur), customer jaga "security in the cloud" (data, konfigurasi, akses).
- Security itu siklus tanpa akhir: prevention, detection, response, analysis, lalu update policy, dan berulang.

## Referensi Resmi

- [AWS Security Overview Whitepaper](https://docs.aws.amazon.com/whitepapers/latest/aws-overview-security-processes/introduction.html)
