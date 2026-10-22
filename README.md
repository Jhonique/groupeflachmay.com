# Groupe Flachmay

Site professionnel français de nettoyage résidentiel et commercial, réalisé à partir du projet ZIP fourni. HTML, CSS et JavaScript natifs, fonction Netlify pour le calcul et Netlify Forms pour les demandes. Aucun framework ni étape de compilation nécessaire.

## Développement local

Avec Node.js 22 et Netlify CLI, lancer `netlify dev --port 8889` dans le dossier racine. Le site statique est dans `public/`, les fonctions dans `netlify/functions/`. Le calculateur nécessite l’émulation des fonctions ; les formulaires doivent être vérifiés sur le déploiement Netlify.

## Tarification

`pricing.json` reprend les données jointes : 35 CAD/h standard, 45 CAD/h exigeant. Tous les autres tarifs restent à `null`. Un tarif manquant produit « Sur soumission », jamais un total partiel. Superficies entières en pi² ; pourcentages résidentiels appliqués au prix de base uniquement. Les résultats ne confirment ni taxes ni réservation. Les heures sont des heures de prestation ; préciser la politique par intervenant avant publication si nécessaire.

## Mise en service

Consulter `CONFIGURATION.md`. Le site est destiné à la prévisualisation Netlify et interdit l’indexation. Aucun DNS, MX, transfert de domaine ni configuration de messagerie n’a été modifié. Ne publier sur groupeflachmay.com qu’après autorisation explicite.

## Photographie

Photographie illustrative d’intérieur téléchargée depuis Unsplash (photo-1600210492486-724fe5c67fb0), stockée dans `public/img/interieur.jpg` et servie par Netlify Image CDN. Elle ne représente pas une intervention attestée de l’entreprise.
