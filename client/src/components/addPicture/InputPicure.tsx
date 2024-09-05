import { FunctionComponent, ChangeEvent, RefObject } from 'react';

interface InputPictureProps {
  setMedia: (file: File) => void;
  inputRef: RefObject<HTMLInputElement>;
}

const InputPicture: FunctionComponent<InputPictureProps> = ({ setMedia, inputRef }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
    }
  };

  const handleUploadClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="input-picture">
      <label htmlFor="upload-input" className="sr-only">Télécharger une image ou une vidéo</label>
      <div onClick={handleUploadClick} className="custom-file-upload" role='button' aria-label="Télécharger une image ou une vidéo">
        <img src="/src/assets/icons/icon_image.svg" alt="Icône pour télécharger une image" />
      </div>
      <input
        ref={inputRef}
        type="file"
        id="upload-input"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default InputPicture;
