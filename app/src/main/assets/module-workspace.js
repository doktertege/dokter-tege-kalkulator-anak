/* MEDORA offline module workspace. Loaded after the main application script. */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const pages = {
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
      html: '<div class="guideCard"><h3>Input ringkasan kasus</h3><p id="soapCompleteness" class="medicalHint" aria-live="polite">0 dari 7 bagian klinis terisi.</p><label for="soapAge">Usia</label><input id="soapAge" placeholder="Contoh: 4 tahun 2 bulan"><label for="soapSex">Jenis kelamin</label><select id="soapSex"><option value="">Pilih</option><option>Laki-laki</option><option>Perempuan</option></select><label for="soapComplaint">Keluhan utama</label><textarea id="soapComplaint" placeholder="Keluhan, onset, durasi..."></textarea><label for="soapHistory">Riwayat dan gejala penyerta</label><textarea id="soapHistory" placeholder="Riwayat penyakit, obat, alergi, gejala penyerta..."></textarea><label for="soapVitals">Tanda vital</label><textarea id="soapVitals" placeholder="TD, HR, RR, suhu, SpO₂, BB..."></textarea><label for="soapExam">Pemeriksaan fisik/penunjang</label><textarea id="soapExam" placeholder="Temuan objektif..."></textarea><label for="soapAssessment">Assessment/diagnosis kerja</label><textarea id="soapAssessment" placeholder="Masalah klinis dan diagnosis banding..."></textarea><label for="soapPlan">Plan</label><textarea id="soapPlan" placeholder="Pemeriksaan, terapi, monitoring, edukasi, disposisi..."></textarea><div class="workspaceActions"><button type="button" id="buildSoap" class="active">Buat catatan SOAP</button><button type="button" id="clearSoap">Kosongkan</button></div><div id="soapOutput" class="workspaceOutput">Hasil catatan akan tampil di sini.</div><p id="soapOutputCount" class="medicalHint">0 karakter.</p><div class="workspaceActions"><button type="button" id="copySoap">Salin catatan</button></div><p id="soapStatus" class="medicalHint" aria-live="polite"></p></div><p class="notice">Asisten ini hanya menyusun teks dari input pengguna. Tidak menganalisis diagnosis, tidak memverifikasi dosis, dan tidak menggantikan penilaian dokter. Hindari memasukkan nama lengkap, NIK, alamat, atau identitas langsung pasien.</p>'
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
      title: "Rekam Medis",
      subtitle: "Checklist kelengkapan dokumentasi kunjungan tanpa menyimpan identitas pasien di modul ini.",
      html: '<div class="guideCard"><h3>Komponen rekam medis</h3><ul><li>Keluhan utama, riwayat penyakit sekarang, riwayat dahulu/keluarga, obat, dan alergi.</li><li>Pemeriksaan fisik relevan dan tanda vital dengan waktu pengukuran.</li><li>Diagnosis kerja, diagnosis banding, dan dasar penetapan.</li><li>Hasil pemeriksaan penunjang dan interpretasinya.</li><li>Terapi: nama obat, dosis, rute, frekuensi, durasi, serta respons.</li><li>Edukasi, informed consent bila diperlukan, rencana kontrol, dan disposisi.</li></ul></div><div class="guideCard"><h3>Mutu dokumentasi</h3><p>Catat secara kronologis, objektif, terbaca, tepat waktu, dan dapat ditelusuri. Koreksi mengikuti kebijakan fasilitas; jangan menghapus jejak perubahan.</p></div><div class="guideCard"><h3>Privasi</h3><p>Gunakan sistem rekam medis resmi fasilitas. Batasi akses sesuai kewenangan, hindari berbagi tangkapan layar, dan jangan memasukkan identitas langsung ke alat bantu yang tidak disetujui fasilitas.</p></div><p class="notice">Menu ini adalah checklist edukatif, bukan sistem rekam medis elektronik dan tidak menyimpan data kunjungan pasien.</p>'
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
    const ids = ["soapComplaint", "soapHistory", "soapVitals", "soapExam", "soapAssessment", "soapPlan", "soapAge"];
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
    let out = "CATATAN KLINIS MEDORA\\n";
    out += "Usia: " + ($("soapAge").value.trim() || "Belum diisi") + "\\nJenis kelamin: " + ($("soapSex").value || "Belum diisi") + "\\n\\n";
    sections.forEach(([code, label, ids]) => {
      const values = ids.map(id => $(id).value.trim()).filter(Boolean);
      out += code + " - " + label + "\\n";
      if (values.length) out += values.join("\\n") + "\\n";
      else {
        out += "[BELUM DIISI]\\n";
        missing.push(label);
      }
      out += "\\n";
    });
    $("soapOutput").textContent = out.trim();
    $("soapStatus").textContent = missing.length
      ? "Catatan dibuat, tetapi belum lengkap. Isi: " + missing.join(", ") + ". Verifikasi seluruh data sebelum digunakan."
      : "Semua bagian SOAP terisi. Tetap verifikasi kelengkapan dan akurasi sebelum digunakan.";
    updateSoapCompleteness();
  }

  document.getElementById("moduleBack").addEventListener("click", showClinicalHome);
  document.getElementById("homeDashboard").addEventListener("click", event => {
    const button = event.target.closest("[data-module]");
    if (!button) return;
    const key = button.dataset.module;
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
        const backup = JSON.parse($("restoreBackup").value.trim());
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
  });
  document.getElementById("moduleWorkspaceContent").addEventListener("input", event => {
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