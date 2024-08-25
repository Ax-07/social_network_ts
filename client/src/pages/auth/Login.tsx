import type { FunctionComponent } from "react";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../services/auth/authApi";
import { loginSuccess } from "../../services/auth/authSlice";

interface LoginProps {}

interface Error {
    data: {
      error: string;
    };
  }
const Login: FunctionComponent<LoginProps> = () => {
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
      dispatch(
        loginSuccess({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: "",
        })
      );
    } catch (err) {
      setError((err as Error).data.error);
    } finally {
      navigate("/");
    }
  };
  return (
      <form className="auth-form" ref={loginFormData} onSubmit={handleLogin}>
        <span className="error" color="red">
          {error}
        </span>
        <div className="auth-form__input-wrapper">
          <input type="email" id="email" name="email" placeholder="Email*"/>
        </div>
        <div className="auth-form__input-wrapper">
          <input type="password" id="password" name="password" placeholder="Password*"/>
        </div>
        <div className="auth-form__input-remember">
          <input type="checkbox" id="remember-me" name="remember-me" />
          <label htmlFor="remember-me">Remember me</label>
        </div>
        <button type="submit" className="btn sign-in-button">
          Se connecter
        </button>
      </form>
  );
};

export default Login;
