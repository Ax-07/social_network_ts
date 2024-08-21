import React, { createContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../services/stores";
import { FormState } from "../../../utils/types/form.types";

export interface PostFormContextType {
  origin: string;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  isValidForm: boolean;
  isPreview: boolean;
  preview: string;
  mimetype: string;
  inputFileRef: React.RefObject<HTMLInputElement>;
  resetForm: () => void;
  handleFileChange: (image: File) => void;
  handleContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setPreview: (value: string) => void;
  setMimetype: (value: string) => void;
}

interface PostFormProviderProps {
  origin: string;
  children: ReactNode;
}

export const PostFormContext = createContext<PostFormContextType | undefined>(undefined);

export const PostFormProvider = ({ origin, children }: PostFormProviderProps) => {
  const userId = useSelector((state: RootState) => state?.auth?.user?.id);
  
  const [form, setForm] = useState<FormState>({
    userId: userId,
    content: "",
    file: "",
  });
  const [preview, setPreview] = useState<string>("");
  const [mimetype, setMimetype] = useState<string>("");

  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isValidForm, setIsValidForm] = useState<boolean>(false);

  const inputFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsPreview(form.file !== "");
    setIsValidForm(form.content.trim().length > 0 || form.file !== "");
  }, [form]);

  const resetForm = useCallback(() => {
    setForm({
      userId: userId,
      content: "",
      file: "",
    });
    setPreview("");
    setMimetype("");
  }, [userId]);

  const handleFileChange = useCallback((image: File) => {
    setForm((prevForm) => ({ ...prevForm, file: image }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setMimetype(image.type);
    };
    reader.readAsDataURL(image);
  }, []);

  const embedYoutube = (url: string) => {
    const embedVideo = url.replace("watch?v=", "embed/").split("&")[0];
    return embedVideo;
  };

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const content = e.target.value;
      setForm((prevForm) => ({ ...prevForm, content }));

      if (content.includes("youtube.com") || content.includes("youtu.be")) {
        const youtubeUrl = embedYoutube(content);
        setPreview(youtubeUrl);
        setForm((prevForm) => ({ ...prevForm, file: youtubeUrl }));
        setMimetype("video/youtube");
      } else {
        setPreview("");
        setMimetype("");
      }
    },
    []
  );

    return (
        <PostFormContext.Provider
        value={{
            origin,
            form,
            setForm,
            isValidForm,
            preview,
            isPreview,
            mimetype,
            inputFileRef,
            resetForm,
            handleFileChange,
            handleContentChange,
            setPreview,
            setMimetype,
        }}
        >
        {children}
        </PostFormContext.Provider>
    );
  };