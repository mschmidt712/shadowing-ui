import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as requestActions from '../../actions/requestActions';

class RequestModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      availability: {
        'sunday': false,
        'monday': false,
        'tuesday': false,
        'wednesday': false,
        'thursday': false,
        'friday': false,
        'saturday': false
      }
    }

    this.onAvailabilityChange = this.onAvailabilityChange.bind(this);
    this.validateRequest = this.validateRequest.bind(this);
    this.requestShadowing = this.requestShadowing.bind(this);
  }

  validateRequest() {
    const requestedDays = Object.keys(this.state.availability).filter(day => {
      return this.state.availability[day];
    });

    if (requestedDays.length === 0) {
      alert('Please select at least one day to request shadowing.');
      return;
    }

    this.requestShadowing();
  }

  onAvailabilityChange(e) {
    const day = e.target.name;
    const newAvailability = Object.assign({}, this.state.availability);
    newAvailability[day] = e.target.checked;

    this.setState({
      availability: newAvailability
    });
  }

  capitalizeWord(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  requestShadowing() {
    let formattedAvailability = Object.assign({}, this.state.availability);
    Object.keys(this.state.availability).filter(day => {
      return this.state.availability[day];
    }).map(day => {
      return {
        day,
        scheduling: this.props.doctor.scheduling[day]
      };
    }).forEach(obj => {
      formattedAvailability[obj.day] = obj.scheduling
    });

    const requestData = {
      student: this.props.id,
      doctor: this.props.doctor.id,
      scheduling: formattedAvailability
    }

    this.props.createRequest(requestData);
    this.props.closeModal();
  }

  render() {
    const daysOfTheWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const availabilityDays = daysOfTheWeek.filter(day => {
      return this.props.doctor.scheduling[day];
    });
    const availability = availabilityDays.map((day, key) => {
      return <div className="form-input" key={key}>
        <div className="form-input availability">
          <input type="checkbox" id={day} name={day} checked={this.state.availability[day]} onChange={this.onAvailabilityChange} className="checkbox" />
          <label htmlFor={day}>{this.capitalizeWord(day)}</label>
        </div>
      </div>
    });

    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => this.props.closeModal()}>&times;</span>
          <div className="modal-text">
            <div className="form">
              <h1 className="app-title">Request Shadowing</h1>
              <h3 className="app-subtitle">Dr. {this.props.doctor.name}, {this.props.doctor.degree}</h3>
              <div className="data-item">
                <h5 className="app-subtitle">Name:</h5>
                {this.props.name}
              </div>
              <div className="data-item">
                <h5 className="app-subtitle">Email:</h5>
                {this.props.email}
              </div>
              <div className="data-item">
                <h5 className="app-subtitle">Phone Number:</h5>
                {this.props.phoneNumber}
              </div>
              <div className="data-item">
                <h5 className="app-subtitle">Scheduling:</h5>
                {availability}
              </div>
              <button className="primary" onClick={this.validateRequest}>Request</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.authReducer,
  ...state.userReducer
});

const mapDispatchToProps = dispatch => ({
  createRequest: (data) => dispatch(requestActions.createRequest(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestModal);