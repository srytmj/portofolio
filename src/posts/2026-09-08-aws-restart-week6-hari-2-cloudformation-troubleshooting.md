---
title: "AWS re/Start Week 6 Hari 2: CloudFormation Lanjutan dan Troubleshooting Mendalam"
description: "Materi CloudFormation lebih dalam (intrinsic function, wait condition, rollback), ditutup lab troubleshooting yang paling berharga: typo, drift, dan retain resource."
author: srytmj
date: 2026-09-08 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, cloudformation, troubleshooting, drift]
pin: false
math: false
mermaid: false
published: true
---

Lanjutan dari [hari sebelumnya](/blog/aws-restart-week6-hari-1-ami-cost-optimization-cloudformation). Dibuka materi [CloudFormation lanjutan](/blog/cloudformation-parameters-intrinsic-functions): AllowedValues di parameter, intrinsic function (Select, GetAtt, Join, FindInMap), pseudo parameter, perbandingan cfn-init vs user data eksternal, sampe behavior rollback default.

Lab hari ini paling berharga sejauh ini: [troubleshooting CloudFormation](/blog/troubleshooting-cloudformation-drift). Stack pertama gagal gara-gara typo sepele (`http` bukan `httpd`) di user data, harus SSH masuk ke instance buat nyari log-nya sendiri. Lanjut belajar drift detection, ternyata upload file ke S3 itu bukan drift, tapi edit security group rule itu drift. Ditutup skenario paling nyebelin: S3 bucket yang masih ada isinya nggak bisa ke-delete otomatis dari stack, solusinya pakai `--retain-resources`.

Ditutup challenge lab CloudFormation gabungan (VPC + security group + EC2), dan instruktur kasih template siap pakai buat mempercepat karena waktu udah mepet mendekati akhir program.

## Catatan Sampingan

Sisa sesi malam instruktur demo cara daftar ujian sertifikasi CCP versi online (dengan proctor), requirement teknisnya lumayan ketat (satu monitor doang, nggak boleh headphone, ruangan harus steril). Ini nggak dicatat sebagai materi teknis AWS karena sifatnya prosedural administratif ujian, bukan konsep cloud.
