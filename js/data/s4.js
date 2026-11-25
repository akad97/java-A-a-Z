(function () {
  var P = COURSE.progs;
  COURSE.seances.push({ id: "s4", tag: "S-04", short: "Tableaux & chaînes" });

  P.s4_bases = { file: "Tableaux.java", lab: "Créer et lire un tableau", code:
`public class Tableaux {
    public static void main(String[] args) {
        String[] refs = {"PC-01", "PC-02", "IMP-01", "SW-01"};
        int[] stock = new int[3];

        System.out.println("Nombre de références : " + refs.length);
        System.out.println("Première : " + refs[0]);
        System.out.println("Dernière : " + refs[refs.length - 1]);

        stock[0] = 12;
        stock[2] = 5;
        refs[1] = "PC-02B";
        System.out.println(stock[0] + " " + stock[1] + " " + stock[2]);
        System.out.println(refs[1]);
    }
}
` };
  P.s4_parcours = { file: "Parcours.java", lab: "Parcourir : for et for-each", code:
`public class Parcours {
    public static void main(String[] args) {
        String[] postes = {"PC-01", "PC-02", "PC-03"};
        int[] heures = {2, 5, 1};

        for (int i = 0; i < postes.length; i++) {
            System.out.println((i + 1) + ". " + postes[i] + " : " + heures[i] + " h");
        }

        int total = 0;
        for (int h : heures) {
            total += h;
        }
        System.out.println("Total : " + total + " h");
    }
}
` };
  P.s4_recherche = { file: "Recherche.java", lab: "Rechercher une référence", input: "IMP-01\n", code:
`import java.util.Scanner;

public class Recherche {
    public static void main(String[] args) {
        String[] refs = {"PC-01", "PC-02", "IMP-01", "SW-01"};
        Scanner sc = new Scanner(System.in);
        System.out.print("Référence cherchée : ");
        String cherchee = sc.nextLine();

        int position = -1;
        for (int i = 0; i < refs.length; i++) {
            if (refs[i].equals(cherchee)) {
                position = i;
                break;
            }
        }

        if (position >= 0) {
            System.out.println("Trouvée à l'indice " + position);
        } else {
            System.out.println("Référence inconnue");
        }
    }
}
` };
  P.s4_max = { file: "Maximum.java", lab: "Maximum et sa position", code:
`public class Maximum {
    public static void main(String[] args) {
        int[] temperatures = {64, 71, 88, 59, 76};
        int max = temperatures[0];
        int indiceMax = 0;
        for (int i = 1; i < temperatures.length; i++) {
            if (temperatures[i] > max) {
                max = temperatures[i];
                indiceMax = i;
            }
        }
        System.out.println("Plus chaud : poste " + (indiceMax + 1) + " à " + max + " °C");

        int auDessus = 0;
        for (int t : temperatures) {
            if (t > 70) {
                auDessus++;
            }
        }
        System.out.println(auDessus + " poste(s) au-dessus de 70 °C");
    }
}
` };
  P.s4_chaines = { file: "Chaines.java", lab: "Méthodes de String", code:
`public class Chaines {
    public static void main(String[] args) {
        String modele = "Imprimante HP LaserJet";
        System.out.println(modele.length());
        System.out.println(modele.charAt(0));
        System.out.println(modele.toUpperCase());
        System.out.println(modele.contains("HP"));
        System.out.println(modele.indexOf("HP"));
        System.out.println(modele.substring(11, 13));
        System.out.println(modele.replace("HP", "Canon"));
        System.out.println(modele.startsWith("Imp"));
        System.out.println("  PC-07  ".trim() + "|");
        System.out.println(modele);
    }
}
` };
  P.s4_egalite = { file: "Egalite.java", lab: "equals ou == ?", input: "OK\n", code:
`import java.util.Scanner;

public class Egalite {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("État du poste : ");
        String etat = sc.nextLine();

        System.out.println("Avec == : " + (etat == "OK"));
        System.out.println("Avec equals : " + etat.equals("OK"));
        System.out.println("Sans tenir compte de la casse : " + etat.equalsIgnoreCase("ok"));
    }
}
` };
  P.s4_decoupe = { file: "Decoupe.java", lab: "Découper une ligne (split)", code:
`public class Decoupe {
    public static void main(String[] args) {
        String ligne = "PC-042;Dell;Latitude 5420;EN_PANNE";
        String[] champs = ligne.split(";");
        System.out.println("Identifiant : " + champs[0]);
        System.out.println("Marque      : " + champs[1]);
        System.out.println("État        : " + champs[3]);

        String id = champs[0];
        int tiret = id.indexOf("-");
        String type = id.substring(0, tiret);
        String numero = id.substring(tiret + 1);
        System.out.println(type + " numéro " + Integer.parseInt(numero));

        int chiffres = 0;
        for (int i = 0; i < ligne.length(); i++) {
            if (Character.isDigit(ligne.charAt(i))) {
                chiffres++;
            }
        }
        System.out.println(chiffres + " chiffres dans la ligne");
    }
}
` };
  P.s4_horslimite = { file: "HorsLimite.java", lab: "Erreur : indice hors limites", code:
`public class HorsLimite {
    public static void main(String[] args) {
        int[] stock = {12, 0, 5};
        for (int i = 0; i <= stock.length; i++) {
            System.out.println("Case " + i + " : " + stock[i]);
        }
    }
}
` };
  P.s4_trace = { file: "TraceTableau.java", code:
`public class TraceTableau {
    public static void main(String[] args) {
        int[] t = {4, 7, 1, 9};
        t[1] = t[0] + t[3];
        t[2]++;
        int s = 0;
        for (int i = 0; i < t.length; i += 2) {
            s += t[i];
        }
        System.out.println(t[1] + " " + t[2] + " " + s);
        String mot = "RESEAU";
        System.out.println(mot.length() + " " + mot.charAt(2) + " " + mot.substring(3));
    }
}
` };
  P.s4_valide = { file: "Identifiant.java", code:
`import java.util.Scanner;

public class Identifiant {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String id = sc.nextLine();
        boolean valide = id.length() == 6 && id.startsWith("PC-");
        if (valide) {
            for (int i = 3; i < 6; i++) {
                if (!Character.isDigit(id.charAt(i))) {
                    valide = false;
                }
            }
        }
        if (valide) {
            System.out.println(id + " : valide");
        } else {
            System.out.println(id + " : invalide");
        }
    }
}
` };
  P.s4_comptage = { file: "Comptage.java", code:
`import java.util.Scanner;

public class Comptage {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] heures = new int[n];
        for (int i = 0; i < n; i++) {
            heures[i] = sc.nextInt();
        }
        int total = 0;
        int longues = 0;
        for (int h : heures) {
            total += h;
            if (h > 4) {
                longues++;
            }
        }
        System.out.println("Total : " + total + " h");
        System.out.println("Interventions longues : " + longues);
    }
}
` };
  P.s4_tp = { file: "Inventaire.java", lab: "TP 4 : inventaire et recherche", input: "pc-03\n", code:
`import java.util.Scanner;

public class Inventaire {
    public static void main(String[] args) {
        String[] refs = {"PC-01", "PC-02", "PC-03", "IMP-01", "IMP-02", "SW-01"};
        Scanner sc = new Scanner(System.in);

        System.out.println("Inventaire (" + refs.length + " équipements) :");
        for (int i = 0; i < refs.length; i++) {
            System.out.println("  " + (i + 1) + ". " + refs[i]);
        }

        System.out.print("Référence à rechercher : ");
        String cherchee = sc.nextLine().trim();
        int position = -1;
        for (int i = 0; i < refs.length; i++) {
            if (refs[i].equalsIgnoreCase(cherchee)) {
                position = i;
            }
        }
        if (position >= 0) {
            System.out.println("Trouvé : " + refs[position] + " (n° " + (position + 1) + ")");
        } else {
            System.out.println("Aucun équipement " + cherchee);
        }
    }
}
` };
  P.s4_tpa = { file: "Liste.java", code:
`public class Liste {
    public static void main(String[] args) {
        String[] refs = {"PC-01", "PC-02", "PC-03", "IMP-01", "IMP-02", "SW-01"};
        System.out.println("Inventaire (" + refs.length + " equipements) :");
        for (int i = 0; i < refs.length; i++) {
            System.out.println((i + 1) + ". " + refs[i]);
        }
    }
}
` };
  P.s4_tpb = { file: "Cherche.java", code:
`import java.util.Scanner;

public class Cherche {
    public static void main(String[] args) {
        String[] refs = {"PC-01", "PC-02", "PC-03", "IMP-01", "IMP-02", "SW-01"};
        Scanner sc = new Scanner(System.in);
        String cherchee = sc.nextLine().trim();
        int position = -1;
        for (int i = 0; i < refs.length; i++) {
            if (refs[i].equalsIgnoreCase(cherchee)) {
                position = i;
            }
        }
        if (position >= 0) {
            System.out.println("Trouve : " + refs[position] + " (n " + (position + 1) + ")");
        } else {
            System.out.println("Aucun equipement " + cherchee);
        }
    }
}
` };
  P.s4_tpc = { file: "ParType.java", code:
`public class ParType {
    public static void main(String[] args) {
        String[] refs = {"PC-01", "PC-02", "PC-03", "IMP-01", "IMP-02", "SW-01"};
        int pc = 0;
        int imp = 0;
        int autres = 0;
        for (String r : refs) {
            if (r.startsWith("PC-")) {
                pc++;
            } else if (r.startsWith("IMP-")) {
                imp++;
            } else {
                autres++;
            }
        }
        System.out.println("Ordinateurs : " + pc);
        System.out.println("Imprimantes : " + imp);
        System.out.println("Autres : " + autres);
    }
}
` };

  COURSE.data.s4 = {
    hours: "3 h", split: "CM 1 h · TD 1 h · TP 1 h", comp: "C4",
    h1: "Tableaux <em>et chaînes</em>",
    lede: "Un parc informatique, ce n'est pas un poste mais des dizaines. Tu vas ranger plusieurs valeurs dans un tableau, le parcourir pour totaliser ou rechercher, et manipuler les textes (références, descriptions) avec les méthodes de String.",
    prereq: "variables, boucles for et while, if (séances 2 et 3).",
    objectives: [
      "Créer et initialiser un tableau, utiliser les indices et length",
      "Parcourir un tableau avec for et for-each",
      "Calculer un total, une moyenne, un maximum et compter des valeurs",
      "Rechercher une valeur dans un tableau",
      "Manipuler des String : length, charAt, equals, contains, substring, split…",
      "Connaître les limites des tableaux"
    ],
    lesson: [
      { title: "Un tableau : plusieurs valeurs sous un seul nom", html:
        K.p("Pour mémoriser les références de 25 postes, déclarer 25 variables serait absurde. Un <b>tableau</b> regroupe plusieurs valeurs <b>du même type</b> sous un seul nom ; chacune est repérée par son <b>indice</b>, qui commence à <b>0</b>.") +
        '<div class="cells"><div class="cell"><b>"PC-01"</b><span>[0]</span></div><div class="cell"><b>"PC-02"</b><span>[1]</span></div><div class="cell"><b>"IMP-01"</b><span>[2]</span></div><div class="cell"><b>"SW-01"</b><span>[3]</span></div></div>' +
        K.code(["String[] refs = {\"PC-01\", \"PC-02\", \"IMP-01\", \"SW-01\"};  // valeurs connues", "int[] stock = new int[3];                              // 3 cases, valeurs par défaut"]) +
        K.p("<code>refs.length</code> vaut 4 (le nombre de cases, <b>sans parenthèses</b>). Les indices vont donc de <code>0</code> à <code>length - 1</code>. Un tableau créé avec <code>new</code> est rempli de valeurs par défaut : <code>0</code> pour les nombres, <code>false</code> pour les booléens, <code>null</code> pour les String.") +
        K.run("s4_bases"),
        check: { q: "Pour <code>int[] t = new int[5];</code>, quel est l'indice de la dernière case ?", o: ["5", "4", "6", "0"], a: 1, e: "5 cases : indices 0, 1, 2, 3, 4. Le dernier est <code>t.length - 1</code>." } },
      { title: "Parcourir : for avec indice et for-each", html:
        K.p("Pour traiter toutes les cases, on combine tableau et boucle. Deux formes :") +
        K.ul(["<code>for (int i = 0; i &lt; t.length; i++)</code> : on a l'<b>indice</b> <code>i</code>, utile pour afficher un numéro, modifier une case ou travailler sur deux tableaux en parallèle ;", "<code>for (int h : heures)</code> (« pour chaque h de heures ») : plus court, mais on n'a pas l'indice et on ne peut pas modifier le tableau."]) +
        K.run("s4_parcours") +
        K.warn("La condition est i &lt; length", "Avec <code>i &lt;= t.length</code>, le dernier tour essaie de lire la case <code>t[t.length]</code>, qui n'existe pas : le programme s'arrête avec <code>ArrayIndexOutOfBoundsException</code>. Essaie :") +
        K.run("s4_horslimite"),
        check: { q: "Quelle boucle permet de mettre toutes les cases d'un tableau à 0 ?", o: ["<code>for (int x : t) { x = 0; }</code>", "<code>for (int i = 0; i &lt; t.length; i++) { t[i] = 0; }</code>", "Les deux", "Aucune"], a: 1, e: "Dans un for-each, <code>x</code> est une copie de la valeur : la modifier ne change pas le tableau. Il faut l'indice." } },
      { title: "Algorithmes classiques : total, maximum, comptage", html:
        K.p("Tu retrouves le compteur et l'accumulateur de la séance 3, appliqués à un tableau :") +
        K.table(["But", "Initialisation", "Dans la boucle"], [["Total", "<code>int total = 0;</code>", "<code>total += t[i];</code>"], ["Moyenne", "après le total", "<code>(double) total / t.length</code>"], ["Maximum", "<code>int max = t[0];</code> (première case)", "<code>if (t[i] &gt; max) max = t[i];</code>"], ["Position du max", "<code>int iMax = 0;</code>", "mémoriser <code>i</code> en même temps"], ["Comptage", "<code>int nb = 0;</code>", "<code>if (condition) nb++;</code>"]]) +
        K.run("s4_max") +
        K.note("Pourquoi max = t[0] ?", "Initialiser le maximum à 0 serait faux si toutes les valeurs étaient négatives (des températures sous zéro, par exemple). Partir de la première case est toujours correct.") },
      { title: "Rechercher une valeur", html:
        K.p("La <b>recherche séquentielle</b> parcourt le tableau case par case jusqu'à trouver la valeur. On utilise une variable « position » qui vaut <code>-1</code> tant qu'on n'a rien trouvé (aucun indice réel ne vaut -1) :") +
        K.run("s4_recherche") +
        K.p("Le <code>break</code> arrête la boucle dès que la valeur est trouvée : inutile de continuer. Sans lui, on trouverait la <b>dernière</b> occurrence au lieu de la première.") +
        K.warn("equals pour les textes", "On compare deux String avec <code>refs[i].equals(cherchee)</code>, jamais avec <code>==</code>. La partie 6 explique pourquoi."),
        check: { q: "Après la boucle de recherche, <code>position</code> vaut -1. Cela signifie :", o: ["La valeur est dans la dernière case", "La valeur n'a pas été trouvée", "Le tableau est vide", "Erreur de programmation"], a: 1, e: "-1 est la valeur « rien trouvé » choisie avant la boucle ; elle n'a jamais été remplacée." } },
      { title: "Les chaînes de caractères : String", html:
        K.p("Un <code>String</code> est une suite de caractères, numérotés eux aussi à partir de 0. C'est un <b>objet</b> : on l'utilise avec des méthodes, appelées avec un point.") +
        K.table(["Méthode", "Résultat", "Exemple avec <code>s = \"PC-042\"</code>"], [
          ["<code>s.length()</code>", "nombre de caractères (avec parenthèses !)", "6"],
          ["<code>s.charAt(i)</code>", "caractère à la position i", "<code>s.charAt(0)</code> → 'P'"],
          ["<code>s.equals(t)</code> / <code>equalsIgnoreCase(t)</code>", "même texte ? (sans tenir compte de la casse)", "<code>s.equals(\"PC-042\")</code> → true"],
          ["<code>s.contains(t)</code>", "contient t ?", "<code>s.contains(\"04\")</code> → true"],
          ["<code>s.indexOf(t)</code>", "position de t, ou -1", "<code>s.indexOf(\"-\")</code> → 2"],
          ["<code>s.substring(a, b)</code>", "morceau de a (inclus) à b (exclu)", "<code>s.substring(0, 2)</code> → \"PC\""],
          ["<code>s.startsWith(t)</code> / <code>endsWith(t)</code>", "commence / finit par t ?", "<code>s.startsWith(\"PC\")</code> → true"],
          ["<code>s.toUpperCase()</code> / <code>toLowerCase()</code>", "copie en majuscules / minuscules", "\"pc-042\""],
          ["<code>s.trim()</code>", "copie sans espaces au début et à la fin", ""],
          ["<code>s.replace(a, b)</code>", "copie où a est remplacé par b", ""],
          ["<code>s.split(\";\")</code>", "tableau des morceaux séparés par ;", ""]]) +
        K.run("s4_chaines") +
        K.note("Un String ne change jamais", "Les méthodes comme <code>toUpperCase()</code> ou <code>replace()</code> <b>renvoient une nouvelle chaîne</b> ; l'originale reste intacte (voir la dernière ligne affichée). Pour garder le résultat : <code>modele = modele.toUpperCase();</code>") },
      { title: "Comparer deux textes : equals, pas ==", html:
        K.p("<code>==</code> compare deux <b>références</b> : il répond « est-ce le même objet en mémoire ? ». <code>equals</code> compare le <b>contenu</b>. Un texte tapé au clavier est un nouvel objet : même s'il contient « OK », <code>==</code> peut répondre false.") +
        K.run("s4_egalite") +
        K.p("Règle simple : <b>pour les String, toujours <code>equals</code></b> (ou <code>equalsIgnoreCase</code> pour ignorer majuscules et minuscules). <code>==</code> reste correct pour les types primitifs : <code>int</code>, <code>double</code>, <code>char</code>, <code>boolean</code>."),
        check: { q: "Quelle condition teste correctement si la saisie <code>rep</code> vaut « oui » ?", o: ["<code>rep == \"oui\"</code>", "<code>rep.equals(\"oui\")</code>", "<code>rep = \"oui\"</code>", "<code>equals(rep, \"oui\")</code>"], a: 1, e: "<code>equals</code> compare le contenu." } },
      { title: "Découper et analyser un texte", html:
        K.p("Les données arrivent souvent sous forme d'une ligne de texte (un export, un fichier, une saisie). <code>split</code> la découpe en tableau ; <code>indexOf</code> et <code>substring</code> extraient un morceau ; une boucle sur <code>charAt</code> examine chaque caractère.") +
        K.run("s4_decoupe") +
        K.p("<code>Character.isDigit(c)</code>, <code>Character.isLetter(c)</code> et <code>Character.toUpperCase(c)</code> travaillent sur un <code>char</code>. <code>Integer.parseInt</code> transforme le morceau \"042\" en nombre 42.") },
      { title: "Les limites des tableaux, et la suite", html:
        K.ul(["<b>Taille fixe</b> : une fois créé, un tableau ne peut ni grandir ni rétrécir. Pour ajouter un 26e poste à un tableau de 25, il faut en créer un nouveau et tout recopier.", "<b>Un seul type</b> : un tableau de String ne peut pas contenir aussi des prix. Pour décrire complètement un équipement (référence, marque, prix…), on aura besoin d'<b>objets</b> (séance 6).", "<b>Afficher</b> un tableau directement donne un code illisible (<code>[I@1b6d3586</code>). Utilise une boucle, ou <code>Arrays.toString(t)</code> après <code>import java.util.Arrays;</code>."]) +
        K.p("La solution aux deux premières limites est la <b>collection</b> <code>ArrayList</code>, une liste qui s'agrandit toute seule. On l'étudiera en séance 7 ; en voici juste un aperçu :") +
        K.code(["import java.util.ArrayList;", "", "ArrayList<String> refs = new ArrayList<>();", "refs.add(\"PC-01\");          // la liste grandit", "refs.add(\"PC-02\");", "System.out.println(refs.size() + \" \" + refs.get(0));   // 2 PC-01"]) }
    ],

    demos: [
      { type: "stepper", title: "Recherche séquentielle", prog: "s4_recherche", intro: "On cherche <code>IMP-01</code>. Observe <code>i</code> et <code>position</code> : la boucle s'arrête dès que la référence est trouvée.",
        notes: { 10: "Avant la boucle, <code>position</code> vaut -1 : « rien trouvé pour l'instant ».", 11: "Test de la condition de la boucle : on continue tant que <code>i &lt; refs.length</code>.", 12: "Comparaison du contenu de la case <code>refs[i]</code> avec la saisie, avec <code>equals</code>.", 13: "Trouvé : on mémorise l'indice.", 14: "<code>break</code> : on sort de la boucle, inutile de regarder les cases suivantes.", 18: "Après la boucle, <code>position</code> dit si on a trouvé." } },
      { type: "stepper", title: "Maximum et comptage", prog: "s4_max", intro: "Suis <code>max</code> et <code>indiceMax</code> : ils ne changent que lorsqu'une température plus grande apparaît.",
        notes: { 4: "Le maximum part de la première case.", 7: "La case courante dépasse-t-elle le maximum actuel ?", 8: "Oui : nouveau maximum…", 9: "… et on retient sa position.", 12: "<code>indiceMax + 1</code> : on affiche un numéro de poste qui commence à 1 pour l'utilisateur.", 16: "Comptage : on n'incrémente que si la condition est vraie." } },
      { type: "lab" }
    ],

    exercises: [
      { type: "predict", title: "Tracer un tableau et un texte", lvl: 1, prog: "s4_trace",
        hint: "Note le contenu du tableau après chaque ligne. La boucle avance de 2 en 2 : quels indices visite-t-elle ?",
        expl: "Après <code>t[1] = t[0] + t[3]</code> : t = {4, 13, 1, 9}. Après <code>t[2]++</code> : {4, 13, 2, 9}. La boucle visite les indices 0 et 2 : s = 4 + 2 = 6. Pour \"RESEAU\" : 6 caractères, <code>charAt(2)</code> = 'S', <code>substring(3)</code> = \"EAU\"." },
      { type: "mcq", title: "Indices et longueurs", lvl: 1, items: [
        { q: "Pour <code>String[] t = {\"A\", \"B\", \"C\"};</code>, que vaut <code>t[1]</code> ?", o: ["\"A\"", "\"B\"", "\"C\"", "Erreur"], a: 1, e: "Les indices commencent à 0 : t[0] = \"A\", t[1] = \"B\"." },
        { q: "Comment obtenir le nombre de cases du tableau <code>t</code> ?", o: ["<code>t.length()</code>", "<code>t.length</code>", "<code>t.size()</code>", "<code>length(t)</code>"], a: 1, e: "Pour un tableau, <code>length</code> sans parenthèses. Pour un String, <code>length()</code> avec parenthèses. Pour une ArrayList, <code>size()</code>." },
        { q: "Que vaut <code>\"Serveur\".charAt(3)</code> ?", o: ["'v'", "'r'", "'e'", "'S'"], a: 0, e: "S(0) e(1) r(2) v(3)." },
        { q: "Que vaut <code>\"PC-042\".substring(3)</code> ?", o: ["\"PC-\"", "\"042\"", "\"-042\"", "\"42\""], a: 1, e: "Du caractère d'indice 3 jusqu'à la fin." },
        { q: "<code>int[] t = new int[4]; System.out.println(t[2]);</code> affiche :", o: ["null", "0", "Erreur", "Rien"], a: 1, e: "Les cases d'un tableau d'int sont initialisées à 0." }] },
      { type: "fill", title: "Compléter un calcul de total", lvl: 1,
        statement: "Complète le programme pour qu'il affiche le total et la moyenne des durées d'intervention.",
        code: "int[] durees = {3, 1, 4, 2};\nint total = [[0]];\nfor (int i = 0; i [[<]] durees.[[length]]; i++) {\n    total [[+=]] durees[[[i]]];\n}\ndouble moyenne = ([[double]]) total / durees.length;\nSystem.out.println(total + \" h, moyenne \" + moyenne);",
        expl: "L'accumulateur part de 0 ; la boucle va de 0 à <code>length - 1</code> (condition <code>&lt;</code>) ; le cast <code>(double)</code> évite la division entière (10 / 4 = 2.5)." },
      { type: "predict", title: "equals ou == ?", lvl: 2, prog: "s4_egalite",
        statement: "L'utilisateur tape <code>OK</code>. Qu'affiche le programme ?",
        expl: "La saisie crée un nouvel objet String : <code>==</code> compare les adresses en mémoire et répond <b>false</b>, même si le texte est identique. <code>equals</code> compare le contenu : <b>true</b>. <code>equalsIgnoreCase(\"ok\")</code> ignore la casse : <b>true</b>." },
      { type: "write", title: "Valider un identifiant de poste", lvl: 2, file: "Identifiant.java",
        statement: "<p>Un identifiant de poste valide a exactement 6 caractères, commence par <code>PC-</code> et se termine par 3 chiffres (ex. <code>PC-042</code>). Lis une ligne et affiche <code>PC-042 : valide</code> ou <code>PC42 : invalide</code>.</p>",
        starter: "import java.util.Scanner;\n\npublic class Identifiant {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String id = sc.nextLine();\n\n    }\n}\n",
        tests: [{ input: "PC-042\n", label: "PC-042" }, { input: "PC42\n", label: "trop court" }, { input: "PC-4A2\n", label: "lettre au milieu" }, { input: "IMP-01\n", label: "mauvais préfixe" }, { input: "PC-999\n", label: "PC-999" }],
        solution: "s4_valide", hint: "<p><code>id.length() == 6 &amp;&amp; id.startsWith(\"PC-\")</code>, puis une boucle sur les indices 3 à 5 avec <code>Character.isDigit(id.charAt(i))</code>.</p>" },
      { type: "write", title: "Remplir un tableau au clavier", lvl: 3, file: "Comptage.java",
        statement: "<p>Lis un entier <code>n</code>, puis <code>n</code> durées d'intervention (entiers) que tu ranges dans un tableau. Affiche ensuite le total et le nombre d'interventions longues (plus de 4 h) :</p><p><code>Total : 13 h</code><br><code>Interventions longues : 1</code></p>",
        starter: "import java.util.Scanner;\n\npublic class Comptage {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] heures = new int[n];\n\n    }\n}\n",
        tests: [{ input: "4\n2\n6\n1\n4\n", label: "4 interventions" }, { input: "1\n8\n", label: "une seule" }, { input: "0\n", label: "aucune" }],
        solution: "s4_comptage", hint: "<p>Première boucle : <code>heures[i] = sc.nextInt();</code>. Seconde boucle : total et comptage. Attention, « plus de 4 h » se traduit par <code>&gt; 4</code>.</p>" }
    ],

    tp: {
      title: "TP 4 — Recherche d'un équipement", duration: "1 h", deliverable: "recherche par référence",
      intro: "Le service garde la liste des références de son matériel. Tu écris un petit outil qui affiche l'inventaire numéroté et permet de retrouver un équipement par sa référence, sans tenir compte des majuscules.",
      steps: [
        "TD : sur papier, trace le parcours du tableau pour la recherche de <code>IMP-01</code> (valeurs de i et de position à chaque tour).",
        "Déclare et initialise le tableau des 6 références.",
        "Affiche l'inventaire numéroté à partir de 1 (partie A).",
        "Lis une référence et recherche-la sans tenir compte de la casse (partie B).",
        "Teste avec une référence en minuscules, une référence absente et des espaces autour.",
        "Bonus : compte les équipements par type (partie C)."
      ],
      parts: [
        { title: "Afficher l'inventaire numéroté", html: K.p("Avec le tableau <code>{\"PC-01\", \"PC-02\", \"PC-03\", \"IMP-01\", \"IMP-02\", \"SW-01\"}</code>, affiche l'en-tête <code>Inventaire (6 equipements) :</code> (le nombre vient de <code>length</code>) puis une ligne numérotée par équipement : <code>1. PC-01</code>…"),
          write: { file: "Liste.java", statement: "", starter: "public class Liste {\n    public static void main(String[] args) {\n        String[] refs = {\"PC-01\", \"PC-02\", \"PC-03\", \"IMP-01\", \"IMP-02\", \"SW-01\"};\n\n    }\n}\n", tests: [{ label: "inventaire" }], example: true, solution: "s4_tpa" } },
        { title: "Rechercher une référence", html: K.p("Lis une ligne, enlève les espaces autour avec <code>trim()</code>, puis cherche-la avec <code>equalsIgnoreCase</code>. Affiche <code>Trouve : IMP-01 (n 4)</code> ou <code>Aucun equipement XXX</code>."),
          write: { file: "Cherche.java", statement: "", starter: "import java.util.Scanner;\n\npublic class Cherche {\n    public static void main(String[] args) {\n        String[] refs = {\"PC-01\", \"PC-02\", \"PC-03\", \"IMP-01\", \"IMP-02\", \"SW-01\"};\n        Scanner sc = new Scanner(System.in);\n        String cherchee = sc.nextLine().trim();\n\n    }\n}\n",
            tests: [{ input: "IMP-01\n", label: "référence exacte" }, { input: "pc-03\n", label: "en minuscules" }, { input: "  SW-01  \n", label: "avec espaces" }, { input: "PC-99\n", label: "absente" }], solution: "s4_tpb" } },
        { title: "Bonus : compter par type", bonus: true, html: K.p("Compte les ordinateurs (préfixe <code>PC-</code>), les imprimantes (<code>IMP-</code>) et les autres équipements, avec <code>startsWith</code>."),
          write: { file: "ParType.java", statement: "", starter: "public class ParType {\n    public static void main(String[] args) {\n        String[] refs = {\"PC-01\", \"PC-02\", \"PC-03\", \"IMP-01\", \"IMP-02\", \"SW-01\"};\n\n    }\n}\n", tests: [{ label: "comptage" }], example: true, solution: "s4_tpc" } },
        { title: "Version complète (pour ton IDE)", html: K.p("Les deux parties réunies, avec une question avant la saisie :") + K.run("s4_tp") }
      ]
    },

    quiz: [
      { q: "Quel est l'indice du premier élément d'un tableau ?", o: ["1", "0", "-1", "Ça dépend du tableau"], a: 1, e: "Toujours 0." },
      { q: "Quelle déclaration crée un tableau de 10 entiers ?", o: ["<code>int t = new int[10];</code>", "<code>int[] t = new int[10];</code>", "<code>int[10] t;</code>", "<code>int t[] = 10;</code>"], a: 1, e: "Le type est <code>int[]</code> et la taille se donne après <code>new int</code>." },
      { q: "Que se passe-t-il avec <code>t[t.length]</code> ?", o: ["On obtient la dernière case", "ArrayIndexOutOfBoundsException à l'exécution", "Erreur de compilation", "On obtient 0"], a: 1, e: "L'indice maximum est <code>length - 1</code>." },
      { q: "Qu'affiche ce code ?", code: ["int[] t = {3, 8, 2};", "int s = 0;", "for (int x : t) s += x;", "System.out.println(s);"], o: ["3", "13", "8", "382"], a: 1, e: "3 + 8 + 2 = 13." },
      { q: "Pour trouver le maximum d'un tableau, on initialise <code>max</code> avec :", o: ["0", "la première case du tableau", "-1", "t.length"], a: 1, e: "Ainsi le résultat est correct même si toutes les valeurs sont négatives." },
      { q: "Que vaut <code>\"Routeur\".length()</code> ?", o: ["6", "7", "8", "Erreur : il faut length sans parenthèses"], a: 1, e: "7 caractères. Pour un String, <code>length()</code> avec parenthèses." },
      { q: "Comment comparer le contenu de deux String <code>a</code> et <code>b</code> ?", o: ["<code>a == b</code>", "<code>a.equals(b)</code>", "<code>a = b</code>", "<code>a.compare(b)</code>"], a: 1, e: "<code>==</code> compare les références, <code>equals</code> le contenu." },
      { q: "Que vaut <code>\"IMP-07\".indexOf(\"-\")</code> ?", o: ["3", "4", "-1", "2"], a: 0, e: "I(0) M(1) P(2) -(3)." },
      { q: "Après <code>String s = \"pc\"; s.toUpperCase();</code>, que vaut <code>s</code> ?", o: ["\"PC\"", "\"pc\"", "null", "Erreur"], a: 1, e: "Un String ne change jamais : il faut écrire <code>s = s.toUpperCase();</code>." },
      { q: "Que renvoie <code>\"A;B;C\".split(\";\")</code> ?", o: ["Le texte \"ABC\"", "Un tableau de 3 String", "Le nombre 3", "Un tableau de 2 String"], a: 1, e: "{\"A\", \"B\", \"C\"}." },
      { q: "Dans une recherche, pourquoi initialiser <code>position</code> à -1 ?", o: ["Parce que les indices commencent à -1", "Parce qu'aucun indice réel ne vaut -1 : cela signifie « pas trouvé »", "Pour éviter une erreur de compilation", "Par habitude, sans raison"], a: 1, e: "C'est une valeur impossible pour un indice, donc un bon signal." },
      { q: "Quelle est une limite des tableaux ?", o: ["Ils ne peuvent contenir que des int", "Leur taille est fixée à la création", "On ne peut pas les parcourir avec for", "Ils ne commencent pas à 0"], a: 1, e: "Pour une taille variable : ArrayList (séance 7)." }
    ],

    video: { src: "media/seance4.mp4", title: "tableaux et chaînes", dur: 92, chapters: [[0, "Titre"], [5, "Un tableau"], [16, "Parcourir"], [27, "Rechercher"], [40, "Maximum"], [52, "Méthodes de String"], [63, "equals ou =="], [74, "Hors limites"], [84, "À retenir"]] },
    youtube: [
      { t: "Les tableaux en Java", src: "Recherche YouTube", d: "Déclaration, indices, parcours, length.", q: "java tableaux array débutant français" },
      { t: "La classe String et ses méthodes", src: "Recherche YouTube", d: "length, charAt, substring, equals, split.", q: "java String méthodes substring equals français" },
      { t: "Recherche et maximum dans un tableau", src: "Recherche YouTube", d: "Algorithmes de base sur les tableaux.", q: "java tableau recherche maximum algorithme français" }
    ],
    docs: [
      { t: "Arrays (Java Tutorials)", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html", d: "Création, initialisation et copie de tableaux." },
      { t: "Strings (Java Tutorials)", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/java/data/strings.html", d: "Manipuler et comparer des chaînes." },
      { t: "Classe String (Javadoc Java 21)", src: "docs.oracle.com", u: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html", d: "Toutes les méthodes de String." }
    ],
    memo: {
      cards: [
        ["Créer", "<code>int[] t = new int[5];</code> (cases à 0) · <code>String[] r = {\"PC-01\", \"PC-02\"};</code>"],
        ["Accéder", "<code>t[0]</code> … <code>t[t.length - 1]</code> · <code>t.length</code> sans parenthèses · au-delà : ArrayIndexOutOfBoundsException."],
        ["Parcourir", "<code>for (int i = 0; i &lt; t.length; i++)</code> (avec indice) · <code>for (int x : t)</code> (lecture seule)."],
        ["Algorithmes", "total += · max = t[0] puis comparer · compteur++ si condition · recherche : position = -1, puis i si trouvé, break."],
        ["String", "<code>length()</code> <code>charAt(i)</code> <code>substring(a, b)</code> <code>indexOf(t)</code> <code>contains(t)</code> <code>startsWith(t)</code> <code>toUpperCase()</code> <code>trim()</code> <code>split(\";\")</code>"],
        ["Comparer", "Textes : <code>a.equals(b)</code>, <code>a.equalsIgnoreCase(b)</code> · jamais <code>==</code> · un String ne change pas : <code>s = s.trim();</code>"]
      ],
      code: P.s4_recherche.code, codeTitle: "Modèle : la recherche séquentielle",
      errors: [["<code>ArrayIndexOutOfBoundsException</code>", "<code>i &lt;= t.length</code>", "<code>i &lt; t.length</code>"], ["<code>cannot find symbol … length()</code> sur un tableau", "Parenthèses en trop", "<code>t.length</code>"], ["<code>cannot find symbol … length</code> sur un String", "Parenthèses oubliées", "<code>s.length()</code>"], ["Comparaison toujours fausse", "<code>==</code> sur des String", "<code>equals</code>"], ["<code>StringIndexOutOfBoundsException</code>", "<code>charAt</code> / <code>substring</code> hors du texte", "Vérifier <code>length()</code>"], ["Le texte n'a pas changé", "Résultat de toUpperCase / trim ignoré", "Réaffecter : <code>s = s.trim();</code>"]],
      glossary: [["Tableau", "Suite de cases du même type, de taille fixe."], ["Indice", "Numéro d'une case, à partir de 0."], ["length", "Nombre de cases d'un tableau (attribut, sans parenthèses)."], ["for-each", "Boucle <code>for (type x : tableau)</code> qui visite chaque valeur."], ["Recherche séquentielle", "Parcours case par case jusqu'à trouver la valeur."], ["String", "Classe représentant un texte ; ses objets ne changent jamais."], ["Méthode", "Action appelée sur un objet avec un point : <code>s.length()</code>."], ["Référence", "Adresse d'un objet en mémoire ; == compare des références."]],
      selfcheck: ["Je sais créer un tableau avec des valeurs ou avec une taille.", "Je sais parcourir un tableau sans dépasser ses limites.", "Je sais calculer un total, un maximum et compter des valeurs.", "Je sais écrire une recherche qui renvoie -1 si rien n'est trouvé.", "Je connais les principales méthodes de String et j'utilise equals pour comparer.", "J'ai réalisé le TP 4 (recherche d'un équipement)."],
      next: "Séance 5 : méthodes et organisation du code. Tu découperas tes programmes en méthodes (saisie, calcul, affichage, menu) pour les rendre lisibles et réutilisables."
    }
  };
})();
