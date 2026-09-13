---
title: "Arsitektur LLM: Transformer, Base vs Instruct vs Reasoning Model, dan Parameter Inference"
description: "Rangkuman materi AI hari ketiga soal arsitektur transformer di balik LLM, bedanya base model, instruct model, dan reasoning model, parameter inference (temperature, top-p), quantization, dan context engineering."
author: srytmj
date: 2026-09-11 00:00:00 +0700
categories: [AWS re/Start, Materi]
tags: [aws, ai, llm, transformer, prompt engineering]
pin: false
math: false
mermaid: true
published: true
---

> Catatan: hasil rekaman kelas hari ini kualitas audionya jelek banget, jadi transkripnya banyak bagian yang nggak jelas atau ke-translate ngaco. Rangkuman ini ditulis dari istilah-istilah dan konsep yang masih bisa dikenali dengan cukup yakin, sebagian sesi (termasuk demo aplikasi AI lokal dan pendaftaran AWS Skill Builder) di-skip karena datanya kurang jelas buat direkonstruksi akurat. Kalau ada yang meleset atau kurang, tolong dikoreksi ya.
{: .prompt-warning }

## Transformer: Arsitektur di Balik LLM

Deep learning punya banyak arsitektur neural network, dan salah satu yang jadi basis LLM (Large Language Model) adalah **transformer**. Kumpulan komponen transformer inilah yang jadi fondasi LLM, yang kemudian jadi salah satu varian dari Generative AI.

## Base Model vs Instruct Model vs Reasoning Model

LLM sendiri punya beberapa "rasa" tergantung gimana dia di-training lebih lanjut setelah pretraining:

- **Base model (foundation model)**: model dasar hasil pretraining, belum di-tuning buat ngikutin instruksi secara natural.
- **Instruct model**: model yang udah di-tuning khusus (instruction tuning) supaya bisa ngikutin instruksi/perintah dengan lebih natural, ini yang biasa dipakai buat chatbot/asisten.
- **Reasoning model**: model yang punya proses "berpikir" (process thinking) sebelum ngasih jawaban akhir, mirip chain-of-thought. Karena ada proses mikir ini, token yang dipakai jadi lebih banyak dibanding model biasa, dan otomatis biayanya lebih mahal (apalagi kalau billing-nya berbasis token/subscription).

## Tokenization, Embedding, dan Similarity

Masih nyambung ke konsep embedding yang udah dibahas sebelumnya: teks dipecah jadi token, lalu di-convert jadi representasi numerik (vector) lewat proses embedding.

Buat nyari kemiripan antar vector, teknik yang dipakai antara lain:

- **Cosine similarity**: ngukur kemiripan berdasarkan sudut antar vector.
- **HNSW (Hierarchical Navigable Small World)**: algoritma indexing yang dipakai vector database buat nyari vector yang paling mirip secara efisien, tanpa harus banding-bandingin ke semua data satu-satu.

## Parameter Inference: Temperature, Top-P, Top-K

Waktu model ngeluarin jawaban, sebenarnya dia lagi milih kata berikutnya berdasarkan **probabilitas**. Contoh analoginya: kalimat "the cat jumped onto the ___", model punya beberapa kandidat kata (couch, sofa, table, dll) dengan probabilitas masing-masing, dan dia milih salah satu berdasarkan parameter yang di-set.

- **Temperature**: ngatur seberapa random/kreatif jawabannya. Temperature rendah = jawaban lebih deterministik dan "aman" (strike forward, pasti pilih yang probabilitasnya paling tinggi). Temperature tinggi = jawaban lebih variatif/kreatif, tapi juga lebih nggak terduga.
- **Top-P / Top-K**: parameter buat mem-filter kandidat kata yang dipertimbangkan sebelum dipilih, biar nggak semua kemungkinan kata (termasuk yang aneh-aneh) ikut dipertimbangkan.

## Tiga Teknik Kustomisasi Output Model

Kalau mau ngerubah/nyesuain output model, ada 3 teknik utama:

| Teknik | Cara Kerja |
|---|---|
| **Prompt engineering** | Ngatur instruksi di prompt/system prompt, nggak ngerubah model sama sekali |
| **RAG (reference data source)** | Nambahin knowledge base eksternal, model tetap sama, nggak di-training ulang |
| **Fine-tuning** | Training tambahan pakai dataset spesifik domain, ngerubah bobot model |

Ketiganya bisa dikombinasikan tergantung kebutuhan, dan masing-masing punya trade-off dari sisi biaya, kompleksitas, dan seberapa dalam perubahan yang dihasilkan.

## Context Engineering: Context Management dan Compacting

Istilah yang muncul lagi: **context engineering**, dan di dalamnya ada beberapa teknik:

- **Context management**: gimana ngatur apa aja yang masuk ke context window supaya tetap relevan.
- **Context compacting / compression**: meringkas percakapan yang udah panjang biar nggak makan terlalu banyak token, tapi informasi pentingnya tetap kepake.
- **Context summarization**: nge-summary riwayat percakapan supaya model tetap "inget" konteks lama tanpa harus nyimpen semua raw text-nya.

## Quantization: Ngecilin Ukuran Model

**Quantization** adalah teknik buat ngecilin ukuran model (dari sisi presisi angka yang dipakai di bobot model), biar model bisa jalan lebih ringan di hardware terbatas. Biasanya ditandain dengan kode ukuran/presisi tertentu di nama file model (semacam varian S, M, L, XL, dan versi terkompresi seperti IQ atau XS). Semakin agresif quantization-nya, semakin kecil dan cepat modelnya, tapi ada trade-off ke kualitas output.

## Keamanan: Prompt Hijacking

Disinggung juga soal risiko keamanan AI, salah satunya **prompt hijacking**, yaitu upaya nyusupin instruksi tersembunyi ke input supaya AI ngelakuin sesuatu di luar instruksi aslinya (system prompt). Ini jadi salah satu concern penting kalau AI di-deploy buat hal-hal yang sensitif.

## Yang Perlu Diinget

- Transformer adalah arsitektur inti di balik LLM.
- Ada 3 jenis model berdasarkan tuning-nya: base/foundation (belum di-tuning), instruct (ngikutin instruksi), reasoning (mikir dulu sebelum jawab, token lebih boros).
- Temperature dan top-p/top-k ngatur seberapa deterministik/kreatif jawaban model.
- 3 teknik kustomisasi output: prompt engineering, RAG, dan fine-tuning, masing-masing beda kedalaman perubahan dan biaya.
- Context engineering mencakup context management, compacting, dan summarization buat ngatur efisiensi token.
- Quantization mengecilkan ukuran model dengan trade-off ke kualitas.
- Prompt hijacking adalah risiko keamanan yang perlu diwaspadai di sistem berbasis AI.

## Referensi Resmi

- [What Are Large Language Models (LLMs)?](https://aws.amazon.com/what-is/large-language-model/)
