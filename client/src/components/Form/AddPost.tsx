import { useAddPostMutation } from "../../services/api/postApi";
import { usePushToast } from "../toast/Toasts";
import { ApiError } from "../../utils/types/api.types";
import PostForm, { PostFormOrigin } from "./PostForm";
import { usePostFormContext } from "./hooks/usePostFormContext";

interface AddPostProps {
  origin: PostFormOrigin;
  onClose?: () => void;
}

/**
 * Composant AddPost
 * 
 * Ce composant gère la création d'un nouveau post, qu'il s'agisse d'un post texte, d'une vidéo, ou d'une image. 
 * Il utilise un formulaire pour capturer les données, les soumet à l'API, et affiche des notifications toast 
 * en fonction du succès ou de l'échec de l'opération.
 * 
 * @component
 * @param {AddPostProps} props - Les propriétés du composant.
 * @param {PostFormOrigin} props.origin - L'origine du formulaire, déterminant le contexte dans lequel le post est créé.
 * @param {() => void} [props.onClose] - Fonction optionnelle pour fermer la modale après la soumission réussie du post.
 * 
 * @returns {JSX.Element} Le formulaire de création de post, ou un message de chargement si la publication est en cours.
 * 
 * @example
 * <AddPost origin="modal-addPost" onClose={() => setModalOpen(false)} />
 * 
 * @description
 * - Le composant récupère les données du formulaire via le contexte `usePostFormContext`.
 * - Lors de la soumission du formulaire, il construit un objet `FormData` contenant les informations nécessaires,
 *   telles que l'ID de l'utilisateur, le contenu du post, et le fichier média (ou lien YouTube).
 * - Il appelle l'API pour ajouter le post, affiche une notification de succès ou d'erreur, et réinitialise le formulaire.
 * - Enfin, il ferme la modale si une fonction `onClose` est fournie (en fonction de l'origine).
 */
const AddPost = ({ origin, onClose }: AddPostProps): JSX.Element => {
  const { form, resetForm} = usePostFormContext();
  const [addPost, { isLoading }] = useAddPostMutation();
  const pushToast = usePushToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userId", form.userId as string);
      formData.append("content", form.content as string);
      if (typeof form.file === "string") {
        formData.append("media", form.file); // Ici on ajoute le lien vers une video youtube
      } else {
        formData.append("media", form.file as Blob); // Ici on ajoute le fichier media (video ou image)
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
  if (isLoading) return <p aria-live="polite">Publication en cours...</p>;

  
  return <PostForm handleSubmit={handleSubmit} origin={origin} aria-live="assertive"/>
};

export default AddPost;