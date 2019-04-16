import React from 'react';

function SignUp(props) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => props.handleSignUpClose()}>&times;</span>
        <div className="modal-text">
          <h1>Sign Up Here</h1>
          <div className="form">
            <label>Email</label>
            <input type="email" name="email" value={props.email} onChange={props.onEmailChange} />
            <label>Password</label>
            <input type="password" name="password" value={props.password} onChange={props.onPasswordChange} />
            <button className="primary" onClick={() => props.registerUser(props.email, props.password)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;