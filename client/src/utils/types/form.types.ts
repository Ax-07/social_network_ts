export interface FormState {
    userId: string | undefined;
    content: string;
    file: File | string;
    commentedPostId?: string;
    commentedCommentId?: string;
  }