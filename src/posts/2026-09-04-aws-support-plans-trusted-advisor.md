---
title: "AWS Support Plans dan Trusted Advisor: Kapan Worth Dibayar"
description: "Rangkuman materi support plan (basic, bisnis, enterprise), Trusted Advisor sebagai konsultan virtual, dan hitung-hitungan kenapa TAM itu mahal buat individu."
author: srytmj
date: 2026-09-04 00:00:00 +0700
categories: [AWS re/Start, Materi]
tags: [aws, support plan, trusted advisor, cost]
pin: false
math: false
mermaid: false
published: true
---

## Tier Support Plan

AWS Support Plan itu perpaduan tools, teknologi, dan orang buat bantu optimisasi performa dan biaya. Tier-nya (nama sering berubah, terakhir): **Basic**, **Business**, **Enterprise**, dan **Unified**. Basic itu gratis (nggak bayar sama sekali kalau nggak ada resource yang jalan), tier di atasnya berbayar dan ngasih akses ke fitur lebih dalam kayak Trusted Advisor full checks dan Technical Account Manager (TAM).

## Trusted Advisor: Konsultan Virtual

Trusted Advisor itu kayak "bot konsultan/solutions architect" yang otomatis ngescan infrastruktur AWS kita dan bandingin sama best practice AWS di beberapa kategori (cost optimization, performance, security, fault tolerance, service limits, operational excellence).

Contoh temuan yang biasa: idle resource (RDS yang nggak dipake, load balancer nggak dipake), volume EBS yang nggak nempel ke instance manapun, atau Elastic IP yang di-allocate tapi nggak ditempel ke resource apapun (tetap bayar biaya kecil per jam, tapi kalau numpuk lumayan).

Fitur basic (security checks kayak MFA, public snapshot, security group check) tersedia buat semua tier support. Tapi cost optimization checks yang lebih detail butuh minimal Business atau Enterprise support plan.

## Technical Account Manager (TAM)

TAM itu semacam konsultan pribadi dari AWS langsung, bisa ditanya-tanya soal akun dan arsitektur. Tapi ini **mahal banget buat individu**: harga support plan Business itu minimal $100/bulan, dan kalau tagihan bulanannya $250, biayanya 3% dari itu (~$7.5), tapi ada minimum charge yang jauh lebih tinggi. Untuk Enterprise, minimum-nya sekitar $5.000/bulan.

Perbandingannya: dapetin TAM langsung dari AWS bisa jutaan rupiah per bulan, sementara pake vendor lokal (APN partner) buat konsultasi serupa bisa jauh lebih murah (sekitar 10 juta-an, one-time atau lebih fleksibel), meski aksesnya nggak selengkap TAM langsung.

## Hierarki Bantuan Customer Service

Sekarang kebanyakan layer bantuan customer service (termasuk AWS) itu berlapis: AI/chatbot dulu di layer pertama, kalau nggak bisa diselesaikan baru eskalasi ke customer service manusia, baru kalau makin kompleks eskalasi lagi ke TAM/spesialis. Ini pola umum di banyak industri sekarang (perbankan, telco), bukan cuma AWS.

## Yang Perlu Diinget

- Support plan Basic itu gratis, cuma bayar kalau ada resource yang beneran jalan (bukan bayar buat support-nya sendiri).
- Trusted Advisor itu kayak konsultan virtual, security checks basic gratis di semua tier, cost optimization checks detail butuh Business/Enterprise.
- TAM itu fasilitas mahal, biasanya cuma masuk akal buat perusahaan skala besar, individu/startup kecil lebih baik pakai vendor/APN partner yang lebih terjangkau.
- Idle resource (Elastic IP nganggur, volume nggak kepakai) tetap kena biaya walau kelihatannya nggak "aktif".

## Referensi Resmi

- [AWS Support Plans](https://aws.amazon.com/premiumsupport/plans/)
- [AWS Trusted Advisor](https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html)
