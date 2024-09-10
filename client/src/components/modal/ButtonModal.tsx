import { FunctionComponent, PropsWithChildren } from 'react';
import Button from '../Base/button/Button';
import { FormOrigin } from '../Form/Form';
import { useDispatch } from 'react-redux';
import { openModal } from '../../services/modals/modalSlice';
import { useForm } from '../Form/hooks/useForm';

interface ButtonModalProps extends PropsWithChildren {
  modalName: FormOrigin;
  postId?: string;
  commentId?: string;
  className?: string;
}

const ButtonModal: FunctionComponent<ButtonModalProps> = ({ modalName, postId, commentId, children, className }) => {
  // const { openModal, setModalName, setPostId, setCommentId } = useModal();
  const dispatch = useDispatch();
  const { setFormState } = useForm(modalName);
  const handleOpen = () => {
    if (modalName) {  // Vérifie que modalName est bien défini
      dispatch(openModal(modalName));
      if (postId) {
        setFormState({ originalPostId: postId });
      } else if (commentId) {
        setFormState({ originalCommentId: commentId });
      }
    }
  };

  return (
    <Button type="button" className={className} 
      onClick={handleOpen}>
      {children}
    </Button>
  );
};

export default ButtonModal;
