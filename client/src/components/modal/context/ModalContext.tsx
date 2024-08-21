import { createContext, useState, ReactNode } from 'react';

interface ModalState {
  [key: string]: boolean;
}

export interface ModalContextType {
  modalName?: string;
  modals: ModalState;
  openModal: (modalName: string) => void;
  closeModal: (modalName: string) => void;
  setModalName: (modalName: string) => void;
  postId?: string;
  setPostId: (postId: string) => void;
  commentId?: string;
  setCommentId: (commentId: string) => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }
) => {
  const [ modalName, setModalName ] = useState<string>(''); console.log('modalName', modalName);
  const [modals, setModals] = useState<ModalState>({}); console.log('modals', modals);
  const [postId, setPostId] = useState<string>(''); console.log('postId', postId);
  const [commentId, setCommentId] = useState<string>(''); console.log('commentId', commentId);
  const openModal = (modalName: string) => setModals(prev => ({ ...prev, [modalName]: true }));
  const closeModal = (modalName: string) => setModals(prev => ({ ...prev, [modalName]: false }));

  return (
    <ModalContext.Provider value={{ modals, modalName, setModalName, commentId, setCommentId, postId, setPostId , openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};



