"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const html = fs.readFileSync(
  path.join(__dirname, "../app/src/main/assets/index.html"),
  "utf8"
);

function element() {
  const listeners = {};
  return {
    listeners,
    style: {},
    value: "",
    textContent: "",
    innerHTML: "",
    addEventListener(type, callback) { listeners[type] = callback; },
    fire(type, event = {}) { if (listeners[type]) listeners[type](event); }
  };
}

function harness() {
  const elements = new Map();
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, element());
      return elements.get(id);
    }
  };
  const window = { scrollTo() {} };
  const start = html.indexOf("const publicHealthArticles=[");
  const end = html.indexOf("const medicineProfiles =", start);
  assert.ok(start >= 0 && end > start, "public health module source should be present");
  const source = html.slice(start, end);
  const context = {
    document,
    window,
    $: id => document.getElementById(id)
  };
  vm.runInNewContext(source, context);
  return { elements, source };
}

test("general area renders all public education topics and category filters", () => {
  const { elements } = harness();
  const count = elements.get("publicCount").textContent;
  assert.match(count, /11 panduan ditemukan/);
  assert.match(elements.get("publicFilters").innerHTML, /data-public-cat="Semua"/);
  assert.match(elements.get("publicArticles").innerHTML, /data-article="fever"/);
  assert.match(elements.get("publicArticles").innerHTML, /data-article="diarrhea"/);
});

test("public topic search filters the visible article list and supports empty results", () => {
  const { elements } = harness();
  const search = elements.get("publicSearch");
  search.value = "demam";
  search.fire("input");
  assert.match(elements.get("publicArticles").innerHTML, /data-article="fever"/);
  assert.doesNotMatch(elements.get("publicArticles").innerHTML, /data-article="diarrhea"/);
  assert.match(elements.get("publicCount").textContent, /^1 panduan ditemukan/);

  search.value = "topik-yang-tidak-ada";
  search.fire("input");
  assert.match(elements.get("publicArticles").innerHTML, /Topik belum ditemukan/);
});

test("category filter redraws the list and retains search behavior", () => {
  const { elements } = harness();
  const filters = elements.get("publicFilters");
  filters.fire("click", {
    target: {
      closest(selector) {
        assert.equal(selector, "[data-public-cat]");
        return { dataset: { publicCat: "Anak" } };
      }
    }
  });
  assert.match(elements.get("publicArticles").innerHTML, /data-article="fever"/);
  assert.doesNotMatch(elements.get("publicArticles").innerHTML, /data-article="diarrhea"/);
  assert.match(filters.innerHTML, /data-public-cat="Anak" class="active"/);
});

test("opening an article displays its detail and back returns to the topic list", () => {
  const { elements } = harness();
  elements.get("publicArticles").fire("click", {
    target: {
      closest(selector) {
        assert.equal(selector, "[data-article]");
        return { dataset: { article: "fever" } };
      }
    }
  });
  assert.equal(elements.get("publicListView").style.display, "none");
  assert.equal(elements.get("publicDetailView").style.display, "block");
  assert.match(elements.get("publicArticleBody").innerHTML, /Demam pada anak/);
  assert.match(elements.get("publicArticleBody").innerHTML, /Segera cari pertolongan medis/);

  elements.get("publicDetailBack").fire("click");
  assert.equal(elements.get("publicDetailView").style.display, "none");
  assert.equal(elements.get("publicListView").style.display, "block");
});

test("unknown article identifiers do not open a blank detail page", () => {
  const { elements } = harness();
  elements.get("publicArticles").fire("click", {
    target: {
      closest() { return { dataset: { article: "not-a-real-topic" } }; }
    }
  });
  assert.notEqual(elements.get("publicDetailView").style.display, "block");
});
