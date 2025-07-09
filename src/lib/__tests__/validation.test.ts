import { describe, it, expect } from 'vitest';
import { validateContactForm, sanitizeContactData, type ContactFormData } from '../validation';

describe('validateContactForm', () => {
  it('devrait valider un formulaire correct', () => {
    const validData: ContactFormData = {
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      subject: 'consultation',
      message: 'Bonjour, je souhaite prendre rendez-vous pour une consultation.'
    };

    const errors = validateContactForm(validData);
    expect(errors).toHaveLength(0);
  });

  it('devrait détecter le spam via le honeypot', () => {
    const spamData: ContactFormData = {
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      subject: 'consultation',
      message: 'Message valide',
      website: 'http://spam.com'
    };

    const errors = validateContactForm(spamData);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({
      field: 'website',
      message: 'Spam détecté'
    });
  });

  it('devrait valider le nom', () => {
    const invalidNames = [
      { name: '', expectedMessage: 'Le nom est requis' },
      { name: 'A', expectedMessage: 'Le nom doit contenir au moins 2 caractères et ne contenir que des lettres' },
      { name: 'Jean123', expectedMessage: 'Le nom doit contenir au moins 2 caractères et ne contenir que des lettres' },
      { name: 'Jean@Dupont', expectedMessage: 'Le nom doit contenir au moins 2 caractères et ne contenir que des lettres' }
    ];

    invalidNames.forEach(({ name, expectedMessage }) => {
      const data: ContactFormData = {
        name,
        email: 'test@example.com',
        subject: 'consultation',
        message: 'Message valide'
      };

      const errors = validateContactForm(data);
      expect(errors.some(error => error.field === 'name' && error.message === expectedMessage)).toBe(true);
    });
  });

  it('devrait valider l\'email', () => {
    const invalidEmails = [
      { email: '', expectedMessage: 'L\'email est requis' },
      { email: 'invalid-email', expectedMessage: 'Format d\'email invalide' },
      { email: '@example.com', expectedMessage: 'Format d\'email invalide' },
      { email: 'test@', expectedMessage: 'Format d\'email invalide' }
    ];

    invalidEmails.forEach(({ email, expectedMessage }) => {
      const data: ContactFormData = {
        name: 'Jean Dupont',
        email,
        subject: 'consultation',
        message: 'Message valide'
      };

      const errors = validateContactForm(data);
      expect(errors.some(error => error.field === 'email' && error.message === expectedMessage)).toBe(true);
    });
  });

  it('devrait valider le sujet', () => {
    const invalidSubjects = [
      { subject: '', expectedMessage: 'Le sujet est requis' },
      { subject: 'invalid-subject', expectedMessage: 'Veuillez sélectionner un sujet valide' }
    ];

    invalidSubjects.forEach(({ subject, expectedMessage }) => {
      const data: ContactFormData = {
        name: 'Jean Dupont',
        email: 'test@example.com',
        subject,
        message: 'Message valide'
      };

      const errors = validateContactForm(data);
      expect(errors.some(error => error.field === 'subject' && error.message === expectedMessage)).toBe(true);
    });
  });

  it('devrait valider le message', () => {
    const invalidMessages = [
      { message: '', expectedMessage: 'Le message est requis' },
      { message: 'Court', expectedMessage: 'Le message doit contenir entre 10 et 1000 caractères' }
    ];

    invalidMessages.forEach(({ message, expectedMessage }) => {
      const data: ContactFormData = {
        name: 'Jean Dupont',
        email: 'test@example.com',
        subject: 'consultation',
        message
      };

      const errors = validateContactForm(data);
      expect(errors.some(error => error.field === 'message' && error.message === expectedMessage)).toBe(true);
    });
  });

  it('devrait accepter tous les sujets valides', () => {
    const validSubjects = ['consultation', 'question', 'partnership', 'other'];

    validSubjects.forEach(subject => {
      const data: ContactFormData = {
        name: 'Jean Dupont',
        email: 'test@example.com',
        subject,
        message: 'Message valide avec au moins 10 caractères'
      };

      const errors = validateContactForm(data);
      expect(errors.some(error => error.field === 'subject')).toBe(false);
    });
  });
});

describe('sanitizeContactData', () => {
  it('devrait nettoyer les données du formulaire', () => {
    const rawData: ContactFormData = {
      name: '  Jean Dupont  ',
      email: '  JEAN.DUPONT@EXAMPLE.COM  ',
      subject: '  consultation  ',
      message: '  Message avec espaces  ',
      website: '  http://example.com  '
    };

    const sanitized = sanitizeContactData(rawData);

    expect(sanitized.name).toBe('Jean Dupont');
    expect(sanitized.email).toBe('jean.dupont@example.com');
    expect(sanitized.subject).toBe('consultation');
    expect(sanitized.message).toBe('Message avec espaces');
    expect(sanitized.website).toBe('http://example.com');
  });

  it('devrait gérer les données sans website', () => {
    const rawData: ContactFormData = {
      name: 'Jean Dupont',
      email: 'jean@example.com',
      subject: 'consultation',
      message: 'Message valide'
    };

    const sanitized = sanitizeContactData(rawData);

    expect(sanitized.website).toBeUndefined();
  });
}); 