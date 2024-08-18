export interface PostTypes {
  id: string;
  userId: string;
  content: string;
  media?: string | null;
  likers?: string[];
  dislikers?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PostResponseTypes {
  status: number;
  data: PostTypes[];
  message: string;
}

export interface PostResponse {
  status: number;
  data: PostTypes;
  message: string;
}
