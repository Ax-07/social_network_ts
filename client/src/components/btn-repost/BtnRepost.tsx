import { useState, useRef, useEffect, type FunctionComponent } from "react";
import ReactDOM from "react-dom";
import { useModal } from "../modal/hook/useModal";

interface BtnRepostProps {
  postId?: string;
  commentId?: string;
}

const BtnRepost: FunctionComponent<BtnRepostProps> = ({ postId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const { modals, openModal, closeModal, setPostId } = useModal();

  useEffect(() => {
    if (modals['btn-repost'] && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setModalPosition({
        top: rect.bottom + window.scrollY - 50, // Position sous le bouton
        left: rect.left + window.scrollX - 50  // Aligné à gauche du bouton
      });
    }
  }, [modals]);

  const handleOpen = () => {
    setIsOpen(true);
    openModal('btn-repost'); // Ouvrir la modal
  };

  useEffect(() => {
    if (!modals['btn-repost']) {
      setIsOpen(false);
    }
  }, [modals]);

  const handleClose = () => {
    setIsOpen(false);
    closeModal('btn-repost'); // Fermer la modal
  };

  const handleOpenRepostModal = () => {
    openModal('modal-repost');
    setPostId(postId ?? '');
    handleClose();
  }

  return (
    <>
      <div ref={buttonRef} className="btn-repost__primary" onClick={handleOpen}>
        <img src="/src/assets/icons/faRetweet.svg" alt="icon retweet" />
        <p>0</p>
      </div>

      {isOpen &&
        ReactDOM.createPortal(
          <div
            className="btn-repost__modal"
            style={{ position: 'absolute', top: modalPosition.top, left: modalPosition.left }}
          >
            <div className="btn-repost__modal-option" onClick={handleClose}>
              <img src="/src/assets/icons/faRetweet.svg" alt="icon retweet" />
              <p>Repost</p>
            </div>
            <div className="btn-repost__modal-option" onClick={handleOpenRepostModal}>
              <img src="/src/assets/icons/faPencilAlt.svg" alt="icon pen" />
              <p>Citation</p>
            </div>
          </div>,
          document.getElementById('btn-repost-modal') || document.body
        )}
    </>
  );
};

export default BtnRepost;
