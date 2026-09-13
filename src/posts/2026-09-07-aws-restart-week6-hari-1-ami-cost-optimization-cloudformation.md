---
title: "AWS re/Start Week 6 Hari 1: AMI Strategy, Rightsizing, dan CloudFormation Pertama"
description: "Masuk minggu keenam, hari terakhir sisa ~10 hari. Materi AMI building strategy, lab rightsizing instance, dan mulai kenalan sama CloudFormation."
author: srytmj
date: 2026-09-07 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, ami, cloudformation, cost optimization]
pin: false
math: false
mermaid: false
published: true
---

Masuk minggu keenam, instruktur bilang program ini bakal berakhir sekitar 10 hari lagi. Dibuka materi [AMI building strategy](/blog/ami-building-strategy-jos): trade-off simplicity (full-baked image) vs flexibility (JOS/bootstrap minimal), dan kenapa AMI itu berbayar dan region-scoped.

Lab pertama: [cost optimization lewat rightsizing](/blog/cost-optimization-rightsizing-instance), downsize instance café dari `t2.small` ke `t2.micro` setelah database-nya migrasi ke RDS, dihitung pake AWS Pricing Calculator, hasilnya hemat sekitar $9/bulan buat satu server.

Sisa sesi mulai masuk unit baru: [Infrastructure as Code dan dasar JSON/YAML](/blog/infrastructure-as-code-json-yaml), kenapa YAML lebih disukai buat CloudFormation karena lebih gampang dibaca dibanding JSON. Ditutup lab pertama [CloudFormation: deploy, update, delete stack](/blog/cloudformation-deploy-first-stack), dari bikin VPC + security group sampe nambah S3 bucket dan EC2 instance via update stack.

## Catatan Sampingan

Instruktur juga demo panjang soal cara daftar ujian sertifikasi CCP (baik offline di test center maupun online dengan proctor), termasuk tips-tips teknis (bawa kertas dan pulpen buat corat-coret arsitektur, requirement ruangan buat ujian online, dan rekomendasi lokasi test center). Ini nggak dicatat sebagai materi teknis karena sifatnya prosedural administratif, bukan konsep AWS.
