import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../services/stores";
import { FormState } from "../../../utils/types/form.types";
import { PostFormOrigin } from "../PostForm";

export interface PostFormContextType {
  origin: PostFormOrigin | undefined;
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
  origin: PostFormOrigin | undefined;
  children: ReactNode;
  originalPostId?: string;
  originalCommentId?: string;
}

export const PostFormContext = createContext<PostFormContextType | undefined>(
  undefined
);

export const PostFormProvider = ({
  origin,
  children,
  originalPostId,
  originalCommentId,
}: PostFormProviderProps) => {
  const userId = useSelector((state: RootState) => state?.auth?.user?.id);
  const [form, setForm] = useState<FormState>({
    userId: userId,
    content: "",
    file: "",
    originalPostId: "",
    originalCommentId: "",
  });
  const [preview, setPreview] = useState<string>("");
  const [mimetype, setMimetype] = useState<string>("");

  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isValidForm, setIsValidForm] = useState<boolean>(false);

  const inputFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsPreview(form.file !== "");
    setIsValidForm((form.content?.trim()?.length ?? 0) > 0 || form.file !== "");
  }, [form]);

  const setOriginalPostId = useCallback(
    (originalPostId: string) => {
      setForm((prevForm) => ({ ...prevForm, originalPostId }));
    },
    [setForm]
  );

  useEffect(() => {
    if (originalPostId) {
      setOriginalPostId(originalPostId);
    }
  }, [originalPostId, setOriginalPostId]);

  const setOriginalCommentId = useCallback(
    (originalCommentId: string) => {
      setForm((prevForm) => ({ ...prevForm, originalCommentId }));
    },
    [setForm]
  );

  useEffect(() => {
    if (originalCommentId) {
      setOriginalCommentId(originalCommentId);
    }
  }, [originalCommentId, setOriginalCommentId]);

  const resetForm = useCallback(() => {
    setForm({
      userId: userId,
      content: "",
      file: "",
      originalPostId: "",
      originalCommentId: "",
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
      const file = form.file;
      console.log("file", file);

      if (content.includes("youtube.com") || content.includes("youtu.be")) {
        const youtubeUrl = embedYoutube(content);
        setPreview(youtubeUrl);
        setForm((prevForm) => ({ ...prevForm, file: youtubeUrl }));
        setMimetype("video/youtube");
      } else if (
        ((!content.includes("youtube.com") || !content.includes("youtu.be")) &&
          file?.toString().includes("youtube.com")) ||
        file?.toString().includes("youtu.be")
      ) {
        setForm((prevForm) => ({ ...prevForm, file: "" }));
        setPreview("");
        setMimetype("");
      }
    },
    [form]
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