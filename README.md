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

La génération tente d'abord le modèle sélectionné, puis bascule automatiquement vers les autres modèles du tableau `models` dans `app.js` en cas de timeout, surcharge ou indisponibilité temporaire. Les identifiants Gemini évoluent : vérifier périodiquement la documentation Google et mettre à jour ce tableau si un modèle est déprécié.
