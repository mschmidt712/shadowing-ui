import React from 'react';
import { GoogleLogout } from 'react-google-login';
import { Link } from 'react-router-dom';

import './Header.css';

function Header(props) {
  const userNotLoggedIn = (<button className="primary login" onClick={props.handleLoginClick}>Login</button>);
  const userLoggedIn = (<div className="login">
    <Link to={`/user?id=${props.id}`}>
      {!props.picture &&
        <button className="icon">
          <i className="fas fa-user-circle"></i>
        </button>}
      {props.picture && <button className="icon">
        <img src={props.picture} alt="User" className="round" />
      </button>}
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
  let header;
  if (props.location && props.location.pathname === '/') {
    header = (<header className="app-header">
      <h1 className="app-title" >Find Shadowing</h1>
      <h3 className="app-subtitle">A website built to help students find physicians to shadow in a number of specialities in their area. Enter your location below to get started</h3>

      <div className="form">
        <label>Enter Your Zip Code</label>
        <input type="number" maxLength='5' placeholder="80226"></input>
        <button className="primary">Search</button>
      </div>

      <button className="link" onClick={() => { props.handleSignUpClick(); props.setOccupation("doctor"); }}>Sign Up As A Physician</button>
      <button className="link about-us">About Us</button>
      {!props.isLoggedIn && userNotLoggedIn}
      {props.isLoggedIn && userLoggedIn}
    </header>);
  } else {
    header = (<header className="app-header-condensed">
      <Link to="/" className="no-decoration">
        <h1 className="app-title" >Find Shadowing</h1>
      </Link>
      {!props.isLoggedIn && userNotLoggedIn}
      {props.isLoggedIn && userLoggedIn}
    </header>);
  }

  return header;
}

export default Header;