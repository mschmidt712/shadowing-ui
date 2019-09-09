import React, { Component } from 'react'
import moment from 'moment';

export default class SearchDoctorComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false
    }
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  capitalizeWord(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  convertTime(time) {
    const minutes = time.split(':')[1];
    if (minutes === '00') {
      return moment(time, 'HH:mm:ss').format('h A');
    } else {
      return moment(time, 'HH:mm:ss').format('h:mm A');
    }
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
    if (this.props.isLoggedIn && acceptingRequests) {
      const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const availability = daysOfWeek.map(day => {
        if (!this.props.doctor.scheduling[day]) {
          return <table key={day}>
            <tbody>
              <tr><th>{this.capitalizeWord(day)}</th></tr>
              <tr><td>N/A</td></tr>
            </tbody>
          </table>
        }
        return <table key={day}>
          <tbody>
            <tr><th>{this.capitalizeWord(day)}</th></tr>
            <tr><td>{this.convertTime(this.props.doctor.scheduling[day][0])} to {this.convertTime(this.props.doctor.scheduling[day][1])}</td></tr>
          </tbody>
        </table>
      });

      doctorComponent = <div className="request box-shadow">
        <div className="component-header">
          <div className="component-header-details">
            <i className="fa fa-user-md"></i>
            <div>
              <h3>Dr. {this.props.doctor.name}, {this.props.doctor.degree}</h3>
              <h5 className="app-subtitle">{this.props.doctor.specialty}</h5>
            </div>
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
                <h5 className="request-data-header">Address: </h5>
                <span>{this.props.doctor.address.streetAddress} </span>
                <span>{this.props.doctor.address.city}, {this.props.doctor.address.state} {this.props.doctor.address.zipCode}</span>
              </div>
            </div>
          </div>
          <p className="with-horizontal-line"></p>
          <div className="nested">
            <h5>Availability</h5>
            <div className="availability-table">
              {availability}
            </div>
          </div>
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
            <div>
              <h3>{this.props.doctor.specialty} Physician</h3>
              <h5 className="app-subtitle">{this.props.doctor.specialty}</h5>
            </div>
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
              <h3>{this.props.doctor.specialty} Physician</h3>
              <h5 className="app-subtitle">{this.props.doctor.specialty}</h5>
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
