import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { UserAttributes } from '../../user/models/user.model';
import { PostAttributes } from './post.model';

interface PostLikeAttributes {
    id: string;
    userId: UserAttributes['id'];
    postId: PostAttributes['id'];
    }

interface PostLikeCreationAttributes extends Optional<PostLikeAttributes, 'id'> {}

class PostLike extends Model<PostLikeAttributes, PostLikeCreationAttributes> implements PostLikeAttributes {
    public id!: string;
    public userId!: UserAttributes['id'];
    public postId!: PostAttributes['id'];

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

const initializePostLikeModel = (sequelize: Sequelize): typeof PostLike => {
    PostLike.init(
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
        },
        {
            sequelize,
            tableName: 'post_likes',
        }
    );

    return PostLike;
};

export { PostLike, PostLikeAttributes, initializePostLikeModel};
