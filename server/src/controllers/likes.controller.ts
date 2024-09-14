import { Request, Response } from "express";
import db from "../models";
import { handleControllerError } from '../utils/errors/controllers.error';
import validateLikeEntry from "../utils/functions/validations/validateLikeEntry";
import { apiError, apiSuccess } from "../utils/functions/apiResponses";

const likePost = async (req: Request, res: Response) => {
    const { postId, likerId } = req.body;
    if (!postId || !likerId) {
        return apiError(res, 'Missing fields', 400);
    }
    const errors = validateLikeEntry(req.body);
    if (errors.length > 0) {
        return apiError(res, 'Validation error ici', errors, 400);
    }

    try {

        const post = await db.Post.findByPk(postId);
        if (!post) {
            return apiError(res, 'Post not found', 404);
        }

        const liker = await db.User.findByPk(likerId);
        if (!liker) {
            return apiError(res, 'User not found', 404);
        }

        // Vérifiez si l'utilisateur a déjà aimé ce post
        const existingLike = await db.PostLike.findOne({
            where: { postId: postId, userId: likerId },
        });

        if (existingLike) {
            // Retirer le like
            await existingLike.destroy();
            const likers = await db.PostLike.findAll({ where: { postId: postId } });
            return apiSuccess(res, 'Post unliked successfully', {
                likers: likers.map((like) => like.userId),
            }, 200);
        } else {
            // Ajouter le like
            await db.PostLike.create({ postId: postId, userId: likerId });
            const likers = await db.PostLike.findAll({ where: { postId: postId } });
            return apiSuccess(res, 'Post liked successfully', {
                likers: likers.map((like) => like.userId),
            }, 200);
        }
    } catch (error) {
        console.log("error", error)
        return handleControllerError(res, error, 'An error occurred while liking the post.');
    }
};

const likeComment = async (req: Request, res: Response) => {
    const { commentId, likerId } = req.body;
    if (!commentId || !likerId) {
        return apiError(res, 'Missing fields', 400);
    }
    const errors = validateLikeEntry(req.body);
    if (errors.length > 0) {
        return apiError(res, 'Validation error ici', errors, 400);
    }

    try {
        const comment = await db.Comment.findByPk(commentId);
        if (!comment) {
            return apiError(res, 'Comment not found', 404);
        }

        const liker = await db.User.findByPk(likerId);
        if (!liker) {
            return apiError(res, 'User not found', 404);
        }

        // Vérifiez si l'utilisateur a déjà aimé ce commentaire
        const existingLike = await db.CommentLike.findOne({
            where: { commentId: commentId, userId: likerId },
        });

        if (existingLike) {
            // Retirer le like
            await existingLike.destroy();
            const likers = await db.CommentLike.findAll({ where: { commentId: commentId } });
            return apiSuccess(res, 'Comment unliked successfully', {
                likers: likers.map((like) => like.userId),
            }, 200);
        } else {
            // Ajouter le like
            await db.CommentLike.create({ commentId: commentId, userId: likerId });
            const likers = await db.CommentLike.findAll({ where: { commentId: commentId } });
            return apiSuccess(res, 'Comment liked successfully', {
                likers: likers.map((like) => like.userId),
            }, 200);
        }
    } catch (error) {
        console.log("error", error)
        return handleControllerError(res, error, 'An error occurred while liking the comment.');
    }
};

export { likePost, likeComment };