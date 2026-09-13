---
title: "AWS re/Start Week 3 Hari 1: Kenalan AWS CLI dan Deploy Static Website ke S3"
description: "Hari pertama minggu ketiga, dari install AWS CLI dari nol di Red Hat instance sampe deploy static website ke S3 buat nyimpen media."
author: srytmj
date: 2026-08-18 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, cli, s3]
pin: false
math: false
mermaid: false
published: true
---

Masuk minggu ketiga. Hari ini fokusnya dua hal yang ternyata saling nyambung: AWS CLI dan Amazon S3.

Sesi di mulai dari instalasi dan cara pake AWS CLI, praktek langsung install dari nol di instance Red Hat (yang emang sengaja belum ada CLI-nya, beda sama Amazon Linux yang udah pre-installed). Connect dulu lewat SSH, download installer-nya, unzip, install, konfigurasi pake `aws configure`, terus dites lewat `aws iam list-users`. Ada juga opsi `--query`, `--filter`, sama `--dry-run` yang ternyata kepake banget buat kerjaan sehari-hari, `--query` buat batesin tampilan hasil di sisi kita, `--filter` buat nyaring di sisi server, `--dry-run` buat ngetes permission tanpa beneran eksekusi. Detail lengkapnya udah aku tulis di halaman khusus [AWS CLI](/blog/aws-cli-query-filter-dry-run).

Abis itu lanjut ke S3, dan ternyata materinya langsung nyambung ke CLI yang baru dipelajarin. S3 dikenalin sebagai object storage yang salah satu kegunaannya buat static website hosting, dan buat lab-nya bener-bener praktek deploy website café pake AWS CLI dari EC2 instance: bikin bucket, bikin IAM user baru khusus buat akses S3, atur permission bucket, extract file website, upload semuanya, sampe bikin batch script biar update konten berikutnya nggak perlu ngetik ulang command panjang. Ini juga yang jadi konteks kenapa S3 itu dipake sebagai tempat nyimpen media (foto, gambar) buat website, bukan cuma sekadar file storage biasa.

Detail lengkap materi S3 static hosting-nya ada di [halaman khusus S3](/blog/s3-static-website-hosting). Sekalian juga kesentuh IAM cukup dalam pas bikin user buat akses S3 itu, dari bedanya root account sama IAM user, sampe kenapa access key itu nggak boleh dianggap remeh (sekali ilang, secret-nya nggak bisa dilihat lagi). Detail lengkapnya di [halaman khusus IAM](/blog/iam-policy-permission-role).

Yang paling nempel dari hari ini: ternyata banyak hal yang keliatan ribet kalau dijelasin teori doang (bikin IAM user, atur bucket policy, dst) jadi jauh lebih gampang dipahami begitu langsung dipraktekin urutan step-nya satu-satu lewat CLI. Dan cara CLI-nya nyambung, `aws configure` buat setup awal, `aws s3api create-bucket` buat bikin storage-nya, `aws iam create-user` buat akses terpisah, `aws s3 cp` buat upload konten, itu semua pola yang bakal keulang terus di lab-lab berikutnya.
