import { Sequelize, DataTypes, Model, Optional, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin } from 'sequelize';
import { Comment } from './comment.model';

interface PostAttributes {
  id: string;
  userId: string;
  content?: string;
  media?: string | null;
  likers?: string[];
  dislikers?: string[];
  reposters?: string[] | null; // Ajout du rePosterId pour les reposts
  originalPostId?: string | null;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: string;
  public userId!: string;
  public content!: string;
  public media!: string | null;
  public likers!: string[];
  public dislikers!: string[];
  public reposters!: string[] | null;
  public originalPostId!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association avec les commentaires
  public getComments!: HasManyGetAssociationsMixin<Comment>;
  public addComment!: HasManyAddAssociationMixin<Comment, number>;
  public hasComment!: HasManyHasAssociationMixin<Comment, number>;
  public countComments!: HasManyCountAssociationsMixin;
  public createComment!: HasManyCreateAssociationMixin<Comment>;
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
      likers: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      dislikers: {
        type: DataTypes.JSON,
        allowNull: true,
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
    },
    {
      tableName: 'posts',
      sequelize,
    }
  );

  return Post;
};

export { Post, PostAttributes, initializePostModel };
