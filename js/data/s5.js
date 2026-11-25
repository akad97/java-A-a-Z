(function () {
  var P = COURSE.progs;
  COURSE.seances.push({ id: "s5", tag: "S-05", short: "Méthodes" });

  P.s5_avant = { file: "Rapport.java", lab: "Avant : du code répété", code:
`public class Rapport {
    public static void main(String[] args) {
        System.out.println("==============================");
        System.out.println("RAPPORT DU POSTE PC-01");
        System.out.println("==============================");
        System.out.println("Etat : OK");
        System.out.println("==============================");
        System.out.println("RAPPORT DU POSTE PC-02");
        System.out.println("==============================");
        System.out.println("Etat : EN PANNE");
    }
}
` };
  P.s5_apres = { file: "RapportMethodes.java", lab: "Après : une méthode réutilisée", code:
`public class RapportMethodes {

    static void afficherRapport(String poste, String etat) {
        System.out.println("==============================");
        System.out.println("RAPPORT DU POSTE " + poste);
        System.out.println("==============================");
        System.out.println("Etat : " + etat);
    }

    public static void main(String[] args) {
        afficherRapport("PC-01", "OK");
        afficherRapport("PC-02", "EN PANNE");
        afficherRapport("IMP-01", "OK");
    }
}
` };
  P.s5_cout = { file: "Devis.java", lab: "Décomposer un calcul en méthodes", code:
`public class Devis {
    static final double TAUX_TVA = 0.18;

    static double mainOeuvre(int heures, double tarif) {
        return heures * tarif;
    }

    static double totalTTC(double totalHT) {
        return totalHT * (1 + TAUX_TVA);
    }

    static void afficherLigne(String libelle, double montant) {
        System.out.printf("%-14s %10.2f FCFA%n", libelle, montant);
    }

    public static void main(String[] args) {
        double pieces = 25000;
        double mo = mainOeuvre(3, 7500);
        double ht = pieces + mo;
        afficherLigne("Pieces", pieces);
        afficherLigne("Main d'oeuvre", mo);
        afficherLigne("Total TTC", totalTTC(ht));
    }
}
` };
  P.s5_retour = { file: "Regles.java", lab: "Méthodes qui renvoient un résultat", code:
`public class Regles {

    static boolean sousGarantie(int ageMois) {
        return ageMois < 24;
    }

    static String niveauDisque(int pct) {
        if (pct >= 90) {
            return "Critique";
        } else if (pct >= 70) {
            return "Attention";
        }
        return "OK";
    }

    static int maximum(int[] valeurs) {
        int max = valeurs[0];
        for (int v : valeurs) {
            if (v > max) {
                max = v;
            }
        }
        return max;
    }

    public static void main(String[] args) {
        System.out.println(sousGarantie(14));
        System.out.println(niveauDisque(75));
        int[] temps = {61, 84, 72};
        System.out.println("Max : " + maximum(temps));
        if (!sousGarantie(30)) {
            System.out.println("Réparation facturée");
        }
    }
}
` };
  P.s5_valeur = { file: "Passage.java", lab: "Passage des paramètres", code:
`public class Passage {

    static void augmenter(int heures) {
        heures = heures + 10;
        System.out.println("Dans la méthode : " + heures);
    }

    static void remettreAZero(int[] stock) {
        stock[0] = 0;
    }

    public static void main(String[] args) {
        int h = 2;
        augmenter(h);
        System.out.println("Dans main : " + h);

        int[] stock = {12, 5};
        remettreAZero(stock);
        System.out.println("Stock[0] : " + stock[0]);
    }
}
` };
  P.s5_surcharge = { file: "Surcharge.java", code:
`public class Surcharge {
    static double cout(int heures) {
        return cout(heures, 7500);
    }

    static double cout(int heures, double tarif) {
        return heures * tarif;
    }

    public static void main(String[] args) {
        System.out.println(cout(2));
        System.out.println(cout(2, 9000));
    }
}
` };
  P.s5_trace = { file: "Appels.java", code:
`public class Appels {
    static int doubler(int x) {
        System.out.println("doubler(" + x + ")");
        return x * 2;
    }

    static int ajouter(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        int r = ajouter(doubler(3), 4);
        System.out.println(r);
        System.out.println(doubler(ajouter(1, 1)));
    }
}
` };
  P.s5_bug = { file: "Outils.java", code:
`public class Outils {
    static double tva(double ht) {
        double montant = ht * 0.18;
    }
    static void afficher(String texte) {
        System.out.println(texte);
    }
    public static void main(String[] args) {
        double t = tva(1000, 2);
        String r = afficher("OK");
        System.out.println(t + r);
    }
}
` };
  P.s5_static = { file: "Compteur.java", lab: "Erreur : méthode non static", code:
`public class Compteur {
    int total = 0;

    void ajouter(int n) {
        total += n;
    }

    public static void main(String[] args) {
        ajouter(5);
        System.out.println("Total : " + total);
    }
}
` };
  P.s5_batterie = { file: "Batterie.java", code:
`import java.util.Scanner;

public class Batterie {
    static String etatBatterie(int pct) {
        if (pct < 20) {
            return "Faible";
        } else if (pct < 60) {
            return "Moyenne";
        }
        return "Bonne";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            int pct = sc.nextInt();
            System.out.println(pct + " % : " + etatBatterie(pct));
        }
    }
}
` };
  P.s5_tableau = { file: "Statistiques.java", code:
`import java.util.Scanner;

public class Statistiques {
    static double moyenne(int[] t) {
        int somme = 0;
        for (int v : t) {
            somme += v;
        }
        return (double) somme / t.length;
    }

    static int indiceMax(int[] t) {
        int iMax = 0;
        for (int i = 1; i < t.length; i++) {
            if (t[i] > t[iMax]) {
                iMax = i;
            }
        }
        return iMax;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] t = new int[n];
        for (int i = 0; i < n; i++) {
            t[i] = sc.nextInt();
        }
        System.out.println("Moyenne : " + moyenne(t));
        System.out.println("Max en position " + indiceMax(t) + " : " + t[indiceMax(t)]);
    }
}
` };
  P.s5_format = { file: "FormatId.java", code:
`import java.util.Scanner;

public class FormatId {
    static String formaterId(String type, int numero) {
        String chiffres = "" + numero;
        while (chiffres.length() < 3) {
            chiffres = "0" + chiffres;
        }
        return type.toUpperCase() + "-" + chiffres;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        int numero = sc.nextInt();
        System.out.println(formaterId(type, numero));
    }
}
` };
  P.s5_tp = { file: "Maintenance.java", lab: "TP 5 : programme découpé en méthodes", input: "1\n2\n2\n15000\n3\n0\n", code:
`import java.util.Scanner;

public class Maintenance {
    static final double TARIF_HORAIRE = 7500;
    static final double TAUX_TVA = 0.18;
    static Scanner sc = new Scanner(System.in);

    // Affiche le menu principal
    static void afficherMenu() {
        System.out.println("1. Diagnostic  2. Devis  0. Quitter");
        System.out.print("Choix : ");
    }

    // Lit un entier compris entre min et max (redemande sinon)
    static int lireEntier(String question, int min, int max) {
        System.out.print(question);
        int valeur = sc.nextInt();
        while (valeur < min || valeur > max) {
            System.out.print("Valeur entre " + min + " et " + max + " : ");
            valeur = sc.nextInt();
        }
        return valeur;
    }

    // Renvoie le libellé d'un code d'erreur
    static String diagnostiquer(int code) {
        switch (code) {
            case 1: return "Memoire RAM defectueuse";
            case 2: return "Disque dur non detecte";
            case 3: return "Surchauffe processeur";
            default: return "Code inconnu";
        }
    }

    // Calcule le coût TTC d'une intervention
    static double coutTTC(double pieces, int heures) {
        double ht = pieces + heures * TARIF_HORAIRE;
        return ht * (1 + TAUX_TVA);
    }

    public static void main(String[] args) {
        int choix;
        do {
            afficherMenu();
            choix = sc.nextInt();
            if (choix == 1) {
                int code = lireEntier("Code (1-9) : ", 1, 9);
                System.out.println(diagnostiquer(code));
            } else if (choix == 2) {
                System.out.print("Pieces (FCFA) : ");
                double pieces = sc.nextDouble();
                int heures = lireEntier("Heures (0-24) : ", 0, 24);
                System.out.printf("Cout TTC : %.2f FCFA%n", coutTTC(pieces, heures));
            }
        } while (choix != 0);
        System.out.println("Au revoir");
    }
}
` };
  P.s5_tpdiag = { file: "Diagnostic.java", code:
`import java.util.Scanner;

public class Diagnostic {
    static String diagnostiquer(int code) {
        switch (code) {
            case 1: return "Memoire RAM defectueuse";
            case 2: return "Disque dur non detecte";
            case 3: return "Surchauffe processeur";
            default: return "Code inconnu";
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            int code = sc.nextInt();
            System.out.println(code + " -> " + diagnostiquer(code));
        }
    }
}
` };
  P.s5_tpcout = { file: "Devis.java", code:
`import java.util.Scanner;

public class Devis {
    static final double TARIF_HORAIRE = 7500;
    static final double TAUX_TVA = 0.18;

    static double mainOeuvre(int heures) {
        return heures * TARIF_HORAIRE;
    }

    static double coutTTC(double pieces, int heures) {
        return (pieces + mainOeuvre(heures)) * (1 + TAUX_TVA);
    }

    static void afficherDevis(double pieces, int heures) {
        System.out.printf("Main d'oeuvre : %.2f%n", mainOeuvre(heures));
        System.out.printf("Total TTC : %.2f%n", coutTTC(pieces, heures));
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double pieces = sc.nextDouble();
        int heures = sc.nextInt();
        afficherDevis(pieces, heures);
    }
}
` };

  COURSE.data.s5 = {
    hours: "3 h", split: "CM 1 h · TD 1 h · TP 1 h", comp: "C4",
    h1: "Méthodes <em>et organisation du code</em>",
    lede: "Ton programme de maintenance grossit : saisies, calculs, affichages et menu se mélangent dans main. Tu vas le découper en méthodes, chacune avec un rôle clair, pour le rendre lisible, testable et réutilisable.",
    prereq: "variables, conditions, boucles, tableaux (séances 2 à 4).",
    objectives: [
      "Expliquer le rôle d'une méthode et la déclarer (type de retour, nom, paramètres)",
      "Appeler une méthode et utiliser sa valeur de retour",
      "Distinguer void et méthode qui renvoie un résultat",
      "Comprendre les variables locales et le passage des paramètres",
      "Découper un problème en sous-problèmes et nommer clairement"
    ],
    lesson: [
      { title: "Pourquoi des méthodes ?", html:
        K.p("Regarde ce programme : les mêmes lignes reviennent pour chaque poste. Pour en ajouter un troisième, il faudrait copier-coller encore ; pour changer la présentation, modifier chaque copie.") + K.run("s5_avant") +
        K.p("Une <b>méthode</b> est un bloc d'instructions qui porte un nom. On l'écrit une fois, on l'appelle autant de fois qu'on veut, avec des valeurs différentes :") + K.run("s5_apres") +
        K.tiles([["Éviter la répétition", "Une seule version du code : une correction profite à tous les appels."], ["Découper", "Un gros problème devient plusieurs petits, chacun facile à comprendre."], ["Nommer", "<code>afficherRapport(…)</code> dit ce que fait le code, sans lire son détail."], ["Tester", "On vérifie chaque méthode séparément, avec des valeurs choisies."]]) },
      { title: "Déclarer une méthode", html:
        K.code(["static double mainOeuvre(int heures, double tarif) {", "//  │      │          │", "//  │      │          └── paramètres : type et nom de chaque valeur reçue", "//  │      └── nom : un verbe, en camelCase", "//  └── type de retour : le type du résultat, ou void s'il n'y en a pas", "    return heures * tarif;", "}"]) +
        K.p("Les méthodes se déclarent <b>dans la classe</b>, à côté de <code>main</code> (jamais à l'intérieur d'une autre méthode). Pour l'instant, on les marque <code>static</code>, comme <code>main</code> : elles appartiennent à la classe et s'appellent directement par leur nom. La séance 6 montrera les méthodes non static, liées à un objet.") +
        K.run("s5_cout") +
        K.p("Pour appeler une méthode, on écrit son nom suivi des <b>arguments</b> entre parenthèses, dans le même ordre et du même type que les paramètres : <code>mainOeuvre(3, 7500)</code>. Le résultat peut être rangé dans une variable, affiché, ou utilisé directement dans un calcul ou un autre appel : <code>afficherLigne(\"Total TTC\", totalTTC(ht))</code>."),
        check: { q: "Quelle est la signature correcte d'une méthode qui reçoit un prix et un taux et renvoie le prix TTC ?", o: ["<code>static void ttc(double prix, double taux)</code>", "<code>static double ttc(double prix, double taux)</code>", "<code>static double ttc(prix, taux)</code>", "<code>double static ttc(double prix, taux)</code>"], a: 1, e: "Elle renvoie un décimal : type de retour <code>double</code>. Chaque paramètre a son type." } },
      { title: "return ou void ?", html:
        K.table(["", "Méthode avec résultat", "Méthode void"], [["Type de retour", "<code>int</code>, <code>double</code>, <code>boolean</code>, <code>String</code>…", "<code>void</code>"], ["Contient", "au moins un <code>return valeur;</code> sur chaque chemin", "aucun <code>return</code> (ou <code>return;</code> seul)"], ["S'appelle", "dans une expression : <code>double x = f(…);</code>", "comme une instruction : <code>f(…);</code>"], ["Exemple", "<code>calculer…</code>, <code>est…</code>, <code>niveau…</code>", "<code>afficher…</code>, <code>enregistrer…</code>"]]) +
        K.run("s5_retour") +
        K.p("<code>return</code> renvoie la valeur <b>et termine immédiatement</b> la méthode. Dans <code>niveauDisque</code>, si pct ≥ 90, le premier <code>return</code> s'exécute et la suite n'est jamais atteinte. Java vérifie qu'<b>aucun chemin</b> ne se termine sans <code>return</code> : sinon, erreur <code>missing return statement</code>.") +
        K.warn("Afficher n'est pas renvoyer", "Une méthode qui fait <code>System.out.println(résultat)</code> au lieu de <code>return résultat;</code> ne transmet rien à l'appelant : on ne peut pas réutiliser la valeur dans un calcul. En général, les méthodes de calcul <b>renvoient</b>, et c'est main (ou une méthode d'affichage) qui affiche."),
        check: { q: "<code>static void afficher(String t)</code> : que donne <code>String r = afficher(\"OK\");</code> ?", o: ["r vaut \"OK\"", "r vaut null", "Erreur de compilation : void cannot be converted to String", "Erreur à l'exécution"], a: 2, e: "Une méthode void ne renvoie rien : il n'y a pas de valeur à ranger dans r." } },
      { title: "Paramètres, variables locales et portée", html:
        K.p("Les paramètres et les variables déclarées dans une méthode sont <b>locales</b> : elles naissent à l'appel et disparaissent à la fin de la méthode. Deux méthodes peuvent avoir une variable du même nom sans conflit ; main ne voit pas les variables de <code>mainOeuvre</code>, et inversement.",
          "À l'appel, Java <b>copie la valeur</b> de chaque argument dans le paramètre correspondant. Modifier le paramètre ne change donc pas la variable de l'appelant :") +
        K.run("s5_valeur") +
        K.note("Et le tableau ?", "Pour un tableau (ou un objet), ce qui est copié, c'est la <b>référence</b> (l'adresse). La méthode travaille donc sur le même tableau que main : ses modifications sont visibles. C'est ce qui se passe avec <code>remettreAZero</code>.") +
        K.p("Les constantes déclarées <code>static final</code> en dehors des méthodes (comme <code>TAUX_TVA</code> dans Devis) sont visibles par toutes les méthodes de la classe."),
        check: { q: "Après <code>int h = 2; augmenter(h);</code>, que vaut h dans main ?", o: ["12", "2", "10", "0"], a: 1, e: "La méthode a reçu une copie de la valeur 2 ; elle a modifié sa copie, pas la variable h de main." } },
      { title: "Suivre les appels", html:
        K.p("Quand une méthode est appelée, l'exécution de l'appelant est <b>mise en pause</b> ; la méthode s'exécute ; puis on revient juste après l'appel, avec le résultat. Les arguments sont évalués <b>avant</b> l'appel : dans <code>ajouter(doubler(3), 4)</code>, <code>doubler(3)</code> s'exécute d'abord.") +
        K.run("s5_trace") +
        K.p("Le mode pas à pas de l'onglet Démos affiche le nom de la méthode en cours au-dessus du tableau des variables : tu y vois les appels s'empiler puis revenir.") },
      { title: "Découper un problème", html:
        K.p("Pour concevoir un programme en méthodes, pars du besoin et découpe-le en actions simples. Exemple pour le calcul du coût d'une intervention :") +
        '<div class="flow"><span class="box q">main</span><span class="arr">→</span><span class="box">lireEntier(question, min, max)</span><span class="arr">→</span><span class="box">mainOeuvre(heures)</span><span class="arr">→</span><span class="box">coutTTC(pieces, heures)</span><span class="arr">→</span><span class="box">afficherDevis(…)</span></div>' +
        K.ol(["<b>Lister les étapes</b> en français : saisir, calculer, afficher.", "<b>Pour chaque étape</b>, se demander : de quelles données a-t-elle besoin (paramètres) ? que produit-elle (type de retour) ?", "<b>Écrire et tester</b> chaque méthode seule, avec des valeurs connues, avant de les assembler dans main.", "<b>main devient un sommaire</b> : quelques appels qui racontent le déroulement."]) +
        K.p("Une bonne méthode fait <b>une seule chose</b>, tient sur un écran et porte un nom qui commence par un verbe : <code>calculerTTC</code>, <code>afficherMenu</code>, <code>estValide</code>, <code>lireEntier</code>.") },
      { title: "Surcharge, nommage et commentaires utiles", html:
        K.p("Deux méthodes peuvent porter le même nom si leurs paramètres diffèrent (nombre ou types) : c'est la <b>surcharge</b>. Java choisit selon les arguments fournis.") + K.run("s5_surcharge") +
        K.p("Commente <b>le pourquoi</b>, pas le comment. Le nom de la méthode et de ses paramètres doit déjà dire ce qu'elle fait ; un commentaire au-dessus précise ce qui n'est pas évident (unité, cas particuliers). Le format <code>/** … */</code> (Javadoc) est reconnu par les IDE, qui l'affichent au survol :") +
        K.code(["/**", " * Calcule le coût TTC d'une intervention.", " * @param pieces prix des pièces en FCFA, hors taxes", " * @param heures durée en heures (0 à 24)", " * @return le montant toutes taxes comprises", " */", "static double coutTTC(double pieces, int heures) { … }"]) +
        K.warn("Erreur fréquente : oublier static", "Si une méthode n'est pas <code>static</code>, main ne peut pas l'appeler directement : <code>non-static method … cannot be referenced from a static context</code>. Essaie :") + K.run("s5_static") }
    ],

    demos: [
      { type: "stepper", title: "Les appels s'empilent", prog: "s5_trace", intro: "Observe l'indication « dans … » au-dessus des variables : on entre dans <code>doubler</code>, on en ressort avec le résultat, puis on entre dans <code>ajouter</code>.",
        notes: { 12: "Pour calculer <code>ajouter(doubler(3), 4)</code>, Java doit d'abord connaître la valeur de <code>doubler(3)</code> : il appelle doubler.", 3: "On est dans <code>doubler</code> : le paramètre x vaut la valeur passée.", 4: "<code>return</code> renvoie le résultat à l'appelant et termine la méthode.", 8: "Dans <code>ajouter</code>, a et b sont des copies des arguments.", 13: "De retour dans main : r contient le résultat.", 14: "Ici, c'est l'inverse : <code>ajouter(1, 1)</code> d'abord, puis doubler(2)." } },
      { type: "stepper", title: "Un programme découpé : le devis", prog: "s5_cout", intro: "main ne fait que des appels ; chaque calcul est dans sa méthode.",
        notes: { 18: "Appel de <code>mainOeuvre(3, 7500)</code> : 3 est copié dans heures, 7500 dans tarif (converti en 7500.0).", 5: "Le calcul se fait dans la méthode et le résultat est renvoyé.", 22: "<code>totalTTC(ht)</code> est appelé d'abord ; son résultat devient le second argument d'<code>afficherLigne</code>.", 13: "Une méthode void : elle affiche, sans rien renvoyer." } },
      { type: "lab" }
    ],

    exercises: [
      { type: "predict", title: "Ordre des appels", lvl: 2, prog: "s5_trace",
        hint: "Les arguments sont évalués avant l'appel. Chaque appel de <code>doubler</code> affiche une ligne.",
        expl: "<code>ajouter(doubler(3), 4)</code> : doubler(3) affiche <code>doubler(3)</code> et renvoie 6 ; ajouter(6, 4) renvoie 10. Puis <code>doubler(ajouter(1, 1))</code> : ajouter renvoie 2, doubler(2) affiche <code>doubler(2)</code> et renvoie 4." },
      { type: "mcq", title: "Signatures et appels", lvl: 1, items: [
        { q: "Quelle méthode convient pour « dire si un poste est sous garantie selon son âge en mois » ?", o: ["<code>static void sousGarantie(int age)</code>", "<code>static boolean sousGarantie(int ageMois)</code>", "<code>static int sousGarantie(boolean age)</code>", "<code>static String sousGarantie()</code>"], a: 1, e: "Elle reçoit un âge (int) et répond vrai ou faux (boolean)." },
        { q: "Avec <code>static double cout(int h, double tarif)</code>, quel appel est correct ?", o: ["<code>cout(7500.0, 3)</code>", "<code>cout(3, 7500)</code>", "<code>cout(3)</code>", "<code>double cout(3, 7500)</code>"], a: 1, e: "Ordre et types des paramètres : un int puis un double (7500 est converti automatiquement)." },
        { q: "Une méthode <code>void</code> peut-elle contenir <code>return;</code> ?", o: ["Non, jamais", "Oui, seul, pour sortir plus tôt", "Oui, avec une valeur", "Seulement dans main"], a: 1, e: "<code>return;</code> sans valeur termine une méthode void." },
        { q: "Où déclare-t-on une méthode ?", o: ["Dans main", "Dans la classe, à côté de main", "Dans un fichier à part obligatoirement", "Avant le mot class"], a: 1, e: "Les méthodes sont des membres de la classe ; on ne déclare pas une méthode dans une autre." }] },
      { type: "fill", title: "Compléter des en-têtes de méthodes", lvl: 1,
        statement: "Complète les trous pour que le programme compile et affiche <code>true</code> puis <code>Total : 59000.0</code>.",
        code: "public class Trous {\n    static [[boolean]] estCritique(int pct) {\n        [[return]] pct >= 90;\n    }\n\n    static double total(double ht, double [[taux]]) {\n        return ht * (1 + taux);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(estCritique(95));\n        System.out.println(\"Total : \" + [[total]](50000, 0.18));\n    }\n}",
        expl: "<code>estCritique</code> renvoie le résultat d'une comparaison : type <code>boolean</code>. Le second paramètre de <code>total</code> s'appelle <code>taux</code>, puisque c'est ce nom qu'utilise le corps de la méthode." },
      { type: "hunt", title: "Erreurs autour des méthodes", lvl: 2, code: P.s5_bug.code.replace(/\n$/, "").split("\n"), bad: [4, 9, 10],
        fixes: {
          4: { msg: "Outils.java:4: error: missing return statement", fr: "La méthode annonce un résultat <code>double</code> mais n'a pas de <code>return</code>. Le calcul est fait, puis perdu.", fix: "        return montant;   // (avant l'accolade)" },
          9: { msg: "Outils.java:9: error: method tva in class Outils cannot be applied to given types;\n  required: double\n  found:    int,int", fr: "<code>tva</code> attend un seul argument ; l'appel en donne deux.", fix: "        double t = tva(1000);" },
          10: { msg: "Outils.java:10: error: incompatible types: void cannot be converted to String", fr: "<code>afficher</code> est void : elle ne renvoie rien qu'on puisse ranger dans <code>r</code>.", fix: "        afficher(\"OK\");   // appel seul, sans affectation" } },
        order: "Vérifié avec javac : il signale d'abord les lignes 9 et 10 (erreurs de types). Le <code>missing return statement</code> de la ligne 4 n'apparaît qu'une fois celles-ci corrigées, car il est détecté dans une étape d'analyse ultérieure." },
      { type: "write", title: "Une méthode qui classe", lvl: 1, file: "Batterie.java",
        statement: "<p>Écris la méthode <code>static String etatBatterie(int pct)</code> qui renvoie <code>Faible</code> sous 20 %, <code>Moyenne</code> sous 60 % et <code>Bonne</code> sinon. Le main fourni lit un nombre n puis n pourcentages et affiche <code>45 % : Moyenne</code> pour chacun ; ne le modifie pas.</p>",
        starter: "import java.util.Scanner;\n\npublic class Batterie {\n    // Écris la méthode etatBatterie ici\n\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int i = 0; i < n; i++) {\n            int pct = sc.nextInt();\n            System.out.println(pct + \" % : \" + etatBatterie(pct));\n        }\n    }\n}\n",
        tests: [{ input: "3\n10\n45\n80\n", label: "trois niveaux" }, { input: "3\n19\n20\n60\n", label: "valeurs limites" }, { input: "0\n", label: "aucune valeur" }],
        solution: "s5_batterie", hint: "<p>Trois <code>return</code> : un dans chaque cas. Attention aux limites : 20 est « Moyenne », 60 est « Bonne ».</p>" },
      { type: "write", title: "Méthodes sur un tableau", lvl: 3, file: "Statistiques.java",
        statement: "<p>Écris <code>static double moyenne(int[] t)</code> et <code>static int indiceMax(int[] t)</code> (indice de la plus grande valeur ; la première en cas d'égalité). Le main fourni lit n puis n valeurs, puis affiche <code>Moyenne : …</code> et <code>Max en position … : …</code>.</p>",
        starter: "import java.util.Scanner;\n\npublic class Statistiques {\n    // moyenne et indiceMax ici\n\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] t = new int[n];\n        for (int i = 0; i < n; i++) {\n            t[i] = sc.nextInt();\n        }\n        System.out.println(\"Moyenne : \" + moyenne(t));\n        System.out.println(\"Max en position \" + indiceMax(t) + \" : \" + t[indiceMax(t)]);\n    }\n}\n",
        tests: [{ input: "4\n3\n9\n2\n9\n", label: "max en double" }, { input: "1\n5\n", label: "une valeur" }, { input: "3\n-4\n-1\n-7\n", label: "valeurs négatives" }],
        solution: "s5_tableau", hint: "<p>Pour la moyenne, n'oublie pas le cast <code>(double)</code>. Pour le maximum, compare avec <code>t[iMax]</code> et utilise <code>&gt;</code> (strict) pour garder la première position en cas d'égalité.</p>" },
      { type: "write", title: "Formater un identifiant", lvl: 2, file: "FormatId.java",
        statement: "<p>Écris <code>static String formaterId(String type, int numero)</code> qui renvoie le type en majuscules, un tiret et le numéro sur 3 chiffres : <code>formaterId(\"pc\", 7)</code> → <code>PC-007</code>, <code>formaterId(\"imp\", 42)</code> → <code>IMP-042</code>. Le main fourni lit le type (un mot) et le numéro.</p>",
        starter: "import java.util.Scanner;\n\npublic class FormatId {\n\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String type = sc.next();\n        int numero = sc.nextInt();\n        System.out.println(formaterId(type, numero));\n    }\n}\n",
        tests: [{ input: "pc 7\n", label: "pc 7" }, { input: "imp 42\n", label: "imp 42" }, { input: "SW 123\n", label: "SW 123" }],
        solution: "s5_format", hint: "<p>Transforme le numéro en texte (<code>\"\" + numero</code>) puis ajoute des <code>\"0\"</code> devant tant que sa longueur est inférieure à 3. Ou bien : <code>String.format(\"%03d\", numero)</code>.</p>" }
    ],

    tp: {
      title: "TP 5 — Découper le programme de maintenance", duration: "1 h", deliverable: "code structuré",
      intro: "Tu reprends le menu de maintenance des séances précédentes et tu le réorganises : chaque action devient une méthode (saisie, calcul, diagnostic, affichage, menu). Le comportement reste le même ; c'est la structure qui change.",
      steps: [
        "TD : décompose le calcul du coût en étapes et écris l'en-tête de chaque méthode (paramètres, type de retour).",
        "Écris et teste <code>diagnostiquer(int code)</code> qui renvoie un libellé (partie A).",
        "Écris <code>mainOeuvre</code>, <code>coutTTC</code> et <code>afficherDevis</code> (partie B).",
        "Écris <code>lireEntier(question, min, max)</code> qui redemande tant que la valeur est hors limites.",
        "Réécris main pour qu'il ne contienne plus que la boucle du menu et des appels.",
        "Ajoute un commentaire d'une ligne au-dessus de chaque méthode."
      ],
      parts: [
        { title: "Une méthode de diagnostic", html: K.p("Écris <code>static String diagnostiquer(int code)</code> : 1 → <code>Memoire RAM defectueuse</code>, 2 → <code>Disque dur non detecte</code>, 3 → <code>Surchauffe processeur</code>, autre → <code>Code inconnu</code>. Le main lit n codes et affiche <code>2 -&gt; Disque dur non detecte</code>."),
          write: { file: "Diagnostic.java", statement: "", starter: "import java.util.Scanner;\n\npublic class Diagnostic {\n\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int i = 0; i < n; i++) {\n            int code = sc.nextInt();\n            System.out.println(code + \" -> \" + diagnostiquer(code));\n        }\n    }\n}\n",
            tests: [{ input: "4\n1\n2\n3\n8\n", label: "quatre codes" }], solution: "s5_tpdiag", expl: "Dans un switch, un <code>return</code> termine la méthode : pas besoin de <code>break</code>." } },
        { title: "Le devis en trois méthodes", html: K.p("Écris <code>mainOeuvre(int heures)</code> (7500 FCFA de l'heure), <code>coutTTC(double pieces, int heures)</code> (TVA 18 %) et <code>afficherDevis(double pieces, int heures)</code> qui affiche deux lignes avec deux décimales. main lit les pièces puis les heures et appelle <code>afficherDevis</code>."),
          write: { file: "Devis.java", statement: "", starter: "import java.util.Scanner;\n\npublic class Devis {\n    static final double TARIF_HORAIRE = 7500;\n    static final double TAUX_TVA = 0.18;\n\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double pieces = sc.nextDouble();\n        int heures = sc.nextInt();\n        afficherDevis(pieces, heures);\n    }\n}\n",
            tests: [{ input: "25000\n3\n", label: "25000 et 3 h" }, { input: "0\n1\n", label: "sans pièce" }], example: true, solution: "s5_tpcout",
            expl: "<code>coutTTC</code> réutilise <code>mainOeuvre</code> : le tarif horaire n'apparaît qu'à un seul endroit." } },
        { title: "Le programme complet", html: K.p("Toutes les méthodes réunies : main n'est plus qu'un sommaire. Le Scanner est déclaré <code>static</code> dans la classe pour être partagé par les méthodes. Lance-le, puis ouvre-le dans le labo et passe-le en mode pas à pas.") + K.run("s5_tp") }
      ]
    },

    quiz: [
      { q: "Quel mot indique qu'une méthode ne renvoie aucun résultat ?", o: ["null", "void", "static", "return"], a: 1, e: "<code>void</code> est le « type de retour » d'une méthode qui ne renvoie rien." },
      { q: "Que fait <code>return</code> ?", o: ["Affiche la valeur", "Renvoie la valeur à l'appelant et termine la méthode", "Recommence la méthode", "Termine le programme"], a: 1, e: "L'exécution reprend dans l'appelant, juste après l'appel." },
      { q: "Combien d'arguments faut-il pour appeler <code>static int f(int a, String b, double c)</code> ?", o: ["1", "2", "3", "Autant qu'on veut"], a: 2, e: "Un argument par paramètre, dans l'ordre : un int, un String, un double." },
      { q: "Une variable déclarée dans une méthode est visible :", o: ["Dans tout le programme", "Seulement dans cette méthode (à partir de sa déclaration)", "Dans main uniquement", "Dans toutes les méthodes static"], a: 1, e: "C'est une variable locale." },
      { q: "Qu'affiche ce code ?", code: ["static void f(int x) { x = 5; }", "// dans main :", "int a = 1;", "f(a);", "System.out.println(a);"], o: ["5", "1", "0", "Erreur"], a: 1, e: "La méthode reçoit une copie de la valeur de a." },
      { q: "Le message <code>missing return statement</code> signifie :", o: ["Il manque un return sur au moins un chemin d'une méthode non void", "La méthode void contient un return", "main n'a pas de return", "Il manque un point-virgule après return"], a: 0, e: "Chaque chemin d'exécution doit se terminer par un return valeur." },
      { q: "Depuis main (static), on appelle <code>calculer()</code> déclarée sans static. Résultat :", o: ["Ça fonctionne", "Erreur : non-static method cannot be referenced from a static context", "Erreur à l'exécution", "La méthode est ignorée"], a: 1, e: "Il faut déclarer la méthode static (ou l'appeler sur un objet, séance 6)." },
      { q: "Quel nom de méthode est le mieux choisi ?", o: ["<code>m1</code>", "<code>calculerCoutTTC</code>", "<code>CoutTTC</code>", "<code>fait_tout</code>"], a: 1, e: "Un verbe, en camelCase, qui dit ce que fait la méthode." },
      { q: "La surcharge, c'est :", o: ["Une méthode trop longue", "Plusieurs méthodes de même nom avec des paramètres différents", "Une méthode qui s'appelle elle-même", "Un appel avec trop d'arguments"], a: 1, e: "Java choisit la version selon les arguments." },
      { q: "Si une méthode reçoit un tableau et modifie <code>t[0]</code>, l'appelant :", o: ["Ne voit pas la modification", "Voit la modification, car c'est le même tableau", "Reçoit une erreur", "Voit une copie modifiée"], a: 1, e: "La référence est copiée, pas le tableau : les deux désignent le même tableau." },
      { q: "Dans <code>afficher(calculer(2))</code>, quelle méthode s'exécute en premier ?", o: ["afficher", "calculer", "Les deux en même temps", "Ça dépend"], a: 1, e: "L'argument doit être calculé avant l'appel d'afficher." },
      { q: "Pourquoi découper un programme en méthodes ?", o: ["Pour qu'il s'exécute plus vite", "Pour éviter les répétitions et rendre le code lisible et testable", "Parce que Java l'impose", "Pour utiliser moins de mémoire"], a: 1, e: "C'est une question d'organisation et de maintenance du code." }
    ],

    video: { src: "media/seance5.mp4", title: "méthodes et organisation du code", dur: 93, chapters: [[0, "Titre"], [5, "Pourquoi des méthodes"], [16, "Déclarer une méthode"], [28, "Un programme découpé"], [40, "Les appels s'empilent"], [53, "Passage par valeur"], [65, "void ou return"], [75, "missing return"], [85, "À retenir"]] },
    youtube: [
      { t: "Les méthodes en Java", src: "Recherche YouTube", d: "Déclaration, paramètres, return, void.", q: "java méthodes paramètres return débutant français" },
      { t: "Méthodes static et passage par valeur", src: "Recherche YouTube", d: "Comprendre ce qui est copié à l'appel.", q: "java passage par valeur méthode static français" },
      { t: "Décomposer un programme", src: "Recherche YouTube", d: "Refactoriser un main trop long en méthodes.", q: "java refactoring méthodes découper programme français" }
    ],
    docs: [
      { t: "Defining Methods (Java Tutorials)", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html", d: "Déclaration, signature et surcharge." },
      { t: "Returning a Value from a Method", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/java/javaOO/returnvalue.html", d: "return, void et types de retour." },
      { t: "Passing Information to a Method", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html", d: "Paramètres et passage par valeur." }
    ],
    memo: {
      cards: [
        ["Déclarer", "<code>static typeRetour nom(type p1, type p2) { … }</code> · dans la classe, hors de main · <code>void</code> si pas de résultat."],
        ["Renvoyer", "<code>return valeur;</code> renvoie et termine · un return sur chaque chemin · void : <code>return;</code> seul possible."],
        ["Appeler", "<code>nom(arg1, arg2)</code> · même nombre, même ordre, types compatibles · résultat : <code>double x = nom(…);</code>"],
        ["Portée", "Paramètres et variables locales : seulement dans la méthode · constantes <code>static final</code> de la classe : partout."],
        ["Passage", "Valeur copiée : modifier un paramètre int ne change pas l'appelant · tableau / objet : même référence, modifications visibles."],
        ["Bonnes pratiques", "Une méthode = une tâche · nom en verbe (calculer…, afficher…, est…) · les calculs renvoient, l'affichage est à part · main = sommaire."]
      ],
      code: P.s5_cout.code, codeTitle: "Modèle : un programme découpé",
      errors: [["<code>missing return statement</code>", "Chemin sans return", "Ajouter un return final"], ["<code>cannot be applied to given types</code>", "Mauvais nombre ou type d'arguments", "Respecter la signature"], ["<code>void cannot be converted to …</code>", "Résultat d'une méthode void utilisé", "Renvoyer une valeur, ou appel seul"], ["<code>non-static method … static context</code>", "Méthode sans static appelée depuis main", "Ajouter static"], ["<code>cannot find symbol … method</code>", "Nom mal orthographié", "Vérifier la casse"], ["<code>incompatible types: unexpected return value</code>", "return valeur dans une méthode void", "Changer le type de retour"]],
      glossary: [["Méthode", "Bloc d'instructions nommé, appelable plusieurs fois."], ["Signature", "Nom et liste des types de paramètres d'une méthode."], ["Paramètre", "Variable déclarée dans l'en-tête, qui reçoit une valeur à l'appel."], ["Argument", "Valeur passée lors de l'appel."], ["Valeur de retour", "Résultat renvoyé par return."], ["void", "Type de retour d'une méthode qui ne renvoie rien."], ["Variable locale", "Variable qui n'existe que dans sa méthode (ou son bloc)."], ["Surcharge", "Plusieurs méthodes de même nom, paramètres différents."], ["static", "Qui appartient à la classe, appelable sans créer d'objet."]],
      selfcheck: ["Je sais écrire l'en-tête d'une méthode à partir d'une description.", "Je sais quand utiliser void et quand renvoyer une valeur.", "Je sais appeler une méthode et utiliser son résultat.", "Je sais expliquer pourquoi modifier un paramètre int ne change pas l'appelant.", "Je sais découper un problème en méthodes au nom clair.", "J'ai réalisé le TP 5 (programme découpé en méthodes)."],
      next: "Séance 6 : premiers pas en programmation orientée objet. Tu créeras les classes Ordinateur et Intervention, et des objets qui regroupent données et comportements."
    }
  };
})();
