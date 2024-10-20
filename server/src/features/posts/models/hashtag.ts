import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface HashtagAttributes {
    id: string;
    name: string;
}

interface HashtagCreationAttributes extends Optional<HashtagAttributes, 'id'> {}

class Hashtag extends Model<HashtagAttributes, HashtagCreationAttributes> implements HashtagAttributes {
    public id!: string;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

const initializeHashtagModel = (sequelize: Sequelize): typeof Hashtag => {
    Hashtag.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            tableName: 'hashtags',
            timestamps: false,
        }
    );

    return Hashtag;
};

export { Hashtag, HashtagAttributes, initializeHashtagModel };