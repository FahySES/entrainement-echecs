window.EM_PUZZLES = [
  {
    id: "mat1-001",
    categorie: "mate1",
    theme: "Mat en 1",
    niveau: "Débutant",
    fen: "6k1/5ppp/8/8/8/8/8/6KQ w - - 0 1",
    solution: "h1a8",
    explication: "La dame va en a8. Elle attaque le roi sur la diagonale et les pièces noires bloquent toutes les fuites.",
    indice: "Cherche une diagonale longue vers le roi noir."
  },
  {
    id: "mat1-002",
    categorie: "mate1",
    theme: "Mat en 1",
    niveau: "Débutant",
    fen: "k7/2K5/8/8/8/8/8/7R w - - 0 1",
    solution: "h1a1",
    explication: "La tour donne le mat sur la colonne a pendant que le roi blanc contrôle les cases de fuite.",
    indice: "La tour doit attaquer le roi sur sa colonne."
  },
  {
    id: "mat2-001",
    categorie: "mate2",
    theme: "Mat en 2",
    niveau: "Guidé",
    fen: "k7/8/KQ6/8/8/8/8/8 w - - 0 1",
    solution: ["b6c6", "a8b8", "c6b7"],
    explication: "La dame donne échec en c6, le roi noir est forcé en b8, puis Db7 mat.",
    indice: "Commence par un échec de dame qui force le roi vers b8."
  },
  {
    id: "pin-001",
    categorie: "tactic1",
    theme: "Clouage",
    niveau: "Débutant",
    fen: "4k3/4q3/8/8/8/8/4R3/4K3 w - - 0 1",
    solution: "e2e7",
    explication: "La tour capture la dame clouée devant le roi noir.",
    indice: "La pièce noire devant le roi ne peut pas vraiment bouger."
  },
  {
    id: "fork-001",
    categorie: "tactic1",
    theme: "Fourchette",
    niveau: "Débutant",
    fen: "8/4k3/8/8/3N3q/8/8/6K1 w - - 0 1",
    solution: "d4f5",
    explication: "Le cavalier donne échec et attaque la dame en h4.",
    indice: "Un cavalier peut attaquer deux cibles très éloignées."
  },
  {
    id: "discover-001",
    categorie: "tactic1",
    theme: "Attaque à la découverte",
    niveau: "Initiation",
    fen: "8/5k2/8/8/4B3/5N2/3K4/7q w - - 0 1",
    solution: "f3g5",
    explication: "Le cavalier libère la diagonale du fou vers la dame noire en h1.",
    indice: "Déplace la pièce qui bouche la diagonale du fou."
  },
  {
    id: "deflection-001",
    categorie: "tactic1",
    theme: "Déviation",
    niveau: "Initiation",
    fen: "4k3/4r3/8/8/8/8/4Q3/4K3 w - - 0 1",
    solution: "e2e7",
    explication: "La dame attire et élimine la tour qui protégeait la position noire.",
    indice: "Capture le défenseur principal."
  },
  {
    id: "endgame-q-001",
    categorie: "endgame",
    theme: "Roi + Dame contre Roi",
    niveau: "Débutant",
    fen: "7k/8/5KQ1/8/8/8/8/8 w - - 0 1",
    solution: "g6g7",
    explication: "La dame se rapproche sans être capturable et enferme le roi.",
    indice: "La dame doit être protégée par le roi."
  },
  {
    id: "endgame-r-001",
    categorie: "endgame",
    theme: "Roi + Tour contre Roi",
    niveau: "Débutant",
    fen: "7k/5K2/8/8/8/8/8/R7 w - - 0 1",
    solution: "a1h1",
    explication: "La tour donne le mat sur la première rangée, le roi blanc contrôlant les cases de fuite.",
    indice: "La tour doit attaquer horizontalement le roi enfermé au bord."
  },
  {
    id: "endgame-p-001",
    categorie: "endgame",
    theme: "Opposition Roi contre Roi + pion",
    niveau: "Initiation",
    fen: "8/8/8/3k4/3P4/3K4/8/8 w - - 0 1",
    solution: "d3e3",
    explication: "Le roi blanc garde l'opposition de biais et prépare l'avancée du pion.",
    indice: "Le roi doit rester actif devant son pion."
  }
];
