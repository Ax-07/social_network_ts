import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormOrigin } from "../../components/Form/Form";

interface ModalState {
    modals: { [key: string]: boolean };
    modalName: string | null;
    origin: FormOrigin | null;
}

const initialState: ModalState = {
    modals: {},
    modalName: null,
    origin: null,
};

const modalSlice = createSlice({
    name: "modals",
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<string>) => {
            state.modals[action.payload] = true;
            state.modalName = action.payload;
            state.origin = action.payload as FormOrigin;
        },
        closeModal: (state, action: PayloadAction<string>) => {
            state.modals[action.payload!] = false;
            state.modalName = null;
            state.origin = null;
        },
    },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
export type { ModalState };