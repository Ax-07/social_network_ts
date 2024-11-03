import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../stores";
import { FormOrigin } from "../../components/Form/utils/switchOrigin";

interface FormState {
  // base
  userId?: string ;
  content?: string;
  isValidForm?: boolean;  
    // with media
    file?: File | string;
    mimetype?: string;

  // comments
  commentedPostId?: string;
  commentedCommentId?: string;

  // reposts
  originalPostId?: string | undefined;
  originalCommentId?: string | undefined;

  // messages
    senderId?: string | undefined;
    receiverId?: string | undefined;
    receiversIds?: string[] | undefined; // Pour les messages de groupe
    roomId?: string | undefined;
    messageType?: "notification" | "media" | "text" | "system";

    // Si media ou repost
    preview?: string | undefined;
    isPreview?: boolean;

    // Pour les sondages
    isQuestion?: boolean;
    question?: string;
    answers?: string[];
    expiredAt?: Date;

    // Pour les évenements
    isEvent?: boolean;
    title?: string;
    description?: string;
    location?: string;
    startDate?: Date;
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