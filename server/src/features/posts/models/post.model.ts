import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface PostAttributes {
  id: string;
  userId: string;
  content?: string;
  commentsCount?: number;
  media?: string | null;
  originalPostId?: string | null;
  originalCommentId?: string | null;
  views?: number;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: string;
  public userId!: string;
  public content!: string;
  public media!: string | null;
  public commentsCount!: number;
  public originalPostId!: string | null;
  public originalCommentId?: string | null | undefined;
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
      originalPostId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'posts',
          key: 'id',
        },
      },
      originalCommentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'comments',
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
