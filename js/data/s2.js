(function () {
  var P = COURSE.progs;
  COURSE.seances.push({ id: "s2", tag: "S-02", short: "Variables & types" });

  P.s2_boites = { file: "Boites.java", lab: "Déclarer des variables", code:
`public class Boites {
    public static void main(String[] args) {
        String reference = "PC-042";
        int heures = 3;
        double tarif = 7500.0;
        boolean sousGarantie = false;
        char categorie = 'B';

        System.out.println("Poste : " + reference);
        System.out.println("Heures : " + heures);
        heures = heures + 2;
        System.out.println("Heures après mise à jour : " + heures);
        System.out.println("Tarif : " + tarif + " | garantie : " + sousGarantie + " | catégorie " + categorie);
    }
}
` };
  P.s2_ops = { file: "Operateurs.java", lab: "Opérateurs et division entière", code:
`public class Operateurs {
    public static void main(String[] args) {
        int a = 7;
        int b = 2;
        System.out.println(a + b);
        System.out.println(a / b);
        System.out.println(a % b);
        System.out.println(a / 2.0);
        System.out.println((double) a / b);
        System.out.println(2 + 3 * 4);
        System.out.println((2 + 3) * 4);
        System.out.println("Total : " + a + b);
        System.out.println("Total : " + (a + b));
    }
}
` };
  P.s2_logique = { file: "Garantie.java", code:
`public class Garantie {
    public static void main(String[] args) {
        int ageMois = 14;
        boolean pieceDisponible = true;
        final int DUREE_GARANTIE = 24;

        boolean sousGarantie = ageMois < DUREE_GARANTIE;
        boolean reparableSurPlace = sousGarantie && pieceDisponible;
        boolean aCommander = !pieceDisponible;

        System.out.println("Sous garantie : " + sousGarantie);
        System.out.println("Réparable sur place : " + reparableSurPlace);
        System.out.println("Pièce à commander : " + aCommander);
        System.out.println("Ancien ou sans pièce : " + (ageMois > 36 || !pieceDisponible));
    }
}
` };
  P.s2_saisie = { file: "Saisie.java", lab: "Saisie au clavier (Scanner)", input: "Awa Diallo\n3\n7500\n", code:
`import java.util.Scanner;

public class Saisie {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Nom du technicien : ");
        String nom = sc.nextLine();
        System.out.print("Nombre d'heures : ");
        int heures = sc.nextInt();
        System.out.print("Tarif horaire : ");
        double tarif = sc.nextDouble();

        double montant = heures * tarif;
        System.out.println(nom + " facture " + montant + " FCFA");
        sc.close();
    }
}
` };
  P.s2_piege = { file: "Piege.java", lab: "Le piège nextInt / nextLine", input: "4\nRemplacement écran\n", code:
`import java.util.Scanner;

public class Piege {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Numéro du poste : ");
        int numero = sc.nextInt();
        System.out.print("Description de la panne : ");
        String description = sc.nextLine();
        System.out.println("Poste " + numero + " -> [" + description + "]");
    }
}
` };
  P.s2_piegeok = { file: "PiegeCorrige.java", input: "4\nRemplacement écran\n", code:
`import java.util.Scanner;

public class PiegeCorrige {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Numéro du poste : ");
        int numero = sc.nextInt();
        sc.nextLine(); // consomme la fin de ligne laissée par nextInt
        System.out.print("Description de la panne : ");
        String description = sc.nextLine();
        System.out.println("Poste " + numero + " -> [" + description + "]");
    }
}
` };
  P.s2_conv = { file: "Conversions.java", lab: "Conversions de types", code:
`public class Conversions {
    public static void main(String[] args) {
        int heures = 3;
        double duree = heures;              // int -> double : automatique
        double prix = 12999.99;
        int arrondi = (int) prix;           // double -> int : cast, la partie décimale est perdue
        long proche = Math.round(prix);     // arrondi au plus proche (renvoie un long)
        String saisie = "250";
        int quantite = Integer.parseInt(saisie);   // texte -> nombre
        String code = "PC-" + quantite;     // nombre -> texte (concaténation)
        char lettre = 'A';
        int codeAscii = lettre;             // char -> int

        System.out.println(duree);
        System.out.println(arrondi + " / " + proche);
        System.out.println(quantite * 2);
        System.out.println(code);
        System.out.println(codeAscii);
    }
}
` };
  P.s2_echange = { file: "Echange.java", code:
`public class Echange {
    public static void main(String[] args) {
        String posteA = "PC-01";
        String posteB = "PC-02";
        String temporaire = posteA;
        posteA = posteB;
        posteB = temporaire;
        System.out.println("A = " + posteA + ", B = " + posteB);
    }
}
` };
  P.s2_cout = { file: "CoutIntervention.java", lab: "TP 2 : coût d'une intervention", input: "25000\n3\n7500\n", code:
`import java.util.Scanner;

public class CoutIntervention {
    public static void main(String[] args) {
        final double TAUX_TVA = 0.18;
        Scanner sc = new Scanner(System.in);

        System.out.println("=== COUT D'UNE INTERVENTION ===");
        System.out.print("Prix des pieces (FCFA) : ");
        double prixPieces = sc.nextDouble();
        System.out.print("Nombre d'heures : ");
        int heures = sc.nextInt();
        System.out.print("Tarif horaire (FCFA) : ");
        double tarif = sc.nextDouble();

        double mainOeuvre = heures * tarif;
        double totalHT = prixPieces + mainOeuvre;
        double tva = totalHT * TAUX_TVA;
        double totalTTC = totalHT + tva;

        System.out.println("--------------------------------");
        System.out.println("Main d'oeuvre : " + mainOeuvre + " FCFA");
        System.out.println("Total HT      : " + totalHT + " FCFA");
        System.out.println("TVA (18 %)    : " + tva + " FCFA");
        System.out.println("Total TTC     : " + totalTTC + " FCFA");
    }
}
` };
  P.s2_ticket = { file: "Ticket.java", input: "25000\n3\n7500\n", code:
`import java.util.Scanner;

public class Ticket {
    public static void main(String[] args) {
        final double TAUX_TVA = 0.18;
        Scanner sc = new Scanner(System.in);
        double prixPieces = sc.nextDouble();
        int heures = sc.nextInt();
        double tarif = sc.nextDouble();

        double mainOeuvre = heures * tarif;
        double totalHT = prixPieces + mainOeuvre;
        double totalTTC = totalHT * (1 + TAUX_TVA);

        System.out.printf("%-15s%12.2f%n", "Pieces", prixPieces);
        System.out.printf("%-15s%12.2f%n", "Main d'oeuvre", mainOeuvre);
        System.out.printf("%-15s%12.2f%n", "Total HT", totalHT);
        System.out.printf("%-15s%12.2f%n", "Total TTC", totalTTC);
        System.out.printf("Soit %d heure(s) a %.0f FCFA%n", heures, tarif);
    }
}
` };
  P.s2_calculs = { file: "Calculs.java", code:
`public class Calculs {
    public static void main(String[] args) {
        int postes = 17;
        int salles = 5;
        System.out.println(postes / salles);
        System.out.println(postes % salles);
        System.out.println(postes / 2.0);
        System.out.println(10 - 4 / 2);
        System.out.println("Postes : " + postes + salles);
        int x = 5;
        x += 3;
        x++;
        System.out.println(x);
    }
}
` };
  P.s2_moyenne = { file: "Moyenne.java", input: "12\n15\n", code:
`import java.util.Scanner;

public class Moyenne {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int note1 = sc.nextInt();
        int note2 = sc.nextInt();
        double moyenne = (note1 + note2) / 2;
        double juste = (note1 + note2) / 2.0;
        System.out.println(moyenne + " " + juste);
    }
}
` };
  P.s2_duree = { file: "Duree.java", code:
`import java.util.Scanner;

public class Duree {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int minutes = sc.nextInt();
        int heures = minutes / 60;
        int reste = minutes % 60;
        System.out.println(minutes + " min = " + heures + " h " + reste + " min");
    }
}
` };
  P.s2_ttc = { file: "PrixTTC.java", code:
`import java.util.Scanner;

public class PrixTTC {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double prixHT = sc.nextDouble();
        int quantite = sc.nextInt();
        double total = prixHT * quantite * 1.18;
        System.out.printf("Total TTC : %.2f FCFA%n", total);
    }
}
` };
  P.s2_facture = { file: "Facture.java", code:
`import java.util.Scanner;
public class Facture {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int prix = 12500.50;
        int quantite = sc.nextInt();
        String total = prix * quantite;
        double remise;
        double net = prix * quantite - remise;
        System.out.println("Net : " + net);
    }
}
` };

  COURSE.data.s2 = {
    hours: "3 h", split: "CM 1 h · TD 1 h · TP 1 h", comp: "C2",
    h1: "Variables, types <em>et opérateurs</em>",
    lede: "Un programme utile manipule des données : un prix, un nombre d'heures, un identifiant de poste. Tu vas apprendre à les ranger dans des variables, à calculer, à comparer et à lire ce que l'utilisateur tape au clavier.",
    prereq: "écrire, compiler et exécuter un programme ; afficher avec println (séance 1).",
    objectives: [
      "Déclarer des variables et des constantes, et choisir un type adapté (int, double, char, boolean, String)",
      "Calculer avec les opérateurs arithmétiques et éviter le piège de la division entière",
      "Construire des conditions avec les comparaisons et les opérateurs logiques",
      "Lire des données au clavier avec Scanner",
      "Convertir entre types et reconnaître les erreurs de type les plus fréquentes"
    ],
    lesson: [
      { title: "Une variable : une boîte avec une étiquette", html:
        K.p("Une <b>variable</b> est un emplacement de la mémoire qui porte un <b>nom</b> et contient une <b>valeur</b>. En Java, chaque variable a aussi un <b>type</b> fixé une fois pour toutes : il dit quel genre de valeur elle peut contenir.") +
        K.code(["int heures = 3;          // type  nom  =  valeur ;", "double tarif = 7500.0;", "String reference = \"PC-042\";"]) +
        K.mem([["heures", "int", "3"], ["tarif", "double", "7500.0"], ["reference", "String", "\"PC-042\""]], "Ce que contient la mémoire") +
        K.p("On peut déclarer d'abord et donner la valeur ensuite (<code>int heures; heures = 3;</code>), et changer la valeur plus tard avec <code>=</code>, qui s'appelle l'<b>affectation</b>. Attention : on n'écrit le type <b>qu'une fois</b>, à la déclaration.",
          "Règles de nommage : commencer par une lettre, pas d'espace ni d'accent conseillé, et par convention le style <b>camelCase</b> : <code>prixPieces</code>, <code>nombreHeures</code>, <code>sousGarantie</code>. Un bon nom évite un commentaire.") +
        K.run("s2_boites"),
        check: { q: "Après <code>int stock = 10; stock = stock - 3;</code>, que vaut <code>stock</code> ?", o: ["10", "7", "-3", "Erreur : on ne peut pas utiliser stock des deux côtés"], a: 1, e: "Java calcule d'abord la partie droite (10 - 3 = 7), puis range le résultat dans la boîte <code>stock</code>. L'ancienne valeur est remplacée." } },
      { title: "Les types de base", html:
        K.table(["Type", "Contient", "Exemples de valeurs", "Exemple dans le parc"], [
          ["<code>int</code>", "Nombre entier (jusqu'à environ 2,1 milliards)", "<code>0</code>, <code>-5</code>, <code>250</code>", "nombre de postes, heures, quantité en stock"],
          ["<code>double</code>", "Nombre décimal (point, pas virgule)", "<code>7500.0</code>, <code>0.18</code>", "prix, tarif, taux de TVA, température"],
          ["<code>char</code>", "Un seul caractère, entre apostrophes", "<code>'A'</code>, <code>'7'</code>", "catégorie, niveau de priorité"],
          ["<code>boolean</code>", "Vrai ou faux", "<code>true</code>, <code>false</code>", "sous garantie, en panne"],
          ["<code>String</code>", "Texte, entre guillemets (avec S majuscule : c'est une classe)", "<code>\"PC-042\"</code>, <code>\"\"</code>", "référence, marque, description"]]) +
        K.p("Pour de très grands entiers il existe <code>long</code> (suffixe <code>L</code> : <code>3000000000L</code>). Les types <code>int</code>, <code>double</code>, <code>char</code>, <code>boolean</code> sont dits <b>primitifs</b> ; <code>String</code> est une classe, ce qui lui donne des méthodes (séance 4).") +
        K.warn("Le choix du type compte", "Un prix en <code>int</code> perd ses centimes ; un nombre de postes en <code>double</code> pourrait valoir 12,5 postes. Choisis le type qui correspond à la réalité de la donnée."),
        check: { q: "Quel type pour la quantité de cartouches d'encre en stock ?", o: ["double", "int", "String", "boolean"], a: 1, e: "Une quantité de cartouches est un nombre entier : <code>int</code>." } },
      { title: "Les constantes : final", html:
        K.p("Une valeur qui ne doit jamais changer pendant l'exécution (un taux de TVA, un tarif officiel) se déclare avec <code>final</code>. Par convention, son nom est en MAJUSCULES avec des tirets bas.") +
        K.code(["final double TAUX_TVA = 0.18;", "final int DUREE_GARANTIE_MOIS = 24;", "", "TAUX_TVA = 0.20;   // erreur : cannot assign a value to final variable TAUX_TVA"]) +
        K.p("Avantages : le code est plus lisible (<code>prix * TAUX_TVA</code> plutôt que <code>prix * 0.18</code>), et si le taux change, on ne modifie qu'une ligne.") },
      { title: "Calculer : les opérateurs arithmétiques", html:
        K.table(["Opérateur", "Rôle", "Exemple", "Résultat"], [["<code>+ - *</code>", "Addition, soustraction, multiplication", "<code>3 * 4</code>", "12"], ["<code>/</code>", "Division", "<code>7 / 2</code> et <code>7 / 2.0</code>", "<b>3</b> et 3.5"], ["<code>%</code>", "Reste de la division entière (modulo)", "<code>7 % 2</code>", "1"], ["<code>++ --</code>", "Ajouter ou retirer 1", "<code>x++</code>", "x augmente de 1"], ["<code>+= -= *= /=</code>", "Calcul et affectation", "<code>total += prix</code>", "total = total + prix"]]) +
        K.warn("Le piège n° 1 : la division entière", "Si les <b>deux</b> nombres sont des <code>int</code>, Java fait une division entière et <b>jette la partie décimale</b> : <code>7 / 2</code> vaut <code>3</code>. Pour obtenir 3.5, il faut qu'au moins un des deux soit un <code>double</code> : <code>7 / 2.0</code> ou <code>(double) 7 / 2</code>.") +
        K.p("La priorité est celle des maths : <code>*</code>, <code>/</code> et <code>%</code> passent avant <code>+</code> et <code>-</code>. Dans le doute, mets des parenthèses.",
          "Et attention au <code>+</code> avec du texte : dès qu'un <code>String</code> est à gauche, <code>+</code> <b>colle</b> au lieu d'additionner. <code>\"Total : \" + 7 + 2</code> donne <code>Total : 72</code>.") +
        K.run("s2_ops") +
        K.p("Le modulo <code>%</code> est très utile : <code>n % 2 == 0</code> teste si un nombre est pair, <code>minutes % 60</code> donne les minutes restantes après les heures pleines."),
        check: { q: "Que vaut <code>17 / 5</code> en Java ?", o: ["3.4", "3", "4", "2"], a: 1, e: "17 et 5 sont deux <code>int</code> : division entière, la partie décimale est jetée. <code>17 % 5</code> vaudrait 2 (le reste)." } },
      { title: "Comparer et combiner des conditions", html:
        K.p("Une <b>comparaison</b> produit un <code>boolean</code> : <code>true</code> ou <code>false</code>. On les combine avec les opérateurs logiques.") +
        K.table(["Opérateur", "Signification", "Exemple"], [["<code>==</code>", "égal à (deux signes =)", "<code>heures == 8</code>"], ["<code>!=</code>", "différent de", "<code>etat != 0</code>"], ["<code>&lt; &gt; &lt;= &gt;=</code>", "inférieur, supérieur…", "<code>ageMois &lt; 24</code>"], ["<code>&amp;&amp;</code>", "ET : vrai si les deux sont vrais", "<code>sousGarantie &amp;&amp; pieceDispo</code>"], ["<code>||</code>", "OU : vrai si au moins un est vrai", "<code>enPanne || enMaintenance</code>"], ["<code>!</code>", "NON : inverse", "<code>!pieceDispo</code>"]]) +
        K.run("s2_logique") +
        K.warn("= ou == ?", "<code>=</code> range une valeur dans une variable ; <code>==</code> compare deux valeurs. Pour comparer deux textes, on n'utilise pas <code>==</code> mais <code>a.equals(b)</code> (on verra pourquoi en séance 4)."),
        check: { q: "Avec <code>int t = 85;</code>, que vaut <code>t &gt; 80 &amp;&amp; t &lt; 90</code> ?", o: ["true", "false", "85", "Erreur de compilation"], a: 0, e: "85 &gt; 80 est vrai et 85 &lt; 90 est vrai : vrai ET vrai donne <code>true</code>." } },
      { title: "Lire au clavier avec Scanner", html:
        K.p("Pour qu'un programme demande des valeurs à l'utilisateur, on utilise la classe <code>Scanner</code> en trois temps :") +
        K.ol(["<b>importer</b> la classe en tout début de fichier : <code>import java.util.Scanner;</code>", "<b>créer</b> un Scanner relié au clavier : <code>Scanner sc = new Scanner(System.in);</code>", "<b>lire</b> avec la méthode adaptée au type attendu."]) +
        K.table(["Méthode", "Lit", "Exemple"], [["<code>nextInt()</code>", "un entier", "<code>int h = sc.nextInt();</code>"], ["<code>nextDouble()</code>", "un décimal", "<code>double t = sc.nextDouble();</code>"], ["<code>next()</code>", "un mot (jusqu'au premier espace)", "<code>String ref = sc.next();</code>"], ["<code>nextLine()</code>", "toute la ligne, espaces compris", "<code>String desc = sc.nextLine();</code>"]]) +
        K.p("Dans les exemples exécutables, la zone <b>Entrée clavier</b> joue le rôle de l'utilisateur : une valeur par ligne. Change-les et relance.") +
        K.run("s2_saisie") +
        K.warn("Le piège nextInt puis nextLine", "<code>nextInt()</code> lit le nombre mais laisse le retour à la ligne (la touche Entrée) dans le tampon. Le <code>nextLine()</code> suivant lit cette fin de ligne vide et renvoie <code>\"\"</code> immédiatement ! Solution : ajouter un <code>sc.nextLine();</code> juste après <code>nextInt()</code> pour « vider » la ligne.") +
        K.run("s2_piege") + K.run("s2_piegeok") +
        K.note("Virgule ou point ?", "Sur un ordinateur configuré en français, <code>nextDouble()</code> peut attendre <code>7500,5</code> (virgule) au lieu de <code>7500.5</code>. Si ta saisie provoque une <code>InputMismatchException</code>, essaie l'autre séparateur. Dans le code source, en revanche, c'est toujours le point : <code>7500.5</code>."),
        check: { q: "L'utilisateur tape <code>douze</code> alors que le programme fait <code>sc.nextInt()</code>. Que se passe-t-il ?", o: ["La variable vaut 0", "Java convertit le mot en 12", "Le programme s'arrête avec une InputMismatchException", "Erreur de compilation"], a: 2, e: "La compilation est correcte ; c'est à l'exécution que la saisie ne correspond pas au type attendu. On apprendra à gérer ce cas en séance 3 (hasNextInt) et 7 (try/catch)." } },
      { title: "Conversions de types", html:
        K.table(["Conversion", "Comment", "Remarque"], [
          ["<code>int</code> → <code>double</code>", "automatique : <code>double d = 5;</code>", "aucune perte"],
          ["<code>double</code> → <code>int</code>", "cast : <code>int n = (int) 9.99;</code>", "tronque : 9 (pas d'arrondi)"],
          ["arrondir un <code>double</code>", "<code>Math.round(9.99)</code>", "renvoie un <code>long</code> : 10"],
          ["texte → nombre", "<code>Integer.parseInt(\"250\")</code>, <code>Double.parseDouble(\"2.5\")</code>", "erreur à l'exécution si le texte n'est pas un nombre"],
          ["nombre → texte", "<code>\"\" + 250</code> ou <code>String.valueOf(250)</code>", ""],
          ["<code>char</code> → <code>int</code>", "automatique : <code>int code = 'A';</code>", "donne le code du caractère : 65"]]) +
        K.run("s2_conv") +
        K.p("Les erreurs de type sont détectées <b>à la compilation</b> : Java refuse de compiler tant qu'elles ne sont pas corrigées.") +
        K.table(["Message de javac", "Exemple fautif", "Correction"], [
          ["<code>incompatible types: possible lossy conversion from double to int</code>", "<code>int prix = 12.5;</code>", "<code>double prix = 12.5;</code> ou cast <code>(int)</code> si la perte est voulue"],
          ["<code>incompatible types: int cannot be converted to String</code>", "<code>String total = 3 * 4;</code>", "<code>int total = 3 * 4;</code> ou <code>\"\" + 3 * 4</code>"],
          ["<code>variable x might not have been initialized</code>", "<code>int x; System.out.println(x);</code>", "donner une valeur : <code>int x = 0;</code>"],
          ["<code>variable x is already defined in method main</code>", "<code>int x = 1; int x = 2;</code>", "<code>x = 2;</code> (sans réécrire le type)"]]) },
      { title: "Bien présenter les résultats : printf", html:
        K.p("La concaténation suffit souvent, mais elle affiche les <code>double</code> avec tous leurs chiffres (<code>8550.0</code>, <code>0.30000000000000004</code>). <code>printf</code> permet de choisir le format :") +
        K.table(["Code", "Affiche", "Exemple", "Résultat"], [["<code>%d</code>", "un entier", "<code>printf(\"%d postes\", 25)</code>", "25 postes"], ["<code>%.2f</code>", "un décimal avec 2 chiffres après le point", "<code>printf(\"%.2f\", 8550.0)</code>", "8550.00"], ["<code>%s</code>", "un texte", "<code>printf(\"Poste %s\", ref)</code>", "Poste PC-042"], ["<code>%n</code>", "un retour à la ligne", "", ""], ["<code>%-15s</code> / <code>%12.2f</code>", "largeur fixe (à gauche / à droite)", "pour aligner des colonnes", ""]]) +
        K.run("s2_ticket") +
        K.warn("Format et type doivent correspondre", "<code>printf(\"%d\", 2.5)</code> compile mais plante à l'exécution (<code>IllegalFormatConversionException: d != java.lang.Double</code>) : <code>%d</code> est réservé aux entiers. Sur un PC en français, <code>%.2f</code> peut aussi afficher une virgule : <code>8550,00</code>.") }
    ],

    demos: [
      { type: "stepper", title: "Suivre les variables : le coût d'une intervention", prog: "s2_cout",
        intro: "Regarde le tableau des variables se remplir à chaque ligne. L'entrée clavier est déjà fournie : 25000, puis 3, puis 7500.",
        notes: {
          5: "Création de la constante <code>TAUX_TVA</code>. Elle apparaît dans le tableau et ne changera plus.",
          6: "Création du Scanner relié au clavier (<code>System.in</code>).",
          10: "<code>nextDouble()</code> lit <b>25000</b> au clavier et le range dans <code>prixPieces</code>. Remarque : la valeur est un <code>double</code>, d'où le <code>.0</code>.",
          12: "<code>nextInt()</code> lit l'entier <b>3</b>.",
          16: "Calcul : 3 × 7500.0 = 22500.0. Comme <code>tarif</code> est un <code>double</code>, le résultat est un <code>double</code>.",
          17: "Total hors taxes = pièces + main d'œuvre.",
          18: "TVA = 47500.0 × 0.18. Regarde la valeur exacte : les calculs en <code>double</code> peuvent laisser des décimales inattendues. printf servira à arrondir à l'affichage.",
          19: "Total toutes taxes comprises.",
          22: "Concaténation : le <code>double</code> est converti en texte et collé au reste." } },
      { type: "stepper", title: "Échanger deux valeurs", prog: "s2_echange",
        intro: "Un classique : pour échanger le contenu de deux variables, il faut une troisième variable temporaire. Sans elle, on écraserait une valeur.",
        notes: { 5: "On sauvegarde la valeur de <code>posteA</code> avant de l'écraser.", 6: "<code>posteA</code> reçoit la valeur de <code>posteB</code>. Sans la sauvegarde, \"PC-01\" serait perdu.", 7: "<code>posteB</code> reçoit l'ancienne valeur de <code>posteA</code>, conservée dans <code>temporaire</code>." } },
      { type: "lab" }
    ],

    exercises: [
      { type: "predict", title: "Prédire les résultats des calculs", lvl: 1, prog: "s2_calculs",
        hint: "Trois pièges : la division entre deux <code>int</code>, le <code>+</code> après un texte, et la priorité de <code>/</code> sur <code>-</code>.",
        expl: "17 / 5 = <b>3</b> (division entière) ; 17 % 5 = <b>2</b> (le reste) ; 17 / 2.0 = <b>8.5</b> (un double dans le calcul) ; 10 - 4 / 2 = 10 - 2 = <b>8</b> (la division d'abord) ; <code>\"Postes : \" + 17 + 5</code> colle les nombres : <b>Postes : 175</b> ; enfin x = 5, puis 8, puis 9." },
      { type: "mcq", title: "Choisir le bon type", lvl: 1, intro: "Pour chaque donnée du parc informatique, choisis le type Java le plus adapté.",
        items: [
          { q: "Le numéro de série d'un disque : <code>WD-7781-XK</code>", o: ["int", "double", "String", "char"], a: 2, e: "Il contient des lettres et des tirets : c'est du texte." },
          { q: "La température du processeur en °C, par exemple 67,5", o: ["int", "double", "boolean", "String"], a: 1, e: "Une mesure avec décimales : <code>double</code>." },
          { q: "Le fait qu'un ordinateur soit connecté au réseau ou non", o: ["boolean", "String", "int", "char"], a: 0, e: "Deux états possibles : <code>boolean</code>." },
          { q: "Le nombre de tickets d'intervention ouverts", o: ["double", "int", "char", "String"], a: 1, e: "Un nombre entier : <code>int</code>." },
          { q: "La priorité d'un ticket notée A, B ou C", o: ["char", "boolean", "double", "int"], a: 0, e: "Un seul caractère : <code>char</code> (un <code>String</code> fonctionnerait aussi, mais <code>char</code> est plus précis)." }] },
      { type: "fill", title: "Compléter la saisie au clavier", lvl: 1,
        statement: "Complète les trous pour que le programme lise un nombre d'heures (entier) et un tarif (décimal), puis affiche le montant.",
        code: "import [[java.util.Scanner]];\n\npublic class Montant {\n    public static void main(String[] args) {\n        Scanner sc = new [[Scanner(System.in)]];\n        int heures = sc.[[nextInt()]];\n        double tarif = sc.[[nextDouble()]];\n        [[double]] montant = heures * tarif;\n        System.out.println(\"Montant : \" + montant);\n    }\n}",
        expl: "On importe <code>java.util.Scanner</code>, on crée le Scanner sur <code>System.in</code>, on lit un entier avec <code>nextInt()</code> et un décimal avec <code>nextDouble()</code>. Le montant est un <code>double</code> car il dépend d'un <code>double</code>." },
      { type: "hunt", title: "Erreurs de type", lvl: 2, code: P.s2_facture.code.replace(/\n$/, "").split("\n"), bad: [5, 7, 9],
        statement: "Ce programme contient trois erreurs de type. <b>Clique sur les lignes fautives</b>, puis vérifie.",
        fixes: {
          5: { msg: "Facture.java:5: error: incompatible types: possible lossy conversion from double to int", fr: "12500.50 est un décimal : on ne peut pas le ranger dans un <code>int</code> sans perdre les centimes. Le prix doit être un <code>double</code>.", fix: "        double prix = 12500.50;" },
          7: { msg: "Facture.java:7: error: incompatible types: int cannot be converted to String", fr: "Un calcul donne un nombre, pas un texte. (Après correction de la ligne 5, javac dirait « double cannot be converted to String ».)", fix: "        double total = prix * quantite;" },
          9: { msg: "Facture.java:9: error: variable remise might not have been initialized", fr: "<code>remise</code> est déclarée ligne 8 mais n'a jamais reçu de valeur : Java refuse de l'utiliser.", fix: "        double remise = 0;   // (ligne 8)" } },
        order: "Vérifié avec javac : les erreurs des lignes 5 et 7 sont signalées ensemble ; celle de la ligne 9 n'apparaît qu'une fois les deux premières corrigées, car Java vérifie l'initialisation des variables dans une étape ultérieure." },
      { type: "predict", title: "Une moyenne qui ne tombe pas juste", lvl: 2, prog: "s2_moyenne",
        hint: "Regarde les types dans <code>(note1 + note2) / 2</code> <b>avant</b> l'affectation au <code>double</code>.",
        expl: "<code>(12 + 15) / 2</code> : 27 / 2 entre deux <code>int</code> donne <b>13</b> ; ce n'est qu'ensuite que 13 est converti en <code>13.0</code> pour être rangé dans le <code>double</code>. Avec <code>/ 2.0</code>, la division se fait en décimal : <b>13.5</b>." },
      { type: "write", title: "Convertir des minutes en heures", lvl: 2, file: "Duree.java",
        statement: "<p>Le temps passé sur une intervention est saisi en minutes. Écris un programme qui lit un nombre entier de minutes et affiche, par exemple pour 135 :</p><p><code>135 min = 2 h 15 min</code></p><p>N'affiche aucun message avant la saisie (pas de <code>print</code> de question), pour que les tests automatiques puissent comparer exactement.</p>",
        starter: "import java.util.Scanner;\n\npublic class Duree {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int minutes = sc.nextInt();\n        // à compléter\n\n    }\n}\n",
        tests: [{ input: "135\n", label: "135 minutes" }, { input: "60\n", label: "60 minutes" }, { input: "59\n", label: "59 minutes" }, { input: "0\n", label: "0 minute" }],
        solution: "s2_duree", hint: "<p>Les heures pleines : <code>minutes / 60</code> (division entière). Les minutes restantes : <code>minutes % 60</code>.</p>",
        expl: "La division entière et le modulo travaillent ensemble : 135 / 60 = 2 et 135 % 60 = 15." },
      { type: "write", title: "Prix TTC d'une commande de pièces", lvl: 3, file: "PrixTTC.java",
        statement: "<p>Écris un programme qui lit le prix unitaire hors taxes d'une pièce (décimal) puis la quantité (entier), et affiche le total toutes taxes comprises (TVA 18 %) avec exactement deux décimales :</p><p><code>Total TTC : 29500.00 FCFA</code> (pour 12500 et 2)</p><p>Pas de question avant les saisies.</p>",
        starter: "import java.util.Scanner;\n\npublic class PrixTTC {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n\n    }\n}\n",
        tests: [{ input: "12500\n2\n", label: "12500 × 2" }, { input: "4999.99\n3\n", label: "4999.99 × 3" }, { input: "750\n0\n", label: "quantité nulle" }],
        solution: "s2_ttc", hint: "<p>Total = prix × quantité × 1.18. Pour afficher deux décimales : <code>System.out.printf(\"Total TTC : %.2f FCFA%n\", total);</code></p>" }
    ],

    tp: {
      title: "TP 2 — Calculer le coût d'une intervention", duration: "1 h", deliverable: "programme de calcul",
      intro: "Un technicien doit chiffrer chaque intervention : prix des pièces + main d'œuvre (heures × tarif horaire), puis la TVA de 18 %. Tu écris le programme qui fait ce calcul à partir des valeurs saisies au clavier.",
      steps: [
        "Repère les données d'entrée (pièces, heures, tarif) et choisis leur type.",
        "Déclare une constante <code>TAUX_TVA</code> avec <code>final</code>.",
        "Lis les trois valeurs avec un <code>Scanner</code>, en affichant une question avant chaque saisie.",
        "Calcule la main d'œuvre, le total HT, la TVA et le total TTC dans des variables bien nommées.",
        "Affiche le récapitulatif ; teste avec plusieurs jeux de valeurs (dont 0 heure).",
        "Bonus : affiche un ticket aligné avec <code>printf</code> et deux décimales."
      ],
      parts: [
        { title: "Le programme de calcul", html: K.p("Écris <code>CoutIntervention.java</code>. Il doit produire exactement l'affichage ci-dessous pour les saisies 25000, 3 et 7500. Les questions sont affichées avec <code>print</code> (sans retour à la ligne) ; dans un vrai terminal, la valeur tapée apparaît juste après."),
          expected: { prog: "s2_cout", input: "25000\n3\n7500\n" },
          write: { file: "CoutIntervention.java", statement: "", starter: "import java.util.Scanner;\n\npublic class CoutIntervention {\n    public static void main(String[] args) {\n        final double TAUX_TVA = 0.18;\n        Scanner sc = new Scanner(System.in);\n\n    }\n}\n",
            tests: [{ input: "25000\n3\n7500\n", label: "pièces 25000, 3 h à 7500" }, { input: "0\n2\n6000\n", label: "sans pièce" }, { input: "18000\n0\n7500\n", label: "0 heure" }], solution: "s2_cout",
            expl: "Chaque étape du calcul a sa propre variable : c'est plus lisible et plus facile à vérifier dans le mode pas à pas." } },
        { title: "Bonus : un ticket aligné avec printf", bonus: true, html: K.p("Reprends le calcul et affiche un ticket aligné en colonnes avec deux décimales. <code>%-15s</code> réserve 15 caractères alignés à gauche, <code>%12.2f</code> 12 caractères alignés à droite avec 2 décimales. Ici, pas de questions avant la saisie."),
          expected: { prog: "s2_ticket", input: "25000\n3\n7500\n" }, solution: "s2_ticket", expl: "Le TTC est calculé directement avec <code>totalHT * (1 + TAUX_TVA)</code>. <code>%.0f</code> affiche un décimal sans chiffre après la virgule." }
      ]
    },

    quiz: [
      { q: "Quelle déclaration est correcte ?", o: ["<code>int 2postes = 5;</code>", "<code>int nbPostes = 5;</code>", "<code>int nb postes = 5;</code>", "<code>Int nbPostes = 5;</code>"], a: 1, e: "Un nom ne commence pas par un chiffre et ne contient pas d'espace ; le type s'écrit <code>int</code> en minuscules." },
      { q: "Que vaut <code>9 / 2</code> ?", o: ["4.5", "4", "5", "1"], a: 1, e: "Deux <code>int</code> : division entière, 4." },
      { q: "Que vaut <code>9 % 2</code> ?", o: ["4", "4.5", "1", "0"], a: 2, e: "Le reste de 9 divisé par 2 est 1." },
      { q: "Qu'affiche <code>System.out.println(\"Total : \" + 2 + 3);</code> ?", o: ["Total : 5", "Total : 23", "Total : 2 + 3", "Erreur"], a: 1, e: "À gauche il y a un texte : chaque <code>+</code> colle. Il faut des parenthèses pour additionner d'abord : <code>(2 + 3)</code>." },
      { q: "Quel type pour un tarif horaire de 7500,50 FCFA ?", o: ["int", "double", "char", "boolean"], a: 1, e: "Un montant avec décimales : <code>double</code>." },
      { q: "<code>int x = 7.5;</code> donne :", o: ["x = 7", "x = 8", "une erreur de compilation", "une erreur à l'exécution"], a: 2, e: "<code>incompatible types: possible lossy conversion from double to int</code>. Il faut <code>(int) 7.5</code> si on accepte la perte." },
      { q: "Que vaut <code>(int) 9.99</code> ?", o: ["10", "9", "9.99", "Erreur"], a: 1, e: "Le cast tronque : il supprime la partie décimale sans arrondir. Pour arrondir : <code>Math.round</code>." },
      { q: "Avec <code>boolean a = true, b = false;</code>, que vaut <code>a &amp;&amp; !b</code> ?", o: ["true", "false", "Erreur", "1"], a: 0, e: "<code>!b</code> vaut true ; true ET true donne true." },
      { q: "Quelle ligne doit apparaître en haut du fichier pour utiliser <code>Scanner</code> ?", o: ["<code>import java.util.Scanner;</code>", "<code>include Scanner;</code>", "<code>import Scanner.java;</code>", "Aucune, Scanner est toujours disponible"], a: 0, e: "Scanner est dans le paquetage <code>java.util</code> : il faut l'importer." },
      { q: "Après <code>int n = sc.nextInt();</code>, un <code>sc.nextLine()</code> renvoie souvent une chaîne vide. Pourquoi ?", o: ["nextLine est cassé", "nextInt laisse la fin de ligne (Entrée) non lue", "Le Scanner est fermé", "Il faut utiliser next() à la place de nextInt()"], a: 1, e: "Il faut ajouter un <code>sc.nextLine();</code> après le <code>nextInt()</code> pour consommer la fin de ligne." },
      { q: "Comment convertir le texte <code>\"42\"</code> en entier ?", o: ["<code>(int) \"42\"</code>", "<code>Integer.parseInt(\"42\")</code>", "<code>\"42\".toInt()</code>", "<code>int(\"42\")</code>"], a: 1, e: "<code>Integer.parseInt</code>. Un cast ne convertit pas un texte en nombre." },
      { q: "Que fait <code>final double TVA = 0.18;</code> ?", o: ["Déclare une constante dont la valeur ne pourra plus changer", "Déclare la dernière variable du programme", "Arrondit 0.18", "Rien de particulier"], a: 0, e: "Toute tentative de modification provoque une erreur de compilation." }
    ],

    video: { src: "media/seance2.mp4", title: "variables, types et opérateurs", dur: 92, chapters: [[0, "Titre"], [5, "Une variable"], [18, "Les types de base"], [29, "Opérateurs"], [41, "La division entière"], [50, "Lire au clavier"], [63, "Le piège nextLine"], [74, "Erreurs de type"], [84, "À retenir"]] },
    youtube: [
      { t: "Les variables et les types en Java", src: "Recherche YouTube", d: "Déclarer, affecter, choisir entre int, double, boolean, String.", q: "java variables types primitifs débutant français" },
      { t: "Lire au clavier avec Scanner", src: "Recherche YouTube", d: "nextInt, nextDouble, nextLine et le piège du retour à la ligne.", q: "java Scanner nextInt nextLine tutoriel français" },
      { t: "Opérateurs et division entière", src: "Recherche YouTube", d: "Priorité des opérateurs, modulo, cast.", q: "java opérateurs modulo division entière cast français" }
    ],
    docs: [
      { t: "Variables (Java Tutorials)", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html", d: "Types primitifs, nommage, valeurs par défaut." },
      { t: "Operators (Java Tutorials)", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html", d: "Tous les opérateurs et leur priorité." },
      { t: "Classe Scanner (Javadoc Java 21)", src: "docs.oracle.com", u: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Scanner.html", d: "Référence complète des méthodes de lecture." }
    ],

    memo: {
      cards: [
        ["Déclarer", "<code>type nom = valeur;</code> · constante : <code>final double TAUX_TVA = 0.18;</code> · le type ne s'écrit qu'une fois."],
        ["Types", "<code>int</code> entier · <code>double</code> décimal · <code>char</code> 'A' · <code>boolean</code> true/false · <code>String</code> \"texte\""],
        ["Calculs", "<code>+ - * / %</code> · <b>int / int = division entière</b> · <code>7 / 2.0</code> = 3.5 · <code>x += 2</code>, <code>x++</code> · \"texte\" + nombre colle."],
        ["Conditions", "<code>== != &lt; &gt; &lt;= &gt;=</code> · <code>&amp;&amp;</code> ET, <code>||</code> OU, <code>!</code> NON · textes : <code>a.equals(b)</code>."],
        ["Scanner", "<code>import java.util.Scanner;</code> · <code>Scanner sc = new Scanner(System.in);</code> · <code>nextInt()</code>, <code>nextDouble()</code>, <code>next()</code>, <code>nextLine()</code> · après nextInt, un <code>sc.nextLine();</code> avant de lire une ligne."],
        ["Conversions", "<code>(int) 9.99</code> → 9 · <code>Math.round(9.99)</code> → 10 · <code>Integer.parseInt(\"42\")</code> · <code>\"\" + 42</code> · <code>printf(\"%.2f%n\", x)</code>."]
      ],
      code: P.s2_cout.code, codeTitle: "Modèle : saisir, calculer, afficher",
      errors: [["<code>possible lossy conversion from double to int</code>", "Décimal rangé dans un int", "Type double, ou cast (int)"], ["<code>String cannot be converted to int</code>", "Texte rangé dans un nombre", "Integer.parseInt(texte)"], ["<code>might not have been initialized</code>", "Variable utilisée sans valeur", "Initialiser à la déclaration"], ["<code>is already defined</code>", "Type réécrit devant une variable existante", "Enlever le type"], ["<code>InputMismatchException</code> (exécution)", "Saisie d'un mauvais type", "Vérifier la saisie (point ou virgule ?)"], ["Résultat arrondi bizarrement", "Division entière", "Mettre un double dans le calcul"]],
      glossary: [["Variable", "Emplacement mémoire nommé, typé, qui contient une valeur."], ["Affectation", "Opération <code>=</code> qui range une valeur dans une variable."], ["Type primitif", "int, double, char, boolean (et long, float…) : valeurs simples."], ["Constante", "Variable déclarée <code>final</code>, qui ne peut plus changer."], ["Opérateur", "Symbole de calcul ou de comparaison : + - * / % == &lt; &amp;&amp;…"], ["Modulo", "Reste de la division entière, opérateur <code>%</code>."], ["Cast", "Conversion explicite : <code>(int) x</code>."], ["Concaténation", "Assemblage de textes avec <code>+</code>."], ["Scanner", "Classe de java.util qui lit les saisies au clavier."]],
      selfcheck: ["Je choisis le bon type pour une donnée (entier, décimal, texte, booléen, caractère).", "Je sais expliquer pourquoi 7 / 2 vaut 3 et comment obtenir 3.5.", "Je sais utiliser % pour obtenir un reste.", "Je sais lire un entier, un décimal et une ligne avec Scanner, et j'évite le piège nextInt / nextLine.", "Je reconnais les erreurs « lossy conversion » et « might not have been initialized ».", "J'ai réalisé le TP 2 (coût d'une intervention)."],
      next: "Séance 3 : conditions et boucles. Ton programme saura prendre des décisions (diagnostic selon un code d'erreur) et répéter des actions (menu jusqu'à ce que l'utilisateur quitte)."
    }
  };
})();
