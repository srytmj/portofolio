---
title: "AWS re/Start Week 4 Hari 1: Prediction Challenge, Route 53, dan CloudFront"
description: "Hari pertama minggu keempat, resmi masuk 3 minggu terakhir program. Latihan step scaling, materi Route 53 sampe lab failover routing, dan CloudFront."
author: srytmj
date: 2026-08-24 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, auto-scaling, route53, cloudfront]
pin: false
math: false
mermaid: false
published: true
---

Resmi masuk week 4, instruktur bilang program ini bakal berakhir 3 minggu lagi. Dibuka dengan latihan mikir step scaling, Auto Scaling group dengan kapasitas min 5, desired 10, max 20, terus disuruh prediksi berapa instance yang nambah/berkurang dari 6 kondisi CPU utilization berturut-turut. Detail latihannya di [halaman khusus prediction challenge](/blog/ec2-auto-scaling-prediction-challenge).

Lanjut ke materi Route 53, mulai dari DNS dasar sampe 8 jenis routing policy (simple, weighted, latency-based, failover, geolocation, geoproximity, multivalue, IP-based), termasuk pola blue/green deployment pake weighted routing. Terus langsung praktek lab bikin failover routing: health check di instance primary, CloudWatch alarm yang trigger kalau health check-nya unhealthy, notifikasi SNS lewat email, sampe simulasi instance primary di-stop dan liat trafik pindah ke secondary otomatis. Detail lengkapnya di [halaman khusus Route 53](/blog/amazon-route-53-dns-routing).

Ditutup materi CloudFront, CDN-nya AWS. Dibahas cara kerja edge location dan regional edge cache, TTL dan cache invalidation, sampe soal harga yang ternyata dijual per paket region (price class), bukan bisa pilih region satu-satu. Detail lengkapnya di [halaman khusus CloudFront](/blog/amazon-cloudfront-cdn).

Di ujung sesi, mulai masuk materi [AWS Lambda dan serverless computing](/blog/aws-lambda-serverless-computing): perbandingan deployment tradisional vs serverless, event-driven execution, batas eksekusi 15 menit, sampe Lambda layers. Lab hands-on-nya sendiri baru jalan 2 hari kemudian.

## Catatan Sampingan

- Instruktur nekenin poin penting: Route 53 failover itu cuma DNS-level redirect aktif-pasif, bukan self-healing, dan nggak terintegrasi langsung ke Auto Scaling Group, itu tugasnya load balancer (ELB yang connect ke ASG).
- Ada obrolan soal tips ujian sertifikasi AWS: disaranin ambil ujian offline kalau memungkinkan, karena katanya 20% peserta gagal bukan karena materi tapi gara-gara masalah proktor online (kamera kurang jelas, dianggap mencurigakan gara-gara gerak-gerik kecil kayak garuk kepala).
