/* MEDORA offline module workspace. Loaded after the main application script. */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const pages = {
    patient: {
      title: "Patient Workspace",
      subtitle: "Ruang kerja kunjungan untuk menyusun ringkasan pasien, tanda vital, SOAP, dan rencana tindak lanjut dalam satu layar.",
      html: '<div class="patientWorkspace"><div class="patientWorkspaceIntro"><span class="workspaceEyebrow">CLINICAL ENCOUNTER</span><h3>Ringkasan kunjungan</h3><p>Isi data seperlunya. Gunakan inisial atau kode internal, bukan identitas langsung pasien.</p></div><div class="patientFormGrid"><div class="patientField"><label for="pwCode">Kode / inisial pasien</label><input id="pwCode" maxlength="32" placeholder="Contoh: PX-001"></div><div class="patientField"><label for="pwAge">Usia</label><input id="pwAge" maxlength="32" placeholder="Contoh: 45 tahun"></div><div class="patientField"><label for="pwSex">Jenis kelamin</label><select id="pwSex"><option value="">Pilih</option><option>Laki-laki</option><option>Perempuan</option></select></div><div class="patientField"><label for="pwVisit">Jenis kunjungan</label><select id="pwVisit"><option>IGD</option><option>Rawat jalan</option><option>Rawat inap</option><option>Kontrol</option></select></div></div><div class="patientSectionHead"><span>01</span><div><b>Tanda vital</b><small>Catat angka, satuan, dan waktu pengukuran sesuai kebutuhan.</small></div></div><div class="patientVitalsGrid"><div class="patientField"><label for="pwBp">Tekanan darah</label><input id="pwBp" placeholder="120/80 mmHg"></div><div class="patientField"><label for="pwHr">Nadi</label><input id="pwHr" placeholder="x/menit"></div><div class="patientField"><label for="pwRr">Frekuensi napas</label><input id="pwRr" placeholder="x/menit"></div><div class="patientField"><label for="pwTemp">Suhu</label><input id="pwTemp" placeholder="°C"></div><div class="patientField"><label for="pwSpo2">SpO₂</label><input id="pwSpo2" placeholder="%"></div><div class="patientField"><label for="pwWeight">Berat badan</label><input id="pwWeight" placeholder="kg"></div></div><div class="patientSectionHead"><span>02</span><div><b>Catatan klinis SOAP</b><small>Susun temuan dan keputusan klinis secara terstruktur.</small></div></div><div class="patientClinicalFields"><div class="patientField"><label for="pwSubjective">S · Subjektif</label><textarea id="pwSubjective" placeholder="Keluhan utama, onset, perjalanan penyakit, riwayat relevan..."></textarea></div><div class="patientField"><label for="pwObjective">O · Objektif</label><textarea id="pwObjective" placeholder="Pemeriksaan fisik, temuan penunjang, dan kondisi umum..."></textarea></div><div class="patientField"><label for="pwAssessment">A · Asesmen</label><textarea id="pwAssessment" placeholder="Diagnosis kerja, masalah aktif, dan diagnosis banding..."></textarea></div><div class="patientField"><label for="pwPlan">P · Rencana</label><textarea id="pwPlan" placeholder="Pemeriksaan, terapi, monitoring, edukasi, disposisi..."></textarea></div></div><div class="patientWorkspaceActions"><button type="button" class="active" id="pwGenerate">Buat ringkasan kunjungan</button><button type="button" id="pwClear">Bersihkan formulir</button></div><div class="patientSummaryPanel"><div class="patientSummaryTop"><div><span class="workspaceEyebrow">MEDORA NOTE</span><h3>Hasil dokumentasi</h3></div><span class="patientDraftTag">DRAF</span></div><pre id="pwOutput" aria-live="polite">Ringkasan kunjungan akan muncul di sini.</pre><div class="patientWorkspaceActions"><button type="button" id="pwCopy">Salin ringkasan</button></div><p id="pwStatus" class="medicalHint" aria-live="polite">Data hanya diproses di sesi ini dan tidak disimpan oleh Patient Workspace.</p></div><p class="notice">Patient Workspace adalah alat bantu penyusunan catatan, bukan rekam medis elektronik resmi. Verifikasi semua data, diagnosis, dosis, dan rencana sebelum dipindahkan ke sistem rekam medis fasilitas. Hindari identitas langsung pasien.</p></div>'
    },
    shiftboard: {
      title: "Shift Board",
      subtitle: "Papan kendali tugas klinis selama satu shift. Atur prioritas, pantau progres, dan jangan biarkan tindak lanjut tercecer.",
      html: '<div class="shiftBoard"><section class="shiftBoardHero"><div><span class="workspaceEyebrow">SHIFT COMMAND CENTER</span><h3>Fokus pada hal yang harus dituntaskan</h3><p>Catat tugas tanpa identitas pasien. Semua item hanya berada di memori sesi dan otomatis hilang saat aplikasi dimuat ulang.</p></div><div class="shiftBoardStats"><div><strong id="shiftTotal">0</strong><span>Total tugas</span></div><div><strong id="shiftActive">0</strong><span>Berjalan</span></div><div><strong id="shiftDone">0</strong><span>Selesai</span></div></div></section><section class="shiftComposer"><div class="shiftSectionTitle"><span>01</span><div><b>Tambahkan tugas</b><small>Masukkan tindakan atau tindak lanjut yang perlu dikerjakan.</small></div></div><label for="shiftTaskTitle">Nama tugas</label><input id="shiftTaskTitle" maxlength="100" placeholder="Contoh: Evaluasi ulang tanda vital"><div class="shiftComposerGrid"><div><label for="shiftTaskCategory">Kategori</label><select id="shiftTaskCategory"><option value="Monitoring">Monitoring</option><option value="Pemeriksaan">Pemeriksaan</option><option value="Terapi">Terapi</option><option value="Konsultasi">Konsultasi</option><option value="Rujukan">Rujukan</option><option value="Administrasi">Administrasi</option><option value="Lainnya">Lainnya</option></select></div><div><label for="shiftTaskPriority">Prioritas</label><select id="shiftTaskPriority"><option value="Segera">Segera</option><option value="Tinggi">Tinggi</option><option value="Rutin" selected>Rutin</option></select></div></div><button type="button" class="active shiftAddButton" id="shiftTaskAdd">＋ Tambahkan ke shift</button><p id="shiftBoardStatus" class="medicalHint" aria-live="polite">Belum ada tugas. Mulai dengan satu tindak lanjut yang paling penting.</p></section><section class="shiftTaskSection"><div class="shiftSectionTitle"><span>02</span><div><b>Daftar tugas shift</b><small>Pindahkan status saat tugas mulai dikerjakan atau selesai.</small></div><button type="button" id="shiftClearDone" class="shiftClearButton">Bersihkan selesai</button></div><div id="shiftTaskList" class="shiftTaskList"><div class="shiftBoardEmpty"><span>✦</span><b>Shift masih bersih</b><small>Tugas yang ditambahkan akan muncul di sini.</small></div></div></section><p class="notice">Shift Board bukan rekam medis atau sistem patient tracking. Jangan masukkan nama, nomor rekam medis, tanggal lahir, diagnosis yang dapat mengidentifikasi pasien, atau data sensitif. Pastikan instruksi klinis tetap dikomunikasikan dan didokumentasikan pada sistem resmi.</p></div>'
    },
    handover: {
      title: "Clinical Handover",
      subtitle: "Ruang serah terima pasien dengan format SBAR yang ringkas, terstruktur, dan siap disalin.",
      html: '<div class="handoverWorkspace"><div class="handoverIntro"><span class="workspaceEyebrow">CONTINUITY OF CARE</span><h3>Serah terima yang lebih terstruktur</h3><p>Susun informasi penting agar kondisi pasien, tindakan, dan kebutuhan berikutnya tidak terlewat.</p><div class="handoverFlow"><span>01 Situation</span><i></i><span>02 Background</span><i></i><span>03 Assessment</span><i></i><span>04 Recommendation</span></div></div><div class="handoverFields"><section class="handoverField"><div class="handoverFieldHead"><b><span>01</span> Situation</b><small>Situasi saat ini</small></div><textarea id="sbarSituation" placeholder="Kode/inisial pasien, lokasi, masalah utama, kondisi terkini..."></textarea></section><section class="handoverField"><div class="handoverFieldHead"><b><span>02</span> Background</b><small>Latar belakang relevan</small></div><textarea id="sbarBackground" placeholder="Riwayat singkat, komorbid, alergi, obat, kronologi, dan hasil penting..."></textarea></section><section class="handoverField"><div class="handoverFieldHead"><b><span>03</span> Assessment</b><small>Penilaian klinis</small></div><textarea id="sbarAssessment" placeholder="ABCDE, tanda vital beserta waktu, temuan, tindakan yang sudah dilakukan, dan respons..."></textarea></section><section class="handoverField"><div class="handoverFieldHead"><b><span>04</span> Recommendation</b><small>Rencana berikutnya</small></div><textarea id="sbarRecommendation" placeholder="Tindakan yang perlu dilanjutkan, target monitoring, konsultasi, pemeriksaan, atau rujukan..."></textarea></section></div><div class="handoverActions"><button type="button" class="active" id="sbarGenerate">Susun handover</button><button type="button" id="sbarClear">Bersihkan</button></div><div class="handoverOutputPanel"><div class="patientSummaryTop"><div><span class="workspaceEyebrow">MEDORA HANDOVER</span><h3>Ringkasan serah terima</h3></div><span class="patientDraftTag">DRAF</span></div><pre id="sbarOutput" aria-live="polite">Ringkasan SBAR akan muncul di sini.</pre><div class="handoverActions"><button type="button" id="sbarCopy">Salin ringkasan</button></div><p id="sbarStatus" class="medicalHint" aria-live="polite">Data hanya diproses di sesi ini dan tidak disimpan oleh fitur ini.</p></div><p class="notice">Gunakan identitas minimum sesuai kebijakan fasilitas. SBAR tidak menggantikan komunikasi langsung, read-back untuk instruksi kritis, atau dokumentasi pada rekam medis resmi. Verifikasi kondisi dan instruksi sebelum serah terima.</p></div>'
    },
    guides: {
      title: "Panduan Klinis",
      subtitle: "Checklist penilaian awal dan dokumentasi klinis offline.",
      html: '<div class="guideCard"><h3>Penilaian awal pasien: ABCDE</h3><ol><li><b>A · Airway:</b> nilai patensi jalan napas, suara tambahan, risiko obstruksi, dan proteksi servikal bila trauma.</li><li><b>B · Breathing:</b> nilai frekuensi dan usaha napas, ekspansi dada, SpO₂, auskultasi, serta kebutuhan dukungan oksigen sesuai kondisi.</li><li><b>C · Circulation:</b> nilai nadi, tekanan darah, perfusi perifer, pengisian kapiler, perdarahan, dan akses vaskular bila diperlukan.</li><li><b>D · Disability:</b> nilai kesadaran (AVPU/GCS), pupil, glukosa darah bila indikasi, dan defisit neurologis fokal.</li><li><b>E · Exposure:</b> periksa seluruh tubuh sesuai indikasi, suhu, ruam, trauma, dan cegah hipotermia.</li></ol><p><b>Prinsip:</b> tangani masalah yang mengancam nyawa saat ditemukan, lakukan penilaian ulang setelah intervensi, dan dokumentasikan waktu serta respons.</p></div><div class="guideCard"><h3>Dokumentasi SOAP</h3><ul><li><b>S:</b> keluhan utama, onset, perjalanan, gejala penyerta, riwayat relevan, obat dan alergi.</li><li><b>O:</b> tanda vital, pemeriksaan fisik, status mental, serta hasil pemeriksaan penunjang.</li><li><b>A:</b> masalah klinis/diagnosis kerja dan diagnosis banding yang relevan.</li><li><b>P:</b> rencana pemeriksaan, terapi, monitoring, edukasi, disposisi, dan safety-netting.</li></ul></div><div class="guideCard"><h3>Evaluasi sebelum pasien dipulangkan</h3><ul><li>Pastikan kondisi stabil dan hasil evaluasi ulang terdokumentasi.</li><li>Pastikan pasien/keluarga memahami diagnosis kerja, obat, cara pakai, dan efek samping penting.</li><li>Berikan tanda bahaya yang mengharuskan kembali segera.</li><li>Tentukan jadwal kontrol dan akses pertolongan bila kondisi memburuk.</li></ul></div><p class="notice">Ini adalah kerangka kerja umum, bukan protokol diagnosis atau terapi spesifik. Gunakan panduan penyakit dan SOP fasilitas yang berlaku.</p>'
    },
    emergency: {
      title: "IGD & Emergency",
      subtitle: "Checklist kesiapan dan serah terima pasien gawat darurat.",
      html: '<div class="guideCard"><h3>Checklist respons awal</h3><p id="emergencyChecklistProgress" class="medicalHint" aria-live="polite">0 dari 7 langkah ditandai.</p><p id="emergencyChecklistStatus" class="medicalHint" aria-live="polite"></p><p class="medicalHint">Checklist hanya berlaku selama sesi menu ini terbuka. Status tidak disimpan dan akan dimulai ulang saat menu dibuka kembali.</p><div class="workspaceActions"><button type="button" id="resetEmergencyChecklist">Reset checklist</button></div><label class="checkRow"><input type="checkbox"> Pastikan keamanan lokasi, gunakan APD sesuai risiko, dan panggil bantuan/tim resusitasi.</label><label class="checkRow"><input type="checkbox"> Lakukan penilaian ABCDE dan tangani ancaman nyawa segera.</label><label class="checkRow"><input type="checkbox"> Monitor tanda vital, SpO₂, irama jantung, kesadaran, dan respons intervensi sesuai kondisi.</label><label class="checkRow"><input type="checkbox"> Periksa glukosa darah pada penurunan kesadaran/kejang atau indikasi klinis.</label><label class="checkRow"><input type="checkbox"> Identifikasi alergi, obat rutin, komorbid, waktu onset, dan riwayat penting.</label><label class="checkRow"><input type="checkbox"> Dokumentasikan intervensi, dosis, rute, waktu pemberian, dan respons.</label><label class="checkRow"><input type="checkbox"> Tentukan kebutuhan konsultasi, rujukan, transportasi, dan pendampingan.</label></div><div class="guideCard"><h3>Serah terima SBAR</h3><p><b>S · Situation:</b> identitas ringkas, lokasi, masalah utama, dan kondisi saat ini.</p><p><b>B · Background:</b> riwayat relevan, komorbid, alergi, obat, dan kronologi.</p><p><b>A · Assessment:</b> temuan ABCDE, tanda vital, pemeriksaan, tindakan, dan respons.</p><p><b>R · Recommendation:</b> kebutuhan tindakan berikut, monitoring, konsultasi, dan tujuan rujukan.</p></div><div class="guideCard"><h3>Dokumentasi rujukan</h3><ul><li>Alasan dan urgensi rujukan.</li><li>Kondisi hemodinamik dan status jalan napas sebelum berangkat.</li><li>Terapi/tindakan beserta waktu dan respons.</li><li>Hasil pemeriksaan yang menyertai.</li><li>Komunikasi dengan fasilitas penerima dan moda transportasi.</li></ul></div><p class="notice">Menu ini tidak menggantikan algoritma resusitasi resmi, SOP IGD, atau instruksi klinis setempat. Tidak ada dosis obat darurat yang ditampilkan pada checklist ini.</p>'
    },
    ai: {
      title: "Asisten Klinis Offline",
      subtitle: "Susun catatan SOAP dari data yang dimasukkan. Data tidak dikirim ke server dan tidak disimpan oleh fitur ini.",
      html: '<div class="guideCard"><h3>Input ringkasan kasus</h3><p id="soapCompleteness" class="medicalHint" aria-live="polite">0 dari 8 bagian klinis terisi.</p><label for="soapAge">Usia</label><input id="soapAge" placeholder="Contoh: 4 tahun 2 bulan"><label for="soapSex">Jenis kelamin</label><select id="soapSex"><option value="">Pilih</option><option>Laki-laki</option><option>Perempuan</option></select><label for="soapComplaint">Keluhan utama</label><textarea id="soapComplaint" placeholder="Keluhan, onset, durasi..."></textarea><label for="soapHistory">Riwayat dan gejala penyerta</label><textarea id="soapHistory" placeholder="Riwayat penyakit, obat, alergi, gejala penyerta..."></textarea><label for="soapVitals">Tanda vital</label><textarea id="soapVitals" placeholder="TD, HR, RR, suhu, SpO₂, BB..."></textarea><label for="soapExam">Pemeriksaan fisik/penunjang</label><textarea id="soapExam" placeholder="Temuan objektif..."></textarea><label for="soapAssessment">Assessment/diagnosis kerja</label><textarea id="soapAssessment" placeholder="Masalah klinis dan diagnosis banding..."></textarea><label for="soapPlan">Plan</label><textarea id="soapPlan" placeholder="Pemeriksaan, terapi, monitoring, edukasi, disposisi..."></textarea><div class="workspaceActions"><button type="button" id="buildSoap" class="active">Buat catatan SOAP</button><button type="button" id="clearSoap">Kosongkan</button></div><div id="soapOutput" class="workspaceOutput">Hasil catatan akan tampil di sini.</div><p id="soapOutputCount" class="medicalHint">0 karakter.</p><div class="workspaceActions"><button type="button" id="copySoap">Salin catatan</button></div><p id="soapStatus" class="medicalHint" aria-live="polite"></p></div><p class="notice">Asisten ini hanya menyusun teks dari input pengguna. Tidak menganalisis diagnosis, tidak memverifikasi dosis, dan tidak menggantikan penilaian dokter. Hindari memasukkan nama lengkap, NIK, alamat, atau identitas langsung pasien.</p>'
    },
    integrated: {
      title: "Kasus Terpadu",
      subtitle: "Kerangka evaluasi kasus lintas kondisi untuk membantu menyusun masalah, prioritas, dan rencana tindak lanjut.",
      html: '<div class="guideCard"><h3>1. Ringkasan kasus</h3><p>Susun kronologi, keluhan utama, onset, faktor risiko, komorbid, obat rutin, alergi, dan konteks sosial yang relevan. Pisahkan data subjektif dari temuan objektif.</p></div><div class="guideCard"><h3>2. Problem representation</h3><p>Ringkas pasien dan masalah utama dalam satu sampai dua kalimat: usia, faktor risiko, pola waktu, sindrom klinis, dan temuan pembeda.</p></div><div class="guideCard"><h3>3. Prioritas klinis</h3><ol><li>Identifikasi ancaman nyawa dan lakukan ABCDE.</li><li>Tentukan masalah aktif dan diagnosis banding yang berbahaya untuk tidak terlewat.</li><li>Pilih pemeriksaan yang menjawab pertanyaan klinis, bukan pemeriksaan rutin tanpa indikasi.</li><li>Nilai respons terapi dan lakukan reassessment.</li></ol></div><div class="guideCard"><h3>4. Rencana terpadu</h3><ul><li>Diagnosis kerja dan diagnosis banding beserta alasan.</li><li>Pemeriksaan lanjutan dan interpretasi hasil.</li><li>Terapi farmakologis/nonfarmakologis serta kontraindikasi.</li><li>Monitoring, edukasi, konsultasi, rujukan, dan safety-netting.</li></ul></div><p class="notice">Alat bantu penalaran, bukan mesin diagnosis. Keputusan akhir berdasarkan pemeriksaan langsung, pedoman, dan kondisi pasien.</p>'
    },
    ultrasound: {
      title: "USG Kandungan",
      subtitle: "Panduan parameter dasar obstetri dan dokumentasi pemeriksaan. Bukan alat interpretasi citra otomatis.",
      html: '<div class="guideCard"><h3>Identitas pemeriksaan</h3><p>Catat indikasi, usia kehamilan berdasarkan HPHT/USG awal, jumlah janin, viabilitas, presentasi, posisi plasenta, dan kualitas visualisasi.</p></div><div class="guideCard"><h3>Biometri janin</h3><ul><li><b>BPD:</b> diameter biparietal, ukur pada bidang aksial kepala yang sesuai.</li><li><b>HC:</b> lingkar kepala, telusuri tepi luar kalvaria sesuai standar.</li><li><b>AC:</b> lingkar abdomen pada bidang potong standar dengan landmark anatomi yang benar.</li><li><b>FL:</b> panjang diafisis femur, hindari memasukkan epifisis.</li><li>Interpretasikan kombinasi parameter terhadap usia kehamilan dan kurva rujukan yang digunakan.</li></ul></div><div class="guideCard"><h3>Cairan ketuban dan plasenta</h3><ul><li>Dokumentasikan metode pengukuran AFI atau single deepest pocket dan nilai numeriknya.</li><li>Catat lokasi plasenta dan hubungannya dengan ostium uteri internum bila relevan.</li><li>Nilai presentasi, denyut jantung janin, dan temuan anatomi sesuai usia kehamilan serta indikasi.</li></ul></div><p class="notice">Interpretasi bergantung usia kehamilan, teknik, kualitas citra, dan kompetensi pemeriksa. Temuan abnormal atau kecurigaan kelainan harus dikonfirmasi sesuai standar layanan fetomaternal.</p>'
    },
    laboratory: {
      title: "Interpretasi Laboratorium",
      subtitle: "Kerangka membaca hasil lab dengan rentang rujukan, konteks klinis, dan tren serial.",
      html: '<div class="guideCard"><h3>Prinsip interpretasi</h3><ol><li>Pastikan identitas sampel, satuan, waktu pengambilan, dan rentang rujukan laboratorium.</li><li>Periksa kualitas sampel dan kemungkinan hemolisis, kontaminasi, atau keterlambatan pemrosesan.</li><li>Bandingkan dengan nilai sebelumnya dan kondisi klinis saat pemeriksaan.</li><li>Nilai pola beberapa parameter, bukan satu angka secara terpisah.</li></ol></div><div class="guideCard"><h3>Kelompok pemeriksaan</h3><ul><li><b>Darah lengkap:</b> Hb, hematokrit, leukosit/diferensial, trombosit, indeks eritrosit.</li><li><b>Fungsi ginjal:</b> kreatinin, ureum, eGFR, elektrolit, urinalisis.</li><li><b>Fungsi hati:</b> AST/ALT, bilirubin, albumin, ALP sesuai indikasi.</li><li><b>Metabolik:</b> glukosa, HbA1c, profil lipid dan elektrolit.</li><li><b>Infeksi/inflamasi:</b> interpretasikan CRP, kultur, antigen/antibodi sesuai waktu penyakit dan probabilitas pretes.</li></ul></div><div class="guideCard"><h3>Hasil kritis</h3><p>Ikuti daftar nilai kritis dan prosedur komunikasi laboratorium fasilitas. Verifikasi hasil, hubungi klinisi penanggung jawab, dokumentasikan waktu dan read-back bila diwajibkan.</p></div><p class="notice">Rentang rujukan berbeda menurut laboratorium, metode, usia, jenis kelamin, dan kehamilan. Modul ini tidak memberikan diagnosis otomatis.</p>'
    },
    records: {
      title: "Rekam Medis Pasien",
      subtitle: "Simpan kunjungan pasien secara lokal, telusuri riwayat, dan buat backup untuk dipulihkan setelah instalasi ulang.",
      html: '<div class="medicalRecords"><section class="recordsHero"><span class="workspaceEyebrow">PATIENT RECORDS</span><h3>Rekam medis dalam satu tempat</h3><p>Setiap kunjungan disimpan sebagai catatan terpisah dan dapat ditelusuri berdasarkan nomor RM atau nama pasien.</p><div class="recordsStats"><div><strong id="rmPatientCount">0</strong><span>Pasien</span></div><div><strong id="rmVisitCount">0</strong><span>Kunjungan</span></div></div></section><section class="recordsPanel"><h3 id="rmFormTitle">Daftarkan pasien / kunjungan baru</h3><input type="hidden" id="rmEditId"><div class="recordsGrid"><div><label for="rmNumber">Nomor rekam medis *</label><input id="rmNumber" maxlength="40" placeholder="Contoh: RM-0001"></div><div><label for="rmName">Nama / inisial pasien *</label><input id="rmName" maxlength="100" placeholder="Nama sesuai kebijakan fasilitas"></div><div><label for="rmBirth">Tanggal lahir</label><input id="rmBirth" type="date"></div><div><label for="rmSex">Jenis kelamin</label><select id="rmSex"><option value="">Pilih</option><option>Laki-laki</option><option>Perempuan</option></select></div><div><label for="rmDate">Tanggal kunjungan *</label><input id="rmDate" type="date"></div><div><label for="rmType">Jenis kunjungan</label><select id="rmType"><option>IGD</option><option>Rawat jalan</option><option>Rawat inap</option><option>Kontrol</option></select></div><div><label for="rmBp">Tekanan darah</label><input id="rmBp" placeholder="120/80 mmHg"></div><div><label for="rmHr">Nadi (x/menit)</label><input id="rmHr" inputmode="numeric"></div><div><label for="rmRr">RR (x/menit)</label><input id="rmRr" inputmode="numeric"></div><div><label for="rmTemp">Suhu (°C)</label><input id="rmTemp" inputmode="decimal"></div><div><label for="rmSpo2">SpO₂ (%)</label><input id="rmSpo2" inputmode="numeric"></div><div><label for="rmWeight">BB (kg)</label><input id="rmWeight" inputmode="decimal"></div></div><label for="rmAllergy">Alergi / reaksi obat</label><textarea id="rmAllergy" rows="2" placeholder="Tuliskan alergi atau tidak diketahui"></textarea><label for="rmSubjective">S · Anamnesis / subjektif</label><textarea id="rmSubjective" rows="3" placeholder="Keluhan utama, RPS, RPD, RPK, obat rutin..."></textarea><label for="rmObjective">O · Pemeriksaan / objektif</label><textarea id="rmObjective" rows="3" placeholder="Keadaan umum, pemeriksaan fisik, penunjang..."></textarea><label for="rmAssessment">A · Diagnosis / asesmen</label><textarea id="rmAssessment" rows="2" placeholder="Diagnosis kerja dan diagnosis banding"></textarea><div class="recordsGrid"><div><label for="rmIcd">Kode ICD-10</label><input id="rmIcd" maxlength="20" placeholder="Contoh: J06.9"></div><div><label for="rmDisposition">Disposisi</label><select id="rmDisposition"><option value="">Pilih</option><option>Pulang</option><option>Rawat inap</option><option>Rujuk</option><option>Observasi</option><option>Kontrol</option></select></div></div><label for="rmPlan">P · Terapi, resep, edukasi, dan rencana</label><textarea id="rmPlan" rows="4" placeholder="Nama obat, dosis, rute, frekuensi, durasi, monitoring, edukasi..."></textarea><div class="recordsActions"><button type="button" class="active" id="rmSave">Simpan kunjungan</button><button type="button" id="rmReset">Kosongkan</button></div><p id="rmStatus" class="medicalHint" aria-live="polite">Kolom bertanda * wajib diisi.</p></section><section class="recordsPanel"><h3>Daftar pasien & riwayat kunjungan</h3><input id="rmSearch" type="search" placeholder="Cari nomor RM atau nama pasien..."><div id="rmList" class="rmList"><p class="medicalHint">Belum ada rekam medis tersimpan.</p></div></section><section class="recordsPanel"><h3>Backup & pemulihan rekam medis</h3><p>Salin seluruh database menjadi teks JSON, lalu simpan sebagai file pribadi di luar MEDORA. Setelah instalasi ulang, tempel backup di bawah dan pulihkan.</p><div class="recordsActions"><button type="button" class="active" id="rmBackup">Buat & salin backup</button></div><textarea id="rmBackupText" rows="5" placeholder="Backup MEDORA akan muncul di sini. Simpan salinannya di tempat aman."></textarea><div class="recordsActions"><button type="button" id="rmRestore">Pulihkan dari backup</button></div><p id="rmBackupStatus" class="medicalHint" aria-live="polite"></p></section><p class="notice"><b>Penting:</b> data tersimpan lokal pada perangkat dan dapat ikut terhapus saat aplikasi di-uninstall atau data aplikasi dibersihkan. Backup wajib disimpan di luar aplikasi dan dipulihkan setelah instalasi ulang. Backup saat ini berupa JSON yang belum dienkripsi: simpan secara privat, jangan kirim melalui chat publik. Gunakan hanya pada perangkat yang dilindungi PIN/biometrik dan sesuai kebijakan fasilitas. Ini belum menggantikan RME resmi fasilitas atau memenuhi seluruh persyaratan interoperabilitas/regulasi.</p></div>'
    },
    anthropometry: {
      title: "IMT & Lingkar Tubuh",
      subtitle: "Rumus antropometri dewasa dan batas interpretasinya.",
      html: '<div class="guideCard"><h3>Indeks Massa Tubuh (IMT)</h3><p>IMT = berat badan (kg) ÷ tinggi badan² (m²). Ukur tinggi tanpa alas kaki dan berat dengan timbangan terkalibrasi.</p><p>Untuk populasi dewasa Asia, risiko metabolik dapat meningkat pada IMT yang lebih rendah dibanding sebagian ambang populasi lain. Gunakan klasifikasi yang berlaku di pedoman nasional dan konteks pasien.</p></div><div class="guideCard"><h3>Lingkar pinggang</h3><p>Ukur pada titik tengah antara tepi bawah iga terakhir dan puncak krista iliaka, setelah ekspirasi normal. Gunakan protokol pengukuran yang konsisten.</p><p>Ambang risiko berbeda menurut jenis kelamin dan populasi. Lingkar pinggang membantu menilai adipositas sentral, bukan diagnosis tunggal.</p></div><div class="guideCard"><h3>Keterbatasan</h3><ul><li>IMT tidak membedakan massa otot dan lemak.</li><li>Interpretasi khusus diperlukan pada anak, kehamilan, lansia, atlet, edema, dan kondisi tertentu.</li><li>Gabungkan dengan riwayat, pemeriksaan klinis, tekanan darah, dan faktor risiko metabolik.</li></ul></div><p class="notice">Gunakan standar antropometri sesuai usia dan populasi. Jangan memakai ambang dewasa untuk anak.</p>'
    },
    vitals: {
      title: "Tanda Vital",
      subtitle: "Panduan pengukuran dan dokumentasi TD, nadi, napas, SpO₂, dan suhu.",
      html: '<div class="guideCard"><h3>Pengukuran yang benar</h3><ul><li><b>Tekanan darah:</b> istirahat beberapa menit, posisi duduk, punggung dan lengan tersangga, manset sesuai lingkar lengan; ulangi bila hasil tidak sesuai kondisi.</li><li><b>Nadi:</b> nilai frekuensi, irama, dan kualitas; hitung lebih lama bila irama tidak teratur.</li><li><b>Frekuensi napas:</b> hitung tanpa mengubah pola napas pasien, catat usaha napas dan penggunaan otot bantu.</li><li><b>SpO₂:</b> pastikan perfusi dan sinyal baik, jari hangat, kurangi artefak gerak; interpretasikan dengan kondisi klinis dan kemungkinan bias alat.</li><li><b>Suhu:</b> catat lokasi dan metode pengukuran karena hasil dapat berbeda.</li></ul></div><div class="guideCard"><h3>Interpretasi dan tren</h3><p>Gunakan rentang sesuai usia. Satu nilai tidak menggantikan evaluasi perfusi, kesadaran, kerja napas, dan kondisi umum. Bandingkan tren dan respons setelah intervensi.</p></div><div class="guideCard"><h3>Dokumentasi</h3><p>Catat angka, satuan, waktu, posisi pasien, alat/metode, pemberian oksigen bila ada, serta konteks pengukuran.</p></div><p class="notice">Ambang kegawatan bergantung usia, kondisi dasar, kehamilan, dan konteks klinis. Gunakan early warning score dan SOP fasilitas bila tersedia.</p>'
    },
    references: {
      title: "Referensi Medis",
      subtitle: "Pintu akses ke sumber pedoman. Membuka tautan memerlukan koneksi internet.",
      html: '<div class="guideCard"><h3>Pedoman dan sumber resmi</h3><label for="referenceSearch">Cari sumber atau organisasi</label><input id="referenceSearch" type="search" placeholder="Contoh: IDAI, ginjal, asma, WHO"><p id="referenceCount" class="medicalHint" aria-live="polite">7 referensi tersedia.</p><a class="sourceLink" href="https://www.who.int/publications">WHO · Publications and guidelines ↗</a><a class="sourceLink" href="https://www.kemkes.go.id/">Kementerian Kesehatan RI ↗</a><a class="sourceLink" href="https://www.idai.or.id/">Ikatan Dokter Anak Indonesia (IDAI) ↗</a><a class="sourceLink" href="https://www.heart.org/">American Heart Association (AHA) ↗</a><a class="sourceLink" href="https://kdigo.org/guidelines/">KDIGO · Clinical Practice Guidelines ↗</a><a class="sourceLink" href="https://ginasthma.org/">GINA · Global Strategy for Asthma Management ↗</a><a class="sourceLink" href="https://www.cdc.gov/">CDC · Clinical and public health guidance ↗</a></div><div class="guideCard"><h3>Catatan penggunaan</h3><ul><li>Periksa tanggal publikasi dan versi terbaru sebelum menerapkan rekomendasi.</li><li>Utamakan pedoman nasional, formularium, dan SOP fasilitas yang berlaku.</li><li>Perhatikan populasi khusus: neonatus, anak, kehamilan, lansia, serta gangguan ginjal/hati.</li><li>Jangan menyamakan ringkasan sumber dengan dokumen lengkap.</li></ul></div>'
    },
    settings: {
      title: "Pengaturan MEDORA",
      subtitle: "Kelola data lokal yang tersimpan pada perangkat ini.",
      html: '<div class="guideCard"><h3>Penyimpanan perangkat</h3><p id="localDataSummary"></p><div class="workspaceActions"><button type="button" id="copyLocalBackup" class="active">Salin backup data</button><button type="button" id="clearLocalHistory">Hapus riwayat</button><button type="button" id="clearLocalFavorites">Hapus favorit</button></div><label for="restoreBackup">Pulihkan backup JSON</label><textarea id="restoreBackup" placeholder="Tempel isi backup MEDORA di sini..."></textarea><div class="workspaceActions"><button type="button" id="restoreLocalBackup">Pulihkan data</button></div><p id="settingsStatus" class="medicalHint" aria-live="polite"></p></div><p class="notice">Backup memuat daftar obat favorit serta riwayat kalkulasi, termasuk nama obat, usia, berat badan, hasil, dan tanggal. Data dapat menjadi informasi kesehatan yang sensitif. Simpan secara pribadi, jangan tempelkan ke layanan publik, dan hapus salinan clipboard bila perangkat digunakan bersama.</p>'
    }
  };

  let shiftTasks = [];
  let nextShiftTaskId = 1;
  function renderShiftTasks() {
    const host = document.getElementById("shiftTaskList");
    if (!host) return;
    const total = shiftTasks.length;
    const active = shiftTasks.filter(task => task.status === "progress").length;
    const done = shiftTasks.filter(task => task.status === "done").length;
    const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = String(value); };
    set("shiftTotal", total); set("shiftActive", active); set("shiftDone", done);
    host.replaceChildren();
    if (!total) {
      const empty = document.createElement("div");
      empty.className = "shiftBoardEmpty";
      const symbol = document.createElement("span"); symbol.textContent = "✦";
      const title = document.createElement("b"); title.textContent = "Shift masih bersih";
      const hint = document.createElement("small"); hint.textContent = "Tugas yang ditambahkan akan muncul di sini.";
      empty.append(symbol, title, hint); host.appendChild(empty); return;
    }
    const labels = { todo: "Menunggu", progress: "Dikerjakan", done: "Selesai" };
    shiftTasks.forEach(task => {
      const card = document.createElement("article"); card.className = "shiftTaskCard status-" + task.status;
      const top = document.createElement("div"); top.className = "shiftTaskTop";
      const category = document.createElement("span"); category.className = "shiftTaskCategory"; category.textContent = task.category;
      const priority = document.createElement("span"); priority.className = "shiftTaskPriority priority-" + task.priority.toLowerCase(); priority.textContent = task.priority;
      top.append(category, priority);
      const title = document.createElement("h4"); title.textContent = task.title;
      const footer = document.createElement("div"); footer.className = "shiftTaskFooter";
      const status = document.createElement("span"); status.className = "shiftTaskStatus"; status.textContent = labels[task.status];
      const actions = document.createElement("div"); actions.className = "shiftTaskActions";
      const advance = document.createElement("button"); advance.type = "button"; advance.dataset.shiftAction = "advance"; advance.dataset.shiftId = String(task.id);
      advance.textContent = task.status === "todo" ? "Mulai" : task.status === "progress" ? "Selesaikan" : "Buka lagi";
      const remove = document.createElement("button"); remove.type = "button"; remove.dataset.shiftAction = "remove"; remove.dataset.shiftId = String(task.id); remove.setAttribute("aria-label", "Hapus tugas"); remove.textContent = "×";
      actions.append(advance, remove); footer.append(status, actions); card.append(top, title, footer); host.appendChild(card);
    });
  }

  const patientRecordsKey = "medora_patient_records_v1";
  function readPatientRecords() {
    try { const data = JSON.parse(localStorage.getItem(patientRecordsKey) || "[]"); return Array.isArray(data) ? data.filter(item => item && typeof item.id === "string" && typeof item.mrn === "string" && typeof item.name === "string") : []; }
    catch (error) { return []; }
  }
  let patientRecords = readPatientRecords();
  function persistPatientRecords(next) {
    try { localStorage.setItem(patientRecordsKey, JSON.stringify(next)); patientRecords = next; return true; }
    catch (error) { return false; }
  }
  function rmEscape(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }
  function renderPatientRecords(query) {
    const host = document.getElementById("rmList"); if (!host) return;
    const patients = new Map();
    patientRecords.forEach(item => { const key = item.mrn.toLocaleLowerCase("id"); if (!patients.has(key)) patients.set(key, {mrn:item.mrn,name:item.name,visits:[]}); patients.get(key).visits.push(item); });
    const term = String(query || "").trim().toLocaleLowerCase("id");
    const rows = [...patients.values()].filter(p => !term || (p.mrn+" "+p.name).toLocaleLowerCase("id").includes(term));
    const patientCount = document.getElementById("rmPatientCount"), visitCount = document.getElementById("rmVisitCount");
    if (patientCount) patientCount.textContent = String(patients.size);
    if (visitCount) visitCount.textContent = String(patientRecords.length);
    if (!rows.length) { host.innerHTML = '<p class="medicalHint">'+(term ? "Tidak ada pasien yang cocok." : "Belum ada rekam medis tersimpan.")+'</p>'; return; }
    host.innerHTML = rows.map(p => '<article class="rmPatientCard"><div class="rmPatientHead"><div><b>'+rmEscape(p.name)+'</b><small>No. RM: '+rmEscape(p.mrn)+'</small></div><span>'+p.visits.length+' kunjungan</span></div>'+p.visits.sort((a,b)=>String(b.date).localeCompare(String(a.date))).map(v => '<div class="rmVisitRow"><div><b>'+rmEscape(v.date)+' · '+rmEscape(v.type || "Kunjungan")+'</b><small>'+rmEscape(v.assessment || "Belum ada asesmen")+'</small></div><div class="rmVisitActions"><button type="button" data-rm-action="view" data-rm-id="'+rmEscape(v.id)+'">Lihat</button><button type="button" data-rm-action="edit" data-rm-id="'+rmEscape(v.id)+'">Edit</button><button type="button" data-rm-action="delete" data-rm-id="'+rmEscape(v.id)+'">Hapus</button></div></div>').join("")+'</article>').join("");
  }
  const rmFields = ["rmNumber","rmName","rmBirth","rmSex","rmDate","rmType","rmBp","rmHr","rmRr","rmTemp","rmSpo2","rmWeight","rmAllergy","rmSubjective","rmObjective","rmAssessment","rmIcd","rmDisposition","rmPlan"];
  function clearRmForm() {
    rmFields.forEach(id => { const el=document.getElementById(id); if(el) el.value = id==="rmDate" ? new Date().toISOString().slice(0,10) : ""; });
    const edit=document.getElementById("rmEditId"); if(edit) edit.value="";
    const title=document.getElementById("rmFormTitle"); if(title) title.textContent="Daftarkan pasien / kunjungan baru";
    const save=document.getElementById("rmSave"); if(save) save.textContent="Simpan kunjungan";
  }
  function fillRmForm(record) {
    const map={rmNumber:"mrn",rmName:"name",rmBirth:"birth",rmSex:"sex",rmDate:"date",rmType:"type",rmBp:"bp",rmHr:"hr",rmRr:"rr",rmTemp:"temp",rmSpo2:"spo2",rmWeight:"weight",rmAllergy:"allergy",rmSubjective:"subjective",rmObjective:"objective",rmAssessment:"assessment",rmIcd:"icd",rmDisposition:"disposition",rmPlan:"plan"};
    Object.keys(map).forEach(id=>{const el=document.getElementById(id);if(el)el.value=record[map[id]]||"";});
    document.getElementById("rmEditId").value=record.id;
    document.getElementById("rmFormTitle").textContent="Edit kunjungan · "+record.mrn;
    document.getElementById("rmSave").textContent="Simpan perubahan";
    document.getElementById("rmFormTitle").scrollIntoView({behavior:"smooth",block:"start"});
  }
  function validPatientRecord(item) {
    return item && typeof item.id==="string" && typeof item.mrn==="string" && item.mrn.length<=40 && typeof item.name==="string" && item.name.length<=100 &&
      ["birth","sex","date","type","bp","hr","rr","temp","spo2","weight","allergy","subjective","objective","assessment","icd","disposition","plan"].every(k=>typeof (item[k]||"")==="string" && String(item[k]||"").length<=5000);
  }
  function renderPatientRecordDetail(item) {
    const labels=[["Nomor RM","mrn"],["Nama","name"],["Tanggal lahir","birth"],["Jenis kelamin","sex"],["Tanggal kunjungan","date"],["Jenis kunjungan","type"],["Tekanan darah","bp"],["Nadi","hr"],["RR","rr"],["Suhu","temp"],["SpO₂","spo2"],["Berat badan","weight"],["Alergi","allergy"],["S · Anamnesis","subjective"],["O · Pemeriksaan","objective"],["A · Diagnosis","assessment"],["ICD-10","icd"],["Disposisi","disposition"],["P · Terapi & rencana","plan"]];
    const text=labels.map(([label,key])=>label+": "+(item[key]||"-")).join("\n");
    const status=document.getElementById("rmStatus");
    if(status)status.textContent=text;
    const panel=document.getElementById("rmFormTitle"); if(panel)panel.textContent="Detail kunjungan · "+item.mrn;
  }
  function updateLocalDataSummary() {
    const el = document.getElementById("localDataSummary");
    if (el) el.textContent = favorites.size + " obat favorit dan " + doseHistory.length + " catatan riwayat tersimpan di perangkat ini.";
  }

  function showWorkspace(key) {
    const page = pages[key];
    if (!page) return;
    document.body.classList.remove("home-mode", "medical-mode", "icd-mode", "medicine-database-mode", "public-mode");
    document.body.classList.add("module-workspace-mode");
    const clinicalDashboard = document.getElementById("clinicalDashboard");
    const publicDashboard = document.getElementById("publicDashboard");
    const modeChooser = document.getElementById("modeChooser");
    if (clinicalDashboard) clinicalDashboard.style.display = "none";
    if (publicDashboard) publicDashboard.style.display = "none";
    if (modeChooser) modeChooser.style.display = "none";
    document.getElementById("moduleTitle").textContent = page.title;
    document.getElementById("moduleSubtitle").textContent = page.subtitle;
    document.getElementById("moduleWorkspaceContent").innerHTML = page.html;
    setNavActive(key === "settings" ? "navSettings" : "navHome");
    window.scrollTo(0, 0);
    if (key === "settings") updateLocalDataSummary();
    if (key === "records") { patientRecords = readPatientRecords(); clearRmForm(); renderPatientRecords(); }
    if (key === "emergency") { resetEmergencyChecklistForNewSession(); updateEmergencyChecklistProgress(); }
    if (key === "ai") updateSoapCompleteness();
  }

  function updateEmergencyChecklistProgress() {
    const inputs = document.querySelectorAll("#moduleWorkspaceContent .checkRow input[type=checkbox]");
    const done = Array.from(inputs).filter(input => input.checked).length;
    const progress = document.getElementById("emergencyChecklistProgress");
    if (progress) progress.textContent = done + " dari " + inputs.length + " langkah ditandai (" + Math.round(done / Math.max(inputs.length, 1) * 100) + "%).";
  }

  const emergencyChecklistKey = "medora_emergency_checklist_v1";
  function resetEmergencyChecklistForNewSession() {
    // Never carry completed actions into a later patient encounter.
    document.querySelectorAll("#moduleWorkspaceContent .checkRow input[type=checkbox]").forEach(input => {
      input.checked = false;
    });
    try { localStorage.removeItem(emergencyChecklistKey); } catch (error) { /* Session still starts unchecked. */ }
    const status = document.getElementById("emergencyChecklistStatus");
    if (status) status.textContent = "Checklist dimulai dari awal setiap kali menu dibuka. Status tidak dibawa ke sesi berikutnya.";
  }
  function updateSoapCompleteness() {
    const ids = ["soapComplaint", "soapHistory", "soapVitals", "soapExam", "soapAssessment", "soapPlan", "soapAge", "soapSex"];
    const filled = ids.filter(id => { const el = document.getElementById(id); return el && el.value.trim(); }).length;
    const status = document.getElementById("soapCompleteness");
    if (status) status.textContent = filled + " dari " + ids.length + " bagian terisi. Lengkapi sesuai kebutuhan klinis.";
    const output = document.getElementById("soapOutput");
    const count = document.getElementById("soapOutputCount");
    if (output && count) count.textContent = output.textContent.length + " karakter.";
  }

  function buildSoapNote() {
    const $ = id => document.getElementById(id);
    const sections = [
      ["S", "Subjektif", ["soapComplaint", "soapHistory"]],
      ["O", "Objektif", ["soapVitals", "soapExam"]],
      ["A", "Asesmen", ["soapAssessment"]],
      ["P", "Rencana", ["soapPlan"]]
    ];
    const missing = [];
    let out = "CATATAN KLINIS MEDORA\n";
    out += "Usia: " + ($("soapAge").value.trim() || "Belum diisi") + "\nJenis kelamin: " + ($("soapSex").value || "Belum diisi") + "\n\n";
    sections.forEach(([code, label, ids]) => {
      const values = ids.map(id => $(id).value.trim()).filter(Boolean);
      out += code + " - " + label + "\n";
      if (values.length) out += values.join("\n") + "\n";
      else {
        out += "[BELUM DIISI]\n";
        missing.push(label);
      }
      out += "\n";
    });
    $("soapOutput").textContent = out.trim();
    $("soapStatus").textContent = missing.length
      ? "Catatan dibuat, tetapi belum lengkap. Isi: " + missing.join(", ") + ". Periksa kembali seluruh data sebelum digunakan."
      : "Semua bagian SOAP terisi. Periksa kembali kelengkapan dan akurasi sebelum digunakan.";
    updateSoapCompleteness();
  }

  const recentModuleKey = "medora_recent_modules_v1";
  const recentModuleCatalog = {
    patient: "Patient Workspace", shiftboard: "Shift Board", handover: "Clinical Handover", calculator: "Kalkulator dosis", emergency: "IGD & Emergency", icd: "ICD-10",
    drugs: "Database obat", medical: "Kalkulator medis", guides: "Panduan klinis",
    ai: "Asisten klinis", references: "Referensi medis", integrated: "Kasus terpadu",
    ultrasound: "USG kandungan", laboratory: "Interpretasi lab", records: "Rekam medis",
    anthropometry: "IMT & lingkar tubuh", vitals: "Tanda vital"
  };
  function readRecentModules() {
    try {
      const saved = JSON.parse(localStorage.getItem(recentModuleKey) || "[]");
      return Array.isArray(saved) ? saved.filter(key => Object.prototype.hasOwnProperty.call(recentModuleCatalog, key)).slice(0, 4) : [];
    } catch (error) { return []; }
  }
  function renderRecentModules() {
    const host = document.getElementById("recentModuleList");
    if (!host) return;
    const recent = readRecentModules();
    host.innerHTML = recent.length
      ? recent.map(key => '<button type="button" class="recentModuleChip" data-module="' + key + '">' + recentModuleCatalog[key] + ' ↗</button>').join("")
      : '<p class="recentEmpty">Modul yang terakhir digunakan akan muncul di sini.</p>';
  }
  function rememberModule(key) {
    if (!Object.prototype.hasOwnProperty.call(recentModuleCatalog, key)) return;
    try { localStorage.setItem(recentModuleKey, JSON.stringify([key].concat(readRecentModules().filter(item => item !== key)).slice(0, 4))); }
    catch (error) { /* Quick access remains usable when storage is unavailable. */ }
    renderRecentModules();
  }

  const favoriteModuleKey = "medora_favorite_modules_v1";
  function readFavoriteModules() {
    try {
      const saved = JSON.parse(localStorage.getItem(favoriteModuleKey) || "[]");
      return Array.isArray(saved) ? [...new Set(saved.filter(key => Object.prototype.hasOwnProperty.call(recentModuleCatalog, key)))].slice(0, 8) : [];
    } catch (error) { return []; }
  }
  function renderFavoriteModules() {
    const host = document.getElementById("favoriteModuleList");
    const count = document.getElementById("favoriteModuleCount");
    const favorites = readFavoriteModules();
    if (count) count.textContent = favorites.length + " TERSIMPAN";
    if (host) host.innerHTML = favorites.length
      ? favorites.map(key => '<button type="button" class="recentModuleChip" data-module="' + key + '">' + recentModuleCatalog[key] + ' ↗</button>').join("")
      : '<p class="recentEmpty">Tandai modul dengan ikon bintang untuk akses pribadi.</p>';
    document.querySelectorAll(".moduleFavoriteToggle").forEach(toggle => {
      const active = favorites.includes(toggle.dataset.favorite);
      toggle.setAttribute("aria-pressed", String(active));
      toggle.setAttribute("aria-label", (active ? "Hapus dari" : "Tambahkan ke") + " favorit: " + (recentModuleCatalog[toggle.dataset.favorite] || "modul"));
      toggle.textContent = active ? "★" : "☆";
    });
  }
  function toggleFavoriteModule(key) {
    if (!Object.prototype.hasOwnProperty.call(recentModuleCatalog, key)) return;
    const favorites = readFavoriteModules();
    const next = favorites.includes(key) ? favorites.filter(item => item !== key) : [key].concat(favorites).slice(0, 8);
    try { localStorage.setItem(favoriteModuleKey, JSON.stringify(next)); }
    catch (error) { return; }
    renderFavoriteModules();
  }
  function installFavoriteToggles() {
    document.querySelectorAll("#clinicalDashboard .moduleCard[data-module]").forEach(card => {
      if (card.querySelector(".moduleFavoriteToggle")) return;
      const key = card.dataset.module;
      if (!Object.prototype.hasOwnProperty.call(recentModuleCatalog, key)) return;
      const toggle = document.createElement("span");
      toggle.className = "moduleFavoriteToggle";
      toggle.dataset.favorite = key;
      toggle.setAttribute("role", "button");
      toggle.setAttribute("tabindex", "0");
      toggle.setAttribute("aria-pressed", "false");
      toggle.textContent = "☆";
      card.appendChild(toggle);
    });
    renderFavoriteModules();
  }
  renderRecentModules();
  installFavoriteToggles();

  document.getElementById("moduleBack").addEventListener("click", showClinicalHome);
  document.getElementById("homeDashboard").addEventListener("keydown", event => {
    const favoriteToggle = event.target.closest("[data-favorite]");
    if (favoriteToggle && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      event.stopPropagation();
      toggleFavoriteModule(favoriteToggle.dataset.favorite);
    }
  });
  document.getElementById("homeDashboard").addEventListener("click", event => {
    const favoriteToggle = event.target && event.target.dataset && event.target.dataset.favorite ? event.target : null;
    if (favoriteToggle) {
      event.preventDefault();
      event.stopPropagation();
      toggleFavoriteModule(favoriteToggle.dataset.favorite);
      return;
    }
    const button = event.target.closest("[data-module]");
    if (!button) return;
    const key = button.dataset.module;
    rememberModule(key);
    if (key === "calculator") { document.getElementById("patientFields").classList.add("open"); showCalculator(); return; }
    if (key === "medical") { showMedical(); return; }
    if (key === "icd") { showIcd(); return; }
    if (key === "drugs") { showMedicineDatabase(); return; }
    showWorkspace(key);
  });

  document.getElementById("moduleWorkspaceContent").addEventListener("click", async event => {
    const actionButton = typeof event.target.closest === "function" ? event.target.closest("button") : null;
    const id = actionButton ? actionButton.id : event.target.id;
    const $ = value => document.getElementById(value);
    if (id === "shiftTaskAdd") {
      const title = $("shiftTaskTitle");
      const status = $("shiftBoardStatus");
      const value = title ? title.value.trim() : "";
      if (!value) { if (status) status.textContent = "Tulis nama tugas terlebih dahulu."; if (title) title.focus(); return; }
      if (value.length > 100) { if (status) status.textContent = "Nama tugas maksimal 100 karakter."; return; }
      if (shiftTasks.length >= 30) { if (status) status.textContent = "Batas 30 tugas per sesi tercapai. Selesaikan atau hapus tugas lama."; return; }
      shiftTasks.unshift({ id: nextShiftTaskId++, title: value, category: $("shiftTaskCategory").value, priority: $("shiftTaskPriority").value, status: "todo" });
      title.value = ""; renderShiftTasks();
      if (status) status.textContent = "Tugas ditambahkan ke papan shift.";
      return;
    }
    if (id === "shiftClearDone") {
      const before = shiftTasks.length;
      shiftTasks = shiftTasks.filter(task => task.status !== "done");
      renderShiftTasks();
      const status = $("shiftBoardStatus");
      if (status) status.textContent = before === shiftTasks.length ? "Belum ada tugas selesai untuk dibersihkan." : (before - shiftTasks.length) + " tugas selesai dibersihkan.";
      return;
    }
    const shiftAction = event.target && typeof event.target.closest === "function" ? event.target.closest("[data-shift-action]") : null;
    if (shiftAction) {
      const taskId = Number(shiftAction.dataset.shiftId);
      const task = shiftTasks.find(item => item.id === taskId);
      if (!task) return;
      if (shiftAction.dataset.shiftAction === "remove") shiftTasks = shiftTasks.filter(item => item.id !== taskId);
      else task.status = task.status === "todo" ? "progress" : task.status === "progress" ? "done" : "todo";
      renderShiftTasks();
      const status = $("shiftBoardStatus");
      if (status) status.textContent = shiftAction.dataset.shiftAction === "remove" ? "Tugas dihapus dari papan." : "Status tugas diperbarui.";
      return;
    }
    if (id === "sbarGenerate") {
      const sections = [["S", "SITUATION", "sbarSituation"], ["B", "BACKGROUND", "sbarBackground"], ["A", "ASSESSMENT", "sbarAssessment"], ["R", "RECOMMENDATION", "sbarRecommendation"]];
      const missing = [];
      const lines = ["MEDORA · CLINICAL HANDOVER", "FORMAT SBAR", ""];
      sections.forEach(([code, label, field]) => {
        const el = $(field);
        const value = el ? el.value.trim() : "";
        lines.push(code + " · " + label);
        lines.push(value || "[BELUM DIISI]");
        lines.push("");
        if (!value) missing.push(label);
      });
      $("sbarOutput").textContent = lines.join("\n").trim();
      $("sbarStatus").textContent = missing.length ? "Draf dibuat. Bagian belum diisi: " + missing.join(", ") + ". Lengkapi atau tandai secara verbal sebelum serah terima." : "Empat bagian SBAR sudah terisi. Verifikasi informasi dan lakukan komunikasi langsung.";
      return;
    }
    if (id === "sbarClear") {
      ["sbarSituation", "sbarBackground", "sbarAssessment", "sbarRecommendation"].forEach(field => { const el = $(field); if (el) el.value = ""; });
      $("sbarOutput").textContent = "Ringkasan SBAR akan muncul di sini.";
      $("sbarStatus").textContent = "Formulir dibersihkan.";
      return;
    }
    if (id === "sbarCopy") {
      const output = $("sbarOutput").textContent;
      if (!output || output === "Ringkasan SBAR akan muncul di sini.") { $("sbarStatus").textContent = "Susun ringkasan terlebih dahulu."; return; }
      try { await copyTextToClipboard(output); $("sbarStatus").textContent = "Ringkasan berhasil disalin. Verifikasi sebelum digunakan."; }
      catch (error) { $("sbarStatus").textContent = "Tidak dapat menyalin otomatis. Salin teks secara manual."; }
      return;
    }
    if (id === "pwGenerate") {
      const fields = [["Kode/inisial", "pwCode"], ["Usia", "pwAge"], ["Jenis kelamin", "pwSex"], ["Kunjungan", "pwVisit"], ["Tekanan darah", "pwBp"], ["Nadi", "pwHr"], ["Frekuensi napas", "pwRr"], ["Suhu", "pwTemp"], ["SpO₂", "pwSpo2"], ["Berat badan", "pwWeight"]];
      const value = key => { const el = $(key); return el ? el.value.trim() : ""; };
      const lines = ["RINGKASAN KUNJUNGAN MEDORA", "Kode/inisial: " + (value("pwCode") || "Tidak diisi"), "Usia: " + (value("pwAge") || "Tidak diisi"), "Jenis kelamin: " + (value("pwSex") || "Tidak diisi"), "Jenis kunjungan: " + (value("pwVisit") || "IGD") , "", "TANDA VITAL"];
      fields.slice(4).forEach(([label,key]) => lines.push(label + ": " + (value(key) || "Tidak diisi")));
      [["S","Subjektif","pwSubjective"],["O","Objektif","pwObjective"],["A","Asesmen","pwAssessment"],["P","Rencana","pwPlan"]].forEach(([code,label,key]) => lines.push("", code + " · " + label, value(key) || "[Belum diisi]"));
      $("pwOutput").textContent = lines.join("\n");
      $("pwStatus").textContent = "Draf dibuat. Pastikan data, satuan, diagnosis, dan rencana sudah benar sebelum digunakan.";
      return;
    }
    if (id === "pwClear") {
      document.querySelectorAll("#moduleWorkspaceContent .patientWorkspace input, #moduleWorkspaceContent .patientWorkspace textarea").forEach(el => { el.value = ""; });
      document.querySelectorAll("#moduleWorkspaceContent .patientWorkspace select").forEach(el => { el.selectedIndex = 0; });
      $("pwOutput").textContent = "Ringkasan kunjungan akan muncul di sini.";
      $("pwStatus").textContent = "Formulir dibersihkan.";
      return;
    }
    if (id === "pwCopy") {
      const output = $("pwOutput").textContent;
      if (!output || output === "Ringkasan kunjungan akan muncul di sini.") { $("pwStatus").textContent = "Buat ringkasan terlebih dahulu."; return; }
      try { await copyTextToClipboard(output); $("pwStatus").textContent = "Ringkasan berhasil disalin. Pindahkan ke sistem rekam medis resmi setelah diverifikasi."; }
      catch (error) { $("pwStatus").textContent = "Tidak dapat menyalin otomatis. Salin teks secara manual."; }
      return;
    }
    if (id === "resetEmergencyChecklist") {
      document.querySelectorAll("#moduleWorkspaceContent .checkRow input[type=checkbox]").forEach(input => { input.checked = false; });
      updateEmergencyChecklistProgress();
      const status = $("emergencyChecklistStatus");
      if (status) status.textContent = "Checklist berhasil direset untuk sesi ini.";
      return;
    }
    if (id === "buildSoap") { buildSoapNote(); return; }
    if (id === "clearSoap") {
      ["soapAge", "soapSex", "soapComplaint", "soapHistory", "soapVitals", "soapExam", "soapAssessment", "soapPlan"].forEach(key => { const el = $(key); if (el) el.value = ""; });
      $("soapOutput").textContent = "Hasil catatan akan tampil di sini.";
      $("soapStatus").textContent = "Form dikosongkan.";
      updateSoapCompleteness();
      return;
    }
    if (id === "copySoap") {
      const text = $("soapOutput").textContent;
      if (!text || text === "Hasil catatan akan tampil di sini.") { $("soapStatus").textContent = "Buat catatan terlebih dahulu."; return; }
      try { await copyTextToClipboard(text); $("soapStatus").textContent = "Catatan berhasil disalin."; }
      catch (error) { $("soapStatus").textContent = "Gagal menyalin otomatis. Salin teks secara manual."; }
      return;
    }
    if (id === "rmSave") {
      const val = key => { const el=$(key); return el ? String(el.value||"").trim() : ""; };
      const mrn=val("rmNumber"), name=val("rmName"), date=val("rmDate");
      if(!mrn || !name || !date){ $("rmStatus").textContent="Nomor RM, nama/inisial, dan tanggal kunjungan wajib diisi."; return; }
      const id=val("rmEditId") || ("rm_"+Date.now()+"_"+Math.random().toString(36).slice(2,8));
      const map={rmNumber:"mrn",rmName:"name",rmBirth:"birth",rmSex:"sex",rmDate:"date",rmType:"type",rmBp:"bp",rmHr:"hr",rmRr:"rr",rmTemp:"temp",rmSpo2:"spo2",rmWeight:"weight",rmAllergy:"allergy",rmSubjective:"subjective",rmObjective:"objective",rmAssessment:"assessment",rmIcd:"icd",rmDisposition:"disposition",rmPlan:"plan"};
      const item={id,createdAt:new Date().toISOString()};
      Object.keys(map).forEach(field=>item[map[field]]=val(field));
      if(!validPatientRecord(item)){ $("rmStatus").textContent="Data tidak valid atau ada kolom yang melebihi batas."; return; }
      const next=patientRecords.filter(x=>x.id!==id);
      next.unshift(item);
      if(!persistPatientRecords(next)){ $("rmStatus").textContent="Penyimpanan gagal. Ruang penyimpanan perangkat mungkin penuh."; return; }
      clearRmForm(); renderPatientRecords($("rmSearch").value);
      $("rmStatus").textContent="Kunjungan berhasil disimpan di perangkat.";
      return;
    }
    if (id === "rmReset") { clearRmForm(); $("rmStatus").textContent="Formulir dikosongkan."; return; }
    if (id === "rmBackup") {
      const backup={app:"MEDORA",version:2,createdAt:new Date().toISOString(),patientRecords, favorites:[...favorites],doseHistory};
      const raw=JSON.stringify(backup,null,2); $("rmBackupText").value=raw;
      try { await copyTextToClipboard(raw); $("rmBackupStatus").textContent="Backup berhasil dibuat dan disalin. Simpan teks ini di file pribadi di luar aplikasi."; }
      catch(error){ $("rmBackupStatus").textContent="Backup dibuat di kotak teks. Salin manual lalu simpan di luar aplikasi."; }
      return;
    }
    if (id === "rmRestore") {
      try {
        const raw=$("rmBackupText").value.trim();
        if(!raw || raw.length>5000000) throw new Error("Backup kosong atau melebihi batas 5 MB.");
        const data=JSON.parse(raw);
        if(data.app!=="MEDORA" || ![1,2].includes(data.version) || !Array.isArray(data.favorites) || !Array.isArray(data.doseHistory)) throw new Error("Format backup tidak dikenali.");
        const restored=data.version===2 ? data.patientRecords : [];
        if(!Array.isArray(restored) || restored.length>5000 || restored.some(item=>!validPatientRecord(item))) throw new Error("Data rekam medis tidak valid atau melebihi batas.");
        const catalogNames=new Set((window.MEDORA_DATABASE?.drugs||[]).map(item=>item[0]));
        if(data.favorites.length>catalogNames.size || data.favorites.some(x=>typeof x!=="string"||!catalogNames.has(x))) throw new Error("Daftar favorit tidak valid.");
        if(data.doseHistory.length>50 || data.doseHistory.some(x=>!x||typeof x.drug!=="string"||!catalogNames.has(x.drug)||!Number.isFinite(Number(x.weight))||Number(x.weight)<=0||Number(x.weight)>100||typeof x.age!=="string"||typeof x.date!=="string"||typeof x.result!=="string")) throw new Error("Riwayat kalkulasi tidak valid.");
        if(!confirm("Pulihkan backup? Data rekam medis, favorit, dan riwayat yang ada akan diganti.")){ $("rmBackupStatus").textContent="Pemulihan dibatalkan."; return; }
        const keys=["dt_favorites","medora_dose_history",patientRecordsKey], values=[JSON.stringify(data.favorites),JSON.stringify(data.doseHistory),JSON.stringify(restored)];
        const previous=keys.map(k=>localStorage.getItem(k));
        try{keys.forEach((k,i)=>localStorage.setItem(k,values[i]));}
        catch(storageError){keys.forEach((k,i)=>{try{if(previous[i]===null)localStorage.removeItem(k);else localStorage.setItem(k,previous[i]);}catch(ignore){}});throw new Error("Penyimpanan gagal. Data lama dipertahankan.");}
        favorites=new Set(data.favorites); doseHistory=data.doseHistory; patientRecords=restored;
        draw();renderDoseHistory();renderPatientRecords($("rmSearch").value);updateLocalDataSummary();
        $("rmBackupStatus").textContent="Backup berhasil dipulihkan. "+restored.length+" kunjungan tersedia.";
      }catch(error){$("rmBackupStatus").textContent="Pemulihan gagal: "+error.message;}
      return;
    }
    const rmAction=event.target && typeof event.target.closest==="function" ? event.target.closest("[data-rm-action]") : null;
    if(rmAction){
      const item=patientRecords.find(x=>x.id===rmAction.dataset.rmId); if(!item)return;
      if(rmAction.dataset.rmAction==="view"){renderPatientRecordDetail(item);return;}
      if(rmAction.dataset.rmAction==="edit"){fillRmForm(item);return;}
      if(rmAction.dataset.rmAction==="delete"){
        if(!confirm("Hapus catatan kunjungan ini? Tindakan ini tidak dapat dibatalkan."))return;
        const next=patientRecords.filter(x=>x.id!==item.id);
        if(persistPatientRecords(next)){renderPatientRecords($("rmSearch").value);$("rmStatus").textContent="Kunjungan dihapus.";}
        else $("rmStatus").textContent="Gagal menghapus data.";
        return;
      }
    }
    if (id === "copyLocalBackup") {
      const backup = { app: "MEDORA", version: 1, favorites: [...favorites], doseHistory };
      try { await copyTextToClipboard(JSON.stringify(backup, null, 2)); $("settingsStatus").textContent = "Backup berhasil disalin. Simpan di tempat aman."; }
      catch (error) { $("settingsStatus").textContent = "Gagal menyalin backup."; }
      return;
    }
    if (id === "clearLocalHistory") {
      if (!confirm("Hapus seluruh riwayat kalkulasi lokal?")) return;
      const previous = doseHistory;
      doseHistory = [];
      if (persistDoseHistory()) {
        renderDoseHistory();
        updateLocalDataSummary();
        $("settingsStatus").textContent = "Riwayat lokal berhasil dihapus.";
      } else {
        doseHistory = previous;
        $("settingsStatus").textContent = "Gagal menghapus riwayat. Data sebelumnya dipertahankan.";
      }
      return;
    }
    if (id === "clearLocalFavorites") {
      if (!confirm("Hapus seluruh daftar favorit lokal?")) return;
      const previous = new Set(favorites);
      favorites.clear();
      if (saveFavorites()) {
        draw();
        updateLocalDataSummary();
        $("settingsStatus").textContent = "Daftar favorit berhasil dihapus.";
      } else {
        favorites = previous;
        $("settingsStatus").textContent = "Gagal menghapus favorit. Daftar sebelumnya dipertahankan.";
      }
      return;
    }
    if (id === "restoreLocalBackup") {
      try {
        const rawBackup = $("restoreBackup").value.trim();
        if (!rawBackup) throw new Error("Tempel isi backup terlebih dahulu.");
        if (rawBackup.length > 100000) throw new Error("Ukuran backup melebihi batas 100 KB.");
        const backup = JSON.parse(rawBackup);
        if (backup.app !== "MEDORA" || backup.version !== 1 || !Array.isArray(backup.favorites) || !Array.isArray(backup.doseHistory)) throw new Error("Format backup tidak dikenali.");
        const catalogNames = new Set((window.MEDORA_DATABASE?.drugs || []).map(item => item[0]));
        if (backup.favorites.length > catalogNames.size || backup.favorites.some(item => typeof item !== "string" || !catalogNames.has(item))) throw new Error("Daftar favorit berisi nama obat yang tidak dikenal.");
        if (backup.doseHistory.length > 50 || backup.doseHistory.some(item =>
          !item ||
          typeof item.drug !== "string" || !catalogNames.has(item.drug) ||
          !Number.isFinite(Number(item.weight)) || Number(item.weight) <= 0 || Number(item.weight) > 100 ||
          typeof item.age !== "string" || !item.age.trim() || item.age.length > 40 ||
          typeof item.date !== "string" || !item.date.trim() || item.date.length > 80 ||
          typeof item.result !== "string" || !item.result.trim() || item.result.length > 1200
        )) throw new Error("Isi riwayat backup tidak valid atau di luar batas MEDORA.");
        if (!confirm("Pulihkan backup MEDORA? Daftar favorit dan riwayat saat ini akan diganti dengan isi backup.")) {
          $("settingsStatus").textContent = "Pemulihan backup dibatalkan. Data saat ini tidak berubah.";
          return;
        }
        const nextFavorites = new Set(backup.favorites);
        const nextHistory = backup.doseHistory.slice();
        // Persist both collections before changing the in-memory state. Roll back the
        // first write if the second one fails, so a failed restore is not half-applied.
        const previousFavorites = localStorage.getItem("dt_favorites");
        const previousHistory = localStorage.getItem("medora_dose_history");
        try {
          localStorage.setItem("dt_favorites", JSON.stringify([...nextFavorites]));
          localStorage.setItem("medora_dose_history", JSON.stringify(nextHistory.slice(0, 50)));
        } catch (storageError) {
          try {
            if (previousFavorites === null) localStorage.removeItem("dt_favorites");
            else localStorage.setItem("dt_favorites", previousFavorites);
            if (previousHistory === null) localStorage.removeItem("medora_dose_history");
            else localStorage.setItem("medora_dose_history", previousHistory);
          } catch (rollbackError) {
            // Keep the original storage error as the actionable failure.
          }
          throw new Error("Penyimpanan perangkat gagal. Data aktif tidak diubah.");
        }
        favorites = nextFavorites;
        doseHistory = nextHistory;
        draw(); renderDoseHistory(); updateLocalDataSummary();
        $("settingsStatus").textContent = "Backup berhasil dipulihkan.";
      } catch (error) { $("settingsStatus").textContent = "Backup gagal dipulihkan: " + error.message; }
    }
  });

  document.getElementById("moduleWorkspaceContent").addEventListener("change", event => {
    if (event.target && event.target.matches && event.target.matches(".checkRow input[type=checkbox]")) {
      updateEmergencyChecklistProgress();
      const status = document.getElementById("emergencyChecklistStatus");
      if (status) status.textContent = "Checklist diperbarui untuk sesi ini saja.";
    }
    if (event.target && /^soap/.test(event.target.id)) updateSoapCompleteness();
  });

  document.getElementById("moduleWorkspaceContent").addEventListener("input", event => {
    if (event.target && event.target.id === "rmSearch") renderPatientRecords(event.target.value);

    if (event.target && /^soap/.test(event.target.id)) updateSoapCompleteness();
    if (event.target && event.target.id === "referenceSearch") {
      const query = event.target.value.trim().toLocaleLowerCase("id");
      const links = Array.from(document.querySelectorAll("#moduleWorkspaceContent .sourceLink"));
      let visible = 0;
      links.forEach(link => {
        const haystack = (link.textContent + " " + link.href).toLocaleLowerCase("id");
        const match = haystack.includes(query);
        link.hidden = !match;
        if (match) visible++;
      });
      const count = document.getElementById("referenceCount");
      if (count) count.textContent = visible + " dari " + links.length + " referensi ditampilkan.";
    }
  });

  $("navSettings").addEventListener("click", event => {
    event.preventDefault();
    showWorkspace("settings");
  });
  window.MEDORA_WORKSPACE = { showWorkspace };
})();

