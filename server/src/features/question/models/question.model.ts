import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface QuestionAttributes {
    id: string;
    userId: string;
    postId: string;
    question: string;
    answers: {
        title: string;
        votes: number;
    }[];
    expiredAt?: Date;
}

interface QuestionCreationAttributes extends Optional<QuestionAttributes, 'id'> {}

class Question extends Model<QuestionAttributes, QuestionCreationAttributes> implements QuestionAttributes {
    public id!: string;
    public userId!: string;
    public postId!: string;
    public question!: string;
    public answers!: {
        title: string;
        votes: number;
    }[];
    public expiredAt!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

const initializeQuestionModel = (sequelize: Sequelize): typeof Question => {
    Question.init(
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
                }
            },
            postId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'posts',
                    key: 'id',
                }
            },
            question: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            answers: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
            },
            expiredAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'questions',
            timestamps: true,
        }
    );

    

    return Question;
};

export { Question, QuestionAttributes, initializeQuestionModel };