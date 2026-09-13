---
title: "AWS re/Start Week 5 Hari 1: EBS Lanjutan, Instance Store, EFS/FSx, dan S3 Storage Class"
description: "Sesi teori paling padat sejauh ini: EBS deep-dive, Instance Store, EFS/FSx, S3 storage class dan versioning, ditutup lab CLI snapshot terjadwal dan S3 sync."
author: srytmj
date: 2026-08-31 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, ebs, efs, s3, storage]
pin: false
math: false
mermaid: false
published: true
---

Masuk minggu kelima. Lanjutan dari lab EBS hari sebelumnya. Dibuka materi [EBS lanjutan](/blog/amazon-ebs-volume-types-snapshot-dlm): tipe-tipe volume (gp3, io1/io2, st1/sc1), fakta bahwa snapshot itu incremental bukan full backup berulang, sampe otomasi retention pakai Data Lifecycle Manager.

Lanjut [EC2 Instance Store](/blog/ec2-instance-store-temporary-storage): storage yang nempel fisik ke hardware, super cepet tapi datanya hilang total begitu instance restart/stop/terminate. Terus [Amazon EFS dan FSx](/blog/amazon-efs-fsx-file-storage), file storage buat Linux (EFS) dan Windows/campuran (FSx), lengkap sama trade-off availability vs cost lewat opsi One Zone vs Standard.

Materi paling padat: [S3 storage class dan fundamentals lanjutan](/blog/amazon-s3-storage-class-fundamentals-lanjutan), decision tree milih storage class berdasarkan frekuensi akses, konsep encapsulation objek, versioning yang bikin delete jadi soft-delete, presigned URL, CORS, sampe object lock (governance vs compliance mode).

Ditutup lab [Managing Storage via CLI](/blog/managing-storage-cli-snapshot-s3-sync): snapshot EBS manual via CLI, snapshot terjadwal pakai cron plus script Python buat retention otomatis, dan sync file ke S3 dengan versioning aktif, termasuk cara restore file yang ke-delete pakai version ID.

## Catatan Sampingan

- Instruktur nekenin poin penting soal literasi bahasa: kata "jarang" di storage class itu beneran jarang (sebulan sekali), bukan "jarang" ala obrolan sehari-hari yang bisa berarti 3x seminggu, salah paham ini bisa bikin salah pilih storage class dan ujung-ujungnya lebih mahal.
- Ada obrolan panjang soal sejarah software office (WordStar/WYSIWYG, Lotus, sampe Windows 95 yang nge-bundle Word/Excel/PowerPoint jadi satu ekosistem) sebagai analogi kenapa desktop Linux susah gantiin Windows di kantor-kantor.
- Instruktur bilang materi S3 storage class ini salah satu yang paling sering keluar di ujian sertifikasi CCP.
