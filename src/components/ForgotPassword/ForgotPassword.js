import React from 'react';

function ForgotPassword(props) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => props.handleForgotPasswordClose()}>&times;</span>
        <div className="modal-text">
          <h1>Forgot Password</h1>
          <p>Enter the email for which you would like to reset the password</p>
          <div className="form">
            <label>Email</label>
            <input type="email" name="email" value={props.email} onChange={props.onInputChange} />
            <button className="primary" onClick={() => props.forgotPassword(props.email)}>Send Verification Code</button>
          </div>
          <p>When you have received the verification code in your email, enter it below along with your new password.</p>
          <div className="form">
            <label>Verification Code</label>
            <input type="number" name="verification" value={props.verification} onChange={props.onInputChange} />
            <label>New Password</label>
            <input type="password" name="password" value={props.password} onChange={props.onInputChange} />
            <button className="primary" onClick={() => props.confirmPasswordReset(props.email, props.verification, props.password)}>Reset Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;