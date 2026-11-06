/* MEDORA offline module workspace. Loaded after the main application script. */
(function () {
  "use strict";
  const pages = {
    guides: {
      title: "Panduan Klinis",
      subtitle: "Checklist penilaian awal dan dokumentasi klinis offline.",
      html: '<div class="guideCard"><h3>Penilaian awal pasien: ABCDE</h3><ol><li><b>A · Airway:</b> nilai patensi jalan napas, suara tambahan, risiko obstruksi, dan proteksi servikal bila trauma.</li><li><b>B · Breathing:</b> nilai frekuensi dan usaha napas, ekspansi dada, SpO₂, auskultasi, serta kebutuhan dukungan oksigen sesuai kondisi.</li><li><b>C · Circulation:</b> nilai nadi, tekanan darah, perfusi perifer, pengisian kapiler, perdarahan, dan akses vaskular bila diperlukan.</li><li><b>D · Disability:</b> nilai kesadaran (AVPU/GCS), pupil, glukosa darah bila indikasi, dan defisit neurologis fokal.</li><li><b>E · Exposure:</b> periksa seluruh tubuh sesuai indikasi, suhu, ruam, trauma, dan cegah hipotermia.</li></ol><p><b>Prinsip:</b> tangani masalah yang mengancam nyawa saat ditemukan, lakukan penilaian ulang setelah intervensi, dan dokumentasikan waktu serta respons.</p></div><div class="guideCard"><h3>Dokumentasi SOAP</h3><ul><li><b>S:</b> keluhan utama, onset, perjalanan, gejala penyerta, riwayat relevan, obat dan alergi.</li><li><b>O:</b> tanda vital, pemeriksaan fisik, status mental, serta hasil pemeriksaan penunjang.</li><li><b>A:</b> masalah klinis/diagnosis kerja dan diagnosis banding yang relevan.</li><li><b>P:</b> rencana pemeriksaan, terapi, monitoring, edukasi, disposisi, dan safety-netting.</li></ul></div><div class="guideCard"><h3>Evaluasi sebelum pasien dipulangkan</h3><ul><li>Pastikan kondisi stabil dan hasil evaluasi ulang terdokumentasi.</li><li>Pastikan pasien/keluarga memahami diagnosis kerja, obat, cara pakai, dan efek samping penting.</li><li>Berikan tanda bahaya yang mengharuskan kembali segera.</li><li>Tentukan jadwal kontrol dan akses pertolongan bila kondisi memburuk.</li></ul></div><p class="notice">Ini adalah kerangka kerja umum, bukan protokol diagnosis atau terapi spesifik. Gunakan panduan penyakit dan SOP fasilitas yang berlaku.</p>'
    },
    emergency: {
      title: "IGD & Emergency",
      subtitle: "Checklist kesiapan dan serah terima pasien gawat darurat.",
      html: '<div class="guideCard"><h3>Checklist respons awal</h3><label class="checkRow"><input type="checkbox"> Pastikan keamanan lokasi, gunakan APD sesuai risiko, dan panggil bantuan/tim resusitasi.</label><label class="checkRow"><input type="checkbox"> Lakukan penilaian ABCDE dan tangani ancaman nyawa segera.</label><label class="checkRow"><input type="checkbox"> Monitor tanda vital, SpO₂, irama jantung, kesadaran, dan respons intervensi sesuai kondisi.</label><label class="checkRow"><input type="checkbox"> Periksa glukosa darah pada penurunan kesadaran/kejang atau indikasi klinis.</label><label class="checkRow"><input type="checkbox"> Identifikasi alergi, obat rutin, komorbid, waktu onset, dan riwayat penting.</label><label class="checkRow"><input type="checkbox"> Dokumentasikan intervensi, dosis, rute, waktu pemberian, dan respons.</label><label class="checkRow"><input type="checkbox"> Tentukan kebutuhan konsultasi, rujukan, transportasi, dan pendampingan.</label></div><div class="guideCard"><h3>Serah terima SBAR</h3><p><b>S · Situation:</b> identitas ringkas, lokasi, masalah utama, dan kondisi saat ini.</p><p><b>B · Background:</b> riwayat relevan, komorbid, alergi, obat, dan kronologi.</p><p><b>A · Assessment:</b> temuan ABCDE, tanda vital, pemeriksaan, tindakan, dan respons.</p><p><b>R · Recommendation:</b> kebutuhan tindakan berikut, monitoring, konsultasi, dan tujuan rujukan.</p></div><div class="guideCard"><h3>Dokumentasi rujukan</h3><ul><li>Alasan dan urgensi rujukan.</li><li>Kondisi hemodinamik dan status jalan napas sebelum berangkat.</li><li>Terapi/tindakan beserta waktu dan respons.</li><li>Hasil pemeriksaan yang menyertai.</li><li>Komunikasi dengan fasilitas penerima dan moda transportasi.</li></ul></div><p class="notice">Menu ini tidak menggantikan algoritma resusitasi resmi, SOP IGD, atau instruksi klinis setempat. Tidak ada dosis obat darurat yang ditampilkan pada checklist ini.</p>'
    },
    ai: {
      title: "Asisten Klinis Offline",
      subtitle: "Susun catatan SOAP dari data yang dimasukkan. Data tidak dikirim ke server dan tidak disimpan oleh fitur ini.",
      html: '<div class="guideCard"><h3>Input ringkasan kasus</h3><label for="soapAge">Usia</label><input id="soapAge" placeholder="Contoh: 4 tahun 2 bulan"><label for="soapSex">Jenis kelamin</label><select id="soapSex"><option value="">Pilih</option><option>Laki-laki</option><option>Perempuan</option></select><label for="soapComplaint">Keluhan utama</label><textarea id="soapComplaint" placeholder="Keluhan, onset, durasi..."></textarea><label for="soapHistory">Riwayat dan gejala penyerta</label><textarea id="soapHistory" placeholder="Riwayat penyakit, obat, alergi, gejala penyerta..."></textarea><label for="soapVitals">Tanda vital</label><textarea id="soapVitals" placeholder="TD, HR, RR, suhu, SpO₂, BB..."></textarea><label for="soapExam">Pemeriksaan fisik/penunjang</label><textarea id="soapExam" placeholder="Temuan objektif..."></textarea><label for="soapAssessment">Assessment/diagnosis kerja</label><textarea id="soapAssessment" placeholder="Masalah klinis dan diagnosis banding..."></textarea><label for="soapPlan">Plan</label><textarea id="soapPlan" placeholder="Pemeriksaan, terapi, monitoring, edukasi, disposisi..."></textarea><div class="workspaceActions"><button type="button" id="buildSoap" class="active">Buat catatan SOAP</button><button type="button" id="clearSoap">Kosongkan</button></div><div id="soapOutput" class="workspaceOutput">Hasil catatan akan tampil di sini.</div><div class="workspaceActions"><button type="button" id="copySoap">Salin catatan</button></div><p id="soapStatus" class="medicalHint" aria-live="polite"></p></div><p class="notice">Asisten ini hanya menyusun teks dari input pengguna. Tidak menganalisis diagnosis, tidak memverifikasi dosis, dan tidak menggantikan penilaian dokter. Hindari memasukkan nama lengkap, NIK, alamat, atau identitas langsung pasien.</p>'
    },
    references: {
      title: "Referensi Medis",
      subtitle: "Pintu akses ke sumber pedoman. Membuka tautan memerlukan koneksi internet.",
      html: '<div class="guideCard"><h3>Pedoman dan sumber resmi</h3><a class="sourceLink" href="https://www.who.int/publications" target="_blank" rel="noopener">WHO · Publications and guidelines ↗</a><a class="sourceLink" href="https://www.kemkes.go.id/" target="_blank" rel="noopener">Kementerian Kesehatan RI ↗</a><a class="sourceLink" href="https://www.idai.or.id/" target="_blank" rel="noopener">Ikatan Dokter Anak Indonesia (IDAI) ↗</a><a class="sourceLink" href="https://www.heart.org/" target="_blank" rel="noopener">American Heart Association (AHA) ↗</a><a class="sourceLink" href="https://kdigo.org/guidelines/" target="_blank" rel="noopener">KDIGO · Clinical Practice Guidelines ↗</a><a class="sourceLink" href="https://ginasthma.org/" target="_blank" rel="noopener">GINA · Global Strategy for Asthma Management ↗</a><a class="sourceLink" href="https://www.cdc.gov/" target="_blank" rel="noopener">CDC · Clinical and public health guidance ↗</a></div><div class="guideCard"><h3>Catatan penggunaan</h3><ul><li>Periksa tanggal publikasi dan versi terbaru sebelum menerapkan rekomendasi.</li><li>Utamakan pedoman nasional, formularium, dan SOP fasilitas yang berlaku.</li><li>Perhatikan populasi khusus: neonatus, anak, kehamilan, lansia, serta gangguan ginjal/hati.</li><li>Jangan menyamakan ringkasan sumber dengan dokumen lengkap.</li></ul></div>'
    },
    settings: {
      title: "Pengaturan MEDORA",
      subtitle: "Kelola data lokal yang tersimpan pada perangkat ini.",
      html: '<div class="guideCard"><h3>Penyimpanan perangkat</h3><p id="localDataSummary"></p><div class="workspaceActions"><button type="button" id="copyLocalBackup" class="active">Salin backup data</button><button type="button" id="clearLocalHistory">Hapus riwayat</button><button type="button" id="clearLocalFavorites">Hapus favorit</button></div><label for="restoreBackup">Pulihkan backup JSON</label><textarea id="restoreBackup" placeholder="Tempel isi backup MEDORA di sini..."></textarea><div class="workspaceActions"><button type="button" id="restoreLocalBackup">Pulihkan data</button></div><p id="settingsStatus" class="medicalHint" aria-live="polite"></p></div><p class="notice">Backup berisi daftar favorit dan riwayat kalkulasi yang tersimpan lokal. Simpan file/teks backup secara pribadi. Jangan membagikan riwayat yang berisi informasi pasien.</p>'
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
  }

  function buildSoapNote() {
    const $ = id => document.getElementById(id);
    const sections = [["S", ["soapComplaint", "soapHistory"]], ["O", ["soapVitals", "soapExam"]], ["A", ["soapAssessment"]], ["P", ["soapPlan"]]];
    let out = "CATATAN KLINIS MEDORA\n";
    out += "Usia: " + ($("soapAge").value.trim() || "-") + "\nJenis kelamin: " + ($("soapSex").value || "-") + "\n\n";
    sections.forEach(([name, ids]) => {
      out += name + "\n";
      ids.forEach(id => { const value = $(id).value.trim(); if (value) out += value + "\n"; });
      out += "\n";
    });
    $("soapOutput").textContent = out.trim();
    $("soapStatus").textContent = "Catatan dibuat. Periksa kembali kelengkapan dan akurasi sebelum dimasukkan ke rekam medis.";
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
    const actionButton = event.target.closest("button");
    const id = actionButton ? actionButton.id : event.target.id;
    const $ = value => document.getElementById(value);
    if (id === "buildSoap") { buildSoapNote(); return; }
    if (id === "clearSoap") {
      ["soapAge", "soapSex", "soapComplaint", "soapHistory", "soapVitals", "soapExam", "soapAssessment", "soapPlan"].forEach(key => { const el = $(key); if (el) el.value = ""; });
      $("soapOutput").textContent = "Hasil catatan akan tampil di sini.";
      $("soapStatus").textContent = "Form dikosongkan.";
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
      doseHistory = []; persistDoseHistory(); renderDoseHistory(); updateLocalDataSummary();
      $("settingsStatus").textContent = "Riwayat lokal dihapus.";
      return;
    }
    if (id === "clearLocalFavorites") {
      if (!confirm("Hapus seluruh daftar favorit lokal?")) return;
      favorites.clear(); saveFavorites(); draw(); updateLocalDataSummary();
      $("settingsStatus").textContent = "Daftar favorit dihapus.";
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
        favorites = new Set(backup.favorites);
        doseHistory = backup.doseHistory.slice();
        saveFavorites(); persistDoseHistory(); draw(); renderDoseHistory(); updateLocalDataSummary();
        $("settingsStatus").textContent = "Backup berhasil dipulihkan.";
      } catch (error) { $("settingsStatus").textContent = "Backup gagal dipulihkan: " + error.message; }
    }
  });

  $("navSettings").addEventListener("click", event => {
    event.preventDefault();
    showWorkspace("settings");
  });
  window.MEDORA_WORKSPACE = { showWorkspace };
})();