import { Request, Response } from "express";
import db from "../models";
import { apiError, apiSuccess } from "../utils/functions/apiResponses";
import validateMessageEntry from "../utils/functions/validations/validateMessageEntry";
import { io } from "../services/notifications";
import { sendNotification } from "../utils/functions/notificationsUtils/sendNotification";

const createMessage = async (req: Request, res: Response) => {
  const { senderId, receiverId, content, roomId, type } = req.body;
  let media = req.body.media;

  if (!media && res.locals.filePath) {
    media = res.locals.filePath;
  }

  if (!senderId || !receiverId || !roomId || !type) {
    return apiError(
      res,
      "Validation error",
      "userId, roomId and type are required",
      400
    );
  }

  const errors = validateMessageEntry({
    senderId,
    receiverId,
    content,
    media,
    roomId,
    type,
  });
  if (errors.length > 0) {
    return apiError(res, "Validation error", errors, 400);
  }

  const senderUserName = await db.User.findByPk(senderId).then(
    (user) => user?.username
  );

  try {
    const message = await db.Message.create({
      senderId,
      receiverId,
      content,
      roomId,
      type,
    });
    await sendNotification({
      userId: receiverId,
      senderId,
      type: "message",
      message: `${senderUserName} vous a envoyé un message`,
      io,
    });

    return apiSuccess(res, "", { message }, 201);
  } catch (error) {
    return apiError(res, "", 500);
  }
};

const getMessagesByRoomId = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const messages = await db.Message.findAll({
      where: { roomId },
    });

    return apiSuccess(res, "", { messages }, 200);
  } catch (error) {
    return apiError(res, "", 500);
  }
};

const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    const message = await db.Message.findByPk(messageId);
    if (!message) {
      return apiError(res, "Message not found", 404);
    }

    await message.update({ isRead: true });
    await sendNotification({
      userId: message.senderId,
      senderId: message.receiverId,
      type: "message",
      message: "Message lu",
      io,
    });

    return apiSuccess(res, "Message marked as read", { message }, 200);
  } catch (error) {
    return apiError(res, "", 500);
  }
};

const markMessageAsReceived = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    const message = await db.Message.findByPk(messageId);
    if (!message) {
      return apiError(res, "Message not found", 404);
    }

    await message.update({ isReceived: true });
    await sendNotification({
      userId: message.senderId,
      senderId: message.receiverId,
      type: "message",
      message: "Message reçu",
      io,
    });

    return apiSuccess(res, "Message marked as received", { message }, 200);
  } catch (error) {
    return apiError(res, "", 500);
  }
};

const markMessageAsSent = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    const message = await db.Message.findByPk(messageId);
    if (!message) {
      return apiError(res, "Message not found", 404);
    }

    await message.update({ isSent: true });
    await sendNotification({
      userId: message.receiverId,
      senderId: message.senderId,
      type: "message",
      message: "Message envoyé",
      io,
    });

    return apiSuccess(res, "Message marked as sent", { message }, 200);
  } catch (error) {
    return apiError(res, "", 500);
  }
};

const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    const message = await db.Message.findByPk(messageId);
    if (!message) {
      return apiError(res, "Message not found", 404);
    }

    await message.update({ isDeleted: true });
    await sendNotification({
      userId: message.receiverId,
      senderId: message.senderId,
      type: "message",
      message: "Message supprimé",
      io,
    });

    return apiSuccess(res, "Message deleted", { message }, 200);
  } catch (error) {
    return apiError(res, "", 500);
  }
};

export {
  createMessage,
  getMessagesByRoomId,
  markMessageAsRead,
  markMessageAsReceived,
  markMessageAsSent,
  deleteMessage,
};
