import { postApi } from "../api/postApi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateQuestionCacheAfterResponse = async ( dispatch: any, queryFulfilled: any ) => {
  try {
    const { data } = await queryFulfilled;
    const postId = data.data.postId;

    dispatch(
      postApi.util.updateQueryData("getPosts", undefined, (draftPosts) => {
        const postToUpdate = draftPosts.data.find((post) => post.id === postId);
        if (postToUpdate?.question) {
          postToUpdate.question = data.data;
        }
      })
    );

    dispatch(
      postApi.util.updateQueryData("getPostById", postId, (draftPosts) => {
        const postToUpdate = draftPosts.data;
        if (postToUpdate?.question) {
          postToUpdate.question = data.data;
        }
      })
    );
  } catch (error) {
    console.error(
      "Failed to update cache after responding to question:",
      error
    );
  }
};
