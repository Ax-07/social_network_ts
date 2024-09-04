import { Optional } from "sequelize";
import { CommentAttributes } from "../../../models/comments/comment.model";

interface CommentEntry extends Optional<CommentAttributes, "id"> {};

/**
 * Valide les données d'entrée pour la création d'un commentaire.
 * 
 * Cette fonction vérifie si les champs du commentaire respectent les conditions requises, telles que la présence de chaînes non vides et les formats corrects pour les URLs de média. 
 * Elle renvoie un tableau d'erreurs si des validations échouent.
 *
 * @function validateCommentEntry
 * @param {CommentEntry} entry - L'objet représentant les attributs du commentaire à valider.
 * @returns {string[]} Un tableau contenant les messages d'erreur de validation. Le tableau est vide si toutes les validations passent.
 * 
 * @property {string} [entry.postId] - L'ID du post auquel le commentaire est lié. Doit être une chaîne non vide si présent.
 * @property {string} [entry.commentId] - L'ID du commentaire auquel ce commentaire est une réponse. Doit être une chaîne non vide si présent.
 * @property {string} [entry.userId] - L'ID de l'utilisateur créant le commentaire. Doit être une chaîne non vide.
 * @property {string} [entry.content] - Le contenu du commentaire. Doit être une chaîne non vide.
 * @property {string} [entry.media] - L'URL du média associé au commentaire. Si présent, doit être une URL valide.
 * @property {string} [entry.commentedPostId] - L'ID du post commenté en cas de repost. Doit être une chaîne non vide si présent.
 * @property {string} [entry.commentedCommentId] - L'ID du commentaire parent en cas de réponse à un commentaire. Doit être une chaîne non vide si présent.
 * 
 * @example
 * const errors = validateCommentEntry({
 *   postId: "123",
 *   userId: "456",
 *   content: "This is a comment",
 *   media: "http://example.com/media.jpg"
 * });
 * if (errors.length > 0) {
 *   console.log("Validation errors:", errors);
 * }
 */
const validateCommentEntry = (entry: CommentEntry): string[] => {
    const errors: string[] = [];

    if ((entry.postId && !entry.commentId) &&  (typeof entry.postId !== 'string' || entry.postId.length === 0)) {
        errors.push('PostId must be a non-empty string');
    }

    if ((entry.commentId && !entry.postId) && (typeof entry.commentId !== 'string' || entry.commentId.length === 0)) {
        errors.push('CommentId must be a non-empty string');
    }

    if (entry.userId && (typeof entry.userId !== 'string' || entry.userId.length === 0)) {
        errors.push('UserId must be a non-empty string');
    }

    if (entry.content && (typeof entry.content !== 'string' || entry.content.length === 0)) {
        errors.push('Content must be a non-empty string');
    }

    if (entry.media && (typeof entry.media !== 'string' || !/^https?:\/\/\S+\.\S+$/.test(entry.media))) {
        errors.push('Media must be a string');
    }

    if (entry.commentedPostId && (typeof entry.commentedPostId !== 'string' || entry.commentedPostId.length === 0)) {
        errors.push('CommentedPostId must be a non-empty string');
    }

    if (entry.commentedCommentId && (typeof entry.commentedCommentId !== 'string' || entry.commentedCommentId.length === 0)) {
        errors.push('CommentedCommentId must be a non-empty string');
    }

    return errors;
}

export default validateCommentEntry;