import { type FunctionComponent, type PropsWithChildren } from 'react';
import { UserPicture } from '../userProfile/UserProfileThumbnail';
import PreviewPicture from '../addPicture/PreviewPicture';
import { autoResizeTextarea } from '../../utils/functions/autoResizeTextarea';
import Button from '../button/Button';
import InputPicture from '../addPicture/InputPicure';
import { usePostFormContext } from './hooks/usePostFormContext';

interface PostFormProps extends PropsWithChildren <{
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    origin: "modal-addPost" | "modal-comment" | "page-home" | "post-page-comment" | "comment-page-comment" | "post-list" | "modal-comment-post" | "modal-comment-comment";
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

     console.log("origin", origin);

     let buttonText = "";
     switch (origin) {
       case "modal-addPost":
         buttonText = "Poster";
         break;
       case "modal-comment":
         buttonText = "Commenter";
         break;
       case "page-home":
         buttonText = "Publier";
         break;
       case "post-page-comment":
         buttonText = "Répondre";
         break;
        case "comment-page-comment":
          buttonText = "Répondre";
          break;
       default:
         buttonText = "Publier";
         break;
     }
     
     let placeholder = "";
      switch (origin) {
        case "modal-addPost":
          placeholder = "Quoi de neuf ?";
          break;
        case "modal-comment":
          placeholder = "Ajouter un commentaire...";
          break;
        case "page-home":
          placeholder = "Quoi de neuf ?";
          break;
        case "post-page-comment":
          placeholder = "Ajouter un commentaire...";
          break;
        case "comment-page-comment":
          placeholder = "Ajouter un commentaire...";
          break
        default:
          placeholder = "Quoi de neuf ?";
          break;
      }

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
            <textarea
              className="addpost__input"
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
            <div className="addpost__bottom">
              <InputPicture setMedia={handleFileChange} inputRef={inputFileRef} />
              <Button
                type="submit"
                className="btn__post-submit"
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