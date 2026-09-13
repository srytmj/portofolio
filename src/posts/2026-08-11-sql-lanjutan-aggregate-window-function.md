---
title: "SQL Lanjutan: BETWEEN, LIKE, Aggregate Function, dan Window Function"
description: "Lanjutan materi SQL yang lebih dalam, dari BETWEEN dan LIKE, function agregat kayak SUM/AVG/COUNT, sampai window function RANK OVER PARTITION yang lumayan tricky."
author: srytmj
date: 2026-08-11 00:00:00 +0700
categories: [AWS re/Start, Labs]
tags: [aws, database, mysql, sql, labs]
pin: false
math: false
mermaid: false
published: true
---

Lanjutan dari [materi SQL dasar](/blog/database-ec2-ddl-dml-select), sekarang masuk ke query yang lebih kompleks.

## BETWEEN: Lebih Rapi dan Lebih Cepat

```sql
-- dua kondisi terpisah
SELECT * FROM country WHERE population > 50000000 AND population < 100000000;

-- versi BETWEEN, logic sama, lebih ringkas
SELECT * FROM country WHERE population BETWEEN 50000000 AND 100000000;
```

Dua-duanya ngasih hasil yang sama persis, tapi versi `BETWEEN` query speed-nya lebih cepat. Bedanya kecil banget kalau datanya cuma ratusan baris, tapi kalau datanya jutaan baris, selisih itu mulai berasa. Ini yang disebut **query optimization**, penulisan query yang beda tapi logically sama, bisa punya performa yang beda.

## LIKE dan Wildcard

```sql
SELECT SUM(population) AS europe_population
FROM country WHERE region LIKE '%Europe%';
```

Tanda `%` itu **metakarakter**, artinya "apa aja, sebanyak apapun karakter". Jadi `%Europe%` bakal nangkep semua region yang mengandung kata "Europe" di posisi manapun (`Eastern Europe`, `Western Europe`, dst), bukan cuma yang persis sama.

`LIKE` itu **case-sensitive**, jadi `Europe` beda dengan `europe`. Buat nyamain, biasa dipake `LOWER()` atau `UPPER()`:

```sql
SELECT * FROM country WHERE LOWER(region) LIKE '%central%';
```

Satu catatan penting soal performa: `LIKE` itu lumayan berat buat database, apalagi kalau datanya banyak, karena dia scan teks satu-satu. Kalau butuh pencarian teks yang presisi dan cepat di skala besar, biasanya orang pindah ke tools khusus kayak Elasticsearch yang punya indexing buat full-text search. `LOWER()`/`UPPER()` juga nambah beban dikit, tapi nggak sebesar `LIKE`.

## Aggregate Function

```sql
SELECT SUM(population), AVG(population), MAX(population), MIN(population), COUNT(*)
FROM country;
```

Function ini bawaan SQL (built-in), tinggal pakai. `SUM` buat total, `AVG` buat rata-rata, `MAX`/`MIN` buat nilai tertinggi/terendah, `COUNT` buat jumlah baris. Sering banget dipake di data analysis buat nyari ringkasan cepat dari data mentah.

## SUBSTRING_INDEX dan TRIM

```sql
SELECT SUBSTRING_INDEX(region, ' ', 1) AS region_short FROM country;
```

`SUBSTRING_INDEX` motong string berdasarkan patokan karakter tertentu (di contoh ini, spasi), dan angka di akhir nentuin dari arah mana motongnya, angka positif dari kiri, negatif dari kanan. Misal `Southern and Central Asia` dipotong di spasi pertama dari kiri, hasilnya `Southern` doang.

`TRIM` beda lagi, itu motong berdasarkan jumlah karakter tetap, bukan patokan tanda tertentu. Makanya `TRIM` itu riskan, motongnya "kaku", nggak peduli struktur katanya, kalau nama orang panjangnya beda-beda tapi di-trim rata, bisa kepotong di tengah kata dan hasilnya rusak. Kalau butuh presisi berdasarkan struktur teks (misal motong sampai spasi pertama), `SUBSTRING_INDEX` jauh lebih aman daripada `TRIM`.

## DISTINCT vs GROUP BY vs HAVING

Tiga hal ini gampang ketuker karena sama-sama "ngelompokin" data, tapi tujuannya beda:

- **`DISTINCT`**: buang semua baris duplikat, sisain yang unik doang. Kepake juga di data cleaning buat ngurangin overfitting kalau datanya bakal dipake buat training model AI.
- **`GROUP BY`**: kelompokin baris berdasarkan kolom tertentu, biasa dipasangin sama aggregate function (`SUM`, `COUNT`, dst) buat ngitung per kelompok.
- **`HAVING`**: filter kondisi, tapi khusus buat hasil `GROUP BY`. Beda sama `WHERE` yang filter baris mentah sebelum dikelompokin.

```sql
SELECT region, COUNT(*) FROM country GROUP BY region HAVING COUNT(*) > 5;
```

## Window Function: OVER, PARTITION BY, RANK

Ini bagian yang paling tricky. `SUM() OVER (PARTITION BY ...)` itu beda sama `SUM()` biasa:

```sql
SELECT region, name, population,
  SUM(population) OVER (PARTITION BY region ORDER BY population) AS running_total
FROM country;
```

`SUM` biasa langsung jumlahin semua sekaligus, tapi `SUM OVER PARTITION BY` ngitungnya bertahap, baris demi baris, jadi hasilnya berupa **running total** (akumulasi nilai per baris dalam satu partisi/kelompok), bukan satu angka total doang. Kepake buat liat tren data secara visual, tapi di praktek sehari-hari jarang dipake, karena biasanya lebih efisien langsung pakai `WHERE` kalau cuma butuh filter angka tertentu.

`RANK() OVER (...)` mirip konsepnya, tapi buat nentuin peringkat:

```sql
SELECT name, population, RANK() OVER (ORDER BY population DESC) AS rank
FROM country;
```

Gotcha-nya: kalau ada nilai yang sama persis, mereka dapet rank yang sama, dan rank berikutnya bakal "loncat". Misal ada 2 baris yang sama-sama rank 3, baris setelahnya bukan rank 4, tapi langsung rank 5. Ini normal behavior `RANK`, bukan bug.

## LIMIT

```sql
SELECT * FROM country ORDER BY population DESC LIMIT 3;
```

`LIMIT` buat ngambil sejumlah baris teratas doang, dikombinasi sama `ORDER BY` ini pola yang sering banget muncul di technical test data analyst, "ambil 5 negara dengan populasi terbesar" dan sejenisnya.

## Yang Perlu Diinget

- `BETWEEN` secara logic sama kayak dua kondisi `AND`, tapi performanya lebih baik.
- `LIKE` pakai wildcard `%`, tapi berat buat data besar, hati-hati pemakaiannya.
- `DISTINCT` buang duplikat baris, `GROUP BY` ngelompokin buat aggregate, `HAVING` filter hasil `GROUP BY`.
- Window function (`OVER`, `PARTITION BY`, `RANK`) itu powerful tapi jarang kepake di kerjaan harian, sekadar tau konsepnya aja udah cukup.

## Referensi Resmi

- [MySQL Window Functions](https://dev.mysql.com/doc/refman/8.0/en/window-functions.html)
- [MySQL Aggregate Functions](https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html)
