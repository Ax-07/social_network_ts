import { FunctionComponent, ChangeEvent } from 'react';
import { useRef } from 'react';

interface InputPictureProps {
  setImage: (file: File) => void;
}

const InputPicture: FunctionComponent<InputPictureProps> = ({ setImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="input-picture">
      <div onClick={handleUploadClick} className="custom-file-upload">
        <img src="src/assets/icons/icon_image.svg" alt="" />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default InputPicture;
