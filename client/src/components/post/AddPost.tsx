import { useState } from "react";
import { UserPicture } from "../userProfile/UserProfileThumbnail";
import PreviewPicture from "../addPicture/PreviewPicture";
import InputPicture from "../addPicture/InputPicure";
import { useAddPostMutation, useGetPostsQuery } from "../../services/api/postApi";
import Button from "../button/Button";
import ButtonModal from "../modal/ButtonModal";

const userId = "7eb24187-6ca9-43da-9357-ff675903cb8d";

interface FormState {
  userId: string;
  title: string;
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
    title: "",
    content: "",
    file: "",
  });

  const [preview, setPreview] = useState<string>("");
  const isPreview = form.file !== "";
  const isValidForm = form.title && form.content;

  const [addPost, { isError, isLoading }] = useAddPostMutation();
  const { refetch } = useGetPostsQuery();

  const resetForm = () => {
    setForm({
      userId: userId,
      title: "",
      content: "",
      file: "",
    });
    setPreview("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userId", form.userId);
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("picture", form.file);

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
        {/* <input
          className="addpost__input"
          type="text"
          placeholder="Titre"
          name="title"
          id="title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          value={form.title}
        /> */}
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
          <PreviewPicture image={preview} onCancel={() => {
            setForm({ ...form, file: "" });
            setPreview("");
          }} />
        )}
        <div className="addpost__bottom">
          <InputPicture setImage={handleFileChange}/>
          <Button type="submit" className="btn__post-submit" disabled={!isValidForm}>
            Publier
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
