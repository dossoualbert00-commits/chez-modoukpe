# Chez Modoukpè — Site Vitrine, Catalogue & Commande WhatsApp

Plateforme e-commerce et vitrine de **Chez Modoukpè** (*Import-Export + Dermocosmétique + Surprise Agency*) conçue en priorité pour les utilisateurs mobiles au **Bénin** et au **Niger**, avec conversion directe vers **WhatsApp (`+227 87 78 80 06`)** et espace d’administration sécurisé.

---

## 1. Installation & Démarrage local

```bash
# 1. Installer les dépendances
npm install

# 2. Copier la configuration d'environnement
cp .env.example .env

# 3. Lancer le serveur de développement (port 3000)
npm run dev
```

Pour générer le build de production :

```bash
npm run build
npm run start
```

---

## 2. Variables d'environnement

| Variable | Description | Défaut |
| :--- | :--- | :--- |
| `APP_URL` | URL canonique du site en production | `https://chezmodoukpe.com` |
| `ADMIN_EMAIL` | Adresse e-mail principale proposée pour l’admin | `modoukpebadjimou6@gmail.com` |
| `ADMIN_SECRET` | Clé secrète HMAC pour les cookies de session admin | Générée automatiquement si absente |
| `VITE_SITE_URL` | Domaine utilisé pour les liens produits et le sitemap | `https://chezmodoukpe.com` |
| `VITE_GA_MEASUREMENT_ID` | Identifiant Google Analytics 4 (ex. `G-XXXXXXXXXX`) | Optionnel (vide par défaut) |
| `VITE_META_PIXEL_ID` | Identifiant Meta Pixel Facebook/Instagram | Optionnel (vide par défaut) |

---

## 3. Guide de gestion des produits (pour le client non-technicien)

### Première connexion à l’espace Admin (`/admin`)
1. Rendez-vous sur `https://chezmodoukpe.com/admin` (ou cliquez sur **Admin** tout en haut de l’écran ou en bas du pied de page).
2. Lors de votre toute première visite, créez votre mot de passe administrateur (8 caractères minimum) associé à votre e-mail (`modoukpebadjimou6@gmail.com`).
3. Votre session est mémorisée de façon sécurisée.

### Ajouter ou modifier un produit et ses photos
1. Cliquez sur **Ajouter un produit** (ou sur l’icône crayon d’un produit existant).
2. Renseignez le **nom**, la **catégorie** (parmi les 7 catégories), la **description** et le **prix en FCFA** (ou cochez **« Prix Sur devis »** pour les articles personnalisés/importés sur mesure).
3. Pour la photo : cliquez sur **Importer une vraie photo** depuis votre téléphone ou ordinateur (PNG, JPG, WebP) — l’image est aussitôt enregistrée et affichée dans le catalogue.
4. Utilisez l’icône **Étoile** pour mettre un article en vedette sur la page d’accueil, et le bouton **Oui / Masqué** pour gérer la disponibilité.

### Suivre les demandes clients
Dans l’onglet **Demandes clients**, retrouvez toutes les demandes envoyées depuis *Import-Export*, *Personnalisation*, *Surprise Agency* et *Contact*. Vous pouvez changer leur statut (*Nouvelle*, *En cours*, *Traitée*) et répondre en un clic sur WhatsApp.

---

## 4. Déploiement

La plateforme fonctionne en serveur Node.js/Express unique (Cloud Run, VPS, Render, Railway ou Vercel Node Server) :
- Commande de build : `npm run build`
- Commande de démarrage : `npx tsx server.ts` (ou `npm run start` sur Node 22+)
- Les données persistées sont enregistrées automatiquement dans `data/modoukpe-db.json` et les photos importées dans `uploads/`.
