import React from 'react';
import ReactTooltip from 'react-tooltip';

export default function StudentSignUpStep2(props) {
  function validateForm() {
    props.setTouched('stepTwo');

    if (!props.school) {
      alert('School name is required!');
      return;
    } else if (!props.schoolYear) {
      alert('School year is required!');
      return;
    } else if (!props.cv) {
      alert('A CV or resume upload is required!');
      return;
    }

    return props.createStudent();
  }

  function convertStringToBoolean(bool) {
    if (bool === 'true' || bool === true) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className="form main">
      <div className="form-element">
        <div className="label">
          <label>School Name</label>
          <i
            data-for="school"
            data-tip="Please enter the name of your high school, college, or university. If you are not currently in school, enter N/A or your last attented school."
            className="fas fa-info-circle icon">
          </i>
          <ReactTooltip
            id="school"
            className="tooltip"
          />
        </div>
        <div className="form-input value">
          <input type="text" name="school" value={props.school} onChange={props.onInputChange} placeholder="School Name or N/A" className={props.stepTwoTouched} required />
        </div>
      </div>
      <div className="form-element">
        <label className="label">School Year</label>
        <div className="form-input value">
          <div className="select">
            <select name="schoolYear" value={props.schoolYear} onChange={props.onInputChange} className={props.setTwoTouched} required>
              <option value=""></option>
              <option value="high-school">High School</option>
              <option value="freshmen">College Freshman</option>
              <option value="sophomore">College Sophomore</option>
              <option value="junior">College Junior</option>
              <option value="senior">College Senior</option>
              <option value="masters">Masters Student</option>
              <option value="post-baccalaureate">Post Baccalaureate</option>
              <option value="graduated">Graduated</option>
            </select>
            <i className="fas fa-angle-down"></i>
          </div>
        </div>
      </div>
      <div className="form-element">
        <div className="label">
          <label>Are You HIPAA Certified?</label>
          <i
            data-for="hipaa"
            data-tip="HIPAA (Health Insurance Portability and Accountability Act) helps keep patient's medical information confidential. HIPAA certification is an important first step to a healthcare career. It can be completed quickly and easily online via websites like https://www.cybrary.it/course/hipaa-training/."
            className="fas fa-info-circle icon">
          </i>
          <ReactTooltip
            id="hipaa"
            className="tooltip"
          />
        </div>
        <div className="form-input value">
          <div className="radio-form checkbox-container inline">
            <input type="radio" name="hipaaCert" value='true' id="yes" onChange={props.onInputChange} className={props.stepTwoTouched} checked={convertStringToBoolean(props.hipaaCert)} required />
            <span className="radiobox"></span>
            <label htmlFor="yes">Yes</label>
          </div>
          <div className="radio-form checkbox-container inline">
            <input type="radio" name="hipaaCert" value='false' id="no" onChange={props.onInputChange} className={props.stepTwoTouched} checked={!convertStringToBoolean(props.hipaaCert)} required />
            <span className="radiobox"></span>
            <label htmlFor="no">No</label>
          </div>
        </div>
      </div>
      <div className="form-element">
        <label name="cvUpload" className="label">CV/Resume Upload</label>
        <input name="cvUpload" type="file" accept="application/pdf" onChange={props.onCvInputChange} className={`${props.stepTwoTouched} value`} required />
      </div>
      <div className="form-element">
        <div className="form-input checkbox-container">
          <input type="checkbox" id="subscribe" name="subscribe" checked={props.subscribe} onChange={props.onCheckboxChange} className="checkbox" />
          <span className="checkbox"></span>
          <label htmlFor="subscribe">Sign Up For More Great Pre-med Content!</label>
        </div>
      </div>
      <div>
        <button onClick={props.previousStep} type="button" className="button secondary">Previous</button>
        {!props.active && <input type="button" className="button primary" value="Complete Profile" onClick={validateForm} />}
        {props.active && <input type="submit" className="button primary" value="Save" onClick={validateForm} />}
      </div>
    </div>
  )
}
