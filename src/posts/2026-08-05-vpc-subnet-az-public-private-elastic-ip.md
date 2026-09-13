---
title: "VPC, Subnet, AZ, dan Kenapa IP Public Bisa Berubah-Ubah"
description: "Struktur hierarki VPC-Subnet-AZ di AWS, plus lab investigasi kenapa IP public instance berubah pas di-stop tapi tetap sama pas di-reboot, dan gimana Elastic IP jadi solusinya."
author: srytmj
date: 2026-08-05 00:00:00 +0700
categories: [AWS re/Start, Labs]
tags: [aws, vpc, networking, ip address, labs]
pin: false
math: false
mermaid: true
published: true
---

Dua lab hari ini sama-sama muter di soal IP dan struktur jaringan AWS, dan ternyata dua-duanya saling nyambung.

## Hierarki: Region, VPC, AZ, Subnet

VPC itu analoginya kayak "data center milik sendiri" di dalam satu region, privat dan terisolasi dari VPC orang lain secara default.

```mermaid
flowchart TD
    Region["Region"] --> AZ1["Availability Zone A"]
    Region --> AZ2["Availability Zone B"]
    Region --> VPC["VPC<br/>(scope: region, bisa span banyak AZ)"]
    VPC --> S1["Subnet<br/>(scope: 1 AZ doang)"]
    VPC --> S2["Subnet<br/>(scope: 1 AZ doang)"]
    S1 --> AZ1
    S2 --> AZ2
```

Aturan pentingnya:
- **VPC** scope-nya region, dan bisa "menjangkau" (span) banyak AZ sekaligus.
- **Subnet** scope-nya cuma **satu AZ**, nggak bisa nyebar ke banyak AZ.
- Satu AZ bisa punya banyak subnet, tapi satu subnet cuma nempel ke satu AZ.

Default per akun: 1 VPC per region, dengan soft limit sampai 5 VPC (bisa nambah lewat request ke AWS Support kalau butuh lebih, dengan tambahan biaya).

## Public vs Private Subnet

- **Public subnet**: didesain buat diakses publik, biasanya isinya web server. Konsekuensinya: siapa aja bisa akses, baik maupun jahat.
- **Private subnet**: cuma bisa diakses dari internal (VPN, instance lain dalam VPC), biasanya isinya app server atau database.

Prinsip pentingnya: **jangan pernah taruh database di public subnet**. Layer paling dalam dari sebuah arsitektur itu biasanya database, kalau database sampai kena breach, itu tanda arsitekturnya bermasalah dari awal.

## Lab: Kenapa Satu Instance Bisa Internetan, Satu Lagi Nggak

Skenario lab: dua instance (A dan B) dengan konfigurasi dan subnet yang sama persis, tapi instance A nggak bisa akses internet sementara B bisa. Setelah diinvestigasi, jawabannya sederhana: **instance A nggak punya IP public**. Apapun yang mau internetan wajib punya IP public, itu aturan dasarnya.

Investigasi lanjutan soal remote SSH juga ngasih insight yang sama: SSH ke instance yang cuma punya IP private itu **bisa**, asalkan dilakukan dari dalam network yang sama (misal dari instance lain yang satu VPC), bukan dari luar. Jadi:

- Mau remote dari luar (internet) ke instance → butuh IP public di instance tujuan.
- Mau remote antar-instance dalam satu network → cukup pakai IP private, nggak perlu IP public sama sekali.

## Reboot vs Stop: Beda Nasib buat IP Public

Ini bagian paling nempel dari lab hari ini:

```mermaid
flowchart LR
    A["Instance running"] -->|"Reboot"| B["IP public TETAP SAMA"]
    A -->|"Stop"| C["IP public HILANG"]
    C -->|"Start lagi"| D["Dapat IP public BARU (beda)"]
```

- **Reboot**: instance-nya cuma "restart aplikasi", metadata dan network interface-nya tetep nyangkut, jadi IP public-nya nggak berubah.
- **Stop lalu Start**: instance-nya bener-bener "dibongkar", pas start lagi dia dapet alokasi IP public baru dari pool AWS, sehingga IP-nya berubah.

Sementara **IP private** itu selalu tetap, nggak peduli reboot atau stop, karena dia nempel ke network interface instance-nya yang tetap ada meskipun instance-nya mati. IP private ini ditentukan lewat mekanisme mirip DHCP reservation, semi-manual (kita tentuin rentang IP-nya, tapi assignment aktualnya otomatis).

## Elastic IP: Solusi buat IP Public yang Permanen

Kalau butuh IP public yang nggak berubah-ubah (misal buat DNS record yang stabil), solusinya pake **Elastic IP**, IP public statis yang bisa "dicolok-lepas" (associate/disassociate) ke instance manapun sesuka hati.

Poin pentingnya:
- Kalau instance yang nempel Elastic IP di-delete, IP-nya **nggak ikut hilang**, cuma "kecabut", dan masih bisa dipasang lagi ke instance lain.
- Elastic IP itu **berbayar**, dan justru dikenain biaya kalau **nggak dipakai** (nggak nempel ke instance manapun), bukan cuma pas dipakai. Ini beda dari IP public dinamis yang gratis.

| | IP Public Dinamis (default) | Elastic IP (statis) |
|---|---|---|
| Berubah saat stop/start? | Ya, dapat IP baru | Tidak, tetap sama |
| Biaya | Gratis | Berbayar, bahkan saat idle nggak dipakai |
| Cocok buat | Instance yang IP-nya nggak krusial dicatat di tempat lain | Server yang butuh IP tetap (DNS, whitelist firewall eksternal, dst) |

## Yang Perlu Diinget

- VPC itu scope-nya region dan bisa span banyak AZ, subnet itu scope-nya cuma satu AZ.
- Jangan pernah taruh database di public subnet, itu prinsip dasar desain arsitektur yang aman.
- SSH ke instance tanpa IP public tetap bisa, asal dilakukan dari dalam network yang sama pakai IP private.
- Reboot instance nggak mengubah IP public, tapi stop-lalu-start pasti dapat IP public baru.
- Elastic IP itu solusi buat IP public permanen, tapi berbayar bahkan saat idle, beda dari IP dinamis default yang gratis.

## Referensi Resmi

- [VPCs and Subnets](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html)
- [Elastic IP Addresses](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html)
