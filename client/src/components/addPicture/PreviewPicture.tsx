import type { FunctionComponent } from 'react';

interface PreviewPictureProps {
  media: string;
  mimetype: string;
  onCancel: () => void;
}

const PreviewPicture: FunctionComponent<PreviewPictureProps> = ({ media, mimetype, onCancel }) => {
  const isPicture = mimetype === 'image/webp' || mimetype === 'image/png' || mimetype === 'image/jpeg';
  const isVideo = mimetype === 'video/mp4';
  const isYoutubeVideo = mimetype === 'video/youtube';
  return (
    <div className='preview-media'>
      {isPicture && <img src={media} alt="Preview" />}
      {isVideo && <video src={media} controls />}
      {isYoutubeVideo && (
        <iframe
          width="100%"
          height="315"
          src={media}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
      <button className='btn-close-top-right' type="button" onClick={onCancel}>✖️</button>
    </div>
  );
};

export default PreviewPicture;

