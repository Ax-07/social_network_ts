import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { UserAttributes } from './user.model';
import { PostAttributes } from '../posts/post.model';

interface UserBookmarksAttributes {
    id: string;
    userId: UserAttributes['id'];
    postId: PostAttributes['id'];
}

interface UserBookmarksCreationAttributes extends Optional<UserBookmarksAttributes, 'id'> {}

class UserBookmarks extends Model<UserBookmarksAttributes, UserBookmarksCreationAttributes> implements UserBookmarksAttributes {
    public id!: string;
    public userId!: UserAttributes['id'];
    public postId!: PostAttributes['id'];

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
                allowNull: false,
                references: {
                    model: 'posts',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            tableName: 'user_bookmarks',
        }
    );

    return UserBookmarks;
};

export { UserBookmarks, UserBookmarksAttributes, initializeUserBookmarksModel};