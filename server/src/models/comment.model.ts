// src/models/comment.model.ts
import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface CommentAttributes {
  id: number;
  postId: string;
  userId: string;
  content: string;
  picture?: string;
  video?: string;
  likers?: string[];
  dislikers?: string[];
}

interface CommentCreationAttributes extends Optional<CommentAttributes, "id"> {}

class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  public id!: number;
  public postId!: string;
  public userId!: string;
  public content!: string;
  public picture!: string;
  public video!: string;
  public likers!: string[];
  public dislikers!: string[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initializeCommentModel = (sequelize: Sequelize): typeof Comment => {
  Comment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      postId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
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
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: 0,
      },
      dislikers: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "comments",
      sequelize,
    }
  );

  return Comment;
};

export { Comment, initializeCommentModel };
