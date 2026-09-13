---
title: "AWS re/Start Week 2 Hari 3: Aurora Lanjutan dan Kenalan DynamoDB"
description: "Lanjutan Aurora dengan koneksi manual dan konsep ACU, terus lompat ke dunia NoSQL lewat DynamoDB, plus drama troubleshooting koneksi database yang time out."
author: srytmj
date: 2026-08-12 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, aurora, dynamodb, nosql]
pin: false
math: false
mermaid: false
published: true
---

Hari ini masih di dunia database, tapi mulai kelihatan lebih dalam. Sesi pagi lanjutan Aurora, kali ini connect-nya manual pakai MySQL client langsung dari terminal, bukan lewat aplikasi web kayak kemarin. Ada konsep baru juga: Aurora Capacity Unit (ACU) buat mode serverless, sama istilah "cluster" buat nyebut satu kesatuan primary+secondary yang connect ke satu nama yang sama. Detail lengkapnya di [halaman khusus Aurora](/blog/aurora-lanjutan-acu-cluster-troubleshooting).

Abis itu geser total ke topik baru: NoSQL, lewat DynamoDB. Ini kerasa beda banget mindset-nya dari SQL yang udah dipelajarin 3 hari kebelakang. Nggak ada struktur table yang kaku, tiap baris data (di sini disebut "item") bisa punya kolom yang beda-beda. Belajar juga soal partition key, sort key, sampai kenapa `Query` itu jauh lebih murah daripada `Scan` kalau ngomongin biaya. Detail lengkapnya di [halaman khusus DynamoDB](/blog/dynamodb-nosql-dasar).

Yang paling seru hari ini justru pas challenge lab sore, disuruh ngulang bikin Aurora + connect ke web server sendiri, dan beneran ketemu error `timeout` pas connect. Ternyata masalahnya di security group, ada rule outbound yang kehapus. Jadi belajar juga cara runut troubleshooting koneksi database: cek VPC, cek subnet group, cek security group inbound, terus cek outbound-nya juga, jangan cuma fokus ke satu sisi doang.
