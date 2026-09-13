---
title: "AWS re/Start Week 4 Hari 3: REST API, API Gateway, Step Functions, Container, RDS, dan Lambda"
description: "Sesi padat teori: fondasi REST API, API Gateway, Step Functions, container/ECS/EKS/Fargate, lab migrasi database ke RDS pakai CLI, dan lab Lambda laporan penjualan café."
author: srytmj
date: 2026-08-26 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, api, container, rds]
pin: false
math: false
mermaid: false
published: true
---

Hari ini teorinya padat banget, masuk unit baru "Serverless and Containers". Dibuka materi [REST API](/blog/restful-api-fundamentals), fondasinya dulu: apa itu API, prinsip desain REST, format request/response, sampe HTTP status code.

Lanjut ke [Amazon API Gateway](/blog/amazon-api-gateway), gimana throttling ngerem request berlebih (dianalogikan kayak top speed motor), staging buat misahin traffic premium vs biasa, cache hit ratio, sampe X-Ray buat nge-trace di titik mana request lemot.

Terus [AWS Step Functions](/blog/aws-step-functions), servicenya sendiri ternyata gratis, cuma "rapper" alias pembungkus workflow, bayarnya di underlying service (Lambda, S3, dll) yang dipanggil di dalam workflow-nya.

Ditutup materi [Container](/blog/container-docker-ecs-eks-fargate): kenapa container lebih hemat dibanding VM, "penyakit bawaan" container yang suka hilang sendiri (makanya butuh orchestrator), sampe perbandingan ECS vs EKS dan EC2 vs Fargate.

Sempet mulai intro data warehouse vs data lake juga, tapi instruktur nunda detailnya ke besok biar nggak keburu-buru.

Lab pertama hari ini: [migrasi database lokal ke RDS pakai CLI](/blog/migrasi-database-ke-rds-via-cli). Dari bikin security group, subnet, subnet group, sampe RDS instance-nya semua lewat CLI (bukan console kayak lab-lab sebelumnya), terus export data lokal pake `mysqldump`, import ke RDS pake sertifikat SSL, ganti connection string aplikasi lewat Parameter Store, dan terakhir monitoring koneksi real-time via CloudWatch.

Lab kedua: [Lambda buat laporan penjualan café otomatis](/blog/lambda-cafe-sales-report). Bikin 2 Lambda function yang saling manggil, satu narik data penjualan dari database (pake Lambda layer buat dependency PyMySQL), satu lagi format hasilnya jadi laporan dan kirim email lewat SNS, dijadwalin jalan otomatis tiap malam pake trigger EventBridge. Sempet ketemu error timeout gara-gara port database belum kebuka di security group, khas banget masalah "kelihatan simple tapi nyebelin" ala infra.

## Catatan Sampingan

- Instruktur sempet cerita soal bedanya ngoding siang vs malam, katanya inspirasi lebih lancar malam hari karena "otak panas, udara sejuk".
- Ada obrolan soal politik vendor: proyek pemerintah daerah yang budgetnya digelembungin tapi vendornya diam-diam pakai tools versi gratis (misal Podman gratisan dibanding Docker berbayar) biar untungnya lebih gede.
- Kelas AI tambahan (di luar program utama) diundur ke tanggal 4-14 September, 3 sesi.
