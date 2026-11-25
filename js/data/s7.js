(function () {
  var P = COURSE.progs;
  COURSE.seances.push({ id: "s7", tag: "S-07", short: "Héritage, exceptions, listes" });

  P.s7_relation = { file: "Relations.java", lab: "Relation entre classes", code:
`class Technicien {
    private String nom;

    public Technicien(String nom) {
        this.nom = nom;
    }

    public String getNom() {
        return nom;
    }
}

class Intervention {
    private String poste;
    private String description;
    private Technicien technicien;

    public Intervention(String poste, String description, Technicien technicien) {
        this.poste = poste;
        this.description = description;
        this.technicien = technicien;
    }

    public String toString() {
        return poste + " : " + description + " (par " + technicien.getNom() + ")";
    }
}

public class Relations {
    public static void main(String[] args) {
        Technicien awa = new Technicien("Awa");
        Intervention i1 = new Intervention("PC-03", "Remplacement clavier", awa);
        Intervention i2 = new Intervention("IMP-01", "Bourrage papier", awa);
        System.out.println(i1);
        System.out.println(i2);
    }
}
` };
  P.s7_heritage = { file: "Heritage.java", lab: "Héritage : Equipement, Ordinateur, Imprimante", code:
`class Equipement {
    protected String id;
    protected String marque;
    private boolean enPanne;

    public Equipement(String id, String marque) {
        this.id = id;
        this.marque = marque;
    }

    public void signalerPanne() {
        enPanne = true;
    }

    public String decrire() {
        return id + " - " + marque + (enPanne ? " [EN PANNE]" : "");
    }
}

class Ordinateur extends Equipement {
    private int ram;

    public Ordinateur(String id, String marque, int ram) {
        super(id, marque);
        this.ram = ram;
    }

    @Override
    public String decrire() {
        return "Ordinateur " + super.decrire() + ", " + ram + " Go";
    }
}

class Imprimante extends Equipement {
    private boolean couleur;

    public Imprimante(String id, String marque, boolean couleur) {
        super(id, marque);
        this.couleur = couleur;
    }

    @Override
    public String decrire() {
        return "Imprimante " + super.decrire() + (couleur ? ", couleur" : ", noir et blanc");
    }
}

public class Heritage {
    public static void main(String[] args) {
        Ordinateur pc = new Ordinateur("PC-01", "Dell", 16);
        Imprimante imp = new Imprimante("IMP-01", "HP", true);
        imp.signalerPanne();

        Equipement[] parc = {pc, imp, new Equipement("SW-01", "Cisco")};
        for (Equipement e : parc) {
            System.out.println(e.decrire());
        }
    }
}
` };
  P.s7_poly = { file: "Polymorphisme.java", code:
`class Equipement {
    public String type() { return "Équipement"; }
    public int priorite() { return 3; }
    public String fiche() { return type() + " (priorité " + priorite() + ")"; }
}

class Serveur extends Equipement {
    @Override public String type() { return "Serveur"; }
    @Override public int priorite() { return 1; }
}

class Ecran extends Equipement {
    @Override public String type() { return "Écran"; }
}

public class Polymorphisme {
    public static void main(String[] args) {
        Equipement[] liste = {new Serveur(), new Ecran(), new Equipement()};
        for (Equipement e : liste) {
            System.out.println(e.fiche());
        }
    }
}
` };
  P.s7_list = { file: "Listes.java", lab: "ArrayList : les bases", code:
`import java.util.ArrayList;

public class Listes {
    public static void main(String[] args) {
        ArrayList<String> refs = new ArrayList<>();
        refs.add("PC-01");
        refs.add("PC-02");
        refs.add("IMP-01");
        System.out.println(refs + " taille " + refs.size());

        System.out.println("Premier : " + refs.get(0));
        refs.set(1, "PC-02B");
        refs.remove("IMP-01");
        refs.add(0, "SW-01");
        System.out.println(refs);

        System.out.println(refs.contains("PC-01") + " " + refs.indexOf("PC-01"));
        for (String r : refs) {
            System.out.println("- " + r);
        }

        ArrayList<Integer> heures = new ArrayList<>();
        heures.add(3);
        heures.add(5);
        int total = 0;
        for (int h : heures) {
            total += h;
        }
        System.out.println("Total : " + total + " h");
    }
}
` };
  P.s7_listobj = { file: "Parc.java", lab: "Une liste d'objets", code:
`import java.util.ArrayList;

class Equipement {
    private String id;
    private boolean enPanne;

    public Equipement(String id) { this.id = id; }
    public String getId() { return id; }
    public boolean isEnPanne() { return enPanne; }
    public void signalerPanne() { enPanne = true; }
    public String toString() { return id + (enPanne ? " (panne)" : ""); }
}

public class Parc {
    static Equipement rechercher(ArrayList<Equipement> parc, String id) {
        for (Equipement e : parc) {
            if (e.getId().equalsIgnoreCase(id)) {
                return e;
            }
        }
        return null;
    }

    public static void main(String[] args) {
        ArrayList<Equipement> parc = new ArrayList<>();
        parc.add(new Equipement("PC-01"));
        parc.add(new Equipement("PC-02"));
        parc.add(new Equipement("IMP-01"));

        Equipement trouve = rechercher(parc, "pc-02");
        if (trouve != null) {
            trouve.signalerPanne();
        }
        System.out.println(rechercher(parc, "SW-09"));

        int pannes = 0;
        for (Equipement e : parc) {
            if (e.isEnPanne()) {
                pannes++;
            }
        }
        System.out.println(parc);
        System.out.println(pannes + " équipement(s) en panne sur " + parc.size());
    }
}
` };
  P.s7_exc1 = { file: "Conversion.java", lab: "try / catch : NumberFormatException", input: "12a\n", code:
`import java.util.Scanner;

public class Conversion {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Nombre d'heures : ");
        String saisie = sc.nextLine();
        try {
            int heures = Integer.parseInt(saisie);
            System.out.println("Coût : " + heures * 7500 + " FCFA");
        } catch (NumberFormatException e) {
            System.out.println("Saisie invalide : " + e.getMessage());
        }
        System.out.println("Le programme continue.");
    }
}
` };
  P.s7_sansexc = { file: "SansProtection.java", lab: "Sans try : le programme s'arrête", input: "douze\n", code:
`import java.util.Scanner;

public class SansProtection {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Nombre d'heures : ");
        int heures = Integer.parseInt(sc.nextLine());
        System.out.println("Coût : " + heures * 7500 + " FCFA");
        System.out.println("Fin.");
    }
}
` };
  P.s7_robuste = { file: "SaisieRobuste.java", lab: "Saisie robuste : redemander", input: "abc\n-3\n12\n", code:
`import java.util.Scanner;

public class SaisieRobuste {
    static Scanner sc = new Scanner(System.in);

    static int lireEntierPositif(String question) {
        while (true) {
            System.out.print(question);
            String ligne = sc.nextLine().trim();
            try {
                int n = Integer.parseInt(ligne);
                if (n >= 0) {
                    return n;
                }
                System.out.println("Le nombre doit être positif.");
            } catch (NumberFormatException e) {
                System.out.println("« " + ligne + " » n'est pas un entier.");
            }
        }
    }

    public static void main(String[] args) {
        int quantite = lireEntierPositif("Quantité de cartouches : ");
        System.out.println("Commande de " + quantite + " cartouches enregistrée.");
    }
}
` };
  P.s7_throw = { file: "Lancer.java", lab: "throw, finally et exception personnalisée", code:
`class StockInsuffisantException extends Exception {
    public StockInsuffisantException(String message) {
        super(message);
    }
}

class Stock {
    private int quantite;

    public Stock(int quantite) {
        if (quantite < 0) {
            throw new IllegalArgumentException("Quantité négative : " + quantite);
        }
        this.quantite = quantite;
    }

    public void retirer(int n) throws StockInsuffisantException {
        if (n > quantite) {
            throw new StockInsuffisantException("Demande " + n + ", disponible " + quantite);
        }
        quantite -= n;
    }

    public int getQuantite() { return quantite; }
}

public class Lancer {
    public static void main(String[] args) {
        Stock s = new Stock(10);
        try {
            s.retirer(4);
            s.retirer(8);
            System.out.println("Jamais affiché");
        } catch (StockInsuffisantException e) {
            System.out.println("Refusé : " + e.getMessage());
        } finally {
            System.out.println("Stock restant : " + s.getQuantite());
        }

        try {
            Stock faux = new Stock(-5);
        } catch (IllegalArgumentException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
` };
  P.s7_flux = { file: "Flux.java", code:
`public class Flux {
    static int diviser(int a, int b) {
        return a / b;
    }

    public static void main(String[] args) {
        int[] diviseurs = {2, 0, 5};
        for (int d : diviseurs) {
            try {
                System.out.print("A");
                int r = diviser(10, d);
                System.out.print("B" + r);
            } catch (ArithmeticException e) {
                System.out.print("C");
            } finally {
                System.out.print("D");
            }
            System.out.println();
        }
    }
}
` };
  P.s7_fichier = { file: "Sauvegarde.java", jdkOnly: true, code:
`import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

public class Sauvegarde {
    public static void main(String[] args) {
        ArrayList<String> refs = new ArrayList<>();
        refs.add("PC-01;Dell;OK");
        refs.add("IMP-01;HP;EN_PANNE");

        // Écriture : une ligne par équipement
        try (PrintWriter out = new PrintWriter(new FileWriter("parc.txt"))) {
            for (String r : refs) {
                out.println(r);
            }
            System.out.println("Sauvegarde de " + refs.size() + " équipements.");
        } catch (IOException e) {
            System.out.println("Écriture impossible : " + e.getMessage());
        }

        // Lecture : on relit le fichier ligne par ligne
        ArrayList<String> relus = new ArrayList<>();
        try (BufferedReader in = new BufferedReader(new FileReader("parc.txt"))) {
            String ligne;
            while ((ligne = in.readLine()) != null) {
                String[] champs = ligne.split(";");
                relus.add(champs[0] + " (" + champs[2] + ")");
            }
        } catch (IOException e) {
            System.out.println("Lecture impossible : " + e.getMessage());
        }
        System.out.println("Relu : " + relus);
    }
}
` };
  P.s7_bug = { file: "ParcEcrans.java", code:
`import java.util.ArrayList;

class Equipement {
    private String id;
    public Equipement(String id) { this.id = id; }
}

class Ecran extends Equipement {
    private int pouces;
    public Ecran(String id, int pouces) {
        super(id);
        this.pouces = pouces;
    }
    public String decrire() { return id + " " + pouces + " pouces"; }
}

public class ParcEcrans {
    public static void main(String[] args) {
        ArrayList<int> tailles = new ArrayList<>();
        ArrayList<Ecran> ecrans = new ArrayList<>();
        ecrans.add(new Ecran("EC-01", 24));
        System.out.println(ecrans.length);
    }
}
` };
  P.s7_switch = { file: "TestSwitch.java", code:
`class Equipement {
    protected String id;

    public Equipement(String id) {
        this.id = id;
    }

    public String decrire() {
        return "Equipement " + id;
    }
}

class Commutateur extends Equipement {
    private int ports;

    public Commutateur(String id, int ports) {
        super(id);
        this.ports = ports;
    }

    @Override
    public String decrire() {
        return "Commutateur " + id + " (" + ports + " ports)";
    }

    public boolean estGrand() {
        return ports >= 24;
    }
}

public class TestSwitch {
    public static void main(String[] args) {
        Equipement[] parc = {new Equipement("SRV-01"), new Commutateur("SW-01", 48), new Commutateur("SW-02", 8)};
        for (Equipement e : parc) {
            System.out.println(e.decrire());
        }
        Commutateur c = new Commutateur("SW-03", 24);
        System.out.println(c.estGrand());
    }
}
` };
  P.s7_temps = { file: "Releves.java", code:
`import java.util.ArrayList;
import java.util.Scanner;

public class Releves {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<Integer> temps = new ArrayList<>();
        int t = sc.nextInt();
        while (t != -1) {
            temps.add(t);
            t = sc.nextInt();
        }
        ArrayList<Integer> chauds = new ArrayList<>();
        for (int x : temps) {
            if (x > 70) {
                chauds.add(x);
            }
        }
        System.out.println(temps.size() + " relevés");
        System.out.println("Au-dessus de 70 : " + chauds);
    }
}
` };
  P.s7_somme = { file: "SommeSure.java", code:
`import java.util.Scanner;

public class SommeSure {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        int somme = 0;
        int rejets = 0;
        for (int i = 0; i < n; i++) {
            String ligne = sc.nextLine();
            try {
                somme += Integer.parseInt(ligne.trim());
            } catch (NumberFormatException e) {
                rejets++;
            }
        }
        System.out.println("Somme : " + somme);
        System.out.println("Lignes rejetées : " + rejets);
    }
}
` };
  P.s7_tp = { file: "GestionEquipements.java", lab: "TP 7 : liste d'équipements", input: "1\nPC-01\nDell\n1\nIMP-01\nHP\n2\n3\nimp-01\nx\n3\nSW-01\n0\n", code:
`import java.util.ArrayList;
import java.util.Scanner;

class Equipement {
    private String id;
    private String marque;

    public Equipement(String id, String marque) {
        this.id = id;
        this.marque = marque;
    }

    public String getId() { return id; }

    public String toString() { return id + " (" + marque + ")"; }
}

public class GestionEquipements {
    static Scanner sc = new Scanner(System.in);
    static ArrayList<Equipement> parc = new ArrayList<>();

    static int lireChoix() {
        while (true) {
            System.out.print("Choix : ");
            String ligne = sc.nextLine().trim();
            try {
                return Integer.parseInt(ligne);
            } catch (NumberFormatException e) {
                System.out.println("Entrez un numéro de menu.");
            }
        }
    }

    static void ajouter() {
        System.out.print("Identifiant : ");
        String id = sc.nextLine().trim();
        System.out.print("Marque : ");
        String marque = sc.nextLine().trim();
        parc.add(new Equipement(id, marque));
        System.out.println("Ajouté. " + parc.size() + " équipement(s).");
    }

    static void afficher() {
        if (parc.isEmpty()) {
            System.out.println("Parc vide.");
        }
        for (int i = 0; i < parc.size(); i++) {
            System.out.println((i + 1) + ". " + parc.get(i));
        }
    }

    static void rechercher() {
        System.out.print("Identifiant cherché : ");
        String id = sc.nextLine().trim();
        for (Equipement e : parc) {
            if (e.getId().equalsIgnoreCase(id)) {
                System.out.println("Trouvé : " + e);
                return;
            }
        }
        System.out.println("Introuvable.");
    }

    public static void main(String[] args) {
        int choix;
        do {
            System.out.println("1. Ajouter  2. Afficher  3. Rechercher  0. Quitter");
            choix = lireChoix();
            switch (choix) {
                case 1 -> ajouter();
                case 2 -> afficher();
                case 3 -> rechercher();
                case 0 -> System.out.println("Au revoir.");
                default -> System.out.println("Choix inconnu.");
            }
        } while (choix != 0);
    }
}
` };
  P.s7_tpa = { file: "ListeParc.java", code:
`import java.util.ArrayList;
import java.util.Scanner;

public class ListeParc {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<String> parc = new ArrayList<>();
        String commande = sc.next();
        while (!commande.equals("FIN")) {
            if (commande.equals("AJOUT")) {
                parc.add(sc.next());
            } else if (commande.equals("SUPPR")) {
                String id = sc.next();
                if (!parc.remove(id)) {
                    System.out.println("Absent : " + id);
                }
            } else if (commande.equals("LISTE")) {
                System.out.println(parc.size() + " : " + parc);
            }
            commande = sc.next();
        }
    }
}
` };
  P.s7_tpb = { file: "ChoixMenu.java", code:
`import java.util.Scanner;

public class ChoixMenu {
    static Scanner sc = new Scanner(System.in);

    static int lireChoix(int max) {
        while (true) {
            String ligne = sc.nextLine().trim();
            try {
                int c = Integer.parseInt(ligne);
                if (c >= 0 && c <= max) {
                    return c;
                }
                System.out.println("Hors menu");
            } catch (NumberFormatException e) {
                System.out.println("Pas un nombre");
            }
        }
    }

    public static void main(String[] args) {
        int c = lireChoix(3);
        System.out.println("Choix retenu : " + c);
    }
}
` };

  COURSE.data.s7 = {
    hours: "4 h", split: "CM 1 h · TD 1 h · TP 2 h", comp: "C5, C6",
    h1: "Consolider l'objet, <em>gérer les erreurs et les données</em>",
    lede: "Tu relies tes classes entre elles, tu factorises ce qu'elles ont en commun avec l'héritage, tu ranges un nombre variable d'équipements dans une ArrayList et tu empêches une saisie invalide de faire planter le programme.",
    prereq: "classes, constructeurs, encapsulation, toString (séance 6) ; méthodes (séance 5).",
    objectives: [
      "Relier des classes : un objet qui contient une référence vers un autre",
      "Utiliser l'héritage (extends, super) et redéfinir une méthode",
      "Comprendre ce qu'est une exception et la traiter avec try / catch",
      "Gérer une liste d'objets de taille variable avec ArrayList",
      "Découvrir la sauvegarde dans un fichier texte"
    ],
    lesson: [
      { title: "Relations entre classes", html:
        K.p("Un attribut peut être de type <b>classe</b> : une intervention connaît le technicien qui l'a réalisée. On dit qu'il existe une <b>association</b> entre Intervention et Technicien. Plusieurs interventions peuvent référencer le même technicien : ce n'est pas une copie, c'est la même personne.") +
        '<div class="umlrow">' + K.uml("Intervention", ["- poste : String", "- description : String", "- technicien : Technicien"], ["+ toString() : String"]) + '<span class="inherit-arrow">— réalisée par →</span>' + K.uml("Technicien", ["- nom : String"], ["+ getNom() : String"]) + "</div>" +
        K.run("s7_relation") +
        K.p("Dans <code>toString</code>, l'intervention demande son nom au technicien (<code>technicien.getNom()</code>) : chaque classe garde la responsabilité de ses propres données.") },
      { title: "L'héritage : extends et super", html:
        K.p("Un ordinateur et une imprimante ont beaucoup en commun : un identifiant, une marque, un état de panne. Plutôt que de recopier ces attributs dans chaque classe, on les place dans une classe générale <code>Equipement</code> ; <code>Ordinateur</code> et <code>Imprimante</code> en <b>héritent</b> et ajoutent seulement leurs particularités.") +
        '<div class="umlrow">' + K.uml("Equipement", ["# id : String", "# marque : String", "- enPanne : boolean"], ["+ signalerPanne()", "+ decrire() : String"]) + '<span class="inherit-arrow">◁— extends —</span>' + K.uml("Ordinateur", ["- ram : int"], ["+ decrire() : String"], "child") + K.uml("Imprimante", ["- couleur : boolean"], ["+ decrire() : String"], "child") + "</div>" +
        K.run("s7_heritage") +
        K.ul(["<code>class Ordinateur extends Equipement</code> : Ordinateur reçoit tous les attributs et méthodes d'Equipement. Un ordinateur <b>est un</b> équipement.", "<code>super(id, marque)</code>, en <b>première ligne</b> du constructeur, appelle le constructeur de la classe mère.", "<code>protected</code> : visible dans la classe et ses sous-classes (<code>#</code> en UML). Un attribut <code>private</code> de la mère reste inaccessible à la fille, qui passe par les méthodes publiques.", "<b>Redéfinir</b> (<code>@Override</code>) : la sous-classe réécrit <code>decrire()</code>. <code>super.decrire()</code> réutilise la version de la mère."]) +
        K.note("Polymorphisme", "Le tableau est de type <code>Equipement[]</code>, mais chaque case contient un objet précis. À l'appel <code>e.decrire()</code>, Java exécute la version de la <b>classe réelle</b> de l'objet. Un même appel, plusieurs comportements : c'est le polymorphisme. Le syllabus le limite ici à des exemples simples."),
        check: { q: "Dans le constructeur d'Ordinateur, à quoi sert <code>super(id, marque);</code> ?", o: ["À appeler le constructeur d'Equipement pour initialiser les attributs hérités", "À créer un second objet", "À appeler decrire()", "C'est facultatif et sans effet"], a: 0, e: "Les attributs hérités sont initialisés par la classe mère. Cet appel doit être la première instruction." } },
      { title: "Qu'est-ce qu'une exception ?", html:
        K.p("Une <b>exception</b> est un événement anormal qui interrompt l'exécution : division entière par zéro, indice hors limites, objet null, texte qui n'est pas un nombre. Si personne ne la traite, le programme s'arrête et la JVM affiche le nom de l'exception, son message et la pile d'appels (« at … ») :") +
        K.run("s7_sansexc") +
        K.table(["Exception", "Cause typique"], [["<code>NumberFormatException</code>", "<code>Integer.parseInt(\"douze\")</code>"], ["<code>InputMismatchException</code>", "<code>sc.nextInt()</code> sur un mot"], ["<code>ArithmeticException</code>", "division entière par 0"], ["<code>ArrayIndexOutOfBoundsException</code> / <code>IndexOutOfBoundsException</code>", "indice hors d'un tableau / d'une liste"], ["<code>NullPointerException</code>", "méthode appelée sur null"], ["<code>IllegalArgumentException</code>", "valeur refusée par une méthode"]]) +
        K.p("Ces erreurs se produisent <b>à l'exécution</b> : le programme a compilé. Lis toujours la première ligne (le nom et le message) puis la ligne <code>at …(Fichier.java:N)</code> qui indique où cela s'est produit.") },
      { title: "Traiter une exception : try / catch / finally", html:
        K.code(["try {", "    // code qui peut lever une exception", "} catch (TypeException e) {", "    // que faire si elle se produit", "} finally {", "    // exécuté dans tous les cas (facultatif)", "}"]) +
        K.run("s7_exc1") +
        K.p("Si une exception se produit dans le <code>try</code>, la suite du try est <b>abandonnée</b> et l'exécution saute dans le <code>catch</code> correspondant ; ensuite le programme <b>continue normalement</b> après le bloc. <code>e.getMessage()</code> donne le message de l'exception.",
          "Application directe : redemander une valeur tant que la saisie est invalide, au lieu de planter. On lit la ligne entière avec <code>nextLine()</code>, puis on la convertit dans un try :") +
        K.run("s7_robuste") +
        K.warn("Ne pas tout attraper sans rien dire", "Un <code>catch (Exception e) { }</code> vide fait disparaître les erreurs sans explication : le bug devient invisible. Attrape le type précis attendu et informe l'utilisateur."),
        check: { q: "Dans un try, l'instruction de la ligne 2 lève une exception attrapée par le catch. La ligne 3 du try :", o: ["S'exécute quand même", "Est abandonnée : on saute dans le catch", "S'exécute après le catch", "Provoque une erreur de compilation"], a: 1, e: "Le reste du try est ignoré ; après le catch (et le finally), l'exécution reprend après le bloc." } },
      { title: "Lever ses propres exceptions : throw", html:
        K.p("Une méthode peut refuser une situation invalide en <b>lançant</b> une exception avec <code>throw</code>. C'est plus propre qu'un simple message : l'appelant est obligé de réagir.") +
        K.run("s7_throw") +
        K.ul(["<code>IllegalArgumentException</code> est une exception « non vérifiée » : on peut la lancer sans rien déclarer.", "Une exception qui hérite d'<code>Exception</code> (comme <code>StockInsuffisantException</code>) est « vérifiée » : la méthode doit l'annoncer avec <code>throws</code>, et l'appelant doit la traiter (try/catch) ou l'annoncer à son tour. Sinon : <code>unreported exception … must be caught or declared to be thrown</code>.", "Le bloc <code>finally</code> s'exécute qu'il y ait eu une exception ou non : idéal pour un affichage final ou la fermeture d'une ressource."]) },
      { title: "ArrayList : une liste qui grandit", html:
        K.p("Un tableau a une taille fixe ; un parc informatique, non. <code>ArrayList</code> est une <b>collection</b> qui s'agrandit et rétrécit selon les ajouts et suppressions.") +
        K.code(["import java.util.ArrayList;", "", "ArrayList<String> refs = new ArrayList<>();   // le type des éléments entre < >"]) +
        K.table(["Méthode", "Rôle", "Équivalent tableau"], [["<code>add(x)</code> / <code>add(i, x)</code>", "ajoute à la fin / à la position i", "impossible (taille fixe)"], ["<code>get(i)</code>", "élément à la position i", "<code>t[i]</code>"], ["<code>set(i, x)</code>", "remplace l'élément i", "<code>t[i] = x</code>"], ["<code>remove(i)</code> / <code>remove(x)</code>", "supprime par position / par valeur", "impossible"], ["<code>size()</code>", "nombre d'éléments", "<code>t.length</code>"], ["<code>contains(x)</code>, <code>indexOf(x)</code>", "présence, position (ou -1)", "boucle de recherche"], ["<code>isEmpty()</code>, <code>clear()</code>", "vide ? / tout vider", ""]]) +
        K.run("s7_list") +
        K.warn("Pas de types primitifs entre < >", "On écrit <code>ArrayList&lt;Integer&gt;</code>, <code>ArrayList&lt;Double&gt;</code>, <code>ArrayList&lt;Character&gt;</code>, pas <code>ArrayList&lt;int&gt;</code> (erreur « unexpected type »). Java convertit automatiquement entre <code>int</code> et <code>Integer</code>.") +
        K.p("La vraie force d'ArrayList, c'est de contenir des <b>objets</b> : la liste du parc, que l'on parcourt pour rechercher ou compter.") + K.run("s7_listobj"),
        check: { q: "Comment obtenir le nombre d'éléments de l'ArrayList <code>parc</code> ?", o: ["<code>parc.length</code>", "<code>parc.length()</code>", "<code>parc.size()</code>", "<code>parc.count()</code>"], a: 2, e: "length pour un tableau, length() pour un String, size() pour une collection." } },
      { title: "Sauvegarder dans un fichier texte", html:
        K.p("Les objets disparaissent quand le programme s'arrête. Pour retrouver le parc au prochain lancement, on l'écrit dans un fichier texte, une ligne par équipement, les champs séparés par <code>;</code> ; au démarrage, on relit le fichier et on découpe chaque ligne avec <code>split</code>.") +
        K.code(P.s7_fichier.code) +
        K.console("Sauvegarde de 2 équipements.\nRelu : [PC-01 (OK), IMP-01 (EN_PANNE)]") +
        K.ul(["<code>try ( … )</code> (try-with-resources) ferme automatiquement le fichier, même en cas d'erreur.", "Les opérations sur les fichiers peuvent lever une <code>IOException</code> (vérifiée) : on est obligé de la traiter.", "Le fichier <code>parc.txt</code> est créé dans le dossier depuis lequel on lance le programme."]) +
        K.note("À tester avec ton JDK", "Le simulateur de cette page n'a pas accès à un disque : ce programme (vérifié avec un vrai JDK, sortie ci-dessus) est à recopier et exécuter sur ton ordinateur. C'est une fonctionnalité facultative du projet.") }
    ],

    demos: [
      { type: "stepper", title: "Héritage et appel de super", prog: "s7_heritage", intro: "Suis la construction d'un Ordinateur : son constructeur appelle d'abord celui d'Equipement. Puis observe, dans la boucle, quelle version de <code>decrire()</code> s'exécute pour chaque objet.",
        notes: { 50: "On crée un Ordinateur : Java appelle le constructeur d'Ordinateur…", 24: "… dont la première ligne appelle le constructeur de la classe mère Equipement.", 7: "Les attributs hérités sont initialisés par Equipement.", 25: "Puis on revient dans Ordinateur pour l'attribut qui lui est propre.", 54: "Le tableau est de type Equipement[], mais chaque case contient un objet précis.", 56: "Appel polymorphe : la version de decrire() exécutée dépend de la classe réelle de l'objet.", 30: "Version d'Ordinateur, qui réutilise celle de la mère avec <code>super.decrire()</code>." } },
      { type: "stepper", title: "Une exception traitée", prog: "s7_robuste", intro: "Entrées : <code>abc</code>, puis <code>-3</code>, puis <code>12</code>. Observe le saut du <code>try</code> vers le <code>catch</code> quand la conversion échoue.",
        notes: { 11: "<code>Integer.parseInt</code> peut lever une NumberFormatException si la ligne n'est pas un entier.", 13: "Conversion réussie et valeur positive : on renvoie le résultat, ce qui termine la méthode et la boucle.", 15: "Conversion réussie mais valeur négative : message, puis nouveau tour.", 17: "On arrive ici seulement si parseInt a échoué : le reste du try a été sauté." } },
      { type: "lab" }
    ],

    exercises: [
      { type: "predict", title: "Quelle version de la méthode ?", lvl: 2, prog: "s7_poly",
        hint: "<code>fiche()</code> est écrite une seule fois, dans Equipement, mais elle appelle <code>type()</code> et <code>priorite()</code>, qui peuvent être redéfinies.",
        expl: "Pour un Serveur, <code>type()</code> et <code>priorite()</code> sont redéfinies : « Serveur (priorité 1) ». L'Écran ne redéfinit que <code>type()</code> : « Écran (priorité 3) ». L'Equipement utilise les versions de base. Même dans une méthode héritée, Java appelle la version de la classe réelle de l'objet." },
      { type: "predict", title: "Le chemin d'une exception", lvl: 2, prog: "s7_flux",
        hint: "Pour chaque diviseur : A s'affiche toujours ; B seulement si la division réussit ; C seulement en cas d'exception ; D toujours (finally).",
        expl: "d = 2 : A, puis B5, puis D. d = 0 : A, la division lève ArithmeticException, B est sauté, C puis D. d = 5 : A, B2, D. La boucle continue après l'exception car elle a été traitée." },
      { type: "mcq", title: "Héritage, listes, exceptions", lvl: 1, items: [
        { q: "<code>class Serveur extends Equipement</code> signifie :", o: ["Equipement hérite de Serveur", "Serveur hérite des attributs et méthodes d'Equipement", "Serveur et Equipement sont indépendants", "Serveur est une interface"], a: 1, e: "La sous-classe (Serveur) étend la classe mère (Equipement)." },
        { q: "Où doit se trouver l'appel <code>super(…)</code> ?", o: ["N'importe où dans le constructeur", "En première ligne du constructeur", "Dans main", "Dans toString"], a: 1, e: "Sinon : « call to super must be first statement in constructor »." },
        { q: "Quelle déclaration est correcte ?", o: ["<code>ArrayList&lt;int&gt; l = new ArrayList&lt;&gt;();</code>", "<code>ArrayList&lt;Integer&gt; l = new ArrayList&lt;&gt;();</code>", "<code>ArrayList l = new ArrayList[10];</code>", "<code>ArrayList&lt;Integer&gt; l = new ArrayList&lt;Integer&gt;[];</code>"], a: 1, e: "Type objet Integer entre chevrons, diamant <code>&lt;&gt;</code> à droite." },
        { q: "Quelle exception lève <code>Integer.parseInt(\"12a\")</code> ?", o: ["ArithmeticException", "NumberFormatException", "NullPointerException", "Aucune, renvoie 12"], a: 1, e: "Le texte n'est pas un entier valide." },
        { q: "Le bloc <code>finally</code> s'exécute :", o: ["Seulement s'il y a eu une exception", "Seulement s'il n'y en a pas eu", "Dans tous les cas", "Jamais si le catch s'exécute"], a: 2, e: "C'est son rôle : code de fin garanti." }] },
      { type: "fill", title: "Compléter une gestion de liste", lvl: 1,
        statement: "Complète le programme qui gère une liste de références et affiche <code>2 [PC-01, SW-01]</code>.",
        code: "import java.util.[[ArrayList]];\n\npublic class Trous {\n    public static void main(String[] args) {\n        ArrayList<[[String]]> refs = new ArrayList<>();\n        refs.[[add]](\"PC-01\");\n        refs.add(\"IMP-01\");\n        refs.add(\"SW-01\");\n        refs.[[remove]](\"IMP-01\");\n        System.out.println(refs.[[size()]] + \" \" + refs);\n    }\n}",
        expl: "Import de <code>java.util.ArrayList</code> ; éléments de type String ; <code>add</code> pour ajouter, <code>remove</code> pour supprimer par valeur, <code>size()</code> pour le nombre d'éléments. Une ArrayList s'affiche directement entre crochets." },
      { type: "hunt", title: "Erreurs d'héritage et de liste", lvl: 2, code: P.s7_bug.code.replace(/\n$/, "").split("\n"), bad: [14, 19, 22],
        fixes: {
          14: { msg: "ParcEcrans.java:14: error: id has private access in Equipement", fr: "<code>id</code> est private dans la classe mère : la sous-classe n'y a pas accès. Il faut le déclarer <code>protected</code> ou ajouter un getter <code>getId()</code> dans Equipement.", fix: "    public String decrire() { return getId() + \" \" + pouces + \" pouces\"; }   // avec getId() dans Equipement" },
          19: { msg: "ParcEcrans.java:19: error: unexpected type\n  required: reference\n  found:    int", fr: "Une ArrayList ne contient que des objets : on écrit Integer au lieu de int.", fix: "        ArrayList<Integer> tailles = new ArrayList<>();" },
          22: { msg: "ParcEcrans.java:22: error: cannot find symbol\n  symbol:   variable length", fr: "Une ArrayList n'a pas de length : sa taille s'obtient avec <code>size()</code>.", fix: "        System.out.println(ecrans.size());" } },
        order: "Vérifié avec javac : les trois erreurs sont signalées ensemble." },
      { type: "write", title: "Une sous-classe Commutateur", lvl: 2, file: "TestSwitch.java",
        statement: "<p>La classe <code>Equipement</code> est fournie. Écris <code>class Commutateur extends Equipement</code> avec un attribut privé <code>ports</code> (int), un constructeur <code>Commutateur(String id, int ports)</code> qui appelle <code>super(id)</code>, une redéfinition de <code>decrire()</code> qui renvoie <code>Commutateur SW-01 (48 ports)</code>, et une méthode <code>estGrand()</code> vraie à partir de 24 ports.</p>",
        starter: "class Equipement {\n    protected String id;\n\n    public Equipement(String id) {\n        this.id = id;\n    }\n\n    public String decrire() {\n        return \"Equipement \" + id;\n    }\n}\n\n// Écris la classe Commutateur ici\n\n\npublic class TestSwitch {\n    public static void main(String[] args) {\n        Equipement[] parc = {new Equipement(\"SRV-01\"), new Commutateur(\"SW-01\", 48), new Commutateur(\"SW-02\", 8)};\n        for (Equipement e : parc) {\n            System.out.println(e.decrire());\n        }\n        Commutateur c = new Commutateur(\"SW-03\", 24);\n        System.out.println(c.estGrand());\n    }\n}\n",
        tests: [{ label: "test de la sous-classe" }], example: true, solution: "s7_switch", hint: "<p><code>id</code> est <code>protected</code> : tu peux l'utiliser dans Commutateur.</p>" },
      { type: "write", title: "Relevés dans une ArrayList", lvl: 2, file: "Releves.java",
        statement: "<p>Lis des températures entières jusqu'à <code>-1</code> et range-les dans une <code>ArrayList&lt;Integer&gt;</code>. Construis une seconde liste avec celles qui dépassent 70, puis affiche :</p><p><code>4 relevés</code><br><code>Au-dessus de 70 : [85, 72]</code></p>",
        starter: "import java.util.ArrayList;\nimport java.util.Scanner;\n\npublic class Releves {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n\n    }\n}\n",
        tests: [{ input: "62\n85\n58\n72\n-1\n", label: "4 relevés" }, { input: "-1\n", label: "aucun relevé" }, { input: "90\n91\n-1\n", label: "tous chauds" }],
        solution: "s7_temps", hint: "<p>Une ArrayList s'affiche directement avec println : <code>[85, 72]</code>, ou <code>[]</code> si elle est vide.</p>" },
      { type: "write", title: "Additionner sans planter", lvl: 3, file: "SommeSure.java",
        statement: "<p>La première ligne contient un nombre n ; les n lignes suivantes devraient contenir des entiers, mais certaines sont mal saisies. Additionne les lignes valides et compte les autres grâce à try/catch :</p><p><code>Somme : 17</code><br><code>Lignes rejetées : 2</code></p>",
        starter: "import java.util.Scanner;\n\npublic class SommeSure {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n\n    }\n}\n",
        tests: [{ input: "4\n5\ncinq\n12\n3,5\n", label: "deux lignes invalides" }, { input: "2\n 7 \n-2\n", label: "espaces et négatif" }, { input: "1\nabc\n", label: "tout rejeté" }],
        solution: "s7_somme", hint: "<p>Lis chaque ligne avec <code>nextLine()</code> ; dans un <code>try</code>, <code>somme += Integer.parseInt(ligne.trim());</code> ; dans le <code>catch (NumberFormatException e)</code>, augmente le compteur de rejets.</p>" }
    ],

    tp: {
      title: "TP 7 — Liste d'équipements et gestion d'erreurs", duration: "2 h", deliverable: "liste manipulable",
      intro: "Le parc n'a plus de taille fixe : tu le ranges dans une ArrayList d'objets, avec ajout, affichage et recherche, et ton menu ne plante plus quand l'utilisateur tape n'importe quoi. Si le temps le permet, tu sauvegardes la liste dans un fichier.",
      steps: [
        "TD : propose un modèle Équipement / Ordinateur / Imprimante (attributs communs, attributs propres) et discute qui fait quoi.",
        "Partie A : manipule une ArrayList avec des commandes AJOUT / SUPPR / LISTE.",
        "Partie B : écris <code>lireChoix</code> qui redemande tant que la saisie n'est pas un numéro de menu valide.",
        "Assemble le programme complet (partie C) : liste d'objets Equipement + menu robuste.",
        "Teste avec des saisies invalides (lettres, nombres hors menu, identifiant absent).",
        "Facultatif : ajoute la sauvegarde et le rechargement dans <code>parc.txt</code> avec ton JDK."
      ],
      parts: [
        { title: "Commandes sur une ArrayList", html: K.p("Lis des mots jusqu'à <code>FIN</code>. <code>AJOUT X</code> ajoute X à la liste ; <code>SUPPR X</code> le retire, ou affiche <code>Absent : X</code> s'il n'y est pas (astuce : <code>remove(objet)</code> renvoie false dans ce cas) ; <code>LISTE</code> affiche <code>2 : [PC-01, SW-01]</code>."),
          write: { file: "ListeParc.java", statement: "", starter: "import java.util.ArrayList;\nimport java.util.Scanner;\n\npublic class ListeParc {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        ArrayList<String> parc = new ArrayList<>();\n\n    }\n}\n",
            tests: [{ input: "AJOUT PC-01\nAJOUT IMP-01\nAJOUT SW-01\nLISTE\nSUPPR IMP-01\nSUPPR PC-09\nLISTE\nFIN\n", label: "ajouts et suppressions" }, { input: "LISTE\nFIN\n", label: "liste vide" }], solution: "s7_tpa" } },
        { title: "Un choix de menu qui ne plante pas", html: K.p("Écris <code>static int lireChoix(int max)</code> : lis une ligne ; si ce n'est pas un entier, affiche <code>Pas un nombre</code> ; si c'est un entier hors de 0..max, affiche <code>Hors menu</code> ; recommence jusqu'à obtenir un choix valide, puis renvoie-le. main affiche <code>Choix retenu : 2</code>."),
          write: { file: "ChoixMenu.java", statement: "", starter: "import java.util.Scanner;\n\npublic class ChoixMenu {\n    static Scanner sc = new Scanner(System.in);\n\n\n    public static void main(String[] args) {\n        int c = lireChoix(3);\n        System.out.println(\"Choix retenu : \" + c);\n    }\n}\n",
            tests: [{ input: "deux\n7\n2\n", label: "texte, hors menu, puis valide" }, { input: "0\n", label: "valide tout de suite" }, { input: " 3 \n", label: "avec espaces" }], solution: "s7_tpb" } },
        { title: "Le programme complet", html: K.p("Liste d'objets <code>Equipement</code>, menu avec <code>switch</code> en forme flèche, choix sécurisé par try/catch. Lance-le avec l'entrée fournie (elle contient une saisie invalide <code>x</code>), puis ajoute la méthode <code>supprimer()</code> et le comptage par marque.") + K.run("s7_tp") },
        { title: "Facultatif : sauvegarde dans un fichier", bonus: true, html: K.p("Avec ton JDK, ajoute deux méthodes : <code>sauvegarder()</code> écrit chaque équipement sur une ligne <code>id;marque</code> dans <code>parc.txt</code> ; <code>charger()</code>, appelée au début de main, relit le fichier s'il existe. Inspire-toi de l'exemple de la leçon (partie 7).") }
      ]
    },

    quiz: [
      { q: "Quel mot-clé indique qu'une classe hérite d'une autre ?", o: ["implements", "extends", "super", "inherits"], a: 1, e: "<code>class Fille extends Mere</code>." },
      { q: "Un attribut <code>private</code> de la classe mère est-il accessible directement dans la classe fille ?", o: ["Oui", "Non : il faut protected ou un getter", "Seulement dans le constructeur", "Seulement avec this"], a: 1, e: "private = seulement dans la classe qui le déclare." },
      { q: "Redéfinir une méthode, c'est :", o: ["La supprimer", "Écrire dans la sous-classe une méthode de même signature qui remplace celle de la mère", "L'appeler deux fois", "Changer son nom"], a: 1, e: "On le signale avec @Override." },
      { q: "<code>Equipement e = new Ordinateur(…); e.decrire();</code> exécute :", o: ["La version d'Equipement", "La version d'Ordinateur", "Les deux", "Une erreur"], a: 1, e: "Polymorphisme : la version de la classe réelle de l'objet." },
      { q: "Que contient <code>ArrayList&lt;String&gt; l</code> après <code>l.add(\"A\"); l.add(\"B\"); l.add(0, \"C\");</code> ?", o: ["[A, B, C]", "[C, A, B]", "[A, C, B]", "[C, B, A]"], a: 1, e: "<code>add(0, x)</code> insère au début." },
      { q: "Quelle méthode retire l'élément d'indice 2 d'une ArrayList <code>l</code> ?", o: ["<code>l.delete(2)</code>", "<code>l.remove(2)</code>", "<code>l[2] = null</code>", "<code>l.pop(2)</code>"], a: 1, e: "<code>remove(int index)</code>." },
      { q: "Une exception non traitée :", o: ["Est ignorée", "Arrête le programme avec un message et la pile d'appels", "Provoque une erreur de compilation", "Redémarre le programme"], a: 1, e: "La JVM affiche « Exception in thread \"main\" … »." },
      { q: "Après un catch qui a traité l'exception, le programme :", o: ["S'arrête", "Continue après le bloc try/catch", "Recommence le try", "Retourne au début de main"], a: 1, e: "C'est tout l'intérêt de traiter l'exception." },
      { q: "Quelle exception attraper autour de <code>Integer.parseInt(texte)</code> ?", o: ["IOException", "NumberFormatException", "ArithmeticException", "IndexOutOfBoundsException"], a: 1, e: "Elle signale un texte qui n'est pas un nombre." },
      { q: "Que fait <code>throw new IllegalArgumentException(\"RAM négative\");</code> ?", o: ["Affiche le message et continue", "Lance une exception que l'appelant doit traiter, sinon le programme s'arrête", "Crée un fichier de log", "Ne compile pas"], a: 1, e: "throw lance l'exception." },
      { q: "Le message <code>unreported exception X; must be caught or declared to be thrown</code> concerne :", o: ["Une exception vérifiée (checked) non traitée", "Une NullPointerException", "Une erreur de syntaxe", "Une ArrayList vide"], a: 0, e: "Il faut un try/catch ou un <code>throws X</code> dans l'en-tête." },
      { q: "Pour écrire dans un fichier texte, on utilise par exemple :", o: ["System.out.println", "PrintWriter avec FileWriter", "Scanner(System.in)", "ArrayList"], a: 1, e: "Et BufferedReader avec FileReader pour relire." }
    ],

    video: { src: "media/seance7.mp4", title: "héritage, exceptions et ArrayList", dur: 94, chapters: [[0, "Titre"], [5, "L'héritage"], [18, "super et redéfinition"], [30, "Polymorphisme"], [41, "try / catch"], [53, "Saisie robuste"], [65, "ArrayList"], [75, "Une liste d'objets"], [86, "À retenir"]] },
    youtube: [
      { t: "L'héritage en Java", src: "Recherche YouTube", d: "extends, super, redéfinition, polymorphisme simple.", q: "java héritage extends super redéfinition français" },
      { t: "Les exceptions : try, catch, finally", src: "Recherche YouTube", d: "Traiter les erreurs à l'exécution.", q: "java exceptions try catch finally débutant français" },
      { t: "ArrayList en Java", src: "Recherche YouTube", d: "add, get, remove, size et parcours.", q: "java ArrayList tutoriel débutant français" }
    ],
    docs: [
      { t: "Inheritance (Java Tutorials)", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html", d: "Sous-classes, super et redéfinition." },
      { t: "Exceptions (Java Tutorials)", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html", d: "Lever, attraper et déclarer des exceptions." },
      { t: "Classe ArrayList (Javadoc Java 21)", src: "docs.oracle.com", u: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayList.html", d: "Toutes les méthodes d'ArrayList." }
    ],
    memo: {
      cards: [
        ["Relation", "Attribut de type classe : <code>private Technicien technicien;</code> · plusieurs objets peuvent référencer le même."],
        ["Héritage", "<code>class Ordinateur extends Equipement</code> · <code>super(…)</code> en 1re ligne du constructeur · <code>protected</code> visible par les sous-classes · <code>@Override</code> + <code>super.methode()</code>."],
        ["Polymorphisme", "<code>Equipement e = new Ordinateur(…);</code> · <code>e.decrire()</code> exécute la version de la classe réelle."],
        ["Exceptions", "<code>try { … } catch (Type e) { … } finally { … }</code> · <code>e.getMessage()</code> · <code>throw new IllegalArgumentException(\"…\");</code> · checked → <code>throws</code>."],
        ["ArrayList", "<code>import java.util.ArrayList;</code> · <code>ArrayList&lt;Equipement&gt; l = new ArrayList&lt;&gt;();</code> · add, get, set, remove, size, contains, indexOf, isEmpty · <code>Integer</code> pas <code>int</code>."],
        ["Fichier texte", "Écrire : <code>PrintWriter</code> + <code>FileWriter</code> · lire : <code>BufferedReader</code> + <code>FileReader</code>, <code>readLine()</code> jusqu'à null · <code>IOException</code> · try-with-resources."]
      ],
      code: P.s7_robuste.code, codeTitle: "Modèle : une saisie qui ne plante pas",
      errors: [["<code>call to super must be first statement</code>", "super(…) placé après d'autres lignes", "Le mettre en premier"], ["<code>x has private access in Mere</code>", "Attribut private utilisé dans la fille", "protected ou getter"], ["<code>unexpected type … found: int</code>", "<code>ArrayList&lt;int&gt;</code>", "<code>ArrayList&lt;Integer&gt;</code>"], ["<code>IndexOutOfBoundsException</code>", "<code>get(i)</code> avec i ≥ size()", "Vérifier size()"], ["<code>unreported exception</code>", "Exception vérifiée non traitée", "try/catch ou throws"], ["<code>NumberFormatException</code>", "parseInt sur un texte non numérique", "try/catch"]],
      glossary: [["Association", "Relation où une classe a un attribut d'une autre classe."], ["Héritage", "Mécanisme par lequel une classe reprend attributs et méthodes d'une autre."], ["Classe mère / fille", "Superclasse / sous-classe."], ["Redéfinition", "Réécriture d'une méthode héritée (@Override)."], ["Polymorphisme", "Un même appel exécute la version de la classe réelle de l'objet."], ["Exception", "Événement anormal qui interrompt l'exécution."], ["Exception vérifiée", "Exception que le compilateur oblige à traiter ou déclarer."], ["Collection", "Objet qui regroupe d'autres objets (ArrayList…)."], ["Persistance", "Conservation des données après l'arrêt du programme (fichier)."]],
      selfcheck: ["Je sais relier deux classes par un attribut.", "Je sais écrire une sous-classe avec extends, super et une méthode redéfinie.", "Je sais lire le message d'une exception et la traiter avec try/catch.", "Je sais redemander une saisie invalide sans planter.", "Je sais ajouter, parcourir, rechercher et supprimer dans une ArrayList d'objets.", "J'ai réalisé le TP 7 (liste d'équipements et gestion d'erreurs)."],
      next: "Séance 8 : le projet de synthèse. Tu assembles tout pour construire l'application console de gestion du parc informatique et des interventions."
    }
  };
})();
