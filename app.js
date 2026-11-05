/* =========================================================
 * 853 数据结构 · 考纲教学与真题库
 * ========================================================= */
(function () {
  "use strict";

  const BANK = window.BANK;
  const app = document.getElementById("app");
  const tabsEl = document.getElementById("tabs");

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  // 只允许 <b> 和 </b> 标签，其余 HTML 特殊字符一律转义
  function sanitizeTrustedHtml(s) {
    return String(s == null ? "" : s)
      .split(/(<\/?b>)/)
      .map(part => {
        if (part === "<b>" || part === "</b>") return part;
        return part.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      })
      .join("");
  }
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  const typeBadge = {
    "选择题": "type-选择题", "解答题": "type-解答题",
    "算法设计题": "type-算法设计题", "综合题": "type-综合题",
    "程序设计题": "type-算法设计题", "填空题": "type-选择题",
    "名词解释": "type-解答题", "问答题": "type-解答题",
    "简答题": "type-解答题", "分析题": "type-综合题",
    "计算题": "type-解答题", "应用题": "type-解答题",
  };
  function badge(text, cls, title) {
    return `<span class="badge ${cls}"${title ? ` title="${esc(title)}"` : ""}>${esc(text)}</span>`;
  }
  const schoolBadge = {
    "中央民族大学": "school-mzu",
    "贵州大学": "school-gzu",
    "湖南大学": "school-hnu",
  };
  function schoolBadgeHtml(s) {
    const short = s === "中央民族大学" ? "民大" : (s === "贵州大学" ? "贵大" : (s === "湖南大学" ? "湖大" : s));
    return badge(short, schoolBadge[s] || "", s);
  }
  function typeBadgeHtml(t) { return badge(t, typeBadge[t] || ""); }

  /* ---------- question card ---------- */
  function questionCard(q) {
    const card = el("div", "qcard");
    let html = `<div class="qmeta">
      ${schoolBadgeHtml(q.school || "中央民族大学")}
      ${badge(q.year + "年", "year")}
      ${typeBadgeHtml(q.type)}
      ${q.score != null ? `<span class="score">${esc(q.score)} 分</span>` : ""}
      ${q.recall ? badge("回忆版", "recall", "题面可能不完整") : ""}
    </div>
    <div class="qstem">${esc(q.stem)}</div>`;

    if (q.options) {
      html += `<div class="qopts">` +
        Object.entries(q.options).map(([k, v]) =>
          `<div class="qopt" data-k="${k}"><span class="l">${esc(k)}.</span><span>${esc(v)}</span></div>`
        ).join("") + `</div>`;
    }
    html += `<button class="reveal-btn">查看答案 / 解析</button>
      <div class="answer-box">
        <div class="al">参考答案</div>
        <div class="ab">${esc(q.answer == null ? "（暂无答案）" : q.answer)}</div>
        ${q.analysis ? `<div class="an"><span class="lab">解析</span>${esc(q.analysis)}</div>` : ""}
      </div>`;
    if (q.note) html += `<div class="qnote">${esc(q.note)}</div>`;

    card.innerHTML = html;
    const btn = card.querySelector(".reveal-btn");
    const box = card.querySelector(".answer-box");
    btn.addEventListener("click", () => {
      const open = box.classList.toggle("open");
      btn.textContent = open ? "收起答案 / 解析" : "查看答案 / 解析";
      if (q.options && q.answer && /^[A-D]$/.test(String(q.answer))) {
        card.querySelectorAll(".qopt").forEach(o =>
          o.classList.toggle("correct", open && o.dataset.k === q.answer));
      }
    });
    return card;
  }

  /* ---------- example card ---------- */
  function exampleCard(x) {
    const card = el("div", "qcard");
    card.innerHTML = `<div class="qmeta">
        ${badge("例题", "year")}
        ${typeBadgeHtml(x.type)}
      </div>
      <div class="qstem">${esc(x.stem)}</div>
      <button class="reveal-btn">查看解法</button>
      <div class="answer-box">
        <div class="al">解法</div>
        <div class="ab">${esc(x.solution || "（资料上解法依赖图示，此处省略）")}</div>
      </div>`;
    const btn = card.querySelector(".reveal-btn");
    const box = card.querySelector(".answer-box");
    btn.addEventListener("click", () => {
      const open = box.classList.toggle("open");
      btn.textContent = open ? "收起解法" : "查看解法";
    });
    return card;
  }

  /* ---------- blocks renderer (teaching) ---------- */
  function renderBlocks(blocks) {
    const frag = document.createDocumentFragment();
    blocks.forEach(b => {
      const wrapEl = el("div", "bk");
      if (b.h) wrapEl.appendChild(el("div", "bk-h", esc(b.h)));
      switch (b.k) {
        case "text":
          wrapEl.appendChild(el("p", null, sanitizeTrustedHtml(b.p)));
          break;
        case "points":
          wrapEl.appendChild(el("ul", null,
            (b.items || []).map(i => `<li>${sanitizeTrustedHtml(i)}</li>`).join("")));
          break;
        case "formula":
          wrapEl.appendChild(el("div", "formula-list",
            (b.items || []).map(f =>
              `<div class="formula-item"><span class="fn">${esc(f.n)}</span><span class="fe">${esc(f.e)}</span></div>`
            ).join("")));
          break;
        case "code": {
          if (b.title) wrapEl.appendChild(el("div", "code-title", esc(b.title)));
          wrapEl.appendChild(el("pre", "code-block", esc(b.body)));
          break;
        }
        case "table": {
          wrapEl.appendChild(el("table", "data",
            `<thead><tr>${b.headers.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead>
             <tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody>`));
          break;
        }
        case "callout":
          wrapEl.appendChild(el("div", `callout ${b.type || "tip"}`,
            `<span class="ct">${b.type === "warn" ? "注意" : "点拨"}</span>${sanitizeTrustedHtml(b.p)}`));
          break;
      }
      frag.appendChild(wrapEl);
    });
    return frag;
  }

  function toggleSection(title, contentNode, openDefault) {
    const btn = el("button", "subsection-toggle" + (openDefault ? " open" : ""),
      `${esc(title)} <span class="arrow">▶</span>`);
    const body = el("div", "subsection-body" + (openDefault ? " open" : ""));
    body.appendChild(contentNode);
    btn.addEventListener("click", () => {
      btn.classList.toggle("open");
      body.classList.toggle("open");
    });
    return { btn, body };
  }

  /* =========================================================
   * VIEW: overview
   * ========================================================= */
  function renderOverview() {
    const m = BANK.meta;
    const frag = document.createDocumentFragment();

    const hero = el("div", "hero");
    hero.innerHTML = `
      <h2>${esc(m.subject)}</h2>
      <p class="desc">硕士研究生入学考试初试科目 · 考纲教学 + 历年真题分类</p>
      <div class="facts">
        <div class="fact"><div class="v">${m.full_score}</div><div class="l">试卷满分</div></div>
        <div class="fact"><div class="v">${m.minutes}<span style="font-size:14px"> 分钟</span></div><div class="l">考试时间</div></div>
        <div class="fact"><div class="v" style="font-size:18px;padding-top:3px">闭卷 · 笔试</div><div class="l">答题方式</div></div>
        <div class="fact"><div class="v" style="font-size:15px;padding-top:6px">${m.typesmapToChips()}</div><div class="l">试卷题型</div></div>
        <div class="fact"><div class="v">${BANK.questions.length}</div><div class="l">题库总题数</div></div>
        <div class="fact"><div class="v" style="font-size:16px;padding-top:5px">${BANK.schools.length} 所院校</div><div class="l">真题来源</div></div>
      </div>`;
    frag.appendChild(hero);

    const c1 = el("div", "card");
    c1.innerHTML = `<h2>考查目标</h2><p style="font-size:14px">${esc(m.target)}</p>`;
    frag.appendChild(c1);

    /* years */
    const c2 = el("div", "card");
    c2.appendChild(el("h2", null, "真题年份总览"));
    const yrGrid = el("div", "grid grid-4");
    BANK.exams.forEach(e => {
      const d = el("div", "exam-year");
      d.innerHTML = `<div class="top">
          <span class="yr">${esc(e.label)}</span>
          ${e.complete ? badge("完整", "answer") : badge("回忆版", "recall")}
        </div>
        <div class="nt">${e.has_answer ? "✓ 含参考答案" : "暂无答案"}</div>
        <div class="nt">${esc(e.note)}</div>`;
      yrGrid.appendChild(d);
    });
    c2.appendChild(yrGrid);
    frag.appendChild(c2);

    /* syllabus accordion */
    const c3 = el("div", "card");
    c3.appendChild(el("h2", null, "考查范围（考纲）"));
    BANK.syllabus.forEach((c, i) => {
      const box = el("div", "syl-chapter");
      const head = el("button", "syl-head",
        `<span class="num">${i + 1}</span>${esc(c.title)}<span class="arrow">▶</span>`);
      const body = el("div", "syl-body",
        `<ul>${c.sections.map(s => `<li>${esc(s)}</li>`).join("")}</ul>`);
      head.addEventListener("click", () => box.classList.toggle("open"));
      box.appendChild(head); box.appendChild(body);
      c3.appendChild(box);
    });
    frag.appendChild(c3);

    /* books */
    const c4 = el("div", "card");
    c4.innerHTML = `<h2>参考书目</h2><ul style="padding-left:20px;font-size:14px">
      ${m.books.map(b => `<li style="margin-bottom:6px">${esc(b)}</li>`).join("")}</ul>`;
    frag.appendChild(c4);

    /* other schools */
    if (BANK.other_exams && BANK.other_exams.length) {
      const c5 = el("div", "card");
      c5.appendChild(el("h2", null, "其他院校真题（拓展练习）"));
      c5.appendChild(el("p", null,
        "以下院校真题用于拓展练习，已与中央民族大学真题区分。贵州大学考「程序设计与数据结构」，其中纯 C 语言题已按要求排除，仅保留数据结构部分。"));
      const bySchool = {};
      BANK.other_exams.forEach(e => {
        (bySchool[e.school] = bySchool[e.school] || []).push(e);
      });
      for (const s of BANK.schools.slice(1)) {
        const exams = bySchool[s.name] || [];
        if (!exams.length) continue;
        const card = el("div", "exam-year");
        const years = exams.map(e => e.year).sort((a, b) => b - a);
        const total = exams.reduce((a, e) => a + e.count, 0);
        card.innerHTML = `<div class="top">
            <span class="yr">${esc(s.name)}</span>
            ${badge(s.code, "year", "科目代码")}
          </div>
          <div class="nt">真题年份：${years.join("、")}</div>
          <div class="nt">共 <b>${total}</b> 道数据结构题</div>
          <div class="nt">${esc(s.note)}</div>`;
        c5.appendChild(card);
      }
      frag.appendChild(c5);
    }

    return frag;
  }

  /* meta helper injected into hero */
  BANK.meta.typesmapToChips = function () {
    return this.types.map(t => esc(t)).join(" · ");
  };

  /* =========================================================
   * VIEW: teaching
   * ========================================================= */
  let currentChapter = BANK.teaching[0].id;

  function renderTeaching(chapterId) {
    currentChapter = chapterId || currentChapter;
    const ch = BANK.teaching.find(c => c.id === currentChapter) || BANK.teaching[0];
    const layout = el("div", "teaching-layout");

    /* nav */
    const nav = el("div", "chapter-nav");
    BANK.teaching.forEach((c, i) => {
      const cnt = BANK.questions.filter(q => q.chapter === c.title).length;
      const b = el("button", c.id === ch.id ? "on" : null,
        `<span class="n">${i + 1}</span><span>${esc(c.title)}</span><span class="cnt">${cnt} 题</span>`);
      b.addEventListener("click", () => {
        location.hash = `teaching/${c.id}`;
        renderTeaching(c.id);
        window.scrollTo({ top: 0 });
      });
      nav.appendChild(b);
    });
    layout.appendChild(nav);

    /* content */
    const content = el("div");
    const idx = BANK.syllabus.findIndex(s => s.id === ch.id) + 1;
    content.appendChild(el("div", "chapter-title",
      `<h2>${esc(ch.title)}</h2><span class="cn">第 ${idx} 章</span>`));
    content.appendChild(el("p", "lead", esc(ch.lead)));
    content.appendChild(renderBlocks(ch.blocks));

    /* talk */
    const talk = el("div", "talk-box");
    talk.innerHTML = `<div class="t">考场串讲</div><p>${esc(ch.talk)}</p>`;
    content.appendChild(talk);

    /* must know */
    const mustCard = el("div", "card");
    mustCard.appendChild(el("h2", null, "必背结论"));
    mustCard.appendChild(el("div", "must-grid",
      ch.must.map(x => `<div class="must-item">${esc(x)}</div>`).join("")));
    content.appendChild(mustCard);

    /* chapter questions */
    const qs = BANK.questions.filter(q => q.chapter === ch.title)
      .sort((a, b) => a.year - b.year || a.no.localeCompare(b.no, "zh"));
    if (qs.length) {
      const node = document.createDocumentFragment();
      qs.forEach(q => node.appendChild(questionCard(q)));
      const sec = toggleSection(`本章真题（${qs.length}）`, node);
      content.appendChild(sec.btn);
      content.appendChild(sec.body);
    }

    /* examples */
    const exs = BANK.examples.filter(x => x.chapter === ch.title);
    if (exs.length) {
      const node = document.createDocumentFragment();
      exs.forEach(x => node.appendChild(exampleCard(x)));
      const sec = toggleSection(`配套精讲例题（${exs.length}）`, node);
      content.appendChild(sec.btn);
      content.appendChild(sec.body);
    }

    /* templates */
    const tpls = BANK.templates.filter(t => t.chapter === ch.title);
    if (tpls.length) {
      const node = document.createDocumentFragment();
      tpls.forEach(t => {
        const w = el("div", "bk");
        w.appendChild(el("div", "code-title", esc(t.title)));
        w.appendChild(el("pre", "code-block", esc(t.body)));
        node.appendChild(w);
      });
      const sec = toggleSection(`算法模板（${tpls.length}）`, node);
      content.appendChild(sec.btn);
      content.appendChild(sec.body);
    }

    layout.appendChild(content);
    return layout;
  }

  /* =========================================================
   * VIEW: bank (filters)
   * ========================================================= */
  const filterState = { years: new Set(), chapters: new Set(), types: new Set(), schools: new Set(), q: "", onlyAnswer: false, section: null };

  function chipRow(label, values, stateSet, getName) {
    const row = el("div", "filter-row");
    row.appendChild(el("span", "filter-label", label));
    const wrapChips = el("div", "chips");
    values.forEach(v => {
      const name = getName ? getName(v) : v;
      const c = el("span", "chip" + (stateSet.has(v) ? " on" : ""), esc(name));
      c.addEventListener("click", () => {
        stateSet.has(v) ? stateSet.delete(v) : stateSet.add(v);
        c.classList.toggle("on");
        refreshBankList();
      });
      wrapChips.appendChild(c);
    });
    row.appendChild(wrapChips);
    return row;
  }

  let listContainer, countEl;

  function refreshBankList() {
    const q0 = filterState.q.trim().toLowerCase();
    const sec = filterState.section;
    const list = BANK.questions.filter(q => {
      if (sec) {
        const v = TOPICMAP[q.id];
        if (!v || v[0] !== sec[0] || v[1] !== sec[1]) return false;
      }
      if (filterState.years.size && !filterState.years.has(q.year)) return false;
      if (!sec && filterState.chapters.size && !filterState.chapters.has(q.chapter)) return false;
      if (filterState.types.size && !filterState.types.has(q.type)) return false;
      if (filterState.schools.size && !filterState.schools.has(q.school || "中央民族大学")) return false;
      if (filterState.onlyAnswer && !q.answer) return false;
      if (q0) {
        const hay = (q.stem + " " + q.topic + " " + (q.options ? Object.values(q.options).join(" ") : "")).toLowerCase();
        if (!hay.includes(q0)) return false;
      }
      return true;
    });
    countEl.textContent = `共 ${list.length} 题`;
    listContainer.innerHTML = "";
    if (!list.length) {
      listContainer.appendChild(el("div", "empty", "没有符合筛选条件的题目，试试减少筛选条件。"));
      return;
    }
    const frag = document.createDocumentFragment();
    list.forEach(q => frag.appendChild(questionCard(q)));
    listContainer.appendChild(frag);
  }

  function renderBank(arg) {
    filterState.years.clear(); filterState.chapters.clear();
    filterState.types.clear(); filterState.schools.clear();
    filterState.q = ""; filterState.onlyAnswer = false;
    filterState.section = null;

    // 支持从学习/导航模块带章节或考点跳入：
    //   #/bank/<章节名>
    //   #/bank/<章节名>~<小节序号>
    if (arg) {
      let preset = "";
      try { preset = decodeURIComponent(arg); } catch (e) { preset = arg; }
      const tilde = preset.lastIndexOf("~");
      let secTitle = preset, secIdx = null;
      if (tilde > 0) {
        secTitle = preset.slice(0, tilde);
        const n = parseInt(preset.slice(tilde + 1), 10);
        if (!isNaN(n)) secIdx = n;
      }
      const ch = BANK.syllabus.find(c => c.title === secTitle);
      if (ch) {
        if (secIdx != null) {
          const lch = (window.LEARN.chapters || []).find(c => c.title === secTitle);
          if (lch && lch.sections[secIdx]) filterState.section = [lch.id, secIdx];
        }
        if (!filterState.section) filterState.chapters.add(secTitle);
      }
    }

    const frag = document.createDocumentFragment();
    const bar = el("div", "filter-bar");

    bar.appendChild(chipRow("院校",
      BANK.schools.map(s => s.name), filterState.schools,
      n => (n === "中央民族大学" ? "民大(853)" : (n === "贵州大学" ? "贵大(840)" : "湖大(866)"))));

    const allYears = [...new Set(BANK.questions.map(q => q.year))].sort((a, b) => a - b);
    bar.appendChild(chipRow("年份", allYears, filterState.years,
      y => y + "年"));

    bar.appendChild(chipRow("章节",
      BANK.syllabus.map(c => c.title), filterState.chapters));

    bar.appendChild(chipRow("题型",
      ["选择题", "解答题", "算法设计题", "综合题"], filterState.types));

    /* search row */
    const srow = el("div", "filter-row");
    const input = el("input", "search-input");
    input.type = "text";
    input.placeholder = "关键词搜索：题干 / 考点 / 选项…";
    input.addEventListener("input", () => { filterState.q = input.value; refreshBankList(); });
    srow.appendChild(input);
    const sw = el("label", "switch-label",
      `<input type="checkbox" ${filterState.onlyAnswer ? "checked" : ""}> 只看有答案`);
    sw.querySelector("input").addEventListener("change", e => {
      filterState.onlyAnswer = e.target.checked; refreshBankList();
    });
    srow.appendChild(sw);
    const clr = el("button", "clear-btn", "清除全部筛选");
    clr.addEventListener("click", () => {
      filterState.years.clear(); filterState.chapters.clear();
      filterState.types.clear(); filterState.schools.clear();
      input.value = ""; filterState.q = "";
      sw.querySelector("input").checked = false; filterState.onlyAnswer = false;
      bar.querySelectorAll(".chip.on").forEach(c => c.classList.remove("on"));
      refreshBankList();
    });
    srow.appendChild(clr);
    bar.appendChild(srow);

    // 从考纲导航进入时的考点限定提示
    if (filterState.section) {
      const ch = LEARN.chapters.find(c => c.id === filterState.section[0]);
      const si = filterState.section[1];
      const tag = el("div", "sec-filter-tag",
        `<span class="sft-label">当前考点筛选</span>
         <span class="sft-name">${esc(ch.title)} · ${esc(ch.sections[si].title)}</span>`);
      const x = el("button", "sft-x", "查看全部");
      x.addEventListener("click", () => {
        filterState.section = null;
        location.hash = "bank";
        showView("bank");
      });
      tag.appendChild(x);
      bar.appendChild(tag);
    }

    frag.appendChild(bar);

    countEl = el("div", "result-count");
    frag.appendChild(countEl);
    listContainer = el("div");
    frag.appendChild(listContainer);
    refreshBankList();
    return frag;
  }

  /* =========================================================
   * VIEW: examples
   * ========================================================= */
  function renderExamples() {
    const frag = document.createDocumentFragment();
    const bar = el("div", "filter-bar");
    const row = el("div", "filter-row");
    row.appendChild(el("span", "filter-label", "章节"));
    const chips = el("div", "chips");
    let active = null;
    const all = el("span", "chip on", "全部");
    chips.appendChild(all);
    active = all;

    const box = el("div");
    function fill(chapter) {
      box.innerHTML = "";
      const list = chapter ? BANK.examples.filter(x => x.chapter === chapter) : BANK.examples;
      const frag2 = document.createDocumentFragment();
      list.forEach(x => frag2.appendChild(exampleCard(x)));
      box.appendChild(frag2);
    }
    all.addEventListener("click", () => {
      active.classList.remove("on"); active = all; all.classList.add("on");
      fill(null);
    });
    BANK.syllabus.map(c => c.title).forEach(t => {
      if (!BANK.examples.some(x => x.chapter === t)) return;
      const c = el("span", "chip", esc(t));
      c.addEventListener("click", () => {
        active.classList.remove("on"); active = c; c.classList.add("on");
        fill(t);
      });
      chips.appendChild(c);
    });
    row.appendChild(chips);
    bar.appendChild(row);
    frag.appendChild(bar);
    frag.appendChild(box);
    fill(null);
    return frag;
  }

  /* =========================================================
   * VIEW: analysis
   * ========================================================= */
  function bars(title, entries) {
    const card = el("div", "card");
    card.appendChild(el("h2", null, title));
    const max = Math.max(...entries.map(([, v]) => v), 1);
    entries.forEach(([name, v]) => {
      const r = el("div", "bar-row",
        `<span class="bl">${esc(name)}</span>
         <span class="bar-track"><span class="bar-fill" style="width:${(v / max * 100).toFixed(1)}%"></span></span>
         <span class="bv">${v}</span>`);
      card.appendChild(r);
    });
    return card;
  }

  function renderAnalysis() {
    const frag = document.createDocumentFragment();

    /* school breakdown */
    const schoolCounts = BANK.schools.map(s =>
      [s.name, BANK.questions.filter(q => (q.school || "中央民族大学") === s.name).length]);
    frag.appendChild(bars("各院校真题数量", schoolCounts));

    /* chapter counts (民大 only, for primary exam analysis) */
    const mzu = BANK.questions.filter(q => (q.school || "中央民族大学") === "中央民族大学");
    const chCounts = BANK.syllabus.map(c =>
      [c.title, mzu.filter(q => q.chapter === c.title).length]);
    frag.appendChild(bars("中央民族大学 各章考查频次（2018–2025）", chCounts));

    /* chapter counts (other schools, for extension) */
    const other = BANK.questions.filter(q => q.school && q.school !== "中央民族大学");
    if (other.length) {
      const chCountsOther = BANK.syllabus.map(c =>
        [c.title, other.filter(q => q.chapter === c.title).length]);
      frag.appendChild(bars("其他院校 各章考查频次（贵大+湖大，拓展参考）", chCountsOther));
    }

    /* heat matrix - 民大 only */
    const card = el("div", "card");
    card.appendChild(el("h2", null, "年份 × 章节 矩阵（中央民族大学）"));
    const hw = el("div", "heat-wrap");
    const chapters = BANK.syllabus.map(c => c.title);
    const cells = [];
    BANK.exams.forEach(e => {
      chapters.forEach(ch => {
        cells.push(mzu.filter(q => q.year === e.year && q.chapter === ch).length);
      });
    });
    const cmax = Math.max(...cells, 1);
    let table = `<table class="heat"><thead><tr><th>年份</th>${
      chapters.map(c => `<th>${esc(c.replace("、", "\n、"))}</th>`).join("")}</tr></thead><tbody>`;
    BANK.exams.forEach(e => {
      table += `<tr><td class="rowh">${esc(e.label)}</td>`;
      chapters.forEach(ch => {
        const v = mzu.filter(q => q.year === e.year && q.chapter === ch).length;
        const a = v ? (0.12 + 0.78 * v / cmax).toFixed(2) : 0;
        table += `<td${v ? ` style="background:rgba(47,74,138,${a});color:${a > 0.55 ? "#fff" : "#23272f"}"` : ' class="cell0"'}>${v || "·"}</td>`;
      });
      table += `</tr>`;
    });
    table += `</tbody></table>`;
    hw.innerHTML = table;
    card.appendChild(hw);
    frag.appendChild(card);

    /* type distribution */
    const typeCounts = {};
    BANK.questions.forEach(q => typeCounts[q.type] = (typeCounts[q.type] || 0) + 1);
    const types = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
    frag.appendChild(bars("题型分布（全部院校）", types));

    /* top topics */
    const tc = new Map();
    BANK.questions.forEach(q => tc.set(q.topic, (tc.get(q.topic) || 0) + 1));
    const top = [...tc.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
    const c2 = el("div", "card");
    c2.appendChild(el("h2", null, "高频考点 Top 15"));
    c2.appendChild(el("ul", "topic-rank",
      top.map(([t, n], i) =>
        `<li><span>${i + 1}. ${esc(t)}</span><span class="tc">${n} 次</span></li>`).join("")));
    frag.appendChild(c2);

    /* insights */
    const c3 = el("div", "card");
    c3.appendChild(el("h2", null, "考情小结"));
    const insights = [
      "<b>树是绝对核心：</b>二叉树、树和森林累计 40 题次居首，性质计算、遍历还原、线索化、树与二叉树互转、哈夫曼树几乎年年出现，是投入产出比最高的章节。",
      "<b>图与排序并列第二梯队：</b>图（29 题次）集中在存储方式、DFS/BFS、Dijkstra、最小生成树；排序（22 题次）每年都要求写出多种排序算法“一趟”结果，属于必须熟练到手写的送分/丢分点。",
      "<b>查找章的 ASL 是常驻考点：</b>折半查找判定树、二叉排序树、散列表的成功/失败平均查找长度反复考查，计算时分母（成功按元素数、失败按区间数）必须分清。",
      "<b>线性表与栈队列考法稳定：</b>链表指针修改、有序表合并、循环队列计算、出栈序列合法性是反复出现的经典题型，也是算法设计题的主要来源。",
      "<b>冷门点不能放弃：</b>广义表在 2020 简答与 2024 大题两次出现；串虽题量小，KMP 的 next/nextval 在 2022 年以 10 分简答题考查。",
      "<b>近年趋势：</b>2024、2025 回忆版显示试卷同时包含 C 语言程序设计内容，但按 853 新考纲，复习应以数据结构九部分为主，C 语言仅作为写算法的表达工具掌握。",
    ];
    insights.forEach(t => c3.appendChild(el("div", "insight", t)));
    frag.appendChild(c3);

    return frag;
  }

  /* =========================================================
   * VIEW: learn（教材学习：考纲考点 → 教材内容 → 教材例题）
   * ========================================================= */
  const LEARN = window.LEARN;
  const LS_LEARN = "ds_learn_v1";

  function loadLearnState() {
    try {
      const s = JSON.parse(localStorage.getItem(LS_LEARN) || "{}");
      return { points: s.points || {}, examples: s.examples || {} };
    } catch (e) { return { points: {}, examples: {} }; }
  }
  let learnState = loadLearnState();
  function saveLearnState() {
    try { localStorage.setItem(LS_LEARN, JSON.stringify(learnState)); } catch (e) {}
  }
  const pkey = (chId, gidx) => chId + "#p" + gidx;
  const ekey = (chId, no) => chId + "#" + no;
  const isPointDone = (chId, gidx) => !!learnState.points[pkey(chId, gidx)];
  const isExampleDone = (chId, no) => !!learnState.examples[ekey(chId, no)];

  function flattenPoints(ch) {
    const out = [];
    let g = 0;
    ch.sections.forEach(sec => {
      sec.points.forEach(p => out.push({ sec, point: p, gidx: g++ }));
    });
    return out;
  }
  function chapterStats(ch) {
    const flat = flattenPoints(ch);
    const total = flat.length;
    const done = flat.filter(x => isPointDone(ch.id, x.gidx)).length;
    let exTotal = 0, exDone = 0;
    ch.sections.forEach(sec => (sec.examples || []).forEach(x => {
      exTotal++;
      if (isExampleDone(ch.id, x.no)) exDone++;
    }));
    const pct = total ? Math.round(done / total * 100) : 0;
    const status = done === 0 ? 0 : (done === total ? 2 : 1);
    return { flat, total, done, exTotal, exDone, pct, status };
  }
  function overallStats() {
    let done = 0, total = 0, exDone = 0, exTotal = 0, chDone = 0;
    LEARN.chapters.forEach(ch => {
      const s = chapterStats(ch);
      done += s.done; total += s.total;
      exDone += s.exDone; exTotal += s.exTotal;
      if (s.status === 2) chDone++;
    });
    return { done, total, exDone, exTotal, chDone, pct: total ? Math.round(done / total * 100) : 0 };
  }

  /* ---------- 真题 → 考纲小节索引 ---------- */
  const TOPICMAP = window.TOPICMAP || {};
  const QMAP = {};
  BANK.questions.forEach(q => { QMAP[q.id] = q; });
  const NAVQ = {}; // chId -> { si: [question] }
  Object.keys(TOPICMAP).forEach(qid => {
    const v = TOPICMAP[qid];
    if (!v || !QMAP[qid]) return;
    const [chId, si] = v;
    ((NAVQ[chId] = NAVQ[chId] || {})[si] = NAVQ[chId][si] || []).push(QMAP[qid]);
  });

  function sectionStats(ch, si) {
    const sec = ch.sections[si];
    let pDone = 0;
    sec.points.forEach((p, pi) => {
      if (isPointDone(ch.id, gidxOf(ch, si, pi))) pDone++;
    });
    let xDone = 0;
    (sec.examples || []).forEach(x => { if (isExampleDone(ch.id, x.no)) xDone++; });
    const qs = (NAVQ[ch.id] || {})[si] || [];
    return {
      pTotal: sec.points.length, pDone,
      xTotal: (sec.examples || []).length, xDone,
      qTotal: qs.length,
      qDone: qs.filter(q => q.answer).length,
      pct: sec.points.length ? Math.round(pDone / sec.points.length * 100) : 0,
    };
  }

  /* =========================================================
   * VIEW: nav（考纲导航：考纲小节 → 知识点 / 例题 / 真题）
   * ========================================================= */
  function renderNav(arg) {
    const chapters = LEARN.chapters;
    const curId = (arg && /^ch\d+$/.test(arg)) ? arg : chapters[0].id;
    const ch = chapters.find(c => c.id === curId) || chapters[0];

    const o = overallStats();
    let secTotal = 0, qTotal = 0;
    chapters.forEach(c => {
      secTotal += c.sections.length;
      const m = NAVQ[c.id] || {};
      Object.keys(m).forEach(k => { qTotal += m[k].length; });
    });

    const frag = document.createDocumentFragment();

    const head = el("div", "card nav-head");
    head.innerHTML = `
      <div class="nh-top">
        <div class="nh-l">
          <h2>考纲导航</h2>
          <p>以 853 考试大纲为目录：每个考点直达对应教材知识点、教材例题与历年真题，形成「考纲 → 教材 → 练习」的一条线。</p>
        </div>
        <div class="nh-ring">${ringSvg(o.pct)}</div>
      </div>
      <div class="nh-facts">
        <div><span class="v">${chapters.length}</span><span class="l">考纲章节</span></div>
        <div><span class="v">${secTotal}</span><span class="l">考纲考点</span></div>
        <div><span class="v">${o.total}</span><span class="l">知识点</span></div>
        <div><span class="v">${qTotal}</span><span class="l">已归类真题</span></div>
      </div>
      <p class="nh-note">已归类 ${qTotal} / ${BANK.questions.length} 题；其余多为回忆版题面缺考点描述，仍可在真题库按关键词检索。</p>`;
    frag.appendChild(head);

    const layout = el("div", "nav-layout");

    /* 左侧章导航 */
    const side = el("aside", "nav-side");
    chapters.forEach((c, i) => {
      const st = chapterStats(c);
      const m = NAVQ[c.id] || {};
      let qn = 0;
      Object.keys(m).forEach(k => { qn += m[k].length; });
      const b = el("button", "nav-ch-btn" + (c.id === ch.id ? " on" : ""));
      b.innerHTML = `
        <span class="nc-n">${i + 1}</span>
        <span class="nc-main">
          <span class="nc-t">${esc(c.title)}</span>
          <span class="nc-s">${c.sections.length} 考点 · ${qn} 真题</span>
        </span>
        <span class="nc-p">${st.pct}%</span>`;
      b.addEventListener("click", () => { location.hash = "nav/" + c.id; });
      side.appendChild(b);
    });
    layout.appendChild(side);

    /* 右侧考点 */
    const main = el("div", "nav-main");

    const cTop = el("div", "nav-ch-head");
    cTop.innerHTML = `
      <div class="nch-row">
        <h2>${esc(ch.title)}</h2>
        <span class="nch-ref">${esc(ch.bookCh)} · 教材${esc(ch.bookPages)}</span>
      </div>
      <p class="nch-lead">${esc(ch.lead)}</p>`;
    main.appendChild(cTop);

    ch.sections.forEach((sec, si) => {
      const st = sectionStats(ch, si);
      const card = el("div", "nsec");
      card.dataset.si = si;

      const head2 = el("div", "nsec-top");
      head2.innerHTML = `
        <span class="nsec-num">${esc(ch.id.replace("ch", ""))}-${si + 1}</span>
        <span class="nsec-main">
          <span class="nsec-title">${esc(sec.title)}</span>
          <span class="nsec-ref">${esc(sec.bookRef || "")}</span>
        </span>
        <span class="nsec-bars">
          <span class="nsec-meta">知识点 ${st.pDone}/${st.pTotal}</span>
          <span class="nsec-meta">例题 ${st.xDone}/${st.xTotal}</span>
          <span class="nsec-meta ${st.qTotal ? "" : "dim"}">真题 ${st.qTotal}</span>
        </span>
        <span class="nsec-arrow">▶</span>`;
      card.appendChild(head2);

      const body = el("div", "nsec-body");
      const kpList = el("div", "nsec-kp");
      sec.points.forEach((p, pi) => {
        const g = gidxOf(ch, si, pi);
        const done = isPointDone(ch.id, g);
        const a = el("a", "nkp" + (done ? " done" : ""));
        a.href = `#/learn/${ch.id}/s${si}`;
        a.innerHTML = `<span class="nkp-c">${done ? "✓" : "○"}</span>
          <span class="nkp-t">${esc(p.title)}</span>
          ${p.easyWrong ? '<span class="nkp-tag">易错</span>' : ""}`;
        kpList.appendChild(a);
      });
      body.appendChild(kpList);

      if (st.xTotal) {
        body.appendChild(el("div", "nsec-line",
          `<span class="nl-k">教材例题</span><span class="nl-v">${(sec.examples || []).map(x => esc(x.no)).join("、")}</span>`));
      }
      if (st.qTotal) {
        const years = {};
        ((NAVQ[ch.id] || {})[si] || []).forEach(q => { years[q.year] = (years[q.year] || 0) + 1; });
        const ys = Object.keys(years).sort().map(y => y + "年×" + years[y]).join("、");
        body.appendChild(el("div", "nsec-line",
          `<span class="nl-k">真题年份</span><span class="nl-v">${esc(ys)}</span>`));
      } else {
        body.appendChild(el("div", "nsec-line dim",
          `<span class="nl-k">真题</span><span class="nl-v">本节在现有题库中暂无对应真题，先掌握知识点与教材例题。</span>`));
      }

      const acts = el("div", "nsec-acts");
      const learnBtn = el("a", "nb-btn primary", st.pDone === 0 ? "开始学习这一节" : (st.pDone === st.pTotal ? "复习这一节" : "继续这一节"));
      learnBtn.href = `#/learn/${ch.id}/s${si}`;
      acts.appendChild(learnBtn);
      if (st.qTotal) {
        const bankBtn = el("a", "nb-btn", `做这节真题（${st.qTotal}）`);
        bankBtn.href = `#/bank/${encodeURIComponent(ch.title)}~${si}`;
        acts.appendChild(bankBtn);
      }
      body.appendChild(acts);

      card.appendChild(body);
      const top = card.querySelector(".nsec-top");
      top.addEventListener("click", () => card.classList.toggle("open"));
      if (st.pDone > 0 && st.pDone < st.pTotal) card.classList.add("open");

      main.appendChild(card);
    });

    layout.appendChild(main);
    frag.appendChild(layout);
    return frag;
  }

  /* =========================================================
   * VIEW: code（基本运算代码手册）
   * ========================================================= */
  const CODEBOOK = window.CODEBOOK || { groups: [] };

  function copyText(txt, btn) {
    const done = () => {
      const old = btn.textContent;
      btn.textContent = "已复制 ✓";
      setTimeout(() => { btn.textContent = old; }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, () => fallbackCopy(txt, done));
    } else fallbackCopy(txt, done);
  }
  function fallbackCopy(txt, done) {
    const ta = document.createElement("textarea");
    ta.value = txt;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  function opCard(op) {
    const card = el("div", "op-card");
    const head = el("div", "op-head");
    head.innerHTML = `
      <span class="op-name">${esc(op.name)}</span>
      <span class="op-sig">${esc(op.sig)}</span>
      <span class="op-time">${esc(op.time)}</span>
      <span class="op-arrow">▶</span>`;
    card.appendChild(head);

    const body = el("div", "op-body");
    body.dataset.search = (op.name + " " + op.sig + " " + (op.tips || "")).toLowerCase();
    if (op.tips) body.appendChild(el("div", "op-tip", `<b>要点</b>${esc(op.tips)}`));
    const pre = el("pre", "code-block", esc(op.code));
    body.appendChild(pre);
    const bar = el("div", "op-bar");
    const cp = el("button", "copy-btn", "复制代码");
    cp.addEventListener("click", () => copyText(op.code, cp));
    bar.appendChild(cp);
    bar.appendChild(el("span", "op-complex", `时间复杂度 ${esc(op.time)}`));
    body.appendChild(bar);
    card.appendChild(body);

    head.addEventListener("click", () => card.classList.toggle("open"));
    card.dataset.search = (op.name + " " + op.sig + " " + (op.tips || "")).toLowerCase();
    return card;
  }

  function renderCode(arg) {
    const groups = CODEBOOK.groups;
    const frag = document.createDocumentFragment();

    const totalOps = groups.reduce((a, g) => a + g.ops.length, 0);
    const head = el("div", "card code-head");
    head.innerHTML = `
      <div class="ch-top">
        <div>
          <h2>基本运算代码手册</h2>
          <p>把每个数据结构的基本运算整理成 C/C++ 代码，按「存储结构定义 → 初始化 → 增删改查 → 典型应用」排列。可展开、可复制，适合背默与手写练习。</p>
        </div>
        <div class="ch-facts">
          <div><span class="v">${groups.length}</span><span class="l">数据结构</span></div>
          <div><span class="v">${totalOps}</span><span class="l">基本运算</span></div>
        </div>
      </div>
      <div class="code-search-wrap">
        <input class="code-search" type="search" placeholder="搜索运算，例如 插入、出队、Dijkstra、next">
        <div class="search-info"></div>
      </div>`;
    frag.appendChild(head);

    const layout = el("div", "code-layout");

    /* 左侧：按类别分组的结构导航 */
    const side = el("aside", "code-side");
    const cats = [];
    groups.forEach(g => {
      if (!cats.includes(g.cat)) cats.push(g.cat);
    });
    cats.forEach(cat => {
      side.appendChild(el("div", "cs-cat", esc(cat)));
      groups.filter(g => g.cat === cat).forEach(g => {
        const b = el("button", "cs-item" + (g.id === (arg || groups[0].id) ? " on" : ""));
        b.dataset.gid = g.id;
        b.innerHTML = `<span class="cs-t">${esc(g.name)}</span><span class="cs-n">${g.ops.length}</span>`;
        b.addEventListener("click", () => { location.hash = "code/" + g.id; });
        side.appendChild(b);
      });
    });
    layout.appendChild(side);

    /* 右侧：全部结构按类别平铺，搜索时隐藏不匹配项 */
    const main = el("div", "code-main");
    cats.forEach(cat => {
      const catWrap = el("div", "code-cat");
      catWrap.appendChild(el("div", "cc-title", esc(cat)));
      groups.filter(g => g.cat === cat).forEach(g => {
        const box = el("div", "code-group");
        box.dataset.gid = g.id;

        const gt = el("div", "cg-head");
        gt.innerHTML = `
          <h2>${esc(g.name)}</h2>
          <span class="cg-cat">${esc(g.cat)}</span>
          <span class="cg-n">${g.ops.length} 个运算</span>`;
        box.appendChild(gt);
        box.appendChild(el("p", "cg-desc", esc(g.desc)));

        const typeWrap = el("div", "cg-type");
        typeWrap.appendChild(el("div", "cg-type-t", "存储结构定义"));
        const tp = el("pre", "code-block", esc(g.type));
        typeWrap.appendChild(tp);
        const tbar = el("div", "op-bar");
        const tb = el("button", "copy-btn", "复制定义");
        tb.addEventListener("click", () => copyText(g.type, tb));
        tbar.appendChild(tb);
        typeWrap.appendChild(tbar);
        box.appendChild(typeWrap);

        if (g.tips) box.appendChild(el("div", "cg-tips", `<b>易错点</b>${esc(g.tips)}`));

        const ops = el("div", "op-list");
        g.ops.forEach(op => ops.appendChild(opCard(op)));
        box.appendChild(ops);

        catWrap.appendChild(box);
      });
      main.appendChild(catWrap);
    });
    layout.appendChild(main);
    frag.appendChild(layout);

    /* 搜索过滤 */
    setTimeout(() => {
      if (arg) {
        const target = app.querySelector('.code-group[data-gid="' + arg + '"]');
        const tHead = target && target.querySelector(".cg-head");
        if (tHead) tHead.scrollIntoView({ block: "start" });
      }
      const input = app.querySelector(".code-search");
      if (!input) return;
      input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        let shown = 0;
        app.querySelectorAll(".code-group").forEach(box => {
          let n = 0;
          box.querySelectorAll(".op-card").forEach(card => {
            const hit = !q || card.dataset.search.includes(q);
            card.style.display = hit ? "" : "none";
            if (hit) n++;
          });
          box.style.display = (n || !q) ? "" : "none";
          if (q) box.querySelectorAll(".op-card").forEach(c => {
            if (c.style.display !== "none") c.classList.add("open");
          });
          shown += n;
        });
        app.querySelectorAll(".code-cat").forEach(cw => {
          const any = Array.from(cw.querySelectorAll(".code-group"))
            .some(b => b.style.display !== "none");
          cw.style.display = any ? "" : "none";
        });
        const info = app.querySelector(".search-info");
        if (info) info.textContent = q ? `匹配 ${shown} 个运算` : "";
      });
    }, 0);

    return frag;
  }

  function ringSvg(pct) {
    const r = 26, c = 2 * Math.PI * r;
    return `<svg viewBox="0 0 64 64" class="ring">
      <circle cx="32" cy="32" r="${r}" class="ring-bg"></circle>
      <circle cx="32" cy="32" r="${r}" class="ring-fg"
        stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - pct / 100)).toFixed(1)}"
        transform="rotate(-90 32 32)"></circle>
      <text x="32" y="37" text-anchor="middle" class="ring-t">${pct}%</text>
    </svg>`;
  }

  let focusPending = null;

  /* ---------- learn home: learning path ---------- */
  function renderLearnHome() {
    const o = overallStats();
    const frag = document.createDocumentFragment();

    const stat = el("div", "card learn-stat");
    stat.innerHTML = `
      <div class="ls-ring">${ringSvg(o.pct)}</div>
      <div class="ls-info">
        <h2>教材学习路径</h2>
        <p>依据 853 考纲考点，带你逐节学习李春葆《数据结构教程（第6版）》，学完立刻用教材例题巩固。</p>
        <div class="ls-facts">
          <div><span class="v">${o.done}/${o.total}</span><span class="l">知识点打卡</span></div>
          <div><span class="v">${o.exDone}/${o.exTotal}</span><span class="l">例题已会</span></div>
          <div><span class="v">${o.chDone}/${LEARN.chapters.length}</span><span class="l">章节完成</span></div>
        </div>
      </div>`;
    const nextCh = LEARN.chapters.find(ch => chapterStats(ch).status !== 2);
    const cont = el("button", "continue-btn", nextCh ? `继续学习 · ${nextCh.title}` : "从第1章开始复习");
    cont.addEventListener("click", () => {
      const ch = nextCh || LEARN.chapters[0];
      focusPending = ch.id;
      location.hash = "learn/" + ch.id;
    });
    stat.appendChild(cont);
    frag.appendChild(stat);

    const pathWrap = el("div", "lpath");
    LEARN.chapters.forEach((ch, i) => pathWrap.appendChild(pathNode(ch, i)));
    frag.appendChild(pathWrap);

    const tip = el("div", "card learn-method");
    tip.innerHTML = `<h2>推荐学习方法</h2>
      <ol>
        <li><b>学知识点</b>：展开每个考点卡片，对照教材小节精读，定义、公式、代码逐个理解。</li>
        <li><b>先做例题</b>：知识点下面紧跟教材例题，先自己动手做，再点开教材解法对照。</li>
        <li><b>打卡</b>：真正掌握后点「我已掌握」，进度自动记录，下次可从断点继续。</li>
        <li><b>刷真题</b>：一章学完，去真题库做该章历年真题，完成「学—练—测」闭环。</li>
      </ol>`;
    frag.appendChild(tip);
    return frag;
  }

  function pathNode(ch, i) {
    const st = chapterStats(ch);
    const node = el("button", "lpath-node st" + st.status);
    node.innerHTML = `
      <span class="lp-dot">${st.status === 2 ? "✓" : i + 1}</span>
      <span class="lp-main">
        <span class="lp-title">${esc(ch.title)}</span>
        <span class="lp-sub">${esc(ch.bookCh)} · 教材${esc(ch.bookPages)} · ${st.total} 知识点 · ${st.exTotal} 道例题</span>
        <span class="lp-bar"><span class="lp-fill" style="width:${st.pct}%"></span></span>
      </span>
      <span class="lp-state">${st.status === 2 ? "已完成" : (st.status === 1 ? "学习中 " + st.pct + "%" : "未开始")}</span>`;
    node.addEventListener("click", () => { location.hash = "learn/" + ch.id; });
    return node;
  }

  /* ---------- learn chapter ---------- */
  function renderLearnChapter(ch, focusSi) {
    const frag = document.createDocumentFragment();

    const back = el("a", "learn-back", "← 返回学习路径");
    back.href = "#/learn";
    frag.appendChild(back);

    const head = el("div", "card learn-ch-head");
    head.innerHTML = `
      <div class="lch-top">
        <h2>${esc(ch.title)}</h2>
        <span class="lch-ref">${esc(ch.bookCh)} · 教材${esc(ch.bookPages)}</span>
      </div>
      <p class="lch-lead">${esc(ch.lead)}</p>
      <div class="lch-progress">
        <span class="lch-bar"><span class="lch-fill"></span></span>
        <span class="lch-pct"></span>
      </div>`;
    frag.appendChild(head);

    ch.sections.forEach((sec, si) => {
      const sw = el("div", "lsec");
      sw.dataset.si = si;
      const shead = el("div", "lsec-head");
      shead.innerHTML = `<span class="lsec-title">${esc(sec.title)}</span>
        <span class="lsec-ref">${esc(sec.bookRef || "")}</span>
        <span class="lsec-pct"></span>`;
      sw.appendChild(shead);

      sec.points.forEach((p, pi) => {
        sw.appendChild(lessonEl(ch, p, gidxOf(ch, si, pi)));
      });
      if (sec.examples && sec.examples.length) {
        const exwrap = el("div", "lex-wrap");
        exwrap.appendChild(el("div", "lex-wrap-title", `教材例题（${sec.examples.length}）· 先自己做再看解法`));
        sec.examples.forEach(x => exwrap.appendChild(learnExampleEl(ch, x)));
        sw.appendChild(exwrap);
      }
      frag.appendChild(sw);
    });

    const banner = el("div", "complete-banner");
    banner.innerHTML = `
      <div class="cb-title">本章知识点全部学完！</div>
      <div class="cb-p">知识点已全部打卡。趁热打铁，去做本章历年真题，检验学习效果。</div>
      <div class="cb-actions">
        <a class="cb-btn primary" href="#/bank/${encodeURIComponent(ch.title)}">做本章真题</a>
        <a class="cb-btn" href="#/learn">返回学习路径</a>
      </div>`;
    frag.appendChild(banner);

    // 填充所有进度显示
    requestAnimationFrame(() => refreshLearnChrome(ch));

    // 从「继续学习」进入：展开并滚动到第一个未打卡知识点
    if (focusPending === ch.id) {
      requestAnimationFrame(() => {
        const first = app.querySelector(".lesson:not(.mastered)");
        if (first) {
          first.classList.add("open");
          first.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      focusPending = null;
    }
    // 从考纲导航进入：定位到指定考点小节
    if (focusSi != null && ch.sections[focusSi]) {
      requestAnimationFrame(() => {
        const secEl = app.querySelector('.lsec[data-si="' + focusSi + '"]');
        if (!secEl) return;
        secEl.classList.add("focus");
        const firstUndone = secEl.querySelector(".lesson:not(.mastered)");
        if (firstUndone) firstUndone.classList.add("open");
        secEl.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => secEl.classList.remove("focus"), 2200);
      });
    }
    return frag;
  }

  function gidxOf(ch, si, pi) {
    let g = 0;
    for (let i = 0; i < si; i++) g += ch.sections[i].points.length;
    return g + pi;
  }

  function lessonEl(ch, p, gidx) {
    const done = isPointDone(ch.id, gidx);
    const item = el("div", "lesson" + (done ? " mastered" : ""));
    item.dataset.gidx = gidx;
    item.innerHTML = `
      <div class="lesson-head">
        <span class="lesson-check" title="打卡">${done ? "✓" : ""}</span>
        <span class="lesson-title">${esc(p.title)}</span>
        ${p.easyWrong ? '<span class="lesson-tag">易错</span>' : ""}
        <span class="lesson-arrow">▶</span>
      </div>
      <div class="lesson-body"></div>`;
    const body = item.querySelector(".lesson-body");
    body.appendChild(renderBlocks(p.blocks || []));
    if (p.easyWrong) {
      body.appendChild(el("div", "callout warn",
        `<span class="ct">注意</span>${esc(p.easyWrong)}`));
    }
    const markBtn = el("button", "mark-btn", done ? "已打卡 ✓（点击取消）" : "我已掌握，打卡");
    body.appendChild(markBtn);

    const lhead = item.querySelector(".lesson-head");
    lhead.addEventListener("click", e => {
      if (e.target.closest(".lesson-check")) return;
      item.classList.toggle("open");
    });
    item.querySelector(".lesson-check").addEventListener("click", e => {
      e.stopPropagation();
      togglePoint(ch, gidx, item);
    });
    markBtn.addEventListener("click", () => togglePoint(ch, gidx, item));
    return item;
  }

  function togglePoint(ch, gidx, item) {
    const k = pkey(ch.id, gidx);
    const now = !learnState.points[k];
    if (now) learnState.points[k] = true; else delete learnState.points[k];
    saveLearnState();
    item.classList.toggle("mastered", now);
    item.querySelector(".lesson-check").textContent = now ? "✓" : "";
    item.querySelector(".mark-btn").textContent = now ? "已打卡 ✓（点击取消）" : "我已掌握，打卡";
    refreshLearnChrome(ch);
  }

  function learnExampleEl(ch, x) {
    const done = isExampleDone(ch.id, x.no);
    const card = el("div", "lex-card" + (done ? " mastered" : ""));
    card.innerHTML = `
      <div class="lex-meta">
        <span class="lex-no">${esc(x.no)}</span>
        <span class="lex-src">${esc(x.src || "")}</span>
        <span class="lex-state">${done ? "已会 ✓" : "待练习"}</span>
      </div>
      <div class="lex-stem">${esc(x.stem)}</div>
      <div class="lex-tip">先自己动手做一做，再对教材解法。</div>
      <button class="reveal-btn">查看教材解法</button>
      <div class="answer-box">
        <div class="al">教材解法</div>
        <div class="ab">${esc(x.solution || "（资料上解法依赖图示，此处省略）")}</div>
      </div>
      <button class="lex-mark">${done ? "这道题我会了 ✓（取消）" : "这道题我会了"}</button>`;
    const btn = card.querySelector(".reveal-btn");
    const box = card.querySelector(".answer-box");
    btn.addEventListener("click", () => {
      const open = box.classList.toggle("open");
      btn.textContent = open ? "收起解法" : "查看教材解法";
    });
    card.querySelector(".lex-mark").addEventListener("click", () => {
      const k = ekey(ch.id, x.no);
      const now = !learnState.examples[k];
      if (now) learnState.examples[k] = true; else delete learnState.examples[k];
      saveLearnState();
      card.classList.toggle("mastered", now);
      card.querySelector(".lex-state").textContent = now ? "已会 ✓" : "待练习";
      card.querySelector(".lex-mark").textContent = now ? "这道题我会了 ✓（取消）" : "这道题我会了";
      refreshLearnChrome(ch);
    });
    return card;
  }

  function refreshLearnChrome(ch) {
    const st = chapterStats(ch);
    const fill = app.querySelector(".lch-fill");
    if (fill) fill.style.width = st.pct + "%";
    const pctEl = app.querySelector(".lch-pct");
    if (pctEl) pctEl.textContent = `知识点 ${st.done}/${st.total} · 例题 ${st.exDone}/${st.exTotal}`;
    ch.sections.forEach((sec, si) => {
      const secEl = app.querySelector('.lsec[data-si="' + si + '"]');
      if (!secEl) return;
      const pTotal = secEl.querySelectorAll(".lesson").length;
      const pDone = secEl.querySelectorAll(".lesson.mastered").length;
      const xTotal = secEl.querySelectorAll(".lex-card").length;
      const xDone = secEl.querySelectorAll(".lex-card.mastered").length;
      const pctEl2 = secEl.querySelector(".lsec-pct");
      pctEl2.textContent = xTotal
        ? `${pDone}/${pTotal} 知识点 · ${xDone}/${xTotal} 例题`
        : `${pDone}/${pTotal} 知识点`;
    });
    const banner = app.querySelector(".complete-banner");
    if (banner) banner.classList.toggle("show", st.total > 0 && st.done === st.total);
  }

  function renderLearn(arg) {
    const m = /^(ch\d+)(?:\/(s\d+))?$/.exec(arg || "");
    if (m) {
      const ch = LEARN.chapters.find(c => c.id === m[1]);
      if (ch) return renderLearnChapter(ch, m[2] ? parseInt(m[2].slice(1), 10) : null);
    }
    focusPending = null;
    return renderLearnHome();
  }

  /* ---------- router ---------- */
  const views = {
    overview: renderOverview,
    nav: renderNav,
    code: renderCode,
    learn: renderLearn,
    teaching: renderTeaching,
    bank: renderBank,
    examples: renderExamples,
    analysis: renderAnalysis,
  };

  function showView(name, arg) {
    tabsEl.querySelectorAll(".tab").forEach(t =>
      t.classList.toggle("active", t.dataset.view === name));
    app.innerHTML = "";
    app.appendChild(views[name](arg));
  }

  tabsEl.addEventListener("click", e => {
    const t = e.target.closest(".tab");
    if (!t) return;
    location.hash = t.dataset.view;
    showView(t.dataset.view);
  });

  function route() {
    const hash = location.hash.replace(/^#\/?/, "");
    if (!hash) { showView("overview"); return; }
    const parts = hash.split("/");
    const name = parts[0];
    const arg = parts.slice(1).join("/");
    if (views[name]) showView(name, arg);
    else { showView("overview"); }
  }
  window.addEventListener("hashchange", route);
  route();
})();
