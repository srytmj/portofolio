---
title: "AWS re/Start Week 2 Hari 5: IAM Praktik, Network Firewall, dan CloudWatch Alarm"
description: "Hari terakhir Week 2, dari praktik langsung IAM policy pake 3 user beda, block malware pake Network Firewall, sampe bikin alarm CloudWatch yang notif ke email."
author: srytmj
date: 2026-08-14 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, iam, security, cloudwatch]
pin: false
math: false
mermaid: false
published: true
---

Hari terakhir Week 2, dan padat banget, 3 lab besar plus mulai preview materi Week 3.

Lab pertama **IAM**, tapi kali ini bener-bener praktik, bukan cuma baca policy doang. Login gantian pake 3 user yang beda-beda permission-nya (S3 read-only, EC2 read-only, EC2 admin tanpa hak terminate), terus dicoba langsung apa yang bisa dan nggak bisa dilakuin tiap user. Paling nempel: kalau ada konflik allow vs deny antara policy di level user dan level group, yang menang selalu **deny**, nggak peduli itu ketemu di user atau di group-nya. Detail lengkapnya di [halaman khusus IAM praktik](/blog/iam-praktik-password-policy-user-group).

Lab kedua geser ke **Network Firewall**, belajar block akses ke situs malware pake Suricata rule. Sempet download 2 file "malware" beneran (yang udah dijinakin buat lab, tapi tetep dikasih warning keras jangan sampe kepake di komputer sendiri), terus verifikasi kalau firewall-nya beneran nge-drop koneksinya. Detail lengkapnya di [halaman khusus Network Firewall](/blog/network-firewall-block-malware).

Lab ketiga **CloudWatch Alarm + SNS**, bikin notifikasi email otomatis kalau CPU EC2 kelewat 60%, terus di-stress-test beneran sampe alarm-nya bunyi. Juga sempet ngobrolin kapan worth pake CloudWatch vs tools kayak Grafana. Detail lengkapnya di [halaman khusus CloudWatch](/blog/cloudwatch-alarm-sns-notification).

Nutup hari ini ada preview singkat soal CAF (Cloud Adoption Framework), tapi baru sempet kesentuh dikit karena materinya panjang banget, katanya bakal dilanjutin di sesi berikutnya. Yang udah dibahas: bedanya CAF (panduan buat yang mau pindah ke cloud) sama Trusted Advisor (buat yang udah di cloud dan butuh review infrastruktur). Materi lengkapnya nggak sempet kebahas lagi di Zoom, jadi aku pelajarin sendiri belakangan, ditulis di [halaman khusus CAF](/blog/aws-cloud-adoption-framework-caf), plus dua materi terkait yang juga self-study, [Well-Architected Framework](/blog/aws-well-architected-framework) dan [latihan migrasi data center ke AWS](/blog/transitioning-data-center-to-aws).

Week 2 resmi kelar. Dari database manual di EC2, RDS/Aurora, DynamoDB, sampe security (Inspector, Patch Manager, KMS, IAM, Firewall, CloudWatch), lumayan banyak yang keserep minggu ini.
