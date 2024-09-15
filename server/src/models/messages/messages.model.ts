import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

// Interface des attributs de Message (représente les colonnes de la table)
interface MessageAttributes {
    id: string; // Identifiant unique du message
    senderId: string; // ID de l'utilisateur qui envoie le message
    receiverId: string; // ID de l'utilisateur qui reçoit le message
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
}

// Interface pour la création de messages (le champ 'id' est optionnel)
interface MessageCreationAttributes extends Optional<MessageAttributes, 'id'> {}

// Définition du modèle Message qui étend la classe Model de Sequelize
/**
 * Modèle de message pour la base de données
 * @param {MessageAttributes} senderId - ID de l'utilisateur qui envoie le message
 * @param {MessageAttributes} receiverId - ID de l'utilisateur qui reçoit le message
 * @param {MessageAttributes} content - Contenu du message
 * @param {MessageAttributes} media - Fichier média (image, vidéo, etc.)
 * @param {MessageAttributes} roomId - ID de la salle de chat
 * @param {MessageAttributes} isRead - Indique si le message a été lu
 * @param {MessageAttributes} isReceived - Indique si le message a été reçu
 * @param {MessageAttributes} isSent - Indique si le message a été envoyé
 * @param {MessageAttributes} parentId - ID du message parent (pour les threads)
 * @param {MessageAttributes} expiresAt - Date d'expiration du message
 * @param {MessageAttributes} isDeleted - Indique si le message a été supprimé
 * @param {MessageAttributes} type - Type de message (texte, média, notification, système)
 * @param {MessageAttributes} deliveredAt - Horodatage de la livraison
 * @param {MessageAttributes} receivedAt - Horodatage de la réception
 * @param {MessageAttributes} readAt - Horodatage de la lecture
 * @param {MessageAttributes} reaction - Réactions au message
 * @param {MessageAttributes} mentions - Utilisateurs mentionnés dans le message
 * @param {MessageAttributes} isEncrypted - Indique si le message est chiffré
 * @param {MessageAttributes} encryptionType - Type de chiffrement utilisé
 * @param {MessageAttributes} deletedForUserIds - Utilisateurs ayant supprimé le message
 * @param {MessageAttributes} editedAt - Date de la dernière modification
 * @returns {Message} - Instance du modèle Message
 * @example
 * const createMessage = db.Message.create({ userId: '123', content: 'Hello, World!', roomId: '456' });
 * 
 */
class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
    public id!: string;
    public senderId!: string;
    public receiverId!: string;
    public content!: string;
    public media!: string | null;
    public roomId!: string;
    public isRead!: boolean;
    public isReceived!: boolean;
    public isSent!: boolean;
    public parentId!: string | null;
    public expiresAt!: Date | null;
    public isDeleted!: boolean;
    public type!: 'text' | 'media' | 'notification' | 'system';
    public deliveredAt!: Date | null;
    public receivedAt!: Date | null;
    public readAt!: Date | null;
    public reaction!: Record<string, number>;
    public mentions!: string[];
    public isEncrypted!: boolean;
    public encryptionType!: string | null;
    public deletedForUserIds!: string[];
    public editedAt!: Date | null;

    // Champs gérés par Sequelize (timestamps automatiques)
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Fonction d'initialisation du modèle Message
const initializeMessageModel = (sequelize: Sequelize): typeof Message => {
    Message.init(
        {
            id: {
                type: DataTypes.UUID, // Utilise UUID pour l'identifiant
                defaultValue: DataTypes.UUIDV4, // UUID v4 généré automatiquement
                primaryKey: true, // Définit comme clé primaire
            },
            senderId: {
                type: DataTypes.UUID, // UUID de l'utilisateur qui envoie le message
                allowNull: false,
                references: {
                    model: 'users', // Fait référence à la table 'users'
                    key: 'id',
                },
            },
            receiverId: {
                type: DataTypes.UUID, // UUID de l'utilisateur qui reçoit le message
                allowNull: false,
                references: {
                    model: 'users', // Fait référence à la table 'users'
                    key: 'id',
                },
            },
            content: {
                type: DataTypes.STRING, // Contenu du message
                allowNull: true,        // Peut être nul si le message contient seulement des médias
                validate: {
                    notEmpty: true,     // Ne peut pas être vide
                }
            },
            media: {
                type: DataTypes.STRING, // URL ou chemin vers un fichier média
                allowNull: true,
            },
            roomId: {
                type: DataTypes.UUID, // UUID de la salle (chat room) où le message est envoyé
                allowNull: false,
                references: {
                    model: 'rooms', // Fait référence à la table 'rooms'
                    key: 'id',
                },
            },
            isRead: {
                type: DataTypes.BOOLEAN, // Indique si le message a été lu
                allowNull: true,
                defaultValue: false,     // Par défaut, le message n'est pas lu
            },
            isReceived: {
                type: DataTypes.BOOLEAN, // Indique si le message a été reçu
                allowNull: true,
                defaultValue: false,     // Par défaut, non reçu
            },
            isSent: {
                type: DataTypes.BOOLEAN, // Indique si le message a été envoyé
                allowNull: true,
                defaultValue: false,     // Par défaut, non envoyé
            },
            parentId: {
                type: DataTypes.UUID, // Référence au message parent (pour les threads)
                allowNull: true,
                references: {
                    model: 'messages', // Fait référence à la table 'messages'
                    key: 'id',
                },
            },
            expiresAt: {
                type: DataTypes.DATE, // Date à laquelle le message expire (pour les messages éphémères)
                allowNull: true,
            },
            isDeleted: {
                type: DataTypes.BOOLEAN, // Indique si le message a été supprimé
                allowNull: true,
                defaultValue: false,
            },
            type: {
                type: DataTypes.ENUM('text', 'media', 'notification', 'system'), // Type de message
                allowNull: false,
                defaultValue: 'text',
            },
            deliveredAt: {
                type: DataTypes.DATE, // Horodatage de la livraison du message
                allowNull: true,
            },
            receivedAt: {
                type: DataTypes.DATE, // Horodatage de la réception du message
                allowNull: true,
            },
            readAt: {
                type: DataTypes.DATE, // Horodatage de la lecture du message
                allowNull: true,
            },
            reaction: {
                type: DataTypes.JSON, // Stocke les réactions sous forme d'objet JSON
                allowNull: true,
                defaultValue: {}, // Par défaut, pas de réactions
            },
            mentions: {
                type: DataTypes.JSON, // Liste des utilisateurs mentionnés
                allowNull: true,
            },
            isEncrypted: {
                type: DataTypes.BOOLEAN, // Indique si le message est chiffré
                allowNull: false,
                defaultValue: false, // Par défaut, le message n'est pas chiffré
            },
            encryptionType: {
                type: DataTypes.STRING, // Type de chiffrement utilisé, si applicable
                allowNull: true,
            },
            deletedForUserIds: {
                type: DataTypes.JSON, // Liste des utilisateurs ayant supprimé le message
                allowNull: true,
                defaultValue: [],
            },
            editedAt: {
                type: DataTypes.DATE, // Horodatage de la dernière modification du message
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'message', // Nom du modèle
        }
    );

    return Message; // Retourne la classe du modèle
};

export { Message, MessageAttributes, initializeMessageModel };
