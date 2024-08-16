import { useState, useRef } from "react";
import {
  useAddPostMutation,
  useGetPostsQuery,
} from "../../services/api/postApi";
import { UserPicture } from "../userProfile/UserProfileThumbnail";
import PreviewPicture from "../addPicture/PreviewPicture";
import InputPicture from "../addPicture/InputPicure"; // Correction de la typo InputPicure
import Button from "../button/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../services/stores";
import { autoResizeTextarea } from "../../utils/functions/autoResizeTextarea";

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
  const isValidForm = form.content;

  const [addPost, { isError, isLoading }] = useAddPostMutation();
  const { refetch } = useGetPostsQuery();

  const resetForm = () => {
    setForm({
      userId: userId,
      content: "",
      file: "",
    });
    setPreview("");
    setMimetype("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userId", form.userId as string);
    formData.append("content", form.content);
    // formData.append("media", form.file as Blob | string);
    if(typeof form.file === "string") {
      formData.append("media", form.content); console.log("form file: ", form.content);
    } else {
      formData.append("media", form.file as Blob); console.log("form file: ", form.file);
    }

    await addPost(formData); // Correction ici pour envoyer formData et token ensemble
    if (isError) {
      alert("Erreur lors de la publication");
    } else {
      resetForm();
      refetch();
      if (onClose) onClose();
    }
  };

  const handleFileChange = (image: File) => {
    setForm({ ...form, file: image });
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setMimetype(image.type);
    };
    reader.readAsDataURL(image);
  };

  const extractYoutubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    const youtubeId = extractYoutubeId(content);

    if (youtubeId) {
      const youtubeUrl = `https://www.youtube.com/embed/${youtubeId}`;
      setPreview(youtubeUrl);
      setForm({ ...form, content, file: youtubeUrl }); console.log("form file: ", form.file);
      setMimetype("video/youtube");
    } else {
      setForm({ ...form, content });
      setPreview("");
    }
  };

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
