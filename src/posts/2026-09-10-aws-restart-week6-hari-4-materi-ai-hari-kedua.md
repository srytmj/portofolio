---
title: "AWS re/Start Week 6 Hari 4: Materi AI Hari Kedua"
description: "Hari kedua materi AI, dari deep dive teknik labeling data, klasifikasi-regresi-clustering, ukuran model vs biaya, vector database dan RAG, sampe framework 4 pertanyaan adopsi AI."
author: srytmj
date: 2026-09-10 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, ai, machine learning]
pin: false
math: false
mermaid: false
published: true
---

Lanjutan materi AI, hari kedua. Kalau kemarin fokus taksonomi dan konsep dasar, hari ini lebih dalam ke teknik dan hitung-hitungannya.

Dibuka materi [data labeling dan object detection](/blog/data-labeling-object-detection-image-segmentation): teknik hierarki folder vs data annotation (bounding box, LabelImg, alur XML ke CSV), pentingnya komposisi data seimbang, sampai cerita skripsi instruktur 2019 soal deteksi masker (akurasi 99% vs 88%, gara-gara variasi warna kulit).

Lanjut [deep dive klasifikasi, regresi, clustering, dan reinforcement learning](/blog/klasifikasi-regresi-clustering-reinforcement-learning): binary vs multi-class classification, beda estimasi dan prediksi di regresi, clustering dan anomaly detection buat deteksi fraud, sampai kenapa autopilot mobil susah diterapin optimal di jalanan Indonesia.

Materi [ukuran model vs kepintaran AI](/blog/ukuran-model-vs-kepintaran-ai-spesialisasi): kenapa model gede itu knowledge-nya lebih luas tapi belum tentu lebih pintar di tugas spesifik, perbandingan biaya model besar vs kecil, stack layanan AI AWS (SageMaker, Bedrock, Trainium, Inferentia), dan pola arsitektur LLM Supervisor.

Materi [vector database dan RAG](/blog/vector-database-rag-embedding): kenapa AI cuma bisa baca angka, proses tokenization dan embedding, spesialisasi tiap vector database, cara kerja RAG (retrieval-augmentation-generation), sampai studi kasus chatbot FAQ bank.

Ditutup materi [framework 4 pertanyaan sebelum adopsi AI](/blog/framework-4-pertanyaan-adopsi-ai-perusahaan): urutan cost, objective, SDM, baru privacy, yang nentuin pakai AI lokal atau frontier model.

## Catatan Sampingan

- Instruktur cerita ulang detail proses training skripsinya tahun 2019: laptop tanpa VGA, training non-stop 2 minggu tanpa checkpoint (kalau mati lampu atau error, harus ulang dari nol). Sekarang ada mekanisme checkpoint (CKPT) yang bikin proses training bisa dilanjut dari titik terakhir kalau ada gangguan.
- Tips laptop buat kerja AI: cari yang ada NPU (Neural Processing Unit), katanya bisa beda performa sampai 40% dibanding cuma pakai CPU biasa, karena laptop gaming punya keterbatasan cooling buat VGA dibanding PC desktop.
- Cerita soal kenapa instruktur akhirnya jadi pengajar meski cuma lulusan kampus swasta kecil ("kampus ruko"): sempat jadi narasumber buat dosen-dosen di Binus soal fine-tuning, dan filosofinya "belajar di jalan itu pelajaran paling mahal", bukan cuma dari bangku kuliah.
- Peringatan soal risiko voice cloning: suara bisa dikloning dan disalahgunakan buat penipuan, apalagi kalau menyerupai suara customer service bank, jadi tetap harus cross-check kalau nerima telepon mengatasnamakan pihak resmi.
