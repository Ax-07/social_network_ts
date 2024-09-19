import { Sequelize, DataTypes, Model, Optional } from "sequelize";

// Interface des attributs de Conversation (représente les colonnes de la table)
interface ConversationAttributes {
  id: string; // Identifiant unique de la conversation
  adminId: string; // Identifiant de l'utilisateur qui a créé la conversation
  title?: string; // Nom de la conversation (facultatif pour les groupes)
  roomId?: string; // Identifiant de la conversation (utilisé pour les messages)
  isGroup: boolean; // Indique s'il s'agit d'une conversation de groupe ou privée
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface pour la création de conversations (le champ 'id' est optionnel)
interface ConversationCreationAttributes extends Optional<ConversationAttributes, 'id'> {}

// Définition du modèle Conversation
class Conversation extends Model<ConversationAttributes, ConversationCreationAttributes> implements ConversationAttributes {
  public id!: string;
  public adminId!: string;
  public title!: string;
  public roomId!: string;
  public isGroup!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Fonction d'initialisation du modèle Conversation
const initializeConversationModel = (sequelize: Sequelize): typeof Conversation => {
  Conversation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Génère automatiquement un UUID
        primaryKey: true, // Définit comme clé primaire
      },
      adminId: {
        type: DataTypes.STRING, // Identifiant de l'utilisateur qui a créé la conversation
        allowNull: false,
      },
      roomId: {
        type: DataTypes.STRING, // Identifiant de la conversation
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING, // Nom de la conversation (utile pour les groupes)
        allowNull: true, // Optionnel pour les conversations privées
      },
      isGroup: {
        type: DataTypes.BOOLEAN, // Vrai si c'est une conversation de groupe
        allowNull: true,
        defaultValue: false, // Faux pour les conversations privées
      },
    },
    {
      sequelize,
      modelName: 'conversation', // Nom du modèle
      tableName: 'conversations', // Nom de la table dans la base de données
    }
  );
  return Conversation;
};

export { Conversation, ConversationAttributes, initializeConversationModel };
