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
        await post.update({ likers: [...(post.likers || []), likerId] });
        
        res.status(200).json({ message: 'Post liked successfully' });

    } catch (error) {
        handleControllerError(res, error, 'An error occurred while liking the post.');
    }
};

const unlikePost = async (req: Request, res: Response) => {
    const { postId, likerId } = req.body;
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
        await post.update({ likers: post.likers?.filter((id) => id !== likerId) });
        
        res.status(200).json({ message: 'Post unliked successfully' });

    } catch (error) {
        handleControllerError(res, error, 'An error occurred while unliking the post.');
    }
};

const dislikePost = async (req: Request, res: Response) => {
    const { postId, dislikerId } = req.body;
    const errors = validateLikeEntry(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation error', errors });
    }
    try {
        if (!postId || !dislikerId) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        const post = await db.Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const disliker = await db.User.findByPk(dislikerId);
        if (!disliker) {
            return res.status(404).json({ message: 'User not found' });
        }
        await post.update({ dislikers: [...(post.dislikers || []), dislikerId] });
        
        res.status(200).json({ message: 'Post disliked successfully' });

    } catch (error) {
        handleControllerError(res, error, 'An error occurred while disliking the post.');
    }
};

const unDislikePost = async (req: Request, res: Response) => {
    const { postId, dislikerId } = req.body;
    const errors = validateLikeEntry(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation error', errors });
    }
    try {
        if (!postId || !dislikerId) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        const post = await db.Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const disliker = await db.User.findByPk(dislikerId);
        if (!disliker) {
            return res.status(404).json({ message: 'User not found' });
        }
        await post.update({ dislikers: post.dislikers?.filter((id) => id !== dislikerId) });
        
        res.status(200).json({ message: 'Post undisliked successfully' });

    } catch (error) {
        handleControllerError(res, error, 'An error occurred while undisliking the post.');
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
        await comment.update({ likers: [...(comment.likers || []), likerId] });
        
        res.status(200).json({ message: 'Comment liked successfully' });

    } catch (error) {
        handleControllerError(res, error, 'An error occurred while liking the comment.');
    }
};

const unlikeComment = async (req: Request, res: Response) => {
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
        await comment.update({ likers: comment.likers?.filter((id) => id !== likerId) });
        
        res.status(200).json({ message: 'Comment unliked successfully' });

    } catch (error) {
        handleControllerError(res, error, 'An error occurred while unliking the comment.');
    }
};

export { likePost, unlikePost, dislikePost, unDislikePost, likeComment, unlikeComment };