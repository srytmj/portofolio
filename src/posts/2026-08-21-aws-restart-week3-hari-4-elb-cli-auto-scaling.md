---
title: "AWS re/Start Week 3 Hari 4: ELB via CLI dan Auto Scaling Group"
description: "Hari keempat minggu ketiga, review komponen load balancer, bikin ELB pakai CLI, sampe lab berat bikin Auto Scaling Group dari AMI matang."
author: srytmj
date: 2026-08-21 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, elb, auto-scaling]
pin: false
math: false
mermaid: false
published: true
---

Hari keempat minggu ketiga, lanjutan langsung dari materi ELB kemarin. Sesi dibuka review cepat soal listener dan target group, terus langsung praktek bikin load balancer pakai CLI: target group dulu (gratis), baru load balancer, baru listener, baru register target, baru verifikasi lewat `describe-target-health`. Detail lengkapnya di [halaman khusus setup ELB via CLI](/blog/elb-setup-cli-target-group-listener).

Lanjut ke lab yang katanya "agak berat", bikin Auto Scaling Group dari nol. Alurnya panjang: instance yang udah "matang" (web server-nya jalan) di-restart dulu terus di-convert jadi AMI, dari AMI itu dibikin launch template, dari launch template baru dibikin Auto Scaling Group dengan target tracking policy berbasis CPU (threshold 50%), terus disambungin ke load balancer yang udah dibikin sebelumnya. Ditutup stress test buat mancing scaling-nya beneran jalan, dan ternyata butuh sekitar 5 menit buat Auto Scaling bereaksi, bukan instan. Detail lengkap lab-nya di [halaman khusus Auto Scaling Group](/blog/auto-scaling-group-ami-launch-template).

Yang paling nempel: instance yang dikelola Auto Scaling Group itu ternyata nggak butuh public IP sendiri sama sekali, karena semua akses masuk lewat load balancer, jadi hemat biaya IP dinamis per-instance.

Ditutup dengan preview kalau materi selanjutnya bakal masuk perbandingan scaling dynamic vs predictive, katanya nunggu minggu depan.

## Catatan Sampingan

- Instruktur cerita soal kasus rating jelek aplikasi BCA di Play Store yang sebenarnya bukan salah aplikasinya, tapi gara-gara aplikasi lain (contohnya game yang server-nya bermasalah) bikin user salah sasaran ngasih rating buruk ke aplikasi yang nggak ada hubungannya.
- Ada analogi lucu soal update AMI: kalau perubahannya kecil, cukup modify launch template (nambahin "extension" di user data), tapi kalau perubahannya gede, mending bikin AMI baru dari awal daripada maksa nge-patch yang lama.
