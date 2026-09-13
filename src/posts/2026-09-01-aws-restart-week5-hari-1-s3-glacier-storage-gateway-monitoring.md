---
title: "AWS re/Start Week 5 Hari 2: S3 Glacier, Storage Gateway, Snow Family, dan CloudWatch"
description: "Masuk minggu kelima. Materi S3 Glacier, Storage Gateway, lab file sharing dengan vendor, Transfer Family, Snow Family, ditutup overview monitoring CloudWatch."
author: srytmj
date: 2026-09-01 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, s3, glacier, storage gateway, cloudwatch]
pin: false
math: false
mermaid: false
published: true
---

Lanjutan dari [hari pertama minggu kelima](/blog/aws-restart-week5-hari-1-ebs-efs-s3-storage-class). Dibuka materi [S3 Glacier](/blog/amazon-s3-glacier-cold-storage): storage class paling murah buat data archival, terminologi vault/archive, sampe 3 tier retrieval (instant, flexible, deep archive). Lanjut [AWS Storage Gateway](/blog/aws-storage-gateway-hybrid), solusi hybrid buat on-premises yang kekurangan storage, dari file gateway sampe tape gateway.

Lab hari ini: [S3 file sharing dengan vendor](/blog/s3-file-sharing-vendor-iam-event-notification), bikin IAM policy yang ngizinin vendor fotografer full akses upload/delete foto tapi cuma di folder tertentu, ditutup setup event notification biar admin otomatis dapet email tiap ada foto masuk atau kehapus.

Setelah break, lanjut materi [Transfer Family dan DataSync](/blog/aws-transfer-family-datasync) (bedanya SFTP/FTPS/FTP), dan [Snow Family](/blog/aws-snow-family-offline-transfer) buat migrasi data raksasa lewat kurir kalau internetnya nggak keburu. Ditutup [overview CloudWatch monitoring](/blog/amazon-cloudwatch-monitoring-overview): metric, alarm, event, namespace, sampe bedanya SES dan SNS buat notifikasi.

## Catatan Sampingan

- Instruktur cerita soal Snowmobile (kontainer truk buat migrasi data skala exabyte) yang sekarang udah jarang dipake bahkan sempat di-stop AWS, karena orang lebih milih Snowball biasa yang lebih praktis daripada logistik kontainer truk di jalanan macet kayak Jakarta.
- Ada obrolan panjang soal harga internet Indonesia dibanding Korea (2 Gbps cuma Rp200 ribuan), dan gimana itu ngaruh ke keputusan pakai Transfer Family/DataSync vs Snow Family buat migrasi data.
- Instruktur nekenin soal tips ujian: soal pilihan ganda vs multiple-select (select 2/select 3), kalau ragu mending di-skip dulu terus balik lagi belakangan.
