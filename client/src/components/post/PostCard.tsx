import type { FunctionComponent } from 'react';
import type { Post } from '../../services/api/postApi';
import BtnLike from '../btn-like/BtnLike';

export type PostProps = {
  post: Post;
};

const PostCard: FunctionComponent<PostProps> = ({post}) => {
  const isWebp = post.media?.endsWith('.webp');
  const isMp4 = post.media?.endsWith('.mp4');

  return (
    <article className='post__card'>
      <div className="post__card-user">
        <img src="" alt="" />
      </div>
      <div className="post__card-wrapper">
        <p className='post__card-content'>{post.content}</p>
        {post.media && isWebp && <img className='post__card-img' src={post.media} alt={""} loading='lazy'/>}
        {post.media && isMp4 && <video className='post__card-video' src={post.media} controls/>}
        <BtnLike post={post}/>
        {post.dislikers && <p className='post__card-dislike'>{post.dislikers.length} dislikers</p>}
      </div>
    </article>
  );
};

export default PostCard;