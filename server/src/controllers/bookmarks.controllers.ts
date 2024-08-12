import { Request, Response } from 'express';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';

const addToBookmarks = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { postId } = req.body;

  if (!userId || !postId) {
    return res.status(400).json({ error: 'Entry error', message: 'userId and postId are required' });
  }

  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post = await db.Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const bookmarks = user.bookmarks || [];
    if (!bookmarks.includes(postId)) {
      bookmarks.push(postId);
      await user.update({ bookmarks });
    }

    res.status(201).json({ message: 'Post added to bookmarks', user });
  } catch (error) {
    handleControllerError(res, error, 'An error occurred while adding post to bookmarks');
  }
};

export { addToBookmarks };
