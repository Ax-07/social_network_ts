// src/models/post.model.ts
import { Sequelize, DataTypes, Model, Optional, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin } from 'sequelize';
import { Comment } from './comment.model';

interface PostAttributes {
  id: number;
  userId: string;
  title: string;
  content: string;
  picture?: string | null;
  video?: string | null;
  likers?: string[];
  dislikers?: string[];
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;
  public userId!: string;
  public title!: string;
  public content!: string;
  public picture!: string | null;
  public video!: string | null;
  public likers!: string[];
  public dislikers!: string[];

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
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      video: {
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
    },
    {
      tableName: 'posts',
      sequelize,
    }
  );


  return Post;
};

export { Post, PostAttributes, initializePostModel };
