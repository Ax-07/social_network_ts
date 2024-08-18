import { useState, useRef, useCallback } from "react";
import { useAddPostMutation } from "../../services/api/postApi";
import { UserPicture } from "../userProfile/UserProfileThumbnail";
import PreviewPicture from "../addPicture/PreviewPicture";
import InputPicture from "../addPicture/InputPicure"; // Correction de la typo InputPicure
import Button from "../button/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../services/stores";
import { autoResizeTextarea } from "../../utils/functions/autoResizeTextarea";
import { usePushToast } from "../toast/Toasts";

interface FormState {
  userId: string | undefined;
  content: string;
  file: File | string;
}

interface AddPostProps {
  origin: "modal" | "page";
  onClose?: () => void;
}


const AddPost = ({ origin, onClose }: AddPostProps) => {
  const userId = useSelector((state: RootState) => state?.auth?.user?.id);
  const [form, setForm] = useState<FormState>({
    userId: userId,
    content: "",
    file: "",
  });

  const [preview, setPreview] = useState<string>("");
  const [mimetype, setMimetype] = useState<string>("");

  const inputFileRef = useRef<HTMLInputElement>(null); // Référence pour l'entrée de fichier

  const isPreview = form.file !== "";
  const isValidForm = form.content.trim().length > 0;

  const [addPost, { isLoading }] = useAddPostMutation();
  const pushToast = usePushToast();

  const resetForm = useCallback(() => {
    setForm({
      userId: userId,
      content: "",
      file: "",
    });
    setPreview("");
    setMimetype("");
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userId", form.userId as string);
      formData.append("content", form.content);
      if (typeof form.file === "string") {
        formData.append("media", form.file);
      } else {
        formData.append("media", form.file as Blob);
      }

      const response = await addPost(formData).unwrap();
      if( response.status !== 201) {
          pushToast({ message: response.message, type: "error" });
        }
      pushToast({ message: response.message, type: "success" });
    } catch (error) {
      pushToast({ message: (error as Error).message, type: "error" });
    } finally {
      resetForm();
      onClose && onClose();
    }
  };

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
    console.log("url: ", url);
    const embedVideo = url.replace("watch?v=", "embed/").split('&')[0];
    return embedVideo;
  }

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    if (content.includes('youtube.com')) {
      const youtubeUrl = embedYoutube(content);
      setPreview(youtubeUrl);
      setForm((prevForm) => ({ ...prevForm, content, file: youtubeUrl }));
      setMimetype("video/youtube");
    } else {
      setForm((prevForm) => ({ ...prevForm, content }));
      setPreview("");
    }
  }, []);

  if (isLoading) return <p>Publication en cours...</p>;
  
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
          placeholder="Quoi de neuf ?"
          name="content"
          id="content"
          rows={1}
          onChange={handleContentChange}
          value={form.content}
          onInput={(e) =>  autoResizeTextarea(e.currentTarget)}
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
            disabled={!isValidForm}
          >
            Publier
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
