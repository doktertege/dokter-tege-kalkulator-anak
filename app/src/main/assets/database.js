/* MEDORA offline reference database.
 * ICD-10 source family: WHO ICD-10, version 2010.
 * Curated quick-reference subset; not a complete tabular/index dataset.
 * Kept local so the app works without network access.
 */
(function (root) {
  "use strict";
  root.MEDORA_DATABASE = root.MEDORA_DATABASE || {};
  root.MEDORA_DATABASE.metadata = {
    icd10: {
      system: "WHO ICD-10",
      version: "2010",
      scope: "Curated quick-reference subset; verify against official index and tabular list"
    }
  };
  root.MEDORA_DATABASE.icd10 = [

["A09","Gastroenteritis dan kolitis lain yang diduga infeksi atau tidak spesifik","Infeksi"],
["B34.9","Infeksi virus, tidak spesifik","Infeksi"],
["J00","Nasofaringitis akut (common cold)","Respirasi"],
["J02.9","Faringitis akut, tidak spesifik","Respirasi"],
["J03.9","Tonsilitis akut, tidak spesifik","Respirasi"],
["J06.9","Infeksi saluran napas atas akut, tidak spesifik","Respirasi"],
["J18.9","Pneumonia, organisme tidak spesifik","Respirasi"],
["J45.9","Asma, tidak spesifik","Respirasi"],
["I10","Hipertensi esensial (primer)","Penyakit dalam"],
["E11.9","Diabetes melitus tipe 2 tanpa komplikasi","Penyakit dalam"],
["K29.7","Gastritis, tidak spesifik","Penyakit dalam"],
["K30","Dispepsia","Penyakit dalam"],
["K21.9","Penyakit refluks gastroesofageal tanpa esofagitis","Penyakit dalam"],
["N39.0","Infeksi saluran kemih, lokasi tidak spesifik","Penyakit dalam"],
["R05","Batuk","Gejala"],
["R50.9","Demam, tidak spesifik","Gejala"],
["R10.9","Nyeri abdomen, tidak spesifik","Gejala"],
["R42","Pusing dan vertigo","Gejala"],
["R51","Sakit kepala","Gejala"],
["A04.9","Infeksi usus bakterial, tidak spesifik","Infeksi"],
["A08.4","Infeksi usus virus, tidak spesifik","Infeksi"],
["E86","Dehidrasi","Penyakit dalam"],
["D50.9","Anemia defisiensi besi, tidak spesifik","Penyakit dalam"],
["E10.9","Diabetes melitus tipe 1 tanpa komplikasi","Penyakit dalam"],
["J20.9","Bronkitis akut, tidak spesifik","Respirasi"],
["J21.9","Bronkiolitis akut, tidak spesifik","Respirasi"],
["J44.9","Penyakit paru obstruktif kronik, tidak spesifik","Respirasi"],
["K52.9","Gastroenteritis dan kolitis noninfeksi, tidak spesifik","Pencernaan"],
["K59.0","Konstipasi","Pencernaan"],
["N30.0","Sistitis akut","Urogenital"],
["R00.2","Palpitasi","Gejala"],
["R03.0","Peningkatan tekanan darah tanpa diagnosis hipertensi","Gejala"],
["R06.0","Dispnea","Gejala"],
["R07.4","Nyeri dada, tidak spesifik","Gejala"],
["R11.2","Mual dengan muntah, tidak spesifik","Gejala"],
["R19.7","Diare, tidak spesifik","Gejala"],
["R53","Malaise dan kelelahan","Gejala"],
["M25.5","Nyeri sendi","Muskuloskeletal"],
["L20.9","Dermatitis atopik, tidak spesifik","Kulit"],
["L23.9","Dermatitis kontak alergi, penyebab tidak spesifik","Kulit"],
["L50.9","Urtikaria, tidak spesifik","Kulit"],
["H10.9","Konjungtivitis, tidak spesifik","Mata & THT"],
["H60.9","Otitis eksterna, tidak spesifik","Mata & THT"],
["G44.2","Sakit kepala tipe tegang","Neurologi"],
["S09.9","Cedera kepala, tidak spesifik","Trauma"],
["T14.9","Cedera, tidak spesifik","Trauma"],
["M54.5","Nyeri punggung bawah","Lainnya"],
["M79.1","Mialgia","Lainnya"],
["L30.9","Dermatitis, tidak spesifik","Lainnya"],
["H66.9","Otitis media, tidak spesifik","Lainnya"],
["G43.9","Migrain, tidak spesifik","Lainnya"],
["A15.0","Tuberkulosis paru terkonfirmasi melalui pemeriksaan mikroskopis sputum","Infeksi"],
["A16.2","Tuberkulosis paru tanpa keterangan konfirmasi bakteriologis atau histologis","Infeksi"],
["A18.0","Tuberkulosis tulang dan sendi","Infeksi"],
["B00.9","Infeksi herpesvirus, tidak spesifik","Infeksi"],
["B01.9","Varisela tanpa komplikasi","Infeksi"],
["B02.9","Herpes zoster tanpa komplikasi","Infeksi"],
["B86","Skabies","Infeksi"],
["D64.9","Anemia, tidak spesifik","Penyakit dalam"],
["E03.9","Hipotiroidisme, tidak spesifik","Penyakit dalam"],
["E66.9","Obesitas, tidak spesifik","Penyakit dalam"],
["E78.5","Hiperlipidemia, tidak spesifik","Penyakit dalam"],
["I20.9","Angina pektoris, tidak spesifik","Penyakit dalam"],
["I50.9","Gagal jantung, tidak spesifik","Penyakit dalam"],
["I64","Stroke, tidak ditentukan sebagai perdarahan atau infark","Penyakit dalam"],
["J01.9","Sinusitis akut, tidak spesifik","Respirasi"],
["J30.4","Rinitis alergi, tidak spesifik","Respirasi"],
["J32.9","Sinusitis kronis, tidak spesifik","Respirasi"],
["J40","Bronkitis, tidak dinyatakan akut atau kronis","Respirasi"],
["J46","Status asmatikus","Respirasi"],
["J90","Efusi pleura, tidak diklasifikasikan di tempat lain","Respirasi"],
["K25.9","Ulkus gaster, tidak spesifik, tanpa perdarahan atau perforasi","Pencernaan"],
["K35.9","Apendisitis akut, tidak spesifik","Pencernaan"],
["K40.9","Hernia inguinal unilateral atau tidak spesifik tanpa obstruksi atau gangren","Pencernaan"],
["K64.9","Hemoroid, tidak spesifik","Pencernaan"],
["K76.0","Perlemakan hati, tidak diklasifikasikan di tempat lain","Pencernaan"],
["K80.2","Batu kandung empedu tanpa kolesistitis","Pencernaan"],
["K85.9","Pankreatitis akut, tidak spesifik","Pencernaan"],
["K92.2","Perdarahan gastrointestinal, tidak spesifik","Pencernaan"],
["N10","Nefritis tubulointerstisial akut","Urogenital"],
["N20.0","Batu ginjal","Urogenital"],
["N40","Hiperplasia prostat","Urogenital"],
["R04.0","Epistaksis","Gejala"],
["R31","Hematuria, tidak spesifik","Gejala"],
["R33","Retensi urine","Gejala"],
["R55","Sinkop dan kolaps","Gejala"],
["R56.0","Kejang demam","Gejala"],
["G40.9","Epilepsi, tidak spesifik","Neurologi"],
["G51.0","Paralisis Bell","Neurologi"],
["H00.0","Hordeolum dan inflamasi dalam kelopak mata lainnya","Mata & THT"],
["H81.1","Vertigo paroksismal benigna","Mata & THT"],
["L02.9","Abses kulit, furunkel, atau karbunkel, tidak spesifik","Kulit"],
["L03.9","Selulitis, tidak spesifik","Kulit"],
["M17.9","Gonartrosis, tidak spesifik","Muskuloskeletal"],
["M19.9","Artrosis, tidak spesifik","Muskuloskeletal"],
["M54.2","Nyeri leher (servikalgia)","Muskuloskeletal"],
["M54.9","Dorsalgia, tidak spesifik","Muskuloskeletal"],
["S06.0","Konkusi","Trauma"],
["S93.4","Cedera terkilir dan teregang pada pergelangan kaki","Trauma"]
  ];

  root.MEDORA_DATABASE.metadata.drugs = {
    source: "MEDORA curated medication catalog",
    version: "1.0",
    scope: "Product index and formulation labels; dosing logic remains in dose-engine.js and indication-specific guidance"
  };
  root.MEDORA_DATABASE.drugs = [
    ["Paracetamol","Demam & nyeri","Antipiretik / analgesik","🧴","active"],
    ["Ibuprofen","Demam & nyeri","Antipiretik / antiinflamasi","🧴","active"],
    ["Metamizole","Nyeri berat terpilih","Suspensi oral 250 mg/5 mL • resep dokter","🧴","active"],
    ["Amoxicillin","Antibiotik","Suspensi oral 125/250 mg per 5 mL • kapsul • tablet","💊","active"],
    ["Cefadroxil","Antibiotik","Suspensi oral 125/250 mg per 5 mL","💊","active"],
    ["Cefixime","Antibiotik","Suspensi oral 100/200 mg per 5 mL • kapsul","💊","active"],
    ["Ceftriaxone","Antibiotik","Injeksi IV / IM","💉","active"],
    ["Cefotaxime","Antibiotik","Injeksi IV / IM","💉","active"],
    ["Gentamicin","Antibiotik","Injeksi","💉","active"],
    ["CTM (Chlorpheniramine)","Alergi","Sirup immediate-release • tablet","🧴","active"],
    ["Cetirizine","Alergi","Tablet • sirup","🧴","active"],
    ["Loratadine","Alergi","Sirup 5 mg/5 mL • dosis anak berdasarkan berat badan","🧴","active"],
    ["Oralit","Lainnya","Sachet • larutkan sesuai petunjuk kemasan","🥤","active"],
    ["Zinc","Lainnya","Tablet dispersibel • sirup","💊","active"],
    ["Ambroxol","Lainnya","Tablet • sirup","🧴","active"],
    ["Cendo Xitrol Tetes Mata","Mata & telinga","Deksametason 0,1% + neomisin + polimiksin B • obat mata kombinasi steroid","👁️","active"],
    ["Cendo Xitrol Salep Mata","Mata & telinga","Deksametason 0,1% + neomisin + polimiksin B • salep mata","👁️","active"],
    ["Erlamycetin Tetes Mata","Mata & telinga","Kloramfenikol 0,5% • tetes mata","👁️","active"],
    ["Erlamycetin Tetes Telinga","Mata & telinga","Kloramfenikol 1% • tetes telinga","👂","active"],
    ["Erlamycetin Salep Mata","Mata & telinga","Kloramfenikol 1% • salep mata","👁️","active"],
    ["Salbutamol","Lainnya","Nebulisasi/inhalasi • khusus bronkospasme/asma","🫁","active"],
    ["Dexamethasone","Lainnya","Croup anak 6 bulan–6 tahun • dosis tunggal oral/injeksi","💊","active"],
    ["Prednisone","Lainnya","Tablet 5 mg • asma akut sedang–berat • oral 3–5 hari","💊","active"],
    ["Methylprednisolone","Lainnya","Injeksi IV • eksaserbasi asma berat • dosis awal","💊","active"],
    ["Diazepam","Lainnya","Rektal • rescue kejang berkepanjangan • dosis tunggal","💊","active"],
    ["Ondansetron","Lainnya","Sirup 4 mg/5 mL • tablet • injeksi • dosis oral tunggal terpilih","💊","active"],
    ["Metronidazole","Lainnya","Suspensi oral • amebiasis dan giardiasis terpilih","💊","active"],
    ["Domperidone","Tidak direkomendasikan","Tidak ada kalkulator dosis anak • risiko QT","💊","excluded"],
    ["Omeprazole","Lainnya","Kapsul lepas tunda 20 mg • GERD khas / esofagitis erosif • usia 1–16 tahun dan BB ≥20 kg","💊","active"],
    ["Lansoprazole","Lainnya","Kapsul lepas tunda 30 mg • GERD khas / esofagitis erosif terpilih","💊","active"],
    ["Furosemide","Diuretik","Tablet 40 mg • edema terpilih","💊","active"],
    ["Adrenaline","Emergensi","Injeksi IM 1 mg/mL • anafilaksis saja","💉","active"]
  ];

  root.MEDORA_DATABASE.metadata.medicineProfiles = {
  "schemaVersion": "1.1",
  "reviewedOn": "2026-11-06",
  "scope": "Structured formulation and safety notes; not a prescribing label and not a substitute for current product-specific package information",
  "verificationPolicy": "Each profile field carries provenance status and sourceRefs. Unlinked fields remain explicitly pending product-specific verification; verify the actual stocked pack and current package insert.",
  "sources": {
    "bpom_cendo_xitrol_drop": {
      "url": "https://cekbpom.pom.go.id/produk/EREG100213VR12100053/05/detail",
      "title": "BPOM Cek Produk: Cendo Xitrol tetes mata",
      "sourceType": "official_product_registration"
    },
    "halodoc_cendo_xitrol_drop": {
      "url": "https://www.halodoc.com/obat-dan-vitamin/cendo-xitrol-eye-drop-5-ml",
      "title": "Halodoc: Cendo Xitrol Eye Drop 5 ml",
      "sourceType": "product_information_reference"
    },
    "halodoc_cendo_xitrol_ointment": {
      "url": "https://www.halodoc.com/obat-dan-vitamin/cendo-xitrol-salep-mata-3-5-g",
      "title": "Halodoc: Cendo Xitrol Salep Mata 3.5 g",
      "sourceType": "product_information_reference"
    },
    "ygi_oralit": {
      "url": "https://ygi.or.id/hal-hal-yang-perlu-diperhatikan-saat-membuat-dan-konsumsi-oralit/",
      "title": "Yayasan Gastroenterologi Indonesia: pembuatan oralit",
      "sourceType": "clinical_education_reference"
    }
  },
  "coverage": {
    "Paracetamol": "pending_profile_review",
    "Ibuprofen": "pending_profile_review",
    "Metamizole": "pending_profile_review",
    "Amoxicillin": "pending_profile_review",
    "Cefadroxil": "pending_profile_review",
    "Cefixime": "pending_profile_review",
    "Ceftriaxone": "structured_profile",
    "Cefotaxime": "structured_profile",
    "Gentamicin": "structured_profile",
    "CTM (Chlorpheniramine)": "structured_profile",
    "Cetirizine": "pending_profile_review",
    "Loratadine": "pending_profile_review",
    "Oralit": "structured_profile",
    "Zinc": "pending_profile_review",
    "Ambroxol": "pending_profile_review",
    "Cendo Xitrol Tetes Mata": "structured_profile",
    "Cendo Xitrol Salep Mata": "structured_profile",
    "Erlamycetin Tetes Mata": "structured_profile",
    "Erlamycetin Tetes Telinga": "structured_profile",
    "Erlamycetin Salep Mata": "structured_profile",
    "Salbutamol": "pending_profile_review",
    "Dexamethasone": "pending_profile_review",
    "Prednisone": "pending_profile_review",
    "Methylprednisolone": "pending_profile_review",
    "Diazepam": "pending_profile_review",
    "Ondansetron": "pending_profile_review",
    "Metronidazole": "pending_profile_review",
    "Domperidone": "excluded",
    "Omeprazole": "pending_profile_review",
    "Lansoprazole": "pending_profile_review",
    "Furosemide": "pending_profile_review",
    "Adrenaline": "pending_profile_review"
  }
};
  root.MEDORA_DATABASE.medicineProfiles = {
  "CTM (Chlorpheniramine)": {
    "activeIngredient": "chlorpheniramine maleate",
    "dosageForms": [
      "sirup oral",
      "tablet oral"
    ],
    "route": [
      "oral"
    ],
    "formulationNote": "Konsentrasi sirup dan kekuatan tablet berbeda antarproduk; wajib cocokkan etiket sebelum menghitung volume.",
    "prescriptionStatus": "varies_by_product",
    "doseEngineFunction": "chlorpheniramine",
    "keyWarnings": [
      "Dapat menyebabkan kantuk dan efek antikolinergik.",
      "Hindari duplikasi dengan obat flu kombinasi yang juga mengandung antihistamin.",
      "Gunakan sediaan immediate-release; jangan samakan dengan sediaan lepas lambat."
    ],
    "provenance": {
      "activeIngredient": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "dosageForms": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "route": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "formulationNote": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "strength": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "prescriptionStatus": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "keyWarnings": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "doseEngineFunction": {
        "status": "verified_by_local_regression_test",
        "sourceRefs": []
      }
    }
  },
  "Oralit": {
    "activeIngredient": "glukosa anhidrat, natrium klorida, kalium klorida, trisodium sitrat dihidrat",
    "dosageForms": [
      "serbuk sachet untuk larutan oral"
    ],
    "route": [
      "oral"
    ],
    "formulationNote": "Volume pelarut mengikuti label sachet; produk 200 mL tidak boleh diasumsikan sama dengan sachet untuk volume lain.",
    "prescriptionStatus": "non_prescription",
    "doseEngineFunction": "oralit",
    "keyWarnings": [
      "Larutkan seluruh sachet tepat pada volume air matang sesuai kemasan.",
      "Jangan menambahkan gula atau garam dan jangan membagi serbuk sachet secara perkiraan.",
      "Dehidrasi berat atau syok memerlukan tata laksana segera, bukan oralit oral saja."
    ],
    "provenance": {
      "activeIngredient": {
        "status": "source_linked_reference",
        "sourceRefs": [
          "ygi_oralit"
        ]
      },
      "dosageForms": {
        "status": "source_linked_reference",
        "sourceRefs": [
          "ygi_oralit"
        ]
      },
      "route": {
        "status": "source_linked_reference",
        "sourceRefs": [
          "ygi_oralit"
        ]
      },
      "formulationNote": {
        "status": "source_linked_reference",
        "sourceRefs": [
          "ygi_oralit"
        ]
      },
      "strength": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "prescriptionStatus": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "keyWarnings": {
        "status": "source_linked_reference",
        "sourceRefs": [
          "ygi_oralit"
        ]
      },
      "doseEngineFunction": {
        "status": "verified_by_local_regression_test",
        "sourceRefs": []
      }
    }
  },
  "Ceftriaxone": {
    "activeIngredient": "ceftriaxone sodium",
    "dosageForms": [
      "serbuk injeksi vial"
    ],
    "route": [
      "IV",
      "IM"
    ],
    "formulationNote": "Kekuatan vial, pelarut, konsentrasi setelah rekonstitusi, dan kompatibilitas bergantung produk serta rute.",
    "prescriptionStatus": "prescription_only",
    "doseEngineFunction": "ceftriaxoneInjection",
    "keyWarnings": [
      "Verifikasi alergi beta-laktam dan riwayat reaksi berat.",
      "Jangan gunakan pelarut yang mengandung kalsium untuk rekonstitusi atau pengenceran IV.",
      "Neonatus memerlukan pemeriksaan kontraindikasi khusus, termasuk hiperbilirubinemia dan cairan IV berkalsium."
    ],
    "provenance": {
      "activeIngredient": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "dosageForms": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "route": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "formulationNote": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "strength": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "prescriptionStatus": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "keyWarnings": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "doseEngineFunction": {
        "status": "verified_by_local_regression_test",
        "sourceRefs": []
      }
    }
  },
  "Cefotaxime": {
    "activeIngredient": "cefotaxime sodium",
    "dosageForms": [
      "serbuk injeksi vial"
    ],
    "route": [
      "IV",
      "IM"
    ],
    "formulationNote": "Kekuatan vial dan konsentrasi setelah rekonstitusi bergantung produk serta rute.",
    "prescriptionStatus": "prescription_only",
    "doseEngineFunction": "cefotaximeInjection",
    "keyWarnings": [
      "Verifikasi alergi beta-laktam.",
      "Periksa fungsi ginjal untuk penyesuaian regimen pada gangguan ginjal.",
      "Pastikan pengencer, konsentrasi, stabilitas, dan kecepatan pemberian sesuai informasi produk."
    ],
    "provenance": {
      "activeIngredient": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "dosageForms": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "route": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "formulationNote": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "strength": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "prescriptionStatus": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "keyWarnings": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "doseEngineFunction": {
        "status": "verified_by_local_regression_test",
        "sourceRefs": []
      }
    }
  },
  "Gentamicin": {
    "activeIngredient": "gentamicin sulfate",
    "dosageForms": [
      "larutan injeksi"
    ],
    "route": [
      "IV",
      "IM"
    ],
    "formulationNote": "Konsentrasi ampul berbeda antarproduk; hitung dosis berdasarkan mg dan volume aktual setelah memeriksa label.",
    "prescriptionStatus": "prescription_only",
    "doseEngineFunction": "gentamicinInitial",
    "keyWarnings": [
      "Risiko nefrotoksisitas dan ototoksisitas; evaluasi fungsi ginjal.",
      "Regimen dan interval perlu mempertimbangkan usia gestasi/neonatal, fungsi ginjal, indikasi, dan pemantauan kadar bila tersedia.",
      "Jangan mengasumsikan dosis awal tunggal sebagai regimen lengkap."
    ],
    "provenance": {
      "activeIngredient": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "dosageForms": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "route": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "formulationNote": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "strength": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "prescriptionStatus": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "keyWarnings": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "doseEngineFunction": {
        "status": "verified_by_local_regression_test",
        "sourceRefs": []
      }
    }
  },
  "Cendo Xitrol Tetes Mata": {
    "activeIngredient": "dexamethasone, neomycin sulfate, polymyxin B sulfate",
    "dosageForms": [
      "suspensi tetes mata"
    ],
    "route": [
      "ophthalmic"
    ],
    "formulationNote": "Komposisi dan satuan kekuatan harus dicocokkan dengan nomor registrasi serta etiket produk yang digunakan.",
    "prescriptionStatus": "prescription_only",
    "doseEngineFunction": null,
    "keyWarnings": [
      "Mengandung kortikosteroid mata; bukan terapi empiris untuk semua mata merah.",
      "Hindari pada dugaan keratitis herpes simpleks, infeksi jamur, atau infeksi mata yang belum dievaluasi.",
      "Steroid dapat meningkatkan tekanan intraokular, memperburuk infeksi, dan menunda penyembuhan; perlu evaluasi dokter mata."
    ],
    "provenance": {
      "activeIngredient": {
        "status": "source_linked_reference",
        "sourceRefs": [
          "bpom_cendo_xitrol_drop",
          "halodoc_cendo_xitrol_drop"
        ]
      },
      "dosageForms": {
        "status": "source_linked_reference",
        "sourceRefs": [
          "bpom_cendo_xitrol_drop",
          "halodoc_cendo_xitrol_drop"
        ]
      },
      "route": {
        "status": "source_linked_reference",
        "sourceRefs": [
          "bpom_cendo_xitrol_drop",
          "halodoc_cendo_xitrol_drop"
        ]
      },
      "formulationNote": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "strength": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "prescriptionStatus": {
        "status": "source_linked_reference",
        "sourceRefs": [
          "halodoc_cendo_xitrol_drop"
        ]
      },
      "keyWarnings": {
        "status": "source_linked_reference",
        "sourceRefs": [
          "halodoc_cendo_xitrol_drop"
        ]
      },
      "doseEngineFunction": {
        "status": "verified_by_local_regression_test",
        "sourceRefs": []
      }
    }
  },
  "Cendo Xitrol Salep Mata": {
    "activeIngredient": "dexamethasone, neomycin sulfate, polymyxin B sulfate",
    "dosageForms": [
      "salep mata"
    ],
    "route": [
      "ophthalmic"
    ],
    "formulationNote": "Kekuatan per gram dan kemasan harus dicocokkan dengan etiket produk; jangan menyalin komposisi tetes mata.",
    "prescriptionStatus": "prescription_only",
    "doseEngineFunction": null,
    "keyWarnings": [
      "Mengandung kortikosteroid mata; bukan terapi empiris untuk semua mata merah.",
      "Hindari pada dugaan keratitis herpes simpleks, infeksi jamur, atau infeksi mata yang belum dievaluasi.",
      "Steroid dapat meningkatkan tekanan intraokular, memperburuk infeksi, dan menunda penyembuhan; perlu evaluasi dokter mata."
    ],
    "provenance": {
      "activeIngredient": {
        "status": "source_linked_reference",
        "sourceRefs": [
          "halodoc_cendo_xitrol_ointment"
        ]
      },
      "dosageForms": {
        "status": "source_linked_reference",
        "sourceRefs": [
          "halodoc_cendo_xitrol_ointment"
        ]
      },
      "route": {
        "status": "source_linked_reference",
        "sourceRefs": [
          "halodoc_cendo_xitrol_ointment"
        ]
      },
      "formulationNote": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "strength": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "prescriptionStatus": {
        "status": "source_linked_reference",
        "sourceRefs": [
          "halodoc_cendo_xitrol_ointment"
        ]
      },
      "keyWarnings": {
        "status": "source_linked_reference",
        "sourceRefs": [
          "halodoc_cendo_xitrol_ointment"
        ]
      },
      "doseEngineFunction": {
        "status": "verified_by_local_regression_test",
        "sourceRefs": []
      }
    }
  },
  "Erlamycetin Tetes Mata": {
    "activeIngredient": "chloramphenicol",
    "dosageForms": [
      "tetes mata"
    ],
    "route": [
      "ophthalmic"
    ],
    "strength": "0.5% (produk yang tercantum pada referensi)",
    "prescriptionStatus": "verify_local_label",
    "doseEngineFunction": null,
    "keyWarnings": [
      "Pastikan diagnosis infeksi bakteri dan indikasi penggunaan.",
      "Periksa alergi kloramfenikol serta petunjuk usia pada informasi produk.",
      "Jangan gunakan sediaan tetes telinga sebagai pengganti tetes mata."
    ],
    "provenance": {
      "activeIngredient": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "dosageForms": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "route": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "formulationNote": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "strength": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "prescriptionStatus": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "keyWarnings": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "doseEngineFunction": {
        "status": "verified_by_local_regression_test",
        "sourceRefs": []
      }
    }
  },
  "Erlamycetin Tetes Telinga": {
    "activeIngredient": "chloramphenicol",
    "dosageForms": [
      "tetes telinga"
    ],
    "route": [
      "otic"
    ],
    "formulationNote": "Konsentrasi tidak dipatok dalam database ini; verifikasi label dan nomor registrasi produk yang tersedia.",
    "prescriptionStatus": "verify_local_label",
    "doseEngineFunction": null,
    "keyWarnings": [
      "Pastikan sediaan memang berlabel untuk telinga; jangan substitusi dengan tetes mata tanpa instruksi klinis.",
      "Evaluasi kondisi membran timpani, diagnosis, dan kemungkinan otore/komplikasi sebelum terapi.",
      "Konsentrasi dan aturan pakai wajib mengikuti informasi produk yang benar."
    ],
    "provenance": {
      "activeIngredient": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "dosageForms": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "route": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "formulationNote": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "strength": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "prescriptionStatus": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "keyWarnings": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "doseEngineFunction": {
        "status": "verified_by_local_regression_test",
        "sourceRefs": []
      }
    }
  },
  "Erlamycetin Salep Mata": {
    "activeIngredient": "chloramphenicol",
    "dosageForms": [
      "salep mata"
    ],
    "route": [
      "ophthalmic"
    ],
    "strength": "1% (produk yang tercantum pada formularium rujukan)",
    "prescriptionStatus": "verify_local_label",
    "doseEngineFunction": null,
    "keyWarnings": [
      "Pastikan diagnosis infeksi bakteri dan indikasi penggunaan.",
      "Periksa alergi kloramfenikol serta petunjuk usia pada informasi produk.",
      "Jangan tertukar dengan konsentrasi tetes mata."
    ],
    "provenance": {
      "activeIngredient": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "dosageForms": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "route": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "formulationNote": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "strength": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "prescriptionStatus": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "keyWarnings": {
        "status": "pending_product_specific_verification",
        "sourceRefs": []
      },
      "doseEngineFunction": {
        "status": "verified_by_local_regression_test",
        "sourceRefs": []
      }
    }
  }
};
})(window);
