import PostForm, { PostFormOrigin } from './PostForm';
import { usePostFormContext } from './hooks/usePostFormContext';
import { useAddCommentMutation } from '../../services/api/commentApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/stores';
import { useParams } from 'react-router-dom';
import { usePushToast } from '../toast/Toasts';
import { ApiError } from '../../utils/types/api.types';
import { useModal } from '../modal/hook/useModal';

interface AddCommentProps{
  origin: PostFormOrigin;
  onClose?: () => void;
}

const AddComment = ({ origin, onClose }: AddCommentProps) => {
  const postIdFromParams = useParams<{ id: string }>().id;
  const commentIdFromParams = useParams<{ id: string }>().id;
  const { postId, commentId } = useModal();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const postForm = usePostFormContext();
  const [addComment, { isLoading }] = useAddCommentMutation();
  const pushToast = usePushToast();
console.log('origin', origin);

  let formKey;
  let id;
  switch (origin) {
    case "modal-comment-post":
      formKey = "postId";
      id = postId;
      break;
    case "modal-comment-comment":
      formKey = "commentId";
      id = commentId;
      break;
    case "post-page-comment":
      formKey = "postId";
      id = postIdFromParams;
      break;
    case "comment-page-comment":
      formKey = "commentId";
      id = commentIdFromParams;
      break;
    default:
      formKey = "postId";
      id = postId;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('formKey', {
      formKey,
      id,
      userId,
      content: postForm.form.content,
      file: postForm.form.file
    });
    try {
      const formData = new FormData();
      formData.append(formKey, id as string);
      formData.append("userId", userId as string);
      formData.append("content", postForm.form.content);
      if (typeof postForm.form.file === "string") {
        formData.append("media", postForm.form.file);
      } else {
        formData.append("media", postForm.form.file as Blob);
      }

      const response = await addComment({formData: formData , origin}).unwrap();
      pushToast({ message: response.message, type: "success" });
    } catch (error) {
      pushToast({ message: (error as ApiError).data.message, type: "error" });
    } finally {
      postForm.resetForm();
      onClose && onClose();
    }
  };

  if (isLoading) return <p>Publication en cours...</p>;

  return <PostForm handleSubmit={handleSubmit} origin={origin} />
};

export default AddComment;