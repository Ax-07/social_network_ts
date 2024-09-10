import { type FunctionComponent } from 'react';
import { CommentTypes } from '../../../utils/types/comment.types';
import { useGetUserByIdQuery } from '../../../services/api/userApi';
import { NavLink } from 'react-router-dom';
import BtnLike from '../../Actions/btn-like/BtnLike';
import BtnRepost from '../../Actions/btn-repost/BtnRepost';
import BtnComment from '../../Actions/btn-comment/BtnComment';
import BtnViews from '../../Actions/btn-views/BtnViews';
import BtnBookmarks from '../../Actions/btn-bookmarks/BtnBookmarks';
import { UserThumbnailHoverDisplayCard, UserNameHoverDisplayCard } from '../../userProfile/UserHoverDisplayCard ';
import MediaDisplay from '../../Base/mediaDisplay/MediaDisplay';

interface CommentCardProps {
    comment: CommentTypes;
    origin: string;
}

const CommentCard: FunctionComponent<CommentCardProps> = ({ comment, origin }) => {
    const commenterId = comment.userId;
    const commentsCount = comment.commentsCount;
    const { data: { data: commenter } = {} } = useGetUserByIdQuery(commenterId);

    return (
        <>
            {origin !== "comment-page" && <NavLink to={`/home/comment/${comment.id}`} className="post-card__link"></NavLink>}
            <article className="post-card">
                <UserThumbnailHoverDisplayCard user={commenter} />
                <div className="post-card__wrapper">
                    <UserNameHoverDisplayCard user={commenter} createdAt={comment.createdAt} />
                    <p className="post-card__content">{comment.content}</p>
                    {comment?.media && <MediaDisplay media={comment.media}/>}
                    {origin !== 'repost' && <div className="post-card__footer">
                        <BtnComment commentId={comment.id} commentsCount={commentsCount} />
                        <BtnRepost postId={comment.postId} commentId={comment.id} reposterCount={comment.reposters?.length}/>
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
