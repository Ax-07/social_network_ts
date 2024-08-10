import { useEffect, useState } from "react";
import { UserPicture } from "../userProfile/UserProfileThumbnail";
import PreviewPicture from "../addPicture/PreviewPicture";
import InputPicure from "../addPicture/InputPicure";
import { useAddPostMutation, useGetPostsQuery } from "../../services/api/postApi";

const userId = "7eb24187-6ca9-43da-9357-ff675903cb8d";

const AddPost = () => {
  const [form, setForm] = useState({
    userId: userId as string,
    title: "" as string,
    content: "" as string,
    file: "" as File | string,
  });
  const [preview, setPreview] = useState<string>("");
  const isPreview = form.file !== "";

  const [addPost, { isError, isLoading }] = useAddPostMutation();
  const { refetch } = useGetPostsQuery();

  const resetForm = () => {
    setForm({
      userId: userId as string,
      title: "" as string,
      content: "" as string,
      file: "" as File | string,
    });
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
    }
  };

  return (
    <div className="addpost">
      <UserPicture />
      <form onSubmit={handleSubmit} className="addpost__form">
        <input
          className="addpost__input"
          type="text"
          placeholder="Titre"
          name="title"
          id="title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          value={form.title}
        />
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
          <PreviewPicture image={preview} onCancel={() => setPreview("")} />
        )}
        <div className="addpost__bottom">
          <InputPicure
            setImage={(image) => setForm({ ...form, file: image })}
            setPreview={setPreview}
            onCancel={() => {
                setForm({ ...form, file: "" })
                setPreview("");
            }}
          />
          <button className="addpost__button" type="submit">
            Publier
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
