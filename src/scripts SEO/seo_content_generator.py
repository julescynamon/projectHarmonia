#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════
  MAISON SATTVAÏA — Agent SEO : Générateur d'articles de blog
  Génère des articles complets, optimisés SEO, dans le ton
  et l'univers d'Aïa (naturopathie, soins holistiques,
  bien-être humain & animal).
═══════════════════════════════════════════════════════════════
  Prérequis : pip install anthropic
  Usage     : python seo_content_generator.py
              → Mode interactif : entre un sujet et génère l'article
"""

import anthropic
import os
import re
from datetime import datetime

# ── Configuration du site ────────────────────────────────────
SITE_CONFIG = {
    "nom":          "Maison Sattvaïa",
    "url":          "https://www.maisonsattvaia.fr",
    "auteure":      "Aïa",
    "localisation": "Gard, Vaucluse, Drôme, Ardèche",
    "metier":       "Naturopathe & thérapeute holistique humain & animal",
    "approche":     (
        "Approche holistique et vibratoire qui traite simultanément le corps physique "
        "(naturopathie), les émotions (soins énergétiques, magnétisme) et le lien "
        "humain-animal (méthode MAISON). Outils : naturopathie, lecture vibratoire, "
        "magnétisme, MTC, réflexologie, communication animale, massages thérapeutiques."
    ),
    "ton":          (
        "Doux, bienveillant, expert mais accessible. Utilise parfois des métaphores "
        "de nature, de résonance, d'harmonie. Parle à la 1ère personne du singulier "
        "comme si Aïa écrivait elle-même. Évite le jargon médical trop clinique."
    ),
    "categories": [
        "Santé Naturelle et Bien-être",
        "Bien-être Animal",
        "Développement Personnel",
        "Spiritualité et Énergie",
        "Inspiration et Vie Quotidienne",
    ],
    "cta_rdv":   "https://www.maisonsattvaia.fr/accompagnements/reservation",
    "cta_bilan": "https://www.maisonsattvaia.fr/accompagnements/reservation?service=bilan-telephonique-gratuit",
}

# ── Sujets prédéfinis (optionnel) ────────────────────────────
SUJETS_PREDEFINED = [
    ("naturopathe Gard",            "Santé Naturelle et Bien-être",    "naturopathe Gard, Vaucluse, Ardèche"),
    ("fatigue chronique naturopathie","Santé Naturelle et Bien-être",  "fatigue chronique solution naturelle"),
    ("anxiété chien solutions naturelles","Bien-être Animal",          "anxiété chien naturopathie"),
    ("lien miroir humain animal",   "Bien-être Animal",                "lien émotionnel humain animal"),
    ("magnétisme bienfaits",        "Spiritualité et Énergie",         "magnétisme soins énergétiques"),
    ("communication animale comment ça marche","Bien-être Animal",     "communication animale"),
    ("detox foie naturopathie",     "Santé Naturelle et Bien-être",    "détox foie printemps naturel"),
    ("rituels bien-être quotidien", "Inspiration et Vie Quotidienne",  "rituel bien-être quotidien naturel"),
]

# ── Générateur de prompt ─────────────────────────────────────
def build_article_prompt(sujet: str, categorie: str, mot_cle_principal: str) -> str:
    cfg = SITE_CONFIG
    return f"""
Tu es Aïa, naturopathe et thérapeute holistique, fondatrice de {cfg['nom']} ({cfg['url']}).
Localisation : {cfg['localisation']}.
Approche : {cfg['approche']}
Ton : {cfg['ton']}

MISSION : Rédige un article de blog SEO complet sur le sujet : « {sujet} »
Catégorie du blog : {categorie}
Mot-clé principal à optimiser : « {mot_cle_principal} »

STRUCTURE OBLIGATOIRE (en Markdown) :
---
titre: [Titre accrocheur, 55-65 caractères, contenant le mot-clé principal]
meta_description: [160 caractères max, contenant le mot-clé, incitant au clic]
categorie: {categorie}
mots_cles: [3 à 5 mots-clés séparés par des virgules]
temps_lecture: [estimation en minutes]
---

# [Titre H1 = même que le titre ci-dessus]

[Introduction : 100-150 mots. Accroche émotionnelle ou question rhétorique. Intègre le mot-clé principal naturellement dans les 100 premiers mots.]

## [H2 : Premier aspect — contexte ou problématique]
[250-300 mots]

## [H2 : Deuxième aspect — approche ou solution naturelle]
[250-300 mots]

