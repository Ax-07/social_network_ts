import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcrypt";

// Définir les attributs du modèle utilisateur
interface UserAttributes {
  id: string; // Identifiant unique de l'utilisateur
  googleId?: string; // Identifiant Google pour l'authentification OAuth
  username: string; // Nom d'utilisateur
  handle?: string; // Nom d'utilisateur unique
  email?: string; // Adresse e-mail
  password: string; // Mot de passe haché
  profilPicture?: string; // Image de profil
  coverPicture?: string; // Image de couverture
  bio?: string; // Biographie
  birthdate?: Date; // Date de naissance
  followers?: string[]; // Liste des abonnés
  followings?: string[]; // Liste des abonnements
  bookmarks?: string[]; // Liste des signets
}

// Certaines propriétés peuvent être optionnelles lors de la création
// Par exemple, 'id' sera auto-généré par la base de données
interface UserCreationAttributes extends Optional<UserAttributes, "id" | "handle"> {}

// Définir le modèle utilisateur en étendant la classe Sequelize Model
// Cela permet de bénéficier de la complétion de code et des vérifications de type
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string; // Le point d'exclamation indique que cette propriété est toujours définie après initialisation
  public googleId!: string;
  public username!: string;
  public handle!: string;
  public email!: string;
  public password!: string;
  public profilPicture!: string;
  public coverPicture!: string;
  public bio!: string;
  public birthdate!: Date;
  public followers?: string[];
  public followings?: string[];
  public bookmarks?: string[];

  // Timestamps pour les opérations de création et de mise à jour
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  // Méthode pour comparer le mot de passe haché avec un mot de passe en clair
  public comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
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
      handle: {
        type: DataTypes.STRING, // Type de donnée pour le nom d'utilisateur unique
        allowNull: true, // Champ facultatif
        unique: true, // Valeur unique
      },
      email: {
        type: DataTypes.STRING, // Type de donnée pour l'adresse e-mail
        allowNull: true, // Champ facultatif
        unique: true, // Valeur unique
        validate: {
          isEmail: true, // Validation de l'adresse e-mail
        },
      },
      password: {
        type: DataTypes.STRING, // Type de donnée pour le mot de passe
        allowNull: false, // Champ obligatoire
      },
      profilPicture: {
        type: DataTypes.STRING, // Type de donnée pour l'image de profil
        allowNull: true, // Champ facultatif
      },
      coverPicture: {
        type: DataTypes.STRING, // Type de donnée pour l'image de couverture
        allowNull: true, // Champ facultatif
      },
      bio: {
        type: DataTypes.STRING, // Type de donnée pour la biographie
        allowNull: true, // Champ facultatif
      },
      birthdate: {
        type: DataTypes.DATE, // Type de donnée pour la date de naissance
        allowNull: true, // Champ facultatif
      },
      followers: {
        type: DataTypes.JSON, // Type de donnée pour la liste des abonnés
        allowNull: true, // Champ facultatif
        defaultValue: [], // Valeur par défaut vide
      },
      followings: {
        type: DataTypes.JSON, // Type de donnée pour la liste des abonnements
        allowNull: true, // Champ facultatif
        defaultValue: [], // Valeur par défaut vide
      },
      bookmarks: {
        type: DataTypes.JSON, // Type de donnée pour la liste des signets
        allowNull: true, // Champ facultatif
        defaultValue: [], // Valeur par défaut vide
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
  // Hook pour hacher le mot de passe avant la mise à jour de l'utilisateur
  User.beforeUpdate(async (user: User) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10); // Hachage du mot de passe avec un coût de 10
    }
  });

  return User; // Retourne le modèle utilisateur initialisé
};

export { User, UserAttributes, initializeUserModel }; // Exportation de la fonction pour pouvoir l'utiliser ailleurs dans votre application
