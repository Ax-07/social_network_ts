import { useEffect, useRef } from "react";
import { useGoogleLoginMutation } from "../../services/auth/googleAuthApi";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../services/auth/authSlice';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (params: { client_id: string; callback: (response: GoogleResponse) => void; context?: string }) => void;
          renderButton: (element: HTMLElement, options: { theme: string; type: string; size: string; text: string; shape: string; logo_alignment: string }) => void;
        };
      };
    };
  }
}
  
  interface GoogleResponse {
    credential: string;
  }

const GoogleAuthBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const buttonRef = useRef<HTMLDivElement>(null);
    const [googleLogin] = useGoogleLoginMutation();
    const google_client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID as string; // Assurez-vous que cette variable est correctement configurée
    
    const handleCredentialResponse = async (google_response: GoogleResponse) => {
        const idToken = google_response.credential; console.log(idToken);
        try {
          const response = await googleLogin({ token: idToken });
          dispatch(loginSuccess({
            user: response.data.data.user, 
            accessToken: response.data.data.accessToken,
            refreshToken: response.data.data.refreshToken
          }));
        } catch (error) {
          console.log(error);
        } finally {
          navigate('/');
        }
      };

      useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          const params = {
            client_id: google_client_id,
            callback: handleCredentialResponse,
            context: "use", // Configure le bouton pour afficher uniquement le logo
            auto_select: true // Sélectionne automatiquement le compte Google actuellement connecté
          };
    
          window.google.accounts.id.initialize(params);
          window.google.accounts.id.renderButton(
            buttonRef.current!,
            {
              theme: "filled_black", // filled_black, filled_blue, filled_red, filled_white, outline
              type: "standard", // icon, standard
              size: "large", // small, standard, large
              text: "signin_with", // signin_with, signup_with
              shape: "pill", // pill, rect
              logo_alignment: "left" // left, center
            }
          );
        };
        document.body.appendChild(script);
    
        return () => {
          document.body.removeChild(script);
        };
      }, []);

    return (
        <div id="gsi_container" className="gsi-material-button" ref={buttonRef}></div>
  );
};

export default GoogleAuthBtn;