import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface EvenementAttributes {
  id: string;
  userId: string;
  postId: string;
  title: string;
  description: string;
  startDate: Date;
  location: string;
  media?: string | null;
}

interface EvenementCreationAttributes extends Optional<EvenementAttributes, 'id'> {}

class Evenement extends Model<EvenementAttributes, EvenementCreationAttributes> implements EvenementAttributes {
  public id!: string;
  public userId!: string;
  public postId!: string;
  public title!: string;
  public description!: string;
  public startDate!: Date;
  public location!: string;
  public media!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initializeEvenementModel = (sequelize: Sequelize): typeof Evenement => {
  Evenement.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      postId: {
        type: DataTypes.UUID,
        allowNull: false,
          references: {
          model: 'posts',
          key: 'id',
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      media: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'evenements',
    }
  );

  return Evenement;
};

export { Evenement, EvenementAttributes, initializeEvenementModel };