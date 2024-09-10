import { useEffect, type FunctionComponent, type PropsWithChildren } from "react";
import { ProfilPicture } from "../userProfile/UserProfileThumbnail";
import PreviewPicture from "../Actions/addPicture/PreviewPicture";
import { autoResizeTextarea } from "../../utils/functions/autoResizeTextarea";
import Button from "../Base/button/Button";
import InputPicture from "../Actions/addPicture/InputPicure";
import RepostCard from "../Display/repost/RepostCard";
import { useSelector } from "react-redux";
import { RootState } from "../../services/stores";
import { getTextareaCharacterCount } from "../../utils/functions/textareaCharacterCount";
import { useForm } from "./hooks/useForm";

interface FormProps
  extends PropsWithChildren<{
    origin: FormOrigin;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  }> {}

const Form: FunctionComponent<FormProps> = ({ origin, handleSubmit }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { form, inputFileRef, setFormState, changeContent, changeFile, resetFile } = useForm(origin);
  const { buttonText, placeholder } = switchOrigin(origin!);

  useEffect(() => {
    // Reset le formulaire à chaque ouverture
    setFormState({ userId: user?.id });
  }, [user?.id]);

  const handleInputTextarea = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    autoResizeTextarea(target);
    getTextareaCharacterCount(target);
  };

  return (
    <div className={`addpost addpost--${origin}`}>
      <figure className="addpost__avatar">
        <ProfilPicture user={user} />
      </figure>
      <form onSubmit={handleSubmit} className="addpost__form">
        <header className="addpost__header">
          <select name="" id="">
            <option value="public">Public</option>
            <option value="private">Privé</option>
          </select>
        </header>
        <label htmlFor="content" className="sr-only">
          Contenu de la publication
        </label>
        <textarea
          className="addpost__input"
          placeholder={placeholder}
          name="content"
          id="content"
          rows={1}
          onChange={(e) => changeContent(e.currentTarget.value)}
          value={form.content}
          onInput={handleInputTextarea}
        />
        <p id="content-description" className="sr-only">
          {`Ajoutez du texte à votre publication. Limite de caractères : ??.`}
        </p>
        {form.isPreview && (
          <PreviewPicture
            media={form.preview as string}
            mimetype={form.mimetype}
            onCancel={resetFile}
          />
        )}
        {form.originalPostId && (
          <aside className="addpost__repost-card">
            <RepostCard
              origin={origin}
              originalPostId={form.originalPostId}
              originalCommentId={form.originalCommentId}
            />
          </aside>
        )}

        <footer className="addpost__bottom">
          <InputPicture setMedia={changeFile} inputRef={inputFileRef} />
          <Button
            type="submit"
            className="btn__post btn__post-submit"
            disabled={!form.isValidForm} // Utilisation de isValidForm pour désactiver le bouton
          >
            {buttonText}
          </Button>
        </footer>
      </form>
    </div>
  );
};

export default Form;

/**
 * @description Type pour définir l'origine du formulaire de publication
 */
export type FormOrigin =
  | "modal-addPost" // Ajout de publication via le modal
  | "modal-comment" // Ajout de commentaire via le modal
  | "modal-comment-post" // Ajout de commentaire a un post via le boutton addComment de postCard
  | "modal-comment-comment" // Ajout de commentaire a un commentaire via le boutton addComment de commentCard
  | "page-home" // Ajout de publication via la page d'accueil
  | "post-page-comment" // Ajout de commentaire via la page d'un post
  | "comment-page-comment" // Ajout de commentaire via la page d'un commentaire
  | "post-list" // Ajout de publication via la liste des publications ( a verifier l'utilité )
  | "btn-repost" // Repost d'une publication
  | "modal-repost" // Repost d'une publication via le modal
  | "btn-repost-with-comment" // Repost d'une publication avec commentaire
  | "modal-repost-comment" // Repost d'une publication avec commentaire via le modal
  | "modal-message"; // Envoie de message via le modal

/**
 * @description Fonction pour changer le texte du bouton et le placeholder du textarea, en fonction de l'origine du formulaire
 * @param origin
 * @returns buttonText et placeholder
 *
 */
const switchOrigin = (origin: FormOrigin) => {
  let buttonText = "";
  let placeholder = "";

  switch (origin) {
    case "modal-addPost":
      buttonText = "Poster";
      placeholder = "Quoi de neuf ?";
      break;
    case "modal-comment":
      buttonText = "Commenter";
      placeholder = "Ajouter un commentaire...";
      break;
    case "modal-comment-post":
      buttonText = "Commenter";
      placeholder = "Ajouter un commentaire...";
      break;
    case "modal-comment-comment":
      buttonText = "Commenter";
      placeholder = "Ajouter un commentaire...";
      break;
    case "page-home":
      buttonText = "Publier";
      placeholder = "Quoi de neuf ?";
      break;
    case "post-page-comment":
      buttonText = "Répondre";
      placeholder = "Ajouter un commentaire...";
      break;
    case "comment-page-comment":
      buttonText = "Répondre";
      placeholder = "Ajouter un commentaire...";
      break;
    case "modal-repost":
      buttonText = "Reposter";
      placeholder = "Ajouter un commentaire...";
      break;
    case "btn-repost":
      buttonText = "Reposter";
      placeholder = "Ajouter un commentaire...";
      break;
    case "modal-repost-comment":
      buttonText = "Reposter";
      placeholder = "Ajouter un commentaire...";
      break;
    case "btn-repost-with-comment":
      buttonText = "Reposter";
      placeholder = "Ajouter un commentaire...";
      break;
    case "modal-message":
      buttonText = "Envoyer";
      placeholder = "Envoyer un message...";
      break;
    default:
      buttonText = "Publier";
      placeholder = "Quoi de neuf ?";
      break;
  }

  return { buttonText, placeholder };
};
