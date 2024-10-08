export interface FormState {
    userId?: string | undefined;
    content?: string;
    file?: File | string;
    originalPostId?: string | undefined;
    originalCommentId?: string | undefined;
    commentedPostId?: string;
    commentedCommentId?: string;
  }