# Grille d'évaluation jury 2026

Application statique pour accompagner un jury d'admission : saisie des observations, chronomètre, critères par programme et génération d'une synthèse via Google AI Studio.

## Utilisation

Ouvrir `index.html` dans un navigateur moderne. Aucune installation n'est nécessaire.

La clé API Google n'est pas stockée par l'application. Les notes et commentaires sont conservés localement dans le navigateur pour éviter une perte accidentelle lors d'un rafraîchissement.

## Structure

- `index.html` : structure sémantique de l'interface
- `styles.css` : thème, responsive design et états des composants
- `app.js` : logique de grille, persistance locale, chronomètre et appel API

## Points d'attention

Les identifiants de modèles Gemini peuvent évoluer. Mettre à jour le tableau `models` dans `app.js` si Google déprécie un modèle.
