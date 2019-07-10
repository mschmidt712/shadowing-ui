import React from 'react';
import { GoogleLogout } from 'react-google-login';
import { Link } from 'react-router-dom';

import './Header.css';

function Header(props) {
  const userNotLoggedIn = (<button className="primary login" onClick={props.handleLoginClick}>Login</button>);
  const userLoggedIn = (<div className="login">
    <Link to={`/requests?id=${props.id}`} className="icon">
      <i className="fas fa-envelope"></i>
    </Link>
    <Link to={`/user?id=${props.id}`} className="icon">
      {!props.picture && <i className="fas fa-user-circle"></i>}
      {props.picture && <img src={props.picture} alt="User" className="round" />}
    </Link>
    {props.loginMethod === "cognito" &&
      <button className="primary" onClick={props.logoutUser}>Logout</button>}
    {props.loginMethod === "facebook" &&
      <button className="primary" onClick={props.facebookLogoutUser}>Logout</button>}
    {props.loginMethod === "google" &&
      <GoogleLogout
        render={renderProps => (
          <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="primary">
            Logout
          </button>
        )}
        onLogoutSuccess={props.googleLogoutUser}
      >
      </GoogleLogout>}
  </div>);
  const userLoggedInAdmin = (<div className="login">
    <Link to={`/admin`}>
      <button class="secondary">
        Admin Dashboard
      </button>
    </Link>
    <button className="primary" onClick={props.logoutUser}>Logout</button>
  </div>);
  const header = (<header className="app-header-condensed">
    <div className="header-content">
      <Link to="/" className="no-decoration">
        <h1 className="app-title" >Find Shadowing</h1>
      </Link>
      {!props.isLoggedIn && userNotLoggedIn}
      {props.isLoggedIn && !props.isAdmin && userLoggedIn}
      {props.isLoggedIn && props.isAdmin && userLoggedInAdmin}
    </div>
  </header>);
  // }

  return header;
}

export default Header;