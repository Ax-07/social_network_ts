import { type FunctionComponent } from "react";
import Modal from "./Modal";
import AddComment from "../Form/AddComment";
import AddPost from "../Form/AddPost";
import AddRepost from "../Form/AddRepost";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../services/stores";
import { closeModal } from "../../services/modals/modalSlice";
import AddMessage from "../Form/AddMessage";
import { resetForm } from "../../services/forms/formSlice";
import { FormOrigin } from "../Form/utils/switchOrigin";

interface ModalsProps {}

const Modals: FunctionComponent<ModalsProps> = () => {
  const { modals, modalName } = useSelector((state: RootState) => state.modals);
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    dispatch(closeModal(modalName!))
    dispatch(resetForm({ origin: modalName as FormOrigin }));
  };

  return (
    <>
      {modals && (
        <>
          <Modal modalName="modal-addPost">
            <AddPost origin="modal-addPost" onClose={handleCloseModal} />
          </Modal>
          <Modal modalName="modal-comment-post">
            <AddComment
              origin="modal-comment-post"
              onClose={handleCloseModal}
            />
          </Modal>
          <Modal modalName="modal-comment-comment">
            <AddComment
              origin="modal-comment-comment"
              onClose={handleCloseModal}
            />
          </Modal>
          <Modal modalName="btn-repost">
            {/* Ici on rend simplement une div pour que le portail du repost puisse s'y attacher */}
            <div id="btn-repost-modal"></div>
          </Modal>
          <Modal modalName="modal-repost">
            <AddRepost origin="modal-repost" onClose={handleCloseModal} />
          </Modal>
          <Modal modalName="btn-repost-with-comment">
            {/* Ici on rend simplement une div pour que le portail du repost puisse s'y attacher */}
            <div id="btn-repost-comment-modal"></div>
          </Modal>
          <Modal modalName="modal-repost-comment">
            <AddRepost origin="modal-repost-comment" onClose={handleCloseModal} />
          </Modal>
          <Modal modalName="modal-message" >
            <AddMessage origin="modal-message" onClose={handleCloseModal} />
          </Modal>
        </>
      )}
    </>
  );
};

export default Modals;
