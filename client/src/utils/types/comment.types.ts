export interface CommentTypes {
  id: string;
  postId: string;
  commentId: string;
  commentedPostId?: string | null;
  CommentedCommentId?: string | null;
  userId: string;
  content: string;
  media?: string | null;
  likers?: string[] | [];
  commentsCount?: number;
  reposters?: string[] | [];
  createdAt?: string;
  updatedAt?: string;
}

export interface CommentResponseArray {
  status: string;
  data: CommentTypes[];
  message: string;
}

export interface CommentResponse {
  status: string;
  data: CommentTypes;
  message: string;
}
