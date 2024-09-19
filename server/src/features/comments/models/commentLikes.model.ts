import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { CommentAttributes } from './comment.model';
import { PostAttributes } from '../../posts/models/post.model';

interface CommentLikeAttributes {
    id: string;
    userId: CommentAttributes['userId'];
    originalPostId?: PostAttributes['id'];
    commentId: CommentAttributes['id'];
}

interface CommentLikeCreationAttributes extends Optional<CommentLikeAttributes, 'id'> {}

class CommentLike extends Model<CommentLikeAttributes, CommentLikeCreationAttributes> implements CommentLikeAttributes {
    public id!: string;
    public userId!: CommentAttributes['userId'];
    public originalPostId!: PostAttributes['id'];
    public commentId!: CommentAttributes['id'];

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

const initializeCommentLikeModel = (sequelize: Sequelize): typeof CommentLike => {
    CommentLike.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            originalPostId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'posts',
                    key: 'id',
                },
            },
            commentId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'comments',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            tableName: 'comment_likes',
        }
    );

    return CommentLike;
};

export { CommentLike, CommentLikeAttributes, initializeCommentLikeModel};