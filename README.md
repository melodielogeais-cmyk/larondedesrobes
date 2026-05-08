# La Ronde des Robes — Site internet

Site vitrine statique pour la boutique **La Ronde des Robes** : robes de mariée et de soirée, toutes tailles, sur mesure.

> 🌹 Site offert avec amour. Ce guide est écrit pour une personne **non-technique** — pas de panique, tout est faisable !

---

## 📁 Ce qu'il y a dans ce dossier

```
la-ronde-des-robes/
├── index.html              ← La page principale du site
├── merci.html              ← Page affichée après l'envoi du formulaire
├── mentions-legales.html   ← Mentions légales (à compléter)
├── css/
│   ├── style.css           ← Toutes les couleurs et le style du site
│   └── responsive.css      ← Adaptations mobile / tablette
├── js/
│   └── main.js             ← Menu mobile, animations, formulaire
├── images/                 ← Toutes les photos du site
│   ├── logo.png            ← À remplacer par le vrai logo
│   ├── hero.jpg            ← Grande photo d'accueil
│   ├── histoire.jpg        ← Photo de la section histoire
│   └── robes/              ← (Pour la future galerie)
├── favicon.ico             ← Petite icône onglet navigateur
├── robots.txt              ← Pour Google
├── sitemap.xml             ← Plan du site pour Google
├── netlify.toml            ← Configuration Netlify
└── README.md               ← Ce fichier
```

---

## ✏️ 1. Modifier les textes du site

Tous les textes sont dans **`index.html`**. Ouvre-le avec un éditeur (VS Code, Notepad++, ou même TextEdit).

Pour t'y retrouver, le fichier est divisé en sections clairement annoncées par des commentaires comme :

```html
<!-- =============== HISTOIRE =============== -->
```

Les sections :

| Section dans le code | À quoi ça correspond |
|---|---|
| `<!-- HEADER / NAV -->` | Logo + menu en haut |
| `<!-- HERO -->` | Grande image d'accueil avec le titre |
| `<!-- HISTOIRE -->` | L'histoire de la fondatrice |
| `<!-- SERVICES -->` | Les 3 cartes (mariée / soirée / sur mesure) |
| `<!-- TÉMOIGNAGES -->` | Les avis clientes |
| `<!-- INFOS PRATIQUES -->` | Adresse, horaires, carte Google Maps |
| `<!-- CONTACT / FORMULAIRE -->` | Le formulaire de prise de RDV |
| `<!-- FOOTER -->` | Le bas de page |

⚠️ **Ne touche pas aux balises** (les trucs entre `< >`). Modifie seulement le texte qui se trouve entre.

---

## 🖼️ 2. Remplacer les images

Toutes les photos vont dans le dossier **`/images/`**.

Pour remplacer une image :

1. Prépare ta photo (idéalement optimisée — voir https://squoosh.app)
2. Renomme-la **exactement** comme l'ancienne (`hero.jpg`, `histoire.jpg`, `logo.png`)
3. Glisse-la dans le dossier `/images/` (elle remplacera l'ancienne)

**Tailles recommandées** :
- `logo.png` → 200×80 px, fond transparent
- `hero.jpg` → 1920×1080 px (paysage)
- `histoire.jpg` → 800×1000 px (portrait)
- `og-image.jpg` → 1200×630 px (pour le partage Facebook/Insta)

Tant qu'aucune image n'est ajoutée, le site affiche un joli rectangle rose pastel avec le nom de l'image attendue. Pas de panique si ça apparaît, c'est normal !

---

## 📞 3. Mettre à jour les infos de contact

Trois endroits à modifier :

### a) Dans `index.html`

Cherche **`[Adresse à compléter]`** et **`[Code postal — Ville]`** : remplace par les vraies infos.
Cherche **`[+33 0 00 00 00 00]`** : remplace par le vrai numéro de téléphone.
Cherche **`contact@larondedesrobes.fr`** : remplace par la vraie adresse email.

### b) Dans la balise Schema (en haut de `index.html`)

Tout en haut du fichier, cherche le bloc `"@type": "ClothingStore"`.
Remplace tous les `[À REMPLIR]` par les vraies infos (adresse, ville, code postal, téléphone, email, latitude/longitude).
Ces infos servent à Google pour bien référencer la boutique.

### c) Dans `mentions-legales.html`

Remplace tous les `[À compléter]` par les vraies infos (forme juridique, SIRET, nom de la fondatrice, etc.).

---

## 🗺️ 4. Mettre la vraie carte Google Maps

Dans `index.html`, cherche la balise `<iframe` dans la section Infos.

Pour générer la bonne carte :
1. Va sur https://www.google.com/maps
2. Cherche l'adresse de la boutique
3. Clique sur **Partager** → **Intégrer une carte** → copie le code
4. Remplace l'`iframe` existante par celle copiée (garde l'attribut `title=`).

---

## 🚀 5. Déployer sur Netlify

### Méthode "drag & drop" (la plus simple)

1. Va sur https://app.netlify.com
2. Crée un compte gratuit (avec ton email ou Google)
3. Sur le tableau de bord, fais glisser **tout le dossier** `la-ronde-des-robes` dans la zone "Drag and drop your site folder here"
4. Le site est en ligne en 30 secondes ! Netlify te donne une adresse temporaire (ex: `joyeux-rose-12345.netlify.app`)

### Brancher un vrai nom de domaine (`larondedesrobes.fr`)

1. Achète le domaine (chez OVH, Gandi, IONOS… environ 10–15 €/an)
2. Sur Netlify : **Site settings** → **Domain management** → **Add custom domain**
3. Suis les instructions pour configurer les DNS (Netlify guide pas à pas)
4. Le HTTPS (cadenas vert) est ajouté automatiquement par Netlify, gratuitement

---

## 📬 6. Activer Netlify Forms (recevoir les demandes par email)

Le formulaire de contact est **déjà configuré** pour Netlify Forms. Il suffit de :

1. Sur Netlify, va dans ton site → **Forms**
2. Tu verras la liste des messages reçus
3. Pour recevoir une **notification email à chaque message** :
   - Forms → **Settings & usage** → **Form notifications** → **Add notification**
   - Choisis **Email notification**
   - Saisis l'email où recevoir les demandes (celui de la maman 💌)
   - Sauvegarde

✅ C'est tout ! Chaque demande de RDV envoyée via le formulaire arrivera directement par email.

---

## 🎨 Couleurs et polices (pour les curieux)

Si tu veux ajuster la palette, tout est dans `css/style.css` tout en haut :

```css
:root {
  --rose-framboise: #E33074;   /* couleur principale */
  --rose-moyen:     #ED5887;
  --rose-vif:       #FF8BB6;
  --rose-pastel:    #FFC2CE;
  --rose-poudre:    #FADADD;
  --texte:          #2C2C2C;
}
```

Change la valeur, sauvegarde, recharge la page : tout le site s'adapte.

---

## 🔒 Sauvegarde

Pense à garder une copie du dossier complet sur ton ordinateur (et sur un disque externe / Drive). Ça évite tout drame.

---

## ❓ En cas de pépin

- **Le site n'a pas l'air à jour ?** → Rafraîchis avec `Ctrl + F5` (Windows) ou `Cmd + Shift + R` (Mac), pour vider le cache.
- **Une image ne s'affiche pas ?** → Vérifie que le nom du fichier est strictement identique (majuscules, extension `.jpg` vs `.png`).
- **Le formulaire ne marche pas ?** → Il ne fonctionne **qu'une fois le site en ligne sur Netlify**, pas en local.

---

🌹 Bonne mise en ligne, et joyeux anniversaire à la fondatrice !
