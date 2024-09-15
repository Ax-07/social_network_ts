import { Sequelize } from "sequelize";
import { initializeUserModel, User } from "./users/user.model";
import { initializeUserFollowersModel, UserFollowers } from "./users/userFollower.model";
import { initializeUserBookmarksModel, UserBookmarks } from "./users/userBookmarks.model";
import { initializePostModel, Post } from "./posts/post.model";
import { initializePostLikeModel, PostLike } from "./posts/postLike.model";
import { initializePostRepostModel, PostRepost } from "./posts/postRepost.model";
import { initializeCommentModel, Comment } from "./comments/comment.model";
import { initializeCommentLikeModel, CommentLike } from "./comments/commentLikes.model";
import { initializeCommentRepostModel, CommentRepost } from "./comments/commentReposts.model";
import { initializeNotificationModel, Notification } from "./notification.model";
import { initializeMessageModel, Message } from "./messages/messages.model";
import { initializeGroupModel, Group } from "./users/group.model";

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
});

interface Database {
  Sequelize: typeof Sequelize;
  sequelize: Sequelize;
  User: typeof User;
  UserFollowers: typeof UserFollowers;
  UserBookmarks: typeof UserBookmarks;
  Post: typeof Post;
  PostLike: typeof PostLike;
  PostRepost: typeof PostRepost;
  Comment: typeof Comment;
  CommentLike: typeof CommentLike;
  CommentRepost: typeof CommentRepost;
  Notification: typeof Notification;
  Message: typeof Message;
  Group: typeof Group;
};

const db: Database = {
  Sequelize,
  sequelize,
  User: initializeUserModel(sequelize),
  UserFollowers: initializeUserFollowersModel(sequelize),
  UserBookmarks: initializeUserBookmarksModel(sequelize),
  Post: initializePostModel(sequelize),
  PostLike: initializePostLikeModel(sequelize),
  PostRepost: initializePostRepostModel(sequelize),
  Comment: initializeCommentModel(sequelize),
  CommentLike: initializeCommentLikeModel(sequelize),
  CommentRepost: initializeCommentRepostModel(sequelize),
  Notification: initializeNotificationModel(sequelize),
  Message: initializeMessageModel(sequelize),
  Group: initializeGroupModel(sequelize),
};

// Définir les associations après l'initialisation des modèles
// foreignKey est utilisé pour spécifier le nom de la clé étrangère dans la base de données
// through est utilisé pour spécifier le nom de la table de jonction dans les associations many-to-many
// as est utilisé pour spécifier le nom de l'association dans les requêtes 
db.User.hasMany(db.Post, { foreignKey: 'userId', as: 'posts' }); // Un utilisateur a plusieurs posts
db.Post.belongsTo(db.User, { foreignKey: 'userId', as: 'user' }); // Un post appartient à un utilisateur

db.User.hasMany(db.Comment, { foreignKey: 'userId', as: 'comments' }); // Un utilisateur a plusieurs commentaires
db.Comment.belongsTo(db.User, { foreignKey: 'userId', as: 'user' }); // Un commentaire appartient à un utilisateur

db.Post.hasMany(db.Comment, { foreignKey: 'postId', as: 'comments' }); // Un post a plusieurs commentaires
db.Comment.belongsTo(db.Post, { foreignKey: 'postId', as: 'post' }); // Un commentaire appartient à un post

db.User.belongsToMany(db.User, { through: UserFollowers, as: 'followers', foreignKey: 'followedId', otherKey: 'followerId' }); // Un utilisateur a plusieurs followers
db.User.belongsToMany(db.User, { through: UserFollowers, as: 'followings', foreignKey: 'followerId', otherKey: 'followedId' }); // Un utilisateur suit plusieurs autres utilisateurs

db.UserFollowers.belongsTo(db.User, { foreignKey: 'followerId', as: 'follower' }); // Un follower appartient à un utilisateur
db.UserFollowers.belongsTo(db.User, { foreignKey: 'followedId', as: 'followed' }); // Un utilisateur suivi appartient à un utilisateur

// Association entre User et Post via UserBookmarks (table de jonction)
db.User.belongsToMany(db.Post, { through: db.UserBookmarks, as: 'bookmarks', foreignKey: 'userId' }); // Un utilisateur a plusieurs posts bookmarkés
db.Post.belongsToMany(db.User, { through: db.UserBookmarks, as: 'bookmarkedBy', foreignKey: 'postId' }); // Un post est bookmarké par plusieurs utilisateurs
db.User.belongsToMany(db.Comment, { through: db.UserBookmarks, as: 'bookmarkedComments', foreignKey: 'userId' }); // Un utilisateur a plusieurs commentaires bookmarkés
db.Comment.belongsToMany(db.User, { through: db.UserBookmarks, as: 'bookmarkedCommentBy', foreignKey: 'commentId' }); // Un commentaire est bookmarké par plusieurs utilisateurs

db.UserBookmarks.belongsTo(db.User, { foreignKey: 'userId', as: 'user' }); // Un utilisateur appartient à un bookmark
db.UserBookmarks.belongsTo(db.Post, { foreignKey: 'postId', as: 'post' }); // Un post appartient à un bookmark
db.UserBookmarks.belongsTo(db.Comment, { foreignKey: 'commentId', as: 'comment' }); // Un commentaire appartient à un bookmark

// Association entre User et Post via PostLike (table de jonction)
db.User.belongsToMany(db.Post, { through: PostLike, as: 'likedPosts', foreignKey: 'userId' }); // Un utilisateur a plusieurs posts likés
db.Post.belongsToMany(db.User, { through: PostLike, as: 'likers', foreignKey: 'postId' }); // Un post est liké par plusieurs utilisateurs

// Association entre User et Post via PostRepost (table de jonction)
db.User.belongsToMany(db.Post, { through: PostRepost, as: 'repostedPosts', foreignKey: 'userId' }); // Un utilisateur a plusieurs posts repostés
db.Post.belongsToMany(db.User, { through: PostRepost, as: 'reposters', foreignKey: 'postId' }); // Un post est reposté par plusieurs utilisateurs

// Association entre User et Comment via CommentLike (table de jonction)
db.User.belongsToMany(db.Comment, { through: CommentLike, as: 'likedComments', foreignKey: 'userId' }); // Un utilisateur a plusieurs commentaires likés
db.Comment.belongsToMany(db.User, { through: CommentLike, as: 'commentLikers', foreignKey: 'commentId' }); // Un commentaire est liké par plusieurs utilisateurs

// Association entre User et Comment via CommentRepost (table de jonction)
db.User.belongsToMany(db.Comment, { through: CommentRepost, as: 'repostedComments', foreignKey: 'userId' }); // Un utilisateur a plusieurs commentaires repostés
db.Comment.belongsToMany(db.User, { through: CommentRepost, as: 'commentReposters', foreignKey: 'commentId' }); // Un commentaire est reposté par plusieurs utilisateurs

// Association entre User et Notification
db.User.hasMany(db.Notification, { foreignKey: 'userId', as: 'userNotifications' }); // Un utilisateur a plusieurs notifications
db.Notification.belongsTo(db.User, { foreignKey: 'userId', as: 'user' }); // Une notification appartient à un utilisateur

// Association entre User et Group via une table de jonction UserGroups
db.User.belongsToMany(db.Group, { through: 'UserGroups', as: 'userGroups', foreignKey: 'userId' }); // Un utilisateur appartient à plusieurs groupes
db.Group.belongsToMany(db.User, { through: 'UserGroups', as: 'groupMembers', foreignKey: 'groupId' }); // Un groupe a plusieurs membres


db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;