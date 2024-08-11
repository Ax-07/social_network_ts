import { FunctionComponent, PropsWithChildren } from 'react';
import { useModal } from '../modal/useModal';
import Button from '../button/Button';

interface ButtonModalProps extends PropsWithChildren {
  modalName: string;
}

const ButtonModal: FunctionComponent<ButtonModalProps> = ({ modalName, children }) => {
  const { openModal } = useModal();

  return (
    <Button type="button" className="btn__post-modal" onClick={() => openModal(modalName)}>
      {children}
    </Button>
  );
};

export default ButtonModal;
