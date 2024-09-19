import { Request, Response } from "express";
import db from "../../../db/models";
import { apiError, apiSuccess } from "../../../utils/functions/apiResponses";
import { Op } from "sequelize";

const getConversationsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const conversations = await db.Conversation.findAll({
      include: [
        {
          model: db.Message,
          as: "messages",
          where: {
            [Op.or]: [{ senderId: userId }, { receiverId: userId }],
          },
          attributes: [
            "id",
            "content",
            "senderId",
            "receiverId",
            "createdAt",
            "updatedAt",
          ],
          required: true,
        },
        {
          model: db.User,
          as: "admin",
          attributes: ["id", "username", "email", "profilPicture"],
        },
      ],
    });
    return apiSuccess(res, "", conversations, 200);
  } catch (error) {
    console.log('error:', error);
    return apiError(res, "", 500);
  }
};

export { getConversationsByUserId };
