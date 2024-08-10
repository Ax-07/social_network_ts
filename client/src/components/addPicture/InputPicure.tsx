import type { FunctionComponent } from 'react';

interface InputPicureProps {
    setImage: (image: File) => void;
    setPreview: (preview: string) => void;
    onCancel: () => void;
}

const InputPicure: FunctionComponent<InputPicureProps> = (props) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        reader.onload = () => {
            props.setPreview(reader.result as string);
        };
        reader.readAsDataURL(e.target.files![0]);
        props.setImage(e.target.files![0]);
    };
  return (
    <div className='add-picture__imput'>
        <label htmlFor="file"><img src="" alt="" /></label>
        <input id='file' type="file" onChange={handleChange} />
    </div>
  );
};

export default InputPicure;
