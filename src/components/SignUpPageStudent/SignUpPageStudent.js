import React, { Component } from 'react';
import { connect } from 'react-redux';

import ChangePasswordModal from '../SignUpPageShared/ChangePasswordModal';
import StudentSignUpStep1 from '../SignUpPageStudent/StudentSignUpStep1';
import StudentSignUpStep2 from '../SignUpPageStudent/StudentSignUpStep2';
import * as authActions from '../../actions/authActions';
import * as userActions from '../../actions/userActions';

class SignUpPageStudent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      email: props.email,
      streetAddress: '',
      city: '',
      state: '',
      zipCode: undefined,
      phoneNumber: undefined,
      school: '',
      schoolYear: undefined,
      hipaaCert: false,
      cv: '',
      subscribe: true,
      step: 1,
      stepOneTouched: 'clean',
      stepTwoTouched: 'clean',
      displayChangeEmail: false,
      displayChangePasswordModal: false,
      changePassword: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }
    }

    let firstName, lastName;
    if (props.name) {
      [firstName, lastName] = props.name.split(' ');
      this.state = Object.assign({}, this.state, {
        firstName: firstName,
        lastName: lastName,
        email: props.email,
        streetAddress: props.address.streetAddress,
        city: props.address.city,
        state: props.address.state,
        zipCode: props.address.zipCode,
        phoneNumber: props.phoneNumber,
        school: props.school,
        schoolYear: props.schoolYear,
        hipaaCert: props.hipaaCert,
        cv: props.cv
      });
    }

    this.onInputChange = this.onInputChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.onPasswordInputChange = this.onPasswordInputChange.bind(this);
    this.onCvInputChange = this.onCvInputChange.bind(this);
    this.setTouched = this.setTouched.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.previousStep = this.previousStep.bind(this);

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
        school: this.props.school || '',
        schoolYear: this.props.schoolYear || undefined,
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

  setTouched(stepNumber) {
    const step = `${stepNumber}Touched`;
    this.setState({
      [step]: 'dirty'
    });
  }

  nextStep() {
    this.setState({
      step: this.state.step + 1
    });
  }

  previousStep() {
    this.setState({
      step: this.state.step - 1
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
      school: this.state.school,
      schoolYear: this.state.schoolYear,
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
      <div>
        {this.state.step === 1 && <StudentSignUpStep1
          email={this.state.email}
          firstName={this.state.firstName}
          lastName={this.state.lastName}
          streetAddress={this.state.streetAddress}
          city={this.state.city}
          state={this.state.state}
          zipCode={this.state.zipCode}
          phoneNumber={this.state.phoneNumber}
          loginMethod={this.props.loginMethod}
          stepOneTouched={this.state.stepOneTouched}
          setTouched={this.setTouched}
          nextStep={this.nextStep}
          onInputChange={this.onInputChange}
          displayChangeEmail={this.state.displayChangeEmail}
          toggleChangeEmail={this.toggleChangeEmail}
          toggleChangePasswordModal={this.toggleChangePasswordModal}
          updateEmailAttribute={this.props.updateEmailAttribute}
        />}
        {this.state.step === 2 && <StudentSignUpStep2
          school={this.state.school}
          schoolYear={this.state.schoolYear}
          hipaaCert={this.state.hipaaCert}
          cv={this.state.cv}
          subscribe={this.state.subscribe}
          active={this.props.active}
          stepTwoTouched={this.state.stepTwoTouched}
          setTouched={this.setTouched}
          previousStep={this.previousStep}
          onInputChange={this.onInputChange}
          onCvInputChange={this.onCvInputChange}
          onCheckboxChange={this.onCheckboxChange}
          createStudent={this.createStudent}
        />}
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