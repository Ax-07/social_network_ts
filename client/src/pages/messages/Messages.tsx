import BtnMessage from "../../components/Actions/btn-message/BtnMessage";
import ConversationList from "../../components/Display/conversation/ConversationList";

const Messages = () => {
    return (
        <div className="messages-page">
            <header className="messages-page__header">
                <h1 className="messages-page__title">Messages</h1>
                <BtnMessage />
            </header>
            <div className="messages-page__content">
                <ConversationList />
            </div>
        </div>
    );
};

export default Messages;