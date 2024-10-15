import { Sequelize } from "sequelize";
import { UserBookmarks, initializeUserBookmarksModel } from "../../features/bookmarks/models/userBookmarks.model";
import { Comment, initializeCommentModel } from "../../features/comments/models/comment.model";
import { CommentLike, initializeCommentLikeModel } from "../../features/comments/models/commentLikes.model";
import { CommentRepost, initializeCommentRepostModel } from "../../features/comments/models/commentReposts.model";
import { Conversation, initializeConversationModel } from "../../features/conversations/models/conversations.model";
import { UserFollowers, initializeUserFollowersModel } from "../../features/follows/models/userFollower.model";
import { Message, initializeMessageModel } from "../../features/messages/models/messages.model";
import { Notification, initializeNotificationModel } from "../../features/notifications/models/notification.model";
import { Post, initializePostModel } from "../../features/posts/models/post.model";
import { PostLike, initializePostLikeModel } from "../../features/posts/models/postLike.model";
import { PostRepost, initializePostRepostModel } from "../../features/posts/models/postRepost.model";
import { Group, initializeGroupModel } from "../../features/user/models/group.model";
import { User, initializeUserModel } from "../../features/user/models/user.model";
import { GroupMember, initializeGroupMemberModel } from "../../features/conversations/models/groupMembers.model";
import { Hashtag, initializeHashtagModel } from "../../features/posts/models/hashtag";
import { initializePostHashtagModel, PostHashtag } from "../../features/posts/models/postHashtag";
import { Mention, initializeMentionModel } from "../../features/posts/models/mention";
import { initializeQuestionModel, Question } from "../../features/question/models/question.model";
import { initializeEvenementModel, Evenement } from "../../features/evenements/models/evenement.model";

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
  Conversation: typeof Conversation;
  Group: typeof Group; // ???
  GroupMember: typeof GroupMember;
  Hashtag: typeof Hashtag;
  PostHashtag: typeof PostHashtag;
  Mention: typeof Mention;
  Question: typeof Question;
  Evenement: typeof Evenement;
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
  Conversation: initializeConversationModel(sequelize),
  Group: initializeGroupModel(sequelize),
  GroupMember: initializeGroupMemberModel(sequelize),
  Hashtag: initializeHashtagModel(sequelize),
  PostHashtag: initializePostHashtagModel(sequelize),
  Mention: initializeMentionModel(sequelize),
  Question: initializeQuestionModel(sequelize),
  Evenement: initializeEvenementModel(sequelize),
};

// Définir les associations après l'initialisation des modèles
// foreignKey est utilisé pour spécifier le nom de la clé étrangère dans la base de données
// through est utilisé pour spécifier le nom de la table de jonction dans les associations many-to-many
// as est utilisé pour spécifier le nom de l'association dans les requêtes 

// Associations de User
db.User.belongsToMany(db.User, { through: db.UserFollowers, as: 'followers', foreignKey: 'followedId', otherKey: 'followerId' }); // Un utilisateur a plusieurs followers
db.User.belongsToMany(db.User, { through: db.UserFollowers, as: 'followings', foreignKey: 'followerId', otherKey: 'followedId' }); // Un utilisateur suit plusieurs autres utilisateurs
db.UserFollowers.belongsTo(db.User, { foreignKey: 'followerId', as: 'follower' }); // Un follower appartient à un utilisateur
db.UserFollowers.belongsTo(db.User, { foreignKey: 'followedId', as: 'followed' }); // Un utilisateur suivi appartient à un utilisateur
db.User.hasMany(db.UserFollowers, { foreignKey: 'followerId', as: 'userFollowers' }); // Un utilisateur a plusieurs followers
db.User.hasMany(db.UserFollowers, { foreignKey: 'followedId', as: 'userFollowings' }); // Un utilisateur suit plusieurs autres utilisateurs

db.User.hasMany(db.Post, { foreignKey: 'userId', as: 'posts' }); // Un utilisateur a plusieurs posts
db.Post.belongsTo(db.User, { foreignKey: 'userId', as: 'user' }); // Un post appartient à un utilisateur

db.User.hasMany(db.Comment, { foreignKey: 'userId', as: 'comments' }); // Un utilisateur a plusieurs commentaires
db.Comment.belongsTo(db.User, { foreignKey: 'userId', as: 'user' }); // Un commentaire appartient à un utilisateur

db.Post.hasMany(db.Comment, { foreignKey: 'postId', as: 'comments' }); // Un post a plusieurs commentaires
db.Comment.belongsTo(db.Post, { foreignKey: 'postId', as: 'post' }); // Un commentaire appartient à un post

// Association entre User et Post via UserBookmarks (table de jonction)
db.User.belongsToMany(db.Post, { through: db.UserBookmarks, as: 'bookmarks', foreignKey: 'userId' }); // Un utilisateur a plusieurs posts bookmarkés
db.Post.belongsToMany(db.User, { through: db.UserBookmarks, as: 'bookmarkedBy', foreignKey: 'postId' }); // Un post est bookmarké par plusieurs utilisateurs
db.User.belongsToMany(db.Comment, { through: db.UserBookmarks, as: 'bookmarkedComments', foreignKey: 'userId' }); // Un utilisateur a plusieurs commentaires bookmarkés
db.Comment.belongsToMany(db.User, { through: db.UserBookmarks, as: 'bookmarkedCommentBy', foreignKey: 'commentId' }); // Un commentaire est bookmarké par plusieurs utilisateurs

