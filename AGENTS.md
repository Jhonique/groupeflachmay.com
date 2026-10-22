# Architecture

Site statique sans compilation. `public/index.html` contient toute la page d’accueil et la définition réelle du formulaire Netlify ; `public/styles.css` gère les styles adaptatifs ; `public/app.js` gère les onglets, les appels au calculateur et les envois de demandes. `public/merci.html` confirme la réception sans confirmer une réservation. `public/confidentialite.html` décrit les traitements.

`netlify/functions/calculate.mjs` valide les données puis calcule côté serveur avec le fichier racine `pricing.json`, inclus dans le bundle par `netlify.toml`. Aucun prix manquant ne doit être remplacé sans confirmation du propriétaire. Les demandes persistent dans Netlify Forms, pas dans le navigateur ni dans un fichier local. Ne pas ajouter de base de données pour doubler ce stockage sans besoin explicite.

## Conventions

Contenu français canadien, devise CAD, surfaces en pi². JavaScript natif et API Web, pas de dépendances requises. Utiliser textContent pour les données de réponse. Maintenir les labels, états aria, erreurs, focus clavier et styles mobiles. Tout champ envoyé doit figurer dans le formulaire HTML détecté par Netlify. Les paramètres d’estimation sont informatifs ; ils ne sont jamais une preuve de prix contractuel.

## Décisions importantes

Prévisualisation uniquement : conserver X-Robots-Tag, robots.txt et meta robots tant que le propriétaire n’autorise pas la publication définitive. Ne pas modifier le domaine, les DNS ni les enregistrements de messagerie. Aucun avis, téléphone, adresse d’entreprise ou territoire desservi n’est inventé. Le fichier CONFIGURATION.md décrit les étapes restantes. La notification Forms doit être configurée après détection du formulaire et testée avec la vraie boîte de réception. Ne pas prétendre qu’un test a eu lieu sans résultat observé.
