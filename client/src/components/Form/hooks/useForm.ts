import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../services/stores";
import {
  setForm,
  resetForm,
  handleFileChange,
  handleContentChange,
  FormState,
  selectFormByOrigin,
} from "../../../services/forms/formSlice";
import { useRef } from "react";
import { FormOrigin } from "../utils/switchOrigin";

export const useForm = (origin?: FormOrigin) => {
  const dispatch = useDispatch();

  // Sélectionner le formulaire spécifique à l'origin uniquement si défini
  const form = useSelector((state: RootState) => origin ? selectFormByOrigin(state, origin) : {});

  const inputFileRef = useRef<HTMLInputElement>(null);

  const setFormState = (formState: Partial<FormState>) => {
    if (origin) {
      dispatch(setForm({ origin, formState }));
    }
  };

  const resetFormState = () => {
    if (origin) {
      dispatch(resetForm({ origin }));
    }
  };

  const changeFile = (file: File) => {
    if (origin) {
      dispatch(handleFileChange({ origin, file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setForm({ 
          origin, 
          formState: { 
            preview: reader.result as string,
            mimetype: file.type
          } 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const embedYoutube = (url: string) => {
    const embedVideo = url.replace("watch?v=", "embed/").split("&")[0];
    return embedVideo;
  };

  const changeContent = (content: string) => {
    if (origin) {
      dispatch(handleContentChange({ origin, content }));

      if (content.includes("youtube.com") || content.includes("youtu.be")) {
        const youtubeUrl = embedYoutube(content);
        dispatch(setForm({ 
          origin, 
          formState: { 
            file: youtubeUrl,
            preview: youtubeUrl,
            isPreview: true,
            mimetype: "video/youtube"
          } 
        }));

      } else if (form.file?.toString().includes("youtube.com") || form.file?.toString().includes("youtu.be")) {
        dispatch(setForm({ 
          origin, 
          formState: { 
            file: "",
            preview: "",
            isPreview: false,
            mimetype: ""
          } 
        }));
      }
    }
  };

  const resetFile = () => {
    if (origin) {
      dispatch(setForm({ 
        origin, 
        formState: { 
          file: "", 
          isPreview: false, 
          preview: "", 
          mimetype: "" 
        } 
      }));
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
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
