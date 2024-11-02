export interface User {
    id: string; // Identifiant unique de l'utilisateur
    googleId?: string; // Identifiant Google pour l'authentification OAuth
    username: string; // Nom d'utilisateur
    handle?: string; // nom d'utilisateur unique
    email?: string; // Adresse e-mail
    password: string; // Mot de passe haché
    profilPicture?: string; // Image de profil
    coverPicture?: string; // Image de couverture
    bio?: string; // Biographie
    birthdate?: Date; // Date de naissance
    followers?: {id: string, username: string, profilPicture: string, handle: string}[]; // Liste des abonnés
    followings?: {id: string, username: string, profilPicture: string, handle: string}[]; // Liste des abonnements
    bookmarks?: UserBookmarks[]; // Liste des signets (id est l'id du post)
    notifications?: { type: string; message: string; postId: string }[]; // Liste des notifications
    createdAt?: Date; // Date de création
}

export interface UserEntry {
    username: string; // Nom d'utilisateur
    email: string; // Adresse e-mail
    password: string; // Mot de passe haché
    profilPicture?: string; // Image de profil
    coverPicture?: string; // Image de couverture
    bio?: string; // Biographie
    birthdate?: Date; // Date de naissance
}

export interface UserFollow {
    followerId: string; // Identifiant de l'utilisateur qui suit
    followedId: string; // Identifiant de l'utilisateur suivi
}

export interface UserBookmarks {
    userId: string; // Identifiant de l'utilisateur
    postId?: string; // Identifiant de la publication
    commentId?: string; // Identifiant du commentaire
}

export interface UserResponseArray {
    status: string;
    data: User[];
    message: string;
}

export interface UserResponse {
    status: string;
    data: User;
    message: string;
}



export interface FollowersNamesRequest {
    status: string;
    data: {followersNames: string[];} 
    message: string;
}

export interface WhoToFollowResponse {
    status: string;
    data: {
        id: string,
        username: string,
        profilPicture: string,
    }[];
    message: string;
}