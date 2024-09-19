import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { UserAttributes } from '../../user/models/user.model';

interface UserFollowersAttributes {
    id: string;
    followerId: UserAttributes['id']; // Id de l'utilisateur qui suit un autre utilisateur
    followedId: UserAttributes['id']; // Id de l'utilisateur suivi par un autre utilisateur
}

interface UserFollowersCreationAttributes extends Optional<UserFollowersAttributes, 'id'> {}

class UserFollowers extends Model<UserFollowersAttributes, UserFollowersCreationAttributes> implements UserFollowersAttributes {
    public id!: string;
    public followerId!: UserAttributes['id'];
    public followedId!: UserAttributes['id'];

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

const initializeUserFollowersModel = (sequelize: Sequelize): typeof UserFollowers => {
    UserFollowers.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            followerId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            followedId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            tableName: 'user_follows',
        }
    );

    return UserFollowers;
};

export { UserFollowers, UserFollowersAttributes, initializeUserFollowersModel};