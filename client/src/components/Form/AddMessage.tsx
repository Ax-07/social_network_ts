import { useState, type FunctionComponent } from "react";
import Form from "./Form";
import { useForm } from "./hooks/useForm";
import { ApiError } from "../../utils/types/api.types";
import { usePushToast } from "../toast/useToast";
import { FormOrigin } from "./utils/switchOrigin";
import { useAddMessageMutation } from "../../services/api/messagesApi";
import { useGetUserByIdQuery } from "../../services/api/userApi";
import { useSelector } from "react-redux";
import { RootState } from "../../services/stores";
import { User } from "../../utils/types/user.types";

interface AddMessageProps {
  origin: FormOrigin;
  onClose: () => void;
}

const AddMessage: FunctionComponent<AddMessageProps> = ({
  origin,
  onClose,
}) => {
  const userId = useSelector((state: RootState) => state?.auth?.user?.id);
  const { data: { data: user } = {} } = useGetUserByIdQuery(userId as string);
  const { form, setFormState, resetFormState } = useForm(origin);
  const [addMessage] = useAddMessageMutation();
  const pushToast = usePushToast();
  const [searchTerm, setSearchTerm] = useState(""); // État pour stocker la valeur de recherche
  const [receiver, setReceiver] = useState({ name: "", handle: "" });
  const uniqueUserFollow = getUniqueFollows(user as User); // Récupérer les utilisateurs que suit ou qui suivent l'utilisateur connecté

  // Filtrer les utilisateurs en fonction de la recherche
  const filteredUsers = uniqueUserFollow?.filter((follower) =>
    follower.username.toLowerCase().includes(searchTerm.toLowerCase())
  ); console.log(filteredUsers);

  const initReceiverName = (receiverId: string) => {
    const receiver = uniqueUserFollow?.find(
      (follower) => follower.id === receiverId
    );
    setReceiver({name: receiver?.username as string, handle: receiver?.handle as string});
  }

  const setFormWithReceiverId = (receiverId: string) => {
    const roomId = Math.random().toString(36).substring(7);
    setFormState({ senderId: userId, receiverId, roomId, messageType: "text" });
    initReceiverName(receiverId);
  };

  const reset = () => {
    resetFormState();
    setReceiver({name: "", handle: ""});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    try {
      formData.append("senderId", form.senderId as string);
      formData.append("receiverId", form.receiverId as string);
      formData.append("content", form.content as string);
      if (typeof form.file === "string") {
        formData.append("media", form.file); // Ici on ajoute le lien vers une vidéo YouTube
      } else if (form.file) {
        formData.append("media", form.file as Blob); // Ici on ajoute le fichier média (vidéo ou image)
      }
      formData.append("roomId", form.roomId as string);
      formData.append("messageType", form.messageType as string);

      const response = await addMessage(formData).unwrap();
      pushToast({ message: response.message, type: "success" });
    } catch (error) {
      if (error && (error as ApiError)?.data?.message) {
        pushToast({ message: (error as ApiError).data.message, type: "error" });
      } else {
        pushToast({ message: "Une erreur est survenue", type: "error" });
      }
    } finally {
      resetFormState();
      onClose && onClose();
    }
  };

  return (
    <>
      <h2 className="add-message__title">Nouveau Message</h2>
      {receiver.name &&
      <ul className="add-message__receiver-list">
        <li className="add-message__receiver-item">
          <h3 className="add-message__receiver-name">{receiver.name}</h3>
          <p className="add-message__receiver-handle">{"- "}{receiver.handle}</p>
          <span className="add-message__receiver-remove" onClick={reset}>❌</span>
        </li>
      </ul>
      }
      {!form.receiverId && (
        <>
          <div className="add-message__search">
            <img src={"src/assets/icons/faSearch.svg"} alt="icon loupe" />
            <input
              type="search"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Mettre à jour la valeur de recherche
            />
          </div>
          <div>create group</div>
          <ul className="add-message__user-list">
            {filteredUsers &&
              filteredUsers.map(
                (follower: {
                  id: string;
                  username: string;
                  profilPicture: string;
                  handle: string;
                }) => (
                  <li
                    className="add-message__user-item"
                    key={follower.id}
                    onClick={() => setFormWithReceiverId(follower.id)}
                  >
                    <img
                      className="add-message__user-picture"
                      src={
                        follower.profilPicture ||
                        "/images/Default-user-picture.png"
                      }
                      alt=""
                    />
                    <div className="add-message__wrapper">
                      <h2 className="add-message__user-name">
                        {follower.username}
                      </h2>
                      <p className="add-message__user-handle">
                        {follower.handle}
                      </p>
                    </div>
                  </li>
                )
              )}
          </ul>
        </>
      )}
      {form.receiverId && (
        <Form
          origin={origin}
          handleSubmit={handleSubmit}
          aria-live="assertive"
        />
      )}
    </>
  );
};

export default AddMessage;



const getUniqueFollows = (user: User) => {
  if (!user) {
    return null;
  }
  const userFollowers = user.followers;
  const userFollowings = user.followings;
  const userFollow = userFollowers?.concat(userFollowings || []);

  return userFollow?.filter(
    (follower, index, self) =>
      index ===
      self.findIndex(
        (t) => t.id === follower.id && t.username === follower.username
      )
  );
}