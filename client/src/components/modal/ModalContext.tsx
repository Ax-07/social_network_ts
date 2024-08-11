import { createContext, useState, ReactNode } from 'react';

interface ModalState {
  [key: string]: boolean;
}

export interface ModalContextType {
  modals: ModalState;
  openModal: (modalName: string) => void;
  closeModal: (modalName: string) => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<ModalState>({});

  const openModal = (modalName: string) => setModals(prev => ({ ...prev, [modalName]: true }));
  const closeModal = (modalName: string) => setModals(prev => ({ ...prev, [modalName]: false }));

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};



