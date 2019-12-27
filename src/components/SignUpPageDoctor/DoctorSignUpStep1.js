import React from 'react'
import ReactTooltip from 'react-tooltip';

import medicalSpecialties from '../../constants/medicalSpecialties';
import medicalCareersWithSpecialties from '../../constants/medicalCareersWithSpecialties';
import medicalCareers from '../../constants/medicalCareers';

export default function Step1(props) {
  function validateForm() {
    props.setTouched('stepOne');

    if (!props.firstName || !props.lastName || !props.career) {
      alert('First name, last name, and career are required!');
      return;
    } else if (props.career === 'MD/DO' && !props.degree) {
      alert('Degree is required!');
      return;
    } else if (!props.streetAddress || !props.city || !props.state || !props.zipCode) {
      alert('Full address is required!');
      return;
    } else if (medicalCareersWithSpecialties.includes(props.career) && !props.specialty) {
      alert('Specialty is required!');
      return;
    }

    return props.nextStep();
  }

  const careers = medicalCareers.map(career => (
    <option value={career.abbreviation} key={career.abbreviation}>{career.name}</option>
  ));

  const specialties = medicalSpecialties.map(specialty => (
    <option value={specialty} key={specialty}>{specialty}</option>
  ));

  return (
    <div className="form">
      <h4 className="app-subtitle">
        Thanks for your interest in Shadowing.com!
        <br />
        We understand that your time is valuable and we do our best to made the process as easy as possible. Let's start by building your profile.
      </h4>
      {props.loginMethod === 'cognito' && <div>
        <button className="primary" onClick={() => { props.toggleChangeEmail(true) }}>Change Email</button>
        <button className="secondary" onClick={() => { props.toggleChangePasswordModal(true) }}>Change Password</button>
      </div>}
      <div className="form-element">
        <div className="label">
          <label>Email:</label>
          <i
            data-for="email"
            data-tip="This is only used for shadowing.com to contact you for potential matches. Students will not have access to this information"
            className="fas fa-info-circle icon">
          </i>
          <ReactTooltip
            id="email"
            className="tooltip"
          />
        </div>
        {!props.displayChangeEmail && <div className="form-input value">
          <input value={props.email} disabled />
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
          <input type="text" name="firstName" value={props.firstName} onChange={props.onInputChange} placeholder="First Name" className={props.touched} required />
          <input type="text" name="lastName" value={props.lastName} onChange={props.onInputChange} placeholder="Last Name" className={props.touched} required />
        </div>
      </div>
      <div className="form-element">
        <label className="label">Career</label>
        <div className="form-input value">
          <div className="select">
            <select type="text" name="career" value={props.career} onChange={props.onInputChange} placeholder="Career" className={props.touched} required>
              <option value=""></option>
              {careers}
            </select>
            <i className="fas fa-angle-down"></i>
          </div>
          {props.career === 'MD/DO' && <div className="select small">
            <select type="text" name="degree" value={props.degree} onChange={props.onInputChange} placeholder="Degree" className={props.touched} required>
              <option value=""></option>
              <option value="MD">MD</option>
              <option value="DO">DO</option>
              <option value="MBBS">MBBS</option>
            </select>
            <i className="fas fa-angle-down"></i>
          </div>}
        </div>
      </div>
      {medicalCareersWithSpecialties.includes(props.career) && <div className="form-element">
        <label className="label">Specialty</label>
        <div className="form-input value ">
          <div className="select">
            <select type="text" name="specialty" value={props.specialty} onChange={props.onInputChange} placeholder="Specialty" className={props.touched} required >
              <option value=""></option>
              {specialties}
            </select>
            <i className="fas fa-angle-down"></i>
          </div>
        </div>
      </div>}
      <div className="form-element">
        <div className="label">
          <label>Address</label>
          <i
            data-for="address"
            data-tip="This is used by findshadowing.com to match student by location. Please see the privacy policy for more information."
            className="fas fa-info-circle icon">
          </i>
        </div>
        <ReactTooltip
          id="address"
          className="tooltip"
        />
        <div className="form-input value">
          <input type="text" name="streetAddress" value={props.streetAddress} onChange={props.onInputChange} placeholder="Street Address" className={props.touched} required />
          <input type="text" name="city" value={props.city} onChange={props.onInputChange} placeholder="City" className={props.touched} required />
          <span className="select small">
            <select name="state" value={props.state} onChange={props.onInputChange} className={props.touched} required>
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
          </span>
          <input type="text" name="zipCode" value={props.zipCode} onChange={props.onInputChange} placeholder="Zip Code" className={props.touched} required />
        </div>
      </div>
      <button onClick={validateForm} type="button" className="primary">Next</button>
    </div>
  )
}
