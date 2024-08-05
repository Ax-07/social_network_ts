import { Optional } from "sequelize";
import { CommentAttributes } from "../../models/comment.model";

interface CommentEntry extends Optional<CommentAttributes, "id"> {};

const validateCommentEntry = (entry: CommentEntry) => {
    const errors: string[] = [];

    if (entry.postId && (typeof entry.postId !== 'string' || entry.postId.length === 0)) {
        errors.push('PostId must be a non-empty string');
    }

    if (entry.userId && (typeof entry.userId !== 'string' || entry.userId.length === 0)) {
        errors.push('UserId must be a non-empty string');
    }

    if (entry.content && (typeof entry.content !== 'string' || entry.content.length === 0)) {
        errors.push('Content must be a non-empty string');
    }

    if (entry.picture && (typeof entry.picture !== 'string' || !/^https?:\/\/\S+\.\S+$/.test(entry.picture))) {
        errors.push('Picture must be a string');
    }

    if (entry.video && (typeof entry.video !== 'string' || !/^https?:\/\/\S+\.\S+$/.test(entry.video))) {
        errors.push('Video must be a string');
    }

    return errors;
}

export default validateCommentEntry;