import { useContext } from "react";
import { PostFormContext, PostFormContextType } from "../context/postFormContext";


export const usePostFormContext = (): PostFormContextType => {
    const context = useContext(PostFormContext);
    if (!context) {
      throw new Error("usePostFormContext must be used within a PostFormProvider");
    }
    return context;
};