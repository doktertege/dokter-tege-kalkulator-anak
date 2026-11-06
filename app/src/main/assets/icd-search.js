/* Indonesian complaint keyword search for the curated WHO ICD-10 subset. */
(function (root) {
  "use strict";
  const aliases = {
    "panas":["R50.9"],"badan panas":["R50.9"],"meriang":["R50.9"],"febris":["R50.9"],
    "pilek":["J00","J06.9"],"hidung meler":["J00","J06.9"],"flu":["J00","J06.9"],"selesma":["J00"],
    "batuk":["R05","J20.9"],"batuk berdahak":["R05","J20.9"],"batuk kering":["R05"],
    "sakit tenggorokan":["J02.9"],"nyeri tenggorokan":["J02.9"],"radang tenggorokan":["J02.9"],
    "amandel":["J03.9"],"tonsil bengkak":["J03.9"],"sesak":["R06.0"],"sesak napas":["R06.0"],"napas pendek":["R06.0"],
    "nyeri dada":["R07.4"],"dada sakit":["R07.4"],"dada terasa sakit":["R07.4"],
    "sakit kepala":["R51","G44.2"],"pusing":["R42"],"vertigo":["R42","H81.1"],"kepala berputar":["R42","H81.1"],
    "mual":["R11"],"muntah":["R11"],"mual muntah":["R11"],
    "diare":["R19.7","A09"],"mencret":["R19.7","A09"],"bab cair":["R19.7","A09"],
    "sakit perut":["R10.9"],"nyeri perut":["R10.9"],"nyeri abdomen":["R10.9"],"perut melilit":["R10.9"],
    "nyeri ulu hati":["K30","K29.7"],"perih lambung":["K29.7","K30"],"maag":["K29.7","K30"],"kembung":["K30"],
    "susah bab":["K59.0"],"sembelit":["K59.0"],"konstipasi":["K59.0"],
    "kencing sakit":["N30.0","N39.0"],"anyang anyangan":["N30.0","N39.0"],"sering kencing":["N39.0"],
    "kencing berdarah":["R31"],"susah kencing":["R33"],"tidak bisa kencing":["R33"],"retensi urine":["R33"],
    "jantung berdebar":["R00.2"],"berdebar":["R00.2"],"palpitasi":["R00.2"],
    "lemas":["R53"],"mudah lelah":["R53"],"kelelahan":["R53"],"badan pegal":["M79.1"],"nyeri otot":["M79.1"],
    "nyeri sendi":["M25.5"],"sendi sakit":["M25.5"],"nyeri pinggang":["M54.5"],"sakit pinggang":["M54.5"],
    "mimisan":["R04.0"],"hidung berdarah":["R04.0"],"pingsan":["R55"],"sinkop":["R55"],
    "kejang demam":["R56.0"],"kejang":["R56.0","G40.9"],
    "mata merah":["H10.9"],"belekan":["H10.9"],"sakit telinga":["H60.9","H66.9"],"telinga nyeri":["H60.9","H66.9"],
    "gatal bentol":["L50.9"],"biduran":["L50.9"],"bentol gatal":["L50.9"],
    "luka":["T14.9"],"cedera kepala":["S09.9","S06.0"],"keseleo":["S93.4"]
  };
  function normalize(value) {
    return String(value || "").toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9. ]/g, " ").replace(/\s+/g, " ").trim();
  }
  function searchIcdRows(query, rows) {
    const source = Array.isArray(rows) ? rows : [];
    const q = normalize(query);
    const tokens = q.split(" ").filter(Boolean);
    const scored = new Map();
    if (!q) return source.map(row => ({ row, score: 0, matchedBy: "" }));
    source.forEach(row => {
      const hay = normalize(row.join(" "));
      if (hay.includes(q)) scored.set(row[0], { row, score: 100, matchedBy: "Teks diagnosis/kode" });
      else if (tokens.length > 1 && tokens.every(token => hay.includes(token))) {
        scored.set(row[0], { row, score: 70, matchedBy: "Kata kunci" });
      }
    });
    Object.entries(aliases).forEach(([alias, codes]) => {
      const parts = normalize(alias).split(" ");
      if (q.includes(normalize(alias)) || parts.every(part => tokens.includes(part))) {
        codes.forEach(code => {
          const row = source.find(item => item[0] === code);
          if (!row) return;
          const score = 90 + parts.length;
          const previous = scored.get(code);
          if (!previous || score > previous.score) {
            scored.set(code, { row, score, matchedBy: "Kata kunci keluhan" });
          }
        });
      }
    });
    return [...scored.values()].sort((a, b) => b.score - a.score || a.row[0].localeCompare(b.row[0]));
  }
  root.MEDORA_ICD_SEARCH = { searchIcdRows, normalize };
  if (typeof module !== "undefined" && module.exports) module.exports = { searchIcdRows, normalize };
})(typeof window !== "undefined" ? window : globalThis);
