'use client';
import React, {
  useContext,
  useState,
  cloneElement,
  createContext,
  ReactNode,
  ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';
import useOutsideClick from '@/app/_hooks/useOutsideClick';

interface ModalContextProps {
  openName: string;
  close: () => void;
  open: (name: string) => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

interface ModalProps {
  children: ReactNode;
}

function Modal({ children }: ModalProps) {
  const [openName, setOpenName] = useState<string>('');

  const close = () => setOpenName('');
  const open = (name: string) => setOpenName(name);

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

interface OpenProps {
  children: ReactElement;
  opens: string;
}

function Open({ children, opens: opensWindowName }: OpenProps) {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('Open must be used within a ModalContext');
  }

  const { open } = context;

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

interface WindowProps {
  children: ReactElement;
  name: string;
}

function Window({ children, name }: WindowProps) {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('Window must be used within a ModalContext');
  }

  const { openName, close } = context;
  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed inset-0 bg-backdrop-color backdrop-blur-sm z-50 transition-all">
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-50 rounded-lg shadow-lg p-8 transition-all"
        ref={ref}
      >
        <button
          className="absolute top-3 right-4 p-1 bg-transparent rounded-sm transition"
          onClick={close}
        >
          <HiXMark className="w-6 h-6 text-gray-500" />
        </button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
