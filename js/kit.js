/* Petits générateurs HTML utilisés par les fichiers de contenu des séances. */
(function () {
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  var K = {
    esc: esc,
    // bloc de code Java coloré (lignes ou texte)
    code: function (src) { return '<pre data-java>' + esc(Array.isArray(src) ? src.join("\n") : src) + "</pre>"; },
    // exemple exécutable : référence à un programme de COURSE.progs
    run: function (id) { return '<div class="runbox" data-run="' + id + '"></div>'; },
    note: function (label, html, kind) { return '<div class="note' + (kind ? " " + kind : "") + '"><span class="lbl">' + label + "</span><div>" + html + "</div></div>"; },
    warn: function (label, html) { return K.note(label, html, "warn"); },
    tiles: function (items, cls) { return '<div class="' + (cls || "grid-3") + '">' + items.map(function (t) { return '<div class="tile"><h4>' + t[0] + "</h4><p>" + t[1] + "</p></div>"; }).join("") + "</div>"; },
    table: function (head, rows) {
      return '<div class="tbl-wrap"><table class="tbl"><thead><tr>' + head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>" +
        rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
    },
    term: function (txt) { return '<div class="term">' + txt + "</div>"; },
    console: function (txt) { return '<div class="console">' + esc(txt) + "</div>"; },
    p: function () { return '<div class="prose">' + Array.prototype.map.call(arguments, function (x) { return /^\s*<(ul|ol|p|div|h4|table)/.test(x) ? x : "<p>" + x + "</p>"; }).join("") + "</div>"; },
    ul: function (items) { return "<ul>" + items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>"; },
    ol: function (items) { return "<ol>" + items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ol>"; },
    analogy: function (html) { return '<div class="analogy"><span class="ic" aria-hidden="true">≈</span><div class="prose"><p>' + html + "</p></div></div>"; },
    comp: function (name) { return '<div data-comp="' + name + '"></div>'; },
    // schéma mémoire : [[nom, type, valeur]]
    mem: function (rows, title) {
      return '<div class="memdiag"><span class="console-label">' + (title || "Mémoire") + '</span><div class="memgrid">' + rows.map(function (r) {
        return '<div class="memcell"><span class="mt">' + esc(r[1]) + '</span><span class="mn">' + esc(r[0]) + '</span><span class="mv">' + esc(r[2]) + "</span></div>";
      }).join("") + "</div></div>";
    },
    // diagramme de classe simple
    uml: function (name, attrs, methods, extra) {
      return '<div class="uml' + (extra ? " " + extra : "") + '"><div class="uml-h">' + esc(name) + '</div><div class="uml-s">' + attrs.map(esc).join("<br>") + '</div><div class="uml-s">' + methods.map(esc).join("<br>") + "</div></div>";
    }
  };
  window.K = K;
  window.COURSE = window.COURSE || { seances: [], progs: {}, data: {} };
})();
