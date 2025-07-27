import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ModalState = {
  isModalOpen: boolean;
  modalType: ModalType | null; // Type of the modal to open
  data?: unknown; // Additional data for the modal
};

export enum ModalType {
  ADD_BOARD = "addBoard",
  EDIT_BOARD = "editBoard",
  ADD_COLUMN = "addColumn",
  EDIT_COLUMN = "editColumn",
  ADD_TASK = "addTask",
  EDIT_TASK = "editTask",
}

export type ModalStore = {
  modal: ModalState;
  openModal: (modalType: ModalState["modalType"], data?: unknown) => void;
  closeModal: () => void;
};

// Can be persisted if needed

export const useModalStore = create<ModalStore>()((set) => ({
  modal: {
    isModalOpen: false,
    modalType: null,
    data: undefined,
  },
  openModal: (modalType, data) =>
    set({ modal: { isModalOpen: true, modalType, data } }),
  closeModal: () =>
    set({
      modal: { isModalOpen: false, modalType: null, data: undefined },
    }),
}));
