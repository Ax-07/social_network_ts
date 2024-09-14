import { postApi } from "../api/postApi"; // Ajustez le chemin d'importation selon votre structure de dossier

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updatePostCacheAfterAdd = async ( dispatch: any, queryFulfilled: any ) => {
  try {
    const { data } = await queryFulfilled;
    // Mettre à jour le cache pour afficher le post ajouté dans la liste des posts
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
        const postUpdated = draft.data;
        if (postUpdated) {
          postUpdated.likers = data.data.likers;
        }
      })
    );
    dispatch(
      postApi.util.updateQueryData("getPosts", undefined, (draftPosts) => {
        const postToUpdate = draftPosts.data.find((post) => post.id === id);
        if (postToUpdate) {
          postToUpdate.likers = data.data.likers; // Update likers directly here
        } else {
          console.log("Post not found in draftPosts");
        }
      })
    );
    
  } catch (error) {
    console.error("Failed to update cache after liking post:", error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updatePostCacheAfterRepost = async ( dispatch: any, userId: string, originalPostId: string, originalCommentId: string, queryFulfilled: any ) => {
  try {
    const { data } = await queryFulfilled; console.log('repost data:', data);
    dispatch(
      postApi.util.updateQueryData("getPosts", undefined, (draftPosts) => {
        draftPosts.data.unshift(data.data); // Ajouter le nouveau post en tête de la liste
      })
    );
    if (originalPostId) {
    dispatch(
      postApi.util.updateQueryData("getPosts", undefined, (draftPosts) => {
        const postToUpdate = draftPosts.data.find((post) => post.id === originalPostId);
        if (postToUpdate) {
          const reposters = postToUpdate.reposters ?? [];
          reposters.push({id: userId});
          postToUpdate.reposters = reposters;
        }
      }
    ));
    dispatch(
      postApi.util.updateQueryData("getPostById", originalPostId, (draft) => {
        const postUpdated = draft?.data;
        if (postUpdated) {
          const reposters = postUpdated.reposters ?? [];
          reposters.push({id: userId});
          postUpdated.reposters = reposters;
        }}
    ));
  } else if (originalCommentId) {
      console.log('originalCommentId:', originalCommentId);
  }
  } catch (error) {
    console.error("Failed to update cache after reposting:", error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updatePostCacheAfterViews = async ( dispatch: any, id: string, queryFulfilled: any ) => {
  try {
    const { data } = await queryFulfilled;

    dispatch(
      postApi.util.updateQueryData("getPostById", id, (draft) => {
        const postUpdated = draft?.data;
        if (postUpdated) {
          postUpdated.views = (postUpdated.views ?? 0) + 1;
        }
      })
    );

    dispatch(
      postApi.util.updateQueryData("getPosts", undefined, (draftPosts) => {
        const postToUpdate = draftPosts.data?.find((post) => post.id === id);
        if (postToUpdate) {
          postToUpdate.views = data.data.views;
        }
      })
    );
  } catch (error) {
    console.error("Failed to update cache after incrementing post views:", error);
  }
};
