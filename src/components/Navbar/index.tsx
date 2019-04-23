import React, { useEffect, useState }from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";

import APIAccess from "../../lib/API";

const Navbar = () => {
  const [hamburgerIsActive, setHamburgerIsActive] = useState<boolean>(false);
  const [userName, setUserName] = useState<String>();

  // Get the username if already logged in
  useEffect(() => {
    if (APIAccess.isLoggedIn())
      setUserName(APIAccess.getUser().userName);
  }, []);

  // Subscribe to the APIAcces to see when the user loggs in or out
  APIAccess.addListener("loggedin", userName => setUserName(userName));
  APIAccess.addListener("loggedout", userName => setUserName(undefined));

  // Function to make the hamburger menu button functional
  const hamburgerClicked = (event: React.MouseEvent) => {
    setHamburgerIsActive(!hamburgerIsActive);
  };

  // Render welcome message and logout button if user is logged in
  // Else login buttons if the user is not logged in
  let userSection;
  if (userName) {
    userSection = (
      <div className="navbar-end">
        <div className="navbar-item">
          <p>Welcome { userName }!</p>
        </div>
        <div className="navbar-item">
          <Link className="button is-danger" to="/" onClick={APIAccess.loggOut}>Log out</Link>
        </div>
      </div>
    );
  } else {
    userSection = (
      <div className="navbar-end">
        <div className="navbar-item">
          <div className="buttons">
            <Link className="button is-primary" to="/signin">
              <strong>Sign up</strong>
            </Link>
            <Link className="button is-light" to="/signin">Log in</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <h1 className="title">StackOverflow light</h1>
        </Link>

        <a
          role="button"
          className={ `navbar-burger burger ${hamburgerIsActive ? "is-active" : ""}` }
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarButtons"
          onClick={hamburgerClicked}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>

      <div id="navbarButtons" className={ `navbar-menu ${hamburgerIsActive ? "is-active" : ""}` }>
        { userSection }
      </div>
    </nav>
  );
};

export default Navbar;
