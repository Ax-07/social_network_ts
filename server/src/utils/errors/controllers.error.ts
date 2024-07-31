import { Response } from 'express';

// Fonction pour gérer les erreurs de contrôleur
const handleControllerError = (res: Response, error: unknown, defaultMessage: string) => {
    if (error instanceof Error) {
      res.status(500).json({ error: defaultMessage, details: error.message });
    } else {
      res.status(500).json({ error: defaultMessage, details: 'Unknown error' });
    }
  };

export { handleControllerError };