import { Optional } from "sequelize";
import { PostAttributes } from "../../../models/posts/post.model";

interface PostEntry extends Optional<PostAttributes, "id"> {};

const validatePostEntry = (entry: PostEntry) => {
    const errors: string[] = [];

    if (entry.userId && (typeof entry.userId !== 'string' || entry.userId.length === 0)) {
        errors.push('UserId must be a non-empty string');
    }

    if (entry.content && (typeof entry.content !== 'string' || entry.content.length === 0)) {
        errors.push('Content must be a non-empty string');
    }

    if (entry.media && (typeof entry.media !== 'string' || (!entry.media.startsWith('http://') && !entry.media.startsWith('https://')))) {
        errors.push('Media must be a valid URL');
    }

    if (entry.originalPostId && (typeof entry.originalPostId !== 'string')) {
        errors.push(`OriginalPostId must be a non-empty string, entry is ${typeof entry.originalPostId}`);
    }

    if (entry.originalCommentId && (typeof entry.originalCommentId !== 'string')) {
        errors.push(`OriginalCommentId must be a non-empty string, entry is ${typeof entry.originalCommentId}`);
    }

    return errors;
}

export default validatePostEntry;