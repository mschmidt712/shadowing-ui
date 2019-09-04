import React from 'react';
import ReactTooltip from 'react-tooltip';

export default function StudentSignUpStep1(props) {
  function validateForm() {
    props.setTouched('stepOne');

    if (!props.firstName || !props.lastName) {
      alert('First name and last name are required!');
      return;
    } else if (!props.streetAddress || !props.city || !props.state || !props.zipCode) {
      alert('Full address is required!');
      return;
    } else if (!props.phoneNumber) {
      alert('Phone number is required!');
      return;
    }

    return props.nextStep();
  }

  return (
    <div className="form main">
      <h4 className="app-subtitle">
        Thanks for your interest in Shadowing.com!
        <br />
        Set up your profile to begin requesting shadowing with doctors in your area.
      </h4>
      {props.loginMethod === 'cognito' && <div className="form-element">
        <button className="primary" onClick={() => { props.toggleChangeEmail(true) }}>Change Email</button>
        <button className="secondary" onClick={() => { props.toggleChangePasswordModal(true) }}>Change Password</button>
      </div>}
      <div className="form-element">
        <label className="label">Email:</label>
        {!props.displayChangeEmail && <div className="form-input value">
          <input disabled value={props.email} />
        </div>}
        {props.displayChangeEmail &&
          <div className="form-input value">
            <input type="text" name="email" value={props.email} onChange={props.onInputChange} />
            <button className="icon small">
              <i className="fa fa-check" onClick={() => {
                props.updateEmailAttribute(props.email);
                props.toggleChangeEmail(false);
              }}></i>
            </button>
            <button className="icon small" onClick={() => { props.toggleChangeEmail(false) }}>
              <i className="fa fa-times"></i>
            </button>
          </div>}
      </div>
      <div className="form-element">
        <label className="label">Name</label>
        <div className="form-input value">
          <input type="text" name="firstName" value={props.firstName} onChange={props.onInputChange} placeholder="First Name" className={props.stepOneTouched} required />
          <input type="text" name="lastName" value={props.lastName} onChange={props.onInputChange} placeholder="Last Name" className={props.stepOneTouched} required />
        </div>
      </div>
      <div className="form-element">
        <div className="label">
          <label>Address</label>
          <i
            data-for="address"
            data-tip="This is only used for findshadowing.com to find doctors closest to your location. This information will not be released or disclosed."
            className="fas fa-info-circle icon">
          </i>
          <ReactTooltip
            id="address"
            className="tooltip"
          />
        </div>
        <div className="form-input value">
          <input type="text" name="streetAddress" value={props.streetAddress} onChange={props.onInputChange} placeholder="Street Address" className={props.stepOneTouched} required />
          <input type="text" name="city" value={props.city} onChange={props.onInputChange} placeholder="City" className={props.stepOneTouched} required />
          <div className="select small">
            <select name="state" value={props.state} onChange={props.onInputChange} className={props.stepOneTouched} required>
              <option value=""></option>
              <option value="AL">AL</option>
              <option value="AK">AK</option>
              <option value="AZ">AZ</option>
              <option value="AR">AR</option>
              <option value="CA">CA</option>
              <option value="CO">CO</option>
              <option value="CT">CT</option>
              <option value="DE">DE</option>
              <option value="DC">DC</option>
              <option value="FL">FL</option>
              <option value="GA">GA</option>
              <option value="HI">HI</option>
              <option value="ID">ID</option>
              <option value="IL">IL</option>
              <option value="IN">IN</option>
              <option value="IA">IA</option>
              <option value="KS">KS</option>
              <option value="KY">KY</option>
              <option value="LA">LA</option>
              <option value="ME">ME</option>
              <option value="MD">MD</option>
              <option value="MA">MA</option>
              <option value="MI">MI</option>
              <option value="MN">MN</option>
              <option value="MS">MS</option>
              <option value="MO">MO</option>
              <option value="MT">MT</option>
              <option value="NE">ME</option>
              <option value="NV">MV</option>
              <option value="NH">NH</option>
              <option value="NJ">NJ</option>
              <option value="NM">NM</option>
              <option value="NY">NY</option>
              <option value="NC">NC</option>
              <option value="ND">ND</option>
              <option value="OH">OH</option>
              <option value="OK">OK</option>
              <option value="OR">OR</option>
              <option value="PA">PA</option>
              <option value="RI">RI</option>
              <option value="SC">SC</option>
              <option value="SD">SD</option>
              <option value="TN">TN</option>
              <option value="TX">TX</option>
              <option value="UT">UT</option>
              <option value="VT">VT</option>
              <option value="VA">VA</option>
              <option value="WA">WA</option>
              <option value="WV">WV</option>
              <option value="WI">WI</option>
              <option value="WY">WY</option>
            </select>
            <i className="fas fa-angle-down"></i>
          </div>
          <input type="text" name="zipCode" value={props.zipCode} onChange={props.onInputChange} placeholder="Zip Code" className={props.stepOneTouched} required />
        </div>
      </div>
      <div className="form-element">
        <label className="label">Phone Number</label>
        <div className="form-input value">
          <input type="int" name="phoneNumber" value={props.phoneNumber} onChange={props.onInputChange} placeholder="Phone Number" className={props.stepOneTouched} required />
        </div>
      </div>
      <div>
        <button onClick={validateForm} type="button" className="primary">Next</button>
      </div>
    </div>
  )
}
