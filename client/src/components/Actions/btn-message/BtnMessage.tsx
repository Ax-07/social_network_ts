import type { FunctionComponent } from "react";
import ButtonModal from "../../modal/ButtonModal";

interface BtnMessageProps {}

const BtnMessage: FunctionComponent<BtnMessageProps> = () => {
  return (
    <ButtonModal
      modalName="modal-message"
      className="btn__modal-comment"
      aria-label="Envoyer un message"
    >
      <img src="/src/assets/icons/faEnvelope.svg" alt="Icône de message" />
    </ButtonModal>
  );
};

export default BtnMessage;
