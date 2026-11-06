# MEDORA | by Dokter Tege

Clinical Intelligence Companion

Prototype Android offline untuk membantu perhitungan dosis pediatrik.

## Fitur
- Antarmuka responsif dan dapat digunakan offline.
- Area **Untuk Umum** menyediakan pencarian, filter kategori, dan halaman detail untuk 11 topik edukasi kesehatan; navigasi klinis disembunyikan saat area umum dibuka.
- Navigasi bawah pada area tenaga medis diarahkan ulang agar Beranda, Cari, Favorit, Riwayat, dan Pengaturan tetap membuka panel yang terlihat dari modul mana pun.
- Input berat badan dan usia anak.
- Katalog obat dengan pencarian dan kategori.
- Referensi pencarian 99 kode ICD-10 umum (WHO 2010) dengan filter kategori; daftar ini bukan database lengkap dan kode harus diverifikasi terhadap indeks/tabular serta aturan coding yang berlaku.
- Favorit obat tersimpan lokal di perangkat.
- Panduan Klinis offline berisi checklist penilaian awal ABCDE, dokumentasi SOAP, dan evaluasi sebelum pulang.
- Modul IGD & Emergency menyediakan checklist respons awal, serah terima SBAR, dan dokumentasi rujukan; bukan pengganti protokol resusitasi resmi.
- Asisten Klinis Offline menyusun catatan SOAP dari input pengguna; tidak menjalankan model AI, tidak membuat diagnosis, dan tidak mengirim data ke server.
- Referensi Medis menyediakan pintasan ke sumber resmi; membuka tautan membutuhkan koneksi internet.
- Pengaturan mendukung backup/pemulihan favorit dan riwayat kalkulasi lokal, serta penghapusan data lokal.
- Kalkulator dosis yang saat ini diaktifkan secara terbatas untuk paracetamol, ibuprofen, cetirizine, ambroxol pada rentang usia yang ditentukan, zinc sebagai terapi tambahan diare, serta amoxicillin, cefadroxil, cefixime oral, dan salbutamol nebulisasi dengan pemilihan regimen, konsentrasi sediaan, dan batas usia/berat badan.
- Obat lain tetap berstatus belum aktif sampai regimen, sediaan, batas dosis, kontraindikasi, dan referensinya diverifikasi.

## Build APK
Buka tab **Actions** lalu jalankan workflow **Build Android APK**. Setelah selesai, unduh artifact `MEDORA-Android-APK` (nama artifact build saat ini).

## Status keselamatan
Aplikasi ini merupakan alat bantu hitung, bukan pengganti penilaian klinis atau pedoman terapi. Selalu periksa indikasi, usia, berat badan, rute, konsentrasi produk yang benar, dosis maksimal, alergi, fungsi organ, kontraindikasi, interaksi, serta dosis yang telah diberikan. Jangan gunakan regimen obat yang masih berstatus belum aktif. Untuk amoxicillin, kalkulasi hanya tersedia pada usia ≥3 bulan dan BB <20 kg; pilihan regimen harus sesuai diagnosis, dan gangguan ginjal/alergi penisilin memerlukan evaluasi khusus. Untuk cefixime, kalkulasi dibatasi pada usia 6 bulan hingga kurang dari 12 tahun, dosis 8 mg/kgBB/hari (maksimum 400 mg/hari), dan gangguan ginjal memerlukan penyesuaian khusus. Salbutamol nebulisasi hanya dihitung mulai usia 1 tahun untuk bronkospasme/eksaserbasi asma yang dinilai klinis; bukan terapi rutin batuk atau bronkiolitis. Untuk cefadroxil, kalkulasi yang tersedia dibatasi pada regimen tonsilitis bakterial terpilih: usia ≥6 bulan dan BB <20 kg, 30 mg/kgBB sekali sehari selama 10 hari (maksimum 1.000 mg/dosis); gangguan ginjal dan alergi beta-laktam memerlukan evaluasi klinis, dan penyesuaian ginjal tidak dihitung otomatis. Validasi klinis dan uji kasus sebelum penggunaan rutin di fasilitas pelayanan kesehatan.

Aplikasi tidak memerlukan koneksi internet untuk fitur lokal. Favorit disimpan di penyimpanan lokal aplikasi.


## Offline reference database

- Curated ICD-10 quick-reference data is stored in `app/src/main/assets/database.js`, separate from the interface code.
- The database is loaded locally by the Android WebView; no network request is needed at runtime.
- Current ICD-10 metadata identifies WHO ICD-10 version 2010. The 99-entry list is a curated subset, not the complete WHO tabular list or alphabetic index.
- The 32-item medication catalog is also stored in `database.js`; product labels and status are separated from dosing algorithms.
- Sixteen structured medicine profiles document active ingredients, dosage forms, routes, product-specific formulation caveats, prescription status, and key safety warnings.
- The structured profile set includes paracetamol, ibuprofen, cetirizine, amoxicillin, and cefixime with BPOM-linked or manufacturer-linked Indonesian formulation examples. Cetirizine references include syrup 5 mg/5 mL and drops 10 mg/mL; amoxicillin references include dry syrup 125 mg/5 mL and 250 mg/5 mL. These are examples, not universal concentrations; confirm the actual product label before converting mg to mL.
- Cetirizine's OTC classification is pack- and formulation-dependent under the cited regulation. Amoxicillin prescription classification is linked to Kemenkes guidance; product-specific warning fields remain pending. Cefixime formulation and warnings are linked to the BPOM-approved Cefspan information, whose age and reconstitution instructions must not be generalized to other brands.
- The clinical dashboard's Database Obat module now provides offline search, category filters, and a detail view for all 32 catalog entries; structured profiles show ingredients, forms, routes, formulation notes, safety warnings, and whether a dose-engine function exists.
- Every catalog item now has an explicit coverage state: 16 structured profiles, 15 products pending product-specific profile review, and 1 excluded product (Domperidone). The UI and static validator enforce this map so a catalog entry cannot be mistaken for a fully reviewed medicine profile.
- Products without validated dose logic are explicitly labelled as reference-only; topical eye/ear products and excluded medicines are not presented as dose-calculator options.
- The profiles do not invent pediatric regimens; injectable products require vial/reconstitution checks, oral rehydration sachets require exact label dilution, and eye/ear steroid-antibiotic products have no pediatric dose calculator.
- Medicine profile fields now carry individual provenance status and source references. The detail view distinguishes fields linked to a reference from fields still pending product-specific verification; a source link does not imply every field in a profile is verified.
- The currently linked product references cover Cendo Xitrol eye drops/ointment and general oralit preparation guidance. CTM, injectable antibiotics, and Erlamycetin details remain explicitly pending product-specific verification until the exact local registration/leaflet is matched.
- Always verify the actual locally stocked pack, registration number, concentration, and current package insert before prescribing.
- Requested products are retained: CTM, oralit, ceftriaxone, cefotaxime, gentamicin, Cendo Xitrol eye drops/ointment, and Erlamycetin eye/ear products.
- Domperidone remains explicitly excluded from pediatric dose calculation because of QT/arrhythmia risk.
- Dose calculations and indication-specific instructions remain in their dedicated logic/guidance; moving the product index did not change medication regimens.
