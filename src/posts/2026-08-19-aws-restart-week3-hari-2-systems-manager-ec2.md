---
title: "AWS re/Start Week 3 Hari 2: Systems Manager dan EC2 Deep Dive"
description: "Hari kedua minggu ketiga, dari kenalan Systems Manager buat kelola instance tanpa remote manual, sampe bikin EC2 lewat console dan CLI pake pola bastion host."
author: srytmj
date: 2026-08-19 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, systems manager, ec2]
pin: false
math: false
mermaid: false
published: true
---

Hari kedua minggu ketiga, dan materinya lumayan padat, dua topik besar: Systems Manager sama EC2 yang lebih dalam.

Sesi dibuka dulu dengan overview tools administrasi: SDK buat akses AWS programmatic, CloudFormation buat provisioning infrastruktur lewat template, sama OpsWorks buat configuration management pake Chef/Puppet. Detail lengkapnya ada di [halaman khusus IaC](/blog/iac-cloudformation-opsworks).

Abis itu masuk Systems Manager, service yang ternyata udah sering kepake tanpa sadar (session manager, patch manager, run command itu semua bagian dari sini). Instruktur ngejelasin dulu semua capability-nya: inventory buat ngelist software di server tanpa remote satu-satu, dokumen sebagai template automation (mirip playbook di Ansible), run command buat eksekusi dokumen ke banyak server sekaligus, sampe parameter store sebagai pengganti file `.env` versi cloud. Lab-nya praktek langsung install aplikasi custom pake run command, toggle fitur pake parameter store, dan akses instance lewat session manager tanpa SSH sama sekali. Detail lengkapnya di [halaman khusus Systems Manager](/blog/aws-systems-manager).

Lanjut ke EC2, tapi bukan yang basic, lebih ke sisi arsitektur dan operasional: bedanya instance store (temporary, hilang pas restart) sama EBS (persisten), kategori instance type (general purpose, compute optimized, storage optimized, dst), konsep instance profile vs IAM role, sampe metadata vs user data yang sering ketuker padahal beda jauh. Detail konsepnya ada di [halaman khusus EC2 metadata dan best practices](/blog/ec2-instance-metadata-best-practices).

Bagian yang paling nempel buat aku itu soal state EC2 dan billing-nya: instance yang di-stop itu masih kena biaya (dari sisi storage EBS-nya), yang beneran nggak bayar cuma kalau di-terminate. Ada juga konsep hibernation yang mirip sleep di laptop, RAM-nya disimpen biar boot berikutnya jauh lebih cepet. Detail lengkapnya di [halaman khusus EC2 instance states](/blog/ec2-instance-states-lifecycle).

Lab-nya sendiri seru karena bikin 2 instance dengan cara beda: satu lewat console jadi bastion host, satu lagi lewat AWS CLI murni (ambil AMI ID, subnet, security group semua lewat command, nggak ada klik-klik) buat jadi web server. Sempet ketemu masalah juga pas troubleshooting, security group yang belum buka port, sampe service web server yang udah terinstall tapi belum di-start, dan dari situ baru ngerti pola troubleshooting infrastruktur ke aplikasi. Detail lengkap lab-nya di [halaman khusus EC2 bastion host dan CLI](/blog/ec2-creating-instances-bastion-cli).

Sesi ditutup dengan sesi tanya jawab santai plus obrolan soal AWS AI Practitioner. Minggu depan katanya bakal lanjut ke load balancer dan auto scaling.
