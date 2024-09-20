import type { FunctionComponent } from "react";
import { useGetConversationsByUserIdQuery } from "../../../services/api/conversationsApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../services/stores";
import {
  UserNameHoverDisplayCard,
  UserThumbnailHoverDisplayCard,
} from "../../userProfile/UserHoverDisplayCard ";
import { initRoomId } from "../../../services/stores/messageSlice";

interface ConversationListProps {}

const ConversationList: FunctionComponent<ConversationListProps> = () => {
  const userId = useSelector((state: RootState) => state?.auth?.user?.id);
  const { data: { data: conversations } = {} } = useGetConversationsByUserIdQuery(userId as string);
  const dispatch = useDispatch();
  const handleSelectConversation = (roomId: string) => {
    dispatch(initRoomId(roomId));
    console.log("roomId", roomId);
  };
  return (
    <div className="post">
      <ul className="post__list">
        {conversations?.map((conversation) => (
          <li className="post__item" key={conversation.id} onClick={()=> handleSelectConversation(conversation.roomId)}>
            <article className="post-card">
              <UserThumbnailHoverDisplayCard user={conversation.admin} />
              <div className="post-card__wrapper">
                <UserNameHoverDisplayCard
                  user={conversation.admin}
                  createdAt={conversation.createdAt}
                />
                <p>{conversation.messages[0].content}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationList;
