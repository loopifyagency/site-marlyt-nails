---
name: Marlyt_nails
description: Le nuancier du studio : un présentoir de teintes à l'échelle du site, où choisir une teinte repeint la page.
colors:
  cerise: "#C8123F"
  fuchsia: "#C9187C"
  blanc-neige: "#FFF9FB"
  griotte: "#3B0716"
  dragee: "#FFD9E5"
  givre: "#E9E7EE"
  cerise-profond: "#B10F38"
  rose-griotte: "#FF8AAE"
  encre-douce: "#6E3B49"
typography:
  display:
    fontFamily: "Caprasimo, Gloock, Georgia, serif"
    fontSize: "clamp(3rem, 14.5vw, 16.5rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.022em"
  headline:
    fontFamily: "Caprasimo, Gloock, Georgia, serif"
    fontSize: "clamp(2.3rem, 5.6vw, 5.6rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.012em"
  title:
    fontFamily: "Caprasimo, Gloock, Georgia, serif"
    fontSize: "clamp(1.6rem, 2.2vw, 2.1rem)"
    fontWeight: 400
    lineHeight: 1.05
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.1em"
rounded:
  frame: "14px"
  card: "16px"
  tag: "3px"
  pill: "999px"
spacing:
  gutter: "clamp(20px, 4.4vw, 72px)"
  section: "clamp(104px, 12vw, 170px)"
  gap: "clamp(20px, 3vw, 44px)"
components:
  button-accent:
    backgroundColor: "{colors.cerise}"
    textColor: "{colors.blanc-neige}"
    rounded: "{rounded.pill}"
    padding: "0.95em 1.7em"
    height: "52px"
  button-accent-hover:
    backgroundColor: "{colors.griotte}"
    textColor: "{colors.blanc-neige}"
  button-light:
    backgroundColor: "{colors.blanc-neige}"
    textColor: "{colors.cerise}"
    rounded: "{rounded.pill}"
    padding: "0.95em 1.7em"
  tag-teinte:
    backgroundColor: "{colors.blanc-neige}"
    textColor: "{colors.griotte}"
    rounded: "{rounded.tag}"
    typography: "{typography.label}"
    padding: "0.42em 0.7em"
  card-prestation:
    backgroundColor: "{colors.blanc-neige}"
    textColor: "{colors.griotte}"
    rounded: "{rounded.card}"
    padding: "clamp(20px, 2vw, 28px)"
  blade-avis:
    backgroundColor: "{colors.cerise}"
    textColor: "{colors.blanc-neige}"
    rounded: "{rounded.card}"
    padding: "clamp(24px, 3.2vw, 46px)"
---

# Design System: Marlyt_nails

## Overview

**Creative North Star: "Le Nuancier"**

Un présentoir de teintes de manucure, agrandi à l'échelle d'un site. Chaque section est une teinte posée à plat, chaque numéro cite le nuancier, et choisir un échantillon repeint la page. Le système est chaleureux et féminin sans être sucré : la couleur est franche, la typographie est ronde et épaisse comme un gel brillant, et les photos de vraies mains sont les seules images.

La densité est généreuse : grands aplats, titres géants, beaucoup d'air, puis un détail précis (une étiquette de teinte, une goutte de vernis). Le mouvement est une couche ajoutée : tout est lisible sans lui.

**Key Characteristics:**
- Aplats pleins de six teintes, jamais de dégradé entre sections.
- Trois formes d'ongle (ovale, carré, amande) comme seuls masques.
- Étiquettes de teinte numérotées (N°01 à N°07) comme signature récurrente.
- Coutures de sections en bords de vernis qui coule.
- Display épais et rond, texte neutre et précis.

## Colors