/* MEDORA local clinical desk clock */
(function(){
 const dateNode=document.getElementById("medoraDeskDate");
 const clockNode=document.getElementById("medoraDeskClock");
 if(!dateNode||!clockNode)return;
 const update=()=>{
  const now=new Date();
  dateNode.textContent=new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(now);
  clockNode.textContent=new Intl.DateTimeFormat("id-ID",{hour:"2-digit",minute:"2-digit",hour12:false}).format(now);
 };
 update();
 window.setInterval(update,30000);
})();

/* MEDORA clinical module finder */
(function(){
  const input=document.getElementById("clinicalModuleSearch");
  const dashboard=document.getElementById("clinicalDashboard");
  if(!input||!dashboard||typeof dashboard.querySelector!=="function")return;
  const status=document.getElementById("clinicalSearchStatus");
  const grid=dashboard.querySelector(".moduleGrid");
  const empty=document.createElement("div");
  empty.className="moduleSearchEmpty";
  empty.textContent="Tidak ada modul yang cocok. Coba kata kunci lain.";
  if(grid)grid.appendChild(empty);
  function applyModuleSearch(){
    const query=input.value.trim().toLocaleLowerCase("id");
    const cards=Array.from(dashboard.querySelectorAll(".moduleCard"));
    const quick=Array.from(dashboard.querySelectorAll(".quickAction"));
    let visible=0;
    cards.forEach(card=>{
      const match=!query||(card.innerText+" "+(card.dataset.module||"")).toLocaleLowerCase("id").includes(query);
      card.hidden=!match;
      if(match)visible++;
    });
    quick.forEach(button=>{
      const match=!query||(button.innerText+" "+(button.dataset.module||"")).toLocaleLowerCase("id").includes(query);
      button.hidden=!match;
    });
    dashboard.querySelectorAll(".moduleGroupLabel").forEach(label=>{
      let node=label.nextElementSibling,hasMatch=false;
      while(node&&!node.classList.contains("moduleGroupLabel")){
        if(node.classList.contains("moduleCard")&&!node.hidden)hasMatch=true;
        node=node.nextElementSibling;
      }
      label.hidden=!!query&&!hasMatch;
    });
    empty.classList.toggle("visible",!!query&&visible===0);
    status.textContent=query
      ? visible+" modul ditemukan dari "+cards.length+" modul."
      : "Telusuri seluruh modul MEDORA.";
  }
  input.addEventListener("input",applyModuleSearch);
  input.addEventListener("keydown",event=>{
    if(event.key==="Escape"){input.value="";applyModuleSearch();input.blur();}
  });
  document.addEventListener("keydown",event=>{
    const target=event.target;
    const typing=target&&(target.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){
      event.preventDefault();input.focus();input.select();
    }else if(event.key==="/"&&!typing&&!event.ctrlKey&&!event.metaKey&&!event.altKey){
      event.preventDefault();input.focus();
    }
  });
  input.setAttribute("title","Tekan Ctrl+K atau / untuk mencari modul. Escape untuk menghapus.");
})();
