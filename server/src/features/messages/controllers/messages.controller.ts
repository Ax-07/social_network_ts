import { Request, Response } from "express";
import db from "../../../db/models";
import { apiError, apiSuccess } from "../../../utils/functions/apiResponses";
import { io } from "../../notifications/services";
import { sendNotification } from "../../notifications/utils/sendNotification";
import validateMessageEntry from "../validations/validateMessageEntry";


const createMessage = async (req: Request, res: Response) => {
  const { senderId, receiverId, content, roomId, messageType } = req.body; console.group('senderId:',senderId, 'receiverId:', receiverId, 'content:', content, 'roomId:', roomId, 'messageType:', messageType);
  let media = req.body.media;

  if (!media && res.locals.filePath) {
    media = res.locals.filePath;
  }

  if (!senderId) {
    return apiError(res, "Sender ID is required", 400);
  }
  if(!receiverId) {
    return apiError(res, "Receiver ID is required", 400);
  }
  if (!roomId) {
    return apiError(res, "Room ID is required", 400);
  }
  if (!messageType) {
    return apiError(res, "Message type is required", 400);
  }

  const errors = validateMessageEntry({
    senderId,
    receiverId,
    content,
    media,
    roomId,
    messageType,
  });

  if (errors.length > 0) {
    return apiError(res, "Validation error", errors, 400);
  }

  const senderUserName = await db.User.findByPk(senderId).then(
    (user) => user?.username
  );

  if (!senderUserName) {
    return apiError(res, "Sender not found", 404);
  }

  try {
    const [conversation] = await db.Conversation.findOrCreate({
      where: { roomId },
      defaults: { adminId: senderId, roomId, title: "", isGroup: false },
    });
    console.log('conversation:', conversation);
    console.info('Creating message');
    const message = await db.Message.create({
      senderId,
      receiverId,
      content,
      conversationId: conversation.id,
      roomId: conversation.roomId,
      messageType,
    });
    console.info('Send notification')
    await sendNotification({
      userId: receiverId,
      senderId,
      type: "message",
      message: `${senderUserName} vous a envoyé un message`,
      io,
    });

    return apiSuccess(res, "Message envoyé avec succés", { message }, 201);
  } catch (error) {
    console.error("Erreur lors de la création du message:", error);
    return apiError(res, "Une erreur est survenue", 500);
  }
};

const getMessagesByRoomId = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const messages = await db.Message.findAll({
      where: { roomId },
      include: [
        { model: db.User, as: "sender", attributes: ["id", "username", "profilPicture"] },
        { model: db.User, as: "receiver", attributes: ["id", "username", "profilPicture"] },
      ],
    });

    return apiSuccess(res, "", messages, 200);
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
