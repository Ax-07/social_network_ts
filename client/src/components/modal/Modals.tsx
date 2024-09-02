import { type FunctionComponent } from 'react';
import { useModal } from './hook/useModal';
import Modal from './Modal';
import AddComment from '../post/AddComment';
import AddPost from '../post/AddPost';
import { PostFormProvider } from '../post/context/postFormContext';
import AddRepost from '../post/AddRepost';

interface ModalsProps {}

const Modals: FunctionComponent<ModalsProps> = () => {
    const { modals, closeModal, postId, commentId } = useModal();

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

                <PostFormProvider origin="modal-repost" originalPostId={postId}>
                  <Modal modalName='btn-repost'>
                    {/* Ici on rend simplement une div pour que le portail du repost puisse s'y attacher */}
                    <div id="btn-repost-modal"></div>
                  </Modal>
                  <Modal modalName='modal-repost'>
                    <AddRepost origin="modal-repost" onClose={() => closeModal("modal-repost")} />
                  </Modal>
                </PostFormProvider>
                
                <PostFormProvider origin="modal-repost-comment" originalPostId={postId} originalCommentId={commentId}>
                  <Modal modalName='btn-repost-with-comment'>
                    {/* Ici on rend simplement une div pour que le portail du repost puisse s'y attacher */}
                    <div id="btn-repost-comment-modal"></div>
                  </Modal>
                  <Modal modalName='modal-repost-comment'>
                    <AddRepost origin="modal-repost-comment" onClose={() => closeModal("modal-repost-comment")} />
                  </Modal>
                </PostFormProvider>
              </>
            )}
        </>
      );
    };

export default Modals;