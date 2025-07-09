# Guide de Migration CSS - Tailwind vs CSS Custom

## État actuel

- ✅ **TailwindCSS** : Configuré avec la charte graphique complète
- ✅ **CSS Custom** : Maintenu pour compatibilité pendant migration
- ✅ **Variables CSS** : Conservées pour les styles globaux

## Classes à migrer

### Couleurs

| CSS Custom        | Tailwind Equivalent | Usage                 |
| ----------------- | ------------------- | --------------------- |
| `bg-sage`         | `bg-sage`           | ✅ Déjà dans Tailwind |
| `bg-cream`        | `bg-cream`          | ✅ Déjà dans Tailwind |
| `bg-gold`         | `bg-gold`           | ✅ Déjà dans Tailwind |
| `bg-eucalyptus`   | `bg-eucalyptus`     | ✅ Déjà dans Tailwind |
| `text-sage`       | `text-sage`         | ✅ Déjà dans Tailwind |
| `text-gold`       | `text-gold`         | ✅ Déjà dans Tailwind |
| `text-ebony`      | `text-ebony`        | ✅ Déjà dans Tailwind |
| `text-eucalyptus` | `text-eucalyptus`   | ✅ Déjà dans Tailwind |

### Boutons

| CSS Custom       | Tailwind Equivalent                                                                                                                                                           | Usage    |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `.btn`           | `bg-sage text-white px-4 py-2 rounded-btn font-slogan uppercase tracking-wider text-sm hover:bg-gold hover:text-ebony hover:-translate-y-0.5 transition-all duration-300`     | À migrer |
| `.btn-secondary` | `bg-transparent border-2 border-sage text-sage px-4 py-2 rounded-btn font-slogan uppercase tracking-wider text-sm hover:bg-sage hover:text-white transition-all duration-300` | À migrer |

### Cartes

| CSS Custom | Tailwind Equivalent                                                                                          | Usage    |
| ---------- | ------------------------------------------------------------------------------------------------------------ | -------- |
| `.card`    | `bg-white rounded-card p-4 shadow-soft hover:-translate-y-1 hover:shadow-medium transition-all duration-300` | À migrer |

### Formulaires

| CSS Custom                | Tailwind Equivalent                                                                                                                                 | Usage    |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `input, textarea, select` | `bg-white border border-sage rounded-input p-2 font-body focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 transition-all duration-300` | À migrer |

## Plan de migration

### Phase 1 : Vérification (✅ Terminé)

- [x] Centraliser la charte graphique dans Tailwind
- [x] Maintenir la compatibilité avec CSS custom
- [x] Documenter les équivalences

### Phase 2 : Migration progressive

- [ ] Migrer les boutons (`.btn`, `.btn-secondary`)
- [ ] Migrer les cartes (`.card`)
- [ ] Migrer les formulaires
- [ ] Supprimer les classes CSS custom obsolètes

### Phase 3 : Nettoyage final

- [ ] Supprimer les variables CSS non utilisées
- [ ] Supprimer les classes utilitaires custom
- [ ] Garder uniquement les styles globaux et polices

## Avantages de la migration

1. **Cohérence** : Toutes les couleurs, espacements, polices centralisés dans Tailwind
2. **Performance** : Purge automatique des classes non utilisées
3. **Maintenabilité** : Un seul endroit pour modifier la charte graphique
4. **Production** : Aucun risque de casse lié aux spécificités CSS

## Commandes utiles

```bash
# Vérifier que le build fonctionne
npm run build

# Vérifier le rendu en développement
npm run dev

# Analyser les classes utilisées
npx tailwindcss --help
```

## Notes importantes

- Les variables CSS (`--color-*`, `--font-*`, etc.) sont maintenues pour les styles globaux
- Les classes utilitaires custom sont conservées pendant la migration
- Tous les composants existants continuent de fonctionner
- La migration peut se faire progressivement, fichier par fichier
