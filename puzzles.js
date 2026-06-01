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
    solution: "b6b7",
    explication: "La dame donne un baiser mortel au roi."
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
    active: false,
    commentaireValidation: "Désactivé : plusieurs coups de cavalier quittent f3 et libèrent l'attaque du fou sur la dame h1.",
    explication: "Le cavalier libère la diagonale du fou vers la dame noire en h1.",
    indice: "Déplace la pièce qui bouche la diagonale du fou."
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
  },
  {
id: "mat1-193",
categorie: "mate1",
theme: "Mat en 1",
niveau: "Débutant",
fen: "5rkr/8/8/8/8/8/8/1Q4K1 w - - 0 1",
solution: "b1g6",
explication: "",
indice: "Cherche une diagonale de la dame."
},
  {
id: "mat1-194",
categorie: "mate1",
theme: "Mat en 1",
niveau: "Débutant",
fen: "3bkr2/R7/8/7N/8/8/8/7K w - - 0 1",
solution: "h5g7",
explication: "",
indice: "Le cavalier peut attaquer le roi tout en étant protégé."
},
];
