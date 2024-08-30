import { Sequelize } from "sequelize";
import { initializeUserModel, User } from "./user.model";
import { initializePostModel, Post } from "./post.model";
import { initializeCommentModel, Comment } from "./comment.model";
import { initializeNotificationModel, Notification } from "./notification.model";

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
});

interface Database {
  Sequelize: typeof Sequelize;
  sequelize: Sequelize;
  User: typeof User;
  Post: typeof Post;
  Comment: typeof Comment;
  Notification: typeof Notification;
};

const db: Database = {
  Sequelize,
  sequelize,
  User: initializeUserModel(sequelize),
  Post: initializePostModel(sequelize),
  Comment: initializeCommentModel(sequelize),
  Notification: initializeNotificationModel(sequelize),
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

db.Comment.hasMany(db.Comment, { foreignKey: 'commentId', as: 'replies' });
db.Comment.belongsTo(db.Comment, { foreignKey: 'commentId', as: 'comment' });

db.User.hasMany(db.Notification, { foreignKey: 'userId', as: 'userNotifications' });
db.Notification.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });


db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;