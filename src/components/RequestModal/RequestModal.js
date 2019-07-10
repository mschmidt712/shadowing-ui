import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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
      },
      additionalInfo: ''
    }

    this.onInputChange = this.onInputChange.bind(this);
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

  onInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
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

    let requestData = {
      student: this.props.id,
      doctor: this.props.doctor.id,
      scheduling: formattedAvailability
    }

    if (this.state.additionalInfo) {
      requestData = Object.assign({}, requestData, {
        additionalInfo: this.state.additionalInfo
      });
    }

    this.props.createRequest(requestData);
    this.props.closeRequestModal();
  }

  render() {
    const daysOfTheWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const availableDays = daysOfTheWeek.filter(day => {
      return this.props.doctor.scheduling[day];
    });
    const availability = availableDays.map((day, key) => {
      return <div className="form-input" key={key}>
        <div className="form-input checkbox-container inline">
          <input type="checkbox" id={`request-${day}`} name={day} checked={this.state.availability[day]} onChange={this.onAvailabilityChange} className="checkbox" />
          <span className="checkbox"></span>
          <label htmlFor={`request-${day}`}>{this.capitalizeWord(day)}</label>
        </div>
      </div>
    });

    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => this.props.closeRequestModal()}>&times;</span>
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
                <button className="secondary">
                  <Link to={`/user?id=${this.props.id}`} className="no-decoration secondary">Edit Contact Info in Your Profile</Link>
                </button>
              </div>
              <div className="data-item">
                <h5 className="app-subtitle">Scheduling:</h5>
                {availability}
              </div>
              <div className="textarea-container">
                <h5 className="app-subtitle">Additional Info:</h5>
                <textarea
                  maxLength="250"
                  name="additionalInfo"
                  value={this.state.additionalInfo}
                  onChange={this.onInputChange}
                  placeholder={`Any additional information you would like Dr. ${this.props.doctor.name} to know when considering your request. 250 character limit.`}></textarea>
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