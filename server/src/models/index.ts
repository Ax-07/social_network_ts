import { Sequelize } from "sequelize";
import { initializeUserModel, User } from "./user.model";

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
});;

interface Database {
  Sequelize: typeof Sequelize;
  sequelize: Sequelize;
  User: typeof User;
}

const db: Database = {
  Sequelize,
  sequelize,
  User: initializeUserModel(sequelize),
};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;