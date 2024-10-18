import { Request, Response } from "express";
import db from "../../../db/models";
import { handleControllerError } from "../../../utils/errors/controllers.error";
import { apiError, apiSuccess } from "../../../utils/functions/apiResponses";
import { io } from "../../notifications/services";
import { sendNotification } from "../../notifications/utils/sendNotification";

const responseToQuestion = async (req: Request, res: Response) => {
    const questionId = req.params.id;
    const { userId, answer } = req.body;
  
    if (!questionId || !answer) {
      return apiError(
        res,
        "Validation error",
        "questionId and answer are required",
        400
      );
    }
  
    try {
  
      const question = await db.Question.findByPk(questionId, {
        include: [
          {
            model: db.Post,
            as: "post",
            attributes: ["id", "userId"],
          },
        ],
      });
  
      if (!question) {
        return apiError(res, `The specified ${questionId} is not find.`, 400);
      }
  
      // incrémente votes
        const answerIndex = question.answers.findIndex(
            (a) => a.title === answer
        );
        console.table([answerIndex, question.answers]);
        if (answerIndex === -1) {
            return apiError(res, "Answer not found", 404);
        }
        question.answers[answerIndex].votes += 1;
        console.table([question.answers]);

        await db.Question.update(
            { answers: question.answers },
            { where: { id: question.id } }
        );
  
      const updatedQuestion = await db.Question.findByPk(question.id);
      console.table([updatedQuestion?.answers]);
  
      // Envoi de la notification
      await sendNotification({
        userId: question?.userId || "",
        senderId: userId,
        type: "response",
        message: "Your question has been answered",
        io,
      });
  
      return apiSuccess(res, "Answer added successfully", updatedQuestion, 201);
    } catch (error) {
      console.error(error);
      return handleControllerError(
        res,
        error,
        "An error occurred while adding the answer."
      );
    }
  }

  export { responseToQuestion };