Une palette imposée (cerise, fuchsia, blanc neige) étendue par trois teintes de nuancier tirées des photos réelles du studio : griotte (le rouge miroir), dragée (le rose pâle), givre (l'œil-de-chat argenté).

### Primary
- **Cerise** (#C8123F): rouge cerise brillant des ongles. Accent principal sur fond clair, aplat de la section « Cerise », boutons d'action, drip du loader.

### Secondary
- **Fuchsia** (#C9187C): énergie secondaire. Aplat de la galerie, étiquette « Fuchsia », barre de progression. Légèrement approfondi pour tenir le contraste AA avec le blanc neige.

### Tertiary
- **Dragée** (#FFD9E5): rose pâle. Aplat doux (savoir-faire, nous trouver), surface des disques décoratifs.

### Neutral
- **Blanc neige** (#FFF9FB): fond clair, texte sur aplats saturés. Volontairement un peu froid et rosé : jamais crème.
- **Griotte** (#3B0716): encre principale et aplat sombre. Remplace tout noir.
- **Givre** (#E9E7EE): gris-argent, section des chiffres.
- **Cerise profond** (#B10F38): accent sur dragée.
- **Rose griotte** (#FF8AAE): accent sur fond griotte.
- **Encre douce** (#6E3B49): texte secondaire sur blanc neige.

### Named Rules
**The One Shade Rule.** Chaque section prend exactement une teinte de fond et en tire tous ses rôles (fond, encre, accent, surface douce). On change de teinte à la couture, jamais au milieu d'une section.

**The Shade Number Rule.** Un « N° » cite toujours le nuancier : 01 Fuchsia, 02 Griotte miroir, 03 Dragée, 04 Cerise, 05 Givre, 06 Griotte, 07 Neige. Il ne numérote jamais des sections.

## Typography

**Display Font:** Caprasimo (avec Gloock, Georgia, serif)
**Body Font:** Hanken Grotesk (variable 300 à 800, avec system-ui)

**Character:** Caprasimo est rond, épais et brillant comme un gel ; Hanken Grotesk reste précis et neutre pour que le texte se lise vite sur téléphone. Le contraste de taille est extrême : titres géants contre texte courant.

### Hierarchy
- **Display** (400, clamp(3rem, 14.5vw, 16.5rem), 0.92): le mot-symbole « Marlyt_nails » (hero, pied de page).
- **Headline** (400, clamp(2.3rem, 5.6vw, 5.6rem), 0.98): titres de section, révélés mot par mot.
- **Title** (400, clamp(1.6rem, 2.2vw, 2.1rem), 1.05): noms de prestations, d'étapes, de clientes.
- **Body** (400, clamp(1rem, 0.96rem + 0.2vw, 1.125rem), 1.55): texte courant, mesure 34 à 62ch.
- **Label** (700, 0.75rem, 0.1em): étiquettes de teinte, numéros tabulaires.

### Named Rules
**The Tabular Tag Rule.** Les numéros de teinte et les chiffres animés utilisent des chiffres tabulaires pour ne pas bouger pendant le comptage.

## Layout

Gouttière fluide clamp(20px, 4.4vw, 72px). Sections pleine largeur, padding vertical généreux clamp(104px, 12vw, 170px). La galerie et le hero utilisent des compositions asymétriques (grille de 12 colonnes, échantillons en éventail) ; le texte reste sur une seule colonne. Deux sections sont épinglées sur desktop (savoir-faire, prestations en défilement horizontal) et redeviennent des piles ou un défilement natif sous 900 px et en mouvement réduit.

Les photos sources font environ 200 px de large : elles ne sont jamais affichées au-delà d'environ 340 px sur desktop, et toujours dans une découpe (ongle, arche).

## Elevation & Depth

Ombres douces, décalées vers le bas et floues, une seule par élément : `drop-shadow(0 16px 14px rgba(59, 7, 22, 0.2))` sur les échantillons, `0 28px 40px -22px` sur les cartes et cadres. La profondeur vient aussi de la parallaxe multicouche et du recouvrement (les gouttes de vernis passent devant la section suivante).

### Named Rules
**The One Elevation Rule.** Un élément porte soit une ombre, soit une bordure, jamais les deux. Aucune ombre dure ni halo coloré.

## Shapes

Trois découpes d'ongle (ovale, carré arrondi, amande), définies une fois comme `clipPath` normalisés et réutilisées pour échantillons, pastilles d'étape, photos de cartes et repères d'horaires. Cadres photo à 14 px, cartes à 16 px, arches (999px 999px 14px 14px) pour la galerie et la carte. Étiquettes suspendues à coins coupés (polygone à 6 sommets).

### Named Rules
**The Lacquer Seam Rule.** Une section en recouvre la suivante par un bord de gouttes dans sa propre teinte. Pas de séparateur droit.

## Components

### Buttons
- **Shape:** pilule (999px), 52 px de haut minimum, bordure 2 px.
- **Accent:** fond cerise (ou accent de la teinte), texte blanc neige.
- **Hover / Focus:** le remplissage monte depuis le bas (0,5 s, ease-out fort), le texte s'inverse ; `:active` réduit à 0,97. Les boutons principaux sont magnétiques.
- **Light / Ghost:** blanc neige sur aplat saturé ; contour seul sur fond clair.

### Échantillon (chip)
- **Style:** forme d'ongle, aplat de teinte ou photo réelle, un éclat de brillance diagonal, ticket blanc « N°xx » + nom.
- **State:** survol = se soulève de 14 px et l'éclat balaie ; sélectionné = ticket griotte ; clic = la teinte se répand dans le hero.

### Cards / Containers
- **Corner Style:** 16 px. **Background:** une teinte pleine par carte. **Shadow:** voir Elevation. **Internal Padding:** clamp(20px, 2vw, 28px). Inclinaison 3D ±7° et reflet qui suit le pointeur (pointeurs fins seulement).

### Étiquette suspendue (ticket)
Rectangle à coins coupés, trou et ficelle, accroché à un rail ; se balance avec l'élan du scroll. Porte un chiffre géant et une phrase.

### Lame d'avis (blade)
Carte d'éventail de nuancier, pivot sous la carte, rotation ±7° par rang ; toutes de même hauteur ; contrôles sous l'éventail.

### Navigation
Mot-symbole + liens soulignés animés + bouton d'appel. Se masque au scroll vers le bas, réapparaît vers le haut, prend la teinte de la section sous elle. Mobile : menu plein écran en trois bandes de teinte.

## Do's and Don'ts

### Do:
- **Do** donner à chaque section une teinte pleine et en dériver tous les rôles (fond, encre, accent).
- **Do** garder tout texte à 4,5:1 au moins ; vérifié pour chaque paire teinte/encre.
- **Do** animer seulement `transform`, `opacity`, `clip-path` ; courbes ease-out fortes (`cubic-bezier(0.23, 1, 0.32, 1)`).
- **Do** prévoir une version calme : `prefers-reduced-motion` supprime scroll lissé, pins, loader et marquee défilant.

### Don't:
- **Don't** utiliser de crème, de beige ou de noir pur : le clair est le blanc neige rosé, le sombre est la griotte.
- **Don't** utiliser un serif fin à fort contraste ni une écriture cursive pour le display.
- **Don't** poser de dégradé de fond ni de texte en dégradé.
- **Don't** numéroter des sections ni agrandir une photo au-delà de sa résolution utile.
- **Don't** inventer prix, chiffres, avis ou réseaux sociaux.

<!-- Non canonisé : le bloc « chiffres » reprend le gabarit gros-chiffre/petit-libellé exigé par le brief ; l'éclat de brillance est un dégradé CSS stylisé, pas une matière rendue. Le détecteur signale « cramped-padding » sur des sections dont le padding est bien présent (faux positif de mesure). -->
