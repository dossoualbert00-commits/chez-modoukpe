# Checklist de Recette — Chez Modoukpè

## 1. Mobile-first (360 px) & Accessibilité
- [ ] Aucun débordement horizontal à 360 px de largeur sur l’Accueil, le Catalogue et les Fiches produits.
- [ ] Tous les boutons d’action et onglets possèdent une zone tactile minimale de `44 × 44 px`.
- [ ] Contrastes WCAG AA respectés entre bleu marine `#0B2E6B`, bleu royal `#1558C0`, orange `#F26A1B` et fonds blancs/gris clairs.
- [ ] Toutes les images produits ont un attribut `alt` descriptif et un chargement différé `loading="lazy"`.
- [ ] Navigation clavier complète (focus visible, fermeture des modales et tiroirs).

## 2. Parcours client & Conversion WhatsApp
- [ ] Critère des 5 secondes : le Hero exprime clairement l’offre (Import-Export, Dermocosmétique, Surprise Agency) avec le slogan *« Plus qu'un magasin, une solution ! »*.
- [ ] Critère des 3 clics : Catégorie → Produit → *Commander sur WhatsApp* pré-remplit le nom du produit, variante, quantité, prix FCFA (ou *Sur devis*) et lien `https://chezmodoukpe.com/produit/...`.
- [ ] Panier léger : ajout de plusieurs articles, modification des quantités, choix pays Bénin / Niger, génération d’un seul message WhatsApp récapitulatif vers `+227 87 78 80 06`.
- [ ] Bouton WhatsApp flottant présent sur toutes les pages publiques (masqué sur `/admin`).

## 3. Formulaires & Base de données
- [ ] Formulaire **Import-Export** (`/import-export`) enregistre la demande via `POST /api/requests` et propose l’envoi WhatsApp + e-mail (`modoukpebadjimou6@gmail.com`).
- [ ] Formulaire **Personnalisation** (`/personnalisation`) gère l’aperçu local du logo, le texte, la quantité et le délai.
- [ ] Formulaire **Surprise Agency** (`/surprise-agency`) enregistre l’occasion, le budget, la ville et le message de carte.
- [ ] Catalogue initial de **24 produits** répartis sur les **7 catégories** disponible dès le premier démarrage.

## 4. Espace Admin (`/admin`)
- [ ] Première configuration protégée par hachage `scrypt` et cookie `HttpOnly` signé HMAC.
- [ ] Ajout, édition, suppression, bascule vedette/disponibilité et upload de photo fonctionnels et persistés après rechargement.
- [ ] Consultation et changement de statut des demandes clients.

## 5. SEO & Performance
- [ ] `GET /sitemap.xml` liste toutes les pages et les 24+ fiches produits sur `https://chezmodoukpe.com`.
- [ ] `GET /robots.txt` autorise l’indexation publique et exclut `/admin`.
- [ ] Balises Open Graph (`og:title`, `og:description`, `og:url`) et JSON-LD `LocalBusiness` + `Product` valides.
- [ ] Variables `VITE_GA_MEASUREMENT_ID` et `VITE_META_PIXEL_ID` prêtes sans erreur lorsqu’elles sont vides.
