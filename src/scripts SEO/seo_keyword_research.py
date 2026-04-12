#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════
  MAISON SATTVAÏA — Agent SEO : Recherche de mots-clés
  Génère une liste de mots-clés prioritaires par thématique
  et produit un fichier CSV exploitable.
═══════════════════════════════════════════════════════════════
  Prérequis : pip install anthropic
  Usage     : python seo_keyword_research.py
"""

import anthropic
import json
import csv
import os
from datetime import datetime

# ── Configuration ────────────────────────────────────────────
SITE_NAME    = "Maison Sattvaïa"
SITE_URL     = "https://www.maisonsattvaia.fr"
LOCALISATION = "Gard, Vaucluse, Drôme, Ardèche (Sud de la France)"
METIER       = "Naturopathe & thérapeute holistique — soins humains et animaux"

THEMATIQUES = [
    "naturopathie humaine",
    "naturopathie animale",
    "soins énergétiques / vibratoires",
    "magnétisme et guérison",
    "bien-être animal holistique",
    "communication animale",
    "médecine traditionnelle chinoise naturelle",
    "réflexologie",
    "développement personnel & spiritualité",
    "harmonie foyer / lien humain-animal",
]

OUTPUT_FILE = f"keywords_sattvaïa_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"

# ── Prompt ───────────────────────────────────────────────────
def build_prompt(thematique: str) -> str:
    return f"""
Tu es un expert SEO spécialisé dans le bien-être, la santé naturelle et la thérapie holistique en France.

Contexte du site :
- Nom : {SITE_NAME}
- URL : {SITE_URL}
- Activité : {METIER}
- Zone géographique : {LOCALISATION}

Génère une liste de 10 mots-clés ou expressions SEO pour la thématique : « {thematique} »

Pour chaque mot-clé, fournis :
1. Le mot-clé exact (tel qu'un internaute le taperait sur Google)
2. L'intention de recherche : informationnelle / transactionnelle / navigationnelle / locale
3. Le volume estimé : faible / moyen / élevé
4. La difficulté : facile / modérée / difficile
5. Une idée de titre d'article de blog optimisé pour ce mot-clé

Réponds UNIQUEMENT en JSON valide, sans aucun texte avant ou après.
Format exact :
[
  {{
    "mot_cle": "...",
    "intention": "...",
    "volume": "...",
    "difficulte": "...",
    "titre_article": "..."
  }}
]
"""

# ── Agent principal ───────────────────────────────────────────
def run_keyword_research():
    client = anthropic.Anthropic()
    all_keywords = []

    print(f"\n{'═'*60}")
    print(f"  🌿 MAISON SATTVAÏA — Recherche de mots-clés SEO")
    print(f"{'═'*60}\n")

    for i, thematique in enumerate(THEMATIQUES, 1):
        print(f"[{i}/{len(THEMATIQUES)}] Analyse : {thematique}...")

        try:
            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1000,
                messages=[{"role": "user", "content": build_prompt(thematique)}]
            )

            raw = response.content[0].text.strip()
            # Nettoyage si balises markdown présentes
            raw = raw.replace("```json", "").replace("```", "").strip()
            keywords = json.loads(raw)

            for kw in keywords:
                kw["thematique"] = thematique
                all_keywords.append(kw)

            print(f"   ✅ {len(keywords)} mots-clés générés")

        except json.JSONDecodeError as e:
            print(f"   ⚠️  Erreur de parsing JSON pour « {thematique} » : {e}")
        except Exception as e:
            print(f"   ❌ Erreur API pour « {thematique} » : {e}")

    # ── Export CSV ───────────────────────────────────────────
    if all_keywords:
        fieldnames = ["thematique", "mot_cle", "intention", "volume", "difficulte", "titre_article"]
        with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(all_keywords)

        print(f"\n{'═'*60}")
        print(f"  ✅ {len(all_keywords)} mots-clés exportés dans : {OUTPUT_FILE}")
        print(f"{'═'*60}\n")
    else:
        print("\n⚠️  Aucun mot-clé généré. Vérifiez votre clé API.")

# ── Entrée ───────────────────────────────────────────────────
if __name__ == "__main__":
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("❌ Variable ANTHROPIC_API_KEY manquante.")
        print("   Exécute : export ANTHROPIC_API_KEY='sk-ant-...'")
        exit(1)
    run_keyword_research()
