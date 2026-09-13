---
title: "AWS re/Start Week 6 Hari 3: Materi AI Hari Pertama"
description: "Masuk unit AI, hari pertama full teori. Taksonomi AI/ML/deep learning/generative AI, data buat ML, responsible AI dan guardrails, sampe ekonomi deploy AI."
author: srytmj
date: 2026-09-09 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, ai, machine learning]
pin: false
math: false
mermaid: false
published: true
---

Masuk unit terakhir program: AI. Hari pertama full teori, jadi banyak konsep dasar.

Dibuka materi [taksonomi AI, ML, deep learning, dan generative AI](/blog/ai-ml-deep-learning-generative-ai-taksonomi): hierarki AI sebagai payung besar, evolusi nama (statistik → data mining → machine learning), bedanya model biasa vs foundation model, konsep generalisasi ("menghafal beda dari belajar"), 3 metode pembelajaran (supervised/unsupervised/reinforcement), inference, dan knowledge cut-off.

Lanjut [materi data buat ML](/blog/data-buat-machine-learning-gigo-bias-feature-engineering): prinsip GIGO (garbage in garbage out), data bias/imbalanced, feature engineering, breakdown waktu data scientist (50% data prep, 40% R&D, 10% finishing), HPO/HPT, dan gimana ML ngolah data structured/semi/unstructured.

Materi [responsible AI dan guardrails](/blog/responsible-ai-guardrails-prompt-injection): prinsip responsible AI, "no free lunch" (data kita jadi produk), hijack prompting (paste kode ke AI bisa bocorin arsitektur), cara kerja guardrail sebagai filter 2 arah di depan LLM.

Ditutup materi [ekonomi deploy AI](/blog/biaya-deploy-ai-token-billing-spek-infra): kenapa perusahaan gede bikin model sendiri, billing token masuk/keluar, spek infra buat model besar (500 core, 1 TB RAM, VRAM 512 GB), dan alternatif sewa GPU per jam.

## Catatan Sampingan

- Instruktur demo AI lokal (model DeepSeek 1.1 GB dan GPT-OSS 13 GB di laptop RAM 32 GB) buat nunjukin knowledge cut-off dan halusinasi: model kecil nggak bisa jawab "siapa presiden Indonesia saat ini", model 13 GB pun jawab salah karena di-training terakhir 2024.
- Cerita panjang soal dampak AI ke lapangan kerja (radiologi, desain grafis, customer service), dan simulasi "game politikus AI" yang nunjukin AI bisa belajar strategi manipulasi/aliansi.
- Instruktur nyeritain skripsi 2019-nya soal object detection anjing-kucing: 1000+1000 gambar, convert ke XML, training CNN 2 minggu tanpa GPU.
- Materi AI diperkirakan cuma 3-8% dari bobot soal ujian CCP, tapi kalau ambil sertifikasi AI (AIF), materi 5 hari ini udah cover ~60%.
