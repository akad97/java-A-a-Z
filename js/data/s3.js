(function () {
  var P = COURSE.progs;
  COURSE.seances.push({ id: "s3", tag: "S-03", short: "Conditions & boucles" });

  P.s3_temp = { file: "Temperature.java", lab: "if / else : température", input: "78\n", code:
`import java.util.Scanner;

public class Temperature {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Température du processeur (°C) : ");
        int temp = sc.nextInt();

        if (temp > 75) {
            System.out.println("Alerte : surchauffe, nettoyer le ventilateur.");
        } else {
            System.out.println("Température normale.");
        }
        System.out.println("Diagnostic terminé.");
    }
}
` };
  P.s3_disque = { file: "Disque.java", lab: "else if : occupation du disque", input: "92\n", code:
`import java.util.Scanner;

public class Disque {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int pct = sc.nextInt();

        if (pct < 0 || pct > 100) {
            System.out.println("Valeur invalide");
        } else if (pct >= 90) {
            System.out.println("Critique : libérer de l'espace d'urgence");
        } else if (pct >= 70) {
            System.out.println("Attention : surveiller l'espace disque");
        } else {
            System.out.println("OK");
        }
    }
}
` };
  P.s3_code = { file: "CodeErreur.java", lab: "switch : code d'erreur", input: "3\n", code:
`import java.util.Scanner;

public class CodeErreur {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Code d'erreur affiché : ");
        int code = sc.nextInt();

        switch (code) {
            case 1:
                System.out.println("Mémoire RAM défectueuse");
                break;
            case 2:
                System.out.println("Disque dur non détecté");
                break;
            case 3:
            case 4:
                System.out.println("Problème d'alimentation");
                break;
            default:
                System.out.println("Code inconnu : consulter la documentation");
        }
    }
}
` };
  P.s3_fleche = { file: "Etat.java", code:
`public class Etat {
    public static void main(String[] args) {
        String etat = "EN_PANNE";
        switch (etat) {
            case "OK" -> System.out.println("Équipement en service");
            case "EN_PANNE", "HS" -> System.out.println("Ouvrir un ticket d'intervention");
            case "MAINTENANCE" -> System.out.println("Intervention en cours");
            default -> System.out.println("État inconnu");
        }
    }
}
` };
  P.s3_for = { file: "Postes.java", lab: "for : numéroter des postes", code:
`public class Postes {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println("Vérification du poste PC-0" + i);
        }
        System.out.println("Tous les postes ont été vérifiés.");
    }
}
` };
  P.s3_while = { file: "Stock.java", code:
`public class Stock {
    public static void main(String[] args) {
        int cartouches = 12;
        int jour = 0;
        while (cartouches > 3) {
            jour++;
            cartouches = cartouches - 2;
            System.out.println("Jour " + jour + " : reste " + cartouches);
        }
        System.out.println("Seuil atteint : commander des cartouches.");
    }
}
` };
  P.s3_stats = { file: "Mesures.java", lab: "Compteur et accumulateur", input: "62\n71\n85\n58\n-1\n", code:
`import java.util.Scanner;

public class Mesures {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int compteur = 0;
        int somme = 0;
        int max = 0;

        System.out.println("Températures relevées (-1 pour terminer) :");
        int t = sc.nextInt();
        while (t != -1) {
            compteur++;
            somme += t;
            if (t > max) {
                max = t;
            }
            t = sc.nextInt();
        }

        if (compteur > 0) {
            double moyenne = (double) somme / compteur;
            System.out.println(compteur + " mesures, moyenne " + moyenne + ", max " + max);
        } else {
            System.out.println("Aucune mesure.");
        }
    }
}
` };
  P.s3_valide = { file: "Validation.java", lab: "do-while : valider une saisie", input: "30\n-2\n6\n", code:
`import java.util.Scanner;

public class Validation {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int heures;
        do {
            System.out.print("Durée de l'intervention (0 à 24 h) : ");
            heures = sc.nextInt();
            if (heures < 0 || heures > 24) {
                System.out.println("Valeur hors limites, recommence.");
            }
        } while (heures < 0 || heures > 24);
        System.out.println("Durée enregistrée : " + heures + " h");
    }
}
` };
  P.s3_menu = { file: "MenuMaintenance.java", lab: "TP 3 : menu console", input: "1\n2\n2\n3\n9\n0\n", code:
`import java.util.Scanner;

public class MenuMaintenance {
    public static void main(String[] args) {
        final int TARIF = 7500;
        Scanner sc = new Scanner(System.in);
        int choix;

        do {
            System.out.println("--- MENU ---");
            System.out.println("1. Diagnostic");
            System.out.println("2. Coût");
            System.out.println("0. Quitter");
            System.out.print("Choix : ");
            choix = sc.nextInt();

            switch (choix) {
                case 1:
                    System.out.print("Code d'erreur : ");
                    int code = sc.nextInt();
                    if (code == 1) {
                        System.out.println("RAM");
                    } else if (code == 2) {
                        System.out.println("Disque");
                    } else {
                        System.out.println("Inconnu");
                    }
                    break;
                case 2:
                    System.out.print("Heures : ");
                    int heures = sc.nextInt();
                    System.out.println("Coût : " + heures * TARIF + " FCFA");
                    break;
                case 0:
                    System.out.println("Au revoir.");
                    break;
                default:
                    System.out.println("Choix invalide.");
            }
        } while (choix != 0);
    }
}
` };
  P.s3_trace = { file: "Trace.java", code:
`public class Trace {
    public static void main(String[] args) {
        int total = 0;
        for (int i = 1; i <= 4; i++) {
            total += i;
            System.out.print(total + " ");
        }
        System.out.println();
        for (int ligne = 1; ligne <= 3; ligne++) {
            for (int col = 1; col <= ligne; col++) {
                System.out.print("#");
            }
            System.out.println();
        }
    }
}
` };
  P.s3_fall = { file: "Priorite.java", code:
`public class Priorite {
    public static void main(String[] args) {
        char niveau = 'B';
        switch (niveau) {
            case 'A':
                System.out.println("Intervention immédiate");
            case 'B':
                System.out.println("Intervention sous 24 h");
            case 'C':
                System.out.println("Intervention planifiée");
                break;
            default:
                System.out.println("Niveau inconnu");
        }
    }
}
` };
  P.s3_bug = { file: "Diag.java", code:
`public class Diag {
    public static void main(String[] args) {
        int code = 3;
        if (code = 3) {
            System.out.println("Disque");
        }
        for (int i = 0; i < 3; i++) {
            int essai = i;
        }
        System.out.println(essai);
        switch (code) {
            case 1: System.out.println("RAM"); break;
            case 1: System.out.println("CPU"); break;
        }
    }
}
` };
  P.s3_classe = { file: "Occupation.java", code: P.s3_disque.code.replace("class Disque", "class Occupation") };
  P.s3_moy = { file: "Moyenne.java", code:
`import java.util.Scanner;

public class Moyenne {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        double somme = 0;
        double max = 0;
        for (int i = 1; i <= n; i++) {
            double t = sc.nextDouble();
            somme += t;
            if (i == 1 || t > max) {
                max = t;
            }
        }
        if (n > 0) {
            System.out.printf("Moyenne : %.1f%n", somme / n);
            System.out.println("Max : " + max);
        } else {
            System.out.println("Aucune mesure");
        }
    }
}
` };
  P.s3_liste = { file: "ListePostes.java", code:
`import java.util.Scanner;

public class ListePostes {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            if (i < 10) {
                System.out.println("PC-0" + i);
            } else {
                System.out.println("PC-" + i);
            }
        }
    }
}
` };
  P.s3_diagtp = { file: "Diagnostic.java", code:
`import java.util.Scanner;

public class Diagnostic {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int code = sc.nextInt();
        switch (code) {
            case 1:
                System.out.println("Memoire RAM defectueuse");
                break;
            case 2:
                System.out.println("Disque dur non detecte");
                break;
            case 3:
                System.out.println("Surchauffe processeur");
                break;
            case 4:
                System.out.println("Carte reseau desactivee");
                break;
            default:
                System.out.println("Code inconnu");
        }
    }
}
` };
  P.s3_menutp = { file: "Menu.java", code:
`import java.util.Scanner;

public class Menu {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choix;
        do {
            System.out.println("1. Diagnostic  2. Cout  0. Quitter");
            choix = sc.nextInt();
            if (choix == 1) {
                int code = sc.nextInt();
                if (code >= 1 && code <= 4) {
                    System.out.println("Code " + code + " : voir la fiche de panne");
                } else {
                    System.out.println("Code inconnu");
                }
            } else if (choix == 2) {
                int heures = sc.nextInt();
                System.out.println("Cout : " + heures * 7500 + " FCFA");
            } else if (choix != 0) {
                System.out.println("Choix invalide");
            }
        } while (choix != 0);
        System.out.println("Fin du programme");
    }
}
` };
  P.s3_heures = { file: "SaisieHeures.java", code:
`import java.util.Scanner;

public class SaisieHeures {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int heures = sc.nextInt();
        while (heures < 0 || heures > 24) {
            System.out.println("Invalide");
            heures = sc.nextInt();
        }
        System.out.println("Cout : " + heures * 7500 + " FCFA");
    }
}
` };

  COURSE.data.s3 = {
    hours: "4 h", split: "CM 1 h · TD 1 h · TP 2 h", comp: "C2, C3",
    h1: "Conditions <em>et boucles</em>",
    lede: "Jusqu'ici, tes programmes exécutaient toutes leurs lignes une seule fois, de haut en bas. Tu vas leur apprendre à décider (diagnostiquer selon un code d'erreur) et à répéter (afficher un menu jusqu'à ce que l'utilisateur quitte).",
    prereq: "variables, types, comparaisons (<code>&lt;</code>, <code>==</code>, <code>&amp;&amp;</code>) et Scanner (séance 2).",
    objectives: [
      "Écrire des décisions avec if, else if, else et switch",
      "Construire des conditions combinées correctes",
      "Répéter des instructions avec for, while et do-while",
      "Utiliser un compteur et un accumulateur",
      "Valider une saisie et éviter les boucles infinies",
      "Construire un menu console qui se répète jusqu'à la sortie"
    ],
    lesson: [
      { title: "Prendre une décision : if / else", html:
        K.p("La structure <code>if</code> exécute un bloc <b>seulement si</b> une condition est vraie. Le bloc <code>else</code>, facultatif, est exécuté sinon.") +
        '<div class="flow"><span class="box q">temp &gt; 75 ?</span><span class="arr">— vrai →</span><span class="box">Alerte surchauffe</span><span class="arr">· faux →</span><span class="box">Température normale</span><span class="arr">→</span><span class="box">Diagnostic terminé</span></div>' +
        K.run("s3_temp") +
        K.p("La condition est toujours entre parenthèses et doit valoir <code>true</code> ou <code>false</code>. Les accolades délimitent le bloc ; elles sont facultatives pour une seule instruction, mais <b>mets-les toujours</b> : c'est la source d'erreurs la plus sournoise quand on ajoute une ligne plus tard."),
        check: { q: "Avec <code>temp = 75</code>, qu'affiche le programme ci-dessus ?", o: ["Alerte : surchauffe…", "Température normale. puis Diagnostic terminé.", "Rien", "Diagnostic terminé. seulement"], a: 1, e: "75 &gt; 75 est faux (strictement supérieur) : on passe dans le <code>else</code>, puis la ligne après le if/else s'exécute dans tous les cas." } },
      { title: "Plusieurs cas : else if", html:
        K.p("Pour choisir entre plus de deux possibilités, on enchaîne les <code>else if</code>. Java teste les conditions <b>dans l'ordre</b> et exécute <b>uniquement le premier bloc</b> dont la condition est vraie.") +
        K.run("s3_disque") +
        K.warn("L'ordre des tests compte", "Si on testait <code>pct &gt;= 70</code> avant <code>pct &gt;= 90</code>, une valeur de 95 afficherait « Attention » : la première condition vraie gagne. On teste du cas le plus restrictif au plus général, et on élimine d'abord les valeurs invalides."),
        check: { q: "Avec <code>pct = 70</code> dans le programme Disque, quel message s'affiche ?", o: ["OK", "Attention : surveiller l'espace disque", "Critique…", "Valeur invalide"], a: 1, e: "70 n'est pas invalide, pas ≥ 90, mais ≥ 70 : c'est le deuxième <code>else if</code>." } },
      { title: "Conditions combinées et pièges classiques", html:
        K.table(["On veut", "On écrit", "À éviter"], [
          ["x entre 10 et 20", "<code>x &gt;= 10 &amp;&amp; x &lt;= 20</code>", "<code>10 &lt;= x &lt;= 20</code> (refusé par Java)"],
          ["code égal à 3 ou 4", "<code>code == 3 || code == 4</code>", "<code>code == 3 || 4</code>"],
          ["texte égal à \"OK\"", "<code>etat.equals(\"OK\")</code>", "<code>etat == \"OK\"</code>"],
          ["tester l'égalité", "<code>if (code == 3)</code>", "<code>if (code = 3)</code> : erreur « int cannot be converted to boolean »"]]) +
        K.warn("Le point-virgule après le if", "<code>if (temp &gt; 75); { … }</code> : le <code>;</code> termine le if avec une instruction vide. Le bloc qui suit s'exécute alors <b>toujours</b>. Java ne signale aucune erreur : c'est un bug silencieux.") +
        K.p("Lecture conseillée : <code>&amp;&amp;</code> se lit « et aussi », <code>||</code> « ou bien ». Java évalue de gauche à droite et s'arrête dès que le résultat est connu (court-circuit) : dans <code>n != 0 &amp;&amp; total / n &gt; 5</code>, la division n'est jamais faite si n vaut 0.") },
      { title: "Choisir parmi des valeurs : switch", html:
        K.p("Quand on compare <b>une même variable</b> à une liste de valeurs précises (un code, une lettre, un texte), <code>switch</code> est plus lisible qu'une cascade de <code>else if</code>.") +
        K.run("s3_code") +
        K.p("Chaque <code>case</code> se termine par <code>break</code>. Sans lui, l'exécution <b>continue dans le case suivant</b> (on dit qu'elle « tombe ») : c'est voulu pour les cas 3 et 4 ci-dessus, qui partagent le même message. <code>default</code> traite toutes les autres valeurs.",
          "Depuis Java 14, une forme avec flèche évite les <code>break</code> : chaque cas exécute seulement son instruction, et on peut regrouper plusieurs valeurs avec une virgule.") +
        K.run("s3_fleche") +
        K.note("Ce que switch accepte", "Un <code>int</code>, un <code>char</code> ou un <code>String</code> (pas un <code>double</code> ni un <code>boolean</code>). Les valeurs des <code>case</code> doivent être des constantes, toutes différentes."),
        check: { q: "Dans CodeErreur, que se passe-t-il pour le code 2 si on supprime le <code>break</code> du case 2 ?", o: ["Seul « Disque dur non détecté » s'affiche", "« Disque dur non détecté » puis « Problème d'alimentation »", "Erreur de compilation", "Le default s'exécute"], a: 1, e: "Sans <code>break</code>, l'exécution continue dans le case suivant (3 puis 4) jusqu'au prochain <code>break</code>." } },
      { title: "Répéter un nombre connu de fois : for", html:
        K.code(["for (int i = 1; i <= 5; i++) {", "    // corps : répété tant que la condition est vraie", "}"]) +
        K.table(["Partie", "Rôle", "Exécutée"], [["<code>int i = 1</code>", "initialisation du compteur", "une seule fois, au début"], ["<code>i &lt;= 5</code>", "condition", "avant chaque tour ; si fausse, on sort"], ["<code>i++</code>", "mise à jour", "à la fin de chaque tour"]]) +
        K.run("s3_for") +
        K.p("La variable <code>i</code> n'existe qu'à l'intérieur de la boucle. Combien de tours ? Pour <code>i = 1; i &lt;= n</code> : n tours. Pour <code>i = 0; i &lt; n</code> : n tours aussi (c'est la forme qu'on utilisera avec les tableaux)."),
        check: { q: "Combien de fois le corps de <code>for (int i = 0; i &lt; 10; i += 2)</code> s'exécute-t-il ?", o: ["10", "5", "6", "4"], a: 1, e: "i prend les valeurs 0, 2, 4, 6, 8 : 5 tours. À 10, la condition <code>i &lt; 10</code> devient fausse." } },
      { title: "Répéter tant que… : while et do-while", html:
        K.p("<code>while</code> répète <b>tant qu'une condition est vraie</b>, sans savoir à l'avance combien de tours il faudra. La condition est testée <b>avant</b> chaque tour : si elle est fausse dès le départ, le corps ne s'exécute jamais.") +
        K.run("s3_while") +
        K.p("<code>do { … } while (condition);</code> teste la condition <b>après</b> le tour : le corps s'exécute <b>au moins une fois</b>. C'est la forme idéale pour un menu ou une saisie à valider (attention au point-virgule final).") +
        K.table(["Boucle", "Quand l'utiliser", "Exemple"], [["<code>for</code>", "nombre de tours connu", "vérifier les postes 1 à 25"], ["<code>while</code>", "on répète tant qu'une situation dure, peut-être 0 fois", "lire des mesures jusqu'à -1"], ["<code>do-while</code>", "au moins un tour, puis on décide", "menu, saisie à redemander"]]) },
      { title: "Compteur et accumulateur", html:
        K.p("Deux motifs reviennent sans cesse :") +
        K.ul(["un <b>compteur</b> compte les tours ou les cas : initialisé à 0, augmenté de 1 (<code>compteur++</code>) ;", "un <b>accumulateur</b> cumule des valeurs : initialisé à 0 (somme) ou à la première valeur (maximum), mis à jour à chaque tour (<code>somme += t</code>)."]) +
        K.p("Le programme ci-dessous lit des températures jusqu'à la valeur <b>sentinelle</b> -1, puis affiche le nombre de mesures, la moyenne et le maximum. Suis-le aussi en mode pas à pas dans l'onglet Démos.") +
        K.run("s3_stats") +
        K.warn("Diviser par le compteur", "On vérifie <code>compteur &gt; 0</code> avant de calculer la moyenne : sinon, avec zéro mesure, on diviserait par zéro. Et on écrit <code>(double) somme / compteur</code> pour éviter la division entière.") },
      { title: "Valider une saisie et éviter les boucles infinies", html:
        K.p("Une boucle doit finir par s'arrêter : quelque chose dans son corps doit faire évoluer la condition. Les trois causes classiques de boucle infinie :") +
        K.ul(["oublier la mise à jour : <code>while (i &lt; 10) { System.out.println(i); }</code> (i ne change jamais) ;", "une condition toujours vraie : <code>while (heures &gt;= 0 || heures &lt;= 24)</code> (toujours vrai : il fallait <code>&amp;&amp;</code>) ;", "dans une saisie, ne jamais relire la valeur à l'intérieur de la boucle."]) +
        K.p("Pour redemander une valeur tant qu'elle est incorrecte, le <code>do-while</code> est naturel :") + K.run("s3_valide") +
        K.p("<code>break</code> sort immédiatement de la boucle ; <code>continue</code> passe directement au tour suivant. Utilise-les avec modération : une condition de boucle claire vaut mieux.") +
        K.note("Si l'utilisateur tape des lettres", "<code>nextInt()</code> plante avec une <code>InputMismatchException</code>. On peut tester d'abord avec <code>sc.hasNextInt()</code> (vrai si le prochain mot est un entier) ; la séance 7 montrera la solution complète avec try/catch.") +
        K.note("Dans le simulateur", "Si un programme tourne sans fin, le simulateur l'arrête au bout de quelques millions d'instructions. Dans un vrai terminal, on l'interrompt avec <kbd>Ctrl</kbd> + <kbd>C</kbd>.") },
      { title: "Le menu console : do-while + switch", html:
        K.p("Toutes les notions se combinent dans le schéma d'application console que tu utiliseras jusqu'au projet : un <code>do-while</code> qui affiche le menu, lit le choix, l'exécute avec un <code>switch</code>, et recommence tant que le choix n'est pas 0.") +
        K.run("s3_menu") +
        K.p("Change l'entrée clavier pour essayer d'autres parcours. L'onglet Démos te permet de suivre ce menu ligne par ligne.") }
    ],

    demos: [
      { type: "stepper", title: "Compteur, accumulateur et sentinelle", prog: "s3_stats",
        intro: "Entrée : 62, 71, 85, 58 puis -1. Observe <code>compteur</code>, <code>somme</code> et <code>max</code> évoluer à chaque tour, et la condition du <code>while</code> retestée.",
        notes: { 11: "Première lecture <b>avant</b> la boucle : c'est la lecture d'amorçage.", 12: "La condition est testée : tant que la valeur lue n'est pas -1, on entre dans la boucle.", 13: "Le compteur augmente de 1 à chaque mesure.", 14: "L'accumulateur ajoute la mesure à la somme.", 15: "Est-ce un nouveau maximum ?", 16: "Oui : on mémorise la nouvelle valeur maximale.", 18: "Lecture suivante, <b>à la fin du tour</b>. Sans elle, la boucle serait infinie.", 21: "Après la boucle : on évite la division par zéro.", 22: "Moyenne en décimal grâce au cast <code>(double)</code>." } },
      { type: "stepper", title: "Le menu qui se répète", prog: "s3_menu",
        intro: "Entrée : 1 puis 2 (diagnostic du code 2), 2 puis 3 (coût de 3 h), 9 (invalide), 0 (quitter). Regarde le retour en haut du <code>do</code> après chaque choix.",
        notes: { 15: "Lecture du choix de l'utilisateur.", 17: "Le <code>switch</code> saute directement au <code>case</code> correspondant.", 28: "<code>break</code> : on sort du switch (pas de la boucle !).", 38: "Choix non prévu : le <code>default</code> s'exécute.", 40: "Condition du do-while : tant que le choix n'est pas 0, on recommence le menu." } },
      { type: "lab" }
    ],

    exercises: [
      { type: "predict", title: "Tracer des boucles", lvl: 1, prog: "s3_trace",
        hint: "Pour la première boucle, note la valeur de <code>total</code> à la fin de chaque tour. Pour la seconde, le nombre de # de chaque ligne dépend de <code>ligne</code>.",
        expl: "total vaut 1, puis 3, 6, 10 : les valeurs s'affichent sur une ligne, séparées par des espaces. Ensuite, la boucle intérieure fait <code>ligne</code> tours : 1, 2 puis 3 dièses." },
      { type: "mcq", title: "Quelle structure choisir ?", lvl: 1,
        items: [
          { q: "Afficher les 30 postes de la salle B, numérotés de 1 à 30.", o: ["for", "while", "switch", "if"], a: 0, e: "Nombre de tours connu à l'avance : <code>for</code>." },
          { q: "Afficher un message différent selon le code d'erreur 1, 2, 3 ou 4.", o: ["for", "switch", "do-while", "while"], a: 1, e: "Une variable comparée à des valeurs précises : <code>switch</code> (une cascade de else if fonctionnerait aussi)." },
          { q: "Lire des numéros de tickets jusqu'à ce que l'utilisateur tape 0.", o: ["for", "if", "while (ou do-while)", "switch"], a: 2, e: "On ne sait pas combien de tickets : boucle conditionnelle." },
          { q: "Redemander un mot de passe tant qu'il est incorrect (au moins une saisie).", o: ["do-while", "for", "switch", "if"], a: 0, e: "Au moins une saisie, puis on décide : <code>do-while</code>." },
          { q: "Afficher « Garantie expirée » si l'âge du matériel dépasse 24 mois.", o: ["while", "if", "for", "switch"], a: 1, e: "Une simple décision : <code>if</code>." }] },
      { type: "predict", title: "Le switch qui tombe", lvl: 2, prog: "s3_fall",
        hint: "Le niveau vaut 'B'. Où se trouve le premier <code>break</code> après le case 'B' ?",
        expl: "On entre au case 'B' et, faute de <code>break</code>, l'exécution continue dans le case 'C' jusqu'au <code>break</code>. Deux lignes s'affichent. C'est le comportement « fall-through » : utile parfois, mais souvent un oubli." },
      { type: "parsons", title: "Remettre une boucle dans l'ordre", lvl: 1,
        goal: "Reconstitue un programme qui affiche un compte à rebours de redémarrage : 3, 2, 1, puis « Redémarrage ».",
        lines: ["public class Redemarrage {", "    public static void main(String[] args) {", "        int secondes = 3;", "        while (secondes > 0) {", "            System.out.println(secondes);", "            secondes--;", "        }", "        System.out.println(\"Redémarrage\");", "    }", "}"],
        hint: "La variable est déclarée avant la boucle ; dans la boucle, on affiche avant de décrémenter ; le message final est après l'accolade fermante du while." },
      { type: "hunt", title: "Erreurs dans les conditions et les boucles", lvl: 2, code: P.s3_bug.code.replace(/\n$/, "").split("\n"), bad: [4, 10, 13],
        fixes: {
          4: { msg: "Diag.java:4: error: incompatible types: int cannot be converted to boolean", fr: "<code>=</code> affecte une valeur ; une condition a besoin d'une comparaison <code>==</code>.", fix: "        if (code == 3) {" },
          10: { msg: "Diag.java:10: error: cannot find symbol\n  symbol:   variable essai", fr: "<code>essai</code> est déclarée <b>dans</b> le bloc du for : elle n'existe plus après l'accolade fermante. Il faut la déclarer avant la boucle.", fix: "        int essai = 0;   // (avant le for) puis essai = i; dans la boucle" },
          13: { msg: "Diag.java:13: error: duplicate case label", fr: "Deux <code>case</code> ont la même valeur 1 : Java ne saurait pas lequel choisir.", fix: "            case 2: System.out.println(\"CPU\"); break;" } },
        order: "Vérifié avec javac : les trois erreurs sont signalées en même temps (3 errors)." },
      { type: "write", title: "Classer l'occupation d'un disque", lvl: 2, file: "Occupation.java",
        statement: "<p>Écris un programme qui lit un pourcentage d'occupation (entier) et affiche :</p><ul><li><code>Valeur invalide</code> s'il est négatif ou supérieur à 100 ;</li><li><code>Critique : libérer de l'espace d'urgence</code> à partir de 90 ;</li><li><code>Attention : surveiller l'espace disque</code> de 70 à 89 ;</li><li><code>OK</code> en dessous de 70.</li></ul><p>Pas de question avant la saisie.</p>",
        starter: "import java.util.Scanner;\n\npublic class Occupation {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int pct = sc.nextInt();\n\n    }\n}\n",
        tests: [{ input: "45\n", label: "45 %" }, { input: "70\n", label: "70 % (limite)" }, { input: "89\n", label: "89 %" }, { input: "90\n", label: "90 % (limite)" }, { input: "101\n", label: "101 %" }, { input: "-3\n", label: "négatif" }],
        solution: "s3_classe", hint: "<p>Commence par éliminer les valeurs invalides, puis teste du seuil le plus haut au plus bas avec <code>else if</code>.</p>" },
      { type: "write", title: "Moyenne et maximum de N mesures", lvl: 3, file: "Moyenne.java",
        statement: "<p>Le programme lit d'abord un entier <code>n</code>, puis <code>n</code> températures (décimales). Il affiche la moyenne avec une décimale et le maximum :</p><p><code>Moyenne : 68.3</code><br><code>Max : 85.0</code></p><p>Si <code>n</code> vaut 0, il affiche <code>Aucune mesure</code>.</p>",
        starter: "import java.util.Scanner;\n\npublic class Moyenne {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n\n    }\n}\n",
        tests: [{ input: "3\n62\n58\n85\n", label: "3 mesures" }, { input: "1\n40.5\n", label: "une seule mesure" }, { input: "4\n-5\n-2\n-9\n-1\n", label: "toutes négatives" }, { input: "0\n", label: "aucune mesure" }],
        solution: "s3_moy", hint: "<p>Accumulateur <code>somme</code> ; pour le maximum, initialise-le avec la <b>première</b> valeur lue (sinon, avec des températures toutes négatives, un max initialisé à 0 serait faux). Moyenne : <code>printf(\"Moyenne : %.1f%n\", somme / n)</code>.</p>" },
      { type: "write", title: "Générer les identifiants des postes", lvl: 2, file: "ListePostes.java",
        statement: "<p>Lis un entier <code>n</code> et affiche les identifiants <code>PC-01</code>, <code>PC-02</code>… jusqu'à <code>n</code>, un par ligne. À partir de 10, pas de zéro : <code>PC-10</code>, <code>PC-11</code>…</p>",
        starter: "import java.util.Scanner;\n\npublic class ListePostes {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n\n    }\n}\n",
        tests: [{ input: "3\n", label: "3 postes" }, { input: "12\n", label: "12 postes" }, { input: "0\n", label: "aucun poste" }],
        solution: "s3_liste", hint: "<p>Une boucle <code>for</code> de 1 à n, et un <code>if (i &lt; 10)</code> pour choisir le préfixe. Avec printf, <code>%02d</code> ferait aussi l'affaire.</p>" }
    ],

    tp: {
      title: "TP 3 — Menu de diagnostic initial", duration: "2 h", deliverable: "menu console fonctionnel",
      intro: "Le service veut un petit outil console : l'utilisateur choisit une action dans un menu, l'outil la réalise, puis le menu revient jusqu'à ce qu'on choisisse de quitter. Les parties A et B sont vérifiées automatiquement ; la version complète (avec messages et questions) se teste avec ton JDK.",
      steps: [
        "TD : écris sur papier l'algorithme du diagnostic (code → message) avant de coder.",
        "Partie A : programme de diagnostic avec un <code>switch</code>.",
        "Partie B : menu répété avec <code>do-while</code> (diagnostic, coût, quitter, choix invalide).",
        "Teste le menu avec un choix invalide et avec 0 dès le premier tour.",
        "Partie C : refuse une durée hors de 0–24 h et redemande la saisie.",
        "Version complète : ajoute des questions (« Choix : », « Heures : ») et un affichage soigné dans ton IDE."
      ],
      parts: [
        { title: "Diagnostic selon le code d'erreur", html: K.p("Lis un code entier et affiche le message correspondant : 1 → <code>Memoire RAM defectueuse</code>, 2 → <code>Disque dur non detecte</code>, 3 → <code>Surchauffe processeur</code>, 4 → <code>Carte reseau desactivee</code>, autre → <code>Code inconnu</code>. (Textes sans accents, pour éviter les soucis d'affichage dans la console Windows.)"),
          write: { file: "Diagnostic.java", statement: "", starter: "import java.util.Scanner;\n\npublic class Diagnostic {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int code = sc.nextInt();\n\n    }\n}\n",
            tests: [{ input: "1\n", label: "code 1" }, { input: "3\n", label: "code 3" }, { input: "4\n", label: "code 4" }, { input: "7\n", label: "code inconnu" }], solution: "s3_diagtp" } },
        { title: "Le menu qui se répète", html: K.p("À chaque tour, affiche <code>1. Diagnostic  2. Cout  0. Quitter</code>, puis lis le choix. Choix 1 : lis un code ; s'il est entre 1 et 4 affiche <code>Code X : voir la fiche de panne</code>, sinon <code>Code inconnu</code>. Choix 2 : lis un nombre d'heures et affiche <code>Cout : … FCFA</code> (7500 FCFA de l'heure). Autre choix que 0 : <code>Choix invalide</code>. Après la boucle : <code>Fin du programme</code>."),
          write: { file: "Menu.java", statement: "", starter: "import java.util.Scanner;\n\npublic class Menu {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int choix;\n\n    }\n}\n",
            tests: [{ input: "1\n2\n2\n3\n0\n", label: "diagnostic puis coût puis quitter" }, { input: "5\n1\n9\n0\n", label: "choix invalide, code inconnu" }, { input: "0\n", label: "quitter tout de suite" }], solution: "s3_menutp",
            expl: "Le <code>do-while</code> garantit que le menu s'affiche au moins une fois. Ici on a utilisé une cascade de <code>if</code> ; un <code>switch</code> conviendrait tout aussi bien." } },
        { title: "Valider la durée saisie", html: K.p("Lis un nombre d'heures. Tant qu'il est hors de l'intervalle 0–24, affiche <code>Invalide</code> et relis. Puis affiche le coût (7500 FCFA de l'heure)."),
          write: { file: "SaisieHeures.java", statement: "", starter: "import java.util.Scanner;\n\npublic class SaisieHeures {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n\n    }\n}\n",
            tests: [{ input: "3\n", label: "valeur correcte" }, { input: "30\n-1\n8\n", label: "deux valeurs refusées" }, { input: "24\n", label: "limite 24" }], solution: "s3_heures" } },
        { title: "Le modèle complet (pour ton IDE)", bonus: true, html: K.p("Voici une version complète avec questions et messages, à recopier, compiler et enrichir dans ton IDE. Elle servira de base aux séances suivantes.") + K.code(P.s3_menu.code) }
      ]
    },

    quiz: [
      { q: "Que vaut la condition <code>(5 &gt; 3) &amp;&amp; (2 &gt; 4)</code> ?", o: ["true", "false", "Erreur", "1"], a: 1, e: "vrai ET faux = faux." },
      { q: "Quelle écriture teste si <code>x</code> est entre 1 et 10 inclus ?", o: ["<code>1 &lt;= x &lt;= 10</code>", "<code>x &gt;= 1 &amp;&amp; x &lt;= 10</code>", "<code>x &gt;= 1 || x &lt;= 10</code>", "<code>x == 1..10</code>"], a: 1, e: "Deux comparaisons reliées par ET. La version avec OU est toujours vraie." },
      { q: "Dans une cascade if / else if, combien de blocs s'exécutent au maximum ?", o: ["Tous ceux dont la condition est vraie", "Un seul : le premier dont la condition est vraie", "Deux", "Aucun"], a: 1, e: "Dès qu'une condition est vraie, son bloc s'exécute et les suivants sont ignorés." },
      { q: "Que se passe-t-il si on oublie <code>break</code> à la fin d'un case ?", o: ["Erreur de compilation", "L'exécution continue dans le case suivant", "Le switch recommence", "Le default s'exécute toujours"], a: 1, e: "C'est le « fall-through »." },
      { q: "Quel type ne peut PAS être utilisé dans un switch ?", o: ["int", "char", "String", "double"], a: 3, e: "switch accepte int, char, String (et les enum), pas double." },
      { q: "Combien de fois s'exécute <code>for (int i = 5; i &gt; 0; i--)</code> ?", o: ["4", "5", "6", "Infini"], a: 1, e: "i = 5, 4, 3, 2, 1 : 5 tours." },
      { q: "Quelle boucle exécute son corps au moins une fois ?", o: ["for", "while", "do-while", "Aucune"], a: 2, e: "La condition du do-while est testée après le corps." },
      { q: "Pourquoi cette boucle ne s'arrête-t-elle jamais ?", code: ["int i = 0;", "while (i < 5) {", "    System.out.println(i);", "}"], o: ["La condition est mal écrite", "i n'est jamais modifié dans la boucle", "Il manque un point-virgule", "println bloque la boucle"], a: 1, e: "Il manque <code>i++;</code> : i reste à 0 et la condition reste vraie." },
      { q: "Pour calculer une somme dans une boucle, on initialise l'accumulateur :", o: ["dans la boucle", "à 0 avant la boucle", "après la boucle", "à 1"], a: 1, e: "Avant la boucle, sinon il serait remis à zéro à chaque tour." },
      { q: "Qu'affiche ce code ?", code: ["int n = 0;", "for (int i = 1; i <= 3; i++) {", "    n += i * 2;", "}", "System.out.println(n);"], o: ["6", "12", "8", "3"], a: 1, e: "2 + 4 + 6 = 12." },
      { q: "<code>if (code = 2)</code> provoque :", o: ["Une comparaison normale", "Une erreur de compilation : int cannot be converted to boolean", "Une boucle infinie", "Une erreur à l'exécution"], a: 1, e: "<code>=</code> est une affectation : son résultat est un int, pas un boolean." },
      { q: "Que fait <code>continue</code> dans une boucle ?", o: ["Sort de la boucle", "Passe directement au tour suivant", "Arrête le programme", "Recommence la boucle depuis le début"], a: 1, e: "<code>break</code> sort ; <code>continue</code> saute la fin du tour en cours." }
    ],

    video: { src: "media/seance3.mp4", title: "conditions et boucles", dur: 96, chapters: [[0, "Titre"], [5, "if / else"], [17, "else if"], [29, "switch"], [41, "La boucle for"], [54, "while et do-while"], [65, "Compteur et accumulateur"], [79, "Boucle infinie"], [88, "À retenir"]] },
    youtube: [
      { t: "if, else if, else en Java", src: "Recherche YouTube", d: "Conditions simples et en cascade.", q: "java if else conditions débutant français" },
      { t: "switch en Java (classique et avec flèche)", src: "Recherche YouTube", d: "switch, case, break, default.", q: "java switch case break tutoriel français" },
      { t: "Boucles for, while, do-while", src: "Recherche YouTube", d: "Choisir la bonne boucle et éviter les boucles infinies.", q: "java boucles for while do while français" }
    ],
    docs: [
      { t: "The if-then and if-then-else Statements", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/if.html", d: "Référence officielle des conditions." },
      { t: "The switch Statement", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html", d: "switch, break et fall-through." },
      { t: "The while and do-while Statements / The for Statement", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/while.html", d: "Les boucles, avec exemples." }
    ],
    memo: {
      cards: [
        ["if / else if / else", "<code>if (cond) { … } else if (cond2) { … } else { … }</code> · un seul bloc exécuté · du cas le plus restrictif au plus général."],
        ["switch", "<code>switch (x) { case 1: …; break; default: … }</code> · int, char, String · sans break, on tombe dans le case suivant · forme flèche : <code>case 1, 2 -&gt; …;</code>"],
        ["for", "<code>for (int i = 1; i &lt;= n; i++) { … }</code> · nombre de tours connu."],
        ["while / do-while", "<code>while (cond) { … }</code> : 0 tour possible · <code>do { … } while (cond);</code> : au moins 1 tour (menus, saisies)."],
        ["Compteur / accumulateur", "Initialiser <b>avant</b> la boucle : <code>int nb = 0; double somme = 0;</code> · mettre à jour dedans : <code>nb++; somme += x;</code>"],
        ["Éviter la boucle infinie", "La condition doit pouvoir devenir fausse : mettre à jour la variable testée, relire la saisie, vérifier &amp;&amp; / ||."]
      ],
      code: P.s3_menu.code, codeTitle: "Modèle : le menu console",
      errors: [["<code>int cannot be converted to boolean</code>", "<code>=</code> au lieu de <code>==</code>", "Comparer avec =="], ["<code>cannot find symbol</code> après une boucle", "Variable déclarée dans le bloc", "La déclarer avant la boucle"], ["<code>duplicate case label</code>", "Deux case identiques", "Valeurs différentes"], ["Le bloc du if s'exécute toujours", "<code>;</code> après <code>if (…)</code>", "Supprimer le point-virgule"], ["Le programme ne s'arrête pas", "Variable de boucle jamais modifiée", "Mise à jour dans le corps"], ["Le case suivant s'exécute aussi", "<code>break</code> oublié", "Ajouter break"]],
      glossary: [["Condition", "Expression booléenne qui vaut true ou false."], ["Bloc", "Instructions entre accolades { }, exécutées ensemble."], ["Cascade", "Suite de if / else if / else."], ["Fall-through", "Passage d'un case au suivant faute de break."], ["Itération", "Un tour de boucle."], ["Compteur", "Variable qui compte les tours ou les cas."], ["Accumulateur", "Variable qui cumule des valeurs (somme, maximum)."], ["Sentinelle", "Valeur spéciale qui signale la fin d'une saisie (ex. -1)."], ["Boucle infinie", "Boucle dont la condition ne devient jamais fausse."]],
      selfcheck: ["Je sais écrire un if / else if / else et choisir l'ordre des tests.", "Je sais utiliser un switch avec break et default.", "Je sais choisir entre for, while et do-while.", "Je sais écrire un compteur et un accumulateur.", "Je sais redemander une saisie tant qu'elle est invalide.", "J'ai réalisé le TP 3 (menu console)."],
      next: "Séance 4 : tableaux et chaînes de caractères. Tu stockeras plusieurs références d'équipements dans un tableau et tu y rechercheras une référence."
    }
  };
})();
