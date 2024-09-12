import { bookmarkApi } from "../api/bookmarkApi";

export const updateBookmarkCacheAfterAddToBookmarks = async ( 
    userId: string, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { dispatch, queryFulfilled }: { dispatch: any; queryFulfilled: any } ,
    postId?: string, 
    commentId?: string, 
) => { 
    try {
        const { data } = await queryFulfilled;

        dispatch(
            bookmarkApi.util.updateQueryData("getBookmarks", userId, (draft) => {
                if (postId) {
                    // Mise à jour pour les posts
                    const isAlreadyBookmarked = draft.data.some(
                        (bookmark) => bookmark.postId === postId
                    );

                    if (isAlreadyBookmarked) {
                        // Si le post était déjà bookmarké, on le retire
                        draft.data = draft.data.filter(
                            (bookmark) => bookmark.postId !== postId
                        );
                    } else {
                        // Sinon, on l'ajoute aux bookmarks
                        draft.data.push({
                            postId,
                            commentId: null, // Pas de commentaire
                            ...data.data // Données supplémentaires venant de la requête
                        });
                    }
                } else if (commentId) {
                    // Mise à jour pour les commentaires
                    const isAlreadyBookmarked = draft.data.some(
                        (bookmark) => bookmark.commentId === commentId
                    );

                    if (isAlreadyBookmarked) {
                        // Si le commentaire était déjà bookmarké, on le retire
                        draft.data = draft.data.filter(
                            (bookmark) => bookmark.commentId !== commentId
                        );
                    } else {
                        // Sinon, on l'ajoute aux bookmarks
                        draft.data.push({
                            postId: null, // Pas de post
                            commentId,
                            ...data.data // Données supplémentaires venant de la requête
                        });
                    }
                }
            })
        );
    } catch (error) {
        console.error("Failed to update cache after modifying bookmarks:", error);
    }
};