import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface GroupAttributes {
  id: string; // UUID
  name: string; // Nom du groupe
  description: string; // Description du groupe
  postsCount: number; // Nombre de publications
  views: number; // Nombre de vues du groupe 
}

interface GroupCreationAttributes extends Optional<GroupAttributes, "id"> {}

class Group
  extends Model<GroupAttributes, GroupCreationAttributes>
  implements GroupAttributes
{
  public id!: string;
  public name!: string;
  public description!: string;
  public postsCount!: number;
  public views!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initializeGroupModel = (sequelize: Sequelize): typeof Group => {
  Group.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      postsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "groups",
    }
  );

  return Group;
};

export { Group, GroupAttributes, initializeGroupModel };