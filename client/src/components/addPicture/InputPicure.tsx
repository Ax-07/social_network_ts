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
      <div onClick={handleUploadClick} className="custom-file-upload">
        <img src="src/assets/icons/icon_image.svg" alt="" />
      </div>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default InputPicture;
