---
title: "Infrastructure as Code: Kenalan dengan JSON dan YAML"
description: "Rangkuman materi dasar IaC, kenapa JSON dan YAML jadi bahasa deklaratif buat CloudFormation, dan kenapa YAML lebih disukai dari sisi keterbacaan."
author: srytmj
date: 2026-09-07 00:00:00 +0700
categories: [AWS re/Start, Materi]
tags: [aws, iac, cloudformation, json, yaml]
pin: false
math: false
mermaid: false
published: true
---

## Kenapa Butuh Infrastructure as Code

Kalau bikin resource manual (klik-klik di console) satu-satu, itu capek dan rawan human error, apalagi kalau butuh environment yang sama berkali-kali (dev, staging, production). Infrastructure as Code (IaC) nyelesain ini: definisi infrastruktur ditulis dalam bentuk **template**, bisa dipake berulang, konsisten, dan bisa divalidasi sebelum dijalanin.

Tantangan deployment cloud tanpa IaC: rollout ke banyak lokasi dengan setting sama, rollback kalau ada error, dokumentasi yang gampang lolos nggak ke-update, dan strategi update di live server.

## JSON: Bahasa Deklaratif buat CloudFormation

JSON (JavaScript Object Notation) itu **bukan bahasa pemrograman**, tapi format buat notasi objek (key-value). Sering disalahpahami sebagai "bahasa pemrogramannya JavaScript" padahal beda konsep.

```json
{
  "cake": {
    "flavor": "cokelat",
    "price": 20,
    "fits": 8
  }
}
```

Struktur dasarnya: `{}` (brace/kurung kurawal) sebagai kontainer objek, `[]` (bracket) buat array/list, key-value dipisah titik dua, tiap pasangan dipisah koma.

**Kelebihan JSON**: ringan, gampang di-parsing, cocok banget buat API. **Kekurangan**: banyak tanda kurung dan kutip, jadi capek dibaca/ditulis manual, apalagi buat template infrastruktur yang panjang.

## YAML: Alternatif yang Lebih Enak Dibaca

YAML (YAML Ain't Markup Language) itu format serialisasi data lain, tujuannya jauh lebih human-readable dibanding JSON.

```yaml
cake:
  flavor: cokelat
  price: 20
  fits: 8
```

**Kelebihan YAML**: minim tanda kurung, list pakai tanda hypen (`-`), string nggak perlu diberi tanda kutip (kecuali kasus tertentu). **Kekurangan**: sensitif banget sama indentasi (spasi vs tab), salah indentasi dikit langsung error, mirip sensitivitasnya sama Python.

Standar umum: pakai **2 spasi** buat indentasi (bukan tab). Ini alasan kenapa CloudFormation template kebanyakan orang lebih milih YAML dibanding JSON, karena lebih gampang dibaca dan ditulis meskipun secara fungsi sama-sama bisa dipake.

## Yang Perlu Diinget

- JSON itu format notasi objek, bukan bahasa pemrograman.
- YAML lebih human-readable dari JSON, tapi sensitif banget sama indentasi.
- Dua-duanya bisa dipake buat CloudFormation template, tapi YAML lebih umum dipake karena lebih gampang dibaca/ditulis.
- Struktur dasar: JSON pakai `{}` dan `[]`, YAML pakai indentasi dan hypen.

## Referensi Resmi

- [Working with AWS CloudFormation Templates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-guide.html)
- [Template Anatomy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html)
