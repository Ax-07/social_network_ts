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
  Group: initializeGroupModel(sequelize),
};

// Définir les associations après l'initialisation des modèles
// foreignKey est utilisé pour spécifier le nom de la clé étrangère dans la base de données
// through est utilisé pour spécifier le nom de la table de jonction dans les associations many-to-many
// as est utilisé pour spécifier le nom de l'association dans les requêtes 
db.User.hasMany(db.Post, { foreignKey: 'userId', as: 'posts' });
db.Post.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.User.hasMany(db.Comment, { foreignKey: 'userId', as: 'comments' });
db.Comment.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.Post.hasMany(db.Comment, { foreignKey: 'postId', as: 'comments' });
db.Comment.belongsTo(db.Post, { foreignKey: 'postId', as: 'post' });

db.User.belongsToMany(db.User, { through: UserFollowers, as: 'followers', foreignKey: 'followedId', otherKey: 'followerId' });
db.User.belongsToMany(db.User, { through: UserFollowers, as: 'followings', foreignKey: 'followerId', otherKey: 'followedId' });

db.UserFollowers.belongsTo(db.User, { foreignKey: 'followerId', as: 'follower' });
db.UserFollowers.belongsTo(db.User, { foreignKey: 'followedId', as: 'followed' });

// Association entre User et Post via UserBookmarks (table de jonction)
db.User.belongsToMany(db.Post, { through: db.UserBookmarks, as: 'bookmarks', foreignKey: 'userId' });
db.Post.belongsToMany(db.User, { through: db.UserBookmarks, as: 'bookmarkedBy', foreignKey: 'postId' });

db.User.belongsToMany(db.Post, { through: PostLike, as: 'likedPosts', foreignKey: 'userId' });
db.Post.belongsToMany(db.User, { through: PostLike, as: 'likers', foreignKey: 'postId' });

db.User.belongsToMany(db.Post, { through: PostRepost, as: 'repostedPosts', foreignKey: 'userId' });
db.Post.belongsToMany(db.User, { through: PostRepost, as: 'reposters', foreignKey: 'postId' });

db.User.belongsToMany(db.Comment, { through: CommentLike, as: 'likedComments', foreignKey: 'userId' });
db.Comment.belongsToMany(db.User, { through: CommentLike, as: 'commentLikers', foreignKey: 'commentId' });

db.User.belongsToMany(db.Comment, { through: CommentRepost, as: 'repostedComments', foreignKey: 'userId' });
db.Comment.belongsToMany(db.User, { through: CommentRepost, as: 'commentReposters', foreignKey: 'commentId' });

db.User.hasMany(db.Notification, { foreignKey: 'userId', as: 'userNotifications' });
db.Notification.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

// Association entre User et Group via une table de jonction UserGroups
db.User.belongsToMany(db.Group, { through: 'UserGroups', as: 'userGroups', foreignKey: 'userId' });
db.Group.belongsToMany(db.User, { through: 'UserGroups', as: 'groupMembers', foreignKey: 'groupId' });


db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;