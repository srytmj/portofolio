---
title: "AWS re/Start Week 5 Hari 3: CloudWatch Logs/Events, Athena, Organizations, dan Tagging"
description: "CloudWatch Logs dan EventBridge, Athena buat query serverless, AWS Organizations dan SCP, tagging dan cost management, ditutup lab monitoring infrastruktur lengkap."
author: srytmj
date: 2026-09-02 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, cloudwatch, organizations, tagging]
pin: false
math: false
mermaid: false
published: true
---

Dibuka materi [CloudWatch Logs dan EventBridge](/blog/cloudwatch-logs-events-eventbridge): kenapa log itu harus "suci" (nggak boleh diedit apapun alasannya), metric filter buat nyari pola di log, dan penekanan soal bedanya CloudTrail (monitor aktivitas akun) vs CloudWatch (monitor resource) yang sering jadi jebakan soal ujian.

Lanjut materi singkat [Amazon Athena](/blog/amazon-athena-serverless-query), service query serverless buat data di S3 tanpa perlu provisioning cluster Hadoop/Spark, bayarnya per query.

Materi besar berikutnya: [AWS Organizations dan SCP](/blog/aws-organizations-scp), konsep nested OU, cara kerja inheritance SCP yang cukup ribet (hasil akhirnya selalu irisan paling restriktif, bukan gabungan), sampe consolidated billing buat manfaatin economies of scale. Ditutup [tagging dan cost management](/blog/aws-tagging-cost-management), gimana tag (gratis, sampe 50 per resource) bisa dipake buat enforcement lewat AWS Config atau IAM policy, dan breakdown biaya per divisi di Cost Explorer.

Lab hari ini paling lengkap sejauh ini: [Monitoring Infrastructure](/blog/monitoring-infrastructure-cloudwatch-agent-config). Install CloudWatch Agent lewat Systems Manager Run Command (nggak perlu SSH manual), konfigurasi via Parameter Store, bikin alarm dari log aplikasi custom (simulasi error 404 berkali-kali), notifikasi real-time perubahan infrastruktur pakai EventBridge, ditutup compliance check pakai AWS Config (ketauan 17 resource belum di-tag, dan 1 EBS volume nganggur nggak kepake).

## Catatan Sampingan

- Instruktur cerita soal dinamika kerja developer vs QA/tester yang sering "bentrok" karena KPI beda: developer dikejar deadline, QA harus mastiin nggak ada bug sebelum rilis ke production.
- Ada obrolan soal AI coding ("vibe coding") yang bikin developer generasi sekarang lebih bergantung ke AI dibanding belajar dari forum/dokumentasi kayak dulu.
- Instruktur bilang minggu depan bakal full latihan soal biar siap ujian sertifikasi, target program selesai 3 minggu lagi.
