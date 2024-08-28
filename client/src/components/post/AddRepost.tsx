import { useRepostMutation } from "../../services/api/postApi";
import { usePushToast } from "../toast/Toasts";
import { ApiError } from "../../utils/types/api.types";
import PostForm, { PostFormOrigin } from "./PostForm";
import { usePostFormContext } from "./hooks/usePostFormContext";
import { useEffect } from "react";

interface AddPostProps {
  origin: PostFormOrigin;
  onClose?: () => void;
}

const AddRepost = ({ origin, onClose }: AddPostProps) => {
  const {
    form,
    resetForm,
  } = usePostFormContext();

  const [repost, { isLoading }] = useRepostMutation();
  const pushToast = usePushToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userId", form.userId as string);
      formData.append("content", form.content as string);
      formData.append("originalPostId", form.originalPostId as string);

      const response = await repost(formData).unwrap();
      pushToast({ message: response.message, type: "success" });
    } catch (error) {
      pushToast({ message: (error as ApiError).data.message, type: "error" });
    } finally {
      resetForm();
      onClose && onClose();
    }
  };
  
  useEffect(() => {
    console.log("AddRepost", origin);
      console.log("AddRepost", form);
    }, [form, origin]);
    
    if (isLoading) return <p>Publication en cours...</p>;
  return <PostForm handleSubmit={handleSubmit} origin={origin}/>
};

export default AddRepost;
