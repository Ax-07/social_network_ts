import type { FunctionComponent, PropsWithChildren } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../services/stores';
import { closeModal } from '../../services/modals/modalSlice';
import { FormOrigin } from '../Form/utils/switchOrigin';
import { resetForm } from '../../services/forms/formSlice';

interface ModalProps extends PropsWithChildren {
  modalName: FormOrigin;
}

const Modal: FunctionComponent<ModalProps> = ({ modalName, children }) => {
  const dispatch = useDispatch();
  const {modals} = useSelector((state: RootState) => state.modals);
  // const { modals, closeModal } = useModal();
  if (!modalName || !modals[modalName]) return null;

  const handleOverlayClick = () => {
    dispatch(closeModal(modalName));
    dispatch(resetForm({ origin: modalName }));
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la propagation de l'événement à l'overlay
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      {modalName !== 'btn-repost' && modalName !== 'btn-repost-with-comment' &&
      <div className="modal-content" onClick={handleContentClick}>
        <button onClick={()=> dispatch(closeModal(modalName!))} className="modal-close">❌</button>
        {children}
      </div>}
    </div>
  );
};

export default Modal;
