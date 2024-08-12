// src/models/comment.model.ts
import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface CommentAttributes {
  id: number;
  postId: string;
  userId: string;
  content: string;
  media?: string;
  likers?: string[];
  dislikers?: string[];
  commentedPostId?: string;
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
  public media!: string;
  public likers!: string[];
  public dislikers!: string[];
  public commentedPostId!: string;

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
        references: {
          model: "posts",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      media: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      likers: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: 0,
      },
      dislikers: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: 0,
      },
      commentedPostId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "posts",
          key: "id",
        },
      },
    },
    {
      tableName: "comments",
      sequelize,
    }
  );

  return Comment;
};

export { Comment, CommentAttributes, initializeCommentModel };
