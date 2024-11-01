import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface GroupMemberAttributes {
  userId: string;
  conversationId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface GroupMemberCreationAttributes
  extends Optional<GroupMemberAttributes, "createdAt" | "updatedAt"> {}

class GroupMember
  extends Model<GroupMemberAttributes, GroupMemberCreationAttributes>
  implements GroupMemberAttributes
{
  public userId!: string;
  public conversationId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initializeGroupMemberModel = (
  sequelize: Sequelize
): typeof GroupMember => {
  GroupMember.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        primaryKey: true,
      },
      conversationId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "conversations",
          key: "id",
        },
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "groupMember",
    }
  );
  return GroupMember;
};

export { GroupMember, initializeGroupMemberModel };
