import { useRepostMutation } from "../../services/api/postApi";
import { ApiError } from "../../utils/types/api.types";
import { usePushToast } from "../toast/useToast";
import Form from "./Form";
import { useForm } from "./hooks/useForm";
import { FormOrigin } from "./utils/switchOrigin";

interface AddPostProps {
  origin: FormOrigin;
  onClose?: () => void;
}

const AddRepost = ({ origin, onClose }: AddPostProps) => {
  const { form, resetFormState } = useForm(origin);
  const [repost, { isLoading }] = useRepostMutation();
  const pushToast = usePushToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userId", form.userId as string);
      formData.append("content", form.content as string);
      formData.append("originalPostId", form.originalPostId as string);
      if (form.originalCommentId) {
        formData.append("originalCommentId", form.originalCommentId as string);
      }

      const response = await repost(formData).unwrap();
      pushToast({ message: response.message, type: "success" });
    } catch (error) {
      pushToast({ message: (error as ApiError).data.message, type: "error" });
    } finally {
      resetFormState();
      onClose && onClose();
    }
  };
  
    if (isLoading) return <p>Publication en cours...</p>;
  return <Form origin={origin} handleSubmit={handleSubmit}/>
};

export default AddRepost;
