import { NextFunction, Request, Response } from 'express';

const serverError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({ message: 'Internal server error' });
  };

export default serverError;
