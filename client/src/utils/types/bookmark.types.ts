import { CommentTypes } from "./comment.types";
import { PostTypes } from "./post.types";

export interface BookmarkTypes {
    id: string;
    userId: string;
    postId: string | null;
    post: PostTypes | null;
    commentId: string | null;
    comment: CommentTypes | null;
    createdAt: string;
    updatedAt: string;
}

export interface BookmarkResponse {
    status: string;
    data: BookmarkTypes;
    message: string;
}

export interface BookmarkResponseArray {
    status: string;
    data: BookmarkTypes[];
    message: string;
}