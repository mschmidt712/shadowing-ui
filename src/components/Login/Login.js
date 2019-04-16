import React from 'react';
import Facebook from '../Facebook/Facebook';

import './Login.css';

function Login(props) {
  return (<div className="modal">
    <div className="modal-content">
      <span className="close" onClick={() => props.handleLoginClose()}>&times;</span>
      <div className="modal-text">
        <h1>Please Sign In</h1>
        <Facebook></Facebook>
        <button className="primary"> Login With Google </button>
        <h3 className="with-horizontal-line"><span>or</span></h3>
        <div className="form">
          <label>Email</label>
          <input type="email" name="email" value={props.email} onChange={props.onEmailChange} />
          <label>Password</label>
          <input type="password" name="password" value={props.password} onChange={props.onPasswordChange} />
          <button className="primary" onClick={() => props.loginUser(props.email, props.password)}>Login</button>
          <button className="link" onClick={() => props.handleForgotPasswordClick(props.email)}>Forgot Password?</button>
        </div>
        <span>
          New to findshadowing.com?
          <button className="link" onClick={() => props.handleSignUpClick()}>Sign Up Here.</button>
        </span>
      </div>
    </div>
  </div>);
}

export default Login;