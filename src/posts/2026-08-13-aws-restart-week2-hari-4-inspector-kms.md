---
title: "AWS re/Start Week 2 Hari 4: Amazon Inspector, Patch Manager, dan KMS"
description: "Hari padat soal security: scan vulnerability pake Inspector, lanjutan system hardening pake Patch Manager, sampe encrypt-decrypt data pake KMS."
author: srytmj
date: 2026-08-13 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, security, inspector, kms]
pin: false
math: false
mermaid: false
published: true
---

Hari ini temanya security, dan padat banget, ada 3 lab besar sekaligus. Mulai dari **Amazon Inspector**, service buat scan vulnerability di resource AWS (kali ini nyoba scan Lambda function). Ternyata Inspector itu cuma nemuin masalahnya doang, benerinnya tetap tanggung jawab kita sendiri. Detail lengkapnya di [halaman khusus Inspector](/blog/amazon-inspector-vulnerability-scanning).

Abis itu lanjutan **Patch Manager** dari kemarin, kali ini fokus ke tagging server biar patching-nya bisa disasar ke grup tertentu. Sempet ketemu masalah lucu juga, jumlah server yang ke-tag nggak sesuai ekspektasi, ternyata gara-gara ada spasi nyelip pas copy-paste nama tag. Detail lengkapnya di [halaman khusus Patch Manager](/blog/system-hardening-patch-manager-lanjutan).

Terakhir, masuk ke **KMS (Key Management Service)**, belajar bikin kunci enkripsi sendiri, terus encrypt dan decrypt file lewat command line. Ada juga sesi nostalgia lucu soal enkripsi jaman SMS dulu sebelum masuk ke konsep symmetric vs asymmetric key yang lebih serius. Detail lengkapnya di [halaman khusus KMS](/blog/kms-encrypt-decrypt-symmetric-key).

Yang paling nempel hari ini: security itu emang nggak murah. Inspector bayar per scan, KMS bayar per key, Patch Manager butuh setup yang rapi dari awal (kayak tagging) biar nggak ribet pas scale ke banyak server. Semua service ini punya prinsip yang sama: makin serius soal keamanan, makin banyak yang harus dikonfigurasi dan dibayar.
