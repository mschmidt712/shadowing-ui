import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import ChangePasswordModal from '../SignUpPageShared/ChangePasswordModal';
import * as authActions from '../../actions/authActions';
import * as userActions from '../../actions/userActions';

class SignUpPageStudent extends Component {
  constructor(props) {
    super(props)

    const [firstName, lastName] = props.name.split(' ');

    this.state = {
      firstName: firstName || '',
      lastName: lastName || '',
      email: props.email || '',
      streetAddress: props.address.streetAddress || '',
      city: props.address.city || '',
      state: props.address.state || '',
      zipCode: props.address.zipCode || undefined,
      phoneNumber: props.phoneNumber || undefined,
      hipaaCert: props.hipaaCert || false,
      cv: props.cv || '',
      subscribe: true,
      touched: 'clean',
      displayChangeEmail: false,
      displayChangePasswordModal: false,
      changePassword: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }
    }

    this.onInputChange = this.onInputChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.onPasswordInputChange = this.onPasswordInputChange.bind(this);
    this.onCvInputChange = this.onCvInputChange.bind(this);
    this.setTouched = this.setTouched.bind(this);

    this.validateForm = this.validateForm.bind(this);
    this.createStudent = this.createStudent.bind(this);

    this.toggleChangeEmail = this.toggleChangeEmail.bind(this);
    this.toggleChangePasswordModal = this.toggleChangePasswordModal.bind(this);
  }

  componentDidUpdate(previousProps) {
    if (previousProps !== this.props) {
      const [firstName, lastName] = this.props.name.split(' ');

      this.setState({
        firstName: firstName || '',
        lastName: lastName || '',
        email: this.props.email || '',
        streetAddress: this.props.address.streetAddress || '',
        city: this.props.address.city || '',
        state: this.props.address.state || '',
        zipCode: this.props.address.zipCode || undefined,
        phoneNumber: this.props.phoneNumber || undefined,
        hipaaCert: this.props.hipaaCert || false,
        cv: this.props.cv || ''
      });
    }
  }

  onInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onCheckboxChange(event) {
    let newState = {};
    newState[event.target.name] = event.target.checked;
    this.setState(newState);
  }

  onPasswordInputChange(event) {
    const newState = Object.assign({}, this.state.changePassword, {
      [event.target.name]: event.target.value
    });
    this.setState({
      changePassword: newState
    });
  }

  onCvInputChange(event) {
    this.setState({
      cv: event.target.files[0]
    });
  }

  setTouched() {
    this.setState({
      touched: 'dirty'
    });
  }

  formatPhoneNumber(phoneNumber) {
    var cleaned = ('' + phoneNumber).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return '(' + match[1] + ')' + match[2] + '-' + match[3]
    }
    return null
  }

  convertStringToBoolean(bool) {
    if (bool === 'true' || bool === true) {
      return true;
    } else {
      return false;
    }
  }

  validateForm() {
    this.setTouched();

    if (!this.state.firstName || !this.state.lastName) {
      alert('First and last name are required!');
      return;
    } else if (!this.state.streetAddress || !this.state.city || !this.state.state || !this.state.zipCode) {
      alert('Full address is required!');
      return;
    } else if (!this.state.phoneNumber) {
      alert('Phone number is required!');
      return;
    } else if (!this.state.cv) {
      alert('A CV or resume upload is required!');
      return;
    }

    this.createStudent();
  }

  createStudent() {
    const name = `${this.state.firstName} ${this.state.lastName}`;
    const address = {
      streetAddress: this.state.streetAddress,
      city: this.state.city,
      state: this.state.state,
      zipCode: this.state.zipCode,
    };
    const phoneNumber = this.formatPhoneNumber(this.state.phoneNumber);
    const hipaaCert = this.convertStringToBoolean(this.state.hipaaCert);

    const data = {
      email: this.props.email,
      id: this.props.id,
      name,
      loginMethod: this.props.loginMethod,
      address,
      phoneNumber,
      hipaaCert,
      cv: this.state.cv,
      subscribe: this.state.subscribe
    };

    if (this.props.active) {
      this.props.updateStudent(data, this.props.credentials);
    } else {
      this.props.createStudent(data, this.props.credentials);
    }
  }

  toggleChangeEmail(status) {
    this.setState({
      displayChangeEmail: status
    });
  }

  toggleChangePasswordModal(status) {
    this.setState({
      displayChangePasswordModal: status
    });
  }

  render() {
    return (
      <div className="form main">
        <h4 className="app-subtitle">
          Thanks for your interest in Shadowing.com!
            <br />
          Set up your profile to begin requesting shadowing with doctors in your area.
          </h4>
        {this.props.loginMethod === 'cognito' && <div className="form-element">
          <button className="primary" onClick={() => { this.toggleChangeEmail(true) }}>Change Email</button>
          <button className="secondary" onClick={() => { this.toggleChangePasswordModal(true) }}>Change Password</button>
        </div>}
        <div className="form-element">
          <label className="label">Email:</label>
          {!this.state.displayChangeEmail && <div className="form-input value">
            <input disabled value={this.props.email} />
          </div>}
          {this.state.displayChangeEmail &&
            <div className="form-input value">
              <input type="text" name="email" value={this.state.email} onChange={this.onInputChange} />
              <button className="icon small">
                <i className="fa fa-check" onClick={() => {
                  this.props.updateEmailAttribute(this.state.email);
                  this.toggleChangeEmail(false);
                }}></i>
              </button>
              <button className="icon small" onClick={() => { this.toggleChangeEmail(false) }}>
                <i className="fa fa-times"></i>
              </button>
            </div>}
        </div>
        <div className="form-element">
          <label className="label">Name</label>
          <div className="form-input value">
            <input type="text" name="firstName" value={this.state.firstName} onChange={this.onInputChange} placeholder="First Name" className={this.state.touched} required />
            <input type="text" name="lastName" value={this.state.lastName} onChange={this.onInputChange} placeholder="Last Name" className={this.state.touched} required />
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
            <input type="text" name="streetAddress" value={this.state.streetAddress} onChange={this.onInputChange} placeholder="Street Address" className={this.state.touched} required />
            <input type="text" name="city" value={this.state.city} onChange={this.onInputChange} placeholder="City" className={this.state.touched} required />
            <div className="select small">
              <select name="state" value={this.state.state} onChange={this.onInputChange} className={this.state.touched} required>
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
            <input type="text" name="zipCode" value={this.state.zipCode} onChange={this.onInputChange} placeholder="Zip Code" className={this.state.touched} required />
          </div>
        </div>
        <div className="form-element">
          <label className="label">Phone Number</label>
          <div className="form-input value">
            <input type="int" name="phoneNumber" value={this.state.phoneNumber} onChange={this.onInputChange} placeholder="Phone Number" className={this.state.touched} required />
          </div>
        </div>
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
            <input type="text" name="school" value={this.state.school} onChange={this.onInputChange} placeholder="School Name or N/A" className={this.state.touched} required />
          </div>
        </div>
        <div className="form-element">
          <label className="label">School Year</label>
          <div className="form-input value">
            <div className="select">
              <select name="schoolYear" value={this.state.schoolYear} onChange={this.onInputChange} className={this.state.touched} required>
                <option value=""></option>
                <option value="high-school">High School</option>
                <option value="freshman">College Freshman</option>
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
              <input type="radio" name="hipaaCert" value='true' id="yes" onChange={this.onInputChange} className={this.state.touched} checked={this.convertStringToBoolean(this.state.hipaaCert)} required />
              <span className="radiobox"></span>
              <label htmlFor="yes">Yes</label>
            </div>
            <div className="radio-form checkbox-container inline">
              <input type="radio" name="hipaaCert" value='false' id="no" onChange={this.onInputChange} className={this.state.touched} checked={!this.convertStringToBoolean(this.state.hipaaCert)} required />
              <span className="radiobox"></span>
              <label htmlFor="no">No</label>
            </div>
          </div>
        </div>
        <div className="form-element">
          <label name="cvUpload" className="label">CV/Resume Upload</label>
          <input name="cvUpload" type="file" accept="application/pdf" onChange={this.onCvInputChange} className={`${this.state.touched} value`} required />
        </div>
        <div className="form-element">
          <div className="form-input checkbox-container">
            <input type="checkbox" id="subscribe" name="subscribe" checked={this.state.subscribe} onChange={this.onCheckboxChange} className="checkbox" />
            <span className="checkbox"></span>
            <label htmlFor="subscribe">Sign Up For More Great Pre-med Content!</label>
          </div>
        </div>
        {!this.props.active && <input type="button" className="button primary" value="Complete Profile" onClick={this.validateForm} />}
        {this.props.active && <input type="submit" className="button primary" value="Save" onClick={this.validateForm} />}
        {this.state.displayChangePasswordModal && <ChangePasswordModal
          onInputChange={this.onPasswordInputChange}
          toggleChangePasswordModal={this.toggleChangePasswordModal}
          oldPassword={this.state.changePassword.oldPassword}
          newPassword={this.state.changePassword.newPassword}
          confirmNewPassword={this.state.changePassword.confirmNewPassword}
          changePassword={this.props.changePassword}
        />}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.authReducer,
  ...state.userReducer.student
});

const mapDispatchToProps = dispatch => ({
  updateEmailAttribute: (email) => dispatch(authActions.updateEmailAttribute(email)),
  changePassword: (oldPassword, newPassword) => dispatch(authActions.changePassword(oldPassword, newPassword)),
  createStudent: (data, credentials) => dispatch(userActions.createStudent(data, credentials)),
  updateStudent: (data, credentials) => dispatch(userActions.updateStudent(data, credentials)),
  getStudent: (id) => dispatch(userActions.getStudent(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPageStudent);