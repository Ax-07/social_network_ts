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
  commentedPostId?: string;
  setCommentedPostId: (commentedPostId: string) => void;
  commentedCommentId?: string;
  setCommentedCommentId: (commentedCommentId: string) => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }
) => {
  const [ modalName, setModalName ] = useState<string>('');
  const [modals, setModals] = useState<ModalState>({});
  const [postId, setPostId] = useState<string>('');
  const [commentId, setCommentId] = useState<string>('');
  const [commentedPostId, setCommentedPostId] = useState<string>('');
  const [commentedCommentId, setCommentedCommentId] = useState<string>('');
  const openModal = (modalName: string) => setModals(prev => ({ ...prev, [modalName]: true }));
  const closeModal = (modalName: string) => setModals(prev => ({ ...prev, [modalName]: false }));

  return (
    <ModalContext.Provider value={{ 
      modals, 
      modalName, setModalName, 
      commentId, setCommentId, 
      postId, setPostId, 
      commentedPostId, setCommentedPostId, 
      commentedCommentId, setCommentedCommentId, 
      openModal, closeModal 
      }}>
      {children}
    </ModalContext.Provider>
  );
};



