import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../stores";
import { FormOrigin } from "../../components/Form/utils/switchOrigin";

interface FormState {
    userId?: string | undefined;
    senderId?: string | undefined;
    receiverId?: string | undefined;
    roomId?: string | undefined;
    messageType?: "notification" | "media" | "text" | "system";
    content?: string;
    file?: File | string;
    mimetype?: string;
    originalPostId?: string | undefined;
    originalCommentId?: string | undefined;
    commentedPostId?: string;
    commentedCommentId?: string;
    isValidForm?: boolean;
    preview?: string | undefined;
    isPreview?: boolean;
}

interface FormsState {
    [origin: string]: FormState; // Chaque `origin` a son propre état de formulaire
  }
  
  const initialState: FormsState = {};

const formSlice = createSlice({
    name: "form",
    initialState,
    reducers: {
      // Mettre à jour un état de formulaire en fonction de l'`origin`
      setForm: (state, action: PayloadAction<{ origin: FormOrigin; formState: Partial<FormState> }>) => {
        const { origin, formState } = action.payload;
        if (origin) {
          state[origin] = { ...state[origin], ...formState };  // Mise à jour seulement si origin est défini
        }
      },
      resetForm: (state, action: PayloadAction<{ origin: FormOrigin }>) => {
        const { origin } = action.payload;
        if (origin) {
          state[origin] = {};
        }
      },
      handleFileChange: (state, action: PayloadAction<{ origin: FormOrigin; file: File }>) => {
        const { origin, file } = action.payload;
        if (origin)
        state[origin] = { ...state[origin], file, isPreview: true };
      },
      handleContentChange: (state, action: PayloadAction<{ origin: FormOrigin; content: string }>) => {
        const { origin, content } = action.payload;
        if (origin)
        state[origin] = {
          ...state[origin],
          content,
          isValidForm: (content?.trim().length ?? 0) > 0 || state[origin]?.file !== "",
        };
      },
      setPreview: (state, action: PayloadAction<{ origin: FormOrigin; preview: string }>) => {
        const { origin, preview } = action.payload;
        if (origin)
        state[origin] = { ...state[origin], preview, isPreview: true };
      },
      setMimetype: (state, action: PayloadAction<{ origin: FormOrigin; mimetype: string }>) => {
        const { origin, mimetype } = action.payload;
        if (origin)
        state[origin] = { ...state[origin], mimetype };
      },
    },
  });

  // Sélecteur mémoïsé pour récupérer l'état du formulaire pour un `origin`
  export const selectFormByOrigin = createSelector(
      (state: RootState) => state.form,  // Récupérer tous les formulaires
      (_: RootState, origin: FormOrigin) => origin, // Récupérer l'origin en paramètre
      (forms, origin) => forms[origin ?? ""] || {}  // Retourner l'état du formulaire pour cet origin
    );
  
  export const { setForm, resetForm, handleFileChange, handleContentChange, setPreview, setMimetype } = formSlice.actions;
  export default formSlice.reducer;
  export type { FormState, FormsState };