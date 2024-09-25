import BtnMessage from "../../components/Actions/btn-message/BtnMessage";
import ConversationList from "../../components/Display/conversation/ConversationList";
import MessageList from "../../components/Display/conversation/messages/MessageList";
import { useWindowSize } from "../../utils/hooks/useWindowSize";

const Messages = () => {
    const { windowWidth } = useWindowSize();
    const isTablet = windowWidth <= 1020;
    return (
        <div className="messages-page">
            <header className="messages-page__header">
                <h1 className="messages-page__title">Messages</h1>
                <BtnMessage />
            </header>
            <div className="messages-page__content">
                {!isTablet ? <ConversationList/> : <MessageList />}
            </div>
        </div>
    );
};

export default Messages;