# Marlyt_nails — Onglerie à Brest

Site vitrine d'une page, en HTML / CSS / JavaScript pur (aucune étape de build).
Animations : GSAP + ScrollTrigger et Lenis, hébergés dans `vendor/`.

## Lancer en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

N'importe quel hébergement de fichiers statiques convient (GitHub Pages, Netlify, OVH…).

## Structure

```
index.html        contenu, SEO, données structurées LocalBusiness (NailSalon)
css/styles.css    jetons de teintes, composants, responsive, mouvement réduit
js/main.js        loader, nuancier du hero, pins, avis, horaires, micro-interactions
vendor/           gsap, ScrollTrigger, Lenis (versions figées)
fonts/            Caprasimo + Hanken Grotesk, hébergées localement
assets/img/       les 5 photos du studio (agrandies x3, provenance dans les métadonnées)
PRODUCT.md        contexte produit confirmé
DESIGN.md         système de design (« Le Nuancier »)
```

## Ce qu'il reste à compléter (rien n'a été inventé)

| Sujet | Où | Remarque |
| --- | --- | --- |
| **Tarifs** | cartes de `#prestations` dans `index.html` | aucun prix fourni : à ajouter dans chaque carte |
| **Liste des prestations** | idem | déduite des photos et des avis : à valider |
| **Chiffres clés** | `#chiffres`, attributs `data-count` | actuellement vérifiables : 5 jours, 31 h (calculées sur les horaires), 10 ongles. Remplaçables par années d'expérience, nombre de clientes… |
| **Photos haute définition** | `assets/img/` | les originaux font ~200 px de large ; envoyer les fichiers d'origine pour des images nettes sur écrans Retina |
| **Réseaux sociaux, e-mail** | pied de page | non fournis, donc absents |
| **Lien de réservation en ligne** | boutons `tel:` | tous les boutons appellent le 07 84 55 91 65 ; si un lien Planity / Instagram / WhatsApp existe, le brancher sur le bouton principal |
| **Image de partage** | `<head>` | ajouter `og:image` avec une URL absolue une fois le domaine connu |

## Horaires

À modifier à trois endroits : le tableau `.hours` dans `index.html` (affichage), la table `HOURS` dans `js/main.js` (statut « ouvert maintenant ») et le bloc JSON-LD dans le `<head>` (référencement).

## Accessibilité et mouvement

- Contraste AA vérifié pour chaque paire teinte / texte.
- Navigation clavier complète, lien d'évitement, focus visible, textes alternatifs.
- `prefers-reduced-motion` : pas de scroll lissé, pas de loader, pas de sections épinglées, marquee statique, avis sans défilement automatique.
- Sous 900 px : sections épinglées remplacées par des piles, prestations en défilement natif accroché, bouton d'appel flottant.
