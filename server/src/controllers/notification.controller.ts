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

const markNotificationsAsRead = async (req: Request, res: Response) => {
    const {notificationsIds} = req.body;
    const userId = req.params.id;
    if (!notificationsIds) {
        return apiError(res, 'Notifications IDs are required', 400);
    }
    try {
        // marque les notifications comme lues
        const notifications = await db.Notification.findAll({ where: { userId } });
        if (!notifications) {
            return apiError(res, 'Notifications not found', 404);
        }
        notifications.forEach(async (notification) => {
            if (notificationsIds.includes(notification.id)) {
                await notification.update({ isRead: true });
            }
        });
        return apiSuccess(res, 'Notifications marked as read', notifications);
    } catch (error) {
        return handleControllerError(res, error, 'An error occurred while marking notifications as read.');
    }
}

export { getAllNotificationsByUserId, markNotificationsAsRead };