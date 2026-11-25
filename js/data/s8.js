(function () {
  var P = COURSE.progs;
  COURSE.seances.push({ id: "s8", tag: "S-08", short: "Projet de synthèse" });

  P.s8_projet = { file: "GestionParc.java", lab: "Projet complet : gestion du parc",
    input: "1\npc-01\nOrdinateur\nDell\nEN_SERVICE\n1\nIMP-01\nImprimante\nHP\nEN_SERVICE\n1\nPC-01\nOrdinateur\nHP\nEN_SERVICE\n2\n4\nPC-01\nEcran noir au demarrage\n12/03/2026\n5\n1\n25000\ndeux\n2\n6\n3\nimp-01\n7\n0\n",
    code:
`import java.util.ArrayList;
import java.util.Scanner;

// ===================== Equipement =====================
class Equipement {
    private String id;
    private String type;
    private String marque;
    private String etat;

    public Equipement(String id, String type, String marque, String etat) {
        this.id = id.toUpperCase();
        this.type = type;
        this.marque = marque;
        setEtat(etat);
    }

    public String getId() { return id; }
    public String getEtat() { return etat; }

    // Seuls trois états sont autorisés ; sinon on garde EN_SERVICE
    public void setEtat(String etat) {
        String e = etat.trim().toUpperCase();
        if (e.equals("EN_SERVICE") || e.equals("EN_PANNE") || e.equals("REFORME")) {
            this.etat = e;
        } else if (this.etat == null) {
            this.etat = "EN_SERVICE";
        }
    }

    @Override
    public String toString() {
        return String.format("%-8s %-12s %-8s %s", id, type, marque, etat);
    }
}

// ===================== Intervention =====================
class Intervention {
    public static final double TARIF_HORAIRE = 7500;
    private static int compteur = 0;

    private int numero;
    private Equipement equipement;
    private String description;
    private String date;
    private String statut;
    private double prixPieces;
    private int heures;

    public Intervention(Equipement equipement, String description, String date) {
        compteur++;
        this.numero = compteur;
        this.equipement = equipement;
        this.description = description;
        this.date = date;
        this.statut = "OUVERTE";
        equipement.setEtat("EN_PANNE");
    }

    public int getNumero() { return numero; }
    public String getStatut() { return statut; }

    // Clôture : on enregistre les pièces et le temps, le poste repasse en service
    public void cloturer(double prixPieces, int heures) {
        this.prixPieces = prixPieces;
        this.heures = heures;
        this.statut = "TERMINEE";
        equipement.setEtat("EN_SERVICE");
    }

    public double cout() {
        return prixPieces + heures * TARIF_HORAIRE;
    }

    @Override
    public String toString() {
        String c = statut.equals("TERMINEE") ? String.format("%.2f FCFA", cout()) : "-";
        return "#" + numero + " " + equipement.getId() + " | " + date + " | " + description + " | " + statut + " | " + c;
    }
}

// ===================== Parc =====================
class Parc {
    private ArrayList<Equipement> equipements = new ArrayList<>();
    private ArrayList<Intervention> interventions = new ArrayList<>();

    // Refuse un identifiant déjà présent
    public boolean ajouter(Equipement e) {
        if (rechercher(e.getId()) != null) {
            return false;
        }
        equipements.add(e);
        return true;
    }

    public Equipement rechercher(String id) {
        for (Equipement e : equipements) {
            if (e.getId().equalsIgnoreCase(id.trim())) {
                return e;
            }
        }
        return null;
    }

    public Intervention ouvrirIntervention(Equipement e, String description, String date) {
        Intervention i = new Intervention(e, description, date);
        interventions.add(i);
        return i;
    }

    public Intervention rechercherIntervention(int numero) {
        for (Intervention i : interventions) {
            if (i.getNumero() == numero) {
                return i;
            }
        }
        return null;
    }

    public ArrayList<Equipement> getEquipements() { return equipements; }
    public ArrayList<Intervention> getInterventions() { return interventions; }

    public int compterEquipements(String etat) {
        int n = 0;
        for (Equipement e : equipements) {
            if (e.getEtat().equals(etat)) {
                n++;
            }
        }
        return n;
    }

    public int compterInterventions(String statut) {
        int n = 0;
        for (Intervention i : interventions) {
            if (i.getStatut().equals(statut)) {
                n++;
            }
        }
        return n;
    }
}

// ===================== Application =====================
public class GestionParc {
    static Scanner sc = new Scanner(System.in);
    static Parc parc = new Parc();

    static String lireTexte(String question) {
        String t;
        do {
            System.out.print(question);
            t = sc.nextLine().trim();
        } while (t.isEmpty());
        return t;
    }

    static int lireEntier(String question, int min, int max) {
        while (true) {
            String t = lireTexte(question);
            try {
                int n = Integer.parseInt(t);
                if (n >= min && n <= max) {
                    return n;
                }
                System.out.println("  Valeur attendue entre " + min + " et " + max + ".");
            } catch (NumberFormatException e) {
                System.out.println("  \\"" + t + "\\" n'est pas un nombre entier.");
            }
        }
    }

    static double lireMontant(String question) {
        while (true) {
            String t = lireTexte(question);
            try {
                double d = Double.parseDouble(t.replace(',', '.'));
                if (d >= 0) {
                    return d;
                }
                System.out.println("  Le montant ne peut pas être négatif.");
            } catch (NumberFormatException e) {
                System.out.println("  \\"" + t + "\\" n'est pas un montant.");
            }
        }
    }

    static void afficherMenu() {
        System.out.println();
        System.out.println("===== GESTION DU PARC =====");
        System.out.println("1. Ajouter un équipement");
        System.out.println("2. Afficher les équipements");
        System.out.println("3. Rechercher par identifiant");
        System.out.println("4. Enregistrer une intervention");
        System.out.println("5. Clôturer une intervention (coût)");
        System.out.println("6. Afficher les interventions");
        System.out.println("7. Statistiques");
        System.out.println("0. Quitter");
    }

    static void ajouterEquipement() {
        String id = lireTexte("Identifiant : ");
        String type = lireTexte("Type : ");
        String marque = lireTexte("Marque : ");
        String etat = lireTexte("État (EN_SERVICE, EN_PANNE, REFORME) : ");
        if (parc.ajouter(new Equipement(id, type, marque, etat))) {
            System.out.println("Équipement ajouté.");
        } else {
            System.out.println("Refusé : l'identifiant " + id.toUpperCase() + " existe déjà.");
        }
    }

    static void afficherEquipements() {
        if (parc.getEquipements().isEmpty()) {
            System.out.println("Aucun équipement enregistré.");
            return;
        }
        for (Equipement e : parc.getEquipements()) {
            System.out.println(e);
        }
    }

    static void rechercherEquipement() {
        Equipement e = parc.rechercher(lireTexte("Identifiant cherché : "));
        System.out.println(e != null ? e : "Aucun équipement avec cet identifiant.");
    }

    static void enregistrerIntervention() {
        Equipement e = parc.rechercher(lireTexte("Identifiant de l'équipement : "));
        if (e == null) {
            System.out.println("Équipement inconnu : ajoutez-le d'abord.");
            return;
        }
        String description = lireTexte("Description : ");
        String date = lireTexte("Date (jj/mm/aaaa) : ");
        Intervention i = parc.ouvrirIntervention(e, description, date);
        System.out.println("Intervention #" + i.getNumero() + " ouverte.");
    }

    static void cloturerIntervention() {
        int numero = lireEntier("Numéro de l'intervention : ", 1, 9999);
        Intervention i = parc.rechercherIntervention(numero);
        if (i == null) {
            System.out.println("Intervention introuvable.");
            return;
        }
        double pieces = lireMontant("Prix des pièces (FCFA) : ");
        int heures = lireEntier("Heures de main d'oeuvre : ", 0, 100);
        i.cloturer(pieces, heures);
        System.out.printf("Coût de l'intervention : %.2f FCFA%n", i.cout());
    }

    static void afficherInterventions() {
        if (parc.getInterventions().isEmpty()) {
            System.out.println("Aucune intervention.");
        }
        for (Intervention i : parc.getInterventions()) {
            System.out.println(i);
        }
    }

    static void afficherStatistiques() {
        System.out.println("Équipements : " + parc.getEquipements().size()
                + " (en service " + parc.compterEquipements("EN_SERVICE")
                + ", en panne " + parc.compterEquipements("EN_PANNE") + ")");
        System.out.println("Interventions ouvertes : " + parc.compterInterventions("OUVERTE")
                + ", terminées : " + parc.compterInterventions("TERMINEE"));
    }

    public static void main(String[] args) {
        int choix;
        do {
            afficherMenu();
            choix = lireEntier("Votre choix : ", 0, 7);
            switch (choix) {
                case 1 -> ajouterEquipement();
                case 2 -> afficherEquipements();
                case 3 -> rechercherEquipement();
                case 4 -> enregistrerIntervention();
                case 5 -> cloturerIntervention();
                case 6 -> afficherInterventions();
                case 7 -> afficherStatistiques();
                case 0 -> System.out.println("Fermeture de l'application. Au revoir !");
            }
        } while (choix != 0);
    }
}
` };
  P.s8_demo = { file: "MiniParc.java", code:
`import java.util.ArrayList;

class Equipement {
    private String id;
    private String etat;

    public Equipement(String id) {
        this.id = id;
        this.etat = "EN_SERVICE";
    }

    public String getId() { return id; }
    public void setEtat(String etat) { this.etat = etat; }
    public String toString() { return id + " " + etat; }
}

class Intervention {
    private Equipement equipement;
    private String statut;
    private int heures;

    public Intervention(Equipement e) {
        equipement = e;
        statut = "OUVERTE";
        e.setEtat("EN_PANNE");
    }

    public void cloturer(int heures) {
        this.heures = heures;
        statut = "TERMINEE";
        equipement.setEtat("EN_SERVICE");
    }

    public double cout() { return heures * 7500.0; }
}

public class MiniParc {
    public static void main(String[] args) {
        ArrayList<Equipement> parc = new ArrayList<>();
        parc.add(new Equipement("PC-01"));
        parc.add(new Equipement("PC-02"));

        Intervention i = new Intervention(parc.get(1));
        System.out.println(parc);
        i.cloturer(2);
        System.out.println(parc + " coût " + i.cout());
    }
}
` };
  P.s8_j1 = { file: "TestClasses.java", code:
`class Equipement {
    private String id;
    private String type;
    private String marque;
    private String etat;

    public Equipement(String id, String type, String marque, String etat) {
        this.id = id.toUpperCase();
        this.type = type;
        this.marque = marque;
        this.etat = "EN_SERVICE";
        setEtat(etat);
    }

    public String getId() { return id; }
    public String getEtat() { return etat; }

    public void setEtat(String etat) {
        String e = etat.toUpperCase();
        if (e.equals("EN_SERVICE") || e.equals("EN_PANNE") || e.equals("REFORME")) {
            this.etat = e;
        }
    }

    public String toString() {
        return id + " " + type + " " + marque + " " + etat;
    }
}

class Intervention {
    private Equipement equipement;
    private String description;
    private String date;
    private String statut;
    private double prixPieces;
    private int heures;

    public Intervention(Equipement equipement, String description, String date) {
        this.equipement = equipement;
        this.description = description;
        this.date = date;
        this.statut = "OUVERTE";
        equipement.setEtat("EN_PANNE");
    }

    public void cloturer(double prixPieces, int heures) {
        this.prixPieces = prixPieces;
        this.heures = heures;
        statut = "TERMINEE";
        equipement.setEtat("EN_SERVICE");
    }

    public double cout() { return prixPieces + heures * 7500; }
    public String getStatut() { return statut; }
}

public class TestClasses {
    public static void main(String[] args) {
        Equipement pc = new Equipement("pc-01", "Ordinateur", "Dell", "inconnu");
        System.out.println(pc);
        Intervention i = new Intervention(pc, "Clavier HS", "12/03/2026");
        System.out.println(pc.getEtat() + " / " + i.getStatut());
        i.cloturer(12000, 1);
        System.out.println(pc.getEtat() + " / " + i.getStatut() + " / " + i.cout());
    }
}
` };
  P.s8_j2 = { file: "TestParc.java", code:
`import java.util.ArrayList;

class Equipement {
    private String id;
    private String etat;

    public Equipement(String id, String etat) {
        this.id = id;
        this.etat = etat;
    }

    public String getId() { return id; }
    public String getEtat() { return etat; }
    public String toString() { return id + " (" + etat + ")"; }
}

class Parc {
    private ArrayList<Equipement> equipements = new ArrayList<>();

    public boolean ajouter(Equipement e) {
        if (rechercher(e.getId()) != null) {
            return false;
        }
        equipements.add(e);
        return true;
    }

    public Equipement rechercher(String id) {
        for (Equipement e : equipements) {
            if (e.getId().equalsIgnoreCase(id)) {
                return e;
            }
        }
        return null;
    }

    public int compter(String etat) {
        int n = 0;
        for (Equipement e : equipements) {
            if (e.getEtat().equals(etat)) {
                n++;
            }
        }
        return n;
    }

    public int taille() { return equipements.size(); }
}

public class TestParc {
    public static void main(String[] args) {
        Parc p = new Parc();
        System.out.println(p.ajouter(new Equipement("PC-01", "EN_SERVICE")));
        System.out.println(p.ajouter(new Equipement("PC-02", "EN_PANNE")));
        System.out.println(p.ajouter(new Equipement("pc-01", "EN_PANNE")));
        System.out.println(p.ajouter(new Equipement("IMP-01", "EN_PANNE")));
        System.out.println(p.rechercher("imp-01"));
        System.out.println(p.rechercher("SW-01"));
        System.out.println(p.taille() + " équipements, " + p.compter("EN_PANNE") + " en panne");
    }
}
` };
  P.s8_stat = { file: "Stats.java", code:
`import java.util.ArrayList;
import java.util.Scanner;

public class Stats {
    static int compterParStatut(ArrayList<String> statuts, String statut) {
        int n = 0;
        for (String s : statuts) {
            if (s.equals(statut)) {
                n++;
            }
        }
        return n;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<String> statuts = new ArrayList<>();
        String s = sc.next();
        while (!s.equals("FIN")) {
            statuts.add(s);
            s = sc.next();
        }
        System.out.println("OUVERTE : " + compterParStatut(statuts, "OUVERTE"));
        System.out.println("EN_COURS : " + compterParStatut(statuts, "EN_COURS"));
        System.out.println("TERMINEE : " + compterParStatut(statuts, "TERMINEE"));
    }
}
` };
  P.s8_total = { file: "CoutTotal.java", code:
`import java.util.Scanner;

public class CoutTotal {
    static final double TARIF = 7500;

    static double cout(double pieces, int heures) {
        return pieces + heures * TARIF;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        double total = 0;
        double plusCher = 0;
        for (int i = 1; i <= n; i++) {
            double c = cout(sc.nextDouble(), sc.nextInt());
            total += c;
            if (c > plusCher) {
                plusCher = c;
            }
        }
        System.out.printf("Total : %.2f FCFA%n", total);
        System.out.printf("Plus chère : %.2f FCFA%n", plusCher);
    }
}
` };
  P.s8_doublon = { file: "Doublons.java", code:
`import java.util.ArrayList;
import java.util.Scanner;

public class Doublons {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<String> ids = new ArrayList<>();
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String id = sc.next().toUpperCase();
            boolean existe = false;
            for (String x : ids) {
                if (x.equals(id)) {
                    existe = true;
                }
            }
            if (existe) {
                System.out.println(id + " refusé (doublon)");
            } else {
                ids.add(id);
                System.out.println(id + " ajouté");
            }
        }
        System.out.println(ids);
    }
}
` };

  COURSE.data.s8 = {
    hours: "6 h", split: "projet encadré 6 h", comp: "C6, C7",
    tabLabels: { lecon: "Cahier des charges", demos: "Démo de l'application", exercices: "Extensions", tp: "Jalons du projet", quiz: "Préparer l'oral", memo: "Évaluation" },
    h1: "Projet : <em>gestion du parc informatique</em>",
    lede: "Un service informatique veut un outil console pour répertorier son matériel et suivre les opérations de maintenance. Tu le conçois, le codes, le testes et le présentes, en réutilisant tout ce que tu as appris depuis la séance 1.",
    prereq: "les séances 1 à 7, en particulier les classes (S6), ArrayList et try/catch (S7).",
    objectives: [
      "Analyser un besoin et le traduire en exigences et en classes",
      "Planifier et répartir le travail dans un groupe de 2 à 3 personnes",
      "Implémenter une application console complète, organisée en classes et méthodes",
      "Tester l'application avec des scénarios, y compris des saisies invalides",
      "Démontrer l'application et expliquer individuellement son code"
    ],
    lesson: [
      { title: "Le besoin et les exigences", html:
        K.p("<b>Contexte.</b> Un service informatique souhaite un outil élémentaire pour répertorier le matériel et suivre les opérations de maintenance. Le projet est volontairement limité au mode console, pour vérifier la maîtrise des bases du langage.") +
        K.table(["N°", "Fonctionnalité minimale obligatoire", "Notions mobilisées"], [
          ["F1", "Ajouter un équipement avec un identifiant, un type, une marque et un état", "classe, constructeur, Scanner"],
          ["F2", "Afficher la liste des équipements enregistrés", "ArrayList, boucle, toString"],
          ["F3", "Rechercher un équipement par identifiant", "recherche, equalsIgnoreCase, null"],
          ["F4", "Enregistrer une intervention avec une description, une date (texte) et un statut", "relation entre classes"],
          ["F5", "Calculer le coût d'une intervention (pièces + main d'œuvre)", "méthode qui renvoie un double"],
          ["F6", "Afficher un menu qui répète les opérations ou quitte proprement", "do-while, switch"]]) +
        K.table(["Fonctionnalité facultative", "Piste"], [["Stockage dans une ArrayList", "déjà utilisé dans la version proposée"], ["Sauvegarde et rechargement depuis un fichier texte", "séance 7, partie 7"], ["Gestion robuste des saisies invalides", "try/catch sur parseInt, bornes"], ["Statistiques : nombre d'équipements, interventions par statut", "comptages dans la classe Parc"]]) +
        K.note("Livrables", "Code source commenté avec parcimonie · une courte fiche qui explique les classes et méthodes · des scénarios de test · une démonstration orale. Groupes de 2 à 3, avec une vérification individuelle des contributions : chacun doit pouvoir expliquer et modifier n'importe quelle partie du code.") },
      { title: "Organiser le travail (6 heures)", html:
        K.table(["Temps", "Étape", "Résultat attendu"], [
          ["H1", "Relire les exigences, concevoir les classes, se répartir le travail", "diagramme de classes, liste des méthodes, qui fait quoi"],
          ["H2", "Jalon 1 : classes Equipement et Intervention, testées seules", "TestClasses passe"],
          ["H3", "Jalon 2 : classe Parc (ajout, recherche, comptages)", "TestParc passe"],
          ["H4", "Jalon 3 : menu et saisies robustes, assemblage", "F1 à F6 fonctionnent"],
          ["H5", "Jalon 4 : scénarios de test, corrections, facultatifs", "tableau de tests rempli"],
          ["H6", "Démonstration et explication individuelle", "chacun présente une partie et répond aux questions"]]) +
        K.ul(["<b>Intégrer souvent</b> : assemblez le code à chaque jalon plutôt qu'à la dernière heure.", "<b>Une personne, une classe</b> au début, puis échangez : chacun relit le code de l'autre et l'explique.", "<b>Gardez une version qui marche</b> : avant une modification risquée, copiez le dossier (ou utilisez Git si vous le connaissez)."]) },
      { title: "Concevoir les classes", html:
        K.p("En relisant les exigences, on repère les noms (équipement, intervention, parc) et les verbes (ajouter, rechercher, enregistrer, calculer). Proposition de conception :") +
        '<div class="umlrow">' + K.uml("Equipement", ["- id : String", "- type : String", "- marque : String", "- etat : String"], ["+ getId(), getEtat()", "+ setEtat(String)", "+ toString()"]) +
        K.uml("Intervention", ["- numero : int", "- equipement : Equipement", "- description, date : String", "- statut : String", "- prixPieces : double", "- heures : int"], ["+ cloturer(pieces, heures)", "+ cout() : double", "+ toString()"]) +
        K.uml("Parc", ["- equipements : ArrayList", "- interventions : ArrayList"], ["+ ajouter(Equipement) : boolean", "+ rechercher(String) : Equipement", "+ ouvrirIntervention(…)", "+ rechercherIntervention(int)", "+ compter…(String) : int"]) +
        K.uml("GestionParc", ["- sc : Scanner", "- parc : Parc"], ["+ main", "lireTexte, lireEntier, lireMontant", "afficherMenu, ajouterEquipement…"]) + "</div>" +
        K.ul(["<b>Equipement</b> et <b>Intervention</b> : les données métier, encapsulées (attributs private, état contrôlé).", "<b>Parc</b> : la gestion des listes (ajouter sans doublon, rechercher, compter). Elle ne fait aucun affichage ni saisie.", "<b>GestionParc</b> : l'interface console (menu, questions, messages). C'est la seule classe qui utilise Scanner et System.out.", "Une intervention <b>référence</b> l'équipement concerné : l'ouvrir met l'équipement EN_PANNE, la clôturer le remet EN_SERVICE."]) +
        K.note("Pourquoi séparer Parc et GestionParc ?", "Si demain l'application passe en interface graphique ou en site web, seule GestionParc change. Les règles (pas de doublon, calcul du coût) restent dans les classes métier, testables sans clavier.") },
      { title: "Le code complet", html:
        K.p("Voici une version complète qui couvre F1 à F6 et trois facultatifs (ArrayList, saisie robuste, statistiques). Elle tient dans un seul fichier pour pouvoir l'exécuter ici ; dans ton IDE, place chaque classe dans son fichier (<code>Equipement.java</code>, <code>Intervention.java</code>, <code>Parc.java</code>, <code>GestionParc.java</code>).",
          "L'entrée clavier fournie déroule un scénario complet : deux équipements ajoutés, un doublon refusé, une intervention ouverte puis clôturée (avec une saisie invalide « deux »), une recherche et les statistiques. Lance-le, puis modifie le scénario.") +
        K.run("s8_projet") +
        K.warn("Ton projet doit être le tien", "Ce code est une référence pour te débloquer et comparer, pas un livrable à rendre tel quel. À l'oral, l'enseignant peut te demander de modifier une petite fonctionnalité ou d'expliquer une méthode : construis ta propre version jalon par jalon (onglet Jalons) et ne garde que ce que tu sais expliquer.") },
      { title: "Tester : les scénarios", html:
        K.p("Un scénario de test décrit ce qu'on fait et ce qu'on attend. Remplis ce tableau pour ton application et joins-le au livrable :") +
        K.table(["N°", "Action", "Résultat attendu", "OK ?"], [
          ["T1", "Ajouter PC-01 (Ordinateur, Dell, EN_SERVICE)", "« Équipement ajouté. »", ""],
          ["T2", "Ajouter à nouveau pc-01", "« Refusé : l'identifiant PC-01 existe déjà. »", ""],
          ["T3", "Afficher les équipements (liste vide puis remplie)", "message « Aucun équipement » puis une ligne par équipement", ""],
          ["T4", "Rechercher imp-01 (minuscules) / SW-99", "équipement trouvé / « Aucun équipement… »", ""],
          ["T5", "Intervention sur un identifiant inconnu", "« Équipement inconnu… »", ""],
          ["T6", "Ouvrir une intervention sur PC-01", "n° attribué, PC-01 passe EN_PANNE", ""],
          ["T7", "Clôturer avec 25000 FCFA et 2 h", "coût 40000.00 FCFA, PC-01 repasse EN_SERVICE", ""],
          ["T8", "Taper « abc », « 9 », « -1 » au menu", "message d'erreur, le menu est redemandé, pas de plantage", ""],
          ["T9", "Statistiques", "nombres cohérents avec les actions précédentes", ""],
          ["T10", "Choix 0", "message de fin, le programme s'arrête", ""]]) +
        K.p("Teste aussi les <b>valeurs limites</b> (0 heure, montant 0, texte vide) et les <b>saisies absurdes</b> (lettres, nombres négatifs, virgule dans un montant). Un bon test cherche à casser le programme.") },
      { title: "Préparer la démonstration", html:
        K.ol(["<b>Présentation (2 min)</b> : le besoin, les classes et leur rôle (montre le diagramme).", "<b>Démonstration (5 min)</b> : déroule un scénario préparé qui montre F1 à F6, puis une saisie invalide gérée proprement.", "<b>Code (3 min par personne)</b> : chacun explique une classe ou une méthode qu'il a écrite, ligne par ligne.", "<b>Questions</b> : l'enseignant peut demander une petite modification en direct (ajouter un état, changer le tarif, ajouter un compteur)."]) +
        K.p("Entraîne-toi avec l'onglet <b>Préparer l'oral</b> : il reprend les questions les plus fréquentes. Et vérifie que ton programme compile et se lance sur la machine de démonstration <b>avant</b> la séance.") }
    ],

    demos: [
      { type: "stepper", title: "Les objets qui interagissent", prog: "s8_demo", intro: "Version réduite du projet : suis ce qui arrive à l'équipement PC-02 quand une intervention est ouverte puis clôturée. L'intervention modifie l'équipement à travers sa référence.",
        notes: { 39: "Les équipements sont rangés dans une ArrayList.", 43: "On ouvre une intervention sur le 2e équipement (indice 1).", 25: "Le constructeur de l'intervention met l'équipement EN_PANNE : c'est le même objet que celui de la liste.", 44: "La liste affiche PC-02 EN_PANNE : l'objet a bien été modifié.", 45: "Clôture : enregistrement des heures, statut TERMINEE…", 31: "… et l'équipement repasse EN_SERVICE." } },
      { type: "lab" }
    ],

    exercises: [
      { type: "mcq", title: "Choix de conception", lvl: 1, items: [
        { q: "Où placer la règle « refuser un identifiant déjà présent » ?", o: ["Dans main", "Dans la méthode ajouter de la classe Parc", "Dans toString", "Dans Intervention"], a: 1, e: "C'est une règle de gestion du parc : elle appartient à Parc, testable sans clavier." },
        { q: "Quelle classe doit utiliser Scanner ?", o: ["Equipement", "Intervention", "Parc", "GestionParc (l'interface console)"], a: 3, e: "Les classes métier ne dépendent ni du clavier ni de l'écran." },
        { q: "Pourquoi l'attribut <code>etat</code> est-il private avec un <code>setEtat</code> contrôlé ?", o: ["Pour aller plus vite", "Pour empêcher des états invalides comme \"CASSE\"", "Parce que String l'exige", "Pour l'afficher"], a: 1, e: "Encapsulation : seuls les états prévus sont acceptés." },
        { q: "Comment l'intervention modifie-t-elle l'état de l'équipement ?", o: ["Elle en fait une copie", "Elle garde une référence vers l'objet Equipement et appelle setEtat", "Elle modifie un tableau global", "Elle ne peut pas"], a: 1, e: "Les deux variables désignent le même objet." },
        { q: "Pourquoi lire les nombres avec <code>nextLine()</code> puis <code>Integer.parseInt</code> dans un try ?", o: ["C'est plus rapide", "Pour gérer une saisie invalide sans planter et sans le piège nextInt / nextLine", "Parce que nextInt n'existe pas", "Pour accepter les décimaux"], a: 1, e: "On contrôle entièrement la conversion et l'erreur." }] },
      { type: "write", title: "Statistiques par statut", lvl: 2, file: "Stats.java",
        statement: "<p>Écris <code>static int compterParStatut(ArrayList&lt;String&gt; statuts, String statut)</code>. Le main fourni lit des statuts jusqu'à <code>FIN</code> et affiche le nombre d'interventions OUVERTE, EN_COURS et TERMINEE.</p>",
        starter: "import java.util.ArrayList;\nimport java.util.Scanner;\n\npublic class Stats {\n\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        ArrayList<String> statuts = new ArrayList<>();\n        String s = sc.next();\n        while (!s.equals(\"FIN\")) {\n            statuts.add(s);\n            s = sc.next();\n        }\n        System.out.println(\"OUVERTE : \" + compterParStatut(statuts, \"OUVERTE\"));\n        System.out.println(\"EN_COURS : \" + compterParStatut(statuts, \"EN_COURS\"));\n        System.out.println(\"TERMINEE : \" + compterParStatut(statuts, \"TERMINEE\"));\n    }\n}\n",
        tests: [{ input: "OUVERTE TERMINEE OUVERTE EN_COURS TERMINEE TERMINEE FIN\n", label: "six interventions" }, { input: "FIN\n", label: "aucune" }],
        solution: "s8_stat" },
      { type: "write", title: "Coût total des interventions", lvl: 2, file: "CoutTotal.java",
        statement: "<p>Lis un nombre n, puis n paires « prix des pièces (décimal) heures (entier) ». En utilisant une méthode <code>cout(double pieces, int heures)</code> (7500 FCFA de l'heure), affiche le total et l'intervention la plus chère, avec deux décimales :</p><p><code>Total : 70000.00 FCFA</code><br><code>Plus chère : 40000.00 FCFA</code></p>",
        starter: "import java.util.Scanner;\n\npublic class CoutTotal {\n    static final double TARIF = 7500;\n\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n\n    }\n}\n",
        tests: [{ input: "2\n25000 2\n15000 1\n", label: "deux interventions" }, { input: "3\n0 4\n12500.5 0\n8000 1\n", label: "trois interventions" }, { input: "0\n", label: "aucune" }],
        solution: "s8_total" },
      { type: "write", title: "Refuser les doublons", lvl: 2, file: "Doublons.java",
        statement: "<p>Lis n, puis n identifiants. Mets chacun en majuscules ; s'il est déjà dans la liste, affiche <code>PC-01 refusé (doublon)</code>, sinon ajoute-le et affiche <code>PC-01 ajouté</code>. Termine en affichant la liste.</p>",
        starter: "import java.util.ArrayList;\nimport java.util.Scanner;\n\npublic class Doublons {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        ArrayList<String> ids = new ArrayList<>();\n        int n = sc.nextInt();\n\n    }\n}\n",
        tests: [{ input: "4\npc-01 PC-02 PC-01 imp-01\n", label: "un doublon" }, { input: "2\nsw-01 SW-01\n", label: "casse différente" }],
        solution: "s8_doublon", hint: "<p>Tu peux parcourir la liste avec une boucle, ou utiliser directement <code>ids.contains(id)</code>.</p>" }
    ],

    tp: {
      title: "Jalons du projet", duration: "6 h", deliverable: "code source + fiche + tests + démonstration",
      intro: "Avance jalon par jalon : chaque jalon se termine par un test qui passe. Les jalons 1 et 2 sont vérifiés automatiquement ici ; les jalons 3 et 4 se font dans ton IDE.",
      steps: [
        "H1 : relire les exigences F1 à F6 et choisir les facultatifs visés.",
        "H1 : dessiner le diagramme de classes et répartir le travail dans le groupe.",
        "Jalon 1 : Equipement et Intervention écrites et testées.",
        "Jalon 2 : Parc (ajout sans doublon, recherche, comptage) écrite et testée.",
        "Jalon 3 : menu et méthodes de saisie robustes ; F1 à F6 fonctionnent.",
        "Jalon 4 : tableau de scénarios de test rempli, bugs corrigés.",
        "Fiche explicative : une ligne par classe et par méthode.",
        "Répétition de la démonstration ; chacun sait expliquer chaque partie."
      ],
      parts: [
        { title: "Jalon 1 — Les classes métier", html: K.p("<b>Equipement</b> : id (mis en majuscules), type, marque, état ; <code>setEtat</code> n'accepte que EN_SERVICE, EN_PANNE, REFORME (en ignorant la casse) ; un état invalide au constructeur donne EN_SERVICE ; <code>toString</code> : <code>PC-01 Ordinateur Dell EN_SERVICE</code>. <b>Intervention</b> : équipement, description, date, statut (OUVERTE au départ, l'équipement passe EN_PANNE) ; <code>cloturer(prix, heures)</code> passe TERMINEE et remet l'équipement EN_SERVICE ; <code>cout()</code> = pièces + heures × 7500."),
          write: { file: "TestClasses.java", statement: "", starter: "class Equipement {\n\n}\n\nclass Intervention {\n\n}\n\npublic class TestClasses {\n    public static void main(String[] args) {\n        Equipement pc = new Equipement(\"pc-01\", \"Ordinateur\", \"Dell\", \"inconnu\");\n        System.out.println(pc);\n        Intervention i = new Intervention(pc, \"Clavier HS\", \"12/03/2026\");\n        System.out.println(pc.getEtat() + \" / \" + i.getStatut());\n        i.cloturer(12000, 1);\n        System.out.println(pc.getEtat() + \" / \" + i.getStatut() + \" / \" + i.cout());\n    }\n}\n",
            tests: [{ label: "test des deux classes" }], example: true, solution: "s8_j1" } },
        { title: "Jalon 2 — La classe Parc", html: K.p("<b>Parc</b> gère une <code>ArrayList&lt;Equipement&gt;</code> : <code>ajouter(e)</code> renvoie false si l'identifiant existe déjà (sans tenir compte de la casse) ; <code>rechercher(id)</code> renvoie l'équipement ou null ; <code>compter(etat)</code> ; <code>taille()</code>. Ici, Equipement est simplifiée (id et état)."),
          write: { file: "TestParc.java", statement: "", starter: "import java.util.ArrayList;\n\nclass Equipement {\n    private String id;\n    private String etat;\n\n    public Equipement(String id, String etat) {\n        this.id = id;\n        this.etat = etat;\n    }\n\n    public String getId() { return id; }\n    public String getEtat() { return etat; }\n    public String toString() { return id + \" (\" + etat + \")\"; }\n}\n\nclass Parc {\n\n}\n\npublic class TestParc {\n    public static void main(String[] args) {\n        Parc p = new Parc();\n        System.out.println(p.ajouter(new Equipement(\"PC-01\", \"EN_SERVICE\")));\n        System.out.println(p.ajouter(new Equipement(\"PC-02\", \"EN_PANNE\")));\n        System.out.println(p.ajouter(new Equipement(\"pc-01\", \"EN_PANNE\")));\n        System.out.println(p.ajouter(new Equipement(\"IMP-01\", \"EN_PANNE\")));\n        System.out.println(p.rechercher(\"imp-01\"));\n        System.out.println(p.rechercher(\"SW-01\"));\n        System.out.println(p.taille() + \" équipements, \" + p.compter(\"EN_PANNE\") + \" en panne\");\n    }\n}\n",
            tests: [{ label: "test de Parc" }], example: true, solution: "s8_j2", expl: "<code>println</code> d'un objet null affiche <code>null</code>." } },
        { title: "Jalon 3 — Menu et saisies", html: K.p("Dans ton IDE, écris la classe <code>GestionParc</code> : un Scanner et un Parc <code>static</code>, les méthodes <code>lireTexte</code>, <code>lireEntier(question, min, max)</code> et <code>lireMontant</code> (try/catch), une méthode par entrée du menu, et main avec la boucle <code>do-while</code> + <code>switch</code>. Compare ensuite avec le code complet du Cahier des charges.") + K.code(["public static void main(String[] args) {", "    int choix;", "    do {", "        afficherMenu();", "        choix = lireEntier(\"Votre choix : \", 0, 7);", "        switch (choix) {", "            case 1 -> ajouterEquipement();", "            case 2 -> afficherEquipements();", "            // … 3 à 7", "            case 0 -> System.out.println(\"Au revoir !\");", "        }", "    } while (choix != 0);", "}"]) },
        { title: "Jalon 4 — Tests et démonstration", html: K.p("Déroule les scénarios T1 à T10 du Cahier des charges et note le résultat. Pour chaque échec : reproduis-le, lis le message, corrige, reteste. Prépare ensuite le scénario de démonstration (une entrée clavier comme celle de l'exemple) et répète l'oral.") }
      ]
    },

    quiz: [
      { q: "L'enseignant demande : « Pourquoi vos attributs sont-ils private ? » La meilleure réponse :", o: ["Parce que c'est obligatoire", "Pour que les autres classes passent par des méthodes qui contrôlent les valeurs (encapsulation)", "Pour accélérer le programme", "Pour pouvoir les afficher"], a: 1, e: "Exemple concret : setEtat refuse un état inconnu." },
      { q: "« Que se passe-t-il si l'utilisateur tape une lettre au menu ? »", o: ["Le programme plante", "parseInt lève une NumberFormatException, attrapée : un message s'affiche et la question est reposée", "La lettre est convertie en 0", "Le menu se ferme"], a: 1, e: "C'est le rôle de lireEntier avec try/catch dans une boucle." },
      { q: "« Pourquoi une ArrayList plutôt qu'un tableau ? »", o: ["Elle est plus rapide", "Le nombre d'équipements n'est pas connu à l'avance : la liste grandit à chaque ajout", "Un tableau ne peut pas contenir d'objets", "Pour utiliser get"], a: 1, e: "Un tableau a une taille fixe." },
      { q: "« Comment fonctionne votre recherche par identifiant ? »", o: ["Elle trie la liste", "Elle parcourt la liste et compare chaque id avec equalsIgnoreCase ; elle renvoie l'équipement ou null", "Elle utilise ==", "Elle lit un fichier"], a: 1, e: "Recherche séquentielle, comparaison du contenu, null si absent." },
      { q: "« Pourquoi renvoyer null quand l'équipement n'est pas trouvé ? »", o: ["Par erreur", "Pour signaler l'absence ; l'appelant teste <code>if (e == null)</code> avant de l'utiliser", "Pour provoquer une exception", "Parce que Java l'impose"], a: 1, e: "Sans ce test, on aurait une NullPointerException." },
      { q: "« Ajoutez un état EN_REPARATION. » Où modifier le code ?", o: ["Dans main seulement", "Dans setEtat d'Equipement (la liste des états acceptés), puis éventuellement les statistiques", "Dans Scanner", "Partout"], a: 1, e: "La règle est centralisée dans setEtat : une seule modification." },
      { q: "« Le tarif horaire passe à 9000 FCFA. » Que faut-il changer ?", o: ["Chaque calcul", "La constante TARIF_HORAIRE uniquement", "Le constructeur", "Rien"], a: 1, e: "Intérêt d'une constante nommée." },
      { q: "« Que fait <code>static</code> devant <code>compteur</code> dans Intervention ? »", o: ["Le rend constant", "Il est partagé par toutes les interventions : il sert à numéroter", "Il le rend privé", "Rien"], a: 1, e: "Chaque nouvelle intervention incrémente le même compteur." },
      { q: "« Expliquez la différence entre Parc et GestionParc. »", o: ["Aucune", "Parc contient les données et les règles ; GestionParc gère le dialogue console (menu, saisies, affichage)", "GestionParc est la classe mère de Parc", "Parc est plus rapide"], a: 1, e: "Séparation des responsabilités." },
      { q: "« Votre programme affiche <code>Equipement@1b6d3586</code>. Pourquoi ? »", o: ["Bug de la JVM", "La méthode toString n'a pas été redéfinie (ou mal nommée)", "L'objet est null", "Il manque un import"], a: 1, e: "Il faut <code>public String toString()</code>, avec la bonne signature." },
      { q: "« Comment avez-vous testé votre application ? » La réponse attendue :", o: ["« Ça marche sur mon PC »", "Avec des scénarios écrits : cas normaux, cas limites et saisies invalides, et le résultat attendu de chacun", "On n'a pas eu le temps", "Le compilateur l'a testé"], a: 1, e: "Un tableau de scénarios est un livrable du projet." },
      { q: "« Pourquoi l'état de l'équipement change-t-il quand on clôture une intervention ? »", o: ["Par hasard", "L'intervention garde une référence vers l'objet Equipement et appelle sa méthode setEtat", "La liste est recopiée", "Le Scanner le modifie"], a: 1, e: "Deux variables, un même objet." }
    ],

    video: { src: "media/seance8.mp4", title: "du besoin à l'application", dur: 93, chapters: [[0, "Titre"], [5, "Les exigences"], [17, "Conception"], [30, "Planning"], [41, "Le cœur : le menu"], [53, "Un scénario"], [65, "Tester"], [76, "La soutenance"], [85, "À retenir"]] },
    youtube: [
      { t: "Projet Java console de gestion", src: "Recherche YouTube", d: "Exemples de projets console avec classes, ArrayList et menu.", q: "projet java console gestion ArrayList menu français" },
      { t: "Concevoir un diagramme de classes UML", src: "Recherche YouTube", d: "Passer d'un énoncé à des classes.", q: "diagramme de classes UML débutant exemple français" },
      { t: "Organiser un code Java en plusieurs fichiers", src: "Recherche YouTube", d: "Une classe par fichier dans IntelliJ, Eclipse ou VS Code.", q: "java plusieurs classes plusieurs fichiers IntelliJ projet français" }
    ],
    docs: [
      { t: "Learn Java (dev.java) — récapitulatif", src: "dev.java/learn", u: "https://dev.java/learn/", d: "Pour revoir une notion pendant le projet." },
      { t: "Classe ArrayList (Javadoc Java 21)", src: "docs.oracle.com", u: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayList.html", d: "Référence des méthodes de liste." },
      { t: "Lesson: Exceptions", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html", d: "Pour renforcer la gestion des saisies." }
    ],
    memo: {
      cards: [
        ["Pondération du projet", "Le projet compte pour <b>35 %</b> de la note finale (TD 20 %, contrôle individuel 25 %, examen final 20 %)."],
        ["Grille indicative (35 points)", "Fonctionnalités minimales opérationnelles : <b>12</b> · variables, conditions, boucles et méthodes : <b>7</b> · modélisation par classes et objets : <b>6</b> · tests, gestion des erreurs et présentation : <b>5</b> · explication individuelle du code : <b>5</b>."],
        ["Livrables", "Code source commenté avec parcimonie · fiche courte expliquant classes et méthodes · scénarios de test · démonstration orale."],
        ["Principe d'équité", "Un projet collectif ne dispense pas d'une vérification individuelle : l'enseignant peut demander à chacun de modifier une petite fonctionnalité ou d'expliquer une méthode."],
        ["Avant la soutenance", "Le programme compile et se lance sur la machine de démo · le scénario est prêt · chacun connaît chaque classe · la fiche et les tests sont imprimés ou partagés."],
        ["Pendant l'oral", "Montre d'abord que ça marche, puis explique. Si une question te bloque, relis le code à voix haute ligne par ligne : c'est souvent là que la réponse apparaît."]
      ],
      code: ["// Squelette de l'application", "class Equipement   { /* données d'un matériel + setEtat contrôlé */ }", "class Intervention { /* équipement, statut, cloturer(), cout() */ }", "class Parc         { /* ArrayList, ajouter, rechercher, compter */ }", "public class GestionParc {", "    // Scanner, Parc, lireTexte / lireEntier / lireMontant", "    // afficherMenu + une méthode par fonctionnalité", "    // main : do { menu; choix; switch } while (choix != 0);", "}"], codeTitle: "Architecture du projet",
      glossary: [["Cahier des charges", "Description du besoin et des fonctionnalités attendues."], ["Exigence", "Fonctionnalité précise à réaliser (F1 à F6)."], ["Jalon", "Étape intermédiaire vérifiable du projet."], ["Scénario de test", "Suite d'actions avec le résultat attendu."], ["Cas limite", "Valeur à la frontière de ce qui est permis (0, maximum, texte vide)."], ["Classe métier", "Classe qui représente une notion du domaine (Equipement, Intervention)."], ["Interface utilisateur", "Partie du programme qui dialogue avec l'utilisateur (ici, la console)."], ["Démonstration", "Présentation de l'application qui fonctionne, avec un scénario préparé."]],
      selfcheck: ["Mon application réalise F1 à F6 sans planter.", "Je sais dessiner et expliquer le diagramme de classes.", "Je sais expliquer chaque méthode de la classe que j'ai écrite, et celles des autres.", "J'ai testé les saisies invalides et les cas limites.", "Mon tableau de scénarios de test est rempli.", "Je suis capable de modifier une petite fonctionnalité en direct."],
      next: "Bravo, tu as parcouru tout le cours. Pour aller plus loin : interfaces graphiques (JavaFX), bases de données (JDBC), tests automatisés (JUnit) et l'ouvrage <i>Effective Java</i> de Joshua Bloch, cité dans la bibliographie."
    }
  };
})();
