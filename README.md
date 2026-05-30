# Entraînement tactique - Échiquier Mendois

Application web statique pour intégrer un entraînement d'échecs simple dans une page Blogger via iframe.

## Lancer localement

Le projet ne nécessite pas de build ni de backend.

```bash
python3 -m http.server 8080
```

Puis ouvrir :

```text
http://localhost:8080
```

## Fichiers

- `index.html` : structure de la page et chargement local de `chess.js`.
- `style.css` : design responsive vert foncé et blanc.
- `app.js` : logique de l'échiquier, validation des coups et compteur.
- `data/puzzles.js` : base locale des exercices.
- `vendor/chess.min.js` : copie locale de `chess.js` pour fonctionner sans CDN.

## Intégration Blogger

Héberger ce dossier sur un espace statique, par exemple GitHub Pages, Netlify, OVH ou le serveur du club, puis insérer ce code dans une page ou un article Blogger :

```html
<iframe
  src="https://votre-domaine.example/entrainement-echecs/"
  title="Entraînement tactique - Échiquier Mendois"
  style="width:100%; min-height:760px; border:0;"
  loading="lazy">
</iframe>
```

Pour une intégration plus compacte, ajuster `min-height` entre `680px` et `820px` selon la largeur de la colonne Blogger.

## Ajouter des exercices

Ajouter des objets dans `data/puzzles.js` avec cette structure :

```js
{
  id: "mat1-003",
  categorie: "mate1",
  theme: "Mat en 1",
  niveau: "Débutant",
  fen: "FEN ici",
  solution: "g6g7",
  explication: "Explication courte.",
  indice: "Indice court."
}
```

La solution peut aussi être une ligne guidée :

```js
solution: ["g6f6", "h8g8", "f6f7"]
```

## Évolutions prévues

`app.js` expose `window.EM_TRAINER_HOOKS` pour brancher plus tard :

- Stockfish pour analyser ou vérifier des finales.
- Un import de puzzles Lichess.
- Une génération automatique de positions.
