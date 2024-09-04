import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { UserAttributes } from '../users/user.model';
import { CommentAttributes } from './comment.model';


interface CommentRepostAttributes {
    id: string;
    userId: UserAttributes['id'];
    commentId: CommentAttributes['id'];
}

interface CommentRepostCreationAttributes extends Optional<CommentRepostAttributes, 'id'> {}

class CommentRepost extends Model<CommentRepostAttributes, CommentRepostCreationAttributes> implements CommentRepostAttributes {
    public id!: string;
    public userId!: UserAttributes['id'];
    public commentId!: CommentAttributes['id'];

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

const initializeCommentRepostModel = (sequelize: Sequelize): typeof CommentRepost => {
    CommentRepost.init(
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
            commentId: {
                type: DataTypes.UUID,
                allowNull: false,
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

    return CommentRepost;
};

export { CommentRepost, CommentRepostAttributes, initializeCommentRepostModel};