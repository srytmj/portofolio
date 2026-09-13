---
title: "AWS re/Start Week 5 Hari 4: Sesi Latihan Soal Sertifikasi CCP"
description: "Sesi penuh latihan soal gaya ujian CCP, ngebahas ulang konsep-konsep yang udah dipelajari sambil dijelasin jebakan-jebakan khas soal ujian."
author: srytmj
date: 2026-09-03 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, ccp, latihan soal, ujian]
pin: false
math: false
mermaid: false
published: true
---

Hari ini beda dari biasanya, nggak ada materi baru atau lab, murni sesi latihan soal gaya ujian sertifikasi CCP (Cloud Practitioner), sekitar 27 soal dibahas satu-satu lengkap sama penjelasan kenapa jawabannya itu.

Beberapa konsep yang direview ulang lewat soal:

- **Predictive scaling vs scheduled scaling**: kalau event-nya (misal sales event) udah tau tanggalnya, jawabannya scheduled scaling, bukan predictive scaling yang pakai machine learning.
- **Elastic Cache vs RDS**: Elastic Cache itu key-value/cache database, bukan relational, jadi kalau butuh SQL relasional, jawabannya RDS.
- **CloudTrail vs Trusted Advisor**: CloudTrail buat aktivitas akun, Trusted Advisor buat rekomendasi best practice arsitektur.
- **EC2 pricing model**: Reserved Instance (RI) itu kayak reservasi restoran, harus tau kebutuhan dan durasinya di depan, kalau nggak kepake penuh tetap bayar penuh (bisa dijual lagi lewat RI Marketplace kalau over-kontrak). Dedicated Host wajib dipakai kalau ada masalah lisensi software yang terikat ke physical server (CPU-bound), beda dari Dedicated Instance.
- **IAM bucket policy**: elemen `Principal` itu buat nentuin siapa (user/account) yang diizinkan, bukan `Action` (itu buat tindakan apa yang diizinkan).
- **Security layer**: security group, NACL, route table itu semua di dalam AWS, tapi WAF (Web Application Firewall) itu berdiri di depan/luar sebelum request masuk ke VPC.
- **AWS Outposts vs Direct Connect**: Outposts itu hardware AWS yang disewa dan ditaruh fisik di data center sendiri (kayak nyewa server segelondongan), Direct Connect itu koneksi fiber optic dedicated yang mahal banget per kilometer. Kalau butuh extend VPC ke on-premises, itu Outposts, bukan Direct Connect atau Amazon Connect (yang itu customer service).
- **AWS Artifact**: cuma dokumentasi compliance/agreement (bukan konfigurasi resource kayak AWS Config, dan bukan report keamanan kayak Trusted Advisor).
- **CI/CD trio**: CodeCommit (mirip Git/version control), CodeBuild (build jadi artifact), CodeDeploy (deployment strategy), CodePipeline (gabungin semuanya jadi satu alur CI/CD).

## Catatan Sampingan

- Instruktur nekenin strategi ujian: kerjain soal gampang dulu, soal ragu-ragu di-flag dan skip dulu, balik lagi belakangan. Hati-hati sama soal tipe "select 2" atau "select 3", salah satu aja dari pilihan yang benar dianggap salah total.
- Biaya ujian resmi sekitar $100 + pajak 11% (khusus Indonesia), sekitar Rp2 juta, dan cuma sekali kesempatan (nggak ada sistem coba-gagal-ulang gratis).
- Instruktur saranin beli paket soal latihan di Udemy (sekitar Rp130 ribu) buat persiapan, jauh lebih murah daripada resiko gagal ujian resmi dan harus bayar ulang Rp2 juta.
