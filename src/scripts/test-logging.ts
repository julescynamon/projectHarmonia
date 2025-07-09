// src/scripts/test-logging.ts
import { logger, createContextLogger, logError } from '../lib/logger';

// Logger simple
logger.info('Action effectuée');

// Logger avec contexte
const contextLogger = createContextLogger({ userId: 'user-123' });
contextLogger.info({ message: 'Utilisateur connecté' });

// Logger d'erreur
try {
  // code
} catch (error) {
  logError(error, { userId: 'user-123' });
} 