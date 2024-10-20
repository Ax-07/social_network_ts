import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface MentionAttributes {
    id: string;
    postId: string;
    userId: string;
    mentionedUserId: string;
}

interface MentionCreationAttributes extends Optional<MentionAttributes, 'id'> {}

class Mention extends Model<MentionAttributes, MentionCreationAttributes> implements MentionAttributes {
    public id!: string;
    public postId!: string;
    public userId!: string;
    public mentionedUserId!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

const initializeMentionModel = (sequelize: Sequelize): typeof Mention => {
    Mention.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            postId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            mentionedUserId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'mentions',
            timestamps: true,
        }
    );

    return Mention;
};

export { Mention, MentionAttributes, initializeMentionModel };