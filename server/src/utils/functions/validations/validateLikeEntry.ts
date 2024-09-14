import { Optional } from "sequelize";
import { PostAttributes } from "../../../models/posts/post.model";
import { UserAttributes } from "../../../models/users/user.model";

interface LikeEntry extends Optional<PostAttributes & UserAttributes, "id"> {
  postId?: string;
  commentId?: string;
  likerId: string;
  dislikerId: string;
}

const validateLikeEntry = (entry: LikeEntry) => {
  const errors: string[] = [];

  if (entry.likerId && (typeof entry.likerId !== "string" || entry.likerId.length === 0)) {
    errors.push("LikerId must be a non-empty string");
  }

  if (entry.postId && (typeof entry.postId !== "string" || entry.postId.length === 0)) {
    errors.push("PostId must be a non-empty string");
  }

  if (entry.commentId && (typeof entry.commentId !== "string" || entry.commentId.length === 0)) {
    errors.push("CommentId must be a non-empty string");
  }

  return errors;
};

export default validateLikeEntry;
