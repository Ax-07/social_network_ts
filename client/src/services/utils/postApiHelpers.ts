import { postApi } from "../api/postApi"; // Ajustez le chemin d'importation selon votre structure de dossier

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updatePostCacheAfterAdd = async ( dispatch: any, queryFulfilled: any ) => {
  try {
    const { data } = await queryFulfilled;
    dispatch(
      postApi.util.updateQueryData("getPosts", undefined, (draftPosts) => {
        draftPosts.data.unshift(data.data); // Ajouter le nouveau post en tête de la liste
      })
    );
  } catch (error) {
    console.error("Failed to update cache after adding post:", error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updatePostCacheAfterUpdate = async ( dispatch: any, id: string, queryFulfilled: any ) => {
    try {
      const { data } = await queryFulfilled;
      dispatch(
        postApi.util.updateQueryData("getPostById", id, (draft) => {
          draft.data = data.data;
        })
      );
      dispatch(
        postApi.util.updateQueryData("getPosts", undefined, (draftPosts) => {
          const postToUpdate = draftPosts.data.find((post) => post.id === id);
          if (postToUpdate) {
            postToUpdate.content = data.data.content;
          }
        })
      );
    } catch (error) {
      console.error("Failed to update cache after updating post:", error);
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updatePostCacheAfterDelete = async ( dispatch: any, id: string ) => {
    try {
      dispatch(
        postApi.util.updateQueryData("getPosts", undefined, (draftPosts) => {
          draftPosts.data = draftPosts.data.filter((post) => post.id !== id);
        })
      );
    } catch (error) {
      console.error("Failed to update cache after deleting post:", error);
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updatePostCacheAfterLike = async ( dispatch: any, id: string, queryFulfilled: any ) => {
  try {
    const { data } = await queryFulfilled;
    dispatch(
      postApi.util.updateQueryData("getPostById", id, (draft) => {
        draft.data.likers = data.data.likers;
      })
    );
    dispatch(
      postApi.util.updateQueryData("getPosts", undefined, (draftPosts) => {
        const postToUpdate = draftPosts.data.find((post) => post.id === id);
        if (postToUpdate) {
          postToUpdate.likers = data.data.likers;
        }
      })
    );
  } catch (error) {
    console.error("Failed to update cache after liking post:", error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updatePostCacheAfterRepost = async ( dispatch: any, id: string, queryFulfilled: any ) => {
  try {
    const { data } = await queryFulfilled;
    dispatch(
      postApi.util.updateQueryData("getPosts", undefined, (draftPosts) => {
        draftPosts.data.unshift(data.data); // Ajouter le nouveau post en tête de la liste
      })
    );
  } catch (error) {
    console.error("Failed to update cache after reposting:", error);
  }
};