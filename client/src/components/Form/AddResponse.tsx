import { useEffect, type FunctionComponent } from "react";
import { useForm } from "./hooks/useForm";
import { usePushToast } from "../toast/useToast";
import { ApiError } from "../../utils/types/api.types";
import { useAddMessageMutation } from "../../services/api/messagesApi";
import { useSelector } from "react-redux";
import { RootState } from "../../services/stores";
import ContentField from "./inputFields/ContentField";
import PreviewPicture from "../Actions/addPicture/PreviewPicture";
import InputPicture from "../Actions/addPicture/InputPicure";
import Button from "../Base/button/Button";

interface AddResponseProps {
  receiverId: string;
  roomId: string;
}

const AddResponse: FunctionComponent<AddResponseProps> = ({
  receiverId,
  roomId,
}) => {
  const origin = "response-message";
  const userId = useSelector((state: RootState) => state?.auth?.user?.id);
  const {
    form,
    inputFileRef,
    setFormState,
    resetFormState,
    changeFile,
    resetFile,
  } = useForm(origin);
  const pushToast = usePushToast();
  const [addMessage] = useAddMessageMutation();

  useEffect(() => {
    setFormState({
      senderId: userId,
      receiverId: receiverId,
      roomId: roomId,
      messageType: "text",
    });
  }, [roomId]);

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
    }
  };

  return (

      <form onSubmit={handleSubmit} className="message-form">
        <InputPicture setMedia={changeFile} inputRef={inputFileRef} />
        <ContentField origin={origin} />
        {form.preview && (
          <PreviewPicture
            media={form.preview}
            mimetype={form.mimetype}
            onCancel={resetFile}
          />
        )}
        <Button type="submit" disabled={!form.isValidForm} className="btn-send-message">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path  d="M2.504 21.866l.526-2.108C3.04 19.719 4 15.823 4 12s-.96-7.719-.97-7.757l-.527-2.109L22.236 12 2.504 21.866zM5.981 13c-.072 1.962-.34 3.833-.583 5.183L17.764 12 5.398 5.818c.242 1.349.51 3.221.583 5.183H10v2H5.981z" 
                    fill="rgb(29, 155, 240)"
              />
          </svg>
        </Button>
      </form>
  );
};

export default AddResponse;
