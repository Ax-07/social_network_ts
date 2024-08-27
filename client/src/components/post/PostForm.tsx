import { type FunctionComponent, type PropsWithChildren } from 'react';
import { UserPicture } from '../userProfile/UserProfileThumbnail';
import PreviewPicture from '../addPicture/PreviewPicture';
import { autoResizeTextarea } from '../../utils/functions/autoResizeTextarea';
import Button from '../button/Button';
import InputPicture from '../addPicture/InputPicure';
import { usePostFormContext } from './hooks/usePostFormContext';
import RepostCard from './RepostCard';


interface PostFormProps extends PropsWithChildren <{
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    origin: PostFormOrigin;
}> {}

const PostForm: FunctionComponent<PostFormProps> = ({ handleSubmit, origin }) => {
    const { 
        form, setForm, isValidForm,
        preview, setPreview, isPreview,
        mimetype, setMimetype,
        inputFileRef, 
        handleContentChange, 
        handleFileChange, 
     } = usePostFormContext();

    const { buttonText, placeholder } = switchOrigin(origin);

     return (
        <div className={`addpost addpost--${origin}`}>
          <div className="addpost__avatar">
            <UserPicture />
          </div>
          <form onSubmit={handleSubmit} className="addpost__form">
            <div className="addpost__header">
              <select name="" id="">
                <option value="public">Public</option>
                <option value="private">Privé</option>
              </select>
            </div>
            <textarea className="addpost__input"
              placeholder={placeholder}
              name="content"
              id="content"
              rows={1}
              onChange={handleContentChange}
              value={form.content}
              onInput={(e) => autoResizeTextarea(e.currentTarget)}
            />
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
            (<div className='addpost__repost-card'>
              <RepostCard originalPostId={form.originalPostId} />
            </div>
          )}
            <div className="addpost__bottom">
              <InputPicture setMedia={handleFileChange} inputRef={inputFileRef} />
              <Button type="submit"
                className="btn__post btn__post-submit"
                disabled={!isValidForm}  // Utilisation de isValidForm pour désactiver le bouton
              >
                {buttonText}
              </Button>
            </div>
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
  | "modal-repost-comment";

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
    default:
      buttonText = "Publier";
      placeholder = "Quoi de neuf ?";
      break;
  }

  return { buttonText, placeholder };
};
  