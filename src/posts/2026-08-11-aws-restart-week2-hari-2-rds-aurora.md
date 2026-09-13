---
title: "AWS re/Start Week 2 Hari 2: Lanjutan SQL dan Bikin RDS/Aurora Pertama"
description: "Lanjutan SQL yang lebih dalam, terus lompat ke lab paling panjang sejauh ini: bikin RDS/Aurora dari nol dan nyambungin ke web app."
author: srytmj
date: 2026-08-11 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, database, rds, aurora]
pin: false
math: false
mermaid: false
published: true
---

Hari ini masih lanjutan database, tapi levelnya naik. Pagi masih SQL, kali ini lebih dalam lagi: `BETWEEN` buat range angka, `LIKE` buat pencarian teks pakai wildcard, function agregat kayak `SUM`/`AVG`/`MAX`/`MIN`/`COUNT`, sampai window function (`OVER`, `PARTITION BY`, `RANK`) yang ternyata konsepnya lumayan tricky. Detail lengkapnya aku taruh di [halaman khusus](/blog/sql-lanjutan-aggregate-window-function).

Abis itu baru masuk ke lab utama hari ini, yang katanya bakal jadi lab terpanjang sejauh ini: bikin RDS dari nol, dan langsung dibandingin sama Aurora. Sebelum mulai, dijelasin dulu konsep primary-secondary (atau kalau istilah lama disebut master-slave, atau active-passive), gimana replikasinya real-time, dan gimana failover-nya kerja otomatis lewat endpoint tanpa perlu ganti-ganti IP manual.

Lab-nya sendiri panjang banget, dari bikin security group berlapis (DB cuma bisa diakses dari security group web server, bukan dari IP), bikin DB subnet group, sampai akhirnya connect aplikasi CRUD sederhana ke RDS dan nyoba tambah-edit-hapus data beneran. Detail lengkap RDS/Aurora-nya ada di [halaman khusus](/blog/rds-aurora-multi-az).

Yang paling nempel hari ini: ternyata database itu nggak bisa diakses langsung dari laptop sendiri meskipun udah punya endpoint-nya, karena security group-nya emang sengaja dibatasi cuma nerima trafik dari web server. Awalnya kepikiran itu bug, ternyata emang gitu desainnya demi keamanan.
