import { commentApi } from "../api/commentApi";
import { postApi } from "../api/postApi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateCommentsCacheAfterAdd = async ( dispatch: any, queryFulfilled: any, origin: string ) => {
  console.log("updateCommentsCacheAfterAdd", {origin});
    try {
      const { data } = await queryFulfilled;
      dispatch(
        commentApi.util.updateQueryData("getCommentsByPostId", data.data.postId, (draft) => {
          draft.data.push(data.data);
        })
      );
      if (origin === "modal-addPost" || origin === "page-home" || origin === "post-page-comment") {
        
        dispatch(
          postApi.util.updateQueryData("getPostById", data.data.postId, (draftPost) => {
            draftPost.data.commentsCount = (draftPost.data.commentsCount ?? 0) + 1;
            console.log("updateCommentsCacheAfterAdd", {draftPost});
          })
        );
      } else if (origin === "modal-comment" || origin === "post-page-comment" || origin === "comment-page-comment") {
        dispatch(
          commentApi.util.updateQueryData("getCommentById", data.data.commentId, (draftComment) => {
            draftComment.data.commentsCount = (draftComment.data.commentsCount ?? 0) + 1;
            console.log("updateCommentsCacheAfterAdd", {draftComment});
          })
        );
      }
    } catch (error) {
      console.error("Failed to update cache after adding comment:", error);
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateCommentsCacheAfterUpdate = async ( dispatch: any, id: string, queryFulfilled: any ) => {
    try {
      const { data } = await queryFulfilled;
      dispatch(
        commentApi.util.updateQueryData("getCommentById", id, (draft) => {
          draft.data = data.data;
        })
      );
      dispatch(
        commentApi.util.updateQueryData("getCommentsByPostId", data.data.postId, (draftComments) => {
          const commentToUpdate = draftComments.data.find((comment) => comment.id === id);
          if (commentToUpdate) {
            commentToUpdate.content = data.data.content;
          }
        })
      );
    } catch (error) {
      console.error("Failed to update cache after updating comment:", error);
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateCommentsCacheAfterDelete = async ( dispatch: any, id: string ) => {
    try {
      dispatch(
        commentApi.util.updateQueryData("getCommentsByPostId", "", (draftComments) => {
          draftComments.data = draftComments.data.filter((comment) => comment.id !== id);
        })
      );
    } catch (error) {
      console.error("Failed to update cache after deleting comment:", error);
    }
};