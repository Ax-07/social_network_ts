import type { FunctionComponent } from 'react';
import { useModal } from './hook/useModal';
import Modal from './Modal';
import AddComment from '../post/AddComment';
import AddPost from '../post/AddPost';
import { PostFormProvider } from '../post/context/postFormContext';

interface ModalsProps {}

const Modals: FunctionComponent<ModalsProps> = () => {
    const { modals, closeModal } = useModal();

    return (
        <>
           {modals && (
              <>
                <PostFormProvider origin="modal-addPost">
                  <Modal modalName="modal-addPost">
                    <AddPost origin="modal-addPost" onClose={() => closeModal("modal-addPost")}/>
                  </Modal>
                </PostFormProvider>
                <PostFormProvider origin="modal-comment-post">
                  <Modal modalName="modal-comment-post">
                    <AddComment origin="modal-comment-post" onClose={() => closeModal("modal-comment-post")}/>
                  </Modal>
                </PostFormProvider>
                <PostFormProvider origin="modal-comment-comment">
                  <Modal modalName="modal-comment-comment">
                    <AddComment origin="modal-comment-comment" onClose={() => closeModal("modal-comment-comment")}/>
                  </Modal>
                </PostFormProvider>
              </>
            )}
        </>
      );
    };

export default Modals;