(function () {
  var P = COURSE.progs;
  COURSE.seances.push({ id: "s6", tag: "S-06", short: "Classes & objets" });

  P.s6_sans = { file: "SansObjets.java", lab: "Sans objets : tableaux parallèles", code:
`public class SansObjets {
    public static void main(String[] args) {
        String[] ids = {"PC-01", "PC-02", "PC-03"};
        String[] marques = {"Dell", "HP", "Lenovo"};
        int[] ram = {8, 16, 8};
        boolean[] enPanne = {false, true, false};

        for (int i = 0; i < ids.length; i++) {
            System.out.println(ids[i] + " " + marques[i] + " " + ram[i] + " Go" + (enPanne[i] ? " EN PANNE" : ""));
        }
        // Supprimer PC-02 ? Il faut toucher aux 4 tableaux sans se tromper d'indice...
    }
}
` };
  P.s6_premier = { file: "PremiersObjets.java", lab: "Une première classe", code:
`class Ordinateur {
    String id;
    String marque;
    int ram;
}

public class PremiersObjets {
    public static void main(String[] args) {
        Ordinateur pc1 = new Ordinateur();
        pc1.id = "PC-01";
        pc1.marque = "Dell";
        pc1.ram = 8;

        Ordinateur pc2 = new Ordinateur();
        pc2.id = "PC-02";
        pc2.marque = "HP";

        System.out.println(pc1.id + " " + pc1.marque + " " + pc1.ram + " Go");
        System.out.println(pc2.id + " " + pc2.marque + " " + pc2.ram + " Go");
    }
}
` };
  P.s6_constructeur = { file: "AvecConstructeur.java", lab: "Constructeur et this", code:
`class Ordinateur {
    String id;
    String marque;
    int ram;
    boolean enPanne;

    Ordinateur(String id, String marque, int ram) {
        this.id = id;
        this.marque = marque;
        this.ram = ram;
        this.enPanne = false;
    }

    void tomberEnPanne() {
        enPanne = true;
    }

    void reparer() {
        enPanne = false;
    }

    String decrire() {
        return id + " (" + marque + ", " + ram + " Go)" + (enPanne ? " EN PANNE" : "");
    }
}

public class AvecConstructeur {
    public static void main(String[] args) {
        Ordinateur pc1 = new Ordinateur("PC-01", "Dell", 8);
        Ordinateur pc2 = new Ordinateur("PC-02", "HP", 16);
        pc2.tomberEnPanne();
        System.out.println(pc1.decrire());
        System.out.println(pc2.decrire());
        pc2.reparer();
        System.out.println(pc2.decrire());
    }
}
` };
  P.s6_ref = { file: "References.java", lab: "Références et null", code:
`class Ordinateur {
    String id;
    int ram;

    Ordinateur(String id, int ram) {
        this.id = id;
        this.ram = ram;
    }
}

public class References {
    public static void main(String[] args) {
        Ordinateur a = new Ordinateur("PC-01", 8);
        Ordinateur b = a;
        b.ram = 32;
        System.out.println(a.ram);

        Ordinateur c = new Ordinateur("PC-01", 32);
        System.out.println(a == b);
        System.out.println(a == c);

        Ordinateur d = null;
        System.out.println(d == null);
        System.out.println(d.id);
    }
}
` };
  P.s6_encap = { file: "Encapsulation.java", lab: "Encapsulation : private, getters, setters", code:
`class Ordinateur {
    private String id;
    private int ram;
    private String etat;

    public Ordinateur(String id, int ram) {
        this.id = id;
        setRam(ram);
        this.etat = "EN_SERVICE";
    }

    public String getId() {
        return id;
    }

    public int getRam() {
        return ram;
    }

    public void setRam(int ram) {
        if (ram > 0 && ram <= 256) {
            this.ram = ram;
        } else {
            System.out.println("RAM refusée : " + ram);
        }
    }

    public String getEtat() {
        return etat;
    }

    public void setEtat(String etat) {
        if (etat.equals("EN_SERVICE") || etat.equals("EN_PANNE") || etat.equals("REFORME")) {
            this.etat = etat;
        } else {
            System.out.println("État inconnu : " + etat);
        }
    }
}

public class Encapsulation {
    public static void main(String[] args) {
        Ordinateur pc = new Ordinateur("PC-07", 8);
        pc.setRam(-4);
        pc.setRam(16);
        pc.setEtat("CASSE");
        pc.setEtat("EN_PANNE");
        System.out.println(pc.getId() + " : " + pc.getRam() + " Go, " + pc.getEtat());
    }
}
` };
  P.s6_private = { file: "AccesInterdit.java", lab: "Erreur : accès à un attribut private", code:
`class Ordinateur {
    private int ram;

    public int getRam() {
        return ram;
    }
}

public class AccesInterdit {
    public static void main(String[] args) {
        Ordinateur pc = new Ordinateur();
        pc.ram = -8;
        System.out.println(pc.getRam());
    }
}
` };
  P.s6_tostring = { file: "Affichage.java", lab: "toString et compteur static", code:
`class Ordinateur {
    private static int nombreCrees = 0;
    private String id;
    private String marque;

    public Ordinateur(String id, String marque) {
        this.id = id;
        this.marque = marque;
        nombreCrees++;
    }

    public static int getNombreCrees() {
        return nombreCrees;
    }

    @Override
    public String toString() {
        return id + " [" + marque + "]";
    }
}

public class Affichage {
    public static void main(String[] args) {
        Ordinateur a = new Ordinateur("PC-01", "Dell");
        Ordinateur b = new Ordinateur("PC-02", "HP");
        System.out.println(a);
        System.out.println("Poste : " + b);
        System.out.println(Ordinateur.getNombreCrees() + " ordinateurs créés");
    }
}
` };
  P.s6_trace = { file: "Aliasing.java", code:
`class Compteur {
    int valeur;

    void incrementer() {
        valeur++;
    }
}

public class Aliasing {
    public static void main(String[] args) {
        Compteur c1 = new Compteur();
        Compteur c2 = new Compteur();
        Compteur c3 = c1;
        c1.incrementer();
        c3.incrementer();
        c2.incrementer();
        c3 = c2;
        c3.incrementer();
        System.out.println(c1.valeur + " " + c2.valeur + " " + c3.valeur);
    }
}
` };
  P.s6_bug = { file: "Parc.java", code:
`class Imprimante {
    private String id;
    private boolean couleur;

    public Imprimante(String id, boolean couleur) {
        this.id = id;
        this.couleur = couleur;
    }

    public String getId() {
        return id;
    }
}

public class Parc {
    public static void main(String[] args) {
        Imprimante i1 = new Imprimante("IMP-01");
        Imprimante i2 = new Imprimante("IMP-02", true);
        System.out.println(i2.couleur);
        System.out.println(i2.getid());
    }
}
` };
  P.s6_imprimante = { file: "TestImprimante.java", code:
`class Imprimante {
    private String id;
    private int pagesRestantes;

    public Imprimante(String id, int pages) {
        this.id = id;
        this.pagesRestantes = pages;
    }

    public void imprimer(int nb) {
        if (nb <= pagesRestantes) {
            pagesRestantes -= nb;
            System.out.println(id + " : " + nb + " page(s) imprimée(s)");
        } else {
            System.out.println(id + " : papier insuffisant");
        }
    }

    public int getPagesRestantes() {
        return pagesRestantes;
    }
}

public class TestImprimante {
    public static void main(String[] args) {
        Imprimante imp = new Imprimante("IMP-01", 50);
        imp.imprimer(20);
        imp.imprimer(40);
        imp.imprimer(30);
        System.out.println("Reste : " + imp.getPagesRestantes());
    }
}
` };
  P.s6_ticket = { file: "TestTicket.java", code:
`import java.util.Scanner;

class Ticket {
    private int numero;
    private String priorite;

    public Ticket(int numero) {
        this.numero = numero;
        this.priorite = "NORMALE";
    }

    public String getPriorite() {
        return priorite;
    }

    public void setPriorite(String p) {
        if (p.equals("BASSE") || p.equals("NORMALE") || p.equals("HAUTE")) {
            priorite = p;
        }
    }

    public String toString() {
        return "Ticket " + numero + " - " + priorite;
    }
}

public class TestTicket {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Ticket t = new Ticket(sc.nextInt());
        String p = sc.next();
        t.setPriorite(p);
        System.out.println(t);
    }
}
` };
  P.s6_tpord = { file: "TestOrdinateur.java", code:
`class Ordinateur {
    private String id;
    private String marque;
    private int ram;
    private boolean enPanne;

    public Ordinateur(String id, String marque, int ram) {
        this.id = id;
        this.marque = marque;
        this.ram = 4;
        setRam(ram);
        this.enPanne = false;
    }

    public String getId() { return id; }
    public String getMarque() { return marque; }
    public int getRam() { return ram; }
    public boolean isEnPanne() { return enPanne; }

    public void setRam(int ram) {
        if (ram > 0) {
            this.ram = ram;
        }
    }

    public void signalerPanne() { enPanne = true; }
    public void reparer() { enPanne = false; }

    public String toString() {
        return id + " " + marque + " " + ram + " Go " + (enPanne ? "EN PANNE" : "OK");
    }
}

public class TestOrdinateur {
    public static void main(String[] args) {
        Ordinateur a = new Ordinateur("PC-01", "Dell", 8);
        Ordinateur b = new Ordinateur("PC-02", "HP", -2);
        b.signalerPanne();
        a.setRam(16);
        a.setRam(0);
        System.out.println(a);
        System.out.println(b);
        b.reparer();
        System.out.println(b.getId() + " en panne ? " + b.isEnPanne());
    }
}
` };
  P.s6_tpint = { file: "TestIntervention.java", code:
`class Intervention {
    private String description;
    private String date;
    private String statut;
    private double prixPieces;
    private int heures;

    public Intervention(String description, String date, double prixPieces, int heures) {
        this.description = description;
        this.date = date;
        this.prixPieces = prixPieces;
        this.heures = heures;
        this.statut = "OUVERTE";
    }

    public String getStatut() { return statut; }

    public void changerStatut(String nouveau) {
        if (nouveau.equals("OUVERTE") || nouveau.equals("EN_COURS") || nouveau.equals("TERMINEE")) {
            statut = nouveau;
        } else {
            System.out.println("Statut refuse : " + nouveau);
        }
    }

    public double cout() {
        return prixPieces + heures * 7500;
    }

    public String toString() {
        return date + " | " + description + " | " + statut + " | " + cout() + " FCFA";
    }
}

public class TestIntervention {
    public static void main(String[] args) {
        Intervention i = new Intervention("Remplacement disque", "12/03/2026", 35000, 2);
        System.out.println(i);
        i.changerStatut("EN_COURS");
        i.changerStatut("ANNULEE");
        i.changerStatut("TERMINEE");
        System.out.println(i);
    }
}
` };
  P.s6_tp = { file: "GestionParc.java", lab: "TP 6 : Ordinateur et Intervention", code:
`class Ordinateur {
    private String id;
    private String marque;
    private boolean enPanne;

    public Ordinateur(String id, String marque) {
        this.id = id;
        this.marque = marque;
    }

    public String getId() { return id; }
    public boolean isEnPanne() { return enPanne; }
    public void signalerPanne() { enPanne = true; }
    public void reparer() { enPanne = false; }

    public String toString() {
        return id + " (" + marque + ")" + (enPanne ? " EN PANNE" : "");
    }
}

class Intervention {
    private Ordinateur poste;
    private String description;
    private String statut;
    private int heures;

    public Intervention(Ordinateur poste, String description, int heures) {
        this.poste = poste;
        this.description = description;
        this.heures = heures;
        this.statut = "OUVERTE";
        poste.signalerPanne();
    }

    public void terminer() {
        statut = "TERMINEE";
        poste.reparer();
    }

    public double cout() {
        return heures * 7500.0;
    }

    public String toString() {
        return "[" + statut + "] " + poste.getId() + " : " + description + " (" + cout() + " FCFA)";
    }
}

public class GestionParc {
    public static void main(String[] args) {
        Ordinateur pc1 = new Ordinateur("PC-01", "Dell");
        Ordinateur pc2 = new Ordinateur("PC-02", "HP");

        Intervention i1 = new Intervention(pc2, "Écran noir au démarrage", 2);
        System.out.println(pc1);
        System.out.println(pc2);
        System.out.println(i1);

        i1.terminer();
        System.out.println(i1);
        System.out.println(pc2);
    }
}
` };

  COURSE.data.s6 = {
    hours: "4 h", split: "CM 1 h · TD 1 h · TP 2 h", comp: "C5",
    h1: "Premiers pas <em>en programmation objet</em>",
    lede: "Un ordinateur du parc, c'est un identifiant, une marque, une mémoire, un état… et des actions : tomber en panne, être réparé. Tu vas regrouper ces données et ces actions dans des classes, puis créer autant d'objets que de matériels.",
    prereq: "méthodes, paramètres et return (séance 5), String et tableaux (séance 4).",
    objectives: [
      "Expliquer pourquoi modéliser des entités sous forme d'objets",
      "Écrire une classe avec attributs, constructeur et méthodes",
      "Créer des objets avec new et utiliser this",
      "Comprendre qu'une variable objet contient une référence",
      "Protéger les attributs : private, getters et setters avec contrôle des valeurs",
      "Redéfinir toString pour afficher un objet"
    ],
    lesson: [
      { title: "Pourquoi des objets ?", html:
        K.p("Avec ce que tu sais déjà, décrire trois ordinateurs demande un tableau par caractéristique, et il faut garder les indices alignés :") + K.run("s6_sans") +
        K.p("Les informations d'un même ordinateur sont éparpillées. Ajouter une caractéristique impose un nouveau tableau ; supprimer un poste, de modifier tous les tableaux sans se tromper. La <b>programmation orientée objet</b> (POO) regroupe tout ce qui concerne une entité du monde réel dans un seul <b>objet</b> : ses données et ce qu'on peut faire avec.") +
        K.tiles([["Une entité réelle", "Un ordinateur, une imprimante, une intervention, un technicien."], ["Ses données", "Identifiant, marque, mémoire, état : les <b>attributs</b>."], ["Ses comportements", "Tomber en panne, être réparé, se décrire : les <b>méthodes</b>."]]) },
      { title: "Classe et objet", html:
        K.p("Une <b>classe</b> est un plan, un modèle : elle décrit quels attributs et quelles méthodes auront ses objets. Un <b>objet</b> (ou <b>instance</b>) est un exemplaire concret fabriqué à partir de ce plan, avec ses propres valeurs.") +
        '<div class="umlrow">' + K.uml("Ordinateur", ["- id : String", "- marque : String", "- ram : int", "- enPanne : boolean"], ["+ Ordinateur(id, marque, ram)", "+ tomberEnPanne() : void", "+ reparer() : void", "+ decrire() : String"]) +
        '<span class="inherit-arrow">→ new →</span>' + K.mem([["pc1", "Ordinateur", "id=\"PC-01\", Dell, 8"], ["pc2", "Ordinateur", "id=\"PC-02\", HP, 16"]], "Deux objets créés à partir de la classe") + "</div>" +
        K.p("Le diagramme ci-dessus est un <b>diagramme de classe UML</b> simplifié : le nom, les attributs, les méthodes ; <code>-</code> signifie privé, <code>+</code> public.",
          "Voici une première classe, sans constructeur ni protection. On crée chaque objet avec <code>new</code>, puis on remplit ses attributs avec un point :") +
        K.run("s6_premier") +
        K.note("Plusieurs classes dans un fichier", "Pour pouvoir tout exécuter ici, on écrit les classes dans le même fichier : une seule est <code>public</code> (celle qui porte le nom du fichier et contient main). Dans un vrai projet, chaque classe a son propre fichier : <code>Ordinateur.java</code>, <code>Intervention.java</code>…") +
        K.p("Remarque : <code>pc2.ram</code> vaut 0 sans qu'on l'ait rempli. Les attributs reçoivent une valeur par défaut (0, false, null), contrairement aux variables locales."),
        check: { q: "Combien d'objets Ordinateur existent après <code>Ordinateur a = new Ordinateur(); Ordinateur b = new Ordinateur(); Ordinateur c = a;</code> ?", o: ["1", "2", "3", "0"], a: 1, e: "Seul <code>new</code> crée un objet. <code>c = a</code> crée une deuxième étiquette vers le même objet." } },
      { title: "Constructeur, méthodes et this", html:
        K.p("Remplir les attributs un par un après chaque <code>new</code> est long et risqué (on peut en oublier). Le <b>constructeur</b> est une méthode spéciale, appelée par <code>new</code>, qui initialise l'objet : il porte <b>exactement le nom de la classe</b> et n'a <b>pas de type de retour</b>.") +
        K.run("s6_constructeur") +
        K.p("Dans le constructeur, <code>this.id = id;</code> signifie « l'attribut <code>id</code> de cet objet reçoit le paramètre <code>id</code> ». <code>this</code> désigne l'objet en cours de construction (ou celui sur lequel une méthode est appelée) ; il lève l'ambiguïté quand un paramètre porte le même nom qu'un attribut.",
          "Les méthodes de la classe ne sont plus <code>static</code> : elles agissent sur <b>un objet précis</b>. <code>pc2.tomberEnPanne()</code> modifie l'attribut <code>enPanne</code> de pc2, pas celui de pc1.") +
        K.warn("Dès qu'on écrit un constructeur…", "… Java ne fournit plus le constructeur vide par défaut. <code>new Ordinateur()</code> provoque alors l'erreur <code>constructor Ordinateur in class Ordinateur cannot be applied to given types</code>. On peut écrire plusieurs constructeurs (surcharge) si besoin."),
        check: { q: "Que manque-t-il à cet en-tête de constructeur : <code>public void Ordinateur(String id)</code> ?", o: ["Rien, il est correct", "Il ne doit pas avoir de type de retour : supprimer void", "Il manque static", "Il faut un return"], a: 1, e: "Avec <code>void</code>, Java le considère comme une méthode ordinaire nommée Ordinateur, pas comme un constructeur." } },
      { title: "Une variable objet contient une référence", html:
        K.p("Une variable de type <code>Ordinateur</code> ne contient pas l'objet lui-même, mais sa <b>référence</b> (son adresse en mémoire). Conséquences :") +
        K.ul(["<code>b = a;</code> copie la référence : a et b désignent <b>le même objet</b>. Modifier par b, c'est modifier ce que voit a.", "<code>a == c</code> compare les références : deux objets distincts aux valeurs identiques ne sont pas <code>==</code> (comme pour les String).", "<code>null</code> signifie « aucun objet ». Appeler une méthode ou lire un attribut sur null provoque une <code>NullPointerException</code>."]) +
        K.run("s6_ref"),
        check: { q: "Après <code>b = a; b.ram = 32;</code>, que vaut <code>a.ram</code> ?", o: ["La valeur d'avant", "32", "0", "Erreur"], a: 1, e: "a et b désignent le même objet." } },
      { title: "Encapsulation : protéger les attributs", html:
        K.p("Avec des attributs accessibles de partout, n'importe quel code peut écrire <code>pc.ram = -8;</code> et mettre l'objet dans un état absurde. L'<b>encapsulation</b> consiste à :") +
        K.ol(["déclarer les attributs <code>private</code> : seules les méthodes de la classe y accèdent ;", "fournir des <b>getters</b> publics pour lire (<code>getRam()</code>, <code>isEnPanne()</code> pour un boolean) ;", "fournir des <b>setters</b> publics pour modifier, <b>en contrôlant</b> la valeur (<code>setRam</code> refuse une valeur négative) ; ne pas fournir de setter pour ce qui ne doit pas changer (l'identifiant)."]) +
        K.run("s6_encap") +
        K.p("Accéder directement à un attribut private depuis une autre classe est refusé dès la compilation :") + K.run("s6_private") +
        K.note("Conventions", "Attributs <code>private</code>, constructeurs et méthodes utiles <code>public</code>. Getter : <code>getXxx()</code> (ou <code>isXxx()</code> pour un boolean). Setter : <code>setXxx(valeur)</code>. Les IDE savent les générer automatiquement."),
        check: { q: "Pourquoi ne pas fournir de setter <code>setId</code> pour un ordinateur ?", o: ["Parce que c'est interdit en Java", "Parce que l'identifiant ne doit pas changer après la création", "Parce que les String n'ont pas de setter", "Pour aller plus vite"], a: 1, e: "On ne fournit des setters que pour ce qui peut légitimement changer." } },
      { title: "Afficher un objet : toString", html:
        K.p("Par défaut, <code>System.out.println(pc)</code> affiche quelque chose comme <code>Ordinateur@1b6d3586</code> (le nom de la classe et un code). En écrivant une méthode <code>public String toString()</code>, on choisit le texte qui représente l'objet ; Java l'utilise automatiquement dans <code>println</code> et dans les concaténations.") +
        K.run("s6_tostring") +
        K.p("L'annotation <code>@Override</code> (facultative) indique qu'on redéfinit une méthode existante ; le compilateur vérifie alors qu'on ne s'est pas trompé de nom. Tu comprendras d'où vient cette méthode en séance 7 (héritage).") },
      { title: "static : ce qui appartient à la classe", html:
        K.p("Un attribut normal existe <b>dans chaque objet</b> : chaque ordinateur a sa propre marque. Un attribut <code>static</code> existe <b>une seule fois</b>, partagé par toute la classe : c'est le cas du compteur <code>nombreCrees</code> ci-dessus, qui compte tous les ordinateurs créés.") +
        K.table(["", "Attribut / méthode d'instance", "Attribut / méthode static"], [["Existe", "dans chaque objet", "une fois pour la classe"], ["S'utilise", "<code>pc.getRam()</code>", "<code>Ordinateur.getNombreCrees()</code>"], ["Exemple", "id, marque, ram", "compteur d'objets, constante TVA, main"]]) +
        K.p("Voilà pourquoi <code>main</code> est static : la JVM l'appelle avant qu'aucun objet n'existe. Et pourquoi, dans une méthode static, on ne peut pas utiliser directement un attribut d'instance : il faudrait savoir de quel objet il s'agit.") },
      { title: "Méthode de conception", html:
        K.p("Pour passer d'un besoin à une classe :") +
        K.ol(["Repérer les <b>noms</b> importants du besoin : ce sont des candidats classes (Ordinateur, Intervention) ou attributs (marque, date).", "Pour chaque classe, lister les <b>attributs</b> avec leur type, et dire lesquels peuvent changer.", "Lister les <b>comportements</b> (verbes) : signaler une panne, réparer, calculer un coût, changer de statut.", "Écrire le <b>constructeur</b> : quelles informations sont indispensables à la création ?", "Ajouter getters, setters <b>contrôlés</b> et <code>toString</code>, puis tester avec un main."]) +
        '<div class="umlrow">' + K.uml("Ordinateur", ["- id : String", "- marque : String", "- ram : int", "- enPanne : boolean"], ["+ getId(), getRam()…", "+ setRam(int)", "+ signalerPanne()", "+ reparer()", "+ toString()"]) + K.uml("Intervention", ["- description : String", "- date : String", "- statut : String", "- prixPieces : double", "- heures : int"], ["+ changerStatut(String)", "+ cout() : double", "+ toString()"]) + "</div>" +
        K.p("Ce sont les deux classes du TP 6. La séance 7 les reliera : une intervention concernera un ordinateur précis.") }
    ],

    demos: [
      { type: "stepper", title: "Construire des objets", prog: "s6_constructeur", intro: "Suis la création des objets : <code>new</code> appelle le constructeur, où <code>this</code> désigne l'objet en cours de construction (visible dans le tableau des variables).",
        notes: { 29: "<code>new Ordinateur(\"PC-01\", \"Dell\", 8)</code> : Java crée un objet vide, puis appelle le constructeur avec ces arguments.", 8: "<code>this.id</code> est l'attribut de l'objet ; <code>id</code> seul est le paramètre.", 31: "On appelle la méthode sur pc2 : à l'intérieur, <code>this</code> sera pc2.", 15: "Seul l'attribut enPanne de cet objet change.", 32: "<code>decrire()</code> renvoie un texte construit à partir des attributs de pc1." } },
      { type: "stepper", title: "Deux étiquettes, un objet", prog: "s6_trace", intro: "Observe les valeurs de c1, c2 et c3 : quand c3 = c1, les deux affichent les mêmes données, car ils désignent le même objet.",
        notes: { 13: "<code>c3 = c1</code> : aucun nouvel objet ; c3 désigne le même compteur que c1.", 15: "Incrémenter via c3, c'est incrémenter le compteur de c1.", 17: "c3 désigne maintenant l'objet de c2." } },
      { type: "lab" }
    ],

    exercises: [
      { type: "predict", title: "Références partagées", lvl: 2, prog: "s6_trace",
        hint: "Il n'y a que deux objets (deux <code>new</code>). Note pour chaque ligne quel objet c3 désigne.",
        expl: "c1 et c3 désignent le même objet : il est incrémenté deux fois (valeur 2). c2 est incrémenté une fois, puis c3 = c2 et c3 l'incrémente encore : 2. c3 désigne alors l'objet de c2 : 2. Résultat : <b>2 2 2</b>." },
      { type: "match", title: "Le vocabulaire de l'objet", lvl: 1,
        items: [{ k: "class Ordinateur { … }", a: "cl" }, { k: "new Ordinateur(\"PC-01\", 8)", a: "obj" }, { k: "private int ram;", a: "attr" }, { k: "public void reparer()", a: "meth" }, { k: "public Ordinateur(String id)", a: "ctor" }, { k: "this.ram = ram;", a: "this" }, { k: "public int getRam()", a: "get" }],
        choices: [{ v: "cl", t: "Une classe : le plan des objets" }, { v: "obj", t: "La création d'un objet (instance)" }, { v: "attr", t: "Un attribut privé" }, { v: "meth", t: "Une méthode d'instance" }, { v: "ctor", t: "Un constructeur" }, { v: "this", t: "L'attribut de l'objet reçoit la valeur du paramètre" }, { v: "get", t: "Un getter" }] },
      { type: "fill", title: "Compléter une classe", lvl: 1,
        statement: "Complète la classe <code>Technicien</code> : attributs privés, constructeur et getter.",
        code: "class Technicien {\n    [[private]] String nom;\n    private int niveau;\n\n    public [[Technicien]](String nom, int niveau) {\n        [[this]].nom = nom;\n        this.niveau = [[niveau]];\n    }\n\n    public [[String]] getNom() {\n        [[return]] nom;\n    }\n}",
        expl: "Attributs <code>private</code> ; le constructeur porte le nom de la classe, sans type de retour ; <code>this.nom</code> est l'attribut ; le getter renvoie un String." },
      { type: "hunt", title: "Erreurs dans l'utilisation d'objets", lvl: 2, code: P.s6_bug.code.replace(/\n$/, "").split("\n"), bad: [17, 19, 20],
        fixes: {
          17: { msg: "Parc.java:17: error: constructor Imprimante in class Imprimante cannot be applied to given types;\n  required: String,boolean\n  found:    String", fr: "Le constructeur attend deux valeurs : l'identifiant et le booléen couleur.", fix: "        Imprimante i1 = new Imprimante(\"IMP-01\", false);" },
          19: { msg: "Parc.java:19: error: couleur has private access in Imprimante", fr: "<code>couleur</code> est private : il faut un getter (par exemple <code>isCouleur()</code>) dans la classe Imprimante.", fix: "        System.out.println(i2.isCouleur());   // après avoir ajouté le getter" },
          20: { msg: "Parc.java:20: error: cannot find symbol\n  symbol:   method getid()", fr: "Java est sensible à la casse : la méthode s'appelle <code>getId</code>.", fix: "        System.out.println(i2.getId());" } },
        order: "Vérifié avec javac : les trois erreurs sont signalées ensemble (3 errors)." },
      { type: "write", title: "La classe Imprimante", lvl: 2, file: "TestImprimante.java",
        statement: "<p>Écris la classe <code>Imprimante</code> : attributs privés <code>id</code> (String) et <code>pagesRestantes</code> (int) ; un constructeur <code>Imprimante(String id, int pages)</code> ; une méthode <code>imprimer(int nb)</code> qui, s'il reste assez de papier, retire nb pages et affiche <code>IMP-01 : 20 page(s) imprimée(s)</code>, sinon affiche <code>IMP-01 : papier insuffisant</code> ; un getter <code>getPagesRestantes()</code>. La classe <code>TestImprimante</code> est fournie.</p>",
        starter: "class Imprimante {\n    // attributs, constructeur, imprimer, getPagesRestantes\n\n}\n\npublic class TestImprimante {\n    public static void main(String[] args) {\n        Imprimante imp = new Imprimante(\"IMP-01\", 50);\n        imp.imprimer(20);\n        imp.imprimer(40);\n        imp.imprimer(30);\n        System.out.println(\"Reste : \" + imp.getPagesRestantes());\n    }\n}\n",
        tests: [{ label: "scénario d'impression" }], example: true, solution: "s6_imprimante", hint: "<p>Dans <code>imprimer</code> : <code>if (nb &lt;= pagesRestantes) { pagesRestantes -= nb; … } else { … }</code>.</p>" },
      { type: "write", title: "Un setter qui contrôle", lvl: 2, file: "TestTicket.java",
        statement: "<p>Écris la classe <code>Ticket</code> : attributs privés <code>numero</code> (int) et <code>priorite</code> (String, <code>NORMALE</code> à la création) ; constructeur <code>Ticket(int numero)</code> ; <code>setPriorite(String p)</code> qui n'accepte que <code>BASSE</code>, <code>NORMALE</code> ou <code>HAUTE</code> (sinon ne change rien) ; <code>toString()</code> qui renvoie <code>Ticket 12 - HAUTE</code>. Le main fourni lit un numéro et une priorité.</p>",
        starter: "import java.util.Scanner;\n\nclass Ticket {\n\n}\n\npublic class TestTicket {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Ticket t = new Ticket(sc.nextInt());\n        String p = sc.next();\n        t.setPriorite(p);\n        System.out.println(t);\n    }\n}\n",
        tests: [{ input: "12 HAUTE\n", label: "priorité valide" }, { input: "7 URGENTE\n", label: "priorité refusée" }, { input: "3 BASSE\n", label: "BASSE" }],
        solution: "s6_ticket", hint: "<p>Compare avec <code>equals</code>. <code>toString</code> doit être <code>public String toString()</code>.</p>" }
    ],

    tp: {
      title: "TP 6 — Modélisation d'équipements", duration: "2 h", deliverable: "classes Ordinateur et Intervention",
      intro: "Tu modélises les deux entités centrales du projet : l'ordinateur et l'intervention de maintenance. Chaque classe est testée par un main fourni ; à la fin, tu les fais travailler ensemble.",
      steps: [
        "TD : liste sur papier les attributs (avec types) et les comportements d'un ordinateur et d'une intervention.",
        "Dessine leur diagramme de classe (nom, attributs privés, méthodes publiques).",
        "Écris la classe <code>Ordinateur</code> et fais passer son test (partie A).",
        "Écris la classe <code>Intervention</code> et fais passer son test (partie B).",
        "Instancie plusieurs objets dans un main et affiche leurs informations (partie C).",
        "Dans ton IDE, place chaque classe dans son propre fichier."
      ],
      parts: [
        { title: "La classe Ordinateur", html: K.p("Attributs privés : <code>id</code>, <code>marque</code> (String), <code>ram</code> (int), <code>enPanne</code> (boolean). Constructeur <code>Ordinateur(String id, String marque, int ram)</code> : si la RAM donnée n'est pas positive, on garde 4 Go. Getters <code>getId</code>, <code>getMarque</code>, <code>getRam</code>, <code>isEnPanne</code> ; <code>setRam</code> qui ignore les valeurs ≤ 0 ; <code>signalerPanne()</code>, <code>reparer()</code> ; <code>toString()</code> au format <code>PC-01 Dell 16 Go OK</code> ou <code>… EN PANNE</code>."),
          write: { file: "TestOrdinateur.java", statement: "", starter: "class Ordinateur {\n\n}\n\npublic class TestOrdinateur {\n    public static void main(String[] args) {\n        Ordinateur a = new Ordinateur(\"PC-01\", \"Dell\", 8);\n        Ordinateur b = new Ordinateur(\"PC-02\", \"HP\", -2);\n        b.signalerPanne();\n        a.setRam(16);\n        a.setRam(0);\n        System.out.println(a);\n        System.out.println(b);\n        b.reparer();\n        System.out.println(b.getId() + \" en panne ? \" + b.isEnPanne());\n    }\n}\n",
            tests: [{ label: "test de la classe" }], example: true, solution: "s6_tpord", expl: "Le constructeur met d'abord <code>ram</code> à 4, puis appelle <code>setRam</code> : la règle de validation n'est écrite qu'une fois." } },
        { title: "La classe Intervention", html: K.p("Attributs privés : <code>description</code>, <code>date</code> (texte, ex. \"12/03/2026\"), <code>statut</code> (String), <code>prixPieces</code> (double), <code>heures</code> (int). Le constructeur reçoit description, date, prix des pièces et heures ; le statut démarre à <code>OUVERTE</code>. <code>changerStatut(String)</code> accepte OUVERTE, EN_COURS, TERMINEE et affiche <code>Statut refuse : X</code> sinon. <code>cout()</code> = pièces + heures × 7500. <code>toString()</code> : <code>12/03/2026 | Remplacement disque | OUVERTE | 50000.0 FCFA</code>."),
          write: { file: "TestIntervention.java", statement: "", starter: "class Intervention {\n\n}\n\npublic class TestIntervention {\n    public static void main(String[] args) {\n        Intervention i = new Intervention(\"Remplacement disque\", \"12/03/2026\", 35000, 2);\n        System.out.println(i);\n        i.changerStatut(\"EN_COURS\");\n        i.changerStatut(\"ANNULEE\");\n        i.changerStatut(\"TERMINEE\");\n        System.out.println(i);\n    }\n}\n",
            tests: [{ label: "test de la classe" }], example: true, solution: "s6_tpint" } },
        { title: "Les objets travaillent ensemble", html: K.p("Une intervention concerne un ordinateur : la classe Intervention peut avoir un attribut de type <code>Ordinateur</code>. Créer l'intervention signale la panne ; la terminer répare le poste. C'est une première <b>relation entre classes</b>, approfondie en séance 7.") + K.run("s6_tp") }
      ]
    },

    quiz: [
      { q: "Une classe est :", o: ["Un objet particulier", "Un modèle qui décrit les attributs et méthodes de ses objets", "Une variable", "Un fichier .class"], a: 1, e: "La classe est le plan ; les objets sont les exemplaires." },
      { q: "Quel mot-clé crée un objet ?", o: ["class", "new", "this", "static"], a: 1, e: "<code>new NomClasse(…)</code> crée un objet et appelle le constructeur." },
      { q: "Un constructeur :", o: ["A le nom de la classe et pas de type de retour", "Doit s'appeler init", "Renvoie void", "Est toujours static"], a: 0, e: "Même nom que la classe, aucun type de retour, pas même void." },
      { q: "Dans <code>this.marque = marque;</code>, <code>this.marque</code> désigne :", o: ["Le paramètre", "L'attribut de l'objet courant", "Une variable locale", "Une constante"], a: 1, e: "this = l'objet courant ; marque seul = le paramètre." },
      { q: "Pourquoi déclarer les attributs <code>private</code> ?", o: ["Pour que le programme soit plus rapide", "Pour empêcher les autres classes de les modifier sans contrôle", "Parce que Java l'impose", "Pour pouvoir les afficher"], a: 1, e: "C'est l'encapsulation : les modifications passent par des setters qui vérifient les valeurs." },
      { q: "<code>pc.ram = 4;</code> depuis main, alors que ram est private. Résultat :", o: ["Ça fonctionne", "Erreur de compilation : ram has private access", "Erreur à l'exécution", "ram reste à 0"], a: 1, e: "L'accès est refusé dès la compilation." },
      { q: "Après <code>Ordinateur b = a;</code> :", o: ["b est une copie indépendante de a", "a et b désignent le même objet", "b vaut null", "Erreur"], a: 1, e: "Seule la référence est copiée." },
      { q: "Que provoque <code>Ordinateur o = null; o.reparer();</code> ?", o: ["Rien", "Une NullPointerException à l'exécution", "Une erreur de compilation", "La création d'un objet"], a: 1, e: "Il n'y a pas d'objet sur lequel appeler la méthode." },
      { q: "Le getter d'un attribut boolean <code>enPanne</code> s'appelle par convention :", o: ["getEnPanne()", "isEnPanne()", "enPanne()", "readEnPanne()"], a: 1, e: "Pour un boolean, on utilise le préfixe is." },
      { q: "Que fait une méthode <code>toString()</code> redéfinie ?", o: ["Convertit l'objet en nombre", "Renvoie le texte utilisé pour afficher l'objet", "Supprime l'objet", "Copie l'objet"], a: 1, e: "println et la concaténation l'appellent automatiquement." },
      { q: "Un attribut <code>static</code> :", o: ["Existe une seule fois, partagé par tous les objets de la classe", "Ne peut pas changer", "Est privé", "Existe dans chaque objet"], a: 0, e: "Exemple : un compteur du nombre d'objets créés." },
      { q: "Une classe a un constructeur <code>Ordinateur(String id)</code>. <code>new Ordinateur()</code> donne :", o: ["Un objet avec id null", "Une erreur de compilation : constructor cannot be applied to given types", "Une erreur à l'exécution", "Un objet vide"], a: 1, e: "Le constructeur par défaut disparaît dès qu'on en écrit un." }
    ],

    video: { src: "media/seance6.mp4", title: "classes et objets", dur: 91, chapters: [[0, "Titre"], [5, "Pourquoi des objets"], [16, "Classe et objets"], [29, "Constructeur et this"], [41, "Références"], [53, "Encapsulation"], [64, "private access"], [73, "toString"], [83, "À retenir"]] },
    youtube: [
      { t: "Classes et objets en Java", src: "Recherche YouTube", d: "Introduction à la programmation orientée objet.", q: "java classe objet POO débutant français" },
      { t: "Constructeur et mot-clé this", src: "Recherche YouTube", d: "Initialiser un objet, lever l'ambiguïté avec this.", q: "java constructeur this tutoriel français" },
      { t: "Encapsulation : getters et setters", src: "Recherche YouTube", d: "private, accesseurs et contrôle des valeurs.", q: "java encapsulation getter setter private français" }
    ],
    docs: [
      { t: "Classes (Java Tutorials)", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html", d: "Déclarer une classe, ses attributs et ses méthodes." },
      { t: "Objects (Java Tutorials)", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/java/javaOO/objects.html", d: "Créer et utiliser des objets." },
      { t: "Controlling Access to Members of a Class", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html", d: "public, private et la visibilité." }
    ],
    memo: {
      cards: [
        ["Classe", "<code>class Ordinateur { attributs; constructeur(s); méthodes; }</code> · une classe publique par fichier, au nom du fichier."],
        ["Objet", "<code>Ordinateur pc = new Ordinateur(\"PC-01\", \"Dell\", 8);</code> · méthodes : <code>pc.reparer();</code>"],
        ["Constructeur", "Même nom que la classe, pas de type de retour · <code>this.attribut = parametre;</code> · un constructeur écrit supprime le constructeur vide."],
        ["Encapsulation", "Attributs <code>private</code> · getters <code>getX()</code> / <code>isX()</code> · setters <code>setX(v)</code> qui vérifient v · pas de setter pour ce qui ne change pas."],
        ["Références", "Une variable objet contient une référence · <code>b = a</code> : même objet · <code>==</code> compare les références · null → NullPointerException."],
        ["toString / static", "<code>public String toString()</code> : texte affiché par println · <code>static</code> : un seul exemplaire pour toute la classe."]
      ],
      code: P.s6_encap.code, codeTitle: "Modèle : une classe encapsulée",
      errors: [["<code>X has private access in Classe</code>", "Accès direct à un attribut private", "Getter / setter"], ["<code>constructor … cannot be applied to given types</code>", "Arguments de new incorrects", "Respecter le constructeur"], ["<code>NullPointerException</code>", "Objet jamais créé (null)", "<code>new</code> avant usage"], ["<code>non-static variable … static context</code>", "Attribut d'instance utilisé dans main", "Passer par un objet"], ["Affiche <code>Classe@1b6d…</code>", "Pas de toString", "Redéfinir toString"], ["L'attribut ne change pas", "<code>marque = marque;</code> sans this", "<code>this.marque = marque;</code>"]],
      glossary: [["Classe", "Modèle décrivant des objets : attributs et méthodes."], ["Objet / instance", "Exemplaire concret d'une classe, créé avec new."], ["Attribut", "Donnée propre à chaque objet."], ["Constructeur", "Méthode spéciale appelée par new pour initialiser l'objet."], ["this", "Référence vers l'objet courant."], ["Encapsulation", "Masquer les attributs (private) et contrôler l'accès par des méthodes."], ["Getter / setter", "Méthodes de lecture / modification d'un attribut."], ["Référence", "Adresse d'un objet ; plusieurs variables peuvent désigner le même."], ["UML", "Notation graphique standard pour représenter les classes."]],
      selfcheck: ["Je sais expliquer la différence entre une classe et un objet.", "Je sais écrire une classe avec attributs privés, constructeur et méthodes.", "Je sais utiliser this dans un constructeur.", "Je sais écrire des getters et des setters qui contrôlent les valeurs.", "Je comprends qu'une variable objet contient une référence.", "J'ai réalisé le TP 6 (Ordinateur et Intervention)."],
      next: "Séance 7 : relations entre classes, héritage, exceptions et ArrayList. Tu gèreras une liste d'équipements de taille variable et les saisies invalides."
    }
  };
})();
