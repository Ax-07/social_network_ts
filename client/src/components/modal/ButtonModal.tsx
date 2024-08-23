import { FunctionComponent, PropsWithChildren } from 'react';
import { useModal } from './hook/useModal';
import Button from '../button/Button';
import { PostFormOrigin } from '../post/PostForm';

interface ButtonModalProps extends PropsWithChildren {
  modalName: PostFormOrigin;
  postId?: string;
  commentId?: string;
  className?: string;
}

const ButtonModal: FunctionComponent<ButtonModalProps> = ({ modalName, postId, commentId, children, className }) => {
  const { openModal, setModalName, setPostId, setCommentId } = useModal();

  const handleOpen = () => {
    openModal(modalName);
    setModalName(modalName);
    setPostId(postId ?? '');
    setCommentId(commentId ?? '');
  };
  return (
    <Button type="button" className={className} 
      onClick={handleOpen}>
      {children}
    </Button>
  );
};

export default ButtonModal;
