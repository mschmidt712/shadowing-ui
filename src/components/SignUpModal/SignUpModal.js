import React from 'react';
import ReactTooltip from 'react-tooltip';

function SignUp(props) {
  let doctorChecked = false;
  if (props.occupation === 'doctor') {
    doctorChecked = true;
  }

  function validateForm(email, password, confirmPassword, occupation) {
    if (!email || !password || !occupation) {
      alert('Email, password, and occupation are required to create an account!');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    props.registerUser(email, password, occupation)
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => props.handleSignUpClose()}>&times;</span>
        <div className="modal-text">
          <h1>Sign Up Here</h1>
          <div className="form">
            <label>Email</label>
            <input type="email" name="email" placeholder="Email" value={props.email} onChange={props.onInputChange} />
            <label>
              Password
              <i
                data-tip="Password must be at least 6 characters and contain upper and lower case letters."
                className="fas fa-info-circle icon">
              </i>
              <ReactTooltip />
            </label>
            <input type="password" name="password" value={props.password} onChange={props.onInputChange} />
            <label>
              Confirm Password
              <i
                data-tip="Password must be at least 6 characters and contain upper and lower case letters."
                className="fas fa-info-circle icon">
              </i>
              <ReactTooltip />
            </label>
            <input type="password" name="confirmPassword" value={props.confirmPassword} onChange={props.onInputChange} />
            <div className="form">
              <p>What kind of account would you like to create?</p>
              <div className="radio-form checkbox-container">
                {/* <input type="radio" name="occupation" value="doctor" id="doctor" onChange={props.onInputChange} checked={doctorChecked} /> */}
                <input type="radio" name="occupation" value="doctor" id="doctor" onChange={props.onInputChange} checked />
                <span className="radiobox"></span>
                <label htmlFor="doctor">Doctor</label>
              </div>
              {/* <div className="radio-form checkbox-container">
                <input type="radio" name="occupation" value="student" id="student" onChange={props.onInputChange} checked={!doctorChecked} />
                <span className="radiobox"></span>
                <label htmlFor="student">Student</label>
              </div> */}
            </div>
            <button className="primary" onClick={() => validateForm(props.email, props.password, props.confirmPassword, props.occupation)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;