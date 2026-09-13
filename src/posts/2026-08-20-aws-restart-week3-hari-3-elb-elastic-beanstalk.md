---
title: "AWS re/Start Week 3 Hari 3: Elastic Beanstalk, Troubleshooting LAMP, dan ELB"
description: "Hari ketiga minggu ketiga, dari kenalan Elastic Beanstalk, lab troubleshooting server LAMP yang sengaja dirusak, sampe konsep Elastic Load Balancing lewat analogi SPBU."
author: srytmj
date: 2026-08-20 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, elastic beanstalk, load balancing]
pin: false
math: false
mermaid: false
published: true
---

Hari ketiga minggu ketiga, dibuka sama Elastic Beanstalk. Ternyata ini nggak ada lab-nya sama sekali, murni materi konsep buat ujian CCP, PaaS yang bungkus EC2 + Auto Scaling + Load Balancer jadi satu paket, tinggal upload kode. Servis-nya sendiri gratis, yang bayar cuma resource di baliknya. Detail lengkapnya di [halaman khusus Elastic Beanstalk](/blog/aws-elastic-beanstalk).

Lanjut ke lab troubleshooting: skenario café yang mau nambahin fitur pesan online, servernya di-deploy pake LAMP stack (Linux, Apache, MariaDB, PHP) lewat script CLI, tapi sengaja ada 2 bug: AMI ID yang nggak cocok sama region deployment, dan security group yang nutup port HTTP. Cara nemuin masalahnya pake `nmap` buat cek port kebuka apa enggak, ternyata port ada tapi statusnya `closed`, beda sama `enggak ada sama sekali`. Detail case study-nya di [halaman khusus LAMP café](/blog/lamp-stack-cafe-online-order), dan detail troubleshooting-nya di [halaman khusus troubleshooting LAMP](/blog/troubleshooting-lamp-stack-ec2).

Sisa sesi masuk konsep Elastic Load Balancing, mulai dari analogi karyawan SPBU buat jelasin kenapa perlu bagi traffic, bedanya High Availability sama Fault Tolerance (HA itu "yang penting jalan meski pincang", beda dari Fault Tolerance yang aktif-aktif penuh performa), sampe gimana path-based routing jadi dasar arsitektur microservice (analogi klik kategori di Tokopedia yang ternyata pindah server tanpa kerasa). Sesi kepotong sebelum masuk hands-on lab, jadi kemungkinan lab-nya nyambung ke hari berikutnya. Detail lengkap materinya di [halaman khusus Elastic Load Balancing](/blog/elastic-load-balancing-elb).

Ditutup dengan pengingat soal challenge lab EC2 (bikin VPC + web server dari nol) yang emang sengaja nggak didemoin di kelas, dikerjain sendiri di luar sesi. Detail requirement-nya ada di [halaman khusus challenge lab](/blog/ec2-challenge-lab-web-app).

## Catatan Sampingan

- Instruktur cerita pengalaman pribadi ngerjain proyek deploy AI di Bank Mandiri, dan dia selalu insist buat jelasin breakdown biaya (per token) di depan sebelum proyeknya jalan, karena udah sering liat kasus perusahaan PHK karyawan demi ganti AI, eh 3 bulan kemudian tagihannya lebih mahal dari gaji karyawan yang di-PHK.
- Ada cerita miris soal proyek IT pemerintah: budget puluhan miliar buat "penguatan" dan "evaluasi strategi", tapi budget riil buat vendor yang ngerjain cuma puluhan juta, dan kadang vendornya malah nggak dibayar sama sekali padahal kerjanya udah kelar.
