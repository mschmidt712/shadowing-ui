import React, { Component } from 'react';
import { connect } from 'react-redux';

import Step1 from './DoctorSignUpStep1';
import Step2 from './DoctorSignUpStep2';
import Step3 from './DoctorSignUpStep3';
import ChangePasswordModal from '../SignUpPageShared/ChangePasswordModal';
import daysOfTheWeek from '../../constants/daysOfTheWeek';
import medicalCareersWithSpecialties from '../../constants/medicalCareersWithSpecialties';
import './SignUpPageDoctor.css';

import * as userActions from '../../actions/userActions';
import * as authActions from '../../actions/authActions';

class SignUpPageDoctor extends Component {
  constructor(props) {
    super(props)

    let availability = daysOfTheWeek.reduce((obj,val) => (
      Object.assign({}, obj, {
        [val]: {
          checked: false,
          times: []
        }
      })
    ), {});

    this.state = {
      firstName: '',
      lastName: '',
      career: '',
      degree: '',
      email: this.props.email,
      badgePhoto: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: undefined,
      specialty: '',
      maxRequests: undefined,
      requestEmail: '',
      availability: availability,
      shiftLengthMin: undefined,
      shiftLengthMax: undefined,
      additionalComments: '',
      photoUpload: '',
      step: 1,
      stepOneTouched: 'clean',
      stepTwoTouched: 'clean',
      stepThreeTouched: 'clean',
      displayChangeEmail: false,
      displayChangePasswordModal: false,
      changePassword: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }
    }

    this.onInputChange = this.onInputChange.bind(this);
    this.onPasswordInputChange = this.onPasswordInputChange.bind(this);
    this.onPhotoInputChange = this.onPhotoInputChange.bind(this);
    this.setTouched = this.setTouched.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.previousStep = this.previousStep.bind(this);

    this.handleAvailabilityDays = this.handleAvailabilityDays.bind(this);
    this.handleAvailabilityTimes = this.handleAvailabilityTimes.bind(this);

    this.createDoctor = this.createDoctor.bind(this);

