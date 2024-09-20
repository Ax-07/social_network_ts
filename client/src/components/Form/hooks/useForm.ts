import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../services/stores";
import {
  setForm,
  resetForm,
  handleFileChange,
  handleContentChange,
  setPreview,
  setMimetype,
  FormState,
  selectFormByOrigin,
} from "../../../services/forms/formSlice";
import { useRef } from "react";
import { FormOrigin } from "../utils/switchOrigin";

export const useForm = (origin: FormOrigin) => {
  const dispatch = useDispatch();
  // Vérifie que origin est défini avant de l'utiliser
  if (!origin) {
    console.error("Origin is not defined.");
  }
  // Sélectionner le formulaire spécifique à l'origin
  const form = useSelector((state: RootState) => {
    // Si origin est défini, on récupère le formulaire, sinon on retourne un objet vide
    return origin ? selectFormByOrigin(state, origin) : {};
  });
  const inputFileRef = useRef<HTMLInputElement>(null);

  const setFormState = (formState: Partial<FormState>) => {
    dispatch(setForm({ origin, formState }));
  };

  const resetFormState = () => {
    dispatch(resetForm({ origin }));
    changeContent("");
    resetFile();
  };

  const changeFile = (file: File) => {
    dispatch(handleFileChange({ origin, file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch(setPreview({ origin, preview: reader.result as string }));
      dispatch(setMimetype({ origin, mimetype: file.type }));
    };
    reader.readAsDataURL(file);
  };

  const embedYoutube = (url: string) => {
    const embedVideo = url.replace("watch?v=", "embed/").split("&")[0];
    return embedVideo;
  };

  const changeContent = (content: string) => {
    dispatch(handleContentChange({ origin, content }));

    if (content.includes("youtube.com") || content.includes("youtu.be")) {
      const youtubeUrl = embedYoutube(content);
      dispatch(setPreview({ origin, preview: youtubeUrl }));
      dispatch(setMimetype({ origin, mimetype: "video/youtube" }));
      dispatch(setForm({ origin, formState: { file: youtubeUrl } }));
    } else if (
      ((!content.includes("youtube.com") || !content.includes("youtu.be")) &&
        form.file?.toString().includes("youtube.com")) ||
      form.file?.toString().includes("youtu.be")
    ) {
      dispatch(setForm({ origin, formState: { file: "" } }));
      dispatch(setPreview({ origin, preview: "" }));
      dispatch(setMimetype({ origin, mimetype: "" }));
    }
  };

  const resetFile = () => {
    dispatch(setForm({ origin, formState: { file: "", isPreview: false } }));
    dispatch(setPreview({ origin, preview: "" }));
    dispatch(setMimetype({ origin, mimetype: "" }));
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  return {
    form,
    inputFileRef,
    setFormState,
    resetFormState,
    changeFile,
    resetFile,
    changeContent,
  };
};
