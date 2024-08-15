import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../services/auth/authApi";
import GoogleAuthBtn from "../../components/google-auth-btn/GoogleAuthBtn";
import { loginSuccess } from "../../services/auth/authSlice";

interface Error {
  data: {
    error: string;
  };
}

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginFormData = useRef<HTMLFormElement>(null);
  const [login] = useLoginMutation();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Réinitialise l'erreur à chaque tentative de connexion

    try {
      const response = await login({
        email: loginFormData.current?.email.value,
        password: loginFormData.current?.password.value,
      }).unwrap(); // Utilisation de unwrap pour obtenir la réponse directement ou lancer une erreur
      const data = response.data;
      dispatch(loginSuccess({ user: data.user, token: data.token }));
    } catch (err) {
      setError((err as Error).data.error);
    } finally {
      navigate("/");
    }
  };

  return (
    <div>
      <h1>Auth Page</h1>
      <GoogleAuthBtn />
      <form ref={loginFormData} onSubmit={handleLogin}>
        <span className="error" color="red">
          {error}
        </span>
        <div className="input-wrapper">
          <label htmlFor="email">Username</label>
          <input type="email" id="email" name="email" />
        </div>
        <div className="input-wrapper">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />
        </div>
        <div className="input-remember">
          <input type="checkbox" id="remember-me" name="remember-me" />
          <label htmlFor="remember-me">Remember me</label>
        </div>
        <button type="submit" className="sign-in-button">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
