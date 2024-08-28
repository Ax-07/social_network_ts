import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface PostAttributes {
  id: string;
  userId: string;
  content?: string;
  commentsCount?: number;
  media?: string | null;
  likers?: string[] | null; // Ajout du likerId pour les likes
  reposters?: string[] | null; // Ajout du rePosterId pour les reposts
  originalPostId?: string | null;
  views?: number; // Ajout du nombre de vues
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: string;
  public userId!: string;
  public content!: string;
  public media!: string | null;
  public commentsCount!: number;
  public likers!: string[] | null;
  public reposters!: string[] | null;
  public originalPostId!: string | null;
  public views!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initializePostModel = (sequelize: Sequelize): typeof Post => {
  Post.init(
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
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      media: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      commentsCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      likers: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      reposters: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      originalPostId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'posts',
          key: 'id',
        },
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      }
    },
    {
      tableName: 'posts',
      sequelize,
    }
  );

  return Post;
};

export { Post, PostAttributes, initializePostModel };
