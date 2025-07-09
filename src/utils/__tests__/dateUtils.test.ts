import { describe, it, expect } from 'vitest';
import { formatDate } from '../dateUtils';

describe('formatDate', () => {
  it('devrait formater une date en français', () => {
    const dateString = '2024-01-15';
    const result = formatDate(dateString);
    
    // Le résultat devrait contenir le jour, le mois en français et l'année
    expect(result).toMatch(/^\d{1,2}\s+[a-zA-ZÀ-ÿ]+\s+2024$/);
  });

  it('devrait gérer différentes dates', () => {
    const testCases = [
      { input: '2024-12-25', expectedPattern: /^\d{1,2}\s+[a-zA-ZÀ-ÿ]+\s+2024$/ },
      { input: '2024-06-01', expectedPattern: /^\d{1,2}\s+[a-zA-ZÀ-ÿ]+\s+2024$/ },
      { input: '2024-03-08', expectedPattern: /^\d{1,2}\s+[a-zA-ZÀ-ÿ]+\s+2024$/ }
    ];

    testCases.forEach(({ input, expectedPattern }) => {
      const result = formatDate(input);
      expect(result).toMatch(expectedPattern);
    });
  });

  it('devrait gérer les dates avec des heures', () => {
    const dateString = '2024-01-15T10:30:00Z';
    const result = formatDate(dateString);
    
    // Le résultat devrait ignorer l'heure et ne garder que la date
    expect(result).toMatch(/^\d{1,2}\s+\w+\s+2024$/);
  });

  it('devrait lever une erreur pour une date invalide', () => {
    expect(() => formatDate('date-invalide')).toThrow();
  });
}); 