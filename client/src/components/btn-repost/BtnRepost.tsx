import { useState, useRef, useEffect, type FunctionComponent } from "react";
import ReactDOM from "react-dom";
import { useModal } from "../modal/hook/useModal";

interface BtnRepostProps {
  postId?: string;
  commentId?: string;
  reposterCount?: number;
}

const BtnRepost: FunctionComponent<BtnRepostProps> = ({ postId, commentId, reposterCount }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const { modals, openModal, closeModal, setPostId, setCommentId } = useModal();

  let btnName: string = '';
  let modalName: string = '';
  if (commentId && postId) {
    btnName = 'btn-repost-with-comment';
    modalName = 'modal-repost-comment';
  } else if (postId && !commentId) {
    btnName = 'btn-repost';
    modalName = 'modal-repost';
  }

  useEffect(() => {
    const updateModalPosition = () => {
      if (modals[btnName] && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setModalPosition({
          top: rect.bottom + window.scrollY - 50, // Position sous le bouton
          left: rect.left + window.scrollX - 50  // Aligné à gauche du bouton
        });
      }
    };
  
    updateModalPosition();
  
    // Ajouter un event listener pour mettre à jour la position en cas de resize ou scroll
    window.addEventListener('resize', updateModalPosition);
    window.addEventListener('scroll', updateModalPosition);
  
    return () => {
      window.removeEventListener('resize', updateModalPosition);
      window.removeEventListener('scroll', updateModalPosition);
    };
  }, [btnName, modals, isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    openModal(btnName); // Ouvrir la modal
  };

  useEffect(() => {
    if (!modals[btnName]) {
      setIsOpen(false);
    }
  }, [btnName, modals]);

  const handleClose = () => {
    setIsOpen(false);
    closeModal(btnName); // Fermer la modal
  };

  const handleOpenRepostModal = () => {
    openModal(modalName);
    setPostId(postId ?? '');
    setCommentId(commentId ?? '');
    handleClose();
  }
  

  return (
    <>
      <div ref={buttonRef} className="btn-repost__primary" onClick={handleOpen} aria-label="Ouvrir le menu de repost">
        <img src="/src/assets/icons/faRetweet.svg" alt="icon retweet" />
        <p>{reposterCount}</p>
      </div>

      {isOpen && btnName === 'btn-repost' &&
        ReactDOM.createPortal(
          <div
            className="btn-repost__modal"
            style={{ position: 'absolute', top: modalPosition.top, left: modalPosition.left }}
          >
          <div className="btn-repost__modal-option" onClick={handleClose} aria-label="Reposter sans commentaire">
            <img src="/src/assets/icons/faRetweet.svg" alt="icon retweet" />
              <p>Repost</p>
            </div>
            <div className="btn-repost__modal-option" onClick={handleOpenRepostModal} aria-label="Reposter avec commentaire">
            <img src="/src/assets/icons/faPencilAlt.svg" alt="icon pen" />
              <p>Citation</p>
            </div>
          </div>,
          document.getElementById('btn-repost-modal') || document.body
        )}

      {isOpen && btnName === 'btn-repost-with-comment' &&
        ReactDOM.createPortal(
          <div
            className="btn-repost__modal"
            style={{ position: 'absolute', top: modalPosition.top, left: modalPosition.left }}
          >
            <div className="btn-repost__modal-option" onClick={handleClose} aria-label="Reposter sans commentaire">
              <img src="/src/assets/icons/faRetweet.svg" alt="icon retweet" />
              <p>Repost</p>
            </div>
            <div className="btn-repost__modal-option" onClick={handleOpenRepostModal} aria-label="Reposter avec commentaire">
              <img src="/src/assets/icons/faPencilAlt.svg" alt="icon pen" />
              <p>Citation</p>
            </div>
          </div>,
          document.getElementById('btn-repost-comment-modal') || document.body
        )}


    </>
  );
};

export default BtnRepost;
