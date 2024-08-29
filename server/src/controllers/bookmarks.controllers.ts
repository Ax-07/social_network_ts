import { Request, Response } from 'express';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';
import { apiError, apiSuccess } from '../utils/functions/apiResponses';

const addToBookmarks = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { postId } = req.body;

  if (!userId || !postId) {
    return apiError(res, 'Missing fields', 400);
  }

  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return apiError(res, 'User not found', 404);
    }

    const post = await db.Post.findByPk(postId);
    if (!post) {
      return apiError(res, 'Post not found', 404);
    }

    let bookmarks = user.bookmarks || [];
    if (!bookmarks.includes(postId)) {
      bookmarks = [...bookmarks, postId];
      await user.update({ bookmarks: bookmarks });
      return apiSuccess(res, 'Post added to bookmarks successfully', {bookmarks: bookmarks});
    } else {
      // retire le post des bookmarks
      bookmarks = bookmarks.filter(id => id !== postId);
      await user.update({ bookmarks: bookmarks });
      return apiSuccess(res, 'Post removed from bookmarks successfully', {bookmarks: bookmarks});
    }

  } catch (error) {
    return handleControllerError(res, error, 'An error occurred while adding post to bookmarks');
  }
};

export { addToBookmarks };
