import type { FunctionComponent, PropsWithChildren } from 'react';
import { useModal } from './hook/useModal';
import { PostFormOrigin } from '../post/PostForm';

interface ModalProps extends PropsWithChildren<{
  modalName: PostFormOrigin;
}> {}

const Modal: FunctionComponent<ModalProps> = ({ children, modalName }) => {
  const { modals, closeModal } = useModal();
  if (!modals[modalName]) return null;

  const handleOverlayClick = () => {
    closeModal(modalName);
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la propagation de l'événement à l'overlay
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      {modalName !== 'btn-repost' && modalName !== 'btn-repost-with-comment' &&
      <div className="modal-content" onClick={handleContentClick}>
        <button onClick={()=> closeModal(modalName)} className="modal-close">❌</button>
        {children}
      </div>}
    </div>
  );
};

export default Modal;
