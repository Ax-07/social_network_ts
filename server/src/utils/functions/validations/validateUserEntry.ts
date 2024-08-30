import { Optional } from "sequelize";
import { UserAttributes } from "../../../models/user.model";

interface UserEntry extends Optional<UserAttributes, "id"> {};

const validateUserEntry = (entry: UserEntry) => {
    const errors: string[] = [];

    if (entry.username !== undefined && (typeof entry.username !== 'string' || entry.username.length < 3 || entry.username.length > 20)) {
        errors.push('Username must be a string between 3 and 20 characters');
    }

    if (entry.email && (typeof entry.email !== 'string' || !entry.email.includes('@') || !entry.email.includes('.'))) {
        errors.push('Email must be a valid email address');
    }

    if (entry.password && (typeof entry.password !== 'string' || entry.password.length < 6 || entry.password.length > 20)) {
        errors.push('Password must be a string between 6 and 20 characters');
    }

    if (entry.profilPicture !== undefined && (typeof entry.profilPicture !== 'string' || !/^https?:\/\/\S+\.\S+$/.test(entry.profilPicture))) {
        errors.push('Profile picture must be a string');
    }

    if (entry.coverPicture !== undefined && (typeof entry.coverPicture !== 'string' || !/^https?:\/\/\S+\.\S+$/.test(entry.coverPicture))) {
        errors.push('Cover picture must be a string');
    }

    if (entry.bio !== undefined && (typeof entry.bio !== 'string' || entry.bio.length > 160)) {
        errors.push('Bio must be a string with a maximum length of 160 characters');
    }

    if (entry.followers !== undefined && !Array.isArray(entry.followers)) {
        errors.push('Followers must be an array of strings');
    }

    if (entry.followings !== undefined && !Array.isArray(entry.followings)) {
        errors.push('Followings must be an array of strings');
    }

    return errors;
}

export default validateUserEntry;