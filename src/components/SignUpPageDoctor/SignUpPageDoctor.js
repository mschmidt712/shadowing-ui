import React, { Component } from 'react';
import { connect } from 'react-redux';

import Step1 from './DoctorSignUpStep1';
import Step2 from './DoctorSignUpStep2';
import Step3 from './DoctorSignUpStep3';
import './SignUpPageDoctor.css';
import * as userActions from '../../actions/userActions';

class SignUpPageDoctor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      degree: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: undefined,
      specialty: '',
      maxShiftsPerWeek: undefined,
      availability: {
        sunday: {
          checked: false,
          times: []
        },
        monday: {
          checked: false,
          times: []
        },
        tuesday: {
          checked: false,
          times: []
        },
        wednesday: {
          checked: false,
          times: []
        },
        thursday: {
          checked: false,
          times: []
        },
        friday: {
          checked: false,
          times: []
        },
        saturday: {
          checked: false,
          times: []
        }
      },
      shiftLengthMin: undefined,
      shiftLengthMax: undefined,
      additionalComments: '',
      photoUpload: '',
      step: 1,
      stepOneTouched: 'clean',
      stepTwoTouched: 'clean',
      stepThreeTouched: 'clean'
    }

    this.onInputChange = this.onInputChange.bind(this);
    this.onPhotoInputChange = this.onPhotoInputChange.bind(this);
    this.setTouched = this.setTouched.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.previousStep = this.previousStep.bind(this);

    this.handleAvailabilityDays = this.handleAvailabilityDays.bind(this);
    this.handleAvailabilityTimes = this.handleAvailabilityTimes.bind(this);

    this.createDoctor = this.createDoctor.bind(this);
  }

  onInputChange(event) {
    const newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
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
      degree: this.state.degree,
      address,
      specialty: this.state.specialty,
      maxShiftsPerWeek: this.state.maxShiftsPerWeek,
      scheduling,
      shiftLength,
      additionalComments: this.state.additionalComments || 'None',
      badgePhoto: this.state.photoUpload,
      approved: false
    }

    if (this.props.active) {
      this.props.updateDoctor(data, this.props.credentials);
    } else {
      this.props.createDoctor(data, this.props.credentials);
    }
  }

  render() {
    return (
      <div>
        {this.state.step === 1 && <Step1
          firstName={this.state.firstName}
          lastName={this.state.lastName}
          degree={this.state.degree}
          email={this.props.email}
          streetAddress={this.state.streetAddress}
          city={this.state.city}
          state={this.state.state}
          zipCode={this.state.zipCode}
          specialty={this.state.specialty}
          onInputChange={this.onInputChange}
          nextStep={this.nextStep}
          touched={this.state.stepOneTouched}
          setTouched={this.setTouched}
        />}
        {this.state.step === 2 && <Step2
          maxShiftsPerWeek={this.state.maxShiftsPerWeek}
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
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.authReducer,
  ...state.userReducer
});

const mapDispatchToProps = dispatch => ({
  createDoctor: (data, credentials) => dispatch(userActions.createDoctor(data, credentials)),
  updateDoctor: (data, credentials) => dispatch(userActions.updateDoctor(data, credentials)),
  getStudent: (email) => dispatch(userActions.getStudent(email))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPageDoctor);