# Préparation de la publication définitive

Le code est préparé pour un déploiement de prévisualisation Netlify. La publication et les tests distants ne sont pas attestés par cette livraison. Le site existant et la messagerie du domaine restent indépendants.

## Tarifs à faire confirmer

Compléter dans `pricing.json` : toutes les tranches résidentielles, supplément salle de bain, pourcentages grand ménage et déménagement, chaque option, tarifs commerciaux régulier et approfondi par pi² et minimum par visite. Confirmer la politique de taxes et l’unité exacte des heures facturées. Mettre les libellés publics et les tarifs horaires affichés à jour si les montants changent.

## Formulaires et notifications

La détection Netlify Forms a été activée par le marqueur d’activation. Après déploiement, vérifier que `soumission-flachmay` apparaît dans Forms. Dans les notifications de soumission, ajouter une notification courriel à `flachmay@groupeflachmay.com`. Cela ne requiert aucune modification des enregistrements MX.

Envoyer une vraie demande d’essai depuis la prévisualisation : utiliser une adresse valide et une description complète ; vérifier la soumission dans Netlify, y compris le dossier spam, et vérifier sa réception effective dans la boîte professionnelle et ses indésirables. Vérifier le Reply-To en répondant à l’expéditeur. Aucun message de confirmation automatique au client n’est configuré. Ne pas annoncer un système de courriel testé avant ce contrôle effectif.

## Vérifications avant autorisation du domaine

- Horaires : 3 h standard = 105 CAD ; 3 h exigeant = 135 CAD ; 0,25 h standard = 8,75 CAD ; 24 h exigeant = 1 080 CAD. Une option non tarifée doit masquer le total et afficher « Sur soumission ».
- Résidentiel : tester les bornes 499/500, 749/750, 999/1000, 1249/1250, 1499/1500, 1999/2000 pi². Avec la configuration actuelle, chaque cas est incomplet. Tester les suppléments et arrondis après validation des prix.
- Commercial : vérifier superficie × tarif, minimum par visite et options après configuration. Actuellement, aucun total commercial ne doit apparaître.
- Rejeter superficies nulles, négatives ou fractionnaires, salles de bain invalides, heures hors limites, options et niveaux inconnus. Vérifier les réponses 400/405 et les erreurs réseau.
- Contrôler formulaire incomplet, courriel invalide, consentement obligatoire, date passée, soumission réussie et échec réseau. Vérifier la conservation des champs et le statut en attente dans Netlify.
- Vérifier l’affichage et la navigation au clavier sur téléphones 360/390 px, tablette 768 px et ordinateur, ainsi que les images, le zoom et l’absence de débordement.

Ces scénarios constituent le protocole à exécuter ; ils n’ont pas été exécutés dans cette session. La validation de compilation est prise en charge par la plateforme.

## SEO et Google

Le titre, la description, les métadonnées de partage, le français et les données structurées Organization sont présents sans coordonnées inventées. Confirmer le territoire desservi, les coordonnées publiques, les mentions légales, les règles d’annulation et les conditions de conservation des données avant ouverture commerciale.

Après autorisation de la mise en ligne : préparer un sitemap avec les URLs définitives, ajouter la balise canonique `https://groupeflachmay.com/`, retirer les blocages dans `netlify.toml`, `public/robots.txt` et les balises robots des pages publiques. Garder la page de remerciement hors index. Vérifier les redirections www/HTTPS après basculement autorisé.

Search Console : demander au propriétaire son accès ou son jeton de validation. Préférer une propriété préfixe d’URL et un fichier HTML ou une balise de validation pour éviter une modification DNS avant autorisation. Soumettre le sitemap après le basculement.

Google Business : obtenir le lien exact de la fiche et l’accès autorisé. Ajouter alors ce lien réel au site et aux données structurées ; renseigner le site définitif dans la fiche après accord. Aucun lien de fiche ni avis n’a été inventé.

## Domaine et messagerie

Ne pas connecter ni rediriger groupeflachmay.com avant autorisation explicite. Conserver les enregistrements MX, SPF, DKIM et DMARC existants. Préparer et faire approuver le changement DNS séparément après validation de la prévisualisation et des courriels.
