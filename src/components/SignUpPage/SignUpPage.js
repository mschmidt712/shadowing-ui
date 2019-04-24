import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as userActions from '../../actions/userActions';

class SignUpPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: undefined,
      phoneNumber: undefined,
      hipaaCert: false
    }

    this.onInputChange = this.onInputChange.bind(this);
    this.createStudent = this.createStudent.bind(this);
  }

  onInputChange(event) {
    const newState = {};
    newState[event.target.name] = event.target.value;

    this.setState(newState);
  }

  formatPhoneNumber(phoneNumber) {
    var cleaned = ('' + phoneNumber).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return '(' + match[1] + ')' + match[2] + '-' + match[3]
    }
    return null
  }

  convertToBoolean(bool) {
    if (bool === 'true') {
      return true;
    } else if (bool === 'false') {
      return false;
    }
    return;
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
    const hipaaCert = this.convertToBoolean(this.state.hipaaCert);

    const data = {
      email: this.props.email,
      id: this.props.id,
      name,
      loginMethod: this.props.loginMethod,
      address,
      phoneNumber,
      hipaaCert,
      active: true
    }

    this.props.createStudent({ student: data });
  }

  render() {
    return (
      <div>
        <form className="form">
          <h4 className="app-subtitle">
            Thanks for your interest in Shadowing.com!
            <br />
            Set up your profile to begin requesting shadowing with doctors in your area.
          </h4>
          <div className="form-element">
            <label>Email</label>
            <span className="form-input">{this.props.email}</span>
          </div>
          <div className="form-element">
            <button className="primary">Change Email</button>
            <button className="secondary">Change Password</button>
          </div>
          <div className="form-element">
            <label>Name</label>
            <div className="form-input">
              <input type="text" name="firstName" value={this.state.firstName} onChange={this.onInputChange} placeholder="First Name" required />
              <input type="text" name="lastName" value={this.state.lastName} onChange={this.onInputChange} placeholder="Last Name" required />
            </div>
          </div>
          <div className="form-element">
            <label>Address</label>
            <div className="form-input">
              <input type="text" name="streetAddress" value={this.state.streetAddress} onChange={this.onInputChange} placeholder="Street Address" required />
              <input type="text" name="city" value={this.state.city} onChange={this.onInputChange} placeholder="City" required />
              <select name="state" value={this.state.state} onChange={this.onInputChange} required>
                <option value="none"></option>
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
              <input type="text" name="zipCode" value={this.state.zipCode} onChange={this.onInputChange} placeholder="Zip Code" required />
            </div>
          </div>
          <div className="form-element">
            <label>Phone Number</label>
            <input className="form-input" type="int" name="phoneNumber" value={this.state.phoneNumber} onChange={this.onInputChange} placeholder="Phone Number" required />
          </div>
          <div className="form-element">
            <label>Are You HIPAA Certified?</label>
            <div className="form-input">
              <div className="radio-form">
                <input type="radio" name="hipaaCert" value={true} id="yes" onChange={this.onInputChange} required />
                <label htmlFor="yes">Yes</label>
              </div>
              <div className="radio-form">
                <input type="radio" name="hipaaCert" value={false} id="no" onChange={this.onInputChange} required />
                <label htmlFor="no">No</label>
              </div>
            </div>
          </div>
          {!this.props.active && <input type="button" className="button primary" value="Complete Profile" onClick={() => this.createStudent()} />}
          {this.props.active && <input type="submit" className="button primary" value="Save" />}
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.authReducer,
  ...state.userReducer
});

const mapDispatchToProps = dispatch => ({
  createStudent: (data) => dispatch(userActions.createStudent(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage);