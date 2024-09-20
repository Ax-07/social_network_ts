import { User } from "./user.types";

export interface MessageTypes {
    id: string; // Identifiant unique du message
    senderId: string; // ID de l'utilisateur qui envoie le message
    sender: User; // Utilisateur qui envoie le message
    receiverId: string; // ID de l'utilisateur qui reçoit le message
    receiver: User; // Utilisateur qui reçoit le message
    content?: string; // Contenu du message
    media?: string | null; // Fichier média (image, vidéo, etc.)
    roomId: string; // ID de la salle de chat
    isRead?: boolean; // Indique si le message a été lu
    isReceived?: boolean; // Indique si le message a été reçu
    isSent?: boolean; // Indique si le message a été envoyé
    parentId?: string | null; // Pour permettre les réponses à un autre message
    expiresAt?: Date | null;  // Date d'expiration du message
    isDeleted?: boolean;      // Indique si le message a été supprimé
    type: 'text' | 'media' | 'notification' | 'system'; // Type de message 
    deliveredAt?: Date | null;  // Horodatage de la livraison
    receivedAt?: Date | null;   // Horodatage de la réception
    readAt?: Date | null;       // Horodatage de la lecture
    reaction?: Record<string, number>; // Réactions (ex: {"like": 3, "laugh": 5})
    mentions?: string[];        // Liste des utilisateurs mentionnés
    isEncrypted?: boolean;      // Indique si le message est chiffré
    encryptionType?: string | null; // Type de chiffrement (si applicable)
    deletedForUserIds?: string[]; // Liste des utilisateurs ayant supprimé ce message
    editedAt?: Date | null;     // Date de la dernière modification
    createdAt?: Date;           // Date de création
    updatedAt?: Date;           // Date de mise à jour
}

export interface MessageState {
    roomId: string;
    messages: MessageTypes[];
    loading: boolean;
    error: string | null;
}

export const initialState: MessageState = {
    roomId: '',
    messages: [],
    loading: false,
    error: null,
};

export interface MessageResponse {
    status: string;
    data: MessageTypes;
    message: string;
}

export interface MessageResponseArray {
    status: string;
    data: MessageTypes[];
    message: string;
}