import type { FunctionComponent } from 'react';

interface MediaDisplayProps {
    media?: string | undefined | null;
}

const MediaDisplay: FunctionComponent<MediaDisplayProps> = ({media}) => {
    const isWebp = media?.endsWith(".webp");
    const isMp4 = media?.endsWith(".mp4");
    const isYoutubeVideo = media?.includes("youtube.com");

    if (!media) return null;
  return (
    <>
      {isWebp && (
            <figure className="post-card__media">
              <img className="post-card__img" src={media} alt="Image du post" loading="lazy" />
              <figcaption className="sr-only">Aperçu de l'image</figcaption>
            </figure>
          )}
          {isMp4 && (
            <figure className="post-card__media">
              <video className="post-card__video" src={media} controls aria-label="Vidéo du post" />
              <figcaption className="sr-only">Vidéo du post</figcaption>
            </figure>
          )}
          {isYoutubeVideo && (
            <figure className="post-card__media">
              <iframe
                style={{ width: "100%", aspectRatio: "16/9" }}
                className="post-card__youtube"
                src={media}
                title="Lecteur vidéo YouTube"
                aria-label="Vidéo YouTube du post"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              ></iframe>
              <figcaption className="sr-only">Vidéo YouTube du post</figcaption>
            </figure>
          )}
    </>
  );
};

export default MediaDisplay;