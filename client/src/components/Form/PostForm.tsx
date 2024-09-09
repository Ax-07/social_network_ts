import { type FunctionComponent, type PropsWithChildren } from 'react';
import { ProfilPicture } from '../userProfile/UserProfileThumbnail';
import PreviewPicture from '../Actions/addPicture/PreviewPicture';
import { autoResizeTextarea } from '../../utils/functions/autoResizeTextarea';
import Button from '../Base/button/Button';
import InputPicture from '../Actions/addPicture/InputPicure';
import { usePostFormContext } from './hooks/usePostFormContext';
import RepostCard from '../Display/repost/RepostCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/stores';
import { getTextareaCharacterCount } from '../../utils/functions/textareaCharacterCount';


interface PostFormProps extends PropsWithChildren <{
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    origin: PostFormOrigin;
}> {}

const PostForm: FunctionComponent<PostFormProps> = ({ handleSubmit, origin }) => {
  const user = useSelector((state: RootState) => state.auth.user);
    const { 
        form, setForm, isValidForm,
        preview, setPreview, isPreview,
        mimetype, setMimetype,
        inputFileRef, 
        handleContentChange, 
        handleFileChange, 
     } = usePostFormContext();

    const { buttonText, placeholder } = switchOrigin(origin);

    const handleInputTextarea = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const target = e.currentTarget;
        autoResizeTextarea(target);
        getTextareaCharacterCount(target);
    }

     return (
        <div className={`addpost addpost--${origin}`}>
          <figure className="addpost__avatar">
            <ProfilPicture user={user}/>
          </figure>
          <form onSubmit={handleSubmit} className="addpost__form">
            <header className="addpost__header">
              <select name="" id="">
                <option value="public">Public</option>
                <option value="private">Privé</option>
              </select>
            </header>
            <label htmlFor="content" className="sr-only">Contenu de la publication</label>
            <textarea className="addpost__input"
              placeholder={placeholder}
              name="content"
              id="content"
              rows={1}
              onChange={handleContentChange}
              value={form.content}
              onInput={handleInputTextarea}
            />
            <p id="content-description" className="sr-only">
              {`Ajoutez du texte à votre publication. Limite de caractères : ??.`}
            </p>
            {isPreview && (
              <PreviewPicture
                media={preview}
                mimetype={mimetype}
                onCancel={() => {
                  setForm({ ...form, file: "" });
                  setPreview("");
                  setMimetype("");
                  if (inputFileRef.current) {
                    inputFileRef.current.value = ""; // Réinitialiser la valeur de l'entrée de fichier
                  }
                }}
              />
            )}
            {form.originalPostId &&
            (<aside className='addpost__repost-card'>
              <RepostCard originalPostId={form.originalPostId} orignalCommentId={form.originalCommentId}/>
            </aside>
          )}
          
            <footer className="addpost__bottom">
              <InputPicture setMedia={handleFileChange} inputRef={inputFileRef} />
              <Button type="submit"
                className="btn__post btn__post-submit"
                disabled={!isValidForm}  // Utilisation de isValidForm pour désactiver le bouton
              >
                {buttonText}
              </Button>
            </footer>
          </form>
        </div>
      );
};

export default PostForm;

/**
 * @description Type pour définir l'origine du formulaire de publication
 */
export type PostFormOrigin = 
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
const switchOrigin = (origin: PostFormOrigin) => {
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
  