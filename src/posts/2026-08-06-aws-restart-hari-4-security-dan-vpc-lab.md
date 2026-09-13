---
title: "AWS re/Start Hari 4: TCP vs UDP, Security Fundamentals, dan Lab VPC Manual"
description: "Hari terpadat sejauh ini, dari analogi tumbler vs galon buat TCP/UDP, security fundamentals, sampe lab bikin VPC manual dari nol."
author: srytmj
date: 2026-08-06 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, networking, security, vpc]
pin: false
math: false
mermaid: true
published: true
---

Ini kayaknya hari terpadat sejauh ini. Mulai dari TCP vs UDP, security fundamentals, sampe lab paling berat minggu ini: bikin VPC manual dari nol.

Analogi yang paling nempel buat TCP vs UDP itu tumbler vs galon. TCP kayak minum pake tumbler, ada koneksi jelas, lambat tapi terjamin nggak tumpah. UDP kayak nenggak langsung dari galon, cepet tapi ada yang muncrat kemana-mana. Sesimpel itu tapi langsung ngerti bedanya, TCP dipake buat yang butuh kepastian data sampe utuh (chat, transfer file), UDP buat yang butuh kecepatan real-time (streaming, video call).

Abis itu masuk ke security fundamentals: CIA triad (confidentiality, integrity, availability), bedanya threat/vulnerability/exploit/breach, sampe bahas kasus-kasus lokal kayak WA GB, phishing ngaku-ngaku bank, dan modus di ATM. Yang ditekenin bakal keluar di ujian CCP itu shared responsibility model: "security of the cloud" itu tanggung jawab AWS (infrastruktur fisik), "security in the cloud" itu tanggung jawab kita (data, IAM, konfigurasi). Detail lengkapnya, plus perbandingan TCP/UDP, ada di [halaman khusus TCP/UDP dan security fundamentals](/blog/tcp-udp-security-fundamentals).

Terus lab paling berat: bikin VPC manual dari nol, itung CIDR sendiri, bikin subnet public-private di AZ beda, attach internet gateway, setting routing table, network ACL, sampe security group.

```mermaid
flowchart LR
  Internet --> IGW[Internet Gateway]
  IGW --> RT[Routing Table]
  RT --> NACL[Network ACL<br/>stateless, di level subnet]
  NACL --> SG[Security Group<br/>stateful, di level instance]
  SG --> EC2[EC2 Instance]
```

Urutan ini yang bikin ngerti kenapa troubleshooting koneksi itu harus dicek dari luar ke dalam. Lab ini kepanjangan sampe lanjut ke besok. Detail teknis lengkapnya (rumus CIDR, IGW, routing table, NACL vs security group) ada di [halaman khusus VPC manual](/blog/vpc-manual-cidr-igw-nacl-security-group).

## Catatan Sampingan

- Instruktur ngebahas detail modus penipuan ATM: pelaku pura-pura jadi customer service resmi lewat telepon pas korban lagi di ATM, ngaku ATM-nya "kejepit", ngobrol basa-basi dulu buat bangun kepercayaan, baru minta PIN buat "bantuin", padahal itu murni social engineering, bukan hacking teknis.
- Insight soal karier: freelance IT security/pentester buat bank itu bisa dibayar ratusan juta buat kerja cuma 3 hari, karena mereka udah punya reputasi/nama besar di industri, jauh beda sama security engineer yang di-hire tetap dengan gaji bulanan biasa.
- Ada joke soal Kominfo yang pernah bikin campaign "hacker jangan menyerang" alih-alih benerin sistem keamanannya sendiri, dibandingin sama nyuruh maling jangan maling.
