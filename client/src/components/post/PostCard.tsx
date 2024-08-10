import type { FunctionComponent } from 'react';
import type { Post } from '../../services/api/postApi';

export type PostProps = {
  post: Post;
};

const PostCard: FunctionComponent<PostProps> = ({post}) => {
  const isWebp = post.picture?.endsWith('.webp');
  const isMp4 = post.picture?.endsWith('.mp4');

  return (
    <article className='post__card'>
      <div className="post__card-user">
        <img src="" alt="" />
      </div>
      <div className="post__card-wrapper">
        <h2 className='post__card-title'>{post.title}</h2>
        <p className='post__card-content'>{post.content}</p>
        {post.picture && isWebp && <img className='post__card-img' src={post.picture} alt={post.title} loading='lazy'/>}
        {post.picture && isMp4 && <video className='post__card-video' src={post.picture} controls/>}
        {post.likers && <p className='post__card-like'>{post.likers.length} likers</p>}
        {post.dislikers && <p className='post__card-dislike'>{post.dislikers.length} dislikers</p>}
      </div>
    </article>
  );
};

export default PostCard;