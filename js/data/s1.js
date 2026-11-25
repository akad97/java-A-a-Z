(function () {
  var P = COURSE.progs;
  COURSE.seances.push({ id: "s1", tag: "S-01", short: "Premier programme" });

  P.s1_hello = { file: "HelloWorld.java", lab: "HelloWorld", code:
`public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Bonjour, Java !");
    }
}
` };
  P.s1_affichage = { file: "Affichage.java", lab: "Affichage (print / println)", code:
`public class Affichage {
    public static void main(String[] args) {
        System.out.print("PC-");
        System.out.print("042");
        System.out.println(" : en panne");
        System.out.println("Technicien : Awa");
        System.out.println();
        System.out.println("Fin du rapport");
    }
}
` };
  P.s1_etiquette = { file: "Etiquette.java", code:
`public class Etiquette {
    public static void main(String[] args) {
        System.out.println("Salle B12");
        System.out.print("Poste ");
        System.out.print("#");
        System.out.println(7);
        System.out.println("Etat : OK");
    }
}
` };
  P.s1_escape = { file: "Echappement.java", code:
`public class Echappement {
    public static void main(String[] args) {
        System.out.println("Code\\tEtat");
        System.out.println("PC-01\\t\\"OK\\"");
        System.out.print("Ligne A\\nLigne B\\n");
    }
}
` };
  P.s1_fiche = { file: "FicheEquipement.java", lab: "FicheEquipement (TP 1)", code:
`// TP 1 - Fiche d'un équipement du parc informatique
public class FicheEquipement {
    public static void main(String[] args) {
        System.out.println("==============================");
        System.out.println("   FICHE EQUIPEMENT");
        System.out.println("==============================");
        System.out.println("Identifiant : PC-042");
        System.out.println("Type        : Ordinateur portable");
        System.out.println("Marque      : Dell");
        System.out.println("Etat        : En panne");
        System.out.println("==============================");
    }
}
` };
  P.s1_menu = { file: "Menu.java", code:
`public class Menu {
    public static void main(String[] args) {
        System.out.println("+--------------------------------+");
        System.out.println("|   SERVICE INFORMATIQUE - MENU  |");
        System.out.println("+--------------------------------+");
        System.out.println("| 1. Ajouter un equipement       |");
        System.out.println("| 2. Afficher le parc            |");
        System.out.println("| 3. Rechercher par identifiant  |");
        System.out.println("| 0. Quitter                     |");
        System.out.println("+--------------------------------+");
    }
}
` };
  P.s1_tech = { file: "Technicien.java", code:
`public class Technicien {
    public static void main(String[] args) {
        System.out.println("*** TECHNICIEN ***");
        System.out.println("Nom    : Diallo");
        System.out.println("Prenom : Awa");
        System.out.println("Service: Maintenance");
        System.out.println("******************");
    }
}
` };
  P.s1_bug = { file: "Inventaire.java", lab: "Avec erreurs : Inventaire", code:
`public class Inventaire {
    public static void main(String[] args) {
        System.out.println("Inventaire du parc")
        System.out.println("Nombre de PC : 25");
        system.out.println("Nombre d'imprimantes : 4");
        System.out.println("Fin);
    }
}
` };

  COURSE.data.s1 = {
    hours: "3 h", split: "CM 2 h · TP 1 h", comp: "C1",
    h1: "Du code source à <em>l'exécution</em>",
    lede: "Découvrir Java et lancer son premier programme. Tu vas comprendre comment un fichier texte devient un programme qui tourne, puis écrire, compiler et exécuter ton premier programme Java.",
    hero: "pipeline",
    pipeline: [
      { c: "src", t: "HelloWorld.java", s: "code source", d: "<b>Le code source.</b> Un simple fichier texte que tu écris, lisible par un humain. Son extension est <code>.java</code> et son nom doit être celui de la classe." },
      { c: "tool", t: "javac", s: "compilateur", d: "<b>Le compilateur javac</b> (fourni par le JDK) lit ton fichier, vérifie qu'il respecte les règles de Java, puis le traduit. S'il trouve une erreur, il s'arrête et l'affiche avec le numéro de ligne." },
      { c: "byte", t: "HelloWorld.class", s: "bytecode", d: "<b>Le bytecode.</b> Le résultat de la compilation : un fichier <code>.class</code> écrit pour une machine imaginaire, la JVM. Il n'est lisible ni par toi, ni directement par le processeur." },
      { c: "out", t: "JVM → écran", s: "exécution", d: "<b>La JVM</b> (machine virtuelle Java), lancée par la commande <code>java</code>, lit le bytecode et le fait exécuter par ton processeur. Le résultat apparaît dans la console : <code>Bonjour, Java !</code>" }
    ],
    objectives: [
      "Expliquer le rôle du JDK, du compilateur javac, du bytecode et de la JVM",
      "Écrire, compiler et exécuter un premier programme Java",
      "Repérer la classe et le point d'entrée main d'un programme",
      "Afficher du texte avec print et println",
      "Lire un message d'erreur de compilation et corriger une erreur de syntaxe"
    ],
    anatomy: {
      code: [
        [["public", "pub1"], " ", ["class", "class"], " ", ["HelloWorld", "name"], " ", ["{", "ob1"]],
        ["    ", ["public", "pub2"], " ", ["static", "static"], " ", ["void", "void"], " ", ["main", "main"], ["(String[] args)", "args"], " ", ["{", "ob2"]],
        ["        ", ["System.out", "sysout"], ".", ["println", "println"], "(", ["\"Bonjour, Java !\"", "str"], ")", [";", "semi"]],
        ["    ", ["}", "cb2"]],
        [["}", "cb1"]]
      ],
      info: {
        pub1: ["public", "Rend la classe visible de partout. Une classe <code>public</code> doit être dans un fichier qui porte exactement son nom."],
        "class": ["class", "Mot-clé qui annonce : « ici commence une classe ». En Java, <b>tout le code vit dans une classe</b>."],
        name: ["HelloWorld", "Le nom de la classe, choisi par toi. Par convention il commence par une majuscule (style <i>PascalCase</i>). Le fichier doit s'appeler <code>HelloWorld.java</code>."],
        ob1: ["{ … }", "L'accolade ouvrante commence le <b>corps de la classe</b>. Elle est fermée par la dernière <code>}</code> du fichier. Les accolades vont toujours par paires."],
        pub2: ["public", "La méthode <code>main</code> doit être publique pour que la JVM puisse l'appeler depuis l'extérieur."],
        "static": ["static", "La méthode appartient à la classe elle-même : la JVM peut l'appeler sans créer d'objet. Tu comprendras pleinement ce mot en séance 6."],
        "void": ["void", "Le « type de retour » : <code>void</code> signifie que la méthode ne renvoie aucun résultat. Elle agit (ici, elle affiche) et c'est tout."],
        main: ["main", "<b>Le point d'entrée du programme.</b> Quand tu lances <code>java HelloWorld</code>, la JVM cherche cette méthode et exécute ses instructions, de haut en bas. Sans elle : « Main method not found »."],
        args: ["(String[] args)", "Le paramètre de <code>main</code> : un tableau de textes reçus au lancement. Tu ne l'utiliseras pas tout de suite, mais il est obligatoire dans la forme classique."],
        ob2: ["{ … }", "Début du <b>corps de la méthode main</b>. Toutes les instructions à exécuter se placent entre cette accolade et sa fermante."],
        sysout: ["System.out", "<code>System</code> est une classe fournie par Java ; <code>out</code> représente la <b>sortie standard</b>, c'est-à-dire la console. Attention : <code>S</code> majuscule, <code>out</code> en minuscules."],
        println: ["println", "Méthode qui affiche une valeur puis <b>passe à la ligne</b> (print line). Sa cousine <code>print</code> affiche sans passer à la ligne."],
        str: ["\"Bonjour, Java !\"", "Un <b>texte</b> (une chaîne de caractères, type <code>String</code>). Les guillemets droits <code>\"</code> marquent le début et la fin ; ils ne s'affichent pas."],
        semi: [";", "Le point-virgule <b>termine chaque instruction</b>, comme le point termine une phrase. L'oublier est l'erreur numéro 1 des débutants : <code>';' expected</code>."],
        cb2: ["}", "Fin de la méthode <code>main</code>. Quand la JVM arrive ici, le programme est terminé."],
        cb1: ["}", "Fin de la classe. Rien ne doit se trouver après cette accolade."]
      }
    },

    lesson: [
      { title: "Un langage de programmation, pour quoi faire ?", html:
        K.p("Un ordinateur exécute des instructions très simples, écrites en <b>langage machine</b> : des suites de 0 et de 1, propres à chaque type de processeur. Personne n'écrit un logiciel de gestion de parc informatique en binaire.",
          "Un <b>langage de programmation</b> comme Java permet d'écrire ces instructions sous une forme lisible par un humain, avec des mots et une grammaire précise. Un outil se charge ensuite de la traduction vers la machine.",
          "Java, créé en 1995 chez Sun Microsystems (aujourd'hui Oracle), fait partie des langages les plus utilisés au monde. Tu le croiseras partout dans le métier :") +
        K.tiles([["Applications d'entreprise", "Logiciels de gestion, banques, assurances, administrations : beaucoup de serveurs tournent en Java."], ["Android", "Java est le langage historique des applications Android, aux côtés de Kotlin."], ["Outils de développement", "Des IDE comme IntelliJ IDEA ou Eclipse sont eux-mêmes écrits en Java."], ["Cartes à puce", "Cartes SIM et cartes bancaires exécutent souvent de petites applications Java Card."], ["Données massives", "Hadoop, Kafka, Spark : de grands outils de traitement de données tournent sur la JVM."], ["Ton projet", "En séance 8, une application console de gestion du parc et des interventions."]]) },
      { title: "Du code source à l'exécution", html:
        K.p("Le bandeau en haut de page montre le trajet complet. Retiens les trois étapes :",
          K.ol(["<b>Écrire</b> le code source dans un fichier <code>HelloWorld.java</code>.", "<b>Compiler</b> avec <code>javac HelloWorld.java</code> : le compilateur vérifie le code et produit <code>HelloWorld.class</code>, qui contient du <b>bytecode</b>.", "<b>Exécuter</b> avec <code>java HelloWorld</code> : la <b>JVM</b> (Java Virtual Machine) lit le bytecode et le fait exécuter par le processeur."]),
          "Pourquoi cette étape intermédiaire ? Parce que le bytecode est le même partout. Windows, Linux et macOS ont chacun leur propre JVM, mais toutes comprennent le même <code>.class</code>. C'est la promesse de Java : <i>write once, run anywhere</i>, écrire une fois, exécuter partout.") +
        K.analogy("<b>Une analogie de technicien.</b> Tu rédiges une procédure de maintenance en français (le code source). Un traducteur la convertit dans une notation standard, comprise par tous les ateliers du réseau (le bytecode). Dans chaque atelier, un chef d'équipe local lit cette notation et la fait appliquer avec les outils du site (la JVM sur chaque système)."),
        check: { q: "Le processeur de ton PC peut-il exécuter directement le fichier HelloWorld.java ?", o: ["Oui, c'est un programme", "Non : il faut d'abord le compiler, puis la JVM exécute le bytecode", "Oui, mais seulement sous Windows"], a: 1, e: "Le <code>.java</code> est du texte. Il passe par javac (→ bytecode) puis par la JVM, qui le fait exécuter par le processeur." } },
      { title: "JDK, JRE, JVM : qui contient quoi ?", html:
        '<div class="nest"><h4>JDK<small>Java Development Kit, pour développer</small></h4><div class="chips"><span class="chip">javac</span><span class="chip">java</span><span class="chip">jshell</span><span class="chip">javadoc</span><span class="chip">jar</span></div>' +
        '<div class="nest"><h4>JRE<small>Java Runtime Environment, pour exécuter</small></h4><div class="chips"><span class="chip">bibliothèques standard : System, String, Scanner…</span></div>' +
        '<div class="nest"><h4>JVM<small>la machine virtuelle qui exécute le bytecode</small></h4></div></div></div>' +
        K.p("Le JDK contient le JRE, qui contient la JVM. <b>Pour programmer, installe un JDK</b> : tu auras tout. Depuis Java 11, Oracle ne propose plus de JRE séparé ; on installe simplement le JDK.") +
        K.note("Quelle version ?", "Choisis une version <b>LTS</b> (support à long terme) : <b>JDK 21</b> ou <b>JDK 25</b> (sortie en septembre 2025). Si ton établissement impose une version, utilise celle-là. Tous les exemples de ce cours fonctionnent avec les deux."),
        check: { q: "Ton collègue n'a que la JVM, sans JDK. Que peut-il faire ?", o: ["Compiler et exécuter", "Exécuter un .class déjà compilé, mais pas compiler", "Rien du tout"], a: 1, e: "La JVM exécute le bytecode. Pour compiler, il faut javac, qui n'est fourni que par le JDK." } },
      { title: "Anatomie de ton premier programme", html:
        K.p("Clique sur chaque morceau du programme pour savoir à quoi il sert.") + K.comp("anatomy") +
        K.warn("Les deux choses à repérer", "Dans tout programme Java : <b>la classe</b> (le contenant, ici <code>HelloWorld</code>) et <b>le point d'entrée</b> <code>main</code> (là où l'exécution commence). C'est le résultat attendu de cette séance.") +
        K.p("Essaie-le : le bouton ci-dessous exécute le programme dans le simulateur intégré.") + K.run("s1_hello"),
        check: { q: "Dans HelloWorld, quelle partie la JVM exécute-t-elle en premier ?", o: ["La ligne public class HelloWorld", "La première instruction dans main", "La dernière accolade"], a: 1, e: "La JVM entre par <code>main</code> et exécute ses instructions de haut en bas. La déclaration de classe n'est pas une instruction : elle définit un contenant." } },
      { title: "Les règles d'or de la syntaxe", html:
        K.table(["Règle", "Correct", "Incorrect"], [
          ["Java distingue majuscules et minuscules", "<code>System.out.println</code>", "<code>system.out.Println</code>"],
          ["Chaque instruction finit par un point-virgule", "<code>System.out.println(\"OK\");</code>", "<code>System.out.println(\"OK\")</code>"],
          ["Les accolades vont par paires", "<code>{ … }</code>", "<code>{ …</code> (sans fermeture)"],
          ["Les textes sont entre guillemets droits", "<code>\"Bonjour\"</code>", "<code>“Bonjour”</code> ou <code>Bonjour</code>"],
          ["Le fichier porte le nom de la classe publique", "<code>Poste.java</code> → <code>public class Poste</code>", "<code>poste.java</code> → <code>public class Poste</code>"]]) +
        K.p("<b>L'indentation</b> (les espaces en début de ligne) n'est pas obligatoire pour Java, mais elle est indispensable pour les humains : elle montre ce qui est à l'intérieur de quoi. Décale de 4 espaces à chaque <code>{</code>.", "<b>Les commentaires</b> sont ignorés par le compilateur. Ils servent à expliquer le code :") +
        K.code(["// Commentaire sur une ligne", "/* Commentaire", "   sur plusieurs lignes */", "System.out.println(\"Visible\"); // fin de ligne"]) },
      { title: "Afficher : print, println et caractères spéciaux", html:
        K.tiles([["<code>System.out.println(x)</code>", "Affiche <code>x</code> puis <b>passe à la ligne</b>. Sans rien entre les parenthèses : affiche une ligne vide."], ["<code>System.out.print(x)</code>", "Affiche <code>x</code> et <b>reste sur la même ligne</b>. L'affichage suivant se collera à la suite."]], "grid-2") +
        K.p("Dans un texte, la barre oblique inverse <code>\\</code> introduit un <b>caractère d'échappement</b> :") +
        K.table(["Séquence", "Effet", "Exemple"], [["<code>\\n</code>", "Retour à la ligne", "<code>\"Ligne A\\nLigne B\"</code>"], ["<code>\\t</code>", "Tabulation (alignement en colonnes)", "<code>\"Code\\tEtat\"</code>"], ["<code>\\\"</code>", "Guillemet dans un texte", "<code>\"Il a dit \\\"OK\\\"\"</code>"], ["<code>\\\\</code>", "Barre oblique inverse elle-même", "<code>\"C:\\\\Java\"</code>"]]) +
        K.run("s1_escape") +
        K.note("Bon réflexe", "Le symbole <code>+</code> colle des morceaux : <code>System.out.println(\"Poste \" + 7);</code> affiche <code>Poste 7</code>. Tu l'utiliseras beaucoup dès la séance 2, avec les variables.") +
        K.warn("Accents dans la console", "Selon la configuration de Windows, la console peut afficher <code>Ã©</code> ou <code>?</code> à la place d'un <code>é</code>. Le programme n'est pas faux : c'est un problème d'encodage du terminal. Pour éviter le souci au début, on écrit souvent les textes affichés sans accents (<code>Etat</code>, <code>equipement</code>).") },
      { title: "Installer et vérifier ton environnement", html:
        K.p(K.ol(["<b>Installe un JDK</b> 21 ou 25 : par exemple Eclipse Temurin (adoptium.net) ou l'Oracle JDK. Garde les options par défaut ; sous Windows, coche l'option qui configure la variable <code>PATH</code> si elle est proposée.", "<b>Ouvre un terminal</b> (Invite de commandes ou PowerShell sous Windows, Terminal sous macOS/Linux) et tape :"])) +
        K.term('<span class="pr">$</span> java -version\n<span class="dim">openjdk version "21.0.x" …</span>\n<span class="pr">$</span> javac -version\n<span class="dim">javac 21.0.x</span>') +
        K.p("Si tu obtiens <code>javac n'est pas reconnu en tant que commande interne</code> (Windows) ou <code>command not found</code>, le JDK n'est pas installé ou son dossier <code>bin</code> n'est pas dans le <code>PATH</code>. Réinstalle en cochant l'option PATH, puis rouvre le terminal.",
          "<b>Choisis un IDE</b> : IntelliJ IDEA (édition gratuite), Eclipse, ou VS Code avec l'« Extension Pack for Java ». Le syllabus conseille d'utiliser le même IDE pour toute la classe. L'IDE compile et exécute pour toi avec un bouton ▶, mais il utilise le JDK en coulisses.") +
        K.note("Raccourci utile", "Depuis Java 11, <code>java HelloWorld.java</code> compile et exécute un programme d'un seul fichier en une commande, sans créer de <code>.class</code>. Pratique pour tester, mais apprends d'abord les deux étapes : elles expliquent tout le reste.") +
        K.warn("Tu verras peut-être ailleurs", "Java 25 autorise une écriture simplifiée (<code>void main() { … }</code> sans classe visible). Ce cours utilise la forme classique, valable dans toutes les versions et attendue à l'examen.") },
      { title: "Lire un message d'erreur", html:
        K.p("Une erreur n'est pas un échec : c'est le compilateur qui t'aide. Un message de <code>javac</code> se lit toujours de la même façon :") +
        K.term('<span class="er">HelloWorld.java:3: error: \';\' expected</span>\n        System.out.println("Bonjour, Java !")\n                                             <span class="er">^</span>\n1 error') +
        K.tiles([["HelloWorld.java", "Le fichier concerné."], [":3", "La ligne. L'erreur est là ou juste avant."], ["';' expected", "La cause, en anglais. Le ^ pointe l'endroit exact."]]) +
        K.p("Les messages les plus fréquents en séance 1 (tous vérifiés avec javac) :") +
        K.table(["Message", "Cause probable", "Correction"], [
          ["<code>';' expected</code>", "Point-virgule oublié à la fin d'une instruction.", "Ajouter <code>;</code> à la fin de la ligne indiquée."],
          ["<code>unclosed string literal</code>", "Un texte ouvert par <code>\"</code> n'est pas refermé.", "Ajouter le guillemet fermant."],
          ["<code>cannot find symbol</code>", "Un nom inconnu : faute de frappe (<code>printn</code>), texte sans guillemets, mauvaise casse.", "Lire la ligne <code>symbol:</code> qui donne le nom fautif."],
          ["<code>package system does not exist</code>", "<code>system</code> écrit sans majuscule.", "Écrire <code>System</code>."],
          ["<code>reached end of file while parsing</code>", "Il manque au moins une accolade fermante <code>}</code>.", "Compter les <code>{</code> et les <code>}</code>."],
          ["<code>class X is public, should be declared in a file named X.java</code>", "Le nom du fichier ne correspond pas au nom de la classe.", "Renommer le fichier (ou la classe)."],
          ["<code>Error: Main method not found in class X</code>", "Erreur au lancement : <code>main</code> absente ou mal écrite (ex. <code>Main</code>).", "Écrire <code>public static void main(String[] args)</code>."]]) +
        K.note("Méthode", "1. Lis la <b>première</b> erreur. 2. Va à la ligne indiquée (et à celle d'avant). 3. Corrige. 4. Recompile. Une seule faute peut provoquer plusieurs messages : corriger la première en fait souvent disparaître d'autres.") }
    ],

    demos: [
      { type: "term" },
      { type: "stepper", title: "Exécution ligne par ligne", prog: "s1_affichage", intro: "Avance d'une instruction à la fois et regarde la console se remplir. Observe bien la différence entre <code>print</code> et <code>println</code>.",
        notes: {
          3: "<code>print</code> affiche <code>PC-</code> et <b>reste sur la même ligne</b> : le curseur attend juste après.",
          4: "Encore <code>print</code> : <code>042</code> se colle directement à la suite. Aucun espace n'est ajouté automatiquement.",
          5: "<code>println</code> affiche <code>&nbsp;: en panne</code> (l'espace du début est dans les guillemets) <b>puis passe à la ligne</b>.",
          6: "Nouvelle ligne de texte, puis retour à la ligne.",
          7: "<code>println()</code> sans rien entre les parenthèses : affiche <b>seulement un saut de ligne</b>, d'où la ligne vide.",
          8: "Dernier affichage. Ensuite, la JVM atteint la fin de <code>main</code> : le programme se termine." } },
      { type: "lab" }
    ],

    exercises: [
      { type: "predict", title: "Prédire l'affichage", lvl: 1, prog: "s1_etiquette",
        hint: "Repère d'abord chaque <code>println</code> : c'est là que les lignes se terminent. Combien y en a-t-il ?",
        expl: "Ligne 3 : <code>println</code> affiche <code>Salle B12</code> puis passe à la ligne. Lignes 4 et 5 : deux <code>print</code> collent <code>Poste </code> et <code>#</code> sur la même ligne (l'espace vient des guillemets de <code>\"Poste \"</code>). Ligne 6 : <code>println(7)</code> affiche 7 <b>à la suite</b> puis passe à la ligne. On obtient donc 3 lignes." },
      { type: "hunt", title: "Chasse aux erreurs de syntaxe", lvl: 2, code: P.s1_bug.code.replace(/\n$/, "").split("\n"), bad: [3, 5, 6],
        fixes: {
          3: { msg: "Inventaire.java:3: error: ';' expected", fr: "Le point-virgule manque à la fin de l'instruction.", fix: "        System.out.println(\"Inventaire du parc\");" },
          5: { msg: "Inventaire.java:5: error: package system does not exist", fr: "Java est sensible à la casse : <code>system</code> ≠ <code>System</code>. Java croit que <code>system</code> est un « paquetage » inconnu.", fix: "        System.out.println(\"Nombre d'imprimantes : 4\");" },
          6: { msg: "Inventaire.java:6: error: unclosed string literal", fr: "Le texte commence par <code>\"</code> mais le guillemet fermant manque : Java ne sait pas où finit la chaîne.", fix: "        System.out.println(\"Fin\");" } },
        order: "Fait réel, vérifié avec javac : au premier essai, le compilateur n'affiche que les erreurs des lignes 3 et 6. Une fois ces deux-là corrigées, il découvre celle de la ligne 5. Moralité : corrige les erreurs <b>dans l'ordre, du haut vers le bas</b>, puis recompile." },
      { type: "parsons", title: "Remettre le programme dans l'ordre", lvl: 1,
        goal: "Remets les lignes dans l'ordre pour obtenir un programme qui compile et affiche la fiche du poste PC-042.",
        lines: ["public class FichePoste {", "    public static void main(String[] args) {", "        System.out.println(\"== FICHE POSTE ==\");", "        System.out.println(\"Identifiant : PC-042\");", "        System.out.println(\"Etat : en service\");", "    }", "}"],
        hint: "De l'extérieur vers l'intérieur : d'abord la classe, puis <code>main</code>, puis les instructions, puis les accolades fermantes dans l'ordre inverse de leur ouverture.",
        note: "Les trois println gardent cet ordre pour que la fiche s'affiche correctement." },
      { type: "match", title: "Qui fait quoi ?", lvl: 1,
        items: [{ k: "HelloWorld.java", a: "src" }, { k: "javac", a: "comp" }, { k: "HelloWorld.class", a: "byte" }, { k: "java HelloWorld", a: "run" }, { k: "JDK", a: "jdk" }, { k: "IDE", a: "ide" }],
        choices: [{ v: "src", t: "Fichier texte du code source, écrit par le programmeur" }, { v: "comp", t: "Compilateur : vérifie le code et produit le bytecode" }, { v: "byte", t: "Bytecode, exécutable par la JVM" }, { v: "run", t: "Commande qui démarre la JVM et exécute le programme" }, { v: "jdk", t: "Kit qui contient javac, java, les bibliothèques et la JVM" }, { v: "ide", t: "Logiciel pour écrire, lancer et déboguer confortablement" }] },
      { type: "mcq", title: "Lire des messages d'erreur", lvl: 2, intro: "Voici quatre vrais messages produits par Java. Pour chacun, choisis la bonne réaction.",
        items: [
          { term: "Bonjour.java:1: error: class Accueil is public, should be declared in a file named Accueil.java\npublic class Accueil {\n       ^\n1 error", q: "Que faut-il faire ?", o: ["Renommer le fichier en Accueil.java (ou la classe en Bonjour)", "Ajouter un point-virgule ligne 1", "Supprimer le mot public", "Réinstaller le JDK"], a: 0, e: "Une classe <code>public</code> nommée <code>Accueil</code> doit être dans <code>Accueil.java</code>, majuscules comprises." },
          { term: "Rapport.java:4: error: cannot find symbol\n        System.out.printn(\"OK\");\n                  ^\n  symbol:   method printn(String)\n  location: variable out of type PrintStream\n1 error", q: "Quelle est la cause ?", o: ["Le texte \"OK\" est mal écrit", "Faute de frappe : printn au lieu de println", "Il manque une accolade", "La classe Rapport n'existe pas"], a: 1, e: "<code>cannot find symbol</code> signifie « je ne connais pas ce nom ». La ligne <code>symbol: method printn(String)</code> indique le nom inconnu." },
          { term: "Poste.java:5: error: reached end of file while parsing\n}\n ^\n1 error", q: "Que signifie ce message ?", o: ["Le fichier est vide", "Il manque un point-virgule ligne 5", "Il manque au moins une accolade fermante }", "La ligne 5 est trop longue"], a: 2, e: "javac est arrivé à la fin du fichier en attendant encore une <code>}</code>." },
          { term: "$ java Poste.class\nError: Could not find or load main class Poste.class\nCaused by: java.lang.ClassNotFoundException: Poste.class", q: "Comment corriger la commande ?", o: ["javac Poste.class", "java Poste", "java Poste.java.class", "run Poste"], a: 1, e: "La commande <code>java</code> attend le <b>nom de la classe</b>, sans extension." }] },
      { type: "predict", title: "Caractères d'échappement", lvl: 2, prog: "s1_escape", loose: true,
        statement: "Qu'affichent ces trois instructions ? Pour une tabulation, tape simplement quelques espaces : la vérification les accepte.",
        expl: "<code>\\t</code> insère une tabulation, <code>\\\"</code> affiche un guillemet sans fermer le texte, et <code>\\n</code> provoque un retour à la ligne <b>au milieu</b> du texte : la troisième instruction affiche donc deux lignes, même si c'est un <code>print</code>." },
      { type: "write", title: "À toi d'écrire : la fiche technicien", lvl: 3, file: "Technicien.java",
        statement: "<p>Écris un programme <code>Technicien.java</code> qui affiche <b>exactement</b> la fiche ci-dessous (mêmes espaces, mêmes étoiles).</p>",
        example: true, starter: "public class Technicien {\n    public static void main(String[] args) {\n        // Écris ici les lignes qui affichent la fiche\n\n    }\n}\n",
        tests: [{ label: "affichage de la fiche" }], solution: "s1_tech",
        hint: "<p>Une instruction <code>System.out.println(\"…\");</code> par ligne affichée, dans l'ordre.</p>",
        expl: "Les espaces après <code>Nom</code> servent seulement à aligner les deux-points." }
    ],

    tp: {
      title: "TP 1 — Premier programme et affichage", duration: "1 h", deliverable: "fichier Java exécutable",
      intro: "Ce TP se fait <b>sur ton ordinateur, avec ton JDK</b>. Les parties B et D peuvent aussi être vérifiées ici. Coche chaque étape quand elle est faite.",
      steps: [
        "Crée un dossier <code>java-s1</code> pour tes fichiers de la séance.",
        "Vérifie ton installation : <code>java -version</code> et <code>javac -version</code> affichent un numéro de version.",
        "Crée le fichier <code>HelloWorld.java</code> et recopie le programme (à la main, sans copier-coller : tes doigts doivent apprendre la syntaxe).",
        "Compile avec <code>javac HelloWorld.java</code>. Vérifie qu'un fichier <code>HelloWorld.class</code> est apparu.",
        "Exécute avec <code>java HelloWorld</code>. Tu dois lire <code>Bonjour, Java !</code>",
        "Modifie le texte affiché, recompile, ré-exécute. Que se passe-t-il si tu ré-exécutes sans recompiler ?",
        "Crée <code>FicheEquipement.java</code> (partie B) et teste-le.",
        "Provoque volontairement les 5 erreurs de la partie C et note chaque message obtenu."
      ],
      parts: [
        { title: "Le programme de départ", html: K.code(P.s1_hello.code) + K.term('<span class="pr">$</span> javac HelloWorld.java\n<span class="pr">$</span> java HelloWorld\n<span class="okc">Bonjour, Java !</span>') +
          K.note("Question de l'étape 6", "Si tu modifies le <code>.java</code> sans recompiler, <code>java HelloWorld</code> affiche <b>l'ancien texte</b> : la JVM exécute le <code>.class</code>, qui n'a pas changé. Après chaque modification : recompiler.") },
        { title: "Fiche d'un équipement", html: K.p("Crée <code>FicheEquipement.java</code> pour obtenir exactement l'affichage ci-dessous, puis vérifie-le ici."),
          write: { file: "FicheEquipement.java", statement: "", example: true, starter: "public class FicheEquipement {\n    public static void main(String[] args) {\n\n    }\n}\n", tests: [{ label: "affichage de la fiche" }], solution: "s1_fiche", expl: "Les espaces après <code>Type</code>, <code>Marque</code> et <code>Etat</code> alignent les deux-points." } },
        { title: "Casse-le exprès", html: K.p("Sur une copie de <code>FicheEquipement.java</code>, provoque chaque erreur, compile, lis le message, puis répare.") +
          K.table(["Modification", "Ce que tu dois observer"], [["Supprime le <code>;</code> d'une ligne", "<code>';' expected</code>"], ["Renomme la classe en <code>Fiche</code> sans renommer le fichier", "<code>class Fiche is public, should be declared in a file named Fiche.java</code>"], ["Écris <code>system</code> au lieu de <code>System</code>", "<code>package system does not exist</code>"], ["Supprime la dernière accolade <code>}</code>", "<code>reached end of file while parsing</code>"], ["Écris <code>Main</code> au lieu de <code>main</code>, compile puis exécute", "Compilation réussie, puis au lancement : <code>Error: Main method not found</code>"]]) },
        { title: "Défi : le menu du service informatique", bonus: true, html: K.p("Affiche ce menu encadré. Il annonce le projet de fin de cours ; pour l'instant, il ne fait qu'afficher. Astuce : écris d'abord les lignes de bordure, puis ajuste les espaces pour aligner les <code>|</code> de droite."),
          write: { file: "Menu.java", statement: "", example: true, starter: "public class Menu {\n    public static void main(String[] args) {\n\n    }\n}\n", tests: [{ label: "menu encadré" }], solution: "s1_menu" } }
      ]
    },

    quiz: [
      { q: "Quel outil transforme <code>HelloWorld.java</code> en <code>HelloWorld.class</code> ?", o: ["La commande java", "Le compilateur javac", "L'IDE tout seul, sans JDK", "Le système d'exploitation"], a: 1, e: "C'est <code>javac</code>, le compilateur du JDK. L'IDE, lui, appelle javac pour toi quand tu cliques sur « Run »." },
      { q: "Que contient un fichier <code>.class</code> ?", o: ["Le code source, lisible", "Du code machine propre à ton processeur", "Du bytecode destiné à la JVM", "La documentation du programme"], a: 2, e: "Le <code>.class</code> contient du bytecode : des instructions pour la machine virtuelle Java, indépendantes du processeur et du système." },
      { q: "Pourquoi dit-on que Java est portable ?", o: ["Parce qu'il est installé sur tous les ordinateurs", "Parce que le même bytecode s'exécute sur toute machine qui a une JVM", "Parce que le code source est compilé pour chaque processeur", "Parce qu'il fonctionne sans système d'exploitation"], a: 1, e: "C'est le principe « Write once, run anywhere »." },
      { q: "Le fichier qui contient <code>public class Inventaire</code> doit s'appeler :", o: ["inventaire.java", "Inventaire.class", "Inventaire.java", "N'importe quel nom en .java"], a: 2, e: "Le nom du fichier doit être identique au nom de la classe publique, majuscule comprise." },
      { q: "Quelle commande exécute le programme compilé <code>Inventaire.class</code> ?", o: ["java Inventaire", "java Inventaire.class", "javac Inventaire", "run Inventaire.java"], a: 0, e: "On donne à <code>java</code> le nom de la classe, sans extension." },
      { q: "Quel en-tête de méthode permet à la JVM de démarrer le programme ?", o: ["public void main()", "public static void main(String[] args)", "public static void Main(String[] args)", "static int main(String args)"], a: 1, e: "La forme classique est exactement <code>public static void main(String[] args)</code>." },
      { q: "Qu'affiche ce code ?", code: ["System.out.print(\"A\");", "System.out.println(\"B\");", "System.out.print(\"C\");"], o: ["A B C sur trois lignes", "AB puis C sur la ligne suivante", "ABC sur une seule ligne", "A puis BC sur la ligne suivante"], a: 1, e: "<code>print(\"A\")</code> reste sur la ligne, <code>println(\"B\")</code> affiche B puis passe à la ligne, puis C." },
      { q: "Le message <code>Rapport.java:7: error: ';' expected</code> indique :", o: ["Un point-virgule en trop ligne 7", "Qu'il manque un point-virgule à la fin de l'instruction de la ligne 7", "Que la ligne 7 doit être supprimée", "Une erreur pendant l'exécution"], a: 1, e: "Format : <code>fichier:ligne: error: cause</code>. C'est une erreur de compilation : aucun <code>.class</code> n'est produit." },
      { q: "Pour développer en Java sur ton ordinateur, tu dois installer :", o: ["Un JDK (par exemple version 21 ou 25, LTS)", "Seulement la JVM", "Seulement un IDE", "Un navigateur web récent"], a: 0, e: "Le JDK contient tout : <code>javac</code>, <code>java</code>, les bibliothèques et la JVM." },
      { q: "<code>system.out.println(\"OK\");</code> compile-t-il ?", o: ["Oui, Java ignore les majuscules", "Non : Java est sensible à la casse, il faut System", "Oui, mais avec un avertissement", "Non, il faut écrire SYSTEM"], a: 1, e: "javac répond : <code>package system does not exist</code>." },
      { q: "Laquelle de ces lignes est un commentaire Java ?", o: ["# Affiche la fiche", "// Affiche la fiche", "&lt;!-- Affiche la fiche --&gt;", "' Affiche la fiche"], a: 1, e: "<code>//</code> commente la fin de la ligne ; <code>/* … */</code> commente un bloc." },
      { q: "Quelle instruction affiche exactement <code>Il a dit \"OK\"</code> ?", o: ["<code>System.out.println(\"Il a dit \"OK\"\");</code>", "<code>System.out.println(\"Il a dit \\\"OK\\\"\");</code>", "<code>System.out.println('Il a dit \"OK\"');</code>", "<code>System.out.println(Il a dit \"OK\");</code>"], a: 1, e: "Pour mettre un guillemet <b>dans</b> un texte, on l'échappe : <code>\\\"</code>." }
    ],

    video: { src: "media/seance1.mp4", title: "du code source à l'exécution", dur: 88, chapters: [[0, "Titre"], [5, "Le langage machine"], [14, "Étape 1 : écrire"], [25, "Étape 2 : compiler"], [37, "Lire une erreur"], [48, "Étape 3 : exécuter"], [59, "Write once, run anywhere"], [69, "JDK, JRE, JVM"], [80, "À retenir"]] },
    youtube: [
      { t: "Programmer en Java pour débutants : introduction", src: "Recherche YouTube", d: "Présentations du langage pour grands débutants, en français.", q: "programmer en java débutant introduction" },
      { t: "Installer le JDK et un IDE", src: "Recherche YouTube", d: "Installation pas à pas du JDK (21 ou 25) et d'IntelliJ, Eclipse ou VS Code.", q: "installer JDK Java IntelliJ tutoriel français" },
      { t: "javac, java, bytecode et .class", src: "Recherche YouTube", d: "Revoir la chaîne de compilation en ligne de commande.", q: "java compilation javac bytecode .class JVM français" }
    ],
    docs: [
      { t: "Learn Java — parcours officiel (dev.java)", src: "dev.java/learn", u: "https://dev.java/learn/", d: "Parcours d'apprentissage officiel, cité dans la bibliographie du syllabus (en anglais)." },
      { t: "The Java Tutorials — Getting Started", src: "docs.oracle.com", u: "https://docs.oracle.com/javase/tutorial/getStarted/index.html", d: "Le tutoriel historique d'Oracle : « Hello World! » expliqué en détail." },
      { t: "Télécharger un JDK gratuit (Eclipse Temurin)", src: "adoptium.net", u: "https://adoptium.net/", d: "Distribution OpenJDK gratuite, avec installeurs Windows, macOS et Linux." }
    ],

    memo: {
      cards: [
        ["Les 3 étapes", "<b>1. Écrire</b> <code>NomClasse.java</code><br><b>2. Compiler</b> <code>javac NomClasse.java</code> → <code>NomClasse.class</code><br><b>3. Exécuter</b> <code>java NomClasse</code> → la JVM lance <code>main</code>"],
        ["Afficher", "<code>println(x)</code> affiche puis passe à la ligne · <code>print(x)</code> reste sur la ligne · <code>println()</code> ligne vide · <code>\\n</code> retour à la ligne, <code>\\t</code> tabulation, <code>\\\"</code> guillemet · <code>+</code> colle des morceaux."],
        ["Règles d'or", "Sensible à la casse · <code>;</code> en fin d'instruction · accolades par paires · guillemets droits · fichier = classe publique."],
        ["Lire une erreur", "<code>Fichier.java:LIGNE: error: CAUSE</code> · corriger la première erreur, recompiler."]
      ],
      code: P.s1_hello.code, codeTitle: "Structure minimale à connaître par cœur",
      glossary: [["Code source", "Texte du programme écrit par le développeur, dans un fichier .java."], ["Compilateur (javac)", "Programme qui vérifie le code source et le traduit en bytecode."], ["Bytecode", "Code intermédiaire contenu dans les .class, exécuté par la JVM."], ["JVM", "Java Virtual Machine : exécute le bytecode sur un système donné."], ["JRE", "Java Runtime Environment : JVM + bibliothèques, de quoi exécuter."], ["JDK", "Java Development Kit : JRE + outils (javac…), de quoi développer."], ["IDE", "Environnement de développement intégré : IntelliJ IDEA, Eclipse, VS Code."], ["Classe", "Bloc qui contient le code ; en Java, tout est dans une classe."], ["main", "Méthode point d'entrée, appelée en premier par la JVM."], ["Instruction", "Ordre élémentaire, terminé par un point-virgule."], ["Console", "Fenêtre texte où s'affichent les résultats (sortie standard)."], ["Erreur de compilation", "Détectée par javac avant l'exécution : pas de .class produit."]],
      selfcheck: ["Je sais expliquer avec mes mots la différence entre JDK, JVM et bytecode.", "Je sais compiler et exécuter un programme en ligne de commande.", "Je sais montrer la classe et la méthode main dans un programme.", "Je connais la différence entre print et println.", "Je sais lire un message d'erreur : fichier, ligne, cause.", "J'ai réalisé le TP 1 (HelloWorld + FicheEquipement)."],
      next: "Séance 2 : variables, types et opérateurs. Tu calculeras le coût d'une intervention à partir du prix des pièces, du nombre d'heures et du tarif horaire."
    }
  };
})();
