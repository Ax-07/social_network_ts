import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { UserAttributes } from '../users/user.model';
import { PostAttributes } from './post.model';

interface PostRepostAttributes {
    id: string;
    userId: UserAttributes['id'];
    postId: PostAttributes['id'];
}

interface PostRepostCreationAttributes extends Optional<PostRepostAttributes, 'id'> {}

class PostRepost extends Model<PostRepostAttributes, PostRepostCreationAttributes> implements PostRepostAttributes {
    public id!: string;
    public userId!: UserAttributes['id'];
    public postId!: PostAttributes['id'];

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

const initializePostRepostModel = (sequelize: Sequelize): typeof PostRepost => {
    PostRepost.init(
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
                unique: false,
                references: {
                    model: 'posts',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            tableName: 'post_reposts',
        }
    );

    return PostRepost;
};

export { PostRepost, PostRepostAttributes, initializePostRepostModel};