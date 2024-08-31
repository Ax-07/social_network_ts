import { DataTypes, Model, Optional, Sequelize } from "sequelize";

// Définition des attributs du modèle Notification
interface NotificationAttributes {
  id: string;
  userId: string; // ID de l'utilisateur qui reçoit la notification
  type: string; // Type de notification ('comment', 'like', etc.)
  message: string; // Message de la notification
  isRead: boolean; // Si la notification a été lue
  postId?: string; // ID du post concerné (optionnel)
  commenterId?: string; // ID de l'utilisateur qui a commenté (optionnel)
  commentId?: string; // ID du commentaire concerné (optionnel)
  createdAt?: Date; // Date de création
  updatedAt?: Date; // Date de mise à jour
}

// Définition des attributs optionnels (pour la création)
interface NotificationCreationAttributes
  extends Optional<NotificationAttributes, "id" | "isRead"> {}

// Modèle Notification
class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: string;
  public userId!: string;
  public commenterId?: string;
  public type!: string;
  public message!: string;
  public isRead!: boolean;
  public postId?: string;
  public commentId?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialisation du modèle
const initializeNotificationModel = (
  sequelize: Sequelize
): typeof Notification => {
  Notification.init(
    {
      id: {
        type: DataTypes.UUID, // Utilisation de UUID pour l'unicité
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID, // ID de l'utilisateur destinataire
        allowNull: false,
        references: {
          model: "Users", // Référence à la table des utilisateurs
          key: "id",
        },
      },
      commenterId: {
        type: DataTypes.UUID, // ID de l'utilisateur qui a commenté (optionnel)
        allowNull: true,
        references: {
          model: "Users", // Référence à la table des utilisateurs
          key: "id",
        },
      },
      type: {
        type: DataTypes.STRING, // Type de la notification
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING, // Message descriptif de la notification
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN, // Statut de lecture de la notification
        defaultValue: false,
      },
      postId: {
        type: DataTypes.UUID, // ID du post concerné (optionnel)
        allowNull: true,
        references: {
          model: "Posts", // Référence à la table des posts
          key: "id",
        },
      },
      commentId: {
        type: DataTypes.UUID, // ID du commentaire concerné (optionnel)
        allowNull: true,
        references: {
          model: "Comments", // Référence à la table des commentaires
          key: "id",
        },
      },
      createdAt: {
        type: DataTypes.DATE, // Date de création
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE, // Date de mise à jour
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Notification", // Nom du modèle
      tableName: "Notifications", // Nom de la table
      timestamps: true, // Pour gérer automatiquement createdAt et updatedAt
    }
  );

  return Notification;
};

export { Notification, initializeNotificationModel };
