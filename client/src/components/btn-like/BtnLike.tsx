import { useState } from 'react';
import type { FunctionComponent } from 'react';
import { Post, useLikePostMutation } from '../../services/api/postApi';

interface BtnLikeProps {
  post: Post;
}

const BtnLike: FunctionComponent<BtnLikeProps> = ({ post }) => {
  const [likePost] = useLikePostMutation();
  const userId = post.userId;
  const postId = post.id;
  const [likes, setLikes] = useState(post.likers?.length || 0);

  const handleLike = async () => {
    try {
      const response = await likePost({ id: postId, likers: userId });
      if (response.data) {
        const updatedLikers = response.data.likers;
        setLikes(updatedLikers?.length ?? 0);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <button onClick={handleLike}>Like</button>
      <p>{likes}</p>
    </div>
  );
};

export default BtnLike;
