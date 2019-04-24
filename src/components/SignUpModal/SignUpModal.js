import React from 'react';

function SignUp(props) {
  let doctorChecked = false;
  if (props.occupation === 'doctor') {
    doctorChecked = true;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => props.handleSignUpClose()}>&times;</span>
        <div className="modal-text">
          <h1>Sign Up Here</h1>
          <div className="form">
            <label>Email</label>
            <input type="email" name="email" value={props.email} onChange={props.onInputChange} />
            <label>Password</label>
            <input type="password" name="password" value={props.password} onChange={props.onInputChange} />
            <div className="form">
              <label>What kind of account would you like to create?</label>
              <div className="radio-form">
                <input type="radio" name="occupation" value="doctor" id="doctor" onChange={props.onInputChange} checked={doctorChecked} />
                <label htmlFor="doctor">Doctor</label>
              </div>
              <div className="radio-form">
                <input type="radio" name="occupation" value="student" id="student" onChange={props.onInputChange} />
                <label htmlFor="student">Student</label>
              </div>
            </div>
            <button className="primary" onClick={() => props.registerUser(props.email, props.password, props.occupation)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;