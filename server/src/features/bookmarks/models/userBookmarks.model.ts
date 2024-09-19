import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { PostAttributes } from '../../posts/models/post.model';
import { CommentAttributes } from '../../comments/models/comment.model';
import { UserAttributes } from '../../user/models/user.model';

interface UserBookmarksAttributes {
    id: string;
    userId: UserAttributes['id'];
    postId?: PostAttributes['id'];
    commentId?: CommentAttributes['id'];
}

interface UserBookmarksCreationAttributes extends Optional<UserBookmarksAttributes, 'id'> {}

class UserBookmarks extends Model<UserBookmarksAttributes, UserBookmarksCreationAttributes> implements UserBookmarksAttributes {
    public id!: string;
    public userId!: UserAttributes['id'];
    public postId!: PostAttributes['id'];
    public commentId!: CommentAttributes['id'];

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

const initializeUserBookmarksModel = (sequelize: Sequelize): typeof UserBookmarks => {
    UserBookmarks.init(
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
            tableName: 'user_bookmarks',
            indexes: [
                {
                    fields: ['userId', 'postId'],
                    unique: true,
                },
                {
                    fields: ['userId', 'commentId'],
                    unique: true,
                }
            ],
        }
    );

    return UserBookmarks;
};

export { UserBookmarks, UserBookmarksAttributes, initializeUserBookmarksModel};