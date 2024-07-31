import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcrypt";

// Définir les attributs du modèle utilisateur
interface UserAttributes {
  id: number; // Identifiant unique de l'utilisateur
  googleId: string; // Identifiant Google pour l'authentification OAuth
  username: string; // Nom d'utilisateur
  password: string; // Mot de passe haché
}

// Certaines propriétés peuvent être optionnelles lors de la création
// Par exemple, 'id' sera auto-généré par la base de données
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

// Définir le modèle utilisateur en étendant la classe Sequelize Model
// Cela permet de bénéficier de la complétion de code et des vérifications de type
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number; // Le point d'exclamation indique que cette propriété est toujours définie après initialisation
  public googleId!: string;
  public username!: string;
  public password!: string;

  // Timestamps pour les opérations de création et de mise à jour
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Fonction pour initialiser le modèle utilisateur
const initializeUserModel = (sequelize: Sequelize): typeof User => {
  // Initialisation du modèle avec les attributs et les options nécessaires
  User.init(
    {
      id: {
        type: DataTypes.UUID, // Type de donnée pour l'identifiant
        defaultValue: DataTypes.UUIDV4, // Valeur par défaut auto-générée
        primaryKey: true, // Clé primaire
      },
      googleId: {
        type: DataTypes.STRING, // Type de donnée pour l'identifiant Google
        allowNull: true, // Champ facultatif
        unique: true, // Valeur unique
      },
      username: {
        type: DataTypes.STRING, // Type de donnée pour le nom d'utilisateur
        allowNull: false, // Champ obligatoire
        unique: true, // Valeur unique
      },
      password: {
        type: DataTypes.STRING, // Type de donnée pour le mot de passe
        allowNull: false, // Champ obligatoire
      },
    },
    {
      tableName: "users", // Nom de la table dans la base de données
      sequelize, // Instance de Sequelize pour l'initialisation
    }
  );

  // Hook pour hacher le mot de passe avant la création de l'utilisateur
  // Cette fonction est exécutée automatiquement par Sequelize avant de sauvegarder un nouvel utilisateur dans la base de données
  User.beforeCreate(async (user: User) => {
    user.password = await bcrypt.hash(user.password, 10); // Hachage du mot de passe avec un coût de 10
  });

  return User; // Retourne le modèle utilisateur initialisé
};

export { User, initializeUserModel }; // Exportation de la fonction pour pouvoir l'utiliser ailleurs dans votre application
