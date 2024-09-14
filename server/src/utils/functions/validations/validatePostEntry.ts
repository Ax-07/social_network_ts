import { Optional } from "sequelize";
import { PostAttributes } from "../../../models/posts/post.model";

interface PostEntry extends Optional<PostAttributes, "id"> {}

const isValidURL = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
};

const validatePostEntry = (entry: PostEntry) => {
    const errors: string[] = [];

    // Validation de userId
    if (!entry.userId || typeof entry.userId !== 'string' || entry.userId.trim().length === 0) {
        errors.push('UserId must be a non-empty string');
    }

    // Validation de content (facultatif mais doit être une chaîne non vide si présent)
    if (entry.content && (typeof entry.content !== 'string' || entry.content.trim().length === 0)) {
        errors.push('Content must be a non-empty string if provided');
    }

    // Validation de media (URL valide si présent)
    if (entry.media && (typeof entry.media !== 'string' || !isValidURL(entry.media))) {
        errors.push('Media must be a valid URL if provided');
    }

    // Validation de originalPostId (facultatif mais doit être une chaîne si présent)
    if (entry.originalPostId && typeof entry.originalPostId !== 'string') {
        errors.push('OriginalPostId must be a string if provided');
    }

    // Validation de originalCommentId (facultatif mais doit être une chaîne si présent)
    if (entry.originalCommentId && typeof entry.originalCommentId !== 'string') {
        errors.push('OriginalCommentId must be a string if provided');
    }

    return errors;
};

export default validatePostEntry;
