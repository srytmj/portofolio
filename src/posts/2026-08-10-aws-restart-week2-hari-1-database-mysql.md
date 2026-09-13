---
title: "AWS re/Start Week 2 Hari 1: Database Manual di EC2 Pakai MySQL"
description: "Hari pertama minggu kedua, full lab database dari nol: install MySQL di EC2, DDL, DML, sampe SELECT query dasar."
author: srytmj
date: 2026-08-10 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, database, mysql]
pin: false
math: false
mermaid: false
published: true
---

Masuk minggu kedua, dan hari ini full lab, nggak ada teori sama sekali di kelas. Materinya soal database, tapi bukan langsung RDS, malah mulai dari cara paling manual dulu: install MySQL sendiri di atas EC2.

Ada kejadian lucu di awal lab, instance-nya sengaja nggak dikasih key pair pas dibuat, jadi nggak bisa SSH pakai PuTTY atau terminal biasa. Solusinya ternyata pakai Session Manager, connect langsung dari console tanpa perlu kunci sama sekali, asal instance-nya udah punya SSM agent dan role yang cukup. Baru ngerasain langsung kenapa Session Manager itu dianggap best practice dibanding SSH biasa.

Setelah connect, mulai dari bikin dan hapus database sama table (DDL), lanjut ke insert, update, delete data (DML), sampe belajar SELECT query yang lebih dalam: pakai kondisi WHERE, urutin data pakai ORDER BY, sampe function kayak COUNT. Detail teknisnya aku tulis lengkap di [halaman khusus](/blog/database-ec2-ddl-dml-select), di sini cuma jejak harian doang.

Yang paling nempel: ternyata banyak "gotcha" kecil di SQL yang gampang bikin salah kalau nggak hati-hati, terutama soal UPDATE atau DELETE tanpa kondisi yang jelas. Sekali salah ketik, bisa ngubah atau ngapus data yang harusnya nggak disentuh sama sekali. Untung ini masih lab, bukan production.
