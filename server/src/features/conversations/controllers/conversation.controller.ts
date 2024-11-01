import { Request, Response } from "express";
import db from "../../../db/models";
import { apiError, apiSuccess } from "../../../utils/functions/apiResponses";
import { Op } from "sequelize";

const getConversationsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const groupMembers = await db.GroupMember.findAll({
      where: { userId },
      attributes: ["conversationId", "userId"],
    });
    console.table(groupMembers);


    const conversations = await db.Conversation.findAll({
      where: {id: groupMembers.map((groupMember) => groupMember.conversationId)
      },
      include: [
        {
          model: db.Message,
          as: "messages",
          where: { conversationId: { [Op.in]: groupMembers.map((groupMember) => groupMember.conversationId) }
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
    console.table(conversations);
    return apiSuccess(res, "", conversations, 200);
  } catch (error) {
    console.log('error:', error);
    return apiError(res, "", 500);
  }
};

export { getConversationsByUserId };
