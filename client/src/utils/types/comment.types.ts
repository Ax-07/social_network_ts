export interface CommentTypes {
  id: string;
  postId: string;
  commentId: string;
  userId: string;
  content: string;
  media?: string | null;
  likers?: string[];
  commentsCount?: number;
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
