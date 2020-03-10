import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import handleEnterClick from '../utilities/handleEnterClick';
import capitalizeWord from '../utilities/capitalizeWord';
import createProviderName from '../utilities/createProviderName';
import daysOfTheWeek from '../../constants/daysOfTheWeek';
import * as requestActions from '../../actions/requestActions';

class RequestModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      availability: daysOfTheWeek.reduce((obj, val) => (
        Object.assign({}, obj, {
          [val]: false
        })
      ), {}),
      additionalInfo: '',
      organizations: []
    }

    this.onInputChange = this.onInputChange.bind(this);
    this.onAvailabilityChange = this.onAvailabilityChange.bind(this);
    this.onOrganizationChange = this.onOrganizationChange.bind(this);
    this.validateRequest = this.validateRequest.bind(this);
    this.requestShadowing = this.requestShadowing.bind(this);
  }

  componentDidMount() {
    handleEnterClick('additionalInfo');
  }

  validateRequest() {
    const requestedDays = Object.keys(this.state.availability).filter(day => {
      return this.state.availability[day];
    });

    if (requestedDays.length === 0) {
      alert('Please select at least one day to request shadowing.');
      return;
    }

    if (this.props.selectedDoctor.organizations && this.props.selectedDoctor.organizations.length > 0 && this.state.organizations.length === 0) {
      alert('This provider only accepts learners affiliated with his or her organizations. If you are not affiliated with one of the below organizations, please request shadowing with another provider.');
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

  onOrganizationChange(e) {
    const organization = {
      label: e.target.name,
      value: e.target.id
    };

    this.setState({
      organizations: [...this.state.organizations, organization]
    });
  }

  requestShadowing() {
    let formattedAvailability = Object.assign({}, this.state.availability);
    Object.keys(this.state.availability).filter(day => {
      return this.state.availability[day];
    }).map(day => {
      return {
        day,
        scheduling: this.props.selectedDoctor.scheduling[day]
      };
    }).forEach(obj => {
      formattedAvailability[obj.day] = obj.scheduling
    });

    let requestData = {
      student: this.props.id,
      doctor: this.props.selectedDoctor.id,
      scheduling: formattedAvailability,
      organizations: this.state.organizations
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
    const availableDays = daysOfTheWeek.filter(day => {
      return this.props.selectedDoctor.scheduling[day];
    });
    const availability = availableDays.map((day, key) => {
      return <div className="form-input" key={key}>
        <div className="form-input checkbox-container inline">
          <input type="checkbox" id={`request-${day}`} name={day} checked={this.state.availability[day]} onChange={this.onAvailabilityChange} className="checkbox" />
          <span className="checkbox"></span>
          <label htmlFor={`request-${day}`}>{capitalizeWord(day)}</label>
        </div>
      </div>
    });
    let organizations = 'No affiliated organizations';
    if (this.props.selectedDoctor.organizations && this.props.selectedDoctor.organizations.length > 0) {      
      organizations = this.props.selectedDoctor.organizations.map((org) => {
        return <div className="form-input" key={org.value}>
          <div className="form-input checkbox-container">
            <input type="checkbox" id={org.value} name={org.label} onChange={this.onOrganizationChange} className="checkbox" />
            <span className="checkbox"></span>
            <label htmlFor={org.value}>{capitalizeWord(org.label)}</label>
          </div>
        </div>
      });
    }

    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => this.props.closeRequestModal()}>&times;</span>
          <div className="modal-text">
            <div className="form">
              <h1 className="app-title">Request Shadowing</h1>
              <h3 className="app-subtitle">{createProviderName(this.props.selectedDoctor)}</h3>
              <div className="data-item">
                <h5 className="app-subtitle">Name:</h5>
                {this.props.student.name}
              </div>
              <div className="data-item">
                <h5 className="app-subtitle">Email:</h5>
                {this.props.email}
              </div>
              <div className="data-item">
                <h5 className="app-subtitle">Phone Number:</h5>
                {this.props.student.phoneNumber}
              </div>
              <div className="data-item">
                <button className="secondary">
                  <Link to={`/user?id=${this.props.id}`} className="no-decoration secondary">Edit Contact Info in Your Profile</Link>
                </button>
              </div>
              <div>
                <h5 className="app-subtitle">Scheduling:</h5>
                <div className="data-item">{availability}</div>
              </div>
              <div>
                <h5 className="app-subtitle">
                  Organizations:
                  <i
                    data-for="organization-info"
                    data-tip="This provider only accepts shadowing from individuals associated with the following organizations. If you are a member of any of the below organizations, please select the organizations to request shadowing."
                    className="fas fa-info-circle icon">
                  </i>
                </h5>
                <ReactTooltip
                  id="organization-info"
                  className="tooltip"
                />
                <div className="data-item">{organizations}</div>
              </div>
              <div className="textarea-container">
                <h5 className="app-subtitle">Additional Info:</h5>
                <textarea
                  maxLength="250"
                  name="additionalInfo"
                  id="additionalInfo"
                  value={this.state.additionalInfo}
                  onChange={this.onInputChange}
                  placeholder={`Any additional information you would like ${this.props.selectedDoctor.name} to know when considering your request. 250 character limit.`}></textarea>
              </div>
              <button className="primary" id="submit" onClick={this.validateRequest}>Request</button>
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