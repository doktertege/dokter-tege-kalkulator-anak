# MEDORA Clinical Dose Audit

**Status:** preliminary source comparison  
**Scope:** active pediatric dose calculators in `app/src/main/assets/index.html`  
**Important:** this document records a preliminary audit, not clinical approval. No medication formula was changed during this review.

## Review principles

- Dose calculations must be tied to a specific indication, age range, route, formulation, and maximum dose.
- The app must display the concentration used for volume conversion and must not infer a product concentration from a brand name.
- Renal/hepatic adjustment, contraindications, allergy history, and clinical severity remain clinician responsibilities unless explicitly implemented and validated.
- A mathematically correct calculation is not a prescribing recommendation.

## Preliminary comparison

| Medication | Current implementation | Source comparison | Preliminary status |
|---|---|---|---|
| Paracetamol oral | 10–15 mg/kg/dose; interval 4–6 h; max 4 doses/24 h; conservative daily cap min(60 mg/kg, 4 g) | Indonesian fever protocol search result supports 10–15 mg/kg/dose q4–6h and a daily maximum range of 60–90 mg/kg/day. The app's 60 mg/kg/day ceiling is conservative. | No arithmetic discrepancy identified. Keep the conservative ceiling unless a deliberate policy change is approved. |
| Ibuprofen oral | 5–10 mg/kg/dose q6–8h; per-dose cap 400 mg; daily cap min(40 mg/kg, 1,200 mg); age gate 6 months | Indonesian fever protocol search result supports 5–10 mg/kg/dose q6–8h and MDD 30–40 mg/kg/day. | Formula is within a conservative range. Continue to display dehydration, renal, GI bleeding/ulcer, NSAID hypersensitivity and suspected dengue cautions. |
| Amoxicillin oral | GAS: 25 mg/kg/dose q12h (max 500 mg/dose) or 50 mg/kg once daily (max 1 g/day), 10 days. AOM: 80–90 mg/kg/day divided q12h, max 3 g/day. | CDC GAS guidance supports both GAS regimens and maxima. AAP AOM guidance supports 80–90 mg/kg/day divided twice daily. | Regimens align with cited guidance. The app correctly states that AOM duration is not calculated and must be individualized. |
| Cefadroxil oral | 30 mg/kg once daily, max 1 g, 10 days; restricted to selected bacterial tonsillitis/GAS context | CDC GAS guidance supports 30 mg/kg once daily, max 1 g, for 10 days; avoid in immediate-type penicillin hypersensitivity. | Dose matches cited guidance. Keep indication and allergy restrictions prominent. |
| Cefixime oral | 8 mg/kg/day, once daily or divided q12h; max 400 mg/day; age 6 months to <12 years | DailyMed label supports 8 mg/kg/day in pediatric patients aged 6 months and older and adult maximum 400 mg/day. | Dose and age floor align with label. Product-specific indication, renal adjustment and duration still require prescriber review. |
| Cetirizine oral | Age-band starting doses: 2.5 mg daily (6 months–5 years), 5 mg daily (6–11 years), 10 mg daily (≥12 years); maximum 10 mg/day stated | DailyMed label supports 2.5 mg daily in 6–23 months and 2–5 years as an initial dose, with permitted escalation depending on age/indication. | Conservative starting-dose approach. Verify Indonesian product leaflet and indication-specific age limits before expanding escalation options. |
| Zinc for diarrhea | Indonesia regimen 10 mg/day under 6 months and 20 mg/day from 6 months–5 years; optional WHO 2024 5 mg/day up to 14 days through age 10 | WHO 2024 guideline suggests 5 mg/day for up to 14 days for acute watery or persistent diarrhea in children up to 10 years; conditional recommendation, low certainty. | App correctly distinguishes the national regimen from the newer WHO option. Preserve the explicit guideline choice and elemental-zinc warning. |
| Salbutamol nebulization | 2.5 mg (1–5 years), 2.5–5 mg (6–11 years), 5 mg (≥12 years); repeat q20 min up to 3 doses in first hour for moderate/severe exacerbation | This is a protocol-dependent acute-asthma regimen. The next review must compare against the facility's adopted asthma exacerbation guideline and verify age/weight-specific product instructions. | Not signed off in this preliminary pass. Keep indication restricted to clinically assessed bronchospasm/asthma; not routine bronchiolitis or undifferentiated cough/dyspnea. |

## Issues to resolve before clinical sign-off