    this.toggleChangeEmail = this.toggleChangeEmail.bind(this);
    this.toggleChangePasswordModal = this.toggleChangePasswordModal.bind(this);
  }

  componentDidMount () {
    let availability = Object.assign({}, this.state.availability);
    if (this.props.scheduling) {
      availability = Object.keys(this.props.scheduling).reduce((obj, day) => {
        if (!this.props.scheduling[day]) {
          obj[day] = {
            checked: false,
            times: []
          };
        } else {
          obj[day] = {
            checked: true,
            times: this.props.scheduling[day]
          }
        }
        return obj;
      }, {})
    }

    if (this.props.name && this.props.address) {
      const [firstName, lastName] = this.props.name.split(' ');
      const newState = {
        firstName: firstName,
        lastName: lastName,
        career: this.props.career,
        degree: this.props.degree,
        email: this.props.email,
        badgePhoto: this.props.badgePhoto,
        streetAddress: this.props.address.streetAddress || '',
        city: this.props.address.city || '',
        state: this.props.address.state || '',
        zipCode: this.props.address.zipCode || undefined,
        specialty: this.props.specialty || '',
        maxRequests: this.props.maxRequests || undefined,
        requestEmail: this.props.requestEmail || '',
        availability,
        shiftLengthMin: this.props.shiftLength ? Number(this.props.shiftLength[0]) : undefined,
        shiftLengthMax: this.props.shiftLength ? this.props.shiftLength[1] : undefined,
        additionalComments: this.props.additionalComments || '',
        photoUpload: this.props.badgePhoto || '',
      }

      this.setState(newState);
    }
  }

  onInputChange(event) {
    const newState = {};
    newState[event.target.name] = event.target.value;
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

  onPhotoInputChange(event) {
    const newState = {};
    newState[event.target.name] = event.target.files[0];
    this.setState(newState);
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

  handleAvailabilityDays(event) {
    const newAvailability = Object.assign({}, this.state.availability);
    newAvailability[event.target.name].checked = event.target.checked;
    const availability = Object.assign({}, this.state.availability, newAvailability);

    this.setState({
      availability
    });
  }

  handleAvailabilityTimes(event) {
    const [day, param] = event.target.name.split('_');
    const newAvailability = Object.assign({}, this.state.availability);
    if (param === 'start') {
      newAvailability[day].times[0] = event.target.value;
    } else if (param === 'end') {
      newAvailability[day].times[1] = event.target.value;
    }
    const availability = Object.assign({}, this.state.availability, newAvailability);

    this.setState({
      availability
    });
  }

  createDoctor() {
    const name = `${this.state.firstName} ${this.state.lastName}`;
    let degree = this.state.career;
    if (this.state.career === 'MD/DO') {
      degree = this.state.degree;
    }
  
    let specialty = undefined;
    if (medicalCareersWithSpecialties.includes(this.state.career)) {
      specialty = this.state.specialty;
    }
    const address = {
      streetAddress: this.state.streetAddress,
      city: this.state.city,
      state: this.state.state,
      zipCode: this.state.zipCode,
    };
    const days = Object.keys(this.state.availability);
    const scheduling = days.reduce((accum, day) => {
      const dayObj = this.state.availability[day];
      if (dayObj.checked) {
        accum[day] = [...dayObj.times];
      } else {
        accum[day] = false;
      }
      return accum;
    }, {});
    const shiftLength = [this.state.shiftLengthMin, this.state.shiftLengthMax];

    const data = {
      email: this.props.email,
      id: this.props.id,
      name,
      career: this.state.career,
      degree: degree,
      address,
      specialty: specialty,
      maxRequests: this.state.maxRequests,
      requestEmail: this.state.requestEmail || this.props.email,
      scheduling,
      shiftLength,
      additionalComments: this.state.additionalComments || 'None',
      badgePhoto: this.state.photoUpload
    }

    if (this.props.name) {
      this.props.updateDoctor(data, this.props.credentials);
    } else {
      this.props.createDoctor(data, this.props.credentials);
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
      <div className="main">
        {this.state.step === 1 && <Step1
          firstName={this.state.firstName}
          lastName={this.state.lastName}
          career={this.state.career}
          degree={this.state.degree}
          email={this.state.email}
          streetAddress={this.state.streetAddress}
          city={this.state.city}
          state={this.state.state}
          zipCode={this.state.zipCode}
          specialty={this.state.specialty}
          loginMethod={this.props.loginMethod}
          onInputChange={this.onInputChange}
          nextStep={this.nextStep}
          touched={this.state.stepOneTouched}
          setTouched={this.setTouched}
          toggleChangePasswordModal={this.toggleChangePasswordModal}
          displayChangeEmail={this.state.displayChangeEmail}
          toggleChangeEmail={this.toggleChangeEmail}
          updateEmailAttribute={this.props.updateEmailAttribute}
        />}
        {this.state.step === 2 && <Step2
          maxRequests={this.state.maxRequests}
          requestEmail={this.state.requestEmail}
          availability={this.state.availability}
          shiftLengthMin={this.state.shiftLengthMin}
          shiftLengthMax={this.state.shiftLengthMax}
          additionalComments={this.state.additionalComments}
          onInputChange={this.onInputChange}
          handleAvailabilityDays={this.handleAvailabilityDays}
          handleAvailabilityTimes={this.handleAvailabilityTimes}
          nextStep={this.nextStep}
          previousStep={this.previousStep}
          touched={this.state.stepTwoTouched}
          setTouched={this.setTouched}
        />}
        {this.state.step === 3 && <Step3
          active={this.props.active}
          onPhotoInputChange={this.onPhotoInputChange}
          previousStep={this.previousStep}
          photoUpload={this.state.photoUpload}
          uploadPhoto={this.uploadPhoto}
          createDoctor={this.createDoctor}
          touched={this.state.stepThreeTouched}
          setTouched={this.setTouched}
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
  ...state.userReducer.doctor
});

const mapDispatchToProps = dispatch => ({
  updateEmailAttribute: (email) => dispatch(authActions.updateEmailAttribute(email)),
  changePassword: (oldPassword, newPassword) => dispatch(authActions.changePassword(oldPassword, newPassword)),
  createDoctor: (data, credentials) => dispatch(userActions.createDoctor(data, credentials)),
  updateDoctor: (data, credentials) => dispatch(userActions.updateDoctor(data, credentials))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPageDoctor);