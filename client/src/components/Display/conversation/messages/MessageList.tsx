import type { FunctionComponent } from "react";
import { useGetMessagesByRoomIdQuery } from "../../../../services/api/messagesApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../services/stores";
import AddResponse from "../../../Form/AddResponse";
import { useGetUserByIdQuery } from "../../../../services/api/userApi";
import { getFormattedDate, getTimeSinceCreation } from "../../../../utils/functions/formatedDate";

interface MessageListProps {}

const MessageList: FunctionComponent<MessageListProps> = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const roomId = useSelector((state: RootState) => state.messages.roomId);
  const { data: { data: messages } = {} } = useGetMessagesByRoomIdQuery(roomId);
  const { data: { data: user } = {} } = useGetUserByIdQuery(messages?.[0].senderId as string);

  if (!messages) return <div>Loading...</div>;
  const receiverId = messages[0]?.senderId === userId ? messages[0]?.receiverId : messages[0]?.senderId;

  return (
    <div className="messages-list">
      <h2>{user?.username}</h2>
      <header className="messages-list__header">
        <img
          src={user?.profilPicture || "/images/Default-user-picture.png"}
          alt="Photo de profile de l'utilisateur"
        />
        <h3>{user?.username}</h3>
        <h4>{user?.handle}</h4>
        <p>{user?.bio}</p>
        <p className="fs-15-600">
          Membre depuis {getFormattedDate(user?.createdAt?.toString() ?? "")}
        </p>
        <p>est suivi par:</p>
      </header>
      <ul className="messages-list__list">
        {messages.map((message) => (
          <li key={message.id} className={`messages-list__item ${ message.senderId === userId ? "self" : ""}`}>
            <p className="messages-list__content">{message.content}</p>
            <p className="messages-list__info">{message.sender.username} {getTimeSinceCreation(message?.createdAt?.toString() ?? "")}</p>
          </li>
        ))}
      </ul>
      <AddResponse receiverId={receiverId} roomId={roomId}/>
    </div>
  );
};

export default MessageList;
