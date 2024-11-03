export interface PostTypes {
  id: string;
  userId: string;
  content: string;
  media?: string | null;
  commentsCount?: number;
  originalPostId?: string | null;
  originalCommentId?: string | null;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
  likers?: { id: string; username: string }[] | [];
  reposters: { id: string }[];
  question: {
    id: string;
    question: string;
    answers: {
      title: string;
      votes: number;
    }[];
    expiredAt: string;
  }
  evenement: {
    id: string;
    title: string;
    description: string;
    startDate: string;
    location: string;
    media: string | null;
  }
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

export interface TrendsResponse {
  status: string;
  data: {
    topHashtags: {
      hashtagId: string;
      hashtag: { name: string };
      count: number;
    }[];
    topMentions: {
      mentionedUserId: string;
      mentionedUser: { username: string };
      count: number;
    }[];
  };
  message: string;
}
