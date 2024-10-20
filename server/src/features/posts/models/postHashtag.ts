import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface PostHashtagAttributes {
  postId: string;
  hashtagId: string;
}

interface PostHashtagCreationAttributes extends Optional<PostHashtagAttributes, 'postId'> {}

class PostHashtag extends Model<PostHashtagAttributes, PostHashtagCreationAttributes> implements PostHashtagAttributes {
  public postId!: string;
  public hashtagId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initializePostHashtagModel = (sequelize: Sequelize): typeof PostHashtag => {
  PostHashtag.init(
    {
      postId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'posts',
            key: 'id',
            },
    },
    hashtagId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'hashtags',
            key: 'id',
      },
    },
    },
    {
      sequelize,
      tableName: 'post_hashtags',
      timestamps: false,
    }
  );

  return PostHashtag;
};

export { PostHashtag, PostHashtagAttributes, initializePostHashtagModel };