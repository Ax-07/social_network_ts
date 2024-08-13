import { useState, useRef } from "react";
import { UserPicture } from "../userProfile/UserProfileThumbnail";
import PreviewPicture from "../addPicture/PreviewPicture";
import InputPicture from "../addPicture/InputPicure";
import { useAddPostMutation, useGetPostsQuery } from "../../services/api/postApi";
import Button from "../button/Button";

const userId = "4a655857-40a7-4814-baa1-0f05fd46f73b";

interface FormState {
  userId: string;
  content: string;
  file: File | string;
}

interface AddPostProps {
  origin: "modal" | "page";
  onClose?: () => void;
}

const AddPost = ({ origin, onClose }: AddPostProps) => {
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
    formData.append("userId", form.userId);
    formData.append("content", form.content);
    formData.append("media", form.file);

    await addPost(formData);
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
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          value={form.content}
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
          <Button type="submit" className="btn__post-submit" disabled={!isValidForm}>
            Publier
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
