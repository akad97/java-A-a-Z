(function () {
  "use strict";
  var C = window.COURSE, EXP = window.EXPECTED || {};
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function perm(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); for (var j = n - 1; j > 0; j--) { var r = Math.floor(Math.random() * (j + 1)); var t = a[j]; a[j] = a[r]; a[r] = t; } return a; }
  function norm(s) { return String(s).replace(/\r/g, "").split("\n").map(function (l) { return l.replace(/\s+$/, ""); }).join("\n").replace(/\n+$/, ""); }

  /* ---------- mémoire locale ---------- */
  var KEY = "javaAZ.v2";
  var state = { done: {}, quizBest: {}, tp: {}, self: {} };
  try { var raw = localStorage.getItem(KEY); if (raw) state = Object.assign(state, JSON.parse(raw)); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} refreshProgress(); }
  function mark(k) { if (!state.done[k]) { state.done[k] = true; save(); } }
  function setPill(el, done, txtDone) { if (!el) return; el.className = "pill" + (done ? " done" : ""); el.textContent = done ? (txtDone || "fait") : "à faire"; }

  /* ---------- coloration Java ---------- */
  var KW = /^(public|private|protected|class|static|void|int|double|char|boolean|long|new|return|if|else|for|while|do|switch|case|default|break|continue|final|import|package|this|super|extends|abstract|true|false|null|try|catch|finally|throw|throws|instanceof|var|yield)$/;
  var TY = /^(String|System|Scanner|ArrayList|List|Math|Integer|Double|Arrays|Character|Object|Exception|RuntimeException|IllegalArgumentException|NumberFormatException|InputMismatchException|ArithmeticException|ArrayIndexOutOfBoundsException|NullPointerException|IOException|Override)$/;
  function hlLine(line) {
    var out = "", i = 0, n = line.length;
    while (i < n) {
      var c = line[i];
      if (c === "/" && line[i + 1] === "/") { out += '<span class="c">' + esc(line.slice(i)) + "</span>"; break; }
      if (c === "/" && line[i + 1] === "*") { var e = line.indexOf("*/", i + 2); e = e < 0 ? n : e + 2; out += '<span class="c">' + esc(line.slice(i, e)) + "</span>"; i = e; continue; }
      if (c === "*" && /^\s*\*/.test(line) && i === line.search(/\*/)) { out += '<span class="c">' + esc(line.slice(i)) + "</span>"; break; }
      if (c === '"' || c === "'") {
        var j = i + 1;
        while (j < n && line[j] !== c) { if (line[j] === "\\") j++; j++; }
        j = Math.min(n, j + 1);
        out += '<span class="s">' + esc(line.slice(i, j)) + "</span>"; i = j; continue;
      }
      if (c === "@") { var a = i + 1; while (a < n && /\w/.test(line[a])) a++; out += '<span class="c">' + esc(line.slice(i, a)) + "</span>"; i = a; continue; }
      if (/[A-Za-z_]/.test(c)) {
        var k = i; while (k < n && /\w/.test(line[k])) k++;
        var w = line.slice(i, k);
        if (KW.test(w)) out += '<span class="k">' + w + "</span>";
        else if (TY.test(w)) out += '<span class="y">' + w + "</span>";
        else if (line[k] === "(") out += '<span class="fn">' + w + "</span>";
        else out += esc(w);
        i = k; continue;
      }
      if (/[0-9]/.test(c)) { var m = i; while (m < n && /[0-9.LlDdEe_]/.test(line[m])) m++; out += '<span class="n">' + line.slice(i, m) + "</span>"; i = m; continue; }
      if ("{}();[].,".indexOf(c) >= 0) { out += '<span class="p">' + esc(c) + "</span>"; i++; continue; }
      out += esc(c); i++;
    }
    return out;
  }
  function codeHTML(src, opts) {
    opts = opts || {};
    var lines = Array.isArray(src) ? src : String(src).replace(/\n$/, "").split("\n");
    return '<pre class="code">' + lines.map(function (l, i) {
      var cls = "ln" + (opts.hl && opts.hl.indexOf(i + 1) >= 0 ? " hl" : "");
      return '<span class="' + cls + '" data-n="' + (i + 1) + '">' + (hlLine(l) || " ") + "</span>";
    }).join("") + "</pre>";
  }
  function hydrate(root, sid) {
    $$("pre[data-java]", root).forEach(function (pre) {
      var tmp = document.createElement("div"); tmp.innerHTML = codeHTML(pre.textContent);
      pre.replaceWith(tmp.firstChild);
    });
    $$("[data-run]", root).forEach(function (box) { runBox(box, box.getAttribute("data-run"), sid); });
    $$("[data-comp]", root).forEach(function (box) { var f = COMPS[box.getAttribute("data-comp")]; if (f) f(box, sid); });
  }
  function displayHTML(disp) {
    return (disp || []).map(function (d) { return d.k === "out" ? esc(d.s) : '<span class="' + (d.k === "in" ? "inp" : "er") + '">' + esc(d.s) + "</span>"; }).join("");
  }
  function prog(id) { var p = C.progs[id]; if (!p) throw new Error("programme inconnu : " + id); return p; }

  /* ---------- navigation ---------- */
  var TABS = [["lecon", "Leçon"], ["demos", "Démos pas à pas"], ["exercices", "Exercices"], ["tp", "TP"], ["quiz", "Quiz"], ["videos", "Vidéos"], ["memo", "Fiche mémo"]];
  var TAB_IDS = TABS.map(function (t) { return t[0]; });
  function parseHash() {
    var h = (location.hash || "").replace(/^#/, "");
    var m = /^(s[1-8])(?:-([a-z]+))?$/.exec(h);
    if (!m) return { s: "s1", tab: "lecon" };
    return { s: m[1], tab: m[2] && TAB_IDS.indexOf(m[2]) >= 0 ? m[2] : "lecon" };
  }
  function buildNav() {
    var nav = $("#nav"), sel = $("#mnav");
    nav.innerHTML = C.seances.map(function (s) {
      return '<li><a href="#' + s.id + '" data-s="' + s.id + '"><span class="tag">' + s.tag + '</span><span class="t">' + esc(s.short) + '</span><span class="st" id="st-' + s.id + '"></span></a></li>';
    }).join("");
    sel.innerHTML = C.seances.map(function (s) { return '<option value="' + s.id + '">' + s.tag + " · " + esc(s.short) + "</option>"; }).join("");
    sel.addEventListener("change", function () { location.hash = sel.value; });
  }

  /* ---------- progression ---------- */
  function tabDone(sid, id) {
    var d = C.data[sid]; if (!d) return false;
    switch (id) {
      case "lecon": var ch = d.lesson.filter(function (s) { return s.check; }); return ch.length ? d.lesson.every(function (s, i) { return !s.check || state.done[sid + ".check." + i]; }) : !!state.done[sid + ".lecon"];
      case "demos": return demoList(d).every(function (_, i) { return state.done[sid + ".demo." + i]; });
      case "exercices": return d.exercises.every(function (_, i) { return state.done[sid + ".ex." + i]; });
      case "tp": return d.tp.steps.every(function (_, i) { return (state.tp[sid] || {})[i]; });
      case "quiz": return (state.quizBest[sid] || 0) >= Math.ceil(d.quiz.length * 0.75);
      case "videos": return !!state.done[sid + ".video"];
      case "memo": return d.memo.selfcheck.every(function (_, i) { return (state.self[sid] || {})[i]; });
    }
    return false;
  }
  function refreshProgress() {
    var total = 0;
    C.seances.forEach(function (s) {
      var n = TAB_IDS.filter(function (t) { return tabDone(s.id, t); }).length;
      total += n;
      var st = $("#st-" + s.id); if (st) st.textContent = n + "/" + TAB_IDS.length;
    });
    var pct = Math.round(total / (TAB_IDS.length * C.seances.length) * 100);
    var m = $("#overall-meter"); if (m) m.style.width = pct + "%";
    var t = $("#overall-text"); if (t) t.textContent = "Progression du cours : " + pct + " %";
    if (current.s) TAB_IDS.forEach(function (id) { var d = $("#dot-" + id); if (d) d.classList.toggle("done", tabDone(current.s, id)); });
  }

  /* ---------- rendu ---------- */
  var current = { s: null, tab: null };
  function route() {
    var r = parseHash();
    $$("#nav a").forEach(function (a) { if (a.dataset.s === r.s) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    $("#mnav").value = r.s;
    if (current.s !== r.s) { renderShell(r.s); current.s = r.s; current.tab = null; window.scrollTo(0, 0); }
    if (current.tab !== r.tab) { selectTab(r.tab); current.tab = r.tab; }
  }
  var DECKS = {
    s1: "https://claude.ai/artifact/VLJYVtUyi91uDyMgTr2jk4",
    s2: "https://claude.ai/artifact/PpNJz7Yo9Brv2wj36DrDYR",
    s3: "https://claude.ai/artifact/JQhMq9KZVcXFSrNpco3DM8",
    s4: "https://claude.ai/artifact/88p1Dtjcyi3XBh36cRzaae",
    s5: "https://claude.ai/artifact/TNpLGVHUp7VA6DEXs6pk4t",
    s6: "https://claude.ai/artifact/R4e3GKeBi5TfG3G58rpxcP",
    s7: "https://claude.ai/artifact/PRr98sseTTDNY7TCkHsUPV",
    s8: "https://claude.ai/artifact/2VidETJ32Y9evfErrKZps2"
  };
  function renderShell(sid) {
    var meta = C.seances.filter(function (s) { return s.id === sid; })[0], d = C.data[sid];
    var labels = d.tabLabels || {};
    $("#view").innerHTML =
      '<header class="hero"><div class="hero-text"><span class="eyebrow">Séance ' + sid.slice(1) + " · " + d.split + " · compétence" + (d.comp.indexOf(",") > 0 ? "s " : " ") + d.comp + "</span>" +
      "<h1>" + d.h1 + "</h1><p class=\"lede\">" + d.lede + "</p>" +
      (DECKS[sid] ? '<p class="deck-link"><a class="btn primary small" href="' + DECKS[sid] + '" target="_blank" rel="noopener">Ouvrir les diapos de la séance ↗</a></p>' : "") + "</div>" +
      '<div class="assettag" aria-hidden="true"><div class="row"><span>SÉANCE</span><span>' + d.hours + '</span></div><div class="big">' + meta.tag + '</div><div class="barcode"></div><div class="row"><span>PARC-JAVA</span><span>' + d.comp + "</span></div></div></header>" +
      (d.hero === "pipeline" ? pipelineHTML(d) : "") +
      '<nav class="tabs" role="tablist" aria-label="Parties de la séance">' + TABS.map(function (t) {
        return '<button class="tab" role="tab" id="tab-' + t[0] + '" aria-controls="panel" data-tab="' + t[0] + '"><span class="dot" id="dot-' + t[0] + '"></span>' + (labels[t[0]] || t[1]) + "</button>";
      }).join("") + "</nav>" +
      '<section id="panel" class="panel" role="tabpanel"></section>' +
      '<nav class="pager" aria-label="Séances">' + pagerHTML(sid) + "</nav>";
    if (d.hero === "pipeline") initPipeline(d);
    $$(".tab").forEach(function (b) { b.addEventListener("click", function () { location.hash = sid + "-" + b.dataset.tab; }); });
    refreshProgress();
  }
  function pagerHTML(sid) {
    var i = C.seances.map(function (s) { return s.id; }).indexOf(sid), h = "";
    if (i > 0) h += '<a class="btn ghost" href="#' + C.seances[i - 1].id + '">← ' + C.seances[i - 1].tag + " · " + esc(C.seances[i - 1].short) + "</a>";
    else h += "<span></span>";
    if (i < C.seances.length - 1) h += '<a class="btn ghost" href="#' + C.seances[i + 1].id + '">' + C.seances[i + 1].tag + " · " + esc(C.seances[i + 1].short) + " →</a>";
    return h;
  }
  function selectTab(id) {
    var sid = current.s || parseHash().s, d = C.data[sid];
    $$(".tab").forEach(function (b) { b.setAttribute("aria-selected", b.dataset.tab === id ? "true" : "false"); });
    var panel = $("#panel");
    panel.setAttribute("aria-labelledby", "tab-" + id);
    panel.innerHTML = "";
    PANELS[id](panel, sid, d);
    if (current.tab !== null) {
      var tabs = $(".tabs"); var y = tabs.getBoundingClientRect().top + window.scrollY - 4;
      if (window.scrollY > y) window.scrollTo(0, y);
    }
  }

  /* ---------- pipeline (S1) ---------- */
  function pipelineHTML(d) {
    var st = d.pipeline, h = "";
    st.forEach(function (p, i) {
      h += '<button class="stage" type="button" data-i="' + i + '" data-c="' + p.c + '"><b>' + esc(p.t) + "</b><small>" + esc(p.s) + "</small></button>";
      if (i < st.length - 1) h += '<span class="pipe-arrow" aria-hidden="true">──▶</span>';
    });
    return '<section class="pipeline" aria-label="Chaîne de compilation Java"><div class="pipe-row">' + h + "</div>" +
      '<div class="pipe-info" id="pipe-info" aria-live="polite">Clique sur une étape, ou lance l\'animation pour suivre le voyage de ton code.</div>' +
      '<div class="pipe-actions"><button class="btn primary" id="pipe-play" type="button">▶ Lancer le voyage</button><span class="pipe-note">4 étapes · 10 secondes</span></div></section>';
  }
  function initPipeline(d) {
    var stages = $$(".stage"), info = $("#pipe-info"), timer = null;
    function show(i) { stages.forEach(function (s, k) { s.classList.toggle("on", k === i); s.classList.toggle("lit", k < i); }); info.innerHTML = d.pipeline[i].d; }
    stages.forEach(function (s, i) { s.addEventListener("click", function () { clearInterval(timer); show(i); }); });
    $("#pipe-play").addEventListener("click", function () {
      clearInterval(timer); var i = 0; show(0);
      timer = setInterval(function () { i++; if (i >= stages.length) { clearInterval(timer); return; } show(i); }, 2500);
    });
  }

  /* ---------- composants réutilisables ---------- */
  var COMPS = {};
  COMPS.anatomy = function (box, sid) {
    var a = C.data[sid].anatomy;
    box.innerHTML = '<div class="anat"></div><div class="step-expl anat-info" aria-live="polite"><b>Clique sur un élément souligné.</b> Commence par <code>main</code> : c\'est là que tout démarre.</div>';
    var code = $(".anat", box);
    code.innerHTML = a.code.map(function (line) {
      return line.map(function (part) {
        if (typeof part === "string") return '<span class="p">' + esc(part) + "</span>";
        return '<button class="tok" type="button" data-k="' + part[1] + '">' + hlLine(part[0]) + "</button>";
      }).join("");
    }).join("\n");
    $$(".tok", code).forEach(function (t) {
      t.addEventListener("click", function () {
        $$(".tok", code).forEach(function (x) { x.classList.toggle("on", x.dataset.k === t.dataset.k); });
        var inf = a.info[t.dataset.k];
        $(".anat-info", box).innerHTML = "<b><code>" + esc(inf[0]) + "</code></b> — " + inf[1];
      });
    });
  };

  // Exemple exécutable dans la leçon
  function runBox(box, id, sid) {
    var p = prog(id);
    box.innerHTML = '<div class="codehead"><span>' + esc(p.file) + '</span><span class="run-actions"><button class="btn small primary" type="button" data-act="run">▶ Exécuter</button><button class="btn small ghost" type="button" data-act="lab">Ouvrir dans le labo</button></span></div>' +
      codeHTML(p.code) +
      (p.input != null ? '<label class="console-label" for="in-' + id + '">Entrée clavier (une valeur par ligne)</label><textarea class="mono stdin" id="in-' + id + '" rows="' + Math.min(5, p.input.split("\n").length) + '" spellcheck="false">' + esc(p.input.replace(/\n$/, "")) + "</textarea>" : "") +
      '<div class="console run-out" hidden aria-live="polite"></div>';
    $("[data-act=run]", box).addEventListener("click", function () {
      var inp = p.input != null ? $("#in-" + id, box).value + "\n" : "";
      var r = JavaMini.run(p.code, p.file, { input: inp });
      var out = $(".run-out", box); out.hidden = false;
      out.innerHTML = displayHTML(r.display) + (r.error ? '<span class="er">' + esc(errText(r)) + "</span>" : "");
    });
    $("[data-act=lab]", box).addEventListener("click", function () { pendingLab = { file: p.file, code: p.code, input: p.input || "" }; location.hash = sid + "-demos"; if (current.tab === "demos") { selectTab("demos"); } setTimeout(function () { var l = $("#labo"); if (l) l.scrollIntoView({ behavior: "smooth" }); }, 50); });
  }
  function errText(r) {
    var e = r.error;
    if (!e) return "";
    if (e.kind === "compile") return JavaMini.formatJavac(e);
    if (e.kind === "unsupported") return "(simulateur) " + e.fr;
    if (e.kind === "stopped") return "\n(simulateur) " + e.fr;
    return e.msg;
  }
  function explainHTML(r, okText) {
    var e = r.error;
    if (!e) return '<div class="explain ok"><b>Programme exécuté.</b> ' + (okText || "") + "</div>";
    if (e.kind === "compile") return '<div class="explain"><b>Erreur de compilation, ligne ' + e.line + ".</b> " + e.fr + " Aucun fichier .class n'a été créé.</div>";
    if (e.kind === "unsupported") return '<div class="explain warn"><b>Hors du périmètre du simulateur.</b> ' + e.fr + "</div>";
    if (e.kind === "launch") return '<div class="explain"><b>Erreur au lancement.</b> ' + e.fr + "</div>";
    if (e.kind === "stopped") return '<div class="explain warn"><b>Arrêt de sécurité.</b> ' + e.fr + "</div>";
    return '<div class="explain"><b>Exception à l\'exécution (' + esc(e.exc) + ").</b> " + JavaMini.excFr(e.exc) + " Le programme a compilé, mais il s'est arrêté à la ligne indiquée après « at ».</div>";
  }

  // Exécution pas à pas (trace calculée par le simulateur)
  function stepper(box, opts) {
    var r = JavaMini.run(opts.code, opts.file, { input: opts.input || "", trace: true, maxTrace: 800 });
    if (!r.compiled || (r.error && r.error.kind === "unsupported")) { box.innerHTML = '<div class="term"><span class="er">' + esc(errText(r)) + "</span></div>" + explainHTML(r); return; }
    var steps = r.steps.slice();
    steps.push({ line: null, vars: steps.length ? steps[steps.length - 1].vars : [], display: r.display, method: "", end: true });
    var lines = opts.code.replace(/\n$/, "").split("\n");
    box.innerHTML = '<div class="stepper"><div class="st-left"><span class="console-label">' + esc(opts.file) + '</span><div class="st-code"></div></div>' +
      '<div class="st-right"><span class="console-label">Console</span><div class="console st-con"></div><span class="console-label">Variables <span class="st-where"></span></span><div class="vars"></div><div class="step-expl st-expl" aria-live="polite"></div></div></div>' +
      '<div class="row-btns"><button class="btn" data-a="prev" type="button">◀ Précédent</button><button class="btn primary" data-a="next" type="button">Suivant ▶</button><button class="btn ghost" data-a="auto" type="button">Lecture auto</button><button class="btn ghost" data-a="reset" type="button">Recommencer</button><span class="pill st-count"></span></div>';
    var k = -1, auto = null, codeBox = $(".st-code", box);
    codeBox.innerHTML = codeHTML(lines);
    function draw() {
      var s = k >= 0 ? steps[k] : null;
      // état affiché : après l'exécution de la ligne en surbrillance (sauf si elle appelle une méthode)
      var after = s && !s.end ? steps[k + 1] : s;
      if (after && s && after.depth > s.depth) after = s;
      $$(".ln", codeBox).forEach(function (ln) { ln.classList.toggle("hl", !!s && +ln.dataset.n === s.line); });
      var hl = $(".ln.hl", codeBox);
      if (hl) { var pre = $("pre", codeBox); var top = hl.offsetTop - pre.clientHeight / 2; pre.scrollTop = Math.max(0, top); }
      $(".st-con", box).innerHTML = (after ? displayHTML(after.display) : "") + '<span class="cur"></span>';
      var vars = after ? after.vars : [];
      $(".vars", box).innerHTML = vars.length ? '<table class="vtbl"><tbody>' + vars.map(function (v) { return '<tr><td class="vt">' + esc(v[1]) + '</td><td class="vn">' + esc(v[0]) + '</td><td class="vv">' + esc(v[2]) + "</td></tr>"; }).join("") + "</tbody></table>" : '<span class="dim">aucune variable pour l\'instant</span>';
      $(".st-where", box).textContent = s && s.method ? "· dans " + s.method + "()" : "";
      var ex;
      if (!s) ex = "Appuie sur <b>Suivant</b> pour lancer le programme" + (opts.input ? " (l'entrée clavier est déjà fournie : " + esc(opts.input.trim().split("\n").join(" / ")) + ")" : "") + ".";
      else if (s.end) ex = r.error ? explainHTML(r) : "<b>Fin du programme.</b> La méthode main est terminée.";
      else ex = (opts.notes && opts.notes[s.line]) ? opts.notes[s.line] : "Ligne " + s.line + " : <code>" + esc(lines[s.line - 1].trim()) + "</code>";
      $(".st-expl", box).innerHTML = ex;
      $(".st-count", box).textContent = "étape " + Math.max(0, k + 1) + " / " + steps.length;
      $("[data-a=prev]", box).disabled = k < 0; $("[data-a=next]", box).disabled = k >= steps.length - 1;
      if (k === steps.length - 1 && opts.onEnd) opts.onEnd();
    }
    $("[data-a=next]", box).addEventListener("click", function () { if (k < steps.length - 1) { k++; draw(); } });
    $("[data-a=prev]", box).addEventListener("click", function () { if (k >= 0) { k--; draw(); } });
    $("[data-a=reset]", box).addEventListener("click", function () { clearInterval(auto); k = -1; draw(); });
    $("[data-a=auto]", box).addEventListener("click", function () {
      clearInterval(auto); if (k >= steps.length - 1) k = -1;
      auto = setInterval(function () { if (!document.body.contains(box) || k >= steps.length - 1) { clearInterval(auto); return; } k++; draw(); }, 1300);
    });
    draw();
  }

  // Labo
  var pendingLab = null;
  function labHTML(sid) {
    var ex = Object.keys(C.progs).filter(function (id) { return C.progs[id].lab && id.indexOf(sid + "_") === 0; });
    return '<div class="lab"><div class="lab-top"><div class="f"><label for="lab-file">Nom du fichier</label><input type="text" id="lab-file" class="mono" spellcheck="false"></div>' +
      '<div class="f"><label for="lab-ex">Charger un exemple</label><select id="lab-ex"><option value="">—</option>' + ex.map(function (id) { return '<option value="' + id + '">' + esc(C.progs[id].lab) + "</option>"; }).join("") + "</select></div></div>" +
      '<div class="editor"><label for="lab-src" class="sr">Code Java</label><textarea id="lab-src" class="mono" wrap="off" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></div>' +
      '<label for="lab-in" class="console-label">Entrée clavier (ce que l\'utilisateur tape, une valeur par ligne)</label><textarea id="lab-in" class="mono stdin" rows="3" spellcheck="false" placeholder="ex. 3&#10;7500"></textarea>' +
      '<div class="row-btns"><button class="btn primary" id="lab-run" type="button">▶ Compiler et exécuter</button><button class="btn" id="lab-step" type="button">Pas à pas</button><span class="console-label">La touche Tab insère 4 espaces.</span></div>' +
      '<div class="term" id="lab-out" aria-live="polite"><span class="dim">La sortie s\'affichera ici.</span></div><div id="lab-expl"></div><div id="lab-stepper"></div></div>';
  }
  function initLab(root, sid, onRun) {
    var src = $("#lab-src", root), file = $("#lab-file", root), inp = $("#lab-in", root), out = $("#lab-out", root), expl = $("#lab-expl", root), stp = $("#lab-stepper", root);
    var first = Object.keys(C.progs).filter(function (id) { return C.progs[id].lab && id.indexOf(sid + "_") === 0; })[0];
    function load(p) { file.value = p.file; src.value = p.code; inp.value = (p.input || "").replace(/\n$/, ""); out.innerHTML = '<span class="dim">Prêt.</span>'; expl.innerHTML = ""; stp.innerHTML = ""; }
    if (pendingLab) { load(pendingLab); pendingLab = null; } else if (first) load(C.progs[first]);
    src.addEventListener("keydown", function (e) { if (e.key === "Tab" && !e.shiftKey) { e.preventDefault(); var s = src.selectionStart; src.setRangeText("    ", s, src.selectionEnd, "end"); } });
    $("#lab-ex", root).addEventListener("change", function (e) { var p = C.progs[e.target.value]; if (p) load(p); });
    function fname() { var f = file.value.trim() || "Main.java"; if (!/\.java$/.test(f)) f += ".java"; return f; }
    $("#lab-run", root).addEventListener("click", function () {
      var f = fname(), cls = f.replace(/\.java$/, "");
      var r = JavaMini.run(src.value, f, { input: inp.value + "\n" });
      stp.innerHTML = "";
      var h = '<span class="pr">$</span> javac ' + esc(f) + "\n";
      if (r.error && (r.error.kind === "compile" || r.error.kind === "unsupported")) h += '<span class="er">' + esc(errText(r)) + "</span>";
      else {
        h += '<span class="dim">(compilation réussie)</span>\n<span class="pr">$</span> java ' + esc(cls) + "\n" + displayHTML(r.display);
        if (r.error) h += '<span class="er">' + esc(errText(r)) + "</span>";
        if (!r.error && onRun) onRun();
      }
      out.innerHTML = h;
      expl.innerHTML = explainHTML(r, "Modifie le code, change l'entrée clavier, ou casse quelque chose exprès pour lire le message.");
    });
    $("#lab-step", root).addEventListener("click", function () {
      out.innerHTML = '<span class="dim">Mode pas à pas ci-dessous.</span>'; expl.innerHTML = "";
      stepper(stp, { code: src.value, file: fname(), input: inp.value + "\n" });
    });
  }

  /* ================= PANNEAUX ================= */
  var PANELS = {};

  /* ----- Leçon ----- */
  PANELS.lecon = function (panel, sid, d) {
    var h = '<div class="card"><div class="head"><h2>Objectifs de la séance</h2><span class="pill">' + d.hours + "</span></div>" +
      '<ul class="check">' + d.objectives.map(function (o, i) { return '<li><span class="num">0' + (i + 1) + "</span><span>" + o + "</span></li>"; }).join("") + "</ul>" +
      (d.prereq ? '<p class="prereq"><b>Tu dois déjà savoir :</b> ' + d.prereq + "</p>" : "") + "</div>";
    d.lesson.forEach(function (s, i) {
      h += '<article class="card"><div class="head"><span class="num">' + (i + 1) + "</span><h2>" + s.title + "</h2></div>" + s.html +
        (s.check ? '<div class="note" data-check="' + i + '"></div>' : "") + "</article>";
    });
    var hasChecks = d.lesson.some(function (s) { return s.check; });
    h += '<div class="row-btns">' + (hasChecks ? "" : '<button class="btn" id="lesson-done" type="button">J\'ai lu toute la leçon</button>') + '<a class="btn primary" href="#' + sid + '-demos">Continuer : démos pas à pas →</a></div>';
    panel.innerHTML = h;
    hydrate(panel, sid);
    $$("[data-check]", panel).forEach(function (box) { miniCheck(box, d.lesson[+box.dataset.check].check, sid + ".check." + box.dataset.check); });
    var ld = $("#lesson-done", panel); if (ld) ld.addEventListener("click", function () { mark(sid + ".lecon"); ld.textContent = "Leçon terminée"; });
  };
  function miniCheck(box, c, key) {
    var order = perm(c.o.length);
    box.innerHTML = '<span class="lbl">Vérifie ta compréhension</span><div class="prose"><p><b>' + c.q + "</b></p></div>" + (c.code ? codeHTML(c.code) : "") + '<div class="opts">' + order.map(function (k, j) {
      return '<button class="opt" type="button" data-i="' + k + '"><span class="l">' + "ABCD"[j] + "</span><span>" + c.o[k] + "</span></button>";
    }).join("") + '</div><div class="fbz" aria-live="polite"></div>';
    $$(".opt", box).forEach(function (b) {
      b.addEventListener("click", function () {
        var ok = +b.dataset.i === c.a;
        $$(".opt", box).forEach(function (x) { x.classList.remove("right", "wrong"); });
        b.classList.add(ok ? "right" : "wrong");
        $(".fbz", box).innerHTML = '<p class="fb ' + (ok ? "ok" : "bad") + '">' + (ok ? "Exact." : "Pas tout à fait, réessaie.") + "</p>" + (ok ? "<p>" + c.e + "</p>" : "");
        if (ok) mark(key);
      });
    });
  }

  /* ----- Démos ----- */
  function demoList(d) { var l = (d.demos || []).slice(); if (!l.some(function (x) { return x.type === "lab"; })) l.push({ type: "lab" }); return l; }
  PANELS.demos = function (panel, sid, d) {
    var list = demoList(d), h = "";
    list.forEach(function (dm, i) {
      var key = sid + ".demo." + i, pill = '<span class="pill' + (state.done[key] ? " done" : "") + '" id="pill-demo-' + i + '">' + (state.done[key] ? "fait" : "à faire") + "</span>";
      if (dm.type === "lab") h += '<article class="card" id="labo"><div class="head"><span class="num">D' + (i + 1) + "</span><h2>Labo : écris, lance, observe</h2>" + pill + "</div>" +
        '<p class="prose">Le simulateur imite <code>javac</code> et <code>java</code> pour tout ce que couvre le cours. Ses messages d\'erreur reprennent ceux du vrai compilateur, avec une explication en français. Pour ce qu\'il ne sait pas faire (fichiers, interfaces graphiques…), utilise ton JDK.</p>' + labHTML(sid) + "</article>";
      else if (dm.type === "term") h += '<article class="card"><div class="head"><span class="num">D' + (i + 1) + "</span><h2>Dans le terminal : compiler puis exécuter</h2>" + pill + '</div><div data-term="' + i + '"></div></article>';
      else h += '<article class="card"><div class="head"><span class="num">D' + (i + 1) + "</span><h2>" + dm.title + "</h2>" + pill + "</div>" + (dm.intro ? '<div class="prose"><p>' + dm.intro + "</p></div>" : "") + '<div data-stepper="' + i + '"></div></article>';
    });
    panel.innerHTML = h;
    list.forEach(function (dm, i) {
      var key = sid + ".demo." + i, done = function () { mark(key); setPill($("#pill-demo-" + i, panel), true); };
      if (dm.type === "lab") initLab(panel, sid, done);
      else if (dm.type === "term") termDemo($('[data-term="' + i + '"]', panel), done);
      else { var p = prog(dm.prog); stepper($('[data-stepper="' + i + '"]', panel), { code: p.code, file: p.file, input: dm.input != null ? dm.input : (p.input || ""), notes: dm.notes, onEnd: done }); }
    });
  };
  function termDemo(box, done) {
    box.innerHTML = '<p class="prose">Exécute les commandes une par une, dans l\'ordre, et observe le contenu du dossier. Puis recommence avec la version qui contient une erreur.</p>' +
      '<div class="row-btns" role="group" aria-label="Version du fichier"><label><input type="radio" name="tv" value="ok" checked> HelloWorld.java correct</label><label><input type="radio" name="tv" value="bad"> avec un « ; » oublié</label></div>' +
      '<div class="grid-2"><div class="stack"><span class="console-label">Dossier java-s1</span><div class="term td-files"></div></div><div class="stack"><span class="console-label">Commandes</span><div class="row-btns td-cmds"></div></div></div>' +
      '<div class="term td-out" aria-live="polite" style="min-height:150px"></div><div class="step-expl td-expl">Commence par lister le dossier.</div>';
    var files = $(".td-files", box), outEl = $(".td-out", box), expl = $(".td-expl", box), cmds = $(".td-cmds", box);
    var hasClass = false, log = "", seen = {};
    function version() { return $("input[name=tv]:checked", box).value; }
    function drawFiles() { files.innerHTML = "HelloWorld.java" + (hasClass ? '\n<span class="okc">HelloWorld.class</span>' : ""); }
    var CM = ["ls", "javac HelloWorld.java", "ls", "java HelloWorld", "java HelloWorld.class"];
    cmds.innerHTML = CM.map(function (c, i) { return '<button class="btn ghost mono" type="button" data-i="' + i + '">$ ' + esc(c) + "</button>"; }).join("");
    function exec(i) {
      var c = CM[i], bad = version() === "bad", res = "", e = "";
      if (c === "ls") { res = "HelloWorld.java" + (hasClass ? "  HelloWorld.class" : ""); e = hasClass ? "Le fichier <code>HelloWorld.class</code> est apparu : c'est le bytecode produit par javac." : "Le dossier ne contient que le code source. Rien n'est encore exécutable."; }
      else if (c === "javac HelloWorld.java") {
        if (bad) { hasClass = false; res = '<span class="er">HelloWorld.java:3: error: \';\' expected\n        System.out.println("Bonjour, Java !")\n                                             ^\n1 error</span>'; e = "javac a trouvé une erreur : il s'arrête et <b>ne crée pas</b> de <code>.class</code>. Relance <code>ls</code> pour le vérifier."; }
        else { hasClass = true; res = '<span class="dim">(aucun message)</span>'; e = "Aucun message = <b>succès</b>. C'est déroutant au début : javac ne dit rien quand tout va bien."; }
      } else if (c === "java HelloWorld") {
        if (hasClass) { res = '<span class="okc">Bonjour, Java !</span>'; e = "La JVM a chargé <code>HelloWorld.class</code>, trouvé <code>main</code> et exécuté l'instruction."; }
        else { res = '<span class="er">Error: Could not find or load main class HelloWorld\nCaused by: java.lang.ClassNotFoundException: HelloWorld</span>'; e = "Il n'y a pas de <code>HelloWorld.class</code> : la JVM n'a rien à exécuter. Il faut d'abord compiler sans erreur."; }
      } else { res = '<span class="er">Error: Could not find or load main class HelloWorld.class\nCaused by: java.lang.ClassNotFoundException: HelloWorld.class</span>'; e = "On donne à <code>java</code> le <b>nom de la classe</b>, sans extension. Ici la JVM cherche une classe appelée « HelloWorld.class », qui n'existe pas."; }
      log += '<span class="pr">$</span> ' + esc(c) + "\n" + res + "\n";
      outEl.innerHTML = log; outEl.scrollTop = outEl.scrollHeight; expl.innerHTML = e; drawFiles();
      seen[version() + i] = true;
      if (seen.ok1 && seen.ok3 && seen.bad1) done();
    }
    $$("button", cmds).forEach(function (b) { b.addEventListener("click", function () { exec(+b.dataset.i); }); });
    $$("input[name=tv]", box).forEach(function (r) { r.addEventListener("change", function () { hasClass = false; log = ""; outEl.innerHTML = ""; drawFiles(); expl.innerHTML = r.value === "bad" ? "Version avec erreur : la ligne 3 n'a pas de point-virgule. Compile, puis liste le dossier." : "Version correcte. Commence par lister le dossier."; }); });
    drawFiles();
  }

  /* ----- Exercices ----- */
  var LVL = { 1: "facile", 2: "moyen", 3: "défi" };
  PANELS.exercices = function (panel, sid, d) {
    var h = '<p class="prose intro">Chaque exercice a une <b>correction expliquée</b>. Essaie vraiment avant de l\'ouvrir : c\'est en se trompant qu\'on apprend à lire le code. Les exercices « À toi d\'écrire » sont vérifiés automatiquement avec plusieurs jeux d\'essai.</p>';
    d.exercises.forEach(function (ex, i) {
      var key = sid + ".ex." + i, dn = state.done[key];
      h += '<article class="card ex" data-ex="' + i + '"><div class="head"><span class="num">E' + (i + 1) + "</span><h2>" + ex.title + '</h2><span class="pill lvl">' + (LVL[ex.lvl] || "facile") + '</span><span class="pill' + (dn ? " done" : "") + '" data-pill>' + (dn ? "réussi" : "à faire") + '</span></div><div class="exbody"></div></article>';
    });
    panel.innerHTML = h;
    d.exercises.forEach(function (ex, i) {
      var card = $('[data-ex="' + i + '"]', panel), body = $(".exbody", card), key = sid + ".ex." + i;
      var ok = function () { mark(key); var p = $("[data-pill]", card); p.className = "pill done"; p.textContent = "réussi"; };
      EX[ex.type](body, ex, ok, sid);
      hydrate(body, sid);
    });
  };
  var EX = {};
  function details(sum, inner) { return "<details><summary>" + sum + '</summary><div class="in">' + inner + "</div></details>"; }
  EX.predict = function (body, ex, ok) {
    var p = prog(ex.prog), exp = EXP[ex.prog];
    body.innerHTML = '<div class="prose"><p>' + (ex.statement || "Sans exécuter, écris exactement ce que ce programme affiche.") + "</p></div>" + codeHTML(p.code) +
      (p.input ? '<p class="console-label">Entrée clavier : ' + esc(p.input.trim().split("\n").join(" ⏎ ")) + "</p>" : "") +
      '<label>Ta réponse<textarea class="mono ans" rows="' + Math.max(3, (exp ? exp.out.split("\n").length : 3)) + '" spellcheck="false"></textarea></label>' +
      '<div class="row-btns"><button class="btn primary" type="button" data-go>Vérifier</button></div><div class="fb-box" aria-live="polite"></div>' +
      (ex.hint ? details("Indice", "<p>" + ex.hint + "</p>") : "") +
      details("Correction expliquée", '<div class="console">' + esc(exp ? exp.out : "") + "</div><p>" + (ex.expl || "") + "</p>");
    $("[data-go]", body).addEventListener("click", function () {
      var mine = $(".ans", body).value, good = exp ? exp.out : "";
      var tol = function (s) { return ex.loose ? norm(s).replace(/[ \t]+/g, " ") : norm(s); };
      var yes = tol(mine) === tol(good);
      var nl = norm(mine).split("\n").length, gl = norm(good).split("\n").length;
      $(".fb-box", body).innerHTML = yes ? '<p class="fb ok">Exactement ça.</p>' : '<p class="fb bad">Pas encore. ' + (nl !== gl ? "Le programme affiche " + gl + " ligne(s), tu en as écrit " + nl + "." : "Le nombre de lignes est bon ; vérifie chaque caractère (espaces, décimales, ordre).") + "</p>";
      if (yes) ok();
    });
  };
  EX.mcq = function (body, ex, ok) {
    var solved = {};
    body.innerHTML = (ex.intro ? '<div class="prose"><p>' + ex.intro + "</p></div>" : "") + '<div class="mcqs">' + ex.items.map(function (q, i) {
      var order = perm(q.o.length);
      return '<div class="q" data-q="' + i + '"><div class="prose"><p><b>' + (ex.items.length > 1 ? (i + 1) + ". " : "") + q.q + "</b></p></div>" + (q.code ? codeHTML(q.code) : "") + (q.term ? '<div class="term"><span class="er">' + esc(q.term) + "</span></div>" : "") + '<div class="opts">' +
        order.map(function (k, j) { return '<button class="opt" type="button" data-k="' + k + '"><span class="l">' + "ABCD"[j] + "</span><span>" + q.o[k] + "</span></button>"; }).join("") + '</div><div class="fbz" aria-live="polite"></div></div>';
    }).join("") + "</div>";
    $$("[data-q]", body).forEach(function (qb) {
      var i = +qb.dataset.q, q = ex.items[i];
      $$(".opt", qb).forEach(function (b) {
        b.addEventListener("click", function () {
          var yes = +b.dataset.k === q.a;
          $$(".opt", qb).forEach(function (x) { x.classList.remove("right", "wrong"); }); b.classList.add(yes ? "right" : "wrong");
          $(".fbz", qb).innerHTML = '<p class="fb ' + (yes ? "ok" : "bad") + '">' + (yes ? "Exact." : "Non, réessaie.") + "</p>" + (yes ? "<p>" + q.e + "</p>" : "");
          if (yes) { solved[i] = 1; if (Object.keys(solved).length === ex.items.length) ok(); }
        });
      });
    });
  };
  EX.hunt = function (body, ex, ok) {
    var sel = {};
    body.innerHTML = '<div class="prose"><p>' + (ex.statement || "Ce programme ne compile pas. <b>Clique sur chaque ligne qui contient une erreur</b>, puis vérifie.") + '</p></div><div class="pick hu-code"></div>' +
      '<div class="row-btns"><button class="btn primary" type="button" data-go>Vérifier ma sélection</button><button class="btn ghost" type="button" data-sol>Voir les messages de javac et la correction</button></div><div class="fb-box" aria-live="polite"></div><div class="sol-box"></div>';
    var hc = $(".hu-code", body); hc.innerHTML = codeHTML(ex.code);
    $$(".ln", hc).forEach(function (ln) {
      ln.setAttribute("tabindex", "0"); ln.setAttribute("role", "button");
      function tg() { var n = +ln.dataset.n; sel[n] = !sel[n]; ln.classList.toggle("sel", !!sel[n]); ln.setAttribute("aria-pressed", sel[n] ? "true" : "false"); }
      ln.addEventListener("click", tg); ln.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tg(); } });
    });
    $("[data-go]", body).addEventListener("click", function () {
      var picked = Object.keys(sel).filter(function (k) { return sel[k]; }).map(Number);
      var found = picked.filter(function (n) { return ex.bad.indexOf(n) >= 0; }).length, wrong = picked.filter(function (n) { return ex.bad.indexOf(n) < 0; });
      var yes = found === ex.bad.length && !wrong.length;
      $(".fb-box", body).innerHTML = yes ? '<p class="fb ok">Bravo : les ' + ex.bad.length + " lignes fautives sont trouvées. Ouvre la correction pour lire les messages exacts.</p>" :
        '<p class="fb bad">' + found + " / " + ex.bad.length + " erreurs trouvées" + (wrong.length ? ", et " + wrong.length + " ligne(s) correcte(s) sélectionnée(s) à tort" : "") + ".</p>";
      if (yes) ok();
    });
    $("[data-sol]", body).addEventListener("click", function () {
      $$(".ln", hc).forEach(function (ln) { ln.classList.toggle("bad", ex.bad.indexOf(+ln.dataset.n) >= 0); });
      $(".sol-box", body).innerHTML = '<div class="stack">' + ex.bad.map(function (n) {
        var f = ex.fixes[n];
        return '<div class="tile"><h4>Ligne ' + n + "</h4>" + (f.msg ? '<div class="term"><span class="er">' + esc(f.msg) + "</span></div>" : "") + "<p>" + f.fr + "</p>" + codeHTML([f.fix]) + "</div>";
      }).join("") + (ex.order ? '<div class="note warn"><span class="lbl">À savoir</span><div>' + ex.order + "</div></div>" : "") + "</div>";
    });
  };
  EX.parsons = function (body, ex, ok) {
    var order = [];
    body.innerHTML = '<div class="prose"><p>' + ex.goal + ' Glisse les lignes, ou utilise les flèches.</p></div><ul class="parsons"></ul><div class="row-btns"><button class="btn primary" type="button" data-go>Vérifier l\'ordre</button><button class="btn ghost" type="button" data-mix>Mélanger à nouveau</button></div><div class="fb-box" aria-live="polite"></div>' +
      (ex.hint ? details("Indice", "<p>" + ex.hint + "</p>") : "");
    var list = $(".parsons", body);
    function shuffle() { do { order = ex.lines.map(function (_, i) { return i; }).sort(function () { return Math.random() - .5; }); } while (order.every(function (v, i) { return ex.lines[v] === ex.lines[i]; })); }
    function draw() {
      list.innerHTML = order.map(function (li, pos) {
        return '<li draggable="true" data-pos="' + pos + '"><span>' + hlLine(ex.lines[li]) + '</span><span class="mv"><button type="button" data-up="' + pos + '" aria-label="Monter">↑</button><button type="button" data-dn="' + pos + '" aria-label="Descendre">↓</button></span></li>';
      }).join("");
      var from = null;
      $$("li", list).forEach(function (li) {
        li.addEventListener("dragstart", function () { from = +li.dataset.pos; li.classList.add("drag"); });
        li.addEventListener("dragend", function () { li.classList.remove("drag"); });
        li.addEventListener("dragover", function (e) { e.preventDefault(); li.classList.add("over"); });
        li.addEventListener("dragleave", function () { li.classList.remove("over"); });
        li.addEventListener("drop", function (e) { e.preventDefault(); var to = +li.dataset.pos; var it = order.splice(from, 1)[0]; order.splice(to, 0, it); draw(); });
      });
      $$("[data-up]", list).forEach(function (b) { b.addEventListener("click", function () { var i = +b.dataset.up; if (i > 0) { var t = order[i]; order[i] = order[i - 1]; order[i - 1] = t; draw(); } }); });
      $$("[data-dn]", list).forEach(function (b) { b.addEventListener("click", function () { var i = +b.dataset.dn; if (i < order.length - 1) { var t = order[i]; order[i] = order[i + 1]; order[i + 1] = t; draw(); } }); });
    }
    shuffle(); draw();
    $("[data-mix]", body).addEventListener("click", function () { shuffle(); draw(); $(".fb-box", body).innerHTML = ""; });
    $("[data-go]", body).addEventListener("click", function () {
      var good = 0;
      $$("li", list).forEach(function (li, pos) { var y = ex.lines[order[pos]] === ex.lines[pos]; li.classList.toggle("right", y); li.classList.toggle("wrong", !y); if (y) good++; });
      var all = good === ex.lines.length;
      $(".fb-box", body).innerHTML = all ? '<p class="fb ok">Programme reconstitué. ' + (ex.note || "") + "</p>" : '<p class="fb bad">' + good + " / " + ex.lines.length + " lignes à la bonne place (bordure verte).</p>";
      if (all) ok();
    });
  };
  EX.match = function (body, ex, ok) {
    body.innerHTML = '<div class="prose"><p>' + (ex.statement || "Associe chaque élément à sa description.") + '</p></div><div class="match">' + ex.items.map(function (it, i) {
      return '<div class="mrow"><code>' + esc(it.k) + '</code><div><label class="sr" for="ma' + i + '">' + esc(it.k) + '</label><select data-i="' + i + '"><option value="">Choisir…</option>' +
        perm(ex.choices.length).map(function (k) { var c = ex.choices[k]; return '<option value="' + c.v + '">' + esc(c.t) + "</option>"; }).join("") + "</select></div></div>";
    }).join("") + '</div><div class="row-btns"><button class="btn primary" type="button" data-go>Vérifier</button></div><div class="fb-box" aria-live="polite"></div>';
    $("[data-go]", body).addEventListener("click", function () {
      var good = 0;
      ex.items.forEach(function (it, i) { var s = $('select[data-i="' + i + '"]', body), y = s.value === it.a; s.classList.toggle("is-ok", y); s.classList.toggle("is-bad", !y); if (y) good++; });
      $(".fb-box", body).innerHTML = good === ex.items.length ? '<p class="fb ok">Tout est juste.</p>' : '<p class="fb bad">' + good + " / " + ex.items.length + " associations correctes.</p>";
      if (good === ex.items.length) ok();
    });
  };
  // code à trous : [[réponse|variante]]
  EX.fill = function (body, ex, ok) {
    var blanks = [], k = 0;
    var html = esc(ex.code).replace(/\[\[(.+?)\]\]/g, function (m, alts) {
      var a = alts.split("|"); blanks.push(a);
      var w = Math.max(4, Math.max.apply(null, a.map(function (x) { return x.length; })) + 1);
      return '<input class="blank mono" data-b="' + (k++) + '" size="' + w + '" spellcheck="false" autocapitalize="off" aria-label="trou ' + k + '">';
    });
    body.innerHTML = '<div class="prose"><p>' + ex.statement + '</p></div><pre class="code fillcode">' + html + "</pre>" +
      '<div class="row-btns"><button class="btn primary" type="button" data-go>Vérifier</button></div><div class="fb-box" aria-live="polite"></div>' +
      details("Correction expliquée", codeHTML(ex.code.replace(/\[\[(.+?)\]\]/g, function (m, a) { return a.split("|")[0]; })) + "<p>" + (ex.expl || "") + "</p>");
    $("[data-go]", body).addEventListener("click", function () {
      var good = 0;
      $$(".blank", body).forEach(function (inp) {
        var v = inp.value.replace(/\s+/g, ""), y = blanks[+inp.dataset.b].some(function (a) { return a.replace(/\s+/g, "") === v; });
        inp.classList.toggle("is-ok", y); inp.classList.toggle("is-bad", !y); if (y) good++;
      });
      $(".fb-box", body).innerHTML = good === blanks.length ? '<p class="fb ok">Tous les trous sont corrects.</p>' : '<p class="fb bad">' + good + " / " + blanks.length + " trous corrects (bordure verte).</p>";
      if (good === blanks.length) ok();
    });
  };
  // À toi d'écrire : vérification automatique par jeux d'essai
  EX.write = function (body, ex, ok, sid) {
    body.innerHTML = writeHTML(ex);
    initWrite(body, ex, ok);
  };
  function writeHTML(ex) {
    return '<div class="prose">' + ex.statement + "</div>" +
      (ex.example ? '<span class="console-label">Exemple d\'exécution attendu</span>' + exampleRun(ex) : "") +
      '<div class="lab"><div class="lab-top"><div class="f"><label>Fichier<input type="text" class="mono w-file" value="' + esc(ex.file) + '" spellcheck="false"></label></div></div>' +
      '<div class="editor"><textarea class="mono w-src" wrap="off" spellcheck="false" autocapitalize="off" aria-label="Ton code">' + esc(ex.starter || "") + "</textarea></div>" +
      '<div class="row-btns"><button class="btn primary" type="button" data-test>✓ Tester mon programme (' + ex.tests.length + " essai" + (ex.tests.length > 1 ? "s" : "") + ')</button><button class="btn ghost" type="button" data-reset>Recommencer</button></div>' +
      '<div class="w-res" aria-live="polite"></div></div>' +
      (ex.hint ? details("Indice", "<div class=\"prose\">" + ex.hint + "</div>") : "") +
      details("Une solution possible", codeHTML(prog(ex.solution).code) + (ex.expl ? '<div class="prose"><p>' + ex.expl + "</p></div>" : ""));
  }
  function exampleRun(ex) {
    var t = ex.tests[0], e = EXP[ex.solution + "#0"];
    var r = JavaMini.run(prog(ex.solution).code, prog(ex.solution).file, { input: t.input || "" });
    return '<div class="console">' + (r.compiled ? displayHTML(r.display) : esc(e ? e.out : "")) + "</div>";
  }
  function initWrite(body, ex, ok) {
    var src = $(".w-src", body);
    src.addEventListener("keydown", function (e) { if (e.key === "Tab" && !e.shiftKey) { e.preventDefault(); var s = src.selectionStart; src.setRangeText("    ", s, src.selectionEnd, "end"); } });
    $("[data-reset]", body).addEventListener("click", function () { src.value = ex.starter || ""; $(".w-res", body).innerHTML = ""; });
    $("[data-test]", body).addEventListener("click", function () {
      var f = $(".w-file", body).value.trim() || ex.file;
      var res = $(".w-res", body), passed = 0, h = "";
      for (var i = 0; i < ex.tests.length; i++) {
        var t = ex.tests[i], exp = EXP[ex.solution + "#" + i];
        var r = JavaMini.run(src.value, f, { input: t.input || "" });
        if (r.error && (r.error.kind === "compile" || r.error.kind === "unsupported" || r.error.kind === "launch")) {
          h = '<div class="term"><span class="er">' + esc(errText(r)) + "</span></div>" + explainHTML(r);
          passed = -1; break;
        }
        var expected = exp ? exp.out : "";
        var good = ex.loose ? norm(r.out).replace(/[ \t]+/g, " ") === norm(expected).replace(/[ \t]+/g, " ") : norm(r.out) === norm(expected);
        if (r.error && exp && !exp.err) good = false;
        if (good) passed++;
        h += '<div class="test ' + (good ? "pass" : "fail") + '"><div class="test-h"><b>' + (good ? "✓" : "✗") + " Essai " + (i + 1) + "</b> " + esc(t.label || "") + (t.input ? ' <span class="dim">· entrée : ' + esc(t.input.trim().split("\n").join(" ⏎ ")) + "</span>" : "") + "</div>" +
          (good ? "" : '<div class="grid-2"><div class="stack"><span class="console-label">Attendu</span><div class="console">' + esc(expected) + '</div></div><div class="stack"><span class="console-label">Obtenu</span><div class="console">' + displayHTML(r.display) + (r.error ? '<span class="er">' + esc(errText(r)) + "</span>" : "") + "</div></div></div>") + "</div>";
      }
      if (passed >= 0) h = '<p class="fb ' + (passed === ex.tests.length ? "ok" : "bad") + '">' + passed + " / " + ex.tests.length + " essais réussis." + (passed === ex.tests.length ? " Bravo !" : " Compare l'affichage attendu et obtenu, caractère par caractère.") + "</p>" + h;
      res.innerHTML = h;
      if (passed === ex.tests.length) ok();
    });
  }

  /* ----- TP ----- */
  PANELS.tp = function (panel, sid, d) {
    var T = d.tp, st = state.tp[sid] || {};
    var h = '<div class="card"><div class="head"><h2>' + T.title + '</h2><span class="pill">' + T.duration + '</span><span class="pill lvl">livrable : ' + T.deliverable + "</span></div>" +
      '<div class="prose"><p>' + T.intro + "</p></div>" +
      '<ul class="check tp-list">' + T.steps.map(function (s, i) { return '<li><input type="checkbox" id="tp' + i + '"' + (st[i] ? " checked" : "") + '><label for="tp' + i + '">' + s + "</label></li>"; }).join("") + "</ul></div>";
    T.parts.forEach(function (p, i) {
      h += '<div class="card" data-part="' + i + '"><div class="head"><span class="num">' + "ABCDEFGH"[i] + "</span><h3>" + p.title + "</h3>" + (p.bonus ? '<span class="pill lvl">bonus</span>' : "") + "</div>" + (p.html || "") +
        (p.expected ? '<span class="console-label">Affichage attendu' + (p.expected.input ? " (avec l'entrée : " + esc(p.expected.input.trim().split("\n").join(" ⏎ ")) + ")" : "") + '</span><div class="console exp-box"></div>' : "") +
        (p.write ? '<div class="part-write"></div>' : "") +
        (p.solution && !p.write ? details("Correction", codeHTML(prog(p.solution).code) + (p.expl ? '<div class="prose"><p>' + p.expl + "</p></div>" : "")) : "") + "</div>";
    });
    panel.innerHTML = h;
    $$(".tp-list input", panel).forEach(function (cb, i) { cb.addEventListener("change", function () { state.tp[sid] = state.tp[sid] || {}; state.tp[sid][i] = cb.checked; save(); }); });
    T.parts.forEach(function (p, i) {
      var card = $('[data-part="' + i + '"]', panel);
      if (p.expected) {
        var pr = prog(p.expected.prog), r = JavaMini.run(pr.code, pr.file, { input: p.expected.input || pr.input || "" });
        $(".exp-box", card).innerHTML = r.compiled ? displayHTML(r.display) : esc((EXP[p.expected.prog] || {}).out || "");
      }
      if (p.write) { var w = $(".part-write", card); w.innerHTML = writeHTML(p.write); initWrite(w, p.write, function () {}); }
      hydrate(card, sid);
    });
  };

  /* ----- Quiz ----- */
  PANELS.quiz = function (panel, sid, d) {
    var best = state.quizBest[sid], need = Math.ceil(d.quiz.length * 0.75);
    panel.innerHTML = '<div class="card"><div class="head"><h2>Quiz de la séance ' + sid.slice(1) + '</h2><span class="pill">' + d.quiz.length + ' questions</span><span class="pill' + (best >= need ? " done" : "") + '">' + (best != null ? "meilleur score : " + best + "/" + d.quiz.length : "pas encore tenté") + "</span></div>" +
      '<p class="prose">Une question à la fois, avec l\'explication après chaque réponse. Objectif : au moins ' + need + "/" + d.quiz.length + '.</p><div class="qz"></div></div>';
    var Q = d.quiz, i = 0, res = [], box = $(".qz", panel);
    function bar() { return '<div class="qbar" aria-hidden="true">' + Q.map(function (_, k) { return '<i class="' + (k < res.length ? (res[k] ? "r" : "w") : k === i ? "c" : "") + '"></i>'; }).join("") + "</div>"; }
    function show() {
      var q = Q[i], order = perm(q.o.length);
      box.innerHTML = bar() + '<div class="q"><div class="q-head"><span class="num">Question ' + (i + 1) + " / " + Q.length + '</span></div><div class="prose"><p><b>' + q.q + "</b></p></div>" + (q.code ? codeHTML(q.code) : "") + '<div class="opts">' +
        order.map(function (k, j) { return '<button class="opt" type="button" data-k="' + k + '"><span class="l">' + "ABCD"[j] + "</span><span>" + q.o[k] + "</span></button>"; }).join("") + '</div><div class="fbz" aria-live="polite"></div></div>';
      $$(".opt", box).forEach(function (b) {
        b.addEventListener("click", function () {
          var y = +b.dataset.k === q.a; res.push(y);
          $$(".opt", box).forEach(function (x) { x.disabled = true; if (+x.dataset.k === q.a) x.classList.add("right"); });
          if (!y) b.classList.add("wrong");
          $(".fbz", box).innerHTML = '<p class="fb ' + (y ? "ok" : "bad") + '">' + (y ? "Bonne réponse." : "Mauvaise réponse.") + "</p><p>" + q.e + '</p><div class="row-btns"><button class="btn primary" type="button" data-next>' + (i < Q.length - 1 ? "Question suivante →" : "Voir mon score") + "</button></div>";
          $(".qbar", box).outerHTML = bar();
          var nx = $("[data-next]", box); nx.addEventListener("click", function () { i++; if (i < Q.length) show(); else end(); }); nx.focus();
        });
      });
    }
    function end() {
      var sc = res.filter(Boolean).length;
      if (state.quizBest[sid] == null || sc > state.quizBest[sid]) { state.quizBest[sid] = sc; save(); }
      var msg = sc === Q.length ? "Parfait." : sc >= need ? "Objectif atteint. Relis les explications des questions manquées." : "Objectif non atteint : revois la leçon, puis retente.";
      box.innerHTML = bar() + '<div class="q" style="justify-items:start"><span class="score-big">' + sc + " / " + Q.length + '</span><p class="fb ' + (sc >= need ? "ok" : "bad") + '">' + msg + "</p>" +
        details("Revoir mes erreurs", Q.map(function (q, k) { return res[k] ? "" : '<div class="tile"><div class="prose"><p><b>' + q.q + "</b></p></div>" + (q.code ? codeHTML(q.code) : "") + "<p>Réponse : <b>" + q.o[q.a] + "</b></p><p>" + q.e + "</p></div>"; }).join("") || "<p>Aucune erreur.</p>") +
        '<div class="row-btns"><button class="btn primary" type="button" data-again>Recommencer le quiz</button><a class="btn ghost" href="#' + sid + '-memo">Fiche mémo →</a></div></div>';
      $("[data-again]", box).addEventListener("click", function () { i = 0; res = []; show(); });
    }
    show();
  };

  /* ----- Vidéos ----- */
  PANELS.videos = function (panel, sid, d) {
    var V = d.video, seen = state.done[sid + ".video"];
    var mm = Math.floor(V.dur / 60), ss = ("0" + (V.dur % 60)).slice(-2);
    panel.innerHTML = '<div class="card"><div class="head"><h2>Vidéo animée : ' + V.title + '</h2><span class="pill">' + mm + " min " + ss + '</span><span class="pill' + (seen ? " done" : "") + '" id="vid-pill">' + (seen ? "vue" : "à voir") + "</span></div>" +
      '<video id="vid" controls preload="metadata" playsinline src="' + V.src + '"></video>' +
      '<p class="console-label">Sans son : les explications sont écrites à l\'écran. Clique sur un chapitre pour y aller directement.</p>' +
      '<div class="chapters">' + V.chapters.map(function (c) { var m = Math.floor(c[0] / 60), s = ("0" + (c[0] % 60)).slice(-2); return '<button class="chap" type="button" data-t="' + c[0] + '"><span>' + m + ":" + s + "</span>" + esc(c[1]) + "</button>"; }).join("") + "</div></div>" +
      '<div class="card"><div class="head"><h2>Pour aller plus loin en vidéo</h2></div><p class="prose">Des vidéos en français publiées sur YouTube par d\'autres enseignants. Chaque lien ouvre une recherche YouTube sur le sujet : choisis une vidéo récente et courte.</p><div class="links">' +
      d.youtube.map(function (y) { return '<a class="link" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(y.q) + '" target="_blank" rel="noopener"><span class="yt">YouTube</span><span><b>' + esc(y.t) + '</b><br><span class="src">' + esc(y.src) + "</span><br>" + esc(y.d) + "</span></a>"; }).join("") + "</div></div>" +
      '<div class="card"><div class="head"><h2>Documentation de référence</h2></div><div class="links">' +
      d.docs.map(function (x) { return '<a class="link" href="' + x.u + '" target="_blank" rel="noopener"><span class="doc">DOC</span><span><b>' + esc(x.t) + '</b><br><span class="src">' + esc(x.src) + "</span><br>" + esc(x.d) + "</span></a>"; }).join("") + "</div></div>";
    var v = $("#vid", panel);
    $$(".chap", panel).forEach(function (b) { b.addEventListener("click", function () { v.currentTime = +b.dataset.t; var p = v.play(); if (p && p.catch) p.catch(function () {}); }); });
    v.addEventListener("timeupdate", function () { if (v.duration && v.currentTime / v.duration > 0.8 && !state.done[sid + ".video"]) { mark(sid + ".video"); setPill($("#vid-pill", panel), true, "vue"); } });
  };

  /* ----- Mémo ----- */
  PANELS.memo = function (panel, sid, d) {
    var M = d.memo, st = state.self[sid] || {};
    var h = '<div class="card"><div class="head"><h2>Fiche mémo — Séance ' + sid.slice(1) + "</h2></div>" +
      '<div class="grid-2">' + M.cards.map(function (c) { return '<div class="tile memo-tile"><h4>' + c[0] + "</h4><div>" + c[1] + "</div></div>"; }).join("") + "</div>" +
      (M.code ? '<span class="console-label">' + (M.codeTitle || "Modèle à connaître") + "</span>" + codeHTML(M.code) : "") + "</div>" +
      (M.errors ? '<div class="card"><div class="head"><h2>Erreurs fréquentes</h2></div>' + K.table(["Message ou symptôme", "Cause probable", "Correction"], M.errors) + "</div>" : "") +
      '<div class="card"><div class="head"><h2>Glossaire</h2></div><div class="tbl-wrap"><table class="tbl"><tbody>' + M.glossary.map(function (g) { return '<tr><th scope="row" class="gl">' + g[0] + "</th><td>" + g[1] + "</td></tr>"; }).join("") + "</tbody></table></div></div>" +
      '<div class="card"><div class="head"><h2>Auto-évaluation</h2></div><p class="prose">Coche honnêtement. Ce qui reste décoché est ce que tu dois revoir avant la séance suivante.</p><ul class="check self-list">' +
      M.selfcheck.map(function (s, i) { return '<li><input type="checkbox" id="sf' + i + '"' + (st[i] ? " checked" : "") + '><label for="sf' + i + '">' + s + "</label></li>"; }).join("") + "</ul>" +
      (M.next ? '<div class="note"><span class="lbl">Ensuite</span><div>' + M.next + "</div></div>" : "") + "</div>";
    panel.innerHTML = h;
    hydrate(panel, sid);
    $$(".self-list input", panel).forEach(function (cb, i) { cb.addEventListener("change", function () { state.self[sid] = state.self[sid] || {}; state.self[sid][i] = cb.checked; save(); }); });
  };

  /* ---------- thème ---------- */
  $("#theme-btn").addEventListener("click", function () {
    var r = document.documentElement, cur = r.getAttribute("data-theme");
    var dark = cur ? cur === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    r.setAttribute("data-theme", dark ? "light" : "dark");
  });

  buildNav();
  window.addEventListener("hashchange", route);
  route();
  refreshProgress();
})();
