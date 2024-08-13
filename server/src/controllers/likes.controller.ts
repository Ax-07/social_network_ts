import { Request, Response } from "express";
import db from "../models";
import { handleControllerError } from '../utils/errors/controllers.error';
import validateLikeEntry from "../utils/functions/validateLikeEntry";

const likePost = async (req: Request, res: Response) => {
    const { postId, likerId } = req.body; console.log(req.body);
    const errors = validateLikeEntry(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation error', errors });
    }

    try {
        if (!postId || !likerId) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        const post = await db.Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const liker = await db.User.findByPk(likerId);
        if (!liker) {
            return res.status(404).json({ message: 'User not found' });
        }

        let likers;
        if (post.likers?.includes(likerId)) {
            // Retirer le like
            likers = post.likers.filter(id => id !== likerId);
            await post.update({ likers: likers });
            return res.status(200).json({ message: 'Post unliked successfully', likers });
        } else {
            // Ajouter le like
            likers = [...(post.likers || []), likerId];
            await post.update({ likers: likers });
            return res.status(200).json({ message: 'Post liked successfully', likers });
        }
    } catch (error) {
        handleControllerError(res, error, 'An error occurred while liking the post.');
    }
};

const likeComment = async (req: Request, res: Response) => {
    const { commentId, likerId } = req.body;

    try {
        if (!commentId || !likerId) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        const comment = await db.Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        const liker = await db.User.findByPk(likerId);
        if (!liker) {
            return res.status(404).json({ message: 'User not found' });
        }

        let likers;
        if (comment.likers?.includes(likerId)) {
            // Retirer le like
            likers = comment.likers.filter(id => id !== likerId);
            await comment.update({ likers: likers });
            return res.status(200).json({ message: 'Comment unliked successfully', likers });
        } else {
            // Ajouter le like
            likers = [...(comment.likers || []), likerId];
            await comment.update({ likers: likers });
            return res.status(200).json({ message: 'Comment liked successfully', likers });
        }
    } catch (error) {
        handleControllerError(res, error, 'An error occurred while liking the comment.');
    }
};

export { likePost, likeComment };