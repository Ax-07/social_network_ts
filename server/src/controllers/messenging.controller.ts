import { Request, Response } from 'express';
import { apiError, apiSuccess } from '../utils/functions/apiResponses';

const uploadFileMessenging = async (req: Request, res: Response) => {
    if (!res.locals.filePath) {
        return apiError(res, 'Validation error', 'File path is required', 400);
    }
    return apiSuccess(res, 'File uploaded successfully', { filePath: res.locals.filePath });
}

export default uploadFileMessenging;