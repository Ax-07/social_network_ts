import { commentApi } from "../api/commentApi";
import { postApi } from "../api/postApi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateCommentsCacheAfterAdd = async (dispatch: any, queryFulfilled: any, origin: string, commentedPostId: string, commentedCommentId: string) => {
  try {
      const { data } = await queryFulfilled;
      console.log("data", { data }.data.data);
      console.log("origin",  origin );
      console.log("commentedCommentId",  commentedCommentId );
      console.log("commentedPostId",  commentedPostId );

      if ( origin === 'post-page-comment' ) {
        dispatch(
            commentApi.util.updateQueryData("getCommentsByPostId", data.data.postId, (draft) => {
                draft.data.push(data.data);
                console.log("update Comments Cache of comments list After Add a comment", {origin, draft });
            }),
            dispatch(
              postApi.util.updateQueryData("getPostById", data.data.postId, (draftPost) => {
                if (draftPost && draftPost.data) {
                  draftPost.data.commentsCount = (draftPost.data.commentsCount ?? 0) + 1;
                }
              })
            )
        );
      }
      if (origin === 'modal-comment-post') {
        dispatch(
          postApi.util.updateQueryData("getPosts", undefined, (draftPosts) => {
            console.log("Before update getPosts draftPosts:", draftPosts.data);
        
            const postToUpdate = draftPosts.data.find((post) => post.id === data.data.postId);

            if (postToUpdate) {
              console.log("postToUpdate before update:", postToUpdate.commentsCount);
              postToUpdate.commentsCount = (postToUpdate.commentsCount ?? 0) + 1;
              console.log("postToUpdate after update:", postToUpdate.commentsCount);
            } else {
              console.log("postToUpdate not found");
            }
          })
        )
      }
      if (origin === 'comment-page-comment') {
        dispatch(
            commentApi.util.updateQueryData("getCommentsByCommentId", data.data.commentId, (draft) => {
                draft.data.push(data.data);
                console.log("update Comments Cache of comments list After Add a comment", { origin, draft });
            }),
            dispatch(
              commentApi.util.updateQueryData("getCommentById", data.data.commentId, (draftComment) => {
                if (draftComment && draftComment.data) {
                  draftComment.data.commentsCount = (draftComment.data.commentsCount ?? 0) + 1;
                }
              })
            )
        );
      }
      // Cette condition vérifie si l'origine de l'ajout du commentaire provient de la modal "modal-comment-comment".
      if (origin === 'modal-comment-comment') {
        console.log("updateCommentsCacheAfterAdd origin:", origin);
      
       
        // Mise à jour des commentaires pour la page du commentaire spécifique (comment-page):
        dispatch(
          commentApi.util.updateQueryData("getCommentsByCommentId", commentedCommentId, (draftComments) => {
            // `getCommentsByCommentId` récupère les commentaires associés à un commentaire spécifique (réponses à un commentaire).
            
            console.log("Before update getCommentsByCommentId draftComments:", draftComments.data);
            // Log des données actuelles du cache pour les commentaires associés à ce commentaire spécifique.
            
            // Recherche du commentaire spécifique dans le cache qui doit être mis à jour avec le nouveau nombre de commentaires.
            const commentToUpdate = draftComments.data.find((comment) => comment.id === data.data.commentId);
      
            if (commentToUpdate) {
              // Si le commentaire est trouvé, on met à jour son compteur de commentaires.
              console.log("commentToUpdate before update:", commentToUpdate.commentsCount);
              // Log du nombre de commentaires avant la mise à jour.
              
              commentToUpdate.commentsCount = (commentToUpdate.commentsCount ?? 0) + 1;
              // Incrémente le nombre de commentaires pour ce commentaire spécifique.
              
              console.log("commentToUpdate after update:", commentToUpdate.commentsCount);
              // Log du nombre de commentaires après la mise à jour.
            } else {
              // Si le commentaire n'est pas trouvé dans le cache, un message est logué pour indiquer qu'il est introuvable.
              console.log("commentToUpdate not found");
            }
          })
        ),
        
        //Mise à jour des commentaires pour la page du post (post-page):
        dispatch(
          commentApi.util.updateQueryData("getCommentsByPostId", commentedPostId, (draftComments) => {
            // `getCommentsByPostId` récupère les commentaires associés à un post spécifique.
            
            console.log("Before update getCommentsByPostId draftComments:", draftComments.data);
            // Log des données actuelles du cache pour les commentaires associés à ce post spécifique.
            
            // Recherche du commentaire spécifique dans le cache qui doit être mis à jour avec le nouveau nombre de commentaires.
            const commentToUpdate = draftComments.data.find((comment) => comment.id === data.data.commentId);
      
            if (commentToUpdate) {
              // Si le commentaire est trouvé, on met à jour son compteur de commentaires.
              console.log("commentToUpdate before update:", commentToUpdate.commentsCount);
              // Log du nombre de commentaires avant la mise à jour.
              
              commentToUpdate.commentsCount = (commentToUpdate.commentsCount ?? 0) + 1;
              // Incrémente le nombre de commentaires pour ce commentaire spécifique.
              
              console.log("commentToUpdate after update:", commentToUpdate.commentsCount);
              // Log du nombre de commentaires après la mise à jour.
            } else {
              // Si le commentaire n'est pas trouvé dans le cache, un message est logué pour indiquer qu'il est introuvable.
              console.log("commentToUpdate not found");
            }
          })
        )
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateCommentsCacheAfterLike = async ( dispatch: any, id: string, queryFulfilled: any, commentedPostId: string, commentedCommentId: string) => {
  try {
    const { data } = await queryFulfilled;
    dispatch(
      commentApi.util.updateQueryData("getCommentById", id, (draft) => {
        const commentUpdated = draft.data;
        if (commentUpdated) {
          commentUpdated.commentLikers = data.data.likers;
        }
      })
    );
    if (commentedPostId) {
      dispatch(
        commentApi.util.updateQueryData("getCommentsByPostId", commentedPostId, (draftComments) => {
          const commentToUpdate = draftComments.data.find((comment) => comment.id === id);
          if (commentToUpdate) {
              commentToUpdate.commentLikers = data.data.likers;
            } else {
              console.log("commentToUpdate not found");
            }})
      );
    } else if (commentedCommentId) {
      dispatch(
        commentApi.util.updateQueryData("getCommentsByCommentId", commentedCommentId, (draftComments) => {
          const commentToUpdate = draftComments.data.find((comment) => comment.id === id);
          if (commentToUpdate) {
              commentToUpdate.commentLikers = data.data.likers;
            } else {
              console.log("commentToUpdate not found");
            }})
      );
    }
  } catch (error) {
    console.error("Failed to update cache after liking comment:", error);
  }
}