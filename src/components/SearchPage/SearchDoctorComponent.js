import React, { Component } from 'react'

import capitalizeWord from '../utilities/capitalizeWord';
import convertTime from '../utilities/convertTime';
import findGender from '../utilities/findGender';
import medicalCareersWithSpecialties from '../../constants/medicalCareersWithSpecialties';
import daysOfTheWeek from '../../constants/daysOfTheWeek';

export default class SearchDoctorComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false
    }
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  getAcceptingRequests(doctor) {
    return doctor.weeklyRequests < doctor.maxRequests;
  }

  toggleExpanded() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    if (!this.props.doctor) {
      return <div></div>;
    }

    const distanceMeters = this.props.doctor.distance.distance.value;
    const distanceMiles = Math.round(distanceMeters / 1609.344);

    const acceptingRequests = this.getAcceptingRequests(this.props.doctor);

    let doctorComponent;
    const professionalName = <div>
      {this.props.doctor.career === 'MD/DO' && <h3>{this.props.doctor.specialty} Physician, {this.props.doctor.degree}</h3>}
      {['PA', 'NP', 'RN'].includes(this.props.doctor.career) && <h3>{this.props.doctor.specialty} {this.props.doctor.career}</h3>}
      {!medicalCareersWithSpecialties.includes(this.props.doctor.career) && <h3>{this.props.doctor.career}</h3>}
      <h5 className="app-subtitle">{findGender(this.props.doctor.gender)}</h5>
    </div>;

    if (this.props.isLoggedIn && acceptingRequests) {
      const availability = daysOfTheWeek.map(day => {
        if (!this.props.doctor.scheduling[day]) {
          return <table key={day}>
            <tbody>
              <tr><th>{capitalizeWord(day)}</th></tr>
              <tr><td>N/A</td></tr>
            </tbody>
          </table>
        }
        return <table key={day}>
          <tbody>
            <tr><th>{capitalizeWord(day)}</th></tr>
            <tr><td>{convertTime(this.props.doctor.scheduling[day][0])} to {convertTime(this.props.doctor.scheduling[day][1])}</td></tr>
          </tbody>
        </table>
      });

      doctorComponent = <div className="request box-shadow">
        <div className="component-header">
          <div className="component-header-details">
            <i className="fa fa-user-md"></i>
            {professionalName}
          </div>
          <div className="dropdown-container">
            <div className="component-header-right">
              <i className="fas fa-map-marked-alt"></i>
              <span>{distanceMiles} Miles</span>
            </div>
            <div className="dropdown">
              {!this.state.expanded && <button className="icon small" onClick={this.toggleExpanded}>
                <i className="fas fa-angle-double-down"></i>
              </button>}
              {this.state.expanded && <button className="icon small" onClick={this.toggleExpanded}>
                <i className="fas fa-angle-double-up"></i>
              </button>}
            </div>
          </div>
        </div>
        {this.state.expanded && <div>
          <div className="nested">
            <h5>Availability</h5>
            <div className="availability-table">
              {availability}
            </div>
          </div>
          <p className="with-horizontal-line"></p>
          <div className="data-item spaced">
            <div className="left-icon-container">
              <i className="far fa-clock"></i>
              <div className="data-item column nested">
                <h5 className="request-data-header">Shift Length: </h5>
                <span>{this.props.doctor.shiftLength[0]} hours to {this.props.doctor.shiftLength[1]} hours</span>
              </div>
            </div>
            <div className="left-icon-container">
              <i className="fas fa-map-marker-alt"></i>
              <div className="data-item column nested">
                <h5 className="request-data-header">Location: </h5>
                <span>{this.props.doctor.address.city}, {this.props.doctor.address.state} {this.props.doctor.address.zipCode}</span>
              </div>
            </div>
          </div>
          <p className="with-horizontal-line"></p>
          <div className="data-item column nested">
            <h4 className="request-data-header">Additional Details: </h4>
            <span>{this.props.doctor.additionalComments}</span>
          </div>
          <button
            className="primary request-response-btn"
            onClick={() => { this.props.requestShadowing(this.props.doctor) }}
            disabled={this.props.occupation === 'doctor'}>
            Request
          </button>
        </div>}
      </div>
    } else if (this.props.isLoggedIn && !acceptingRequests) {
      doctorComponent = <div className="request box-shadow ">
        <div className="component-header">
          <div className="component-header-details">
            <i className="fa fa-user-md"></i>
            {professionalName}
          </div>
          <div className="component-header-right">
            <i className="fas fa-map-marked-alt"></i>
            <span>{distanceMiles} Miles</span>
          </div>
        </div>
        <button disabled className="primary request-response-btn">This Doctor is Not Currently Accepting Requests</button>
      </div>
    } else if (!this.props.isLoggedIn) {
      doctorComponent = <div className="request box-shadow ">
        <div className="component-header">
          <div className="component-header-details">
            <i className="fa fa-user-md"></i>
            <div>
              {professionalName}
            </div>
          </div>
          <div className="component-header-right">
            <i className="fas fa-map-marked-alt"></i>
            <span>{distanceMiles} Miles</span>
          </div>
        </div>
        <button disabled className="primary request-response-btn">Login For More Details</button>
      </div>
    }
    return doctorComponent
  }
}