import { useEffect, type FunctionComponent, type PropsWithChildren } from "react";
import { ProfilPicture } from "../userProfile/UserProfileThumbnail";
import PreviewPicture from "../Actions/addPicture/PreviewPicture";
import Button from "../Base/button/Button";
import InputPicture from "../Actions/addPicture/InputPicure";
import RepostCard from "../Display/repost/RepostCard";
import { useSelector } from "react-redux";
import { RootState } from "../../services/stores";
import { useForm } from "./hooks/useForm";
import ContentField from "./inputFields/ContentField";
import { FormOrigin, switchOrigin } from "./utils/switchOrigin";

interface FormProps
  extends PropsWithChildren<{
    origin: FormOrigin;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  }> {}

const Form: FunctionComponent<FormProps> = ({ origin, handleSubmit }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { form, inputFileRef, setFormState, changeFile, resetFile } = useForm(origin);
  const { buttonText } = switchOrigin(origin!);

  useEffect(() => {
    // Reset le formulaire à chaque ouverture
    if (origin && origin !== "modal-message" && form ) {
      setFormState({ userId: user?.id });
    }
  }, [user?.id]);

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
        <ContentField origin={origin} />
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