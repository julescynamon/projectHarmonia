#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════
  MAISON SATTVAÏA — Agent SEO : Calendrier éditorial
  Génère un plan de contenu SEO sur 3 mois (12 articles)
  avec sujets priorisés, catégories, mots-clés et dates.
═══════════════════════════════════════════════════════════════
  Prérequis : pip install anthropic
  Usage     : python seo_content_plan.py
"""

import anthropic
import json
import csv
import os
from datetime import datetime, timedelta

# ── Configuration ─────────────────────────────────────────────
MOIS_DEBUT    = "Mai 2026"
NB_ARTICLES   = 12          # 1 article/semaine sur 3 mois
DATE_DEPART   = datetime(2026, 5, 4)   # Premier lundi de mai
FREQUENCE_JOURS = 7         # 1 article par semaine

OUTPUT_FILE   = f"calendrier_editorial_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"

CONTEXTE_SITE = """
Site : Maison Sattvaïa (https://www.maisonsattvaia.fr)
Auteure : Aïa — Naturopathe & thérapeute holistique
Zone géographique : Gard, Vaucluse, Drôme, Ardèche (Sud de la France)

Services :
- SATTVA : accompagnement humain (naturopathie, soins vibratoires, magnétisme)
- AÏA : accompagnement animal (naturopathie animale, communication animale)
- MAISON : offre duo humain + animal (lien miroir, harmonisation foyer)

Catégories du blog :
1. Santé Naturelle et Bien-être
2. Bien-être Animal
3. Développement Personnel
4. Spiritualité et Énergie
5. Inspiration et Vie Quotidienne

Articles existants (ne pas dupliquer) :
- Baume naturel contre tiques et moustiques
- Gastrite chez le chien (approche holistique)
- Détox de printemps et foie
- Le pouvoir de l'intention
- Huiles essentielles (5 indispensables)
- Bienfaits des routines matinales
- Aliments vivants et nutriments
- Renforcer son système immunitaire naturellement

Objectifs SEO prioritaires :
- Référencement local : naturopathe Gard / Vaucluse / Ardèche / Drôme
- Référencement thématique : naturopathie animale (niche peu concurrentielle)
- Visibilité IA (Google AI Overview) : articles FAQ structurés
- Acquisition : attirer des clients pour la prise de RDV
"""

# ── Prompt ───────────────────────────────────────────────────
def build_plan_prompt() -> str:
    return f"""
Tu es un expert en stratégie de contenu SEO pour les sites de bien-être et de santé naturelle en France.

{CONTEXTE_SITE}

MISSION : Génère un calendrier éditorial de {NB_ARTICLES} articles pour les 3 prochains mois (à partir de {MOIS_DEBUT}).

Pour chaque article, fournis :
1. Un titre accrocheur et SEO-friendly (55-65 caractères)
2. Le mot-clé principal visé
3. La catégorie du blog
4. Le type de contenu : guide pratique / conseil / recette / FAQ / témoignage / saisonnier / local
5. Le service lié : SATTVA / AÏA / MAISON / général
6. La priorité SEO : haute / moyenne / faible
7. Une courte description du contenu (50 mots max)
8. Le potentiel d'acquisition (conversion vers RDV) : fort / moyen / faible

Critères de sélection :
- Alterner les catégories (pas 2 fois la même de suite)
- Inclure au moins 3 articles sur la naturopathie animale (niche forte)
- Inclure au moins 2 articles à ancrage local (Gard, Vaucluse, etc.)
- Inclure 2 articles FAQ optimisés pour Google AI Overview
- Tenir compte de la saisonnalité (printemps/été 2026)
- Privilégier les sujets à fort potentiel de conversion vers RDV

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après.
Format exact :
[
  {{
    "numero": 1,
    "titre": "...",
    "mot_cle_principal": "...",
    "categorie": "...",
    "type_contenu": "...",
    "service_lie": "...",
    "priorite_seo": "...",
    "description": "...",
    "potentiel_acquisition": "..."
  }}
]
"""

# ── Calcul des dates de publication ──────────────────────────
def calculer_dates(nb: int) -> list:
    dates = []
    current = DATE_DEPART
    for _ in range(nb):
        dates.append(current.strftime("%d/%m/%Y"))
        current += timedelta(days=FREQUENCE_JOURS)
    return dates

# ── Agent principal ───────────────────────────────────────────
def run_content_plan():
    client = anthropic.Anthropic()

    print(f"\n{'═'*60}")
    print(f"  🌿 MAISON SATTVAÏA — Calendrier éditorial SEO")
    print(f"  📅 {NB_ARTICLES} articles | Départ : {MOIS_DEBUT}")
    print(f"{'═'*60}\n")
    print("⏳ Génération du plan éditorial...")

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            messages=[{"role": "user", "content": build_plan_prompt()}]
        )

        raw = response.content[0].text.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        articles = json.loads(raw)

        # Ajout des dates
        dates = calculer_dates(len(articles))
        for i, article in enumerate(articles):
            article["date_publication"] = dates[i] if i < len(dates) else "–"

        # ── Export CSV ───────────────────────────────────────
        fieldnames = [
            "numero", "date_publication", "titre", "mot_cle_principal",
            "categorie", "type_contenu", "service_lie",
            "priorite_seo", "potentiel_acquisition", "description"
        ]
        with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(articles)

        print(f"✅ Calendrier exporté : {OUTPUT_FILE}\n")

        # ── Aperçu console ───────────────────────────────────
        print(f"{'═'*60}")
        print(f"  📅 CALENDRIER ÉDITORIAL — {MOIS_DEBUT} à Juillet 2026")
        print(f"{'═'*60}\n")

        priorite_icons = {"haute": "🔴", "moyenne": "🟡", "faible": "🟢"}
        acq_icons      = {"fort": "💰", "moyen": "💡", "faible": "📖"}

        for a in articles:
            p_icon = priorite_icons.get(a.get("priorite_seo","").lower(), "⚪")
            a_icon = acq_icons.get(a.get("potentiel_acquisition","").lower(), "–")
            print(f"  {a['numero']:2}. [{a['date_publication']}] {p_icon} {a_icon}")
            print(f"      📝 {a['titre']}")
            print(f"      🔑 {a['mot_cle_principal']} | 📂 {a['categorie']}")
            print(f"      🏷️  {a['type_contenu']} | 🧩 Service : {a['service_lie']}\n")

        print(f"{'─'*60}")
        print(f"  Légende : 🔴 Priorité haute  🟡 Moyenne  🟢 Faible")
        print(f"            💰 Fort potentiel RDV  💡 Moyen  📖 Faible")
        print(f"{'═'*60}\n")

    except json.JSONDecodeError as e:
        print(f"❌ Erreur JSON : {e}")
    except Exception as e:
        print(f"❌ Erreur : {e}")

# ── Entrée ───────────────────────────────────────────────────
if __name__ == "__main__":
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("❌ Variable ANTHROPIC_API_KEY manquante.")
        print("   Exécute : export ANTHROPIC_API_KEY='sk-ant-...'")
        exit(1)
    run_content_plan()
