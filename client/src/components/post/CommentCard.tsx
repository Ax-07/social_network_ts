import { type FunctionComponent } from 'react';
import { CommentTypes } from '../../utils/types/comment.types';
import { useGetUserByIdQuery } from '../../services/api/userApi';
import { NavLink } from 'react-router-dom';
import BtnLike from '../btn-like/BtnLike';
import BtnRepost from '../btn-repost/BtnRepost';
import BtnComment from '../btn-comment/BtnComment';
import { PostFormProvider } from './context/postFormContext';
import BtnViews from '../btn-views/BtnViews';
import BtnBookmarks from '../btn-bookmarks/BtnBookmarks';
import { UserThumbnailHoverDisplayCard, UserNameHoverDisplayCard } from '../userProfile/UserHoverDisplayCard ';

interface CommentCardProps {
    comment: CommentTypes;
    origin: string;
}

const CommentCard: FunctionComponent<CommentCardProps> = ({ comment, origin }) => {
    const commenterId = comment.userId;
    const commentsCount = comment.commentsCount;
    const { data: { data: commenter } = {} } = useGetUserByIdQuery(commenterId);
    const isWebp = comment.media?.endsWith(".webp");
    const isMp4 = comment.media?.endsWith(".mp4");
    const isYoutubeVideo = comment.media?.includes("youtube.com");

    return (
        <>
            {origin !== "comment-page" && <NavLink to={`/home/comment/${comment.id}`} className="post-card__link"></NavLink>}
            <article className="post-card">
                <UserThumbnailHoverDisplayCard user={commenter} />
                <div className="post-card__wrapper">
                    <UserNameHoverDisplayCard user={commenter} createdAt={comment.createdAt} />
                    <p className="post-card__content">{comment.content}</p>
                    {comment.media && isWebp && (
                    <figure className="post-card__media">
                        <img className="post-card__img" src={comment.media} alt={""} loading="lazy" />
                        <figcaption className="sr-only">Aperçu de l'image</figcaption>
                        </figure>
                    )}
                    {comment.media && isMp4 && (
                    <figure className="post-card__media">
                        <video 
                            className="post-card__video" 
                            src={comment.media} 
                            controls 
                            aria-label="Vidéo du commentaire" 
                        />
                        <figcaption className='sr-only'>Vidéo du commentaire</figcaption>
                    </figure>                    )}
                    {comment.media && isYoutubeVideo && (
                        <figure className="post-card__media">
                            <iframe
                                style={{ width: "100%", aspectRatio: "16/9" }}
                                className="post-card__youtube"
                                src={comment.media}
                                title="Lecteur vidéo YouTube"
                                aria-label="Vidéo YouTube du commentaire"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading="lazy"
                            ></iframe>
                        <figcaption className='sr-only'>Vidéo YouTube du commentaire</figcaption>
                    </figure>
                    )}
                    {origin !== 'repost' && <div className="post-card__footer">
                        <BtnComment commentId={comment.id} commentsCount={commentsCount} />
                        <PostFormProvider origin='modal-repost-comment'> 
                            <BtnRepost postId={comment.postId} commentId={comment.id} reposterCount={comment.reposters?.length}/>
                        </PostFormProvider>
                        <BtnLike comment={comment} />
                        <BtnViews viewsCount={comment.views} />
                        <BtnBookmarks postId={comment.id} userId={commenterId ?? ""}/>
                    </div>}
                </div>
            </article>
        </>
    );
};

export default CommentCard;
