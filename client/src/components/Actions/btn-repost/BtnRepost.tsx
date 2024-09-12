import { useState, useRef, useEffect, type FunctionComponent } from "react";
import ReactDOM from "react-dom";
import { FormOrigin } from "../../Form/Form";
import { useDispatch, useSelector } from "react-redux";
import { setForm } from "../../../services/forms/formSlice";
import { RootState } from "../../../services/stores";
import { closeModal, openModal } from "../../../services/modals/modalSlice";

interface BtnRepostProps {
  postId?: string;
  commentId?: string;
  reposterCount?: number;
}

const BtnRepost: FunctionComponent<BtnRepostProps> = ({ postId, commentId, reposterCount }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { modals} = useSelector((state: RootState) => state.modals);
  // const { modals, openModal, closeModal, setPostId, setCommentId } = useModal();

  let btnName: string = '';
  let modalName: FormOrigin; // Permet à modalName d'être indéfini initialement
  if (commentId && postId) {
    btnName = 'btn-repost-with-comment';
    modalName = 'modal-repost-comment';
  } else if (postId && !commentId) {
    btnName = 'btn-repost';
    modalName = 'modal-repost';
  }

  const handleOpen = () => {
    setIsOpen(true);
    dispatch(openModal(btnName));
    // openModal(btnName); // Ouvrir la modal
  };

  useEffect(() => {
    if (!modals[btnName]) {
      setIsOpen(false);
    }
  }, [btnName, modals]);

  const handleClose = () => {
    setIsOpen(false);
    dispatch(closeModal(btnName as string)); // Fermer la modal
  };

  const handleOpenRepostModal = () => {
    // openModal(modalName);
    console.log("postId", postId, "commentId", commentId);
    dispatch(setForm({origin: modalName, formState: {originalPostId: postId, originalCommentId: commentId}}));
    dispatch(openModal(modalName));
    // setPostId(postId ?? '');
    // setCommentId(commentId ?? '');
    handleClose();
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

  return (
    <>
      <div ref={buttonRef} className="btn-repost__primary" onClick={handleOpen} aria-label="Ouvrir le menu de repost">
        <img src="/src/assets/icons/faRetweet.svg" alt="icon retweet" />
        <p>{reposterCount ?? 0}</p>
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
