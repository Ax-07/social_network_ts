import { Sequelize } from "sequelize";
import { initializeUserModel, User } from "./user.model";
import { initializePostModel, Post } from "./post.model";
import { initializeCommentModel, Comment } from "./comment.model";

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
});;

interface Database {
  Sequelize: typeof Sequelize;
  sequelize: Sequelize;
  User: typeof User;
  Post: typeof Post;
  Comment: typeof Comment;
}

const db: Database = {
  Sequelize,
  sequelize,
  User: initializeUserModel(sequelize),
  Post: initializePostModel(sequelize),
  Comment: initializeCommentModel(sequelize),
};

// Définir les associations après l'initialisation des modèles
db.User.hasMany(db.Post, { foreignKey: 'userId', as: 'posts' });
db.Post.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.User.hasMany(db.Comment, { foreignKey: 'userId', as: 'comments' });
db.Comment.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.Post.hasMany(db.Comment, { foreignKey: 'postId', as: 'comments' });
db.Comment.belongsTo(db.Post, { foreignKey: 'postId', as: 'post' });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;