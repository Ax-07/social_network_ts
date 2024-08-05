import { Request, Response } from 'express';

const serverError = (err: Error, req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
};

export default serverError;
