import { Request, Response } from "express";
import db from "../models";
import { handleControllerError } from '../utils/errors/controllers.error';
import validateLikeEntry from "../utils/functions/validations/validateLikeEntry";
import { apiError, apiSuccess } from "../utils/functions/apiResponses";

const likePost = async (req: Request, res: Response) => {
    const { postId, likerId } = req.body; console.log(req.body);
    const errors = validateLikeEntry(req.body);
    if (errors.length > 0) {
        return apiError(res, 'Validation error', errors, 400);
    }

    try {
        if (!postId || !likerId) {
            return apiError(res, 'Missing fields', 400);
        }
        const post = await db.Post.findByPk(postId);
        if (!post) {
            return apiError(res, 'Post not found', 404);
        }
        const liker = await db.User.findByPk(likerId);
        if (!liker) {
            return apiError(res, 'User not found', 404);
        }

        let likers;
        if (post.likers?.includes(likerId)) {
            // Retirer le like
            likers = post.likers.filter(id => id !== likerId);
            await post.update({ likers: likers });
            return apiSuccess(res, 'Post unliked successfully', {likers: likers}, 200);
        } else {
            // Ajouter le like
            likers = [...(post.likers || []), likerId];
            await post.update({ likers: likers });
            return apiSuccess(res, 'Post liked successfully', {likers: likers}, 200);
        }
    } catch (error) {
        return handleControllerError(res, error, 'An error occurred while liking the post.');
    }
};

const likeComment = async (req: Request, res: Response) => {
    const { commentId, likerId } = req.body;

    try {
        if (!commentId || !likerId) {
            return apiError(res, 'Missing fields', 400);
        }
        const comment = await db.Comment.findByPk(commentId);
        if (!comment) {
            return apiError(res, 'Comment not found', 404);
        }
        const liker = await db.User.findByPk(likerId);
        if (!liker) {
            return apiError(res, 'User not found', 404);
        }

        let likers;
        if (comment.likers?.includes(likerId)) {
            // Retirer le like
            likers = comment.likers.filter(id => id !== likerId);
            await comment.update({ likers: likers });
            return apiSuccess(res, 'Comment unliked successfully', {likers: likers}, 200);
        } else {
            // Ajouter le like
            likers = [...(comment.likers || []), likerId];
            await comment.update({ likers: likers });
            return apiSuccess(res, 'Comment liked successfully', {likers: likers}, 200);
        }
    } catch (error) {
        return handleControllerError(res, error, 'An error occurred while liking the comment.');
    }
};

export { likePost, likeComment };