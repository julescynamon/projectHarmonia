export interface ValidationError {
  field: string;
  message: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

export const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[A-Za-zÀ-ÿ\s-]+$/,
    message: 'Le nom doit contenir au moins 2 caractères et ne contenir que des lettres'
  },
  email: {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    maxLength: 254,
    message: 'Format d\'email invalide'
  },
  subject: {
    required: true,
    enum: ['consultation', 'question', 'partnership', 'other'],
    message: 'Veuillez sélectionner un sujet valide'
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000,
    message: 'Le message doit contenir entre 10 et 1000 caractères'
  }
};

export function validateContactForm(data: ContactFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Vérification du honeypot
  if (data.website) {
    errors.push({ field: 'website', message: 'Spam détecté' });
    return errors;
  }

  // Validation du nom
  if (!data.name) {
    errors.push({ field: 'name', message: 'Le nom est requis' });
  } else if (data.name.length < validationRules.name.minLength!) {
    errors.push({ field: 'name', message: validationRules.name.message });
  } else if (!validationRules.name.pattern.test(data.name)) {
    errors.push({ field: 'name', message: validationRules.name.message });
  }

  // Validation de l'email
  if (!data.email) {
    errors.push({ field: 'email', message: 'L\'email est requis' });
  } else if (!validationRules.email.pattern.test(data.email)) {
    errors.push({ field: 'email', message: validationRules.email.message });
  }

  // Validation du sujet
  if (!data.subject) {
    errors.push({ field: 'subject', message: 'Le sujet est requis' });
  } else if (!validationRules.subject.enum?.includes(data.subject)) {
    errors.push({ field: 'subject', message: validationRules.subject.message });
  }

  // Validation du message
  if (!data.message) {
    errors.push({ field: 'message', message: 'Le message est requis' });
  } else if (data.message.length < validationRules.message.minLength!) {
    errors.push({ field: 'message', message: validationRules.message.message });
  }

  return errors;
}

// Fonction utilitaire pour nettoyer les données
export function sanitizeContactData(data: ContactFormData): ContactFormData {
  return {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    subject: data.subject.trim(),
    message: data.message.trim(),
    website: data.website?.trim()
  };
} 