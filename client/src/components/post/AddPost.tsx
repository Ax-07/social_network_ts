import { useAddPostMutation } from "../../services/api/postApi";
import { usePushToast } from "../toast/Toasts";
import { ApiError } from "../../utils/types/api.types";
import PostForm from "./PostForm";
import { usePostFormContext } from "./hooks/usePostFormContext";

interface AddPostProps {
  origin: "modal-addPost" | "modal-comment" | "page-home" | "post-page-comment" | "comment-page-comment";
  onClose?: () => void;
}

const AddPost = ({ origin, onClose }: AddPostProps) => {
  const {
    form,
    isValidForm,
    resetForm,
  } = usePostFormContext();

  const [addPost, { isLoading }] = useAddPostMutation();
  const pushToast = usePushToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userId", form.userId as string);
      formData.append("content", form.content);
      if (typeof form.file === "string") {
        formData.append("media", form.file);
      } else {
        formData.append("media", form.file as Blob);
      }

      const response = await addPost(formData).unwrap();
      pushToast({ message: response.message, type: "success" });
    } catch (error) {
      pushToast({ message: (error as ApiError).data.message, type: "error" });
    } finally {
      resetForm();
      onClose && onClose();
    }
  };
console.log("AddPost", {isValidForm});  // Affiche bien isValidForm
  if (isLoading) return <p>Publication en cours...</p>;
  
  return <PostForm handleSubmit={handleSubmit} origin={origin} />
};

export default AddPost;
