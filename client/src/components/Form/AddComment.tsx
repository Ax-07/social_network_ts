import Form, { FormOrigin } from './Form';
import { useAddCommentMutation } from '../../services/api/commentApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/stores';
import { useParams } from 'react-router-dom';
import { ApiError } from '../../utils/types/api.types';
import { useForm } from './hooks/useForm';
import { usePushToast } from '../toast/useToast';

interface AddCommentProps{
  origin: FormOrigin;
  onClose?: () => void;
}

/**
 * Composant AddComment
 * 
 * Ce composant gère l'ajout de commentaires sur un post ou une réponse à un commentaire existant.
 * Il utilise différents hooks pour récupérer l'état du formulaire, soumettre les données à l'API,
 * et gérer les notifications de succès ou d'erreur.
 * 
 * @component
 * @param {AddCommentProps} props - Les propriétés du composant.
 * @param {FormOrigin} props.origin - L'origine du formulaire, qui détermine quel ID (postId ou commentId) doit être utilisé.
 * @param {() => void} [props.onClose] - Fonction optionnelle à appeler pour fermer le modal ou le composant après l'ajout du commentaire.
 * 
 * @returns {JSX.Element} Le formulaire de commentaire, ou un message de chargement si la requête est en cours.
 * 
 * @example
 * <AddComment origin="post-page-comment" onClose={() => setModalOpen(false)} />
 * 
 * @description
 * - Le composant récupère l'ID du post ou du commentaire en fonction de l'origine (`origin`).
 * - Lors de la soumission du formulaire, il crée un objet `FormData` avec les informations pertinentes et appelle l'API pour ajouter un commentaire.
 * - Affiche une notification toast en cas de succès ou d'erreur, et réinitialise le formulaire après soumission.
 */
const AddComment = ({ origin, onClose }: AddCommentProps): JSX.Element => {
  const postIdFromParams = useParams<{ id: string }>().id;
  const commentIdFromParams = useParams<{ id: string }>().id;
  // const { postId, commentId, commentedPostId, commentedCommentId } = useModal();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { form, resetFormState, } = useForm(origin);
  const [addComment, { isLoading }] = useAddCommentMutation();
  const pushToast = usePushToast();

  let formKey;
  let id;
  switch (origin) {
    case "modal-comment-post":
      formKey = "postId";
      id = form.originalPostId;
      break;
    case "modal-comment-comment":
      formKey = "commentId";
      id = form.originalCommentId;
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
      id = form.originalPostId;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('formKey', {
      formKey,
      id,
      userId,
      content: form.content,
      file: form.file
    });
    try {
      const formData = new FormData();
      formData.append(formKey, id as string);
      formData.append("userId", userId as string);
      formData.append("content", form.content as string);
      if (typeof form.file === "string") {
        formData.append("media", form.file);
      } else {
        formData.append("media", form.file as Blob);
      }

      const response = await addComment({formData: formData , origin, commentedPostId: form.originalPostId, commentedCommentId: form.originalCommentId}).unwrap();
      pushToast({ type: "success", message: response.message });
    } catch (error) {
      pushToast({ message: (error as ApiError).data.message, type: "error" });
    } finally {
      resetFormState();
      onClose && onClose();
    }
  };

  if (isLoading) return <p>Publication en cours...</p>;

  return <Form handleSubmit={handleSubmit} origin={origin} />
};

export default AddComment;