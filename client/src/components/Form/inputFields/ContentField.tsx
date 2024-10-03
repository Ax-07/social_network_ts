import type { FunctionComponent } from "react";
import { useForm } from "../hooks/useForm";
import { autoResizeTextarea } from "../../../utils/functions/autoResizeTextarea";
import { getTextareaCharacterCount } from "../../../utils/functions/textareaCharacterCount";
import { FormOrigin, switchOrigin } from "../utils/switchOrigin";

interface ContentFieldProps {
  origin: FormOrigin;
}

const ContentField: FunctionComponent<ContentFieldProps> = ({ origin }) => {
  const { form, changeContent } = useForm(origin);
  const { placeholder } = switchOrigin(origin!);

  const handleInputTextarea = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    autoResizeTextarea(target);
    changeContent(target.value); // Mettre à jour le contenu dans l'état
    getTextareaCharacterCount(target);
  };
  
  return (
    <>
      <label htmlFor="content" className="sr-only">
        Contenu de la publication
      </label>
      <textarea
        className="addpost__input"
        placeholder={placeholder}
        name="content"
        id="content"
        rows={1}
        onChange={handleInputTextarea}
        value={form.content}
      />
      <p id="content-description" className="sr-only">
        {`Ajoutez du texte à votre publication. Limite de caractères : ??.`}
      </p>
    </>
  );
};

export default ContentField;
