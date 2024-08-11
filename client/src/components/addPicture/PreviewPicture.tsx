import type { FunctionComponent } from 'react';

interface PreviewPictureProps {
  image: string;
  onCancel: () => void;
}

const PreviewPicture: FunctionComponent<PreviewPictureProps> = ({ image, onCancel }) => {
  return (
    <div className='preview-media'>
      <img src={image} alt="Preview" />
      <button className='btn-close-top-right' type="button" onClick={onCancel}>✖️</button>
    </div>
  );
};

export default PreviewPicture;

