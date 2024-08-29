import { UserApi } from "../api/userApi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateUserCacheAfterFollow = async (userId: string, followerId: string, dispatch: any, queryFulfilled: any) => {
    try {
        const { data } = await queryFulfilled;
        dispatch(
            UserApi.util.updateQueryData("getUserById", userId, (draft) => {
                const userUpdated = draft.data;
                if (userUpdated) {
                    userUpdated.followings = data.data.followings;
                }
            })
        );
        dispatch(
            UserApi.util.updateQueryData("getUserById", followerId, (draft) => {
                const userUpdated = draft.data;
                if (userUpdated) {
                    userUpdated.followers = data.data.followers;
                }
            })
        );
    } catch (error) {
        console.error("Failed to update cache after following user:", error);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updatePostCacheAfterAddToBookmarks = async ({userId}: {userId: string, postId: string}, {dispatch, queryFulfilled}: {dispatch: any, queryFulfilled: any}) => {
    try {
        const { data } = await queryFulfilled;
        console.log('Data from queryFulfilled:', data);
    
        dispatch(
          UserApi.util.updateQueryData("getUserById", userId, (draft) => {
            const userUpdated = draft.data;
            if (userUpdated) {
              console.log('User before update:', JSON.parse(JSON.stringify(userUpdated))); // Objet d'origine
    
              // Appliquer la mise à jour
              userUpdated.bookmarks = data.data.bookmarks;
    
              console.log('User after update:', JSON.parse(JSON.stringify(userUpdated))); // Vérifier l'objet après modification
            }
          })
        );
      } catch (error) {
        console.error("Failed to update cache after adding post to bookmarks:", error);
      }
    };