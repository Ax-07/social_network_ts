import { FunctionComponent, PropsWithChildren } from 'react';
import { useModal } from './hook/useModal';
import Button from '../button/Button';

interface ButtonModalProps extends PropsWithChildren {
  modalName: string;
  postId?: string;
  commentId?: string;
}

const ButtonModal: FunctionComponent<ButtonModalProps> = ({ modalName, postId, commentId, children }) => {
  const { openModal, setModalName, setPostId, setCommentId } = useModal();

  return (
    <Button type="button" className="btn__post-modal" 
      onClick={() => {
        openModal(modalName);
        setModalName(modalName);
        setPostId(postId ?? '');
        setCommentId(commentId ?? '');
      }}>
      {children}
    </Button>
  );
};

export default ButtonModal;
