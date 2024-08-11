import type { FunctionComponent, PropsWithChildren } from 'react';
import { useModal } from './useModal';

interface ModalProps extends PropsWithChildren<{
  modalName: string;
}> {}

const Modal: FunctionComponent<ModalProps> = ({ children, modalName }) => {
  const { modals, closeModal } = useModal();
  if (!modals[modalName]) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={()=>closeModal(modalName)} className="modal-close">❌</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
