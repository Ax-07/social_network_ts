import { type FunctionComponent } from "react";
import Form from "./Form";
import { useForm } from "./hooks/useForm";
import { ApiError } from "../../utils/types/api.types";
import { usePushToast } from "../toast/useToast";
import { FormOrigin } from "./utils/switchOrigin";
import { useAddMessageMutation } from "../../services/api/messagesApi";
import { useGetUserByIdQuery } from "../../services/api/userApi";
import { useSelector } from "react-redux";
import { RootState } from "../../services/stores";

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
  console.log("user", user);

  const userFollowers = user?.followers;
  const userFollowings = user?.followings;
  const userFollow = [...(userFollowers || []), ...(userFollowings || [])];

  const uniqueUserFollow = userFollow.filter(
    (follower, index, self) =>
      index ===
      self.findIndex(
        (t) => t.id === follower.id && t.username === follower.username
      )
  );

  const setReceiverId = (receiverId: string) => {
    const roomId = Math.random().toString(36).substring(7);
    setFormState({ senderId: userId, receiverId, roomId, messageType: "text" });
    console.log("receiverId", receiverId);
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
      <div>search user</div>
      <div>create group</div>
      {uniqueUserFollow &&
        uniqueUserFollow.map((follower: { id: string; username: string }) => (
          <button key={follower.id} onClick={() => setReceiverId(follower.id)}>
            {follower.username}
          </button>
        ))}
      <Form origin={origin} handleSubmit={handleSubmit} aria-live="assertive" />
    </>
  );
};

export default AddMessage;
