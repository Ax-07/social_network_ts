export interface PostTypes {
  id: string;
  userId: string;
  content: string;
  media?: string | null;
  likers?: { id: string, username: string }[] | [];
  commentsCount?: number;
  reposters: { id: string}[];
  originalPostId?: string | null;
  originalCommentId?: string | null;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostResponseArray {
  status: string;
  data: PostTypes[];
  message: string;
}

export interface PostResponse {
  status: string;
  data: PostTypes;
  message: string;
}