import { useState } from "react";
import { useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../services/auth/authApi";
import { ApiError } from "../../utils/types/api.types";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setErrorMessage("Token is required");
      return;
    }
    if (!password) {
      setErrorMessage("Le mot de passe est obligatoire");
      return;
    }
    try {
      const response = await resetPassword({ token, newPassword: password }).unwrap();
      console.log(response);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'e-mail", error);
      setErrorMessage((error as ApiError).data.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <form className="auth-form" onSubmit={onSubmit}>
          <h2 className="auth-page__title">Reset Password</h2>
          <div className="auth-form__input-wrapper">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="New password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="error">{errorMessage}</p>}
          <button
            type="submit"
            className="btn sign-in-button"
            disabled={isLoading}
          >
            {isLoading ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
