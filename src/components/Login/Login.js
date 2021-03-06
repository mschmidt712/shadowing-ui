import React from 'react';
import ReactTooltip from 'react-tooltip';

import Facebook from '../Facebook/Facebook';
import Google from '../Google/Google';
import './Login.css';

function Login(props) {
  return (<div className="modal">
    <div className="modal-content">
      <span className="close" onClick={() => props.handleLoginClose()}>&times;</span>
      <div className="modal-text">
        <h1>Please Sign In</h1>
        {/* <Facebook></Facebook>
        <Google></Google>
        <h3 className="with-horizontal-line"><span>or</span></h3> */}
        <div className="form">
          <label>Email</label>
          <input type="email" name="email" value={props.email} onChange={props.onEmailChange} />
          <label>
            Password
            <i
              data-for="password-info"
              data-tip="Password must be at least 6 characters and contain upper and lower case letters."
              className="fas fa-info-circle icon">
            </i>
            <ReactTooltip
              id="password-info"
              className="tooltip"
            />
          </label>
          <input type="password" id="password" name="password" value={props.password} onChange={props.onPasswordChange} />
          <button className="primary" id="submit" onClick={() => props.loginUser(props.email, props.password)}>Login</button>
          <button className="link" onClick={() => props.handleForgotPasswordClick(props.email)}>Forgot Password?</button>
        </div>
        <div>
          New to findshadowing.com?
            {/* <button className="link" onClick={() => { props.setOccupation('student'); props.handleSignUpClick(); }}>Sign Up Here.</button> */}
          <p> Student Sign Up Coming Soon! </p>
        </div>
      </div>
    </div>
  </div>);
}

export default Login;