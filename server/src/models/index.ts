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
// foreignKey est utilisé pour spécifier le nom de la clé étrangère dans la base de données
// as est utilisé pour spécifier le nom de l'association dans les requêtes 
db.User.hasMany(db.Post, { foreignKey: 'userId', as: 'posts' });
db.Post.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.User.hasMany(db.Comment, { foreignKey: 'userId', as: 'comments' });
db.Comment.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.Post.hasMany(db.Comment, { foreignKey: 'postId', as: 'comments' });
db.Comment.belongsTo(db.Post, { foreignKey: 'postId', as: 'post' });

db.Post.hasMany(db.Post, { foreignKey: 'originalPostId', as: 'reposts' });
db.Post.belongsTo(db.Post, { foreignKey: 'originalPostId', as: 'originalPost' });

db.Post.hasMany(db.Comment, { foreignKey: 'commentedPostId', as: 'commentedPosts' });
db.Comment.belongsTo(db.Post, { foreignKey: 'commentedPostId', as: 'commentedPost' });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;