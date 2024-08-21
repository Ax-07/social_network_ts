export interface PostTypes {
  id: string;
  userId: string;
  content: string;
  media?: string | null;
  likers?: string[];
  commentsCount?: number;
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
