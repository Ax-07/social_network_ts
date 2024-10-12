import { useState } from 'react';
import { useForgotPasswordMutation } from "../../services/auth/authApi";
import { ApiError } from '../../utils/types/api.types';

export default function ForgotPassword() {
  const [forgotPassword, { isLoading, isError, isSuccess }] = useForgotPasswordMutation();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("L'email est obligatoire");
      return;
    }
    try {
      const response = await forgotPassword({ email }).unwrap(); // unwrap to handle errors correctly
      console.log(response);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'e-mail", error);
        setErrorMessage((error as ApiError).data.message);
    }
  };

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <div className="auth-form__input-wrapper">
        <input 
          type="email" 
          id="email" 
          name="email" 
          placeholder="Email*" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <button type="submit" className="btn sign-in-button" disabled={isLoading}>
        {isLoading ? 'Envoi...' : 'Envoyer'}
      </button>
      {isError && <p className="error" color="red">Erreur lors de l'envoi du lien de réinitialisation.</p>}
      {isSuccess && <p className="success" color='green'>E-mail de réinitialisation envoyé avec succès.</p>}
    </form>
  );
}
