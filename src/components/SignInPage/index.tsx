import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

import "./SignInPage.scss";

import APIAccess from "../../lib/API";

const SignInPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const updateUserName = (event: React.FormEvent) => {
    const userNameInput = event.target as HTMLInputElement;
    setUserName(userNameInput.value);
  };

  const updatePassword = (event: React.FormEvent) => {
    const passwordInput = event.target as HTMLInputElement;
    setPassword(passwordInput.value);
  };

  // Log the user in
  const logIn = () => {
    APIAccess.loggIn(userName, password);
  };

  // Register a new user
  const register = () => {
    APIAccess.postData("/user/register", { userName, password });
  };

  // If user is already logged in, redirect to hom
  if (APIAccess.isLoggedIn()) return <Redirect to="/" />;

  return (
    <div className="signinForm">
      <h1 className="title is-3">Sign up/in</h1>

      <form className="form">
        <div className="field">
          <label className="label">User Name</label>
          <div className="control">
            <input 
              className="input" 
              id="user-name-input" 
              type="text" 
              value={userName}
              onChange={updateUserName}
             />
          </div>
        </div>

        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input className="input" 
              id="password-input" 
              type="password" 
              value={password} 
              onChange={updatePassword} 
            />
          </div>
        </div>

        <div className="field is-grouped is-grouped-centered">
          <p className="control">
            <Link
              to="/signin"
              onClick={register}
              className="button is-primary"
              id="register-button"
            >
              Register
            </Link>
          </p>
          <p className="control">
            <Link
              to="/"
              onClick={logIn}
              className="button is-light"
              id="login-button"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

interface IUserLogginInformation {
  userName: string;
  password: string;
}

export default SignInPage;
