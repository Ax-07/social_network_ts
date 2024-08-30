import { Optional } from "sequelize";
import { PostAttributes } from "../../../models/post.model";
import { UserAttributes } from "../../../models/user.model";

interface LikeEntry extends Optional<PostAttributes & UserAttributes, "id"> {
  postId: string;
  likerId: string;
  dislikerId: string;
}

const validateLikeEntry = (entry: LikeEntry) => {
  const errors: string[] = [];

  if (entry.likerId && (typeof entry.likerId !== "string" || entry.likerId.length === 0)) {
    errors.push("LikerId must be a non-empty string");
  }

  if (entry.dislikerId && (typeof entry.dislikerId !== "string" || entry.dislikerId.length === 0)) {
    errors.push("DislikerId must be a non-empty string");
  }

  if (!entry.postId || typeof entry.postId !== "string" || entry.postId.length === 0) {
    errors.push("PostId must be a non-empty string");
  }

  return errors;
};

export default validateLikeEntry;
