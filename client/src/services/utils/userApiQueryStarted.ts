import { UserApi } from "../api/userApi";

export const updateUserCacheAfterFollow = async ( 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userId: string, userToFollowId: string, dispatch: any, queryFulfilled: any
) => {
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
      UserApi.util.updateQueryData("getUserById", userToFollowId, (draft) => {
        const userUpdated = draft.data;
        if (userUpdated) {
          userUpdated.followers = data.data.followers;
        }
      })
    );
  } catch (error) {
    console.error("Failed to update cache after following user:", error);
  }
};


