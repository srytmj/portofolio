---
title: "AWS re/Start Week 4 Hari 4: Redshift, DMS, dan Lab Configuring a VPC"
description: "Materi Redshift dan DMS/SCT buat migrasi database, lanjut ke unit baru AWS Networking, ditutup lab bikin VPC manual dengan bastion server dan NAT gateway."
author: srytmj
date: 2026-08-27 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, redshift, dms, vpc]
pin: false
math: false
mermaid: false
published: true
---

Dibuka recap singkat soal managed vs unmanaged database, terus masuk materi [Amazon Redshift](/blog/amazon-redshift-data-warehouse): kenapa analitik nggak boleh dihajar langsung di database transaksi, arsitektur 3-tier data warehouse, sampe kenapa storage-nya kolom-oriented bukan baris. Ditutup materi [AWS DMS dan SCT](/blog/aws-dms-sct-migrasi-database), migrasi homogen vs heterogen, dan konsep CDC buat migrasi tanpa downtime.

Masuk unit baru "AWS Networking Services Overview". Materi [VPC fundamentals lanjutan](/blog/amazon-vpc-fundamentals-lanjutan): cara baca CIDR notation, hubungan Region-AZ-VPC, route table, elastic network interface, sampe split-horizon DNS. Lanjut [VPC connectivity options](/blog/vpc-connectivity-options): NAT gateway vs NAT instance, limitasi VPC peering yang nggak transitif, Transit Gateway sebagai hub, VPN/Direct Connect, sampe bedanya gateway endpoint (cuma S3 & DynamoDB) dan interface endpoint (banyak service lain).

Ditutup lab [Configuring a VPC](/blog/configuring-vpc-manual-nat-bastion): bikin VPC manual, public/private subnet, internet gateway, NAT gateway, bastion server, sampe tes koneksi internet dari private instance yang nggak punya IP publik sama sekali.

## Catatan Sampingan

- Instruktur cerita soal serunya (dan tegangnya) presentasi hasil analitik ke direksi/top management dibandingin cuma ke dosen pembimbing skripsi, katanya jauh lebih "dicecar" karena hasilnya jadi patokan kebijakan perusahaan.
- Ada obrolan soal harga koneksi Direct Connect yang mahal banget per kilometer fiber optic, "sekali klik bisa melayang beberapa juta".
- Program sertifikasi AI gratis dari vendor kampus diundur ke 4 September, khusus buat mahasiswa aktif.

Materi keamanan VPC dan lab troubleshooting-nya baru jalan [besok, 28 Agustus](/blog/aws-restart-week4-hari-5-vpc-security-troubleshooting).
