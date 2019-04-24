import React from 'react';

function Verification(props) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => props.handleVerificationClose()}>&times;</span>
        <div className="modal-text">
          <h1>Please Verify Your Email</h1>
          {!props.unverifiedUser && <p>You should receive an email shortly with a verification code. Please enter the code below.</p>}
          {props.unverifiedUser &&
            <div>
              <p>You have not verified your account. Would you like to resend another verification code?</p>
              <button className="primary" onClick={() => props.resendVerification(props.email)}>Resend Verification</button>
            </div>
          }
          <div className="form">
            <label>Verfication Code</label>
            <input type="number" name="verification" value={props.verification} onChange={props.onVerificationChange} />
            <button className="primary" onClick={() => props.verifyUser(props.email, props.password, props.verification, props.occupation)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verification;