1. **Source localization:** add Indonesian product leaflets (BPOM-approved product information) for the actual marketed concentrations and age indications used by the clinic.
2. **Amoxicillin indication specificity:** ensure the GAS options are not mistaken for generic tonsillitis treatment; GAS should be clinically/test confirmed according to local guidance.
3. **Cefadroxil allergy safety:** maintain the warning against use in immediate-type penicillin hypersensitivity.
4. **Cefixime:** add indication-specific guidance and ensure renal adjustment is visibly outside the automated calculation.
5. **Cetirizine:** verify age/indication-specific doses against Indonesian leaflet(s), especially infant use and dose escalation.
6. **Salbutamol:** align the nebulization choices and repeat schedule with the clinic's current acute asthma protocol. Consider explicit patient weight, severity, response reassessment and maximum repeat dose logic.
7. **Patient age boundary:** review whether age 18 should remain accepted in a pediatric calculator or be redirected to adult dosing pathways.
8. **Automated tests:** add dose calculation tests for minimum/maximum age, weight boundaries, concentration conversion, dose caps and daily maximums before changing any clinical formula.

## Sources reviewed

- CDC. Clinical Guidance for Group A Streptococcal Pharyngitis: https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/strep-throat.html
- American Academy of Pediatrics. The Diagnosis and Management of Acute Otitis Media: https://publications.aap.org/pediatrics/article/131/3/e964/30912/The-Diagnosis-and-Management-of-Acute-Otitis
- DailyMed. Cefixime for oral suspension prescribing information: https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=068e6edd-a5fe-40d8-8dcf-ac82b78dced4
- DailyMed. Cetirizine hydrochloride oral solution prescribing information: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=71448ab0-e23e-4cf7-940e-7d67e7362fb4
- WHO. Guideline on management of pneumonia and diarrhoea in children up to 10 years of age (2024): https://www.ncbi.nlm.nih.gov/books/NBK611550/
- Protokol Penanganan Demam pada Anak di Bawah 5 Tahun di Fasilitas Kesehatan Tingkat Pertama (search result copy): https://www.haleonhealthpartner.com/content/dam/cf-consumer-healthcare/health-professionals/id_ID/hpmi/pdf/fever-nder-5-protocol.pdf

## Change control

Do not change a dose formula solely to make the output match a single generic reference. Record the indication, source, formulation, maximum dose and rationale in this file, then add reproducible boundary tests before merging the clinical change.


## Focused review: salbutamol nebulization (6 November 2026)

### Current app behavior

- Automatic calculation is disabled below 12 months.
- 1–5 years: 2.5 mg per nebulization.
- 6–11 years: selectable 2.5 mg or 5 mg.
- 12 years and older: 5 mg.
- The result panel displays repeat dosing every 20 minutes, up to 3 doses in the first hour, for moderate/severe exacerbation.

### Evidence found

- **GINA 2025**, management of acute asthma/wheeze in children 5 years and younger, lists 2.5 mg nebulized salbutamol as the initial dose; for moderate exacerbation, further doses may be considered every 20 minutes for 2 additional doses if needed. It emphasizes close monitoring, reassessment and escalation for severe features or poor response. GINA's November 2025 update corrected a previously published typographical dose error; use the corrected report.  
  https://ginasthma.org/wp-content/uploads/2025/11/GINA-2025-Update-25_11_08-WMS.pdf  
  https://ginasthma.org/minor-update-to-gina-2025-report-and-good-news-about-access-to-gina-resources/
- **Pedoman Nasional Asma Anak (IDAI)** page for the national guideline (2017 edition) describes the Indonesian pediatric asthma guideline and emphasizes tailored management.  
  https://www.idai.or.id/publications/buku-idai/pedoman-nasional-asma-anak
- A searchable copy of **Pedoman Nasional Asma Anak 2022** lists 2.5 mg (one ampoule) per nebulization and repeat intervals of 20 minutes during the first hour, with subsequent frequency depending on severity/response. Because the available copy is hosted by a third-party document-sharing site, obtain and verify the official publication before treating it as the definitive local source.  
  https://id.scribd.com/document/857413858/Buku-Pedoman-Nasional-Asma-Anak-2023-3

### Clinical interpretation and decision

1. The current 2.5 mg dose for ages 1–5 is consistent with the cited GINA 2025 initial dose and the searchable Indonesian guideline text.
2. The 5 mg option for ages 6–11 is **not validated by the sources reviewed in this focused pass**. Do not retain it as an approved default without confirming an official local protocol or product-specific guidance that supports it.
3. A fixed age-only dose for all children is incomplete. Weight, severity, route/device, formulation, response, heart rate, oxygenation and local escalation protocol matter.
4. The q20-minute schedule must be presented as a time-limited acute-exacerbation protocol, not a routine frequency for every wheezing patient. It requires reassessment after each treatment and escalation when response is inadequate.
5. pMDI with spacer is preferred for many children when feasible; nebulization should not be represented as universally superior.
6. Bronchiolitis in infants must remain distinct from asthma/bronchospasm; salbutamol is not routine treatment for typical bronchiolitis.
7. Before formula changes, request the clinic's adopted acute-asthma protocol and verify the exact marketed nebule strengths and product leaflets in Indonesia.

### Implementation status

**No dose logic changed.** Salbutamol remains flagged for clinical sign-off. The unresolved 5 mg option for ages 6–11 and the age-only dosing design should be reviewed against the clinic's adopted protocol before enabling a revised formula.
