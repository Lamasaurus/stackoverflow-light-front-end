import React from "react";
import { Link, Redirect } from "react-router-dom";

import "./SignInPage.scss";

import APIAccess from "../../lib/API";

const SignInPage = () => {
  // Get the username and password from the form
  const getFormData = (): IUserLogginInformation => {
    const userNameInputElement = document.getElementById(
      "userNameInput"
    ) as HTMLInputElement;
    const userName = userNameInputElement.value;

    const passwordInputElement = document.getElementById(
      "passwordInput"
    ) as HTMLInputElement;
    const password = passwordInputElement.value;

    return { userName, password }
  }

  // Log the user in
  const logIn = () => {
    const {userName, password} = getFormData();

    APIAccess.loggIn(userName, password);
  };

  // Register a new user
  const register = () => {
    const user = getFormData();

    APIAccess.postData("/user/register", user);
  }

  // If user is already logged in, redirect to hom
  if (APIAccess.isLoggedIn())
    return <Redirect to="/" />;

  return (
    <div className="signinForm">
      <h1 className="title is-3">Sign up/in</h1>

      <form className="form">
        <div className="field">
          <label className="label">User Name</label>
          <div className="control">
            <input
              className="input"
              id="userNameInput"
              type="text"
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              className="input"
              id="passwordInput"
              type="password"
            />
          </div>
        </div>

        <div className="field is-grouped is-grouped-centered">
          <p className="control">
            <Link to="/signin" onClick={ register } className="button is-primary">Register</Link>
          </p>
          <p className="control">
            <Link to="/" onClick={ logIn } className="button is-light">Login</Link>
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
