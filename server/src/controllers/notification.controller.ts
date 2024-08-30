import { Request, Response } from 'express';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';
import { apiError, apiSuccess } from '../utils/functions/apiResponses';

const getAllNotificationsByUserId = async (req: Request, res: Response) => {
    const userId = req.params.id;
    if (!userId) {
        return apiError(res, 'User ID is required', 400);
    }
    try {
        const notifications = await db.Notification.findAll({ where: { userId } });
        return apiSuccess(res, `Notifications for user ${userId}`, notifications);
    } catch (error) {
        return handleControllerError(res, error, 'An error occurred while getting the notifications.');
    }
};

export { getAllNotificationsByUserId };