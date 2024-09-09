import { useState } from "react";
import GoogleAuthBtn from "../../components/Actions/google-auth-btn/GoogleAuthBtn";
import Login from "./Login";
import Register from "./Register";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const handleTabChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLogin(event.target.value === 'login');
  };
  return (
    <div className="auth-page">
      <div className="auth-page__container">
      <div className="controls">
        <div className="tabs">
          <input className="sr-only" type="radio" name="tabs" id="login" value={'login'} checked={isLogin} onChange={handleTabChange}/>
          <label htmlFor="login">Login</label>
          <input  className="sr-only" type="radio" name="tabs" id="register" value={'register'} checked={!isLogin} onChange={handleTabChange}/>
          <label htmlFor="register">Register</label>
          <div className="tabs__indicator">
            <div className="tabs__track">
              <label htmlFor="login" className="tabs__label">Login</label>
              <label htmlFor="register" className="tabs__label">Register</label>
            </div>
          </div>
        </div>
      </div>
      {isLogin ? <Login /> : <Register />}
      <div className="auth-page__line">
        <hr /><p>ou</p><hr />
      </div>
      <GoogleAuthBtn />
      </div>
    </div>
  );
};

export default AuthPage;
