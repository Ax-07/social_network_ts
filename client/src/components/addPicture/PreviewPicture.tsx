import type { FunctionComponent } from 'react';

interface PreviewPictureProps {
  media: string;
  mimetype: string;
  onCancel: () => void;
}

const PreviewPicture: FunctionComponent<PreviewPictureProps> = ({ media, mimetype, onCancel }) => {
  const isPicture = mimetype === 'image/webp' || mimetype === 'image/png' || mimetype === 'image/jpeg';
  const isVideo = mimetype === 'video/mp4';
  return (
    <div className='preview-media'>
      {isPicture && <img src={media} alt="Preview" />}
      {isVideo && <video src={media} controls />}
      <button className='btn-close-top-right' type="button" onClick={onCancel}>✖️</button>
    </div>
  );
};

export default PreviewPicture;

