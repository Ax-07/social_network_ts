import { Request, Response } from 'express';

const uploadFileMessenging = async (req: Request, res: Response) => {
    if (!res.locals.filePath) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    return res.status(201).json({ filePath: res.locals.filePath });
}

export default uploadFileMessenging;