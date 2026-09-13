---
title: "AWS re/Start Week 5 Hari 5: Cost Management, Incident Response, dan Resource Tagging"
description: "Materi cost management dan support plans, ditutup dua lab seru: investigasi website kena hack pakai CloudTrail/Athena, dan resource tagging management pakai CLI."
author: srytmj
date: 2026-09-04 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, cost management, cloudtrail, tagging]
pin: false
math: false
mermaid: false
published: true
---

Dibuka materi [cost management](/blog/aws-cost-management-tools-budgets): Cost Explorer, AWS Budgets (yang ternyata cuma notifikasi, bukan otomatis matiin resource), billing alarm, sampe strategi cost reduction. Lanjut [Support Plans dan Trusted Advisor](/blog/aws-support-plans-trusted-advisor), hitung-hitungan kenapa TAM itu mahal buat individu dibanding pake vendor lokal.

Lab pertama hari ini paling seru: [investigasi website kena hack](/blog/incident-response-cloudtrail-athena-hack). Setup CloudTrail dulu, terus website café tiba-tiba defaced. Investigasi manual pake grep/jq di log JSON yang berantakan, ganti strategi pake Amazon Athena buat query yang lebih presisi, ketemu attacker manfaatin SSM buat modifikasi security group, kill session-nya, hapus user asing, benerin konfigurasi SSH, dan restore website dari backup.

Lab kedua: [resource tagging management pakai CLI](/blog/resource-tagging-management-cli-jmespath). Filter instance pakai JMESPath query berdasarkan tag project/environment, script `stopinator.php` buat stop/start server massal berdasarkan tag, dan script terminate buat instance yang nggak punya tag `environment` (dianggap nggak sesuai standar).

Ditutup materi singkat [configuration management overview](/blog/configuration-management-overview): kenapa konfigurasi harus seragam, dan perbandingan istilah template (playbook di Ansible, recipe di OpsWorks, manifest di Puppet).

## Catatan Sampingan

- Lab hacking hari ini nekenin poin penting: cloud bukan jaminan otomatis aman, keamanan tetap tanggung jawab kita di semua layer.
- Instruktur cerita soal politik kantor: penting punya "channel" dan tahu momen yang tepat buat presentasi hasil kerja (misal efisiensi cost) ke atasan, bukan ke sesama rekan kerja yang bisa jadi malah rebutan kredit.
