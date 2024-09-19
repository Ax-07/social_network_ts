import { Optional } from "sequelize";
import { MessageAttributes } from "../../../features/messages/models/messages.model";

interface MessageEntry extends Optional<MessageAttributes, "id"> {}

const isValidURL = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
};

const validateMessageEntry = (entry: MessageEntry) => {
    const errors: string[] = [];

    // Validation de senderId
    if (!entry.senderId || typeof entry.senderId !== 'string' || entry.senderId.trim().length === 0) {
        errors.push('SenderId must be a non-empty string');
    }

    // Validation de receiverId
    if (!entry.receiverId || typeof entry.receiverId !== 'string' || entry.receiverId.trim().length === 0) {
        errors.push('ReceiverId must be a non-empty string');
    }

    // Validation de content (facultatif mais doit être une chaîne non vide si présent)
    if (entry.content && (typeof entry.content !== 'string' || entry.content.trim().length === 0)) {
        errors.push('Content must be a non-empty string if provided');
    }

    // Validation de media (URL valide si présent)
    if (entry.media && (typeof entry.media !== 'string' || !isValidURL(entry.media))) {
        errors.push('Media must be a valid URL if provided');
    }

    // Validation de roomId
    if (!entry.roomId || typeof entry.roomId !== 'string' || entry.roomId.trim().length === 0) {
        errors.push('RoomId must be a non-empty string');
    }

    // Validation de parentId (facultatif mais doit être une chaîne si présent)
    if (entry.parentId && typeof entry.parentId !== 'string') {
        errors.push('ParentId must be a string if provided');
    }

    // Validation de type
    if (!entry.messageType || !['text', 'media', 'notification', 'system'].includes(entry.messageType)) {
        errors.push('Type must be one of: text, media, notification, system');
    }

    // Validation de expiresAt (facultatif mais doit être une date si présent)
    if (entry.expiresAt && !(entry.expiresAt instanceof Date)) {
        errors.push('ExpiresAt must be a Date if provided');
    }

    return errors;
};

export default validateMessageEntry;