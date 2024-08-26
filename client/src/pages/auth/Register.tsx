import type { FunctionComponent } from "react";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../services/auth/authApi";
import { loginSuccess } from "../../services/auth/authSlice";
import { ApiError } from "../../utils/types/api.types";

interface RegisterProps {}

const Register: FunctionComponent<RegisterProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerFormData = useRef<HTMLFormElement>(null);
  const [register] = useRegisterMutation();
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Réinitialise l'erreur à chaque tentative de connexion

    try {
      const response = await register({
        email: registerFormData.current?.email.value,
        password: registerFormData.current?.password.value,
      }).unwrap(); // Utilisation de unwrap pour obtenir la réponse directement ou lancer une erreur
      const data = response.data;
      dispatch(
        loginSuccess({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: "",
        })
      );
      navigate("/");
    } catch (err) {
      setError((err as ApiError).data.message);
    }
  };
  return (
    <form className="auth-form" ref={registerFormData} onSubmit={handleRegister}>
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
          S'incsrire
        </button>
    </form>
  );
};

export default Register;
