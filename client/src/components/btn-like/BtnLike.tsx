import { FunctionComponent } from 'react';
import { useLikePostMutation } from '../../services/api/postApi';
import { PostTypes } from '../../utils/types/post.types';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/stores';
import { usePushToast } from '../toast/Toasts';

interface BtnLikeProps {
  post: PostTypes;
}

const BtnLike: FunctionComponent<BtnLikeProps> = ({ post }) => {
  const userId = useSelector((state: RootState) => state?.auth?.user?.id);
  const [likePost] = useLikePostMutation();
  const postId = post.id;
  const pushToast = usePushToast();

  const handleLike = async () => {
    try {
      const response = await likePost({ id: postId, likerId: userId ?? '' }).unwrap();
      pushToast({ type: 'success', message: response.message });
    } catch (error) {
      pushToast({ type: 'error', message: 'An error occurred' });
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleLike}>Like</button>
      <p>{post.likers?.length || 0}</p>
    </div>
  );
};

export default BtnLike;
