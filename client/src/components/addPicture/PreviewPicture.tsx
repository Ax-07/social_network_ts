import type { FunctionComponent } from "react";

interface PreviewPictureProps {
  media: string;
  mimetype: string;
  onCancel: () => void;
}

const PreviewPicture: FunctionComponent<PreviewPictureProps> = ({
  media,
  mimetype,
  onCancel,
}) => {
  const isPicture =
    mimetype === "image/webp" ||
    mimetype === "image/png" ||
    mimetype === "image/jpeg";
  const isVideo = mimetype === "video/mp4";
  const isYoutubeVideo = mimetype === "video/youtube";
  return (
    <figure className="preview-media">
      {isPicture && <img src={media} alt="Aperçu de l'image sélectionnée" />}
      {isVideo && (
        <video
          src={media}
          controls
          aria-label="Aperçu de la vidéo sélectionnée"
        />
      )}
      {isYoutubeVideo && (
        <iframe
          width="100%"
          height="315"
          src={media}
          title="YouTube video player"
          aria-label="Lecteur vidéo YouTube"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
      <button className="btn-close-top-right" type="button" onClick={onCancel} aria-label="Fermer l'aperçu">
        ✖️
      </button>
    </figure>
  );
};

export default PreviewPicture;
