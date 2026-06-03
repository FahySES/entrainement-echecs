window.EM_PUZZLES = [
  {
    id: "mat1-001",
    categorie: "mate1",
    theme: "Mat en 1",
    niveau: "Débutant",
    fen: "6k1/5ppp/8/8/8/8/8/6KQ w - - 0 1",
    solution: "h1a8",
    explication: "La dame va en a8. Elle attaque le roi et les pièces noires bloquent toutes les fuites.",
    indice: "Cherche une diagonale longue vers le roi noir."
  },
{
  id: "mat1-004",
  categorie: "mate1",
  theme: "Mat en 1",
  niveau: "Débutant",
  fen: "4rrk1/p1p2ppp/5n2/8/5Q2/2P2q2/PP3PRP/RNB4K b - - 0 1",
  solution: "e8e1",
  explication: "",
  indice: "Cherche une tour qui peut atteindre la première rangée."
},
{
  id: "mat1-003",
  categorie: "mate1",
  theme: "Mat en 1",
  niveau: "Débutant",
  fen: "8/1r4kp/p5p1/4q3/PQ6/7P/2pp2P1/5R1K w - - 0 1",
  solution: "b4f8",
  explication: "",
  indice: "Cherche une case où la dame peut donner échec tout en contrôlant les cases de fuite du roi."
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
    explication: "La dame se rapproche sans être prenable et enferme le roi.",
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
{
id: "mat1-195",
categorie: "mate1",
theme: "Mat en 1",
niveau: "Débutant",
fen: "3qr3/2p1k3/8/2N1P3/8/8/6Q1/7K w - - 0 1",
solution: "g2g5",
explication: "",
indice: "La dame doit donner échec sur une diagonale."
},
{
id: "mat1-196",
categorie: "mate1",
theme: "Mat en 1",
niveau: "Débutant",
fen: "rn1q1b1r/ppp1kBpp/3p4/4N3/8/2P5/PPP2PPP/R1Bb1RK1 w - - 0 1",
solution: "c1g5",
explication: "",
indice: "Le fou blanc peut exploiter la diagonale vers le roi."
},
{
id: "mat1-197",
categorie: "mate1",
theme: "Mat en 1",
niveau: "Débutant",
fen: "3q1b1r/4kBpp/3p4/4N3/8/2N5/5PPP/6K1 w - - 0 1",
solution: "c3d5",
explication: "",
indice: "Un saut de cavalier ferme toutes les cases."
},
{
id: "mat1-198",
categorie: "mate1",
theme: "Mat en 1",
niveau: "Débutant",
fen: "1r1q1r1k/6pp/5p2/4N3/2B5/8/1PP5/2K4R w - - 0 1",
solution: "e5g6",
explication: "",
indice: "Le cavalier profite d’un clouage sur la colonne h."
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
  id: "mat2-1162",
  categorie: "mate2",
  theme: "Mat en 2",
  niveau: "Guidé",
  fen: "5k2/4n2R/5NPP/4n3/7K/8/8/8 w - - 0 1",
  solution: ["h7f7", "e5f7", "g6g7"],
  explication: "La tour attire le cavalier noir en f7, puis le pion g donne mat.",
  indice: "La tour se sacrifie pour ouvrir une case de mat au pion."
},
  {
  id: "mat2-1186",
  categorie: "mate2",
  theme: "Mat en 2",
  niveau: "Guidé",
  fen: "1Q6/5kpn/5bN1/7P/8/2q4B/8/7K w - - 0 1",
  solution: ["b8g8", "f7g8", "h3e6"],
  explication: "Le sacrifice de dame permet d'attirer le roi.",
  indice: "La dame peut se sacrifier pour attirer le roi noir sur une case fatale."
},
  {
  id: "mat3-001",
  categorie: "mate3",
  theme: "Mat en 3",
  niveau: "Guidé",
  fen: "5rk1/5ppp/2BQ4/6n1/2PR4/5p1P/P5PK/4q3 w - - 0 1",
  solution: ["d6f8", "g8f8", "d4d8", "e1e8", "d8e8"],
  explication: "La dame se sacrifie pour attirer le roi noir, puis la tour force l'interposition de la dame avant de mater.",
  indice: "Commence par attirer le roi noir sur f8."
},
];