db.UserBookmarks.belongsTo(db.User, { foreignKey: 'userId', as: 'user' }); // Un utilisateur appartient à un bookmark
db.UserBookmarks.belongsTo(db.Post, { foreignKey: 'postId', as: 'post' }); // Un post appartient à un bookmark
db.UserBookmarks.belongsTo(db.Comment, { foreignKey: 'commentId', as: 'comment' }); // Un commentaire appartient à un bookmark

// Association entre User et Post via PostLike (table de jonction)
db.User.belongsToMany(db.Post, { through: db.PostLike, as: 'likedPosts', foreignKey: 'userId' }); // Un utilisateur a plusieurs posts likés
db.Post.belongsToMany(db.User, { through: db.PostLike, as: 'likers', foreignKey: 'postId' }); // Un post est liké par plusieurs utilisateurs

// Association entre User et Comment via CommentLike (table de jonction)
db.User.belongsToMany(db.Comment, { through: db.CommentLike, as: 'likedComments', foreignKey: 'userId' }); // Un utilisateur a plusieurs commentaires likés
db.Comment.belongsToMany(db.User, { through: db.CommentLike, as: 'commentLikers', foreignKey: 'commentId' }); // Un commentaire est liké par plusieurs utilisateurs

// Association entre User et Post via PostRepost (table de jonction)
db.User.belongsToMany(db.Post, { through: db.PostRepost, as: 'repostedPosts', foreignKey: 'userId' }); // Un utilisateur a plusieurs posts repostés
db.Post.belongsToMany(db.User, { through: db.PostRepost, as: 'reposters', foreignKey: 'postId' }); // Un post est reposté par plusieurs utilisateurs

// Association entre User et Comment via CommentRepost (table de jonction)
db.User.belongsToMany(db.Comment, { through: db.CommentRepost, as: 'repostedComments', foreignKey: 'userId' }); // Un utilisateur a plusieurs commentaires repostés
db.Comment.belongsToMany(db.User, { through: db.CommentRepost, as: 'commentReposters', foreignKey: 'commentId' }); // Un commentaire est reposté par plusieurs utilisateurs

// Association entre Post et Question
db.Post.hasOne(db.Question, { foreignKey: 'postId', as: 'question' }); // Un post a une question
db.Question.belongsTo(db.Post, { foreignKey: 'postId', as: 'post' }); // Une question appartient à un post

// Association entre Post et Evenement
db.Post.hasOne(db.Evenement, { foreignKey: 'postId', as: 'evenement' }); // Un post a un événement
db.Evenement.belongsTo(db.Post, { foreignKey: 'postId', as: 'post' }); // Un événement appartient à un post
// Association entre User et Notification
db.User.hasMany(db.Notification, { foreignKey: 'userId', as: 'userNotifications' }); // Un utilisateur a plusieurs notifications
db.Notification.belongsTo(db.User, { foreignKey: 'userId', as: 'user' }); // Une notification appartient à un utilisateur

// Association entre Conversation et GroupMember
db.Conversation.hasMany(db.GroupMember, { foreignKey: 'conversationId', as: 'groupMembers' });
db.GroupMember.belongsTo(db.Conversation, { foreignKey: 'conversationId', as: 'conversation' });

// Association entre GroupMember et User
db.User.hasMany(db.GroupMember, { foreignKey: 'userId', as: 'groupMemberships' });
db.GroupMember.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

// Association entre Conversation et Message
db.Conversation.hasMany(db.Message, { foreignKey: 'conversationId', as: 'messages' });
db.Message.belongsTo(db.Conversation, { foreignKey: 'conversationId', as: 'conversation' });

// Association entre User et Message
db.User.hasMany(db.Message, { foreignKey: 'senderId', as: 'sentMessages' });
db.Message.belongsTo(db.User, { foreignKey: 'senderId', as: 'sender' });

// Association entre Conversation et Admin (User)
db.Conversation.belongsTo(db.User, { as: 'admin', foreignKey: 'adminId' });
db.User.hasMany(db.Conversation, { as: 'adminConversations', foreignKey: 'adminId' });

db.Post.belongsToMany(db.Hashtag, { through: db.PostHashtag, as: 'hashtags', foreignKey: 'postId' });
db.Hashtag.belongsToMany(db.Post, { through: db.PostHashtag, as: 'posts', foreignKey: 'hashtagId' });
db.PostHashtag.belongsTo(db.Post, { foreignKey: 'postId', as: 'post' });
db.PostHashtag.belongsTo(db.Hashtag, { foreignKey: 'hashtagId', as: 'hashtag' });

db.Post.belongsToMany(db.User, { through: db.Mention, as: 'mentions', foreignKey: 'postId', otherKey: 'mentionedUserId' });
db.User.belongsToMany(db.Post, { through: db.Mention, as: 'mentionedPosts', foreignKey: 'userId' });
db.Mention.belongsTo(db.Post, { foreignKey: 'postId', as: 'post' });
db.Mention.belongsTo(db.User, { foreignKey: 'mentionedUserId', as: 'mentionedUser' });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;