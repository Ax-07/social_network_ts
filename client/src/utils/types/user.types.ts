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
    followers?: string[]; // Liste des abonnés
    followings?: string[]; // Liste des abonnements
    bookmarks?: string[]; // Liste des signets
    notifications?: { type: string; message: string; postId: string }[]; // Liste des notifications
    createdAt?: Date; // Date de création
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
