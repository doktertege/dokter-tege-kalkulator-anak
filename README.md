# MEDORA | by Dokter Tege

Clinical Intelligence Companion

Prototype Android offline untuk membantu perhitungan dosis pediatrik.

## Fitur
- Antarmuka responsif dan dapat digunakan offline.
- Input berat badan dan usia anak.
- Katalog obat dengan pencarian dan kategori.
- Referensi pencarian 99 kode ICD-10 umum (WHO 2010) dengan filter kategori; daftar ini bukan database lengkap dan kode harus diverifikasi terhadap indeks/tabular serta aturan coding yang berlaku.
- Favorit obat tersimpan lokal di perangkat.
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
- Future medicine catalog data can be added to the same `MEDORA_DATABASE` namespace with its own source, version, formulation, and safety metadata.
