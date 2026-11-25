/* JavaMini — interpréteur pédagogique d'un sous-ensemble de Java (cours L3, séances 1 à 8).
   Gère : types primitifs, String, Scanner (entrée fournie), if/switch, boucles, tableaux,
   méthodes statiques, classes, constructeurs, encapsulation, héritage, exceptions, ArrayList.
   Vérifie avant exécution les erreurs de compilation les plus fréquentes (messages de javac)
   et peut enregistrer une trace pas à pas (ligne, sortie, variables).
   Ce n'est pas un vrai compilateur : en cas de doute, utilise ton JDK. */
(function (root) {
  "use strict";
  function D(o) { var r = Object.create(null); for (var k in o) r[k] = o[k]; return r; }
  function E() { return Object.create(null); }

  /* ======================= Erreurs ======================= */
  function CErr(line, col, msg, fr) { this.line = line; this.col = col; this.msg = msg; this.fr = fr; this.kind = "compile"; }
  function Unsup(line, fr) { this.line = line; this.fr = fr; this.kind = "unsupported"; }
  function JThrow(exc) { this.exc = exc; }
  function BreakSig(label) { this.label = label; }
  function ContSig(label) { this.label = label; }
  function RetSig(v) { this.v = v; }
  function ExitSig(code) { this.code = code; }
  function StopSig(fr) { this.fr = fr; }
  function YieldSig(v) { this.v = v; }

  /* ======================= Lexer ======================= */
  var OPS = [">>>=", "<<=", ">>=", ">>>", "...", "->", "::", "++", "--", "&&", "||", "==", "!=", "<=", ">=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "<<", ">>",
    "{", "}", "(", ")", "[", "]", ";", ",", ".", "=", "<", ">", "!", "~", "?", ":", "+", "-", "*", "/", "%", "&", "|", "^", "@"];
  function lex(src, softErrs) {
    var toks = [], i = 0, line = 1, col = 1, n = src.length;
    function adv(k) { for (var j = 0; j < k; j++) { if (src[i] === "\n") { line++; col = 1; } else col++; i++; } }
    while (i < n) {
      var c = src[i];
      if (c === " " || c === "\t" || c === "\r" || c === "\n" || c === "\f") { adv(1); continue; }
      if (c === "/" && src[i + 1] === "/") { while (i < n && src[i] !== "\n") adv(1); continue; }
      if (c === "/" && src[i + 1] === "*") {
        var sl = line, sc = col; adv(2);
        while (i < n && !(src[i] === "*" && src[i + 1] === "/")) adv(1);
        if (i >= n) throw new CErr(sl, sc, "unclosed comment", "Un commentaire /* … n'a jamais été fermé par */.");
        adv(2); continue;
      }
      var L = line, C = col;
      if (c === '"' && src.substr(i, 3) === '"""') throw new Unsup(L, "Les blocs de texte \"\"\" ne sont pas gérés par le simulateur.");
      if (c === '"' || c === "'") {
        var q = c, val = ""; adv(1);
        for (;;) {
          if (i >= n || src[i] === "\n") {
            if (q === '"' && softErrs) { softErrs.push(new CErr(L, C, "unclosed string literal", "Le texte commence par \" mais le guillemet fermant manque sur cette ligne.")); break; }
            if (q === '"') throw new CErr(L, C, "unclosed string literal", "Le texte commence par \" mais le guillemet fermant manque sur cette ligne.");
            throw new CErr(L, C, "unclosed character literal", "Le caractère commence par ' mais l'apostrophe fermante manque.");
          }
          var d = src[i];
          if (d === q) { adv(1); break; }
          if (d === "\\") {
            var e = src[i + 1], map = { n: "\n", t: "\t", '"': '"', "'": "'", "\\": "\\", r: "\r", b: "\b", f: "\f", s: " ", "0": "\0" };
            if (!(e in map)) throw new CErr(line, col, "illegal escape character", "Après \\ seuls \\n, \\t, \\\", \\' et \\\\ sont autorisés.");
            val += map[e]; adv(2); continue;
          }
          val += d; adv(1);
        }
        if (q === "'") {
          if (val.length !== 1) throw new CErr(L, C, val.length ? "unclosed character literal" : "empty character literal",
            "Entre apostrophes ' ' on met UN seul caractère. Pour un texte, utilise des guillemets \" \".");
          toks.push({ k: "char", v: val, line: L, col: C, len: 3 });
        } else toks.push({ k: "str", v: val, line: L, col: C, len: val.length + 2 });
        continue;
      }
      if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1] || ""))) {
        var s = "", isD = false, isL = false;
        while (i < n && /[0-9_]/.test(src[i])) { s += src[i]; adv(1); }
        if (src[i] === "." && /[0-9]/.test(src[i + 1] || "")) { isD = true; s += "."; adv(1); while (i < n && /[0-9_]/.test(src[i])) { s += src[i]; adv(1); } }
        else if (src[i] === "." && !/[A-Za-z_]/.test(src[i + 1] || "")) { isD = true; adv(1); }
        if (/[eE]/.test(src[i] || "")) { isD = true; s += "e"; adv(1); if (/[+-]/.test(src[i])) { s += src[i]; adv(1); } while (i < n && /[0-9]/.test(src[i])) { s += src[i]; adv(1); } }
        if (/[dDfF]/.test(src[i] || "")) { isD = true; adv(1); }
        else if (/[lL]/.test(src[i] || "")) { isL = true; adv(1); }
        var num = parseFloat(s.replace(/_/g, ""));
        if (!isD && !isL && num > 2147483647) throw new CErr(L, C, "integer number too large", "Ce nombre dépasse la capacité d'un int (2 147 483 647). Ajoute L pour un long, ou utilise un double.");
        toks.push({ k: "num", v: num, t: isD ? "double" : isL ? "long" : "int", line: L, col: C, len: i - 0 });
        continue;
      }
      if (/[A-Za-z_$À-ɏ]/.test(c)) {
        var id = "";
        while (i < n && /[A-Za-z0-9_$À-ɏ]/.test(src[i])) { id += src[i]; adv(1); }
        toks.push({ k: "id", v: id, line: L, col: C, len: id.length });
        continue;
      }
      var op = null;
      for (var oi = 0; oi < OPS.length; oi++) if (src.substr(i, OPS[oi].length) === OPS[oi]) { op = OPS[oi]; break; }
      if (op) { toks.push({ k: "op", v: op, line: L, col: C, len: op.length }); adv(op.length); continue; }
      if ("“”«»‘’".indexOf(c) >= 0) throw new CErr(L, C, "illegal character: '\\u" + c.charCodeAt(0).toString(16).padStart(4, "0") + "'",
        "Ce guillemet typographique vient sans doute d'un copier-coller depuis un traitement de texte. Remplace-le par un guillemet droit \".");
      throw new CErr(L, C, "illegal character: '" + c + "'", "Ce caractère n'a pas de sens en Java à cet endroit.");
    }
    toks.push({ k: "eof", v: "<EOF>", line: line, col: col, len: 0 });
    return toks;
  }

  /* ======================= Parser ======================= */
  var PRIMS = D({ "int": 1, "double": 1, "boolean": 1, "char": 1, "long": 1, "float": 1, "short": 1, "byte": 1, "void": 1 });
  var MODS = D({ "public": 1, "private": 1, "protected": 1, "static": 1, "final": 1, "abstract": 1 });
  var KEYWORDS = D({ "if": 1, "else": 1, "for": 1, "while": 1, "do": 1, "switch": 1, "case": 1, "default": 1, "break": 1, "continue": 1, "return": 1, "new": 1, "class": 1, "this": 1, "super": 1, "try": 1, "catch": 1, "finally": 1, "throw": 1, "throws": 1, "null": 1, "true": 1, "false": 1, "import": 1, "package": 1, "extends": 1, "implements": 1, "interface": 1, "enum": 1, "instanceof": 1 });

  function Parser(toks, lines) { this.t = toks; this.p = 0; this.lines = lines; this.imports = []; }
  var PP = Parser.prototype;
  PP.peek = function (k) { return this.t[Math.min(this.p + (k || 0), this.t.length - 1)]; };
  PP.next = function () { return this.t[this.p++]; };
  PP.is = function (v, k) { var t = this.peek(k); return (t.k === "op" || t.k === "id") && t.v === v; };
  PP.isId = function (k) { var t = this.peek(k); return t.k === "id" && !KEYWORDS[t.v]; };
  PP.prev = function () { return this.t[this.p - 1] || this.t[0]; };
  PP.err = function (tok, msg, fr) {
    if (tok.k === "eof") { var lt = this.t[this.t.length - 2] || tok; tok = { line: lt.line, col: lt.col + (lt.len || 1) }; }
    return new CErr(tok.line, tok.col, msg, fr);
  };
  PP.expect = function (v, fr) {
    if (this.is(v)) return this.next();
    if (this.peek().k === "eof") throw this.err(this.peek(), "reached end of file while parsing", "Le fichier se termine trop tôt : il manque au moins une accolade fermante }. Compte tes { et tes }.");
    if (v === ";" || v === ")" ) {
      var pt = this.prev();
      var e = new CErr(pt.line, pt.col + (pt.len || 1), "'" + v + "' expected", fr || (v === ";" ? "Chaque instruction se termine par un point-virgule ;." : "Une parenthèse ouverte ( n'a pas été refermée."));
      throw e;
    }
    throw this.err(this.peek(), "'" + v + "' expected", fr || ("Java attendait « " + v + " » à cet endroit."));
  };
  PP.ident = function (fr) {
    var t = this.peek();
    if (t.k !== "id" || KEYWORDS[t.v]) throw this.err(t, "<identifier> expected", fr || "Java attendait un nom (identifiant) à cet endroit.");
    return this.next();
  };
  PP.node = function (o, tok) { o.line = tok.line; o.col = tok.col; return o; };

  // ---- types ----
  PP.tryType = function () {
    var save = this.p, t = this.peek();
    if (t.k !== "id" || (KEYWORDS[t.v] && !PRIMS[t.v])) return null;
    if (KEYWORDS[t.v]) return null;
    this.next();
    var name = t.v;
    // nom qualifié java.util.Scanner
    while (this.is(".") && this.peek(1).k === "id" && /^[a-z]/.test(name.split(".").pop()) && !PRIMS[name]) { this.next(); name += "." + this.next().v; }
    name = name.replace(/^java\.(util|lang|io)\./, "");
    if (this.is("<")) {
      this.next();
      var args = [];
      if (this.is(">")) { this.next(); name += "<>"; }
      else {
        for (;;) {
          var a = this.tryType();
          if (!a) { this.p = save; return null; }
          args.push(a);
          if (this.is(",")) { this.next(); continue; }
          if (this.is(">")) { this.next(); break; }
          if (this.is(">>")) { this.t[this.p] = { k: "op", v: ">", line: this.peek().line, col: this.peek().col + 1, len: 1 }; break; }
          this.p = save; return null;
        }
        name += "<" + args.join(",") + ">";
      }
    }
    while (this.is("[") && this.is("]", 1)) { this.next(); this.next(); name += "[]"; }
    return name;
  };
  PP.type = function () {
    var t = this.tryType();
    if (!t) throw this.err(this.peek(), "<identifier> expected", "Java attendait un type (int, double, String, un nom de classe…).");
    return t;
  };

  // ---- unité de compilation ----
  PP.unit = function () {
    var classes = [];
    while (this.is("import") || this.is("package")) {
      var kw = this.next();
      var parts = [];
      while (!this.is(";")) { if (this.peek().k === "eof") break; parts.push(this.next().v); }
      this.expect(";");
      var path = parts.join("");
      if (kw.v === "import") this.imports.push(path);
    }
    while (this.peek().k !== "eof") {
      if (this.is(";")) { this.next(); continue; }
      classes.push(this.classDecl());
    }
    return classes;
  };
  PP.mods = function () { var m = {}; while (this.peek().k === "id" && MODS[this.peek().v]) m[this.next().v] = true; if (this.is("@")) { this.next(); this.ident(); return Object.assign(m, this.mods()); } return m; };
  PP.classDecl = function () {
    var start = this.peek();
    var m = this.mods();
    if (this.is("interface") || this.is("enum") || this.is("record")) throw new Unsup(this.peek().line, "Les " + this.peek().v + " ne sont pas au programme de ce cours et ne sont pas gérés par le simulateur.");
    if (this.peek().k === "id" && this.peek().v === "Class") throw this.err(this.peek(), "class, interface, enum, or record expected", "Java est sensible à la casse : le mot-clé s'écrit class en minuscules.");
    if (!this.is("class")) {
      if (this.is("}")) throw this.err(this.peek(), "class, interface, enum, or record expected", "Il y a une accolade fermante } de trop : la classe est déjà fermée.");
      throw this.err(this.peek(), "class, interface, enum, or record expected", "Le code doit se trouver dans une classe. Vérifie que rien n'est écrit en dehors des accolades de la classe.");
    }
    this.next();
    var nameTok = this.ident("Après le mot class, il faut le nom de la classe.");
    var cls = { kind: "class", name: nameTok.v, mods: m, sup: null, fields: [], methods: [], ctors: [], line: start.line, nameTok: nameTok };
    if (this.is("<")) throw new Unsup(this.peek().line, "Les classes génériques ne sont pas gérées par le simulateur.");
    if (this.is("extends")) { this.next(); cls.sup = this.type(); cls.supTok = this.prev(); }
    if (this.is("implements")) throw new Unsup(this.peek().line, "Les interfaces (implements) ne sont pas gérées par le simulateur.");
    this.expect("{", "Après le nom de la classe, il faut ouvrir son bloc avec {.");
    while (!this.is("}")) {
      if (this.peek().k === "eof") throw this.err(this.peek(), "reached end of file while parsing", "Le fichier se termine avant la fin de la classe : il manque une accolade fermante }.");
      this.member(cls);
    }
    this.next();
    return cls;
  };
  PP.member = function (cls) {
    if (this.is(";")) { this.next(); return; }
    var start = this.peek();
    if (this.is("{") || (this.is("static") && this.is("{", 1))) throw new Unsup(start.line, "Les blocs d'initialisation ne sont pas gérés par le simulateur.");
    if (this.is("class")) throw new Unsup(start.line, "Les classes internes ne sont pas gérées : écris chaque classe à la suite, au même niveau.");
    var m = this.mods();
    if (this.is("class") || this.is("interface") || this.is("enum")) throw new Unsup(start.line, "Les classes internes ne sont pas gérées : écris chaque classe à la suite, au même niveau.");
    // constructeur : Nom (
    if (this.peek().k === "id" && this.peek().v === cls.name && this.is("(", 1)) {
      var nt = this.next();
      var params = this.params();
      var thr = this.throwsClause();
      var body = this.block();
      cls.ctors.push({ kind: "ctor", name: cls.name, mods: m, params: params, body: body, line: nt.line, cls: cls.name, throws: thr });
      return;
    }
    if (this.peek().k === "id" && this.is("(", 1) && !PRIMS[this.peek().v]) {
      var bad = this.peek();
      throw this.err(bad, "invalid method declaration; return type required",
        "Il manque le type de retour avant le nom de la méthode (void, int, String…). Si c'est un constructeur, son nom doit être exactement celui de la classe : " + cls.name + ".");
    }
    var ty = this.tryType();
    if (!ty) {
      var tk = this.peek();
      if (tk.k === "id" && (tk.v === "System" || tk.v === "if" || tk.v === "for" || tk.v === "while" || tk.v === "return")) throw this.err(tk, "<identifier> expected", "Une instruction se trouve directement dans la classe, hors de toute méthode. Place-la à l'intérieur d'une méthode, par exemple main.");
      throw this.err(tk, "<identifier> expected", "Ici Java attendait la déclaration d'un attribut ou d'une méthode.");
    }
    var nameTok = this.peek();
    if (nameTok.k !== "id" || KEYWORDS[nameTok.v]) {
      throw this.err(nameTok, "<identifier> expected", "Une instruction se trouve directement dans la classe, hors de toute méthode. Place-la à l'intérieur d'une méthode, par exemple main.");
    }
    this.next();
    if (this.is("(")) {
      var ps = this.params();
      while (this.is("[") && this.is("]", 1)) { this.next(); this.next(); ty += "[]"; }
      var thr2 = this.throwsClause();
      var mb = null;
      if (this.is(";")) { this.next(); if (!m.abstract) throw this.err(nameTok, "missing method body, or declare abstract", "Une méthode doit avoir un corps entre accolades { }."); }
      else mb = this.block();
      cls.methods.push({ kind: "method", name: nameTok.v, ret: ty, mods: m, params: ps, body: mb, line: nameTok.line, col: nameTok.col, cls: cls.name, throws: thr2 });
      return;
    }
    // attribut(s)
    var declTok = nameTok;
    for (;;) {
      var fty = ty;
      while (this.is("[") && this.is("]", 1)) { this.next(); this.next(); fty += "[]"; }
      var init = null;
      if (this.is("=")) { this.next(); init = this.is("{") ? this.arrayInit(fty) : this.expr(); }
      cls.fields.push({ name: declTok.v, type: fty, mods: m, init: init, line: declTok.line, col: declTok.col, cls: cls.name });
      if (this.is(",")) { this.next(); declTok = this.ident(); continue; }
      break;
    }
    this.expect(";");
  };
  PP.throwsClause = function () { var l = []; if (this.is("throws")) { this.next(); l.push(this.type()); while (this.is(",")) { this.next(); l.push(this.type()); } } return l; };
  PP.params = function () {
    this.expect("(");
    var ps = [];
    if (!this.is(")")) {
      for (;;) {
        if (this.is("final")) this.next();
        var ty = this.tryType();
        if (!ty) throw this.err(this.peek(), "<identifier> expected", "Chaque paramètre s'écrit « type nom », par exemple : int quantite.");
        if (this.is("...")) { this.next(); ty += "[]"; }
        var nm = this.peek();
        if (nm.k !== "id" || KEYWORDS[nm.v]) throw this.err(nm, "<identifier> expected", "Chaque paramètre s'écrit « type nom », par exemple : int quantite. Il manque le type ou le nom.");
        this.next();
        while (this.is("[") && this.is("]", 1)) { this.next(); this.next(); ty += "[]"; }
        ps.push({ type: ty, name: nm.v, line: nm.line });
        if (this.is(",")) { this.next(); continue; }
        break;
      }
    }
    this.expect(")");
    return ps;
  };
  PP.block = function () {
    var open = this.expect("{", "Il faut ouvrir le bloc avec {.");
    var body = [];
    while (!this.is("}")) {
      if (this.peek().k === "eof") throw this.err(this.peek(), "reached end of file while parsing", "Le fichier se termine trop tôt : il manque une accolade fermante } (bloc, méthode ou classe).");
      body.push(this.stmt());
    }
    this.next();
    return this.node({ k: "block", body: body }, open);
  };

  // ---- instructions ----
  PP.looksLikeDecl = function () {
    var save = this.p;
    if (this.is("final")) this.next();
    var ty = this.tryType();
    var ok = !!ty && this.isId() && (this.is("=", 1) || this.is(";", 1) || this.is(",", 1) || this.is(":", 1) || this.is("[", 1));
    this.p = save;
    return ok;
  };
  PP.localDecl = function (needSemi) {
    var first = this.peek();
    var fin = false;
    if (this.is("final")) { this.next(); fin = true; }
    var ty = this.type();
    var decls = [];
    for (;;) {
      var nt = this.ident();
      var dty = ty;
      while (this.is("[") && this.is("]", 1)) { this.next(); this.next(); dty += "[]"; }
      var init = null;
      if (this.is("=")) { this.next(); init = this.is("{") ? this.arrayInit(dty) : this.expr(); }
      decls.push({ name: nt.v, type: dty, init: init, line: nt.line, col: nt.col });
      if (this.is(",")) { this.next(); continue; }
      break;
    }
    if (needSemi !== false) this.expect(";");
    return this.node({ k: "local", decls: decls, fin: fin }, first);
  };
  PP.arrayInit = function (ty) {
    var open = this.expect("{");
    var els = [];
    var et = ty.slice(-2) === "[]" ? ty.slice(0, -2) : null;
    while (!this.is("}")) {
      els.push(this.is("{") ? this.arrayInit(et || "?") : this.expr());
      if (this.is(",")) { this.next(); continue; }
      break;
    }
    this.expect("}", "La liste de valeurs du tableau doit se fermer par }.");
    return this.node({ k: "arrinit", type: ty, els: els }, open);
  };
  PP.stmt = function () {
    var t = this.peek();
    if (t.k === "op") {
      if (t.v === "{") return this.block();
      if (t.v === ";") { this.next(); return this.node({ k: "empty" }, t); }
    }
    if (t.k === "id") {
      switch (t.v) {
        case "if": {
          this.next(); this.expect("(", "Après if, la condition doit être entre parenthèses : if (condition)");
          var c = this.expr(); this.expect(")");
          if (this.is(";")) { /* if (...); piège classique : instruction vide */ }
          var th = this.stmt(), el = null;
          if (this.is("else")) { this.next(); el = this.stmt(); }
          return this.node({ k: "if", cond: c, then: th, els: el }, t);
        }
        case "else": throw this.err(t, "'else' without 'if'", "Ce else n'est rattaché à aucun if. Vérifie les accolades et qu'il n'y a pas de ; juste après le if (…).");
        case "while": {
          this.next(); this.expect("("); var wc = this.expr(); this.expect(")");
          return this.node({ k: "while", cond: wc, body: this.stmt() }, t);
        }
        case "do": {
          this.next(); var db = this.stmt();
          if (!this.is("while")) throw this.err(this.peek(), "'while' expected", "Une boucle do { … } doit se terminer par while (condition);");
          this.next(); this.expect("("); var dc = this.expr(); this.expect(")"); this.expect(";");
          return this.node({ k: "do", cond: dc, body: db }, t);
        }
        case "for": {
          this.next(); this.expect("(");
          // for-each ?
          var save = this.p;
          if (this.is("final")) this.next();
          var ety = this.tryType();
          if (ety && this.isId() && this.is(":", 1)) {
            var vn = this.next(); this.next();
            var it = this.expr(); this.expect(")");
            return this.node({ k: "foreach", type: ety, name: vn.v, vline: vn.line, iter: it, body: this.stmt() }, t);
          }
          this.p = save;
          var init = [];
          if (!this.is(";")) {
            if (this.looksLikeDecl()) init.push(this.localDecl(false));
            else { init.push(this.node({ k: "expr", e: this.expr() }, this.peek())); while (this.is(",")) { this.next(); init.push(this.node({ k: "expr", e: this.expr() }, this.peek())); } }
          }
          this.expect(";", "Dans for ( ; ; ), les trois parties sont séparées par des points-virgules.");
          var fc = this.is(";") ? null : this.expr();
          this.expect(";", "Dans for ( ; ; ), les trois parties sont séparées par des points-virgules.");
          var upd = [];
          if (!this.is(")")) { upd.push(this.expr()); while (this.is(",")) { this.next(); upd.push(this.expr()); } }
          this.expect(")");
          return this.node({ k: "for", init: init, cond: fc, upd: upd, body: this.stmt() }, t);
        }
        case "switch": return this.switchStmt();
        case "break": this.next(); if (this.isId()) throw new Unsup(t.line, "Les étiquettes de boucle (break étiquette) ne sont pas gérées."); this.expect(";"); return this.node({ k: "break" }, t);
        case "continue": this.next(); this.expect(";"); return this.node({ k: "continue" }, t);
        case "return": { this.next(); var re = this.is(";") ? null : this.expr(); this.expect(";"); return this.node({ k: "return", e: re }, t); }
        case "throw": { this.next(); var te = this.expr(); this.expect(";"); return this.node({ k: "throw", e: te }, t); }
        case "yield": { if (this.isId(1) || this.peek(1).k !== "op" || this.is("(", 1) || this.is("-", 1)) { this.next(); var ye = this.expr(); this.expect(";"); return this.node({ k: "yield", e: ye }, t); } break; }
        case "try": return this.tryStmt();
        case "class": throw new Unsup(t.line, "Les classes locales ne sont pas gérées.");
        case "case": case "default": throw this.err(t, "orphaned " + t.v, "« " + t.v + " » doit se trouver dans un switch.");
      }
      if (this.looksLikeDecl()) return this.localDecl();
      if (t.v === "var" && this.isId(1) && this.is("=", 2)) {
        this.next(); var vt = this.next(); this.next();
        var vi = this.expr(); this.expect(";");
        return this.node({ k: "local", decls: [{ name: vt.v, type: "var", init: vi, line: vt.line, col: vt.col }] }, t);
      }
    }
    var e = this.expr();
    if (!(e.k === "assign" || e.k === "call" || e.k === "new" || e.k === "incdec" || e.k === "ctorcall")) {
      if (this.is(";")) throw new CErr(e.line, e.col, "not a statement", "Cette ligne calcule une valeur mais n'en fait rien. Il faut l'afficher, l'affecter à une variable (x = …) ou l'utiliser dans une instruction.");
    }
    if (!this.is(";")) {
      var pt = this.prev(); var nx = this.peek();
      if (nx.k !== "eof" && nx.line === pt.line && !(nx.k === "op" && (nx.v === "}" ))) {
        throw new CErr(pt.line, pt.col + (pt.len || 1), "';' expected", "Java attendait un point-virgule ici. Vérifie aussi qu'il ne manque pas un opérateur (+, ,) entre deux éléments.");
      }
    }
    this.expect(";");
    return this.node({ k: "expr", e: e }, t);
  };
  PP.switchStmt = function () {
    var t = this.next();
    this.expect("("); var sel = this.expr(); this.expect(")");
    this.expect("{");
    var cases = [], arrow = null;
    while (!this.is("}")) {
      var ct = this.peek();
      var labels = [], isDef = false;
      if (this.is("case")) {
        this.next();
        labels.push(this.ternary()); while (this.is(",")) { this.next(); labels.push(this.ternary()); }
      } else if (this.is("default")) { this.next(); isDef = true; }
      else throw this.err(ct, "case, default, or '}' expected", "Dans un switch, chaque bloc commence par case valeur: ou default:.");
      if (this.is("->")) {
        if (arrow === false) throw this.err(this.peek(), "different case kinds used in the switch", "Ne mélange pas case …: et case … -> dans le même switch.");
        arrow = true; this.next();
        var body;
        if (this.is("{")) body = [this.block()];
        else if (this.is("throw")) body = [this.stmt()];
        else { var ex = this.expr(); this.expect(";"); body = [this.node({ k: "expr", e: ex }, ct)]; }
        cases.push({ labels: labels, def: isDef, body: body, line: ct.line });
      } else {
        if (arrow === true) throw this.err(this.peek(), "different case kinds used in the switch", "Ne mélange pas case …: et case … -> dans le même switch.");
        arrow = false;
        if (!this.is(":")) throw this.err(this.peek(), "':' or '->' expected", "Après case valeur, il faut deux-points : case 1:");
        this.next();
        var stmts = [];
        while (!this.is("case") && !this.is("default") && !this.is("}")) {
          if (this.peek().k === "eof") throw this.err(this.peek(), "reached end of file while parsing", "Le switch n'est pas fermé par }.");
          stmts.push(this.stmt());
        }
        cases.push({ labels: labels, def: isDef, body: stmts, line: ct.line });
      }
    }
    this.next();
    return this.node({ k: "switch", sel: sel, cases: cases, arrow: !!arrow }, t);
  };
  PP.switchExpr = function () {
    var t = this.next();
    this.expect("("); var sel = this.expr(); this.expect(")");
    this.expect("{");
    var cases = [];
    while (!this.is("}")) {
      var ct = this.peek(), labels = [], isDef = false;
      if (this.is("case")) { this.next(); labels.push(this.ternary()); while (this.is(",")) { this.next(); labels.push(this.ternary()); } }
      else if (this.is("default")) { this.next(); isDef = true; }
      else throw this.err(ct, "case, default, or '}' expected", "Dans un switch, chaque ligne commence par case valeur -> ou default ->.");
      if (!this.is("->")) throw new Unsup(ct.line, "Dans une expression switch, le simulateur gère la forme avec flèche : case valeur -> résultat;");
      this.next();
      var arm;
      if (this.is("{")) arm = { block: this.block() };
      else if (this.is("throw")) arm = { block: { k: "block", body: [this.stmt()], line: ct.line } };
      else { arm = { e: this.expr() }; this.expect(";"); }
      arm.labels = labels; arm.def = isDef; arm.line = ct.line;
      cases.push(arm);
    }
    this.next();
    return this.node({ k: "switchx", sel: sel, cases: cases }, t);
  };
  PP.tryStmt = function () {
    var t = this.next();
    var res = [];
    if (this.is("(")) {
      this.next();
      while (!this.is(")")) { res.push(this.localDecl(false)); if (this.is(";")) this.next(); }
      this.next();
    }
    var body = this.block(), catches = [], fin = null;
    while (this.is("catch")) {
      var ct = this.next(); this.expect("(");
      if (this.is("final")) this.next();
      var types = [this.type()];
      while (this.is("|")) { this.next(); types.push(this.type()); }
      var nm = this.ident(); this.expect(")");
      catches.push({ types: types, name: nm.v, body: this.block(), line: ct.line });
    }
    if (this.is("finally")) { this.next(); fin = this.block(); }
    if (!catches.length && !fin && !res.length) throw this.err(this.peek(), "'catch' or 'finally' expected", "Un bloc try doit être suivi d'au moins un catch (ou d'un finally).");
    return this.node({ k: "try", res: res, body: body, catches: catches, fin: fin }, t);
  };

  // ---- expressions ----
  PP.expr = function () { return this.assign(); };
  PP.assign = function () {
    var lhs = this.ternary();
    var t = this.peek();
    if (t.k === "op" && /^(=|\+=|-=|\*=|\/=|%=)$/.test(t.v)) {
      if (!(lhs.k === "name" || lhs.k === "field" || lhs.k === "index")) throw new CErr(t.line, t.col, "unexpected type\n  required: variable\n  found:    value", "À gauche de « " + t.v + " », il faut une variable. Pour comparer deux valeurs, utilise == (et non =).");
      this.next();
      var rhs = this.assign();
      return this.node({ k: "assign", op: t.v, target: lhs, value: rhs }, t);
    }
    if (t.k === "op" && /^(&=|\|=|\^=|<<=|>>=|>>>=)$/.test(t.v)) throw new Unsup(t.line, "Les opérateurs binaires bit à bit ne sont pas gérés par le simulateur.");
    return lhs;
  };
  PP.ternary = function () {
    var c = this.binary(0);
    if (this.is("?")) { var q = this.next(); var a = this.ternary(); this.expect(":", "Un opérateur ternaire s'écrit condition ? valeurSiVrai : valeurSiFaux"); var b = this.ternary(); return this.node({ k: "cond", c: c, a: a, b: b }, q); }
    return c;
  };
  var PREC = [["||"], ["&&"], ["|"], ["^"], ["&"], ["==", "!="], ["<", ">", "<=", ">=", "instanceof"], ["+", "-"], ["*", "/", "%"]];
  PP.binary = function (lvl) {
    if (lvl >= PREC.length) return this.unary();
    var left = this.binary(lvl + 1);
    for (;;) {
      var t = this.peek();
      if (!((t.k === "op" || (t.k === "id" && t.v === "instanceof")) && PREC[lvl].indexOf(t.v) >= 0)) break;
      if (t.v === "|" || t.v === "^" || t.v === "&") throw new Unsup(t.line, "L'opérateur « " + t.v + " » n'est pas géré ; pour les conditions, utilise " + (t.v === "&" ? "&&" : "||") + ".");
      this.next();
      if (t.v === "instanceof") { var ty = this.type(); left = this.node({ k: "instanceof", e: left, type: ty }, t); continue; }
      var right = this.binary(lvl + 1);
      left = this.node({ k: "bin", op: t.v, a: left, b: right }, t);
    }
    return left;
  };
  PP.unary = function () {
    var t = this.peek();
    if (t.k === "op") {
      if (t.v === "!" || t.v === "-" || t.v === "+") { this.next(); return this.node({ k: "un", op: t.v, e: this.unary() }, t); }
      if (t.v === "++" || t.v === "--") { this.next(); var tg = this.unary(); return this.node({ k: "incdec", op: t.v, pre: true, target: tg }, t); }
      if (t.v === "~") throw new Unsup(t.line, "L'opérateur ~ n'est pas géré.");
      if (t.v === "(") {
        // cast ?
        var save = this.p; this.next();
        var ty = this.tryType();
        if (ty && this.is(")")) {
          var after = this.peek(1);
          var isPrim = PRIMS[ty.replace(/\[\]/g, "")];
          var canStart = after.k === "id" || after.k === "num" || after.k === "str" || after.k === "char" || (after.k === "op" && (after.v === "(" || (isPrim && (after.v === "-" || after.v === "+" || after.v === "!"))));
          if ((isPrim || /^[A-Z]/.test(ty)) && canStart && !(after.k === "id" && after.v === "instanceof")) {
            this.next();
            return this.node({ k: "cast", type: ty, e: this.unary() }, t);
          }
        }
        this.p = save;
      }
    }
    return this.postfix(this.primary());
  };
  PP.args = function () {
    this.expect("(");
    var a = [];
    if (!this.is(")")) {
      a.push(this.expr());
      while (this.is(",")) { this.next(); a.push(this.expr()); }
    }
    if (!this.is(")")) {
      if (this.peek().k === "eof") this.expect(")");
      var pt = this.prev();
      throw new CErr(pt.line, pt.col + (pt.len || 1), "')' or ',' expected", "Il manque la parenthèse fermante ) ou une virgule entre deux arguments.");
    }
    this.next();
    return a;
  };
  PP.postfix = function (e) {
    for (;;) {
      var t = this.peek();
      if (this.is(".")) {
        this.next();
        var nt = this.peek();
        if (nt.k !== "id") throw this.err(nt, "<identifier> expected", "Après un point, il faut un nom de méthode ou d'attribut.");
        this.next();
        if (this.is("(")) { e = this.node({ k: "call", obj: e, name: nt.v, args: this.args(), nameTok: nt }, nt); }
        else e = this.node({ k: "field", obj: e, name: nt.v, nameTok: nt }, nt);
        continue;
      }
      if (this.is("[")) { this.next(); var ix = this.expr(); this.expect("]", "Il manque le crochet fermant ]."); e = this.node({ k: "index", arr: e, idx: ix }, t); continue; }
      if (this.is("++") || this.is("--")) { this.next(); e = this.node({ k: "incdec", op: t.v, pre: false, target: e }, t); continue; }
      if (this.is("::")) throw new Unsup(t.line, "Les références de méthode (::) ne sont pas gérées.");
      return e;
    }
  };
  PP.primary = function () {
    var t = this.peek();
    if (t.k === "num") { this.next(); return this.node({ k: "lit", t: t.t, v: t.v }, t); }
    if (t.k === "str") { this.next(); return this.node({ k: "lit", t: "String", v: t.v }, t); }
    if (t.k === "char") { this.next(); return this.node({ k: "lit", t: "char", v: t.v.charCodeAt(0) }, t); }
    if (t.k === "op" && t.v === "(") {
      this.next();
      if (this.is(")") && this.is("->", 1)) throw new Unsup(t.line, "Les lambdas ne sont pas gérées par le simulateur.");
      var e = this.expr(); this.expect(")"); return this.node({ k: "paren", e: e }, t);
    }
    if (t.k === "id") {
      if (t.v === "true" || t.v === "false") { this.next(); return this.node({ k: "lit", t: "boolean", v: t.v === "true" }, t); }
      if (t.v === "null") { this.next(); return this.node({ k: "lit", t: "null", v: null }, t); }
      if (t.v === "this") { this.next(); if (this.is("(")) return this.node({ k: "ctorcall", which: "this", args: this.args() }, t); return this.node({ k: "this" }, t); }
      if (t.v === "super") {
        this.next();
        if (this.is("(")) return this.node({ k: "ctorcall", which: "super", args: this.args() }, t);
        this.expect(".");
        var sn = this.ident();
        if (this.is("(")) return this.node({ k: "call", obj: this.node({ k: "super" }, t), name: sn.v, args: this.args(), nameTok: sn }, sn);
        return this.node({ k: "field", obj: this.node({ k: "this" }, t), name: sn.v, nameTok: sn }, sn);
      }
      if (t.v === "new") {
        this.next();
        var tt = this.peek();
        var base = tt.v;
        if (tt.k !== "id") throw this.err(tt, "<identifier> expected", "Après new, il faut un nom de classe ou un type de tableau.");
        this.next();
        while (this.is(".") && /^[a-z]/.test(base.split(".").pop())) { this.next(); base += "." + this.next().v; }
        base = base.replace(/^java\.(util|lang|io)\./, "");
        if (this.is("<")) {
          this.next(); var gs = "";
          if (this.is(">")) { this.next(); base += "<>"; }
          else { var g = [this.type()]; while (this.is(",")) { this.next(); g.push(this.type()); } this.expect(">"); base += "<" + g.join(",") + ">"; }
        }
        if (this.is("[")) {
          var dims = [], extra = 0;
          while (this.is("[")) {
            this.next();
            if (this.is("]")) { this.next(); extra++; continue; }
            dims.push(this.expr()); this.expect("]");
          }
          var aty = base + new Array(dims.length + extra + 1).join("[]");
          if (!dims.length) {
            if (!this.is("{")) throw this.err(this.peek(), "array dimension missing", "Pour créer un tableau, indique sa taille : new int[5], ou ses valeurs : new int[]{1, 2, 3}.");
            return this.arrayInit(aty);
          }
          return this.node({ k: "newarr", type: aty, base: base, dims: dims }, t);
        }
        if (!this.is("(")) throw this.err(this.peek(), "'(' or '[' expected", "Après new " + base + ", il faut des parenthèses : new " + base + "(…)");
        var a = this.args();
        if (this.is("{")) throw new Unsup(t.line, "Les classes anonymes ne sont pas gérées.");
        return this.node({ k: "new", cls: base, args: a, tok: tt }, t);
      }
      if (t.v === "switch") return this.switchExpr();
      if (KEYWORDS[t.v] && t.v !== "this") throw this.err(t, "illegal start of expression", "Le mot-clé « " + t.v + " » ne peut pas se trouver ici. Vérifie les accolades et les points-virgules juste avant.");
      if (PRIMS[t.v] && this.is(".", 1) && this.is("class", 2)) throw new Unsup(t.line, "La syntaxe .class n'est pas gérée.");
      this.next();
      if (this.is("(")) return this.node({ k: "call", obj: null, name: t.v, args: this.args(), nameTok: t }, t);
      if (this.is("->")) throw new Unsup(t.line, "Les lambdas ne sont pas gérées par le simulateur.");
      return this.node({ k: "name", name: t.v }, t);
    }
    if (t.k === "eof") throw this.err(t, "reached end of file while parsing", "Le fichier se termine au milieu d'une instruction.");
    throw this.err(t, "illegal start of expression", "« " + t.v + " » ne peut pas commencer une expression ici. Vérifie ce qui précède (parenthèse, opérateur, point-virgule).");
  };

  /* ======================= Types ======================= */
  var NUMRANK = D({ "byte": 1, "short": 2, "char": 2, "int": 3, "long": 4, "float": 5, "double": 6 });
  var BOX = D({ "Integer": "int", "Double": "double", "Character": "char", "Boolean": "boolean", "Long": "long", "Float": "float", "Short": "short", "Byte": "byte" });
  var UNBOX = D({ "int": "Integer", "double": "Double", "char": "Character", "boolean": "Boolean", "long": "Long", "float": "Float" });
  function isNum(t) { return !!NUMRANK[unbox(t)]; }
  function unbox(t) { return BOX[t] || t; }
  function isPrim(t) { return !!PRIMS[t] && t !== "void"; }
  function isArr(t) { return /\[\]$/.test(t || ""); }
  function elemOf(t) { return t.slice(0, -2); }
  function listElem(t) { var m = /^(ArrayList|List)<(.+)>$/.exec(t || ""); return m ? m[2] : (/^(ArrayList|List)(<>)?$/.test(t || "") ? "Object" : null); }
  function isList(t) { return /^(ArrayList|List)(<.*>)?$/.test(t || ""); }
  function promote(a, b) { a = unbox(a); b = unbox(b); if (a === "double" || b === "double" || a === "float" || b === "float") return "double"; if (a === "long" || b === "long") return "long"; return "int"; }
  function isStr(t) { return t === "String"; }
  var EXC_PARENT = D({
    "Throwable": "Object", "Exception": "Throwable", "Error": "Throwable", "RuntimeException": "Exception", "IOException": "Exception", "FileNotFoundException": "IOException",
    "ArithmeticException": "RuntimeException", "IndexOutOfBoundsException": "RuntimeException", "ArrayIndexOutOfBoundsException": "IndexOutOfBoundsException",
    "StringIndexOutOfBoundsException": "IndexOutOfBoundsException", "NullPointerException": "RuntimeException", "IllegalArgumentException": "RuntimeException",
    "NumberFormatException": "IllegalArgumentException", "IllegalStateException": "RuntimeException", "NoSuchElementException": "RuntimeException",
    "InputMismatchException": "NoSuchElementException", "ClassCastException": "RuntimeException", "UnsupportedOperationException": "RuntimeException",
    "NegativeArraySizeException": "RuntimeException", "IllegalFormatConversionException": "IllegalArgumentException", "StackOverflowError": "Error"
  });
  var EXC_PKG = D({ "InputMismatchException": "java.util", "NoSuchElementException": "java.util", "IllegalFormatConversionException": "java.util", "IOException": "java.io", "FileNotFoundException": "java.io" });
  var CHECKED = D({ "Exception": 1, "IOException": 1, "FileNotFoundException": 1, "Throwable": 1 });

  /* ======================= Programme / vérification ======================= */
  function Program(src, fileName) {
    this.src = src; this.lines = src.split("\n"); this.file = fileName || "Main.java";
    this.classes = E(); this.order = [];
  }

  function compile(src, fileName) {
    var prog = new Program(src, fileName);
    var soft = [];
    var toks = lex(src, soft);
    var ps = new Parser(toks, prog.lines);
    var decls;
    try { decls = ps.unit(); }
    catch (pe) { if (soft.length && (!(pe instanceof CErr) || soft[0].line <= pe.line)) throw soft[0]; throw pe; }
    if (soft.length) throw soft[0];
    prog.imports = ps.imports;
    if (!decls.length) throw new CErr(1, 1, "class, interface, enum, or record expected", "Le fichier ne contient aucune classe.");
    var base = (fileName || "").replace(/\.java$/i, "");
    decls.forEach(function (c) {
      if (prog.classes[c.name]) throw new CErr(c.line, 1, "duplicate class: " + c.name, "Deux classes portent le même nom : " + c.name + ".");
      if (EXC_PARENT[c.name] || /^(String|Math|System|Scanner|ArrayList|Object|Integer|Double)$/.test(c.name)) throw new Unsup(c.line, "Le nom de classe « " + c.name + " » est déjà utilisé par Java : choisis un autre nom.");
      prog.classes[c.name] = c; prog.order.push(c.name);
      if (c.mods["public"] && base && c.name !== base) throw new CErr(c.nameTok.line, c.nameTok.col, "class " + c.name + " is public, should be declared in a file named " + c.name + ".java",
        "Le nom du fichier (" + fileName + ") doit être exactement celui de la classe publique : " + c.name + ".java (majuscules comprises).");
    });
    var ck = new Checker(prog);
    ck.run();
    if (ck.flowErr) throw ck.flowErr;
    return prog;
  }

  function Checker(prog) { this.prog = prog; }
  var CK = Checker.prototype;
  CK.err = function (node, msg, fr) { return new CErr(node.line, node.col || 1, msg, fr); };
  // erreurs « de flux » (javac les signale après les erreurs de types) : mémorisées, on continue
  CK.flow = function (e) { if (!this.flowErr) this.flowErr = e; };
  CK.classOf = function (n) { return this.prog.classes[n]; };
  var NEEDS_IMPORT = D({ Scanner: "java.util", ArrayList: "java.util", List: "java.util", Arrays: "java.util", InputMismatchException: "java.util", NoSuchElementException: "java.util", IOException: "java.io", FileNotFoundException: "java.io", ConcurrentModificationException: "java.util" });
  CK.imported = function (b) {
    var pk = NEEDS_IMPORT[b]; if (!pk) return true;
    return (this.prog.imports || []).some(function (i) { return i === pk + "." + b || i === pk + ".*"; });
  };
  CK.knownType = function (t, node) {
    var b = t.replace(/\[\]/g, "").replace(/<.*>$/, "");
    if (!this.imported(b) && !this.classOf(b)) throw this.err(node, "cannot find symbol\n  symbol:   class " + b + "\n  location: class " + (this.curCls || ""),
      "Java ne connaît pas " + b + " : il faut l'importer en tout début de fichier : import " + NEEDS_IMPORT[b] + "." + b + ";");
    if (PRIMS[b] || BOX[b] || b === "String" || b === "Object" || b === "Scanner" || b === "ArrayList" || b === "List" || b === "var" || EXC_PARENT[b] || this.classOf(b)) {
      var g = /<(.+)>$/.exec(t.replace(/\[\]/g, ""));
      if (g) { var self = this; g[1].split(",").forEach(function (x) { if (PRIMS[x]) throw self.err(node, "unexpected type\n  required: reference\n  found:    " + x, "Une ArrayList ne peut pas contenir de type primitif : écris ArrayList<" + (UNBOX[x] || x) + "> au lieu de ArrayList<" + x + ">."); self.knownType(x, node); }); }
      return true;
    }
    if (/^(File|FileWriter|FileReader|BufferedReader|BufferedWriter|PrintWriter|Files|Paths|Path|HashMap|Map|HashSet|Set|LinkedList|Random|LocalDate|StringBuilder)$/.test(b))
      throw new Unsup(node.line, "La classe " + b + " n'est pas simulée ici. Teste ce programme avec ton JDK.");
    var hint = "";
    if (b === "string") hint = " Attention à la casse : c'est String, avec un S majuscule.";
    else if (b === "Int" || b === "integer") hint = " Le type entier s'écrit int (en minuscules).";
    else if (b === "Boolean" || b === "Double") hint = "";
    else if (b === "scanner") hint = " C'est Scanner, avec un S majuscule.";
    else if (b === "Arraylist" || b === "arrayList") hint = " C'est ArrayList (A et L majuscules).";
    else hint = /^[A-Z]/.test(b) ? " Si c'est une classe de Java, vérifie l'import (ex. import java.util.Scanner;) ; si c'est ta classe, vérifie son nom." : "";
    throw this.err(node, "cannot find symbol\n  symbol:   class " + b, "Java ne connaît pas le type « " + b + " »." + hint);
  };
  CK.isSub = function (a, b) {
    if (a === b) return true;
    if (b === "Object") return !isPrim(a);
    var guard = 0;
    while (a && guard++ < 50) {
      var c = this.classOf(a);
      if (c) a = c.sup || "Object";
      else a = EXC_PARENT[a] || null;
      if (a === b) return true;
    }
    return false;
  };
  CK.assignable = function (to, from, constVal) {
    if (to === from) return true;
    if (to === "var") return true;
    if (from === "null") return !isPrim(to);
    var tu = unbox(to), fu = unbox(from);
    if (BOX[to] && isPrim(from)) return tu === from || (constVal != null && fu === "int" && NUMRANK[tu] && NUMRANK[tu] < 3);
    if (BOX[from] && isPrim(to)) return this.assignable(to, fu);
    if (isPrim(to) && isPrim(from)) {
      if (to === "boolean" || from === "boolean") return false;
      if (NUMRANK[to] >= NUMRANK[from] && !(to === "char" && from !== "char") && !(from === "char" && (to === "short" || to === "byte"))) return true;
      if (constVal != null && from === "int" && (to === "char" || to === "short" || to === "byte")) return true;
      return false;
    }
    if (isPrim(to) || isPrim(from)) return to === "Object" && !!UNBOX[from] || (to === "Object" && isPrim(from));
    if (isList(to) && isList(from)) { var a = listElem(to), b = listElem(from); return /<>$/.test(from) || b === "Object" && /^(ArrayList|List)$/.test(from) || a === b; }
    if (isArr(to) && isArr(from)) return to === from || (to === "Object[]" && !isPrim(elemOf(from)));
    if (to === "Object") return true;
    return this.isSub(from, to);
  };
  CK.conv = function (node, to, from, constVal) {
    if (this.assignable(to, from, constVal)) return;
    if (from === "void") throw this.err(node, "incompatible types: void cannot be converted to " + to, "Cette méthode ne renvoie rien (void) : on ne peut pas utiliser son résultat.");
    if (isNum(to) && isNum(from)) throw this.err(node, "incompatible types: possible lossy conversion from " + from + " to " + to,
      "On ne peut pas ranger un " + from + " dans un " + to + " sans risque de perte (la partie décimale ou une partie du nombre serait perdue). Change le type de la variable, ou convertis explicitement : (" + to + ") valeur" + (from === "long" ? ". Math.round renvoie un long." : "."));
    var fr = "Le type ne correspond pas : on attend un " + to + " et on reçoit un " + from + ".";
    if (to === "String" && isNum(from)) fr += " Pour transformer un nombre en texte : String.valueOf(n) ou \"\" + n.";
    if (isNum(to) && from === "String") fr += " Pour transformer un texte en nombre : Integer.parseInt(texte) ou Double.parseDouble(texte).";
    if (to === "boolean") fr = "Une condition doit valoir true ou false. Pour comparer, utilise == (et non =), ou <, >, !=…";
    if (to === "char" && from === "String") fr += " Un char s'écrit entre apostrophes : 'A'. Un String entre guillemets : \"A\".";
    throw this.err(node, "incompatible types: " + from + " cannot be converted to " + to, fr);
  };
  CK.fieldOf = function (clsName, name) {
    var g = 0;
    while (clsName && g++ < 50) {
      var c = this.classOf(clsName);
      if (!c) return null;
      for (var i = 0; i < c.fields.length; i++) if (c.fields[i].name === name) return c.fields[i];
      clsName = c.sup;
    }
    return null;
  };
  CK.methodsOf = function (clsName, name) {
    var res = [], g = 0;
    while (clsName && g++ < 50) {
      var c = this.classOf(clsName);
      if (!c) break;
      c.methods.forEach(function (m) { if (m.name === name) res.push(m); });
      clsName = c.sup;
    }
    return res;
  };
  CK.pickMethod = function (cands, argTypes, argNodes) {
    var self = this, ok = cands.filter(function (m) {
      if (m.params.length !== argTypes.length) return false;
      return m.params.every(function (p, i) { return self.assignable(p.type, argTypes[i], argNodes && argNodes[i] && argNodes[i].k === "lit" ? argNodes[i].v : null); });
    });
    if (!ok.length) return null;
    var exact = ok.filter(function (m) { return m.params.every(function (p, i) { return p.type === argTypes[i]; }); });
    return (exact[0] || ok[0]);
  };
  CK.sig = function (m) { return m.name + "(" + m.params.map(function (p) { return p.type; }).join(",") + ")"; };

  CK.run = function () {
    var self = this, P = this.prog;
    P.order.forEach(function (cn) {
      var c = P.classes[cn];
      self.curCls = cn;
      if (c.sup) {
        self.knownType(c.sup, { line: c.supTok.line, col: c.supTok.col });
        if (c.sup === cn || self.isSub(c.sup, cn)) throw new CErr(c.line, 1, "cyclic inheritance involving " + cn, "Une classe ne peut pas hériter d'elle-même.");
      }
      var seenF = E();
      c.fields.forEach(function (f) {
        if (seenF[f.name]) throw new CErr(f.line, f.col, "variable " + f.name + " is already defined in class " + cn, "Deux attributs portent le même nom : " + f.name + ".");
        seenF[f.name] = 1;
        self.knownType(f.type, f);
      });
      var seenM = E();
      c.methods.forEach(function (m) {
        self.knownType(m.ret, m);
        m.params.forEach(function (p) { self.knownType(p.type, p); });
        var key = self.sig(m);
        if (seenM[key]) throw new CErr(m.line, m.col, "method " + key + " is already defined in class " + cn, "Deux méthodes ont le même nom et les mêmes paramètres : " + key + ".");
        seenM[key] = 1;
        if (m.mods.abstract && !c.mods.abstract) throw new CErr(c.line, 1, cn + " is not abstract and does not override abstract method " + m.name + "() in " + cn, "Une classe qui contient une méthode abstract doit être déclarée abstract.");
      });
      c.ctors.forEach(function (k) { k.params.forEach(function (p) { self.knownType(p.type, p); }); });
    });
    // classes concrètes : méthodes abstraites héritées implémentées ?
    P.order.forEach(function (cn) {
      var c = P.classes[cn];
      if (c.mods.abstract) return;
      var sup = c.sup, g = 0;
      while (sup && P.classes[sup] && g++ < 50) {
        P.classes[sup].methods.forEach(function (m) {
          if (!m.mods.abstract) return;
          var impl = self.methodsOf(cn, m.name).filter(function (x) { return !x.mods.abstract && self.sig(x) === self.sig(m); });
          if (!impl.length) throw new CErr(c.line, 1, cn + " is not abstract and does not override abstract method " + self.sig(m) + " in " + sup, "La classe " + cn + " doit redéfinir la méthode abstraite " + m.name + " héritée de " + sup + ".");
        });
        sup = P.classes[sup].sup;
      }
    });
    P.order.forEach(function (cn) {
      var c = P.classes[cn];
      self.curCls = cn;
      c.fields.forEach(function (f) {
        if (f.init) {
          var ctx = { cls: cn, isStatic: !!f.mods.static, scopes: [E()], ret: null, loop: 0, sw: 0, method: null };
          var t = f.init.k === "arrinit" ? self.arrInit(f.init, f.type, ctx) : self.expr(f.init, ctx);
          self.conv(f.init, f.type, t, f.init.k === "lit" ? f.init.v : null);
        }
      });
      c.methods.forEach(function (m) {
        if (!m.body) return;
        var sc = E(); m.params.forEach(function (p) { if (sc[p.name]) throw new CErr(p.line, 1, "variable " + p.name + " is already defined in method " + self.sig(m), "Deux paramètres portent le même nom."); sc[p.name] = { type: p.type, init: true }; });
        var ctx = { cls: cn, isStatic: !!m.mods.static, scopes: [sc], ret: m.ret, loop: 0, sw: 0, method: m, mname: self.sig(m), handlers: [m.throws || []] };
        var completes = self.block(m.body, ctx, true);
        if (m.ret !== "void" && completes) {
          var lastLine = self.lastLine(m.body);
          self.flow(new CErr(lastLine, 1, "missing return statement", "La méthode " + m.name + " doit renvoyer un " + m.ret + " (instruction return) dans tous les cas, y compris quand aucune condition n'est vraie."));
        }
      });
      c.ctors.forEach(function (k) {
        var sc = E(); k.params.forEach(function (p) { sc[p.name] = { type: p.type, init: true }; });
        var ctx = { cls: cn, isStatic: false, scopes: [sc], ret: "void", loop: 0, sw: 0, ctor: true, mname: cn + "(" + k.params.map(function (p) { return p.type; }).join(",") + ")", handlers: [k.throws || []] };
        var b = k.body.body;
        var first = b[0] && b[0].k === "expr" && b[0].e.k === "ctorcall" ? b[0].e : null;
        if (first) self.ctorCall(first, ctx, cn);
        else if (c.sup && P.classes[c.sup]) {
          var sk = P.classes[c.sup].ctors;
          if (sk.length && !sk.some(function (x) { return x.params.length === 0; })) {
            throw new CErr(k.line, 1, "constructor " + c.sup + " in class " + c.sup + " cannot be applied to given types;", "Le constructeur de " + cn + " doit commencer par super(…) avec les paramètres attendus par le constructeur de " + c.sup + ".");
          }
        }
        b.forEach(function (s, i) {
          if (i === 0 && first) return;
          if (s.k === "expr" && s.e.k === "ctorcall") throw self.err(s, "call to " + s.e.which + " must be first statement in constructor", "super(…) ou this(…) doit être la toute première instruction du constructeur.");
        });
        self.block({ body: first ? b.slice(1) : b }, ctx, true);
      });
      if (!c.ctors.length && c.sup && P.classes[c.sup]) {
        var sk2 = P.classes[c.sup].ctors;
        if (sk2.length && !sk2.some(function (x) { return x.params.length === 0; })) throw new CErr(c.line, 1, "constructor " + c.sup + " in class " + c.sup + " cannot be applied to given types;", "La classe " + cn + " n'a pas de constructeur ; Java essaie d'appeler " + c.sup + "() sans paramètre, qui n'existe pas. Ajoute un constructeur qui appelle super(…).");
      }
    });
  };
  CK.lastLine = function (b) {
    var last = b, guard = 0;
    while (last && last.body && last.body.length && guard++ < 50) last = last.body[last.body.length - 1];
    var ln = (last && last.line) || b.line;
    // ligne de l'accolade fermante : cherche la } suivante
    var lines = this.prog.lines;
    for (var i = ln; i < lines.length; i++) if (/^\s*}/.test(lines[i])) return i + 1;
    return ln;
  };
  CK.lookupVar = function (ctx, name) {
    for (var i = ctx.scopes.length - 1; i >= 0; i--) if (ctx.scopes[i][name]) return ctx.scopes[i][name];
    return null;
  };
  CK.declare = function (ctx, d, type) {
    if (this.lookupVar(ctx, d.name)) throw new CErr(d.line, d.col, "variable " + d.name + " is already defined in method " + (ctx.mname || "main(String[])"),
      "La variable " + d.name + " existe déjà. Pour changer sa valeur, n'écris pas le type une seconde fois : " + d.name + " = …;");
    ctx.scopes[ctx.scopes.length - 1][d.name] = { type: type, init: !!d.init, fin: d.fin };
  };
  // renvoie true si le bloc peut se terminer normalement
  CK.block = function (b, ctx, noScope) {
    if (!noScope) ctx.scopes.push(E());
    var can = true;
    for (var i = 0; i < b.body.length; i++) {
      if (!can) {
        var s0 = b.body[i];
        this.flow(this.err(s0, "unreachable statement", "Cette instruction ne pourra jamais s'exécuter : elle se trouve après un return, un break, un continue ou un throw."));
      }
      can = this.stmt(b.body[i], ctx);
    }
    if (!noScope) ctx.scopes.pop();
    return can;
  };
  CK.cond = function (e, ctx) {
    var t = this.expr(e, ctx);
    if (unbox(t) !== "boolean") {
      if (e.k === "assign" && e.op === "=") throw this.err(e, "incompatible types: " + t + " cannot be converted to boolean", "Dans une condition, = affecte une valeur. Pour comparer, écris == .");
      this.conv(e, "boolean", t);
    }
  };
  CK.isTrue = function (e) { return e && e.k === "lit" && e.v === true; };
  CK.stmt = function (s, ctx) {
    var self = this;
    switch (s.k) {
      case "empty": return true;
      case "block": return this.block(s, ctx);
      case "local":
        s.decls.forEach(function (d) {
          d.fin = s.fin;
          if (d.type === "var") {
            if (!d.init) throw self.err(d, "cannot infer type for local variable " + d.name, "Avec var, il faut une valeur initiale.");
            var vt = self.expr(d.init, ctx);
            if (vt === "null") throw self.err(d, "cannot infer type for local variable " + d.name, "var ne peut pas être initialisée à null.");
            d.rtype = vt === "ArrayList<>" ? "ArrayList<Object>" : vt; self.declare(ctx, d, d.rtype); return;
          }
          self.knownType(d.type, d);
          if (d.init) {
            var it = d.init.k === "arrinit" ? self.arrInit(d.init, d.type, ctx) : self.expr(d.init, ctx);
            self.conv(d.init, d.type, it, self.constOf(d.init));
          }
          d.rtype = d.type;
          self.declare(ctx, d, d.type);
        });
        return true;
      case "expr":
        if (s.e.k === "ctorcall") throw this.err(s, "call to " + s.e.which + " must be first statement in constructor", "super(…) ou this(…) ne peut être appelé qu'en première ligne d'un constructeur.");
        this.expr(s.e, ctx, true);
        if (s.e.k === "call" && s.e.obj && s.e.obj.k === "name" && s.e.obj.name === "System" && s.e.name === "exit") return true;
        return true;
      case "if": {
        this.cond(s.cond, ctx);
        var before = this.snapInit(ctx);
        ctx.scopes.push(E()); var a = this.stmt(s.then, ctx); ctx.scopes.pop();
        var afterThen = this.snapInit(ctx);
        this.restoreInit(ctx, before);
        var b = true;
        if (s.els) { ctx.scopes.push(E()); b = this.stmt(s.els, ctx); ctx.scopes.pop(); }
        var afterElse = this.snapInit(ctx);
        // définitivement initialisée si initialisée dans les deux branches (ou branche qui ne termine pas)
        this.mergeInit(ctx, a ? afterThen : null, b ? afterElse : null, before);
        return a || b || !s.els;
      }
      case "while": {
        this.cond(s.cond, ctx);
        var bw = this.snapInit(ctx);
        ctx.loop++; ctx.scopes.push(E()); this.stmt(s.body, ctx); ctx.scopes.pop(); ctx.loop--;
        if (this.isTrue(s.cond)) { s.infinite = true; return this.hasBreak(s.body); }
        this.restoreInit(ctx, bw);
        return true;
      }
      case "do": {
        ctx.loop++; ctx.scopes.push(E()); this.stmt(s.body, ctx); ctx.scopes.pop(); ctx.loop--;
        this.cond(s.cond, ctx);
        if (this.isTrue(s.cond)) return this.hasBreak(s.body);
        return true;
      }
      case "for": {
        ctx.scopes.push(E());
        s.init.forEach(function (x) { self.stmt(x, ctx); });
        if (s.cond) this.cond(s.cond, ctx);
        var bf = this.snapInit(ctx);
        ctx.loop++; ctx.scopes.push(E()); this.stmt(s.body, ctx); ctx.scopes.pop(); ctx.loop--;
        s.upd.forEach(function (u) { self.expr(u, ctx, true); });
        this.restoreInit(ctx, bf);
        ctx.scopes.pop();
        if (!s.cond) return this.hasBreak(s.body);
        return true;
      }
      case "foreach": {
        var itT = this.expr(s.iter, ctx), elT;
        if (isArr(itT)) elT = elemOf(itT);
        else if (isList(itT)) elT = listElem(itT);
        else throw this.err(s.iter, "for-each not applicable to expression type\n  required: array or java.lang.Iterable\n  found:    " + itT, "La boucle for (x : …) parcourt un tableau ou une ArrayList.");
        if (s.type !== "var") { this.knownType(s.type, s); this.conv(s, s.type, elT); }
        ctx.scopes.push(E()); this.declare(ctx, { name: s.name, line: s.vline, col: 1, init: true }, s.type === "var" ? elT : s.type);
        ctx.loop++; this.stmt(s.body, ctx); ctx.loop--;
        ctx.scopes.pop();
        return true;
      }
      case "switch": {
        var st = this.expr(s.sel, ctx), su = unbox(st);
        if (!(su === "int" || su === "char" || su === "short" || su === "byte" || st === "String")) throw this.err(s.sel, "patterns in switch statements are a preview feature", "Un switch fonctionne sur un int, un char ou un String (pas sur un double ni un boolean).");
        var seen = E(), hasDef = false, allEnd = true, lastCan = true;
        ctx.sw++; ctx.scopes.push(E());
        s.cases.forEach(function (c, ci) {
          if (c.def) { if (hasDef) throw self.err({ line: c.line, col: 1 }, "duplicate default label", "Un seul default par switch."); hasDef = true; }
          c.labels.forEach(function (l) {
            var lt = self.expr(l, ctx);
            var cv = self.constOf(l);
            if (cv === null || cv === undefined) throw self.err(l, "constant expression required", "Après case, il faut une valeur constante (un nombre, un caractère ou un texte entre guillemets).");
            if (st === "String" ? lt !== "String" : !self.assignable(su, lt, cv)) throw self.err(l, "constant expression required", "La valeur du case doit être du même type que celle testée par le switch (" + st + ").");
            var key = String(cv);
            if (seen[key]) throw self.err(l, "duplicate case label", "Deux case ont la même valeur.");
            seen[key] = 1;
          });
          if (s.arrow) { ctx.scopes.push(E()); var cc = self.block({ body: c.body }, ctx, true); ctx.scopes.pop(); if (cc) allEnd = false; }
          else { lastCan = self.block({ body: c.body }, ctx, true); }
        });
        ctx.scopes.pop(); ctx.sw--;
        if (!hasDef) return true;
        var brk = s.cases.some(function (c) { return self.hasBreak({ k: "block", body: c.body }); });
        if (brk) return true;
        if (s.arrow) return !allEnd ? true : false;
        return lastCan;
      }
      case "yield": {
        if (!ctx.yields || !ctx.yields.length) throw this.err(s, "yield outside of switch expression", "yield ne s'utilise que dans une expression switch.");
        ctx.yields[ctx.yields.length - 1].push(this.expr(s.e, ctx));
        return false;
      }
      case "break": if (!ctx.loop && !ctx.sw) throw this.err(s, "break outside switch or loop", "break ne peut s'utiliser que dans une boucle ou un switch."); return false;
      case "continue": if (!ctx.loop) throw this.err(s, "continue outside of loop", "continue ne peut s'utiliser que dans une boucle."); return false;
      case "return":
        if (ctx.ret === null) throw this.err(s, "return outside method", "return doit être dans une méthode.");
        if (ctx.ret === "void") { if (s.e) { var tv = this.expr(s.e, ctx); throw this.err(s.e, "incompatible types: unexpected return value", "Cette méthode est void : elle ne renvoie rien. Enlève la valeur après return, ou change le type de retour en " + tv + "."); } }
        else {
          if (!s.e) throw this.err(s, "missing return value", "Cette méthode doit renvoyer un " + ctx.ret + " : écris return valeur;");
          this.conv(s.e, ctx.ret, this.expr(s.e, ctx), this.constOf(s.e));
        }
        return false;
      case "throw": {
        var tt = this.expr(s.e, ctx);
        if (!this.isSub(tt, "Throwable")) throw this.err(s.e, "incompatible types: " + tt + " cannot be converted to Throwable", "On ne peut lancer (throw) qu'une exception, par exemple : throw new IllegalArgumentException(\"message\");");
        this.checkThrown(s, tt, ctx);
        return false;
      }
      case "try": {
        ctx.scopes.push(E());
        var caught = []; s.catches.forEach(function (c) { caught = caught.concat(c.types); });
        ctx.handlers = (ctx.handlers || []).concat([caught]);
        s.res.forEach(function (r) { self.stmt(r, ctx); });
        var bt = this.block(s.body, ctx);
        ctx.handlers = ctx.handlers.slice(0, -1);
        ctx.scopes.pop();
        var any = bt;
        s.catches.forEach(function (c) {
          c.types.forEach(function (ty) {
            self.knownType(ty, { line: c.line, col: 1 });
            if (!self.isSub(ty, "Throwable")) throw self.err({ line: c.line, col: 1 }, "incompatible types: " + ty + " cannot be converted to Throwable", "Un catch attrape une exception (ex. NumberFormatException).");
          });
          ctx.scopes.push(E()); self.declare(ctx, { name: c.name, line: c.line, col: 1, init: true }, c.types.length === 1 ? c.types[0] : "Exception");
          if (self.block(c.body, ctx, true)) any = true;
          ctx.scopes.pop();
        });
        if (s.fin) { if (!this.block(s.fin, ctx)) return false; }
        return any;
      }
    }
    return true;
  };
  CK.isChecked = function (t) { return this.isSub(t, "Exception") && !this.isSub(t, "RuntimeException"); };
  CK.checkThrown = function (node, t, ctx) {
    if (!this.isChecked(t)) return;
    var self = this, hs = ctx.handlers || [];
    for (var i = 0; i < hs.length; i++) if (hs[i].some(function (h) { return self.isSub(t, h); })) return;
    throw this.err(node, "unreported exception " + t + "; must be caught or declared to be thrown",
      t + " est une exception « vérifiée » : Java oblige à la traiter. Entoure l'instruction d'un try { … } catch (" + t + " e) { … }, ou ajoute « throws " + t + " » à l'en-tête de la méthode.");
  };
  CK.hasBreak = function (s) {
    var found = false;
    (function walk(n, depth) {
      if (!n || found) return;
      if (n.k === "break" && depth === 0) { found = true; return; }
      if (n.k === "while" || n.k === "do" || n.k === "for" || n.k === "foreach") return walk(n.body, depth + 1);
      if (n.k === "switch") { n.cases.forEach(function (c) { c.body.forEach(function (x) { walk(x, depth + 1); }); }); return; }
      if (n.k === "block") n.body.forEach(function (x) { walk(x, depth); });
      if (n.k === "if") { walk(n.then, depth); walk(n.els, depth); }
      if (n.k === "try") { walk(n.body, depth); n.catches.forEach(function (c) { walk(c.body, depth); }); walk(n.fin, depth); }
    })(s, 0);
    return found;
  };
  CK.snapInit = function (ctx) { var m = []; ctx.scopes.forEach(function (sc) { for (var k in sc) m.push([sc[k], sc[k].init]); }); return m; };
  CK.restoreInit = function (ctx, snap) { snap.forEach(function (p) { p[0].init = p[1]; }); };
  CK.mergeInit = function (ctx, a, b, before) {
    // a, b : snapshots (ou null si la branche ne se termine pas normalement)
    before.forEach(function (p, i) {
      var ia = a ? a[i][1] : true, ib = b ? b[i][1] : true;
      if (!a && !b) ia = ib = p[1];
      p[0].init = p[1] || (ia && ib);
    });
  };
  CK.constOf = function (e) {
    if (!e) return null;
    if (e.k === "lit") return e.t === "null" ? null : e.v;
    if (e.k === "paren") return this.constOf(e.e);
    if (e.k === "un" && e.op === "-") { var v = this.constOf(e.e); return typeof v === "number" ? -v : null; }
    if (e.k === "bin" && e.op === "+" ) { var a = this.constOf(e.a), b = this.constOf(e.b); if (typeof a === "string" && b != null) return a + b; if (typeof a === "number" && typeof b === "number") return a + b; }
    return null;
  };
  CK.arrInit = function (n, ty, ctx) {
    var self = this;
    if (!isArr(ty)) throw this.err(n, "illegal initializer for " + ty, "Les accolades { … } servent à initialiser un tableau : le type doit finir par [] (ex. int[] t = {1, 2};).");
    var et = elemOf(ty);
    n.els.forEach(function (x) {
      var t = x.k === "arrinit" ? self.arrInit(x, et, ctx) : self.expr(x, ctx);
      self.conv(x, et, t, self.constOf(x));
    });
    n.rtype = ty;
    return ty;
  };
  CK.typeName = function (t) { return t; };
  CK.argTypes = function (args, ctx) { var self = this; return args.map(function (a) { return self.expr(a, ctx); }); };

  // ---- typage des expressions ----
  CK.expr = function (e, ctx, asStmt) {
    var t = this.expr0(e, ctx, asStmt);
    e.rt = t;
    return t;
  };
  CK.expr0 = function (e, ctx, asStmt) {
    var self = this, t, a, b;
    switch (e.k) {
      case "lit": return e.t;
      case "paren": return this.expr(e.e, ctx);
      case "this":
        if (ctx.isStatic) throw this.err(e, "non-static variable this cannot be referenced from a static context", "this n'existe pas dans une méthode static (comme main) : il n'y a pas d'objet courant.");
        return ctx.cls;
      case "name": {
        var v = this.lookupVar(ctx, e.name);
        if (v) {
          if (!v.init && !e.lhs) { this.flow(this.err(e, "variable " + e.name + " might not have been initialized", "La variable " + e.name + " est utilisée avant d'avoir reçu une valeur. Donne-lui une valeur au moment de la déclaration (ex. = 0).")); v.init = true; }
          e.local = true; return v.type;
        }
        var f = this.fieldOf(ctx.cls, e.name);
        if (f) {
          if (ctx.isStatic && !f.mods.static) throw this.err(e, "non-static variable " + e.name + " cannot be referenced from a static context", "L'attribut " + e.name + " appartient à chaque objet ; dans une méthode static (comme main), il faut passer par un objet : objet." + e.name + ".");
          if (f.mods["private"] && f.cls !== ctx.cls) throw this.err(e, e.name + " has private access in " + f.cls, "L'attribut " + e.name + " est private dans " + f.cls + " : utilise un getter.");
          e.fieldOf = f.cls; e.isStatic = !!f.mods.static; return f.type;
        }
        if (this.classOf(e.name) || /^(Math|System|Integer|Double|String|Character|Arrays|Boolean|Long)$/.test(e.name)) { e.isClass = true; return "class:" + e.name; }
        var hint = "";
        if (/^[a-z]/.test(e.name) && /^(system|math|string|integer)$/i.test(e.name)) hint = " Attention à la casse : " + e.name.charAt(0).toUpperCase() + e.name.slice(1) + ".";
        else hint = " Vérifie qu'elle est déclarée (type nom = valeur;), bien orthographiée, et visible ici (une variable déclarée dans un bloc { } n'existe pas en dehors). Si c'est du texte, mets-le entre guillemets.";
        throw this.err(e, "cannot find symbol\n  symbol:   variable " + e.name + "\n  location: class " + ctx.cls, "Java ne connaît pas « " + e.name + " »." + hint);
      }
      case "field": {
        if (e.obj.k === "name" && !this.lookupVar(ctx, e.obj.name) && !this.fieldOf(ctx.cls, e.obj.name)) {
          var on = e.obj.name;
          if (on === "System" && (e.name === "out" || e.name === "err" || e.name === "in")) { e.obj.isClass = true; return "PrintStream:" + e.name; }
          if (on === "Math" && (e.name === "PI" || e.name === "E")) { e.obj.isClass = true; return "double"; }
          if ((on === "Integer" || on === "Long") && (e.name === "MAX_VALUE" || e.name === "MIN_VALUE")) { e.obj.isClass = true; return on === "Integer" ? "int" : "long"; }
          if (on === "Double" && (e.name === "MAX_VALUE" || e.name === "MIN_VALUE")) { e.obj.isClass = true; return "double"; }
          if (on === "system") throw this.err(e.obj, "package system does not exist", "Java est sensible à la casse : on écrit System avec un S majuscule.");
          if (on === "System") throw this.err(e, "cannot find symbol\n  symbol:   variable " + e.name + "\n  location: class System", e.name.toLowerCase() === "out" ? "Attention à la casse : c'est out, tout en minuscules." : "La classe System ne contient pas « " + e.name + " ».");
          var sc = this.classOf(on);
          if (sc) {
            var sf = this.fieldOf(on, e.name);
            if (!sf) throw this.err(e, "cannot find symbol\n  symbol:   variable " + e.name + "\n  location: class " + on, "La classe " + on + " n'a pas d'attribut nommé " + e.name + ".");
            if (!sf.mods.static) throw this.err(e, "non-static variable " + e.name + " cannot be referenced from a static context", "L'attribut " + e.name + " appartient à chaque objet : passe par un objet, pas par le nom de la classe.");
            if (sf.mods["private"] && sf.cls !== ctx.cls) throw this.err(e, e.name + " has private access in " + sf.cls, "L'attribut " + e.name + " est private dans " + sf.cls + ".");
            e.obj.isClass = true; e.staticField = sf.cls; return sf.type;
          }
          if (/^[A-Z]/.test(on)) throw this.err(e.obj, "cannot find symbol\n  symbol:   variable " + on + "\n  location: class " + ctx.cls, "Java ne connaît pas « " + on + " ».");
          if (/^[a-z]/.test(on) && !this.classOf(on)) {
            if (on === "system") throw this.err(e.obj, "package system does not exist", "Java est sensible à la casse : on écrit System avec un S majuscule.");
            throw this.err(e.obj, "cannot find symbol\n  symbol:   variable " + on + "\n  location: class " + ctx.cls, "Java ne connaît pas la variable « " + on + " ». Vérifie qu'elle est déclarée et bien orthographiée.");
          }
        }
        var ot = this.expr(e.obj, ctx);
        if (isArr(ot)) {
          if (e.name === "length") return "int";
          throw this.err(e, "cannot find symbol\n  symbol:   variable " + e.name + "\n  location: class " + ot, e.name === "size" || e.name === "length()" ? "Pour un tableau, c'est .length (sans parenthèses)." : "Un tableau n'a que l'attribut length.");
        }
        if (ot === "String" && e.name === "length") throw this.err(e, "cannot find symbol\n  symbol:   variable length\n  location: class String", "Pour un String, length est une méthode : s.length() avec des parenthèses (pour un tableau, c'est t.length sans parenthèses).");
        if (isPrim(ot)) throw this.err(e, ot + " cannot be dereferenced", "Une variable de type " + ot + " n'est pas un objet : elle n'a ni attributs ni méthodes.");
        var fc = this.classOf(ot);
        if (fc) {
          var ff = this.fieldOf(ot, e.name);
          if (!ff) throw this.err(e, "cannot find symbol\n  symbol:   variable " + e.name + "\n  location: variable of type " + ot, "La classe " + ot + " n'a pas d'attribut nommé " + e.name + ".");
          if (ff.mods["private"] && ff.cls !== ctx.cls) throw this.err(e.nameTok || e, e.name + " has private access in " + ff.cls, "L'attribut " + e.name + " est private : on ne peut pas le lire ni le modifier depuis une autre classe. Utilise le getter (get…) ou le setter (set…) de " + ff.cls + ".");
          e.fieldOf = ff.cls; return ff.type;
        }
        if (isList(ot) && (e.name === "length" || e.name === "size")) throw this.err(e, "cannot find symbol\n  symbol:   variable " + e.name, "Pour une ArrayList, on écrit liste.size() avec des parenthèses.");
        throw this.err(e, "cannot find symbol\n  symbol:   variable " + e.name + "\n  location: class " + ot, "« " + e.name + " » n'existe pas pour une valeur de type " + ot + ".");
      }
      case "index": {
        var at = this.expr(e.arr, ctx);
        var it = this.expr(e.idx, ctx);
        if (!isArr(at)) {
          if (isList(at)) throw this.err(e, "array required, but " + at + " found", "Une ArrayList ne s'utilise pas avec [ ] : écris liste.get(i).");
          if (at === "String") throw this.err(e, "array required, but String found", "Pour lire le caractère n° i d'un texte : s.charAt(i).");
          throw this.err(e, "array required, but " + at + " found", "Les crochets [ ] s'utilisent sur un tableau.");
        }
        if (!this.assignable("int", it)) this.conv(e.idx, "int", it);
        return elemOf(at);
      }
      case "assign": {
        e.target.lhs = e.op === "=";
        var tt = this.expr(e.target, ctx);
        e.target.lhs = false;
        if (e.target.k === "name" && e.target.local) {
          var vv = this.lookupVar(ctx, e.target.name);
          if (vv.fin && (vv.init || e.op !== "=")) throw this.err(e.target, "cannot assign a value to final variable " + e.target.name, "Cette variable est final (constante) : sa valeur ne peut plus changer.");
        }
        if (e.target.k === "name" && !e.target.local) { var fld = this.fieldOf(ctx.cls, e.target.name); if (fld && fld.mods.final && !ctx.ctor) throw this.err(e.target, "cannot assign a value to final variable " + e.target.name, "Cet attribut est final : sa valeur ne peut plus changer."); }
        if (e.target.k === "field") { var fd = this.fieldOf(e.target.fieldOf || e.target.staticField, e.target.name); if (fd && fd.mods.final && !ctx.ctor) throw this.err(e.target, "cannot assign a value to final variable " + e.target.name, "Cet attribut est final : sa valeur ne peut plus changer."); }
        var vt = this.expr(e.value, ctx);
        if (e.op === "=") this.conv(e.value, tt, vt, this.constOf(e.value));
        else if (e.op === "+=" && tt === "String") { /* concaténation */ }
        else {
          if (!isNum(tt) || !isNum(vt)) throw this.err(e, "bad operand types for binary operator '" + e.op[0] + "'\n  first type:  " + tt + "\n  second type: " + vt, "L'opérateur " + e.op + " s'utilise avec des nombres.");
        }
        if (e.target.k === "name" && e.target.local) this.lookupVar(ctx, e.target.name).init = true;
        return tt;
      }
      case "incdec": {
        var ty = this.expr(e.target, ctx);
        if (!(e.target.k === "name" || e.target.k === "field" || e.target.k === "index")) throw this.err(e, "unexpected type\n  required: variable\n  found:    value", "++ et -- s'appliquent à une variable.");
        if (!isNum(ty)) throw this.err(e, "bad operand type " + ty + " for unary operator '" + e.op + "'", e.op + " s'utilise sur une variable numérique.");
        if (e.target.k === "name" && e.target.local && this.lookupVar(ctx, e.target.name).fin) throw this.err(e.target, "cannot assign a value to final variable " + e.target.name, "Cette variable est final : sa valeur ne peut plus changer.");
        return ty;
      }
      case "un": {
        t = this.expr(e.e, ctx);
        if (e.op === "!") { if (unbox(t) !== "boolean") throw this.err(e, "bad operand type " + t + " for unary operator '!'", "! (non) s'applique à une condition (boolean)."); return "boolean"; }
        if (!isNum(t)) throw this.err(e, "bad operand type " + t + " for unary operator '" + e.op + "'", "Le signe " + e.op + " s'applique à un nombre.");
        var u = unbox(t); return (u === "char" || u === "short" || u === "byte") ? "int" : u;
      }
      case "bin": {
        a = this.expr(e.a, ctx); b = this.expr(e.b, ctx);
        var op = e.op;
        var bad = function (fr) { return self.err(e, "bad operand types for binary operator '" + op + "'\n  first type:  " + a + "\n  second type: " + b, fr); };
        if (a === "void" || b === "void") throw this.err(e, "'void' type not allowed here", "Cette méthode ne renvoie rien (void) : on ne peut pas utiliser son résultat dans un calcul ou un affichage.");
        if (op === "+") {
          if (isStr(a) || isStr(b)) return "String";
          if (isNum(a) && isNum(b)) return promote(a, b);
          throw bad("+ additionne des nombres ou colle des textes. Ici les types ne s'y prêtent pas.");
        }
        if (op === "-" || op === "*" || op === "/" || op === "%") {
          if (isNum(a) && isNum(b)) return promote(a, b);
          throw bad(isStr(a) || isStr(b) ? "On ne peut pas faire « " + op + " » avec du texte. Si le texte contient un nombre, convertis-le d'abord avec Integer.parseInt ou Double.parseDouble." : "L'opérateur " + op + " s'utilise avec des nombres.");
        }
        if (op === "<" || op === ">" || op === "<=" || op === ">=") {
          if (isNum(a) && isNum(b)) return "boolean";
          throw bad(isStr(a) && isStr(b) ? "On ne compare pas deux textes avec " + op + ". Utilise a.compareTo(b) (négatif, 0 ou positif)." : "Les comparaisons " + op + " s'utilisent avec des nombres.");
        }
        if (op === "==" || op === "!=") {
          if (isNum(a) && isNum(b)) return "boolean";
          if (unbox(a) === "boolean" && unbox(b) === "boolean") return "boolean";
          if (!isPrim(a) && !isPrim(b) && (a === "null" || b === "null" || this.assignable(a, b) || this.assignable(b, a))) { if (isStr(a) && isStr(b)) e.strEq = true; return "boolean"; }
          if (isPrim(a) && (b === "null")) throw bad("Une variable de type " + a + " ne peut jamais valoir null.");
          throw this.err(e, "incomparable types: " + a + " and " + b, "On ne peut pas comparer un " + a + " et un " + b + ".");
        }
        if (op === "&&" || op === "||") {
          if (unbox(a) === "boolean" && unbox(b) === "boolean") return "boolean";
          throw bad(op + " relie deux conditions (true/false). Exemple : (age >= 18 && age < 65).");
        }
        throw bad("Opérateur non géré.");
      }
      case "cond": {
        this.cond(e.c, ctx);
        a = this.expr(e.a, ctx); b = this.expr(e.b, ctx);
        if (a === b) return a;
        if (isNum(a) && isNum(b)) return promote(a, b);
        if (a === "null") return b; if (b === "null") return a;
        if (isStr(a) || isStr(b)) return "Object";
        return this.assignable(a, b) ? a : this.assignable(b, a) ? b : "Object";
      }
      case "cast": {
        this.knownType(e.type, e);
        t = this.expr(e.e, ctx);
        if (isNum(e.type) && isNum(t)) return e.type;
        if (isPrim(e.type) && t === "String") throw this.err(e, "incompatible types: String cannot be converted to " + e.type, "On ne convertit pas un texte en nombre avec un cast. Utilise Integer.parseInt(texte) ou Double.parseDouble(texte).");
        if (isPrim(e.type) !== isPrim(t) && !(BOX[t] || BOX[e.type])) throw this.err(e, "incompatible types: " + t + " cannot be converted to " + e.type, "Conversion impossible entre " + t + " et " + e.type + ".");
        if (!isPrim(e.type) && !this.assignable(e.type, t) && !this.assignable(t, e.type)) throw this.err(e, "incompatible types: " + t + " cannot be converted to " + e.type, "Ces deux classes ne sont pas liées par l'héritage : le cast est impossible.");
        return e.type;
      }
      case "instanceof": { this.knownType(e.type, e); this.expr(e.e, ctx); return "boolean"; }
      case "arrinit": return this.arrInit(e, e.type, ctx);
      case "newarr": {
        this.knownType(e.base, e);
        e.dims.forEach(function (d) { var dt = self.expr(d, ctx); if (!self.assignable("int", dt)) self.conv(d, "int", dt); });
        return e.type;
      }
      case "new": return this.newObj(e, ctx);
      case "call": return this.call(e, ctx, asStmt);
      case "ctorcall": throw this.err(e, "call to " + e.which + " must be first statement in constructor", "super(…) ou this(…) ne peut être appelé qu'en première ligne d'un constructeur.");
      case "super": return this.classOf(ctx.cls).sup || "Object";
      case "switchx": {
        var xt = this.expr(e.sel, ctx), xu = unbox(xt), types = [], hasD = false, seenX = E();
        e.cases.forEach(function (c) {
          if (c.def) hasD = true;
          c.labels.forEach(function (l) { self.expr(l, ctx); var cv = self.constOf(l); if (cv == null) throw self.err(l, "constant expression required", "Après case, il faut une valeur constante."); if (seenX[cv]) throw self.err(l, "duplicate case label", "Deux case ont la même valeur."); seenX[cv] = 1; });
          if (c.e) types.push(self.expr(c.e, ctx));
          else { ctx.yields = (ctx.yields || []).concat([[]]); ctx.scopes.push(E()); self.block(c.block, ctx, true); ctx.scopes.pop(); types = types.concat(ctx.yields.pop()); }
        });
        if (!hasD) throw this.err(e, "the switch expression does not cover all possible input values", "Une expression switch doit prévoir tous les cas : ajoute une ligne default -> …;");
        var rt = types[0] || "void";
        types.forEach(function (x) { if (x !== rt) { if (isNum(x) && isNum(rt)) rt = promote(x, rt); else if (x !== "null") rt = isStr(x) && isStr(rt) ? "String" : "Object"; } });
        return rt;
      }
    }
    throw new Unsup(e.line, "Expression non gérée par le simulateur.");
  };
  CK.ctorCall = function (e, ctx, cn) {
    var c = this.classOf(cn);
    var target = e.which === "this" ? cn : (c.sup || "Object");
    var ats = this.argTypes(e.args, ctx);
    e.target = target;
    if (EXC_PARENT[target] || target === "Object") { e.builtin = true; if (ats.length > 1 || (ats.length === 1 && ats[0] !== "String" && !this.isSub(ats[0], "Throwable"))) throw this.err(e, "constructor " + target + " cannot be applied to given types;", "Le constructeur de " + target + " accepte un message (String)."); return; }
    var tc = this.classOf(target);
    var k = this.pickMethod(tc.ctors.length ? tc.ctors : [{ params: [] }], ats, e.args);
    if (!k) throw this.err(e, "constructor " + target + " in class " + target + " cannot be applied to given types;\n  required: " + this.ctorSigs(tc) + "\n  found:    " + (ats.join(",") || "no arguments"), "Les valeurs passées à " + e.which + "(…) ne correspondent pas aux paramètres du constructeur de " + target + ".");
    e.ctor = k.body ? k : null;
  };
  CK.ctorSigs = function (c) { return c.ctors.length ? c.ctors.map(function (k) { return k.params.map(function (p) { return p.type; }).join(",") || "no arguments"; }).join(" | ") : "no arguments"; };
  CK.newObj = function (e, ctx) {
    var cn = e.cls.replace(/<.*>$/, "");
    var ats = this.argTypes(e.args, ctx);
    if (cn === "Scanner") {
      if (!(e.args.length === 1 && e.args[0].k === "field" && e.args[0].name === "in")) throw new Unsup(e.line, "Le simulateur gère seulement new Scanner(System.in). Pour lire un fichier, teste avec ton JDK.");
      return "Scanner";
    }
    if (cn === "ArrayList") {
      if (e.args.length > 1 || (e.args.length === 1 && !isNum(ats[0]) && !isList(ats[0]))) throw this.err(e, "no suitable constructor found for ArrayList", "new ArrayList<>() s'écrit en général sans argument.");
      if (/<>$/.test(e.cls) || e.cls === "ArrayList") return /<>$/.test(e.cls) ? "ArrayList<>" : "ArrayList<Object>";
      return e.cls;
    }
    if (cn === "Object") return "Object";
    if (cn === "String") return "String";
    if (BOX[cn]) throw new Unsup(e.line, "new " + cn + "(…) est obsolète : écris directement la valeur.");
    if (EXC_PARENT[cn]) {
      if (ats.length > 1 || (ats.length === 1 && ats[0] !== "String")) throw this.err(e, "no suitable constructor found for " + cn, "Le constructeur d'une exception accepte un message (String).");
      return cn;
    }
    var c = this.classOf(cn);
    if (!c) this.knownType(cn, e.tok || e);
    if (c.mods.abstract) throw this.err(e, cn + " is abstract; cannot be instantiated", "On ne peut pas créer d'objet d'une classe abstract : crée plutôt un objet d'une de ses sous-classes.");
    var cands = c.ctors.length ? c.ctors : [{ params: [], mods: {} }];
    var k = this.pickMethod(cands, ats, e.args);
    if (!k) {
      throw this.err(e, "constructor " + cn + " in class " + cn + " cannot be applied to given types;\n  required: " + this.ctorSigs(c) + "\n  found:    " + (ats.join(",") || "no arguments") + "\n  reason: actual and formal argument lists differ in length",
        c.ctors.length ? "Les valeurs données à new " + cn + "(…) ne correspondent pas aux paramètres du constructeur (" + this.ctorSigs(c) + "). Vérifie leur nombre, leur ordre et leur type." :
        "La classe " + cn + " n'a pas de constructeur avec paramètres. Ajoute-en un, ou crée l'objet avec new " + cn + "().");
    }
    if (k.mods && k.mods["private"] && ctx.cls !== cn) throw this.err(e, cn + "(" + k.params.map(function (p) { return p.type; }).join(",") + ") has private access in " + cn, "Ce constructeur est private.");
    e.ctor = k.body ? k : null;
    var selfc = this; (k.throws || []).forEach(function (t) { selfc.checkThrown(e, t, ctx); });
    return cn;
  };
  CK.call = function (e, ctx, asStmt) {
    var self = this, ats, name = e.name;
    // --- appel sans objet : méthode de la classe courante
    if (!e.obj) {
      ats = this.argTypes(e.args, ctx);
      var cands = this.methodsOf(ctx.cls, name);
      if (!cands.length) {
        if (name === "println" || name === "print" || name === "printf") throw this.err(e, "cannot find symbol\n  symbol:   method " + name + "(" + ats.join(",") + ")\n  location: class " + ctx.cls, "En Java, on écrit le chemin complet : System.out." + name + "(…);");
        throw this.err(e, "cannot find symbol\n  symbol:   method " + name + "(" + ats.join(",") + ")\n  location: class " + ctx.cls, "La méthode " + name + " n'existe pas dans la classe " + ctx.cls + ". Vérifie son nom (majuscules comprises) ou déclare-la.");
      }
      var m = this.pickMethod(cands, ats, e.args);
      if (!m) throw this.err(e, "method " + name + " in class " + cands[0].cls + " cannot be applied to given types;\n  required: " + (cands[0].params.map(function (p) { return p.type; }).join(",") || "no arguments") + "\n  found:    " + (ats.join(",") || "no arguments"),
        "La méthode " + name + " attend " + (cands[0].params.length ? cands[0].params.length + " paramètre(s) : " + cands[0].params.map(function (p) { return p.type + " " + p.name; }).join(", ") : "aucun paramètre") + ". Vérifie le nombre, l'ordre et le type des valeurs passées.");
      if (ctx.isStatic && !m.mods.static) throw this.err(e, "non-static method " + this.sig(m) + " cannot be referenced from a static context",
        "La méthode " + name + " n'est pas static : depuis main (qui est static), on ne peut l'appeler que sur un objet. Pour une méthode utilitaire, ajoute le mot static à sa déclaration.");
      e.m = m; e.virtual = !m.mods.static;
      (m.throws || []).forEach(function (t) { self.checkThrown(e, t, ctx); });
      return m.ret;
    }
    // --- super.m()
    if (e.obj.k === "super") {
      ats = this.argTypes(e.args, ctx);
      var sup = this.classOf(ctx.cls).sup;
      if (!sup || !this.classOf(sup)) {
        if (name === "toString") { e.objectBuiltin = true; return "String"; }
        throw this.err(e, "cannot find symbol\n  symbol: method " + name, "La classe mère n'a pas de méthode " + name + ".");
      }
      var sm = this.pickMethod(this.methodsOf(sup, name), ats, e.args);
      if (!sm) { if (name === "toString" && !ats.length) { e.objectBuiltin = true; return "String"; } throw this.err(e, "cannot find symbol\n  symbol: method " + name + "(" + ats.join(",") + ")", "La classe " + sup + " n'a pas de méthode " + name + " avec ces paramètres."); }
      if (sm.mods.abstract) throw this.err(e, "abstract method " + this.sig(sm) + " in class " + sup + " cannot be accessed directly", "Cette méthode est abstraite dans la classe mère : elle n'a pas de code à appeler.");
      e.m = sm; e.superCall = true;
      return sm.ret;
    }
    // --- appel sur une classe (statique) ou un builtin
    var on = e.obj.k === "name" ? e.obj.name : null;
    var isVar = on && (this.lookupVar(ctx, on) || this.fieldOf(ctx.cls, on));
    if (on && !isVar) {
      ats = this.argTypes(e.args, ctx);
      var bt = this.staticBuiltin(on, name, ats, e, ctx);
      if (bt) { e.obj.isClass = true; return bt; }
      delete e.sb;
      var uc = this.classOf(on);
      if (uc) {
        var cm = this.methodsOf(on, name);
        if (!cm.length) throw this.err(e, "cannot find symbol\n  symbol:   method " + name + "(" + ats.join(",") + ")\n  location: class " + on, "La classe " + on + " n'a pas de méthode " + name + ".");
        var mm = this.pickMethod(cm, ats, e.args);
        if (!mm) throw this.err(e, "method " + name + " in class " + on + " cannot be applied to given types;", "Les valeurs passées ne correspondent pas aux paramètres de " + name + ".");
        if (!mm.mods.static) throw this.err(e, "non-static method " + this.sig(mm) + " cannot be referenced from a static context", "La méthode " + name + " n'est pas static : appelle-la sur un objet (objet." + name + "(…)), pas sur le nom de la classe.");
        if (mm.mods["private"] && mm.cls !== ctx.cls) throw this.err(e, this.sig(mm) + " has private access in " + mm.cls, "Cette méthode est private dans " + mm.cls + ".");
        e.obj.isClass = true; e.m = mm;
        (mm.throws || []).forEach(function (t) { self.checkThrown(e, t, ctx); });
        return mm.ret;
      }
      if (on === "system") throw this.err(e.obj, "package system does not exist", "Java est sensible à la casse : on écrit System avec un S majuscule.");
      if (/^[A-Z]/.test(on)) throw this.err(e.obj, "cannot find symbol\n  symbol:   variable " + on + "\n  location: class " + ctx.cls, "Java ne connaît pas « " + on + " ». Vérifie l'orthographe et l'import éventuel.");
    }
    var ot = this.expr(e.obj, ctx);
    ats = this.argTypes(e.args, ctx);
    if (/^PrintStream:/.test(ot)) return this.printCall(e, ats);
    if (ot === "void") throw this.err(e, "void cannot be dereferenced", "La méthode précédente ne renvoie rien : on ne peut pas enchaîner un appel dessus.");
    if (isPrim(ot)) throw this.err(e, ot + " cannot be dereferenced", "Une valeur de type " + ot + " n'est pas un objet : elle n'a pas de méthodes. " + (name === "equals" ? "Pour comparer deux nombres ou caractères, utilise ==." : name === "length" ? "La longueur se calcule sur un String ou un tableau." : ""));
    var r = this.instanceBuiltin(ot, name, ats, e, ctx);
    if (r) return r;
    var oc = this.classOf(ot);
    if (oc) {
      var cms = this.methodsOf(ot, name);
      if (!cms.length) {
        if (/^(toString|equals|hashCode|getClass)$/.test(name)) return this.objectMethod(e, name, ats);
        if (EXC_PARENT[this.rootBuiltin(ot)] && /^(getMessage|printStackTrace)$/.test(name)) { e.excMethod = true; return name === "getMessage" ? "String" : "void"; }
        var near = oc.fields.some(function (f) { return f.name === name; }) ? " " + name + " est un attribut, pas une méthode." : "";
        throw this.err(e, "cannot find symbol\n  symbol:   method " + name + "(" + ats.join(",") + ")\n  location: variable of type " + ot, "La classe " + ot + " n'a pas de méthode " + name + "." + near + " Vérifie son nom (majuscules comprises).");
      }
      var pm = this.pickMethod(cms, ats, e.args);
      if (!pm) throw this.err(e, "method " + name + " in class " + cms[0].cls + " cannot be applied to given types;\n  required: " + (cms[0].params.map(function (p) { return p.type; }).join(",") || "no arguments") + "\n  found:    " + (ats.join(",") || "no arguments"),
        "La méthode " + name + " attend " + (cms[0].params.length ? cms[0].params.map(function (p) { return p.type + " " + p.name; }).join(", ") : "aucun paramètre") + ".");
      if (pm.mods["private"] && pm.cls !== ctx.cls) throw this.err(e, this.sig(pm) + " has private access in " + pm.cls, "Cette méthode est private dans " + pm.cls + " : elle n'est utilisable qu'à l'intérieur de cette classe.");
      e.m = pm; e.virtual = !pm.mods.static;
      (pm.throws || []).forEach(function (t) { self.checkThrown(e, t, ctx); });
      return pm.ret;
    }
    if (EXC_PARENT[ot]) {
      if (name === "getMessage") { e.excMethod = true; return "String"; }
      if (name === "printStackTrace") { e.excMethod = true; return "void"; }
      if (/^(toString|equals|hashCode|getClass)$/.test(name)) return this.objectMethod(e, name, ats);
    }
    if (ot === "Object" || ot === "class") { if (/^(toString|equals|hashCode|getClass)$/.test(name)) return this.objectMethod(e, name, ats); }
    throw this.err(e, "cannot find symbol\n  symbol:   method " + name + "(" + ats.join(",") + ")\n  location: " + ot, "La méthode « " + name + " » n'existe pas pour une valeur de type " + ot + ".");
  };
  CK.rootBuiltin = function (t) { var g = 0; while (this.classOf(t) && g++ < 50) t = this.classOf(t).sup || "Object"; return t; };
  CK.objectMethod = function (e, name, ats) {
    e.objMethod = true;
    if (name === "toString") return "String";
    if (name === "equals") { if (ats.length !== 1) throw this.err(e, "method equals cannot be applied to given types;", "equals attend un seul argument."); return "boolean"; }
    if (name === "hashCode") return "int";
    if (name === "getClass") return "Class";
  };
  CK.printCall = function (e, ats) {
    var name = e.name;
    e.print = true;
    if (name === "println") { if (ats.length > 1) throw this.err(e, "no suitable method found for println(" + ats.join(",") + ")", "println n'accepte qu'une seule valeur. Pour assembler plusieurs morceaux, utilise + : \"Prix : \" + prix"); if (ats[0] === "void") throw this.err(e.args[0], "'void' type not allowed here", "Cette méthode ne renvoie rien (void) : il n'y a rien à afficher."); return "void"; }
    if (name === "print") { if (ats.length !== 1) throw this.err(e, "no suitable method found for print(" + (ats.join(",") || "no arguments") + ")", ats.length ? "print n'accepte qu'une seule valeur. Utilise + pour assembler." : "print() a besoin de quelque chose à afficher. Pour seulement passer à la ligne, utilise println()."); if (ats[0] === "void") throw this.err(e.args[0], "'void' type not allowed here", "Cette méthode ne renvoie rien (void) : il n'y a rien à afficher."); return "void"; }
    if (name === "printf" || name === "format") { if (!ats.length || ats[0] !== "String") throw this.err(e, "no suitable method found for printf", "printf attend d'abord un texte de format, par exemple : printf(\"%.2f%n\", prix)"); return "void"; }
    var low = name.toLowerCase();
    throw this.err(e.nameTok || e, "cannot find symbol\n  symbol:   method " + name + "(" + ats.join(",") + ")\n  location: variable out of type PrintStream",
      low === "println" || low === "print" ? "Attention à la casse : println et print s'écrivent tout en minuscules." : "La méthode « " + name + " » n'existe pas. Tu voulais sans doute écrire println ou print.");
  };
  CK.need = function (e, ats, list, label) {
    var self = this;
    for (var i = 0; i < list.length; i++) {
      var sig = list[i];
      if (sig.length === ats.length && sig.every(function (p, k) { return p === "*" || self.assignable(p, ats[k], e.args[k] && e.args[k].k === "lit" ? e.args[k].v : null); })) return i;
    }
    var same = list.filter(function (sg) { return sg.length === ats.length; });
    if (same.length === 1) for (var k2 = 0; k2 < ats.length; k2++) if (same[0][k2] !== "*" && !self.assignable(same[0][k2], ats[k2])) self.conv(e.args[k2], same[0][k2], ats[k2]);
    throw this.err(e, "method " + e.name + " cannot be applied to given types;\n  found:    " + (ats.join(",") || "no arguments"), label || ("Les arguments donnés à " + e.name + " ne conviennent pas."));
  };
  CK.staticBuiltin = function (cls, name, ats, e) {
    var self = this;
    if (cls === "Arrays" && !this.imported("Arrays")) throw this.err(e.obj, "cannot find symbol\n  symbol:   variable Arrays", "Java ne connaît pas Arrays : ajoute import java.util.Arrays; en tout début de fichier.");
    e.sb = cls + "." + name;
    switch (cls) {
      case "Math":
        if (name === "sqrt" || name === "floor" || name === "ceil" || name === "cbrt" || name === "log" || name === "log10" || name === "exp") { this.need(e, ats, [["double"]]); return "double"; }
        if (name === "pow" || name === "hypot") { this.need(e, ats, [["double", "double"]]); return "double"; }
        if (name === "abs") { this.need(e, ats, [["double"]]); return promote(ats[0], "int"); }
        if (name === "max" || name === "min") { this.need(e, ats, [["double", "double"]]); return promote(ats[0], ats[1]); }
        if (name === "round") { this.need(e, ats, [["double"]]); return "long"; }
        if (name === "random") { this.need(e, ats, [[]]); return "double"; }
        break;
      case "Integer":
        if (name === "parseInt") { this.need(e, ats, [["String"]], "Integer.parseInt attend un texte (String)."); return "int"; }
        if (name === "valueOf") { this.need(e, ats, [["String"], ["int"]]); return "Integer"; }
        if (name === "toString") { this.need(e, ats, [["int"]]); return "String"; }
        if (name === "max" || name === "min" || name === "sum") { this.need(e, ats, [["int", "int"]]); return "int"; }
        break;
      case "Double":
        if (name === "parseDouble") { this.need(e, ats, [["String"]], "Double.parseDouble attend un texte (String)."); return "double"; }
        if (name === "valueOf") { this.need(e, ats, [["String"], ["double"]]); return "Double"; }
        if (name === "toString") { this.need(e, ats, [["double"]]); return "String"; }
        if (name === "compare") { this.need(e, ats, [["double", "double"]]); return "int"; }
        break;
      case "String":
        if (name === "valueOf") { if (ats.length !== 1) this.need(e, ats, [["*"]]); return "String"; }
        if (name === "format") { if (!ats.length || ats[0] !== "String") throw this.err(e, "no suitable method found for format", "String.format attend d'abord un texte de format."); return "String"; }
        if (name === "join") { return "String"; }
        break;
      case "Character":
        if (/^(isDigit|isLetter|isLetterOrDigit|isUpperCase|isLowerCase|isWhitespace)$/.test(name)) { this.need(e, ats, [["char"]]); return "boolean"; }
        if (name === "toUpperCase" || name === "toLowerCase") { this.need(e, ats, [["char"]]); return "char"; }
        if (name === "getNumericValue") { this.need(e, ats, [["char"]]); return "int"; }
        break;
      case "Arrays":
        if (name === "toString") { if (ats.length !== 1 || !isArr(ats[0])) throw this.err(e, "no suitable method found for toString", "Arrays.toString attend un tableau."); return "String"; }
        if (name === "sort") { if (ats.length !== 1 || !isArr(ats[0])) throw this.err(e, "no suitable method found for sort", "Arrays.sort attend un tableau."); return "void"; }
        if (name === "fill") { if (ats.length !== 2 || !isArr(ats[0])) throw this.err(e, "no suitable method found for fill", "Arrays.fill(tableau, valeur)."); return "void"; }
        break;
      case "System":
        if (name === "exit") { this.need(e, ats, [["int"]]); return "void"; }
        if (name === "currentTimeMillis") return "long";
        break;
      case "List":
        if (name === "of") throw new Unsup(e.line, "List.of n'est pas géré par le simulateur : crée une ArrayList et ajoute les éléments avec add.");
        break;
      default: return null;
    }
    if (/^(Math|Integer|Double|String|Character|Arrays|System)$/.test(cls)) throw this.err(e, "cannot find symbol\n  symbol:   method " + name + "(" + ats.join(",") + ")\n  location: class " + cls, "La classe " + cls + " n'a pas de méthode « " + name + " » (ou elle n'est pas gérée par le simulateur).");
    return null;
  };
  CK.instanceBuiltin = function (ot, name, ats, e) {
    var self = this;
    if (ot === "String") {
      e.sm = name;
      var S = {
        length: [[[], "int"]], charAt: [[["int"], "char"]], equals: [[["Object"], "boolean"]], equalsIgnoreCase: [[["String"], "boolean"]],
        contains: [[["String"], "boolean"]], indexOf: [[["String"], "int"], [["char"], "int"], [["String", "int"], "int"]], lastIndexOf: [[["String"], "int"], [["char"], "int"]],
        substring: [[["int"], "String"], [["int", "int"], "String"]], toUpperCase: [[[], "String"]], toLowerCase: [[[], "String"]], trim: [[[], "String"]], strip: [[[], "String"]],
        isEmpty: [[[], "boolean"]], isBlank: [[[], "boolean"]], startsWith: [[["String"], "boolean"]], endsWith: [[["String"], "boolean"]],
        replace: [[["String", "String"], "String"], [["char", "char"], "String"]], split: [[["String"], "String[]"]], compareTo: [[["String"], "int"]],
        compareToIgnoreCase: [[["String"], "int"]], concat: [[["String"], "String"]], repeat: [[["int"], "String"]], toString: [[[], "String"]], hashCode: [[[], "int"]], toCharArray: [[[], "char[]"]]
      };
      if (!S[name]) {
        var hint = name === "size" || name === "length" ? "" : name === "lenght" ? " Faute de frappe : c'est length()." : name.toLowerCase() === "equals" ? " Attention à la casse : equals." : "";
        throw this.err(e.nameTok || e, "cannot find symbol\n  symbol:   method " + name + "(" + ats.join(",") + ")\n  location: class String", "La classe String n'a pas de méthode « " + name + " »." + hint + (name === "size" ? " Pour la longueur d'un texte : length()." : ""));
      }
      for (var i = 0; i < S[name].length; i++) {
        var sg = S[name][i];
        if (sg[0].length === ats.length && sg[0].every(function (p, k) { return self.assignable(p, ats[k]); })) { if (name === "replace" && ats[0] === "char") e.charReplace = true; return sg[1]; }
      }
      throw this.err(e, "method " + name + " in class String cannot be applied to given types;\n  found:    " + (ats.join(",") || "no arguments"), "Les arguments de " + name + " ne conviennent pas. Exemple correct : " + ({ charAt: "s.charAt(0)", substring: "s.substring(0, 3)", equals: "s.equals(\"OK\")", contains: "s.contains(\"PC\")", indexOf: "s.indexOf(\"-\")", split: "s.split(\";\")" }[name] || "s." + name + "(…)"));
    }
    if (isList(ot)) {
      var el = listElem(ot); e.lm = name;
      switch (name) {
        case "add": if (ats.length === 1) { this.conv(e.args[0], el, ats[0]); return "boolean"; } if (ats.length === 2) { this.conv(e.args[0], "int", ats[0]); this.conv(e.args[1], el, ats[1]); return "void"; } break;
        case "get": if (ats.length === 1) { this.conv(e.args[0], "int", ats[0]); return el; } break;
        case "set": if (ats.length === 2) { this.conv(e.args[0], "int", ats[0]); this.conv(e.args[1], el, ats[1]); return el; } break;
        case "remove": if (ats.length === 1) { if (unbox(ats[0]) === "int" && ats[0] === "int") { e.removeIndex = true; return el; } if (ats[0] === "int" || ats[0] === "char" || ats[0] === "short") { e.removeIndex = true; return el; } return "boolean"; } break;
        case "size": if (!ats.length) return "int"; break;
        case "isEmpty": if (!ats.length) return "boolean"; break;
        case "clear": if (!ats.length) return "void"; break;
        case "contains": if (ats.length === 1) return "boolean"; break;
        case "indexOf": if (ats.length === 1) return "int"; break;
        case "toString": if (!ats.length) return "String"; break;
        case "addAll": if (ats.length === 1 && isList(ats[0])) return "boolean"; break;
        case "length": throw this.err(e.nameTok || e, "cannot find symbol\n  symbol:   method length()\n  location: variable of type " + ot, "Pour connaître le nombre d'éléments d'une ArrayList : liste.size().");
        default: throw this.err(e.nameTok || e, "cannot find symbol\n  symbol:   method " + name + "(" + ats.join(",") + ")\n  location: variable of type " + ot, "Méthodes utiles d'une ArrayList : add, get, set, remove, size, isEmpty, contains, indexOf, clear.");
      }
      throw this.err(e, "no suitable method found for " + name + "(" + ats.join(",") + ")", "Les arguments donnés à " + name + " ne conviennent pas pour une ArrayList<" + el + ">.");
    }
    if (ot === "Scanner") {
      e.scm = name;
      var M = { nextInt: "int", nextDouble: "double", nextLine: "String", next: "String", nextBoolean: "boolean", nextLong: "long", hasNextInt: "boolean", hasNextDouble: "boolean", hasNext: "boolean", hasNextLine: "boolean", close: "void" };
      if (!M[name]) {
        var h2 = /^next(String|Char|Text)$/.test(name) ? " Pour lire un mot : next() ; une ligne entière : nextLine() ; un caractère : next().charAt(0)." : /^nextint$/i.test(name) ? " Attention à la casse : nextInt." : "";
        throw this.err(e.nameTok || e, "cannot find symbol\n  symbol:   method " + name + "(" + ats.join(",") + ")\n  location: variable of type Scanner", "Le Scanner n'a pas de méthode « " + name + " »." + h2);
      }
      if (ats.length) throw this.err(e, "method " + name + " in class Scanner cannot be applied to given types;", name + "() s'écrit sans argument.");
      return M[name];
    }
    if (ot === "Class") { e.clsm = name; if (name === "getSimpleName" || name === "getName") return "String"; }
    if (isArr(ot)) {
      if (name === "length") throw this.err(e.nameTok || e, "cannot find symbol\n  symbol:   method length()\n  location: class " + ot, "Pour un tableau, length s'écrit sans parenthèses : t.length");
      if (name === "clone") { e.arrClone = true; return ot; }
      if (/^(toString|equals|hashCode|getClass)$/.test(name)) return this.objectMethod(e, name, ats);
      throw this.err(e.nameTok || e, "cannot find symbol\n  symbol:   method " + name + "(" + ats.join(",") + ")\n  location: class " + ot, "Un tableau n'a pas de méthode « " + name + " ». Sa taille : t.length. Pour l'afficher : Arrays.toString(t).");
    }
    if (BOX[ot]) {
      e.boxm = name;
      if (name === "equals") return "boolean"; if (name === "toString") return "String"; if (name === "intValue") return "int"; if (name === "doubleValue") return "double"; if (name === "compareTo") return "int";
    }
    return null;
  };

  /* ======================= Valeurs ======================= */
  var nextId = 1;
  function V(t, v) { return { t: t, v: v }; }
  var NULL = { t: "null", v: null };
  function jstr(s) { return { t: "String", v: s, id: nextId++ }; }
  var internPool = {};
  function lit(s) { if (!internPool[s]) internPool[s] = { t: "String", v: s, id: nextId++ }; return internPool[s]; }
  function fmtDouble(x) {
    if (isNaN(x)) return "NaN";
    if (x === Infinity) return "Infinity"; if (x === -Infinity) return "-Infinity";
    if (x === 0) return (1 / x < 0) ? "-0.0" : "0.0";
    var ax = Math.abs(x);
    if (ax >= 1e-3 && ax < 1e7) { var s = String(x); if (s.indexOf("e") >= 0) s = x.toFixed(20).replace(/0+$/, ""); return s.indexOf(".") < 0 ? s + ".0" : s; }
    var ex = x.toExponential();
    var m = ex.split("e"), mant = m[0], ee = parseInt(m[1], 10);
    if (mant.indexOf(".") < 0) mant += ".0";
    return mant + "E" + ee;
  }
  function hashHex(id) { return ((id * 2654435761) >>> 0).toString(16); }

  /* ======================= Interpréteur ======================= */
  function Interp(prog, opts) {
    this.prog = prog; this.opts = opts || {};
    this.out = ""; this.display = []; this.err = "";
    this.input = (opts && opts.input) || ""; this.ip = 0; this.echoed = 0;
    this.statics = E(); this.steps = []; this.count = 0;
    this.maxSteps = (opts && opts.maxSteps) || 5000000; this.trace = !!(opts && opts.trace); this.maxTrace = (opts && opts.maxTrace) || 3000;
    this.stack = []; this.frames = [];
    nextId = 1000; internPool = {};
  }
  var IP = Interp.prototype;
  IP.write = function (s, kind) {
    if (!s) return;
    if (this.out.length > 200000) throw new StopSig("Exécution interrompue : le programme a affiché plus de 200 000 caractères. Il tourne sans doute dans une boucle infinie : vérifie que la condition de ta boucle finit par devenir fausse.");
    if (kind !== "in") this.out += s;
    var last = this.display[this.display.length - 1];
    if (last && last.k === (kind || "out")) last.s += s; else this.display.push({ k: kind || "out", s: s });
  };
  IP.throwJ = function (cls, msg, line) {
    var ex = { t: "obj", cls: cls, fields: { message: msg == null ? NULL : jstr(msg) }, id: nextId++, builtinExc: true };
    ex.trace = this.stackTrace(line);
    throw new JThrow(ex);
  };
  IP.stackTrace = function (line) {
    var fr = this.frames.slice().reverse();
    var file = this.prog.file;
    return fr.map(function (f, i) { return "\tat " + f.cls + "." + f.name + "(" + file + ":" + (i === 0 && line ? line : f.line) + ")"; });
  };
  IP.excName = function (cls) { return EXC_PARENT[cls] ? (EXC_PKG[cls] || "java.lang") + "." + cls : cls; };
  IP.excString = function (ex) {
    var msg = ex.fields.message;
    var custom = this.findMethod(ex.cls, "toString", 0);
    if (custom) return this.str(this.invoke(custom, ex, []));
    return this.excName(ex.cls) + (msg && msg.t !== "null" ? ": " + msg.v : "");
  };
  IP.tick = function (line) {
    if (++this.count > this.maxSteps) throw new StopSig("Exécution interrompue après " + this.maxSteps.toLocaleString("fr-FR") + " instructions : le programme tourne sans fin (boucle infinie ?). Vérifie que la condition de ta boucle finit par devenir fausse.");
    if (this.frames.length) this.frames[this.frames.length - 1].line = line;
  };
  IP.snap = function (line, env) {
    if (!this.trace || this.steps.length >= this.maxTrace) return;
    var vars = [], self = this, pos = E();
    for (var i = 0; i < env.scopes.length; i++) {
      var sc = env.scopes[i];
      Object.keys(sc).forEach(function (k) {
        var row = [k, sc[k].type, self.show(sc[k].val)];
        if (pos[k] !== undefined) vars[pos[k]] = row; else { pos[k] = vars.length; vars.push(row); }
      });
    }
    if (env.self) vars.unshift(["this", env.self.cls, this.show(env.self, 1)]);
    var f = this.frames[this.frames.length - 1];
    this.steps.push({ line: line, method: f ? f.cls + "." + f.name : "", depth: this.frames.length, vars: vars, display: JSON.parse(JSON.stringify(this.display)) });
  };
  IP.show = function (v, deep) {
    if (!v) return "?";
    switch (v.t) {
      case "String": return JSON.stringify(v.v);
      case "char": return "'" + String.fromCharCode(v.v) + "'";
      case "null": return "null";
      case "double": return fmtDouble(v.v);
      case "array": return "[" + v.a.slice(0, 12).map(function (x) { return this.show(x, 1); }, this).join(", ") + (v.a.length > 12 ? ", …" : "") + "]";
      case "list": return "[" + v.a.slice(0, 10).map(function (x) { return this.show(x, 1); }, this).join(", ") + (v.a.length > 10 ? ", …" : "") + "]";
      case "obj":
        if (v.builtinExc) return v.cls;
        if (deep > 1) return v.cls + "@…";
        var f = v.fields, self = this;
        return v.cls + "{" + Object.keys(f).map(function (k) { return k + "=" + self.show(f[k], (deep || 0) + 1); }).join(", ") + "}";
      case "scanner": return "Scanner";
      default: return String(v.v);
    }
  };
  // conversion en texte (String.valueOf)
  IP.str = function (v) {
    switch (v.t) {
      case "String": return v.v;
      case "char": return String.fromCharCode(v.v);
      case "null": return "null";
      case "double": return fmtDouble(v.v);
      case "boolean": return v.v ? "true" : "false";
      case "int": case "long": return String(v.v);
      case "array": return ({ "int": "[I", "double": "[D", "char": "[C", "boolean": "[Z", "long": "[J" }[v.et] || "[L" + v.et + ";") + "@" + hashHex(v.id);
      case "list": var self = this; return "[" + v.a.map(function (x) { return self.str(x); }).join(", ") + "]";
      case "obj":
        if ((v.builtinExc || EXC_PARENT[this.rootClass(v.cls)]) && !this.findMethod(v.cls, "toString", 0)) return this.excName(v.cls) + (v.fields.message && v.fields.message.t !== "null" ? ": " + v.fields.message.v : "");
        var m = this.findMethod(v.cls, "toString", 0);
        if (m) return this.str(this.invoke(m, v, []));
        return v.cls + "@" + hashHex(v.id);
      case "scanner": return "java.util.Scanner[delimiters=\\p{javaWhitespace}+]";
      case "classref": return "class " + v.cls;
    }
    return String(v.v);
  };
  IP.rootClass = function (c) { var g = 0; while (this.prog.classes[c] && g++ < 50) c = this.prog.classes[c].sup || "Object"; return c; };
  IP.isInstance = function (v, type) {
    if (v.t === "null") return false;
    var cls = v.t === "obj" ? v.cls : v.t === "String" ? "String" : v.t === "list" ? "ArrayList" : v.t;
    if (type === "Object") return true;
    if (/^(ArrayList|List)/.test(type)) return v.t === "list";
    var g = 0;
    while (cls && g++ < 60) {
      if (cls === type) return true;
      cls = this.prog.classes[cls] ? (this.prog.classes[cls].sup || "Object") : (EXC_PARENT[cls] || null);
    }
    return false;
  };
  IP.findMethod = function (cls, name, argc, from) {
    var g = 0;
    while (cls && g++ < 60) {
      var c = this.prog.classes[cls];
      if (!c) return null;
      for (var i = 0; i < c.methods.length; i++) { var m = c.methods[i]; if (m.name === name && m.params.length === argc && m.body) return m; }
      cls = c.sup;
    }
    return null;
  };
  IP.findOverride = function (cls, m) {
    var g = 0, self = this;
    while (cls && g++ < 60) {
      var c = this.prog.classes[cls];
      if (!c) return m;
      for (var i = 0; i < c.methods.length; i++) {
        var x = c.methods[i];
        if (x.name === m.name && x.params.length === m.params.length && x.params.every(function (p, k) { return p.type === m.params[k].type; }) && x.body) return x;
      }
      cls = c.sup;
    }
    return m;
  };
  IP.defaultVal = function (t) {
    switch (t) { case "int": case "short": case "byte": return V("int", 0); case "long": return V("long", 0); case "double": case "float": return V("double", 0); case "char": return V("char", 0); case "boolean": return V("boolean", false); }
    return NULL;
  };
  // conversion d'affectation (élargissement / unboxing)
  IP.coerce = function (v, t) {
    if (!t || t === "var" || v.t === "null") return v;
    var u = unbox(t);
    if (u === "double" || u === "float") { if (v.t === "double") return v; if (v.t === "int" || v.t === "long" || v.t === "char") return V("double", v.v); }
    if (u === "long") { if (v.t === "int" || v.t === "char") return V("long", v.v); }
    if (u === "int" || u === "short" || u === "byte") { if (v.t === "char") return V("int", v.v); }
    if (u === "char" && v.t === "int") return V("char", v.v & 0xFFFF);
    return v;
  };
  IP.castTo = function (v, t) {
    var u = unbox(t);
    if (!isPrim(u)) {
      if (v.t === "null" || t === "Object" || t === "String" || this.isInstance(v, t)) return v;
      this.throwJ("ClassCastException", "class " + (v.cls || v.t) + " cannot be cast to class " + t, this.curLine);
    }
    var x = v.t === "char" ? v.v : v.v;
    if (u === "int" || u === "short" || u === "byte") {
      var r;
      if (v.t === "double") { if (isNaN(x)) r = 0; else if (x >= 2147483647) r = 2147483647; else if (x <= -2147483648) r = -2147483648; else r = Math.trunc(x); }
      else r = x | 0;
      if (u === "short") r = (r << 16) >> 16; if (u === "byte") r = (r << 24) >> 24;
      return V("int", r);
    }
    if (u === "long") return V("long", v.t === "double" ? Math.trunc(x) : x);
    if (u === "double" || u === "float") return V("double", x);
    if (u === "char") return V("char", (v.t === "double" ? Math.trunc(x) : x) & 0xFFFF);
    if (u === "boolean") return v;
    return v;
  };
  IP.num = function (v) { return v.v; };

  IP.run = function (entry) {
    var P = this.prog, self = this;
    var mainCls = null;
    var base = P.file.replace(/\.java$/, "");
    var cands = [base].concat(P.order);
    for (var i = 0; i < cands.length; i++) {
      var c = P.classes[cands[i]];
      if (!c) continue;
      var m = c.methods.filter(function (x) { return x.name === "main"; })[0];
      if (m) { mainCls = c; break; }
      if (cands[i] === base) break;
    }
    var target = P.classes[base] || P.classes[P.order[0]];
    if (!mainCls || mainCls !== target) mainCls = target;
    var mm = mainCls.methods.filter(function (x) { return x.name === "main"; });
    var main = mm.filter(function (x) { return x.mods.static && x.mods["public"] && x.ret === "void" && x.params.length === 1 && x.params[0].type === "String[]"; })[0];
    if (!main) {
      var cand = mm[0], why;
      if (cand && !cand.mods.static && cand.ret === "void") {
        return { runtimeErr: "Error: Main method is not static in class " + mainCls.name + ", please define the main method as:\n   public static void main(String[] args)",
          fr: "Il manque le mot static dans l'en-tête de main.", line: cand.line };
      }
      var near = mainCls.methods.filter(function (x) { return x.name.toLowerCase() === "main"; })[0];
      why = near && near.name !== "main" ? "La méthode s'appelle « " + near.name + " » : Java exige main, en minuscules." : cand ? "L'en-tête de main doit être exactement : public static void main(String[] args)." : "La classe " + mainCls.name + " ne contient pas de méthode main.";
      return { runtimeErr: "Error: Main method not found in class " + mainCls.name + ", please define the main method as:\n   public static void main(String[] args)\nor a JavaFX application class must extend javafx.application.Application",
        fr: "La compilation réussit, mais la JVM ne trouve pas le point d'entrée. " + why, line: near ? near.line : mainCls.line };
    }
    // initialisation des attributs statiques
    try {
      P.order.forEach(function (cn) {
        P.classes[cn].fields.forEach(function (f) {
          if (!f.mods.static) return;
          self.statics[cn + "." + f.name] = f.init ? self.coerce(self.evalInit(f.init, f.type, { scopes: [E()], self: null, cls: cn }), f.type) : self.defaultVal(f.type);
        });
      });
      this.frames.push({ cls: mainCls.name, name: "main", line: main.line });
      this.execBody(main, null, [{ t: "array", et: "String", a: [], id: nextId++ }]);
      this.frames.pop();
      return { ok: true };
    } catch (e) {
      if (e instanceof ExitSig) return { ok: true, exit: e.code };
      if (e instanceof StopSig) return { stopped: e.fr };
      if (e instanceof JThrow) {
        var ex = e.exc;
        var txt = "Exception in thread \"main\" " + this.excString(ex) + "\n" + (ex.trace || []).join("\n");
        return { uncaught: txt, exc: ex.cls, line: this.curLine };
      }
      if (e instanceof RangeError) return { uncaught: "Exception in thread \"main\" java.lang.StackOverflowError", exc: "StackOverflowError", line: this.curLine };
      throw e;
    }
  };
  IP.evalInit = function (init, type, env) {
    if (init.k === "arrinit") return this.arrInit(init, type, env);
    return this.ev(init, env);
  };
  IP.execBody = function (m, self, args) {
    var sc = E();
    m.params.forEach(function (p, i) { sc[p.name] = { type: p.type, val: args[i] }; });
    var env = { scopes: [sc], self: self, cls: m.cls, method: m };
    if (this.frames.length > 2500) throw new RangeError("stack");
    try { this.block(m.body, env, true); }
    catch (r) { if (r instanceof RetSig) return r.v; throw r; }
    return null;
  };
  IP.invoke = function (m, self, args) {
    this.frames.push({ cls: m.cls, name: m.name, line: m.line });
    var conv = this, a2 = args.map(function (v, i) { return conv.coerce(v, m.params[i].type); });
    try { var r = this.execBody(m, self, a2); return r === null ? null : this.coerce(r, m.ret); }
    finally { this.frames.pop(); }
  };
  IP.lookup = function (env, name) {
    for (var i = env.scopes.length - 1; i >= 0; i--) if (env.scopes[i][name]) return env.scopes[i][name];
    return null;
  };
  IP.block = function (b, env, noScope) {
    if (!noScope) env.scopes.push(E());
    try { for (var i = 0; i < b.body.length; i++) this.exec(b.body[i], env); }
    finally { if (!noScope) env.scopes.pop(); }
  };
  IP.exec = function (s, env) {
    var self = this;
    if (s.k !== "block" && s.k !== "empty") { this.curLine = s.line; this.tick(s.line); this.snap(s.line, env); }
    switch (s.k) {
      case "empty": return;
      case "block": return this.block(s, env);
      case "local":
        s.decls.forEach(function (d) {
          var t = d.rtype || d.type;
          var val = d.init ? self.coerce(self.evalInit(d.init, t, env), t) : undefined;
          env.scopes[env.scopes.length - 1][d.name] = { type: t, val: val === undefined ? self.defaultVal(t) : val };
        });
        return;
      case "expr": this.ev(s.e, env); return;
      case "if":
        if (this.ev(s.cond, env).v) { env.scopes.push(E()); try { this.exec(s.then, env); } finally { env.scopes.pop(); } }
        else if (s.els) { env.scopes.push(E()); try { this.exec(s.els, env); } finally { env.scopes.pop(); } }
        return;
      case "while":
        for (;;) {
          this.curLine = s.line; this.tick(s.line);
          if (!this.ev(s.cond, env).v) break;
          try { env.scopes.push(E()); this.exec(s.body, env); }
          catch (x) { if (x instanceof BreakSig) break; if (!(x instanceof ContSig)) throw x; }
          finally { env.scopes.pop(); }
          this.snap(s.line, env);
        }
        return;
      case "do":
        for (;;) {
          try { env.scopes.push(E()); this.exec(s.body, env); }
          catch (x) { if (x instanceof BreakSig) break; if (!(x instanceof ContSig)) throw x; }
          finally { env.scopes.pop(); }
          this.curLine = s.cond.line; this.tick(s.cond.line); this.snap(s.cond.line, env);
          if (!this.ev(s.cond, env).v) break;
        }
        return;
      case "for":
        env.scopes.push(E());
        try {
          s.init.forEach(function (x) { if (x.k === "local") { x.decls.forEach(function (d) { var t = d.rtype || d.type; env.scopes[env.scopes.length - 1][d.name] = { type: t, val: d.init ? self.coerce(self.evalInit(d.init, t, env), t) : self.defaultVal(t) }; }); } else self.ev(x.e, env); });
          for (;;) {
            this.curLine = s.line; this.tick(s.line);
            if (s.cond && !this.ev(s.cond, env).v) break;
            try { env.scopes.push(E()); this.exec(s.body, env); }
            catch (x) { if (x instanceof BreakSig) break; if (!(x instanceof ContSig)) throw x; }
            finally { env.scopes.pop(); }
            this.curLine = s.line;
            s.upd.forEach(function (u) { self.ev(u, env); });
            this.snap(s.line, env);
          }
        } finally { env.scopes.pop(); }
        return;
      case "foreach": {
        var coll = this.ev(s.iter, env);
        if (coll.t === "null") this.throwJ("NullPointerException", null, s.line);
        var items = coll.a.slice();
        var t = s.type === "var" ? null : s.type;
        for (var i = 0; i < items.length; i++) {
          if (coll.t === "list" && coll.a.length !== items.length) this.throwJ("ConcurrentModificationException", null, s.line);
          env.scopes.push(E()); env.scopes[env.scopes.length - 1][s.name] = { type: t || "?", val: t ? this.coerce(items[i], t) : items[i] };
          try { this.exec(s.body, env); }
          catch (x) { if (x instanceof BreakSig) { env.scopes.pop(); break; } if (!(x instanceof ContSig)) { env.scopes.pop(); throw x; } }
          env.scopes.pop();
          if (i < items.length - 1) this.snap(s.line, env);
        }
        return;
      }
      case "switch": {
        var sv = this.ev(s.sel, env);
        if (sv.t === "null") this.throwJ("NullPointerException", null, s.line);
        var idx = -1, defIdx = -1;
        for (var ci = 0; ci < s.cases.length && idx < 0; ci++) {
          var c = s.cases[ci];
          if (c.def) defIdx = ci;
          for (var li = 0; li < c.labels.length; li++) {
            var lv = this.ev(c.labels[li], env);
            if (sv.t === "String" ? lv.v === sv.v : lv.v === sv.v) { idx = ci; break; }
          }
        }
        if (idx < 0) idx = defIdx;
        if (idx < 0) return;
        env.scopes.push(E());
        try {
          if (s.arrow) { this.block({ body: s.cases[idx].body }, env, true); }
          else for (var k = idx; k < s.cases.length; k++) this.block({ body: s.cases[k].body }, env, true);
        } catch (x) { if (!(x instanceof BreakSig)) throw x; }
        finally { env.scopes.pop(); }
        return;
      }
      case "yield": throw new YieldSig(this.ev(s.e, env));
      case "break": throw new BreakSig();
      case "continue": throw new ContSig();
      case "return": throw new RetSig(s.e ? this.ev(s.e, env) : null);
      case "throw": {
        var ex = this.ev(s.e, env);
        if (ex.t === "null") this.throwJ("NullPointerException", null, s.line);
        if (!ex.trace) ex.trace = this.stackTrace(s.line);
        throw new JThrow(ex);
      }
      case "try": {
        var pending = null;
        env.scopes.push(E());
        try {
          s.res.forEach(function (r) { self.exec(r, env); });
          this.block(s.body, env);
        } catch (x) {
          if (x instanceof JThrow) {
            var handled = false;
            for (var q = 0; q < s.catches.length && !handled; q++) {
              var cc = s.catches[q];
              if (cc.types.some(function (ty) { return self.isInstance(x.exc, ty); })) {
                handled = true;
                env.scopes.push(E()); env.scopes[env.scopes.length - 1][cc.name] = { type: cc.types[0], val: x.exc };
                try { this.block(cc.body, env, true); }
                catch (y) { pending = y; }
                finally { env.scopes.pop(); }
              }
            }
            if (!handled) pending = x;
          } else pending = x;
        } finally { env.scopes.pop(); }
        if (s.fin) this.block(s.fin, env);
        if (pending) throw pending;
        return;
      }
    }
  };
  IP.arrInit = function (n, type, env) {
    var self = this, et = elemOf(type);
    return { t: "array", et: et, id: nextId++, a: n.els.map(function (x) { return self.coerce(x.k === "arrinit" ? self.arrInit(x, et, env) : self.ev(x, env), et); }) };
  };
  IP.newArr = function (et, dims, i) {
    var n = dims[i];
    if (n < 0) this.throwJ("NegativeArraySizeException", String(n), this.curLine);
    var sub = et + new Array(dims.length - i).join("[]");
    var a = [];
    for (var k = 0; k < n; k++) a.push(i + 1 < dims.length ? this.newArr(et, dims, i + 1) : this.defaultVal(et));
    return { t: "array", et: sub, id: nextId++, a: a };
  };
  // ---- lvalues ----
  IP.ref = function (e, env) {
    var self = this;
    if (e.k === "paren") return this.ref(e.e, env);
    if (e.k === "name") {
      var v = this.lookup(env, e.name);
      if (v) return { get: function () { return v.val; }, set: function (x) { v.val = self.coerce(x, v.type); }, type: v.type };
      var fd = this.fieldDecl(env.cls, e.name);
      if (fd.mods.static) { var key = fd.cls + "." + e.name; return { get: function () { return self.statics[key]; }, set: function (x) { self.statics[key] = self.coerce(x, fd.type); }, type: fd.type }; }
      var o = env.self;
      return { get: function () { return o.fields[e.name]; }, set: function (x) { o.fields[e.name] = self.coerce(x, fd.type); }, type: fd.type };
    }
    if (e.k === "field") {
      if (e.staticField) { var k2 = e.staticField + "." + e.name, fd2 = this.fieldDecl(e.staticField, e.name); return { get: function () { return self.statics[k2]; }, set: function (x) { self.statics[k2] = self.coerce(x, fd2.type); }, type: fd2.type }; }
      var ob = this.ev(e.obj, env);
      if (ob.t === "null") this.throwJ("NullPointerException", "Cannot assign field \"" + e.name + "\" because " + this.npeDesc(e.obj) + " is null", e.line);
      var fd3 = this.fieldDecl(ob.cls, e.name);
      if (fd3 && fd3.mods.static) { var k3 = fd3.cls + "." + e.name; return { get: function () { return self.statics[k3]; }, set: function (x) { self.statics[k3] = self.coerce(x, fd3.type); }, type: fd3.type }; }
      return { get: function () { return ob.fields[e.name]; }, set: function (x) { ob.fields[e.name] = self.coerce(x, fd3 ? fd3.type : null); }, type: fd3 ? fd3.type : null };
    }
    if (e.k === "index") {
      var arr = this.ev(e.arr, env), ix = this.ev(e.idx, env).v;
      if (arr.t === "null") this.throwJ("NullPointerException", "Cannot store to " + "array because value is null", e.line);
      if (ix < 0 || ix >= arr.a.length) this.throwJ("ArrayIndexOutOfBoundsException", "Index " + ix + " out of bounds for length " + arr.a.length, e.line);
      return { get: function () { return arr.a[ix]; }, set: function (x) { arr.a[ix] = self.coerce(x, arr.et); }, type: arr.et };
    }
  };
  // description d'une expression pour les messages NullPointerException (comme la JVM)
  IP.npeDesc = function (e) {
    if (!e) return "value";
    if (e.k === "paren") return this.npeDesc(e.e);
    if (e.k === "name") return e.local ? "\"" + e.name + "\"" : e.isStatic ? "\"" + e.fieldOf + "." + e.name + "\"" : "\"this." + e.name + "\"";
    if (e.k === "field") { var o = this.npeDesc(e.obj).replace(/"/g, ""); return o === "value" ? "value" : "\"" + o + "." + e.name + "\""; }
    if (e.k === "this") return "\"this\"";
    if (e.k === "call" && e.m) return "the return value of \"" + e.m.cls + "." + e.name + "()\"";
    return "value";
  };
  IP.fieldDecl = function (cls, name) {
    var g = 0;
    while (cls && g++ < 60) {
      var c = this.prog.classes[cls]; if (!c) return null;
      for (var i = 0; i < c.fields.length; i++) if (c.fields[i].name === name) return c.fields[i];
      cls = c.sup;
    }
    return null;
  };
  IP.arith = function (op, a, b, line, rt) {
    var t = rt || promote(a.t === "char" ? "int" : a.t, b.t === "char" ? "int" : b.t);
    var x = a.v, y = b.v, r;
    if (t === "int") {
      switch (op) {
        case "+": r = (x + y) | 0; break; case "-": r = (x - y) | 0; break; case "*": r = Math.imul(x, y); break;
        case "/": if (y === 0) this.throwJ("ArithmeticException", "/ by zero", line); r = (x / y) | 0; break;
        case "%": if (y === 0) this.throwJ("ArithmeticException", "/ by zero", line); r = x % y; if (r === 0) r = 0; break;
      }
      return V("int", r);
    }
    if (t === "long") {
      switch (op) {
        case "+": r = x + y; break; case "-": r = x - y; break; case "*": r = x * y; break;
        case "/": if (y === 0) this.throwJ("ArithmeticException", "/ by zero", line); r = Math.trunc(x / y); break;
        case "%": if (y === 0) this.throwJ("ArithmeticException", "/ by zero", line); r = x % y; break;
      }
      return V("long", r);
    }
    switch (op) { case "+": r = x + y; break; case "-": r = x - y; break; case "*": r = x * y; break; case "/": r = x / y; break; case "%": r = x % y; break; }
    return V("double", r);
  };
  IP.ev = function (e, env) {
    var self = this, a, b, v;
    switch (e.k) {
      case "lit":
        if (e.t === "String") return lit(e.v);
        if (e.t === "null") return NULL;
        return V(e.t === "long" ? "long" : e.t, e.v);
      case "paren": return this.ev(e.e, env);
      case "this": return env.self;
      case "name": {
        var lv = this.lookup(env, e.name);
        if (lv) return lv.val;
        if (e.isClass) return { t: "classref", cls: e.name };
        return this.ref(e, env).get();
      }
      case "field": {
        if (e.obj.isClass || (e.obj.k === "name" && e.obj.isClass)) {
          var on = e.obj.name;
          if (on === "System") return { t: "stream", which: e.name };
          if (on === "Math") return V("double", e.name === "PI" ? Math.PI : Math.E);
          if (on === "Integer") return V("int", e.name === "MAX_VALUE" ? 2147483647 : -2147483648);
          if (on === "Long") return V("long", e.name === "MAX_VALUE" ? 9223372036854775807 : -9223372036854775808);
          if (on === "Double") return V("double", e.name === "MAX_VALUE" ? Number.MAX_VALUE : Number.MIN_VALUE);
          return this.statics[e.staticField + "." + e.name];
        }
        var ob = this.ev(e.obj, env);
        if (ob.t === "array" && e.name === "length") return V("int", ob.a.length);
        if (ob.t === "null") this.throwJ("NullPointerException", "Cannot read field \"" + e.name + "\" because " + this.npeDesc(e.obj) + " is null", e.line);
        var fd = this.fieldDecl(ob.cls, e.name);
        if (fd && fd.mods.static) return this.statics[fd.cls + "." + e.name];
        return ob.fields[e.name];
      }
      case "index": {
        var arr = this.ev(e.arr, env), ix = this.ev(e.idx, env).v;
        if (arr.t === "null") this.throwJ("NullPointerException", "Cannot load from array because value is null", e.line);
        if (ix < 0 || ix >= arr.a.length) this.throwJ("ArrayIndexOutOfBoundsException", "Index " + ix + " out of bounds for length " + arr.a.length, e.line);
        return arr.a[ix];
      }
      case "assign": {
        var r = this.ref(e.target, env);
        if (e.op === "=") { v = this.ev(e.value, env); r.set(v); return r.get(); }
        var cur = r.get(); v = this.ev(e.value, env);
        var res;
        if (e.op === "+=" && (r.type === "String" || cur.t === "String")) res = jstr(this.str(cur) + this.str(v));
        else res = this.castTo(this.arith(e.op[0], cur, v, e.line), r.type || cur.t);
        r.set(res); return r.get();
      }
      case "incdec": {
        var rr = this.ref(e.target, env), old = rr.get();
        var nv = this.castTo(this.arith(e.op[0], old, V("int", 1), e.line), rr.type || old.t);
        rr.set(nv);
        return e.pre ? rr.get() : old;
      }
      case "un": {
        v = this.ev(e.e, env);
        if (e.op === "!") return V("boolean", !v.v);
        if (e.op === "+") return v.t === "char" ? V("int", v.v) : v;
        var ut = v.t === "char" ? "int" : v.t;
        return V(ut, ut === "int" ? (-v.v) | 0 : -v.v);
      }
      case "bin": {
        var op = e.op;
        if (op === "&&") { a = this.ev(e.a, env); if (!a.v) return V("boolean", false); return V("boolean", !!this.ev(e.b, env).v); }
        if (op === "||") { a = this.ev(e.a, env); if (a.v) return V("boolean", true); return V("boolean", !!this.ev(e.b, env).v); }
        a = this.ev(e.a, env); b = this.ev(e.b, env);
        if (op === "+" && e.rt === "String") return jstr(this.str(a) + this.str(b));
        if (op === "==" || op === "!=") {
          var eq;
          var ap = a.t === "int" || a.t === "double" || a.t === "char" || a.t === "long" || a.t === "boolean", bp = b.t === "int" || b.t === "double" || b.t === "char" || b.t === "long" || b.t === "boolean";
          if (ap && bp) eq = a.v === b.v;
          else if (ap || bp) eq = a.v === b.v;
          else eq = a === b || (a.t === "null" && b.t === "null");
          return V("boolean", op === "==" ? eq : !eq);
        }
        if (op === "<") return V("boolean", a.v < b.v); if (op === ">") return V("boolean", a.v > b.v);
        if (op === "<=") return V("boolean", a.v <= b.v); if (op === ">=") return V("boolean", a.v >= b.v);
        if (a.t === "null" || b.t === "null") this.throwJ("NullPointerException", null, e.line);
        return this.arith(op, a, b, e.line, e.rt === "double" || e.rt === "long" || e.rt === "int" ? e.rt : null);
      }
      case "cond": return this.ev(e.c, env).v ? this.coerce(this.ev(e.a, env), e.rt) : this.coerce(this.ev(e.b, env), e.rt);
      case "cast": return this.castTo(this.ev(e.e, env), e.type);
      case "instanceof": return V("boolean", this.isInstance(this.ev(e.e, env), e.type));
      case "arrinit": return this.arrInit(e, e.type, env);
      case "newarr": {
        var dims = e.dims.map(function (d) { return self.ev(d, env).v; });
        return this.newArr(e.base, dims, 0);
      }
      case "new": return this.newObj(e, env);
      case "call": return this.call(e, env);
      case "ctorcall": return null;
      case "switchx": {
        var xv = this.ev(e.sel, env), arm = null, dflt = null;
        for (var xi = 0; xi < e.cases.length && !arm; xi++) {
          var cx = e.cases[xi]; if (cx.def) dflt = cx;
          for (var xl = 0; xl < cx.labels.length; xl++) if (this.ev(cx.labels[xl], env).v === xv.v) { arm = cx; break; }
        }
        arm = arm || dflt;
        if (arm.e) return this.coerce(this.ev(arm.e, env), e.rt);
        try { this.block(arm.block, env); } catch (y) { if (y instanceof YieldSig) return this.coerce(y.v, e.rt); throw y; }
        return null;
      }
    }
    throw new Unsup(e.line, "Expression non gérée.");
  };
  IP.newObj = function (e, env) {
    var self = this, cn = e.cls.replace(/<.*>$/, "");
    var args = e.args.map(function (a) { return self.ev(a, env); });
    if (cn === "Scanner") return { t: "scanner", id: nextId++ };
    if (cn === "ArrayList") { var et = listElem(e.rt) || "Object"; return { t: "list", et: et, a: args.length && args[0].t === "list" ? args[0].a.slice() : [], id: nextId++ }; }
    if (cn === "Object") return { t: "obj", cls: "Object", fields: {}, id: nextId++ };
    if (cn === "String") return jstr(args.length ? this.str(args[0]) : "");
    if (EXC_PARENT[cn]) { return { t: "obj", cls: cn, fields: { message: args[0] || NULL }, id: nextId++, builtinExc: true, trace: this.stackTrace(e.line) }; }
    var o = { t: "obj", cls: cn, fields: {}, id: nextId++ };
    this.construct(cn, o, e.ctor, args, e.line);
    return o;
  };
  IP.construct = function (cn, o, k, args, line) {
    var self = this, c = this.prog.classes[cn];
    if (!c) { if (EXC_PARENT[cn]) { o.fields.message = args[0] || NULL; o.trace = this.stackTrace(line); } return; }
    if (!k) k = c.ctors.filter(function (x) { return x.params.length === args.length; })[0] || null;
    this.frames.push({ cls: cn, name: "<init>", line: k ? k.line : c.line });
    try {
      var sc = E();
      if (k) k.params.forEach(function (p, i) { sc[p.name] = { type: p.type, val: self.coerce(args[i], p.type) }; });
      var env = { scopes: [sc], self: o, cls: cn };
      var body = k ? k.body.body : [];
      var first = body[0] && body[0].k === "expr" && body[0].e.k === "ctorcall" ? body[0].e : null;
      if (first && first.which === "this") {
        this.curLine = body[0].line; this.tick(body[0].line); this.snap(body[0].line, env);
        this.construct(cn, o, first.ctor, first.args.map(function (a) { return self.ev(a, env); }), first.line);
      } else {
        var supArgs = [];
        if (first) { this.curLine = body[0].line; this.tick(body[0].line); this.snap(body[0].line, env); supArgs = first.args.map(function (a) { return self.ev(a, env); }); }
        if (c.sup) this.construct(c.sup, o, first ? first.ctor : null, supArgs, line);
        c.fields.forEach(function (f) { if (!f.mods.static) o.fields[f.name] = f.init ? self.coerce(self.evalInit(f.init, f.type, { scopes: [E()], self: o, cls: cn }), f.type) : self.defaultVal(f.type); });
      }
      for (var i = first ? 1 : 0; i < body.length; i++) this.exec(body[i], env);
    } catch (r) { if (!(r instanceof RetSig)) throw r; }
    finally { this.frames.pop(); }
  };
  IP.call = function (e, env) {
    var self = this;
    var args = function () { return e.args.map(function (a) { return self.ev(a, env); }); };
    if (e.print) {
      var st = this.ev(e.obj, env);
      var as = args();
      var kind = st.which === "err" ? "err" : "out";
      if (e.name === "println") { this.write((as.length ? this.str(as[0]) : "") + "\n", kind); return null; }
      if (e.name === "print") { this.write(this.str(as[0]), kind); return null; }
      this.write(this.format(as[0].v, as.slice(1), e.line), kind); return null;
    }
    if (e.sb) {
      var bv = this.staticCall(e.sb, args(), e);
      if (bv !== undefined) return bv;
    }
    if (e.m && !e.virtual && (!e.obj || e.obj.isClass)) { return this.invoke(e.m, null, args()); }
    if (e.superCall) { return this.invoke(e.m, env.self, args()); }
    if (!e.obj) {
      // méthode d'instance de la classe courante, appel virtuel
      var target = env.self;
      var mm = this.findOverride(target.cls, e.m);
      return this.invoke(mm, target, args());
    }
    if (e.obj.k === "super" && e.objectBuiltin) return jstr(env.self.cls + "@" + hashHex(env.self.id));
    var o = this.ev(e.obj, env);
    var av = args();
    if (o.t === "null") this.throwJ("NullPointerException", "Cannot invoke \"" + (e.m ? e.m.cls : (e.obj.rt || "Object")) + "." + e.name + "(" + (e.m ? e.m.params.map(function (p) { return p.type; }).join(", ") : "") + ")\" because " + this.npeDesc(e.obj) + " is null", e.line);
    if (e.sm) return this.stringCall(o, e.name, av, e);
    if (e.lm) return this.listCall(o, e.name, av, e);
    if (e.scm) return this.scanCall(e.name, e.line);
    if (e.clsm) return jstr(o.cls);
    if (e.arrClone) return { t: "array", et: o.et, a: o.a.slice(), id: nextId++ };
    if (e.boxm) {
      if (e.name === "equals") return V("boolean", av[0].v === o.v);
      if (e.name === "toString") return jstr(this.str(o));
      if (e.name === "intValue") return V("int", o.v | 0); if (e.name === "doubleValue") return V("double", o.v);
      if (e.name === "compareTo") return V("int", o.v < av[0].v ? -1 : o.v > av[0].v ? 1 : 0);
    }
    if (e.excMethod) {
      if (e.name === "getMessage") return o.fields.message || NULL;
      this.write(this.excString(o) + "\n" + (o.trace || []).join("\n") + "\n", "err"); return null;
    }
    if (e.objMethod) {
      var um = o.t === "obj" ? this.findMethod(o.cls, e.name, av.length) : null;
      if (um) return this.invoke(um, o, av);
      if (e.name === "toString") return jstr(this.str(o));
      if (e.name === "equals") return V("boolean", o === av[0]);
      if (e.name === "hashCode") return V("int", o.id | 0);
      if (e.name === "getClass") return { t: "classref", cls: o.cls || (o.t === "String" ? "String" : o.t) };
    }
    if (e.m) {
      var m2 = o.t === "obj" ? this.findOverride(o.cls, e.m) : e.m;
      return this.invoke(m2, o, av);
    }
    throw new Unsup(e.line, "Appel non géré : " + e.name);
  };
  IP.stringCall = function (o, name, a, e) {
    var s = o.v, line = e.line;
    var idx = function (i, len) { if (i < 0 || i >= len) this.throwJ("StringIndexOutOfBoundsException", "Index " + i + " out of bounds for length " + len, line); }.bind(this);
    switch (name) {
      case "length": return V("int", s.length);
      case "charAt": idx(a[0].v, s.length); return V("char", s.charCodeAt(a[0].v));
      case "equals": return V("boolean", a[0].t === "String" && a[0].v === s);
      case "equalsIgnoreCase": return V("boolean", a[0].t === "String" && a[0].v.toLowerCase() === s.toLowerCase());
      case "contains": return V("boolean", s.indexOf(a[0].v) >= 0);
      case "indexOf": return V("int", s.indexOf(a[0].t === "char" ? String.fromCharCode(a[0].v) : a[0].v, a[1] ? a[1].v : 0));
      case "lastIndexOf": return V("int", s.lastIndexOf(a[0].t === "char" ? String.fromCharCode(a[0].v) : a[0].v));
      case "substring": {
        var b = a[0].v, en = a.length > 1 ? a[1].v : s.length;
        if (b < 0 || en > s.length || b > en) this.throwJ("StringIndexOutOfBoundsException", a.length > 1 ? "begin " + b + ", end " + en + ", length " + s.length : "Range [" + b + ", " + s.length + ") out of bounds for length " + s.length, line);
        return jstr(s.substring(b, en));
      }
      case "toUpperCase": return jstr(s.toUpperCase()); case "toLowerCase": return jstr(s.toLowerCase());
      case "trim": return jstr(s.replace(/^[\x00-\x20]+|[\x00-\x20]+$/g, "")); case "strip": return jstr(s.trim());
      case "isEmpty": return V("boolean", s.length === 0); case "isBlank": return V("boolean", s.trim().length === 0);
      case "startsWith": return V("boolean", s.indexOf(a[0].v) === 0); case "endsWith": return V("boolean", s.length >= a[0].v.length && s.slice(s.length - a[0].v.length) === a[0].v);
      case "replace": return jstr(e.charReplace ? s.split(String.fromCharCode(a[0].v)).join(String.fromCharCode(a[1].v)) : s.split(a[0].v).join(a[1].v));
      case "split": {
        var parts;
        var re = a[0].v;
        try { parts = s.split(new RegExp(re)); } catch (x) { parts = s.split(re); }
        if (s === "") parts = [""];
        while (parts.length > 1 && parts[parts.length - 1] === "") parts.pop();
        return { t: "array", et: "String", id: nextId++, a: parts.map(jstr) };
      }
      case "compareTo": { var t2 = a[0].v; for (var i = 0; i < Math.min(s.length, t2.length); i++) if (s.charCodeAt(i) !== t2.charCodeAt(i)) return V("int", s.charCodeAt(i) - t2.charCodeAt(i)); return V("int", s.length - t2.length); }
      case "compareToIgnoreCase": { var x1 = s.toLowerCase(), x2 = a[0].v.toLowerCase(); for (var j = 0; j < Math.min(x1.length, x2.length); j++) if (x1.charCodeAt(j) !== x2.charCodeAt(j)) return V("int", x1.charCodeAt(j) - x2.charCodeAt(j)); return V("int", x1.length - x2.length); }
      case "concat": return jstr(s + a[0].v); case "repeat": return jstr(s.repeat(a[0].v));
      case "toString": return o; case "hashCode": { var h = 0; for (var k = 0; k < s.length; k++) h = (Math.imul(31, h) + s.charCodeAt(k)) | 0; return V("int", h); }
      case "toCharArray": return { t: "array", et: "char", id: nextId++, a: s.split("").map(function (c) { return V("char", c.charCodeAt(0)); }) };
    }
  };
  IP.eq = function (x, y) {
    if (x.t === "null" || y.t === "null") return x.t === y.t;
    if (x.t === "String" && y.t === "String") return x.v === y.v;
    if (x.t !== "obj" && x.t !== "list" && x.t !== "array") return x.v === y.v && (x.t === y.t || (x.t !== "String" && y.t !== "String"));
    if (x.t === "obj") { var m = this.findMethod(x.cls, "equals", 1); if (m) return !!this.invoke(m, x, [y]).v; }
    return x === y;
  };
  IP.listCall = function (o, name, a, e) {
    var L = o.a, line = e.line, self = this;
    var chk = function (i, len) { if (i < 0 || i >= len) self.throwJ("IndexOutOfBoundsException", "Index " + i + " out of bounds for length " + len, line); };
    switch (name) {
      case "add": if (a.length === 1) { L.push(a[0].t === "char" && o.et !== "Character" ? a[0] : a[0]); return V("boolean", true); } if (a[0].v < 0 || a[0].v > L.length) chk(a[0].v, L.length); L.splice(a[0].v, 0, a[1]); return null;
      case "get": chk(a[0].v, L.length); return L[a[0].v];
      case "set": chk(a[0].v, L.length); var old = L[a[0].v]; L[a[0].v] = a[1]; return old;
      case "remove":
        if (e.removeIndex) { chk(a[0].v, L.length); return L.splice(a[0].v, 1)[0]; }
        for (var i = 0; i < L.length; i++) if (this.eq(a[0], L[i])) { L.splice(i, 1); return V("boolean", true); }
        return V("boolean", false);
      case "size": return V("int", L.length);
      case "isEmpty": return V("boolean", L.length === 0);
      case "clear": L.length = 0; return null;
      case "contains": for (var j = 0; j < L.length; j++) if (this.eq(a[0], L[j])) return V("boolean", true); return V("boolean", false);
      case "indexOf": for (var k = 0; k < L.length; k++) if (this.eq(a[0], L[k])) return V("int", k); return V("int", -1);
      case "toString": return jstr(this.str(o));
      case "addAll": Array.prototype.push.apply(L, a[0].a); return V("boolean", a[0].a.length > 0);
    }
  };
  // ---- Scanner ----
  IP.echoTo = function (end) {
    // affiche (en écho) les lignes de l'entrée touchées par la lecture
    while (this.echoed < end && this.echoed < this.input.length) {
      var nl = this.input.indexOf("\n", this.echoed);
      var stop = nl < 0 ? this.input.length : nl + 1;
      this.write(this.input.slice(this.echoed, stop) + (nl < 0 ? "\n" : ""), "in");
      this.echoed = stop;
    }
  };
  IP.skipWs = function () { while (this.ip < this.input.length && /\s/.test(this.input[this.ip])) this.ip++; };
  IP.peekTok = function () {
    var p = this.ip; while (p < this.input.length && /\s/.test(this.input[p])) p++;
    if (p >= this.input.length) return null;
    var q = p; while (q < this.input.length && !/\s/.test(this.input[q])) q++;
    return { s: this.input.slice(p, q), start: p, end: q };
  };
  IP.scanCall = function (name, line) {
    var tk;
    switch (name) {
      case "close": return null;
      case "hasNext": return V("boolean", !!this.peekTok());
      case "hasNextLine": return V("boolean", this.ip < this.input.length);
      case "hasNextInt": tk = this.peekTok(); return V("boolean", !!tk && /^[+-]?\d+$/.test(tk.s) && Math.abs(parseInt(tk.s, 10)) <= 2147483648);
      case "hasNextDouble": tk = this.peekTok(); return V("boolean", !!tk && /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(tk.s));
      case "nextLine": {
        if (this.ip >= this.input.length) { this.echoTo(this.input.length); this.throwJ("NoSuchElementException", "No line found", line); }
        var nl = this.input.indexOf("\n", this.ip);
        var end = nl < 0 ? this.input.length : nl;
        this.echoTo(end + 1);
        var s = this.input.slice(this.ip, end).replace(/\r$/, "");
        this.ip = nl < 0 ? this.input.length : nl + 1;
        return jstr(s);
      }
    }
    tk = this.peekTok();
    if (!tk) { this.echoTo(this.input.length); this.throwJ("NoSuchElementException", null, line); }
    this.echoTo(tk.end);
    if (name === "next") { this.ip = tk.end; return jstr(tk.s); }
    if (name === "nextInt" || name === "nextLong") {
      if (!/^[+-]?\d+$/.test(tk.s)) this.throwJ("InputMismatchException", null, line);
      var n = parseInt(tk.s, 10);
      if (name === "nextInt" && (n > 2147483647 || n < -2147483648)) this.throwJ("InputMismatchException", "For input string: \"" + tk.s + "\"", line);
      this.ip = tk.end; return V(name === "nextInt" ? "int" : "long", n);
    }
    if (name === "nextDouble") {
      if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(tk.s)) this.throwJ("InputMismatchException", null, line);
      this.ip = tk.end; return V("double", parseFloat(tk.s));
    }
    if (name === "nextBoolean") {
      if (!/^(true|false)$/i.test(tk.s)) this.throwJ("InputMismatchException", null, line);
      this.ip = tk.end; return V("boolean", tk.s.toLowerCase() === "true");
    }
  };
  // ---- statiques intégrées ----
  IP.staticCall = function (q, a, e) {
    var self = this, line = e.line;
    switch (q) {
      case "Math.sqrt": return V("double", Math.sqrt(a[0].v)); case "Math.floor": return V("double", Math.floor(a[0].v)); case "Math.ceil": return V("double", Math.ceil(a[0].v));
      case "Math.cbrt": return V("double", Math.cbrt(a[0].v)); case "Math.log": return V("double", Math.log(a[0].v)); case "Math.log10": return V("double", Math.log10(a[0].v)); case "Math.exp": return V("double", Math.exp(a[0].v));
      case "Math.pow": return V("double", Math.pow(a[0].v, a[1].v)); case "Math.hypot": return V("double", Math.hypot(a[0].v, a[1].v));
      case "Math.abs": { var t = e.rt; return V(t, Math.abs(a[0].v)); }
      case "Math.max": return this.coerce(V(e.rt, Math.max(a[0].v, a[1].v)), e.rt);
      case "Math.min": return this.coerce(V(e.rt, Math.min(a[0].v, a[1].v)), e.rt);
      case "Math.round": return V("long", Math.floor(a[0].v + 0.5));
      case "Math.random": return V("double", Math.random());
      case "Integer.parseInt": {
        var s = a[0].t === "null" ? null : a[0].v;
        if (s === null) this.throwJ("NumberFormatException", "Cannot parse null string: null", line);
        if (!/^[+-]?\d+$/.test(s) || Math.abs(parseInt(s, 10)) > 2147483648 || parseInt(s, 10) === 2147483648) this.throwJ("NumberFormatException", s === "" ? "For input string: \"\"" : "For input string: \"" + s + "\"", line);
        return V("int", parseInt(s, 10));
      }
      case "Integer.valueOf": if (a[0].t === "String") return this.staticCall("Integer.parseInt", a, e); return a[0];
      case "Integer.toString": return jstr(String(a[0].v));
      case "Integer.max": return V("int", Math.max(a[0].v, a[1].v)); case "Integer.min": return V("int", Math.min(a[0].v, a[1].v)); case "Integer.sum": return V("int", (a[0].v + a[1].v) | 0);
      case "Double.parseDouble": case "Double.valueOf": {
        if (a[0].t !== "String") return this.coerce(a[0], "double");
        var ds = a[0].v.trim();
        if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?[dDfF]?$/.test(ds) && !/^[+-]?(NaN|Infinity)$/.test(ds)) this.throwJ("NumberFormatException", ds === "" ? "empty String" : "For input string: \"" + a[0].v + "\"", line);
        return V("double", parseFloat(ds));
      }
      case "Double.toString": return jstr(fmtDouble(a[0].v));
      case "Double.compare": return V("int", a[0].v < a[1].v ? -1 : a[0].v > a[1].v ? 1 : 0);
      case "String.valueOf": return jstr(this.str(a[0]));
      case "String.format": return jstr(this.format(a[0].v, a.slice(1), line));
      case "String.join": { var parts = a.length === 2 && a[1].t === "list" ? a[1].a : a.length === 2 && a[1].t === "array" ? a[1].a : a.slice(1); return jstr(parts.map(function (x) { return self.str(x); }).join(a[0].v)); }
      case "Character.isDigit": return V("boolean", /[0-9]/.test(String.fromCharCode(a[0].v)));
      case "Character.isLetter": return V("boolean", /\p{L}/u.test(String.fromCharCode(a[0].v)));
      case "Character.isLetterOrDigit": return V("boolean", /[\p{L}0-9]/u.test(String.fromCharCode(a[0].v)));
      case "Character.isUpperCase": { var c = String.fromCharCode(a[0].v); return V("boolean", c !== c.toLowerCase()); }
      case "Character.isLowerCase": { var c2 = String.fromCharCode(a[0].v); return V("boolean", c2 !== c2.toUpperCase()); }
      case "Character.isWhitespace": return V("boolean", /\s/.test(String.fromCharCode(a[0].v)));
      case "Character.toUpperCase": return V("char", String.fromCharCode(a[0].v).toUpperCase().charCodeAt(0));
      case "Character.toLowerCase": return V("char", String.fromCharCode(a[0].v).toLowerCase().charCodeAt(0));
      case "Character.getNumericValue": { var ch = String.fromCharCode(a[0].v); return V("int", /[0-9]/.test(ch) ? +ch : -1); }
      case "Arrays.toString": return a[0].t === "null" ? lit("null") : jstr("[" + a[0].a.map(function (x) { return self.str(x); }).join(", ") + "]");
      case "Arrays.sort": a[0].a.sort(function (x, y) { if (x.t === "String") return x.v < y.v ? -1 : x.v > y.v ? 1 : 0; return x.v - y.v; }); return null;
      case "Arrays.fill": a[0].a = a[0].a.map(function () { return self.coerce(a[1], a[0].et); }); return null;
      case "System.exit": throw new ExitSig(a[0].v);
      case "System.currentTimeMillis": return V("long", Date.now());
    }
    return undefined;
  };
  // ---- printf / String.format ----
  function halfUp(x, dec) {
    // arrondi HALF_UP sur la représentation décimale la plus courte (comme Java)
    var neg = x < 0; x = Math.abs(x);
    var s = fmtPlain(x);
    var parts = s.split("."), ip = parts[0], fp = parts[1] || "";
    if (fp.length <= dec) return (neg && +s !== 0 ? "-" : "") + ip + (dec ? "." + (fp + new Array(dec + 1).join("0")).slice(0, dec) : "");
    var keep = ip + fp.slice(0, dec), next = fp.charCodeAt(dec) - 48;
    var digits = keep.split("").map(Number);
    if (next >= 5) { var k = digits.length - 1; while (k >= 0) { if (digits[k] < 9) { digits[k]++; break; } digits[k] = 0; k--; } if (k < 0) digits.unshift(1); }
    var all = digits.join(""), il = all.length - dec;
    var res = all.slice(0, il) + (dec ? "." + all.slice(il) : "");
    if (/^[0.]*$/.test(res)) neg = false;
    return (neg ? "-" : "") + res;
  }
  function fmtPlain(x) {
    var s = String(x);
    if (s.indexOf("e") < 0) return s;
    var m = /^(\d)(?:\.(\d+))?e([+-]\d+)$/.exec(s); if (!m) return x.toFixed(20);
    var d = m[1] + (m[2] || ""), ex = parseInt(m[3], 10);
    if (ex < 0) return "0." + new Array(-ex).join("0") + d;
    return d + new Array(Math.max(0, ex - d.length + 2)).join("0");
  }
  function group(s) { var p = s.split("."); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); return p.join("."); }
  IP.format = function (fmt, args, line) {
    var self = this, ai = 0;
    return fmt.replace(/%([-#+ 0,(]*)(\d+)?(\.\d+)?([a-zA-Z%])/g, function (all, flags, width, prec, conv) {
      if (conv === "n") return "\n";
      if (conv === "%") return "%";
      if (ai >= args.length) self.throwJ("MissingFormatArgumentException", "Format specifier '" + all + "'", line);
      var a = args[ai++], s;
      var jt = { "int": "Integer", "double": "Double", "String": "String", "char": "Character", "boolean": "Boolean", "long": "Long" }[a.t] || a.cls || "Object";
      switch (conv) {
        case "d":
          if (a.t !== "int" && a.t !== "long") self.throwJ("IllegalFormatConversionException", "d != java.lang." + jt, line);
          s = String(Math.abs(a.v)); if (flags.indexOf(",") >= 0) s = group(s); if (a.v < 0) s = "-" + s; else if (flags.indexOf("+") >= 0) s = "+" + s; break;
        case "f": case "e": case "E":
          if (a.t !== "double") self.throwJ("IllegalFormatConversionException", conv + " != java.lang." + jt, line);
          var p = prec ? parseInt(prec.slice(1), 10) : 6;
          if (conv === "f") { s = halfUp(a.v, p); if (flags.indexOf(",") >= 0) s = group(s); if (a.v >= 0 && flags.indexOf("+") >= 0) s = "+" + s; }
          else { var ex = a.v.toExponential(p).replace(/e([+-])(\d)$/, "e$10$2"); s = conv === "E" ? ex.toUpperCase() : ex; }
          break;
        case "s": case "S": s = self.str(a); if (prec) s = s.slice(0, parseInt(prec.slice(1), 10)); if (conv === "S") s = s.toUpperCase(); break;
        case "c": if (a.t !== "char" && a.t !== "int") self.throwJ("IllegalFormatConversionException", "c != java.lang." + jt, line); s = String.fromCharCode(a.v); break;
        case "b": s = a.t === "null" ? "false" : a.t === "boolean" ? String(a.v) : "true"; break;
        case "x": s = (a.v >>> 0).toString(16); break;
        default: self.throwJ("UnknownFormatConversionException", "Conversion = '" + conv + "'", line);
      }
      if (width) {
        var w = parseInt(width, 10);
        if (s.length < w) {
          if (flags.indexOf("-") >= 0) s = s + new Array(w - s.length + 1).join(" ");
          else if (flags.indexOf("0") >= 0 && /[df]/.test(conv)) { var neg = s[0] === "-"; var body = neg ? s.slice(1) : s; s = (neg ? "-" : "") + new Array(w - s.length + 1).join("0") + body; }
          else s = new Array(w - s.length + 1).join(" ") + s;
        }
      }
      return s;
    });
  };
  EXC_PARENT.MissingFormatArgumentException = "IllegalArgumentException"; EXC_PKG.MissingFormatArgumentException = "java.util";
  EXC_PARENT.UnknownFormatConversionException = "IllegalArgumentException"; EXC_PKG.UnknownFormatConversionException = "java.util";
  EXC_PARENT.ConcurrentModificationException = "RuntimeException"; EXC_PKG.ConcurrentModificationException = "java.util";

  /* ======================= API ======================= */
  function run(src, fileName, opts) {
    opts = opts || {};
    var res = { compiled: false, ok: false, out: "", display: [], steps: [], error: null };
    var prog;
    try { prog = compile(src, fileName); res.compiled = true; }
    catch (e) {
      if (e instanceof CErr || e instanceof Unsup) {
        e.file = fileName; e.srcLine = src.split("\n")[e.line - 1] || "";
        res.error = e; return res;
      }
      res.error = { kind: "unsupported", line: 1, fr: "Le simulateur n'a pas compris ce code (" + (e && e.message) + "). Teste-le avec ton JDK." };
      return res;
    }
    var it = new Interp(prog, opts);
    var r;
    try { r = it.run(); }
    catch (e) {
      if (e instanceof Unsup) { res.error = e; r = {}; }
      else { res.error = { kind: "unsupported", line: it.curLine || 1, fr: "Le simulateur a rencontré un cas qu'il ne sait pas exécuter (" + (e && e.message) + "). Teste ce programme avec ton JDK." }; r = {}; }
    }
    res.out = it.out; res.display = it.display; res.steps = it.steps; res.className = prog.order[0];
    if (r.runtimeErr) res.error = { kind: "launch", msg: r.runtimeErr, fr: r.fr, line: r.line };
    else if (r.uncaught) { res.error = { kind: "exception", msg: r.uncaught, exc: r.exc, line: r.line }; }
    else if (r.stopped) res.error = { kind: "stopped", fr: r.stopped, line: it.curLine };
    else if (!res.error) res.ok = true;
    res.exit = r.exit;
    return res;
  }
  function formatJavac(e) {
    var lines = e.msg.split("\n");
    var head = e.file + ":" + e.line + ": error: " + lines[0];
    var src = (e.srcLine || "").replace(/\t/g, "    ");
    var parts = [head];
    if (src) { parts.push(src); parts.push(new Array(Math.max(0, (e.col || 1) - 1) + 1).join(" ") + "^"); }
    return parts.concat(lines.slice(1)).concat(["1 error"]).join("\n");
  }
  var EXC_FR = {
    ArithmeticException: "Division entière par zéro. Vérifie le diviseur avant de diviser (if (n != 0) …).",
    ArrayIndexOutOfBoundsException: "Indice de tableau hors limites : les indices vont de 0 à length - 1. Vérifie la condition de ta boucle (i < t.length, et non <=).",
    IndexOutOfBoundsException: "Indice hors limites dans la liste : les indices vont de 0 à size() - 1.",
    StringIndexOutOfBoundsException: "Position hors du texte : les positions vont de 0 à length() - 1.",
    NullPointerException: "On utilise une variable qui vaut null (aucun objet). Vérifie qu'elle a bien été créée avec new, ou teste-la (if (x != null)).",
    NumberFormatException: "Le texte ne représente pas un nombre valide. Vérifie la saisie, ou entoure la conversion d'un try/catch.",
    InputMismatchException: "La saisie ne correspond pas au type attendu (par exemple du texte alors qu'on attend un nombre). Vérifie l'entrée clavier, ou utilise hasNextInt() / try-catch.",
    NoSuchElementException: "Le programme attend une saisie mais l'entrée clavier est vide (ou épuisée). Remplis la zone « Entrée clavier » : une valeur par ligne.",
    ClassCastException: "Conversion d'objet impossible : l'objet n'est pas de la classe visée. Teste d'abord avec instanceof.",
    IllegalFormatConversionException: "Le format ne correspond pas au type : %d est pour les entiers, %f pour les décimaux, %s pour les textes.",
    MissingFormatArgumentException: "Il y a plus de % dans le format que de valeurs à afficher.",
    StackOverflowError: "La méthode s'appelle elle-même sans fin (récursion infinie).",
    ConcurrentModificationException: "La liste a été modifiée pendant son parcours avec for-each. Utilise une boucle classique avec un indice.",
    NegativeArraySizeException: "La taille d'un tableau ne peut pas être négative.",
    IllegalArgumentException: "Une valeur invalide a été refusée (exception lancée par le programme).",
    IllegalStateException: "Opération impossible dans l'état actuel de l'objet."
  };
  var api = { run: run, formatJavac: formatJavac, excFr: function (c) { return EXC_FR[c] || "Une exception a interrompu le programme. Lis son nom et son message, puis la ligne indiquée après « at »."; }, fmtDouble: fmtDouble };
  root.JavaMini = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
