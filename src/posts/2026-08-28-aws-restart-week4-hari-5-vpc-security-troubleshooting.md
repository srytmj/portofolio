---
title: "AWS re/Start Week 4 Hari 5: Security VPC Berlapis dan Lab Troubleshooting"
description: "Materi keamanan VPC berlapis dan bastion host, ditutup lab troubleshooting VPC pakai flow logs, nmap, sampe nyari entry NACL yang nge-block traffic."
author: srytmj
date: 2026-08-28 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, vpc, security, troubleshooting]
pin: false
math: false
mermaid: false
published: true
---

Lanjutan langsung dari [materi VPC kemarin](/blog/aws-restart-week4-hari-4-database-vpc). Dibahas [security VPC yang berlapis](/blog/vpc-security-layered-defense-bastion): route table, network ACL, security group, sampe firewall di level OS, plus pola security group yang proper buat bastion host (di-chain by security group ID, bukan IP range).

Lab hari ini: [troubleshooting VPC](/blog/troubleshooting-vpc-flow-logs), kasusnya website café nggak bisa diakses dan nggak bisa di-SSH abis ada perubahan konfigurasi VPC. Diagnosanya berlapis, nmap dulu buat ngecek port yang kebuka, ternyata route table subnet publiknya nggak punya rute ke internet gateway. Setelah itu dibenerin, SSH masih gagal, ternyata ada entry network ACL yang nge-block. Ditutup analisa VPC Flow Logs buat ngonfirmasi berapa kali percobaan koneksi yang gagal selama proses debug tadi.

## Catatan Sampingan

Materi hari ini nekenin urutan diagnosa yang penting: kalau instance status dan security group udah kekonfirmasi bener tapi masalah masih ada, jangan lupa cek layer yang lebih jarang dicurigai, route table dan network ACL.
