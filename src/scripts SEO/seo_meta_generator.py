#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════
  MAISON SATTVAÏA — Agent SEO : Générateur de métadonnées
  Génère titles, meta descriptions, balises H1/H2 et
  slug optimisés pour chaque page / article du site.
═══════════════════════════════════════════════════════════════
  Prérequis : pip install anthropic
  Usage     : python seo_meta_generator.py
"""

import anthropic
import json
import csv
import os
from datetime import datetime

# ── Pages existantes du site ──────────────────────────────────
PAGES_SITE = [
    {
        "page":        "Accueil",
        "url":         "/",
        "description": "Page principale présentant Maison Sattvaïa, ses 3 offres (MAISON, SATTVA, AÏA) et le bilan découverte gratuit.",
        "mot_cle":     "naturopathe holistique Gard humain animal",
    },
    {
        "page":        "SATTVA — Offre humaine",
        "url":         "/sattva",
        "description": "Accompagnement naturopathique et énergétique pour l'humain : naturopathie, soins vibratoires, magnétisme, MTC.",
        "mot_cle":     "naturopathie soins énergétiques Gard Vaucluse",
    },
    {
        "page":        "AÏA — Offre animale",
        "url":         "/aia",
        "description": "Naturopathie animale, communication animale intuitive, magnétisme pour chiens et chats.",
        "mot_cle":     "naturopathie animale chien chat Gard",
    },
    {
        "page":        "MAISON — Offre signature duo",
        "url":         "/maison",
        "description": "Offre signature pour le binôme humain-animal : harmonisation systémique du lien miroir et du foyer.",
        "mot_cle":     "lien miroir humain animal harmonisation foyer",
    },
    {
        "page":        "À propos",
        "url":         "/a-propos",
        "description": "Présentation d'Aïa, son parcours, sa philosophie de soin holistique et vibratoire.",
        "mot_cle":     "thérapeute holistique Aïa Maison Sattvaïa",
    },
    {
        "page":        "Réservation",
        "url":         "/accompagnements/reservation",
        "description": "Page de prise de rendez-vous pour un bilan de résonance gratuit ou un accompagnement.",
        "mot_cle":     "prendre rendez-vous naturopathe Gard Vaucluse",
    },
    {
        "page":        "Blog",
        "url":         "/blog",
        "description": "Articles de blog sur la naturopathie, le bien-être animal, la spiritualité et le développement personnel.",
        "mot_cle":     "blog naturopathie bien-être naturel animal",
    },
    {
        "page":        "Contact",
        "url":         "/contact",
        "description": "Informations de contact de Maison Sattvaïa, Salazac, Gard.",
        "mot_cle":     "contact naturopathe Salazac Gard",
    },
]

OUTPUT_FILE = f"meta_sattvaïa_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"

# ── Prompt ───────────────────────────────────────────────────
def build_meta_prompt(page: dict) -> str:
    return f"""
Tu es un expert SEO spécialisé dans la santé naturelle et la thérapie holistique en France.

Site : Maison Sattvaïa (https://www.maisonsattvaia.fr)
Activité : Naturopathe & thérapeute holistique — soins humains et animaux
Zone : Gard, Vaucluse, Drôme, Ardèche

Page : {page['page']} ({page['url']})
Contenu de la page : {page['description']}
Mot-clé cible : {page['mot_cle']}

Génère les éléments SEO optimisés pour cette page.

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après.
Format exact :
{{
  "title_tag": "...",
  "meta_description": "...",
  "h1": "...",
  "h2_suggestions": ["...", "...", "..."],
  "slug_optimise": "...",
  "schema_type": "...",
  "note_seo": "..."
}}

Règles strictes :
- title_tag : 50-60 caractères, mot-clé en début, nom du site à la fin (ex: "... | Maison Sattvaïa")
- meta_description : 140-160 caractères, incitative, contient le mot-clé, donne envie de cliquer
- h1 : unique, différent du title, contient le mot-clé principal, 40-70 caractères
- h2_suggestions : 3 suggestions de sous-titres H2 pertinents pour la page
- slug_optimise : URL optimisée en minuscules sans accents (ou conserver l'actuelle si déjà bonne)
- schema_type : type de balisage Schema.org recommandé (LocalBusiness, Article, FAQPage, etc.)
- note_seo : conseil prioritaire en 1 phrase pour améliorer le référencement de cette page
"""

# ── Agent principal ───────────────────────────────────────────
def run_meta_generator():
    client = anthropic.Anthropic()
    all_metas = []

    print(f"\n{'═'*60}")
    print(f"  🌿 MAISON SATTVAÏA — Générateur de métadonnées SEO")
    print(f"{'═'*60}\n")

    for i, page in enumerate(PAGES_SITE, 1):
        print(f"[{i}/{len(PAGES_SITE)}] Page : {page['page']}...")
        try:
            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1000,
                messages=[{"role": "user", "content": build_meta_prompt(page)}]
            )
            raw = response.content[0].text.strip()
            raw = raw.replace("```json", "").replace("```", "").strip()
            meta = json.loads(raw)

            # Ajout des infos de page
            meta["page"]        = page["page"]
            meta["url_actuelle"] = page["url"]
            meta["mot_cle"]     = page["mot_cle"]

            # Vérifications longueur
            title_len = len(meta.get("title_tag", ""))
            meta_len  = len(meta.get("meta_description", ""))
            warnings  = []
            if title_len > 60:
                warnings.append(f"⚠️  Title trop long ({title_len} car.)")
            if meta_len > 160:
                warnings.append(f"⚠️  Meta desc trop longue ({meta_len} car.)")
            if warnings:
                print("   " + " | ".join(warnings))

            all_metas.append(meta)
            print(f"   ✅ Métadonnées générées")

        except json.JSONDecodeError as e:
            print(f"   ⚠️  Erreur JSON pour « {page['page']} » : {e}")
        except Exception as e:
            print(f"   ❌ Erreur API pour « {page['page']} » : {e}")

    # ── Export CSV ───────────────────────────────────────────
    if all_metas:
        fieldnames = [
            "page", "url_actuelle", "mot_cle",
            "title_tag", "meta_description", "h1",
            "h2_suggestions", "slug_optimise", "schema_type", "note_seo"
        ]
        with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            for row in all_metas:
                # Convertir la liste h2 en string lisible
                if isinstance(row.get("h2_suggestions"), list):
                    row["h2_suggestions"] = " | ".join(row["h2_suggestions"])
                writer.writerow(row)

        print(f"\n{'═'*60}")
        print(f"  ✅ Métadonnées exportées dans : {OUTPUT_FILE}")
        print(f"{'═'*60}\n")

        # Aperçu console
        print("📋 APERÇU — Pages analysées :\n")
        for m in all_metas:
            print(f"  📄 {m['page']}")
            print(f"     Title : {m.get('title_tag','–')}")
            print(f"     Meta  : {m.get('meta_description','–')[:80]}...")
            print(f"     Conseil : {m.get('note_seo','–')}\n")
    else:
        print("\n⚠️  Aucune métadonnée générée.")

# ── Entrée ───────────────────────────────────────────────────
if __name__ == "__main__":
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("❌ Variable ANTHROPIC_API_KEY manquante.")
        print("   Exécute : export ANTHROPIC_API_KEY='sk-ant-...'")
        exit(1)
    run_meta_generator()
