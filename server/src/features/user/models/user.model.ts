import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Définir les attributs du modèle utilisateur
interface UserAttributes {
  id: string; // Identifiant unique de l'utilisateur
  googleId?: string; // Identifiant Google pour l'authentification OAuth
  username?: string; // Nom d'utilisateur
  handle?: string; // Nom d'utilisateur unique
  email: string; // Adresse e-mail
  password: string; // Mot de passe haché
  profilPicture?: string; // Image de profil
  coverPicture?: string; // Image de couverture
  bio?: string; // Biographie
  birthdate?: Date; // Date de naissance
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "handle"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{

  // attributs du modèle utilisateur
  public id!: string;
  public googleId!: string;
  public username!: string;
  public handle!: string;
  public email!: string;
  public password!: string;
  public profilPicture!: string;
  public coverPicture!: string;
  public bio!: string;
  public birthdate!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Méthode
  // Méthode pour comparer le mot de passe de l'utilisateur
  public comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
  // Méthode pour générer un token de réinitialisation de mot de passe
  public generatePasswordResetToken(): string {
    const token = jwt.sign(
      { id: this.id },
      process.env.JWT_SECRET!, 
      { expiresIn: "1h" }
    );
    return token;
  }
}

const initializeUserModel = (sequelize: Sequelize): typeof User => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      handle: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profilPicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      coverPicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birthdate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      modelName: "user",
      tableName: "users",
      sequelize,
    }
  );

  User.beforeCreate(async (user: User) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

  User.beforeUpdate(async (user: User) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  // User.beforeFind(async (options) => {
  //   options.attributes = {
  //     exclude: ["password"],
  //   };
  // });

  return User;
};

export { User, UserAttributes, initializeUserModel };