## [H2 : Troisième aspect — mise en pratique ou cas concret]
[200-250 mots]

## [H2 : Mon approche Sattvaïa]
[150-200 mots. Intègre naturellement les services SATTVA / AÏA / MAISON selon le contexte. Mentionne la localisation ({cfg['localisation']}) si pertinent pour le SEO local.]

## [H2 : Questions fréquentes]
[3 questions-réponses en format FAQ, optimisées pour les featured snippets Google et les réponses IA.]

---
**Prête à faire le premier pas ?**
[Appel à l'action naturel vers {cfg['cta_bilan']} — bilan de résonance OFFERT de 30 min]

---
*Article rédigé par {cfg['auteure']} — {cfg['nom']}*

CONSIGNES SEO :
- Mot-clé principal présent dans : titre, intro (100 premiers mots), au moins 2 H2, conclusion
- Mots-clés secondaires (synonymes, longue traîne) intégrés naturellement
- Phrases courtes (moins de 25 mots), paragraphes aérés (4-5 lignes max)
- Aucun lien externe. Liens internes possibles vers /sattva, /aia, /maison si pertinent
- Longueur totale visée : 1000 à 1400 mots
- Optimisé pour l'IA Overview de Google : réponses directes, structure claire, autorité thématique
"""

# ── Sauvegarde ───────────────────────────────────────────────
def save_article(content: str, sujet: str) -> str:
    slug = re.sub(r'[^a-z0-9]+', '-', sujet.lower().strip()).strip('-')
    filename = f"article_{slug}_{datetime.now().strftime('%Y%m%d_%H%M')}.md"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
    return filename

# ── Mode interactif ──────────────────────────────────────────
def mode_interactif(client):
    print("\n📝 MODE INTERACTIF")
    print("─" * 40)
    sujet = input("Sujet de l'article : ").strip()
    if not sujet:
        print("❌ Sujet vide.")
        return

    print("\nCatégories disponibles :")
    for i, cat in enumerate(SITE_CONFIG["categories"], 1):
        print(f"  {i}. {cat}")
    choix = input("Numéro de catégorie (ou Entrée pour la 1ère) : ").strip()
    try:
        categorie = SITE_CONFIG["categories"][int(choix) - 1]
    except (ValueError, IndexError):
        categorie = SITE_CONFIG["categories"][0]

    mot_cle = input(f"Mot-clé principal (ou Entrée pour '{sujet}') : ").strip() or sujet

    print(f"\n⏳ Génération de l'article sur « {sujet} »...")
    generer_article(client, sujet, categorie, mot_cle)

# ── Génération d'un article ──────────────────────────────────
def generer_article(client, sujet: str, categorie: str, mot_cle: str):
    prompt = build_article_prompt(sujet, categorie, mot_cle)
    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        content = response.content[0].text.strip()
        filename = save_article(content, sujet)
        print(f"✅ Article sauvegardé : {filename}")
        print(f"\n{'─'*60}")
        print(content[:500] + "\n[... voir fichier complet ...]")
        print(f"{'─'*60}\n")
    except Exception as e:
        print(f"❌ Erreur lors de la génération : {e}")

# ── Mode batch (sujets prédéfinis) ───────────────────────────
def mode_batch(client):
    print(f"\n📦 MODE BATCH — {len(SUJETS_PREDEFINED)} articles à générer\n")
    for i, (sujet, categorie, mot_cle) in enumerate(SUJETS_PREDEFINED, 1):
        print(f"[{i}/{len(SUJETS_PREDEFINED)}] « {sujet} »...")
        generer_article(client, sujet, categorie, mot_cle)
    print("✅ Batch terminé.")

# ── Entrée principale ─────────────────────────────────────────
if __name__ == "__main__":
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("❌ Variable ANTHROPIC_API_KEY manquante.")
        print("   Exécute : export ANTHROPIC_API_KEY='sk-ant-...'")
        exit(1)

    client = anthropic.Anthropic()

    print(f"\n{'═'*60}")
    print(f"  🌿 MAISON SATTVAÏA — Générateur d'articles SEO")
    print(f"{'═'*60}")
    print("  1. Mode interactif (saisir un sujet)")
    print("  2. Mode batch (générer les 8 sujets prédéfinis)")
    print(f"{'═'*60}")

    choix = input("\nChoix (1 ou 2) : ").strip()
    if choix == "2":
        mode_batch(client)
    else:
        mode_interactif(client)
