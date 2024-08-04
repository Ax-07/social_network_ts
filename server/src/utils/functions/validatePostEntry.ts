import { Optional } from "sequelize";
import { PostAttributes } from "../../models/post.model";

interface PostEntry extends Optional<PostAttributes, "id"> {};

const validatePostEntry = (entry: PostEntry) => {
    const errors: string[] = [];

    if (entry.userId && (typeof entry.userId !== 'string' || entry.userId.length === 0)) {
        errors.push('UserId must be a non-empty string');
    }

    if (entry.title && (typeof entry.title !== 'string' || entry.title.length === 0)) {
        errors.push('Title must be a non-empty string');
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

export default validatePostEntry;