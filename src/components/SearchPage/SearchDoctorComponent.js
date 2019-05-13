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
    return moment(time, 'HH:mm:ss').format('h:mm A');
  }

  toggleExpanded() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const distanceMeters = this.props.doctor.distance.distance.value;
    const distanceMiles = Math.round(distanceMeters / 1609.344);

    let doctorComponent;
    if (this.props.isLoggedIn) {
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      const availability = daysOfWeek.map(day => {
        if (!this.props.doctor.scheduling[day]) {
          return <div className="data-item column nested" key={day}>
            <h5>{this.capitalizeWord(day)}</h5>
            <span>Unavailable</span>
          </div>
        }
        return <div className="data-item column nested" key={day}>
          <h5>{this.capitalizeWord(day)}</h5>
          <span>{this.convertTime(this.props.doctor.scheduling[day][0])} to {this.convertTime(this.props.doctor.scheduling[day][1])}</span>
        </div>
      });

      doctorComponent = <div className="request">
        <div className="component-header">
          <div className="component-header-details">
            <h3>Dr. {this.props.doctor.name}, {this.props.doctor.degree}</h3>
            <span>{this.props.doctor.specialty}</span>
          </div>
          <p className="component-header-right">
            {distanceMiles} Miles
            {!this.state.expanded && <button className="icon small" onClick={this.toggleExpanded}>
              <i className="fas fa-angle-double-down"></i>
            </button>}
            {this.state.expanded && <button className="icon small" onClick={this.toggleExpanded}>
              <i className="fas fa-angle-double-up"></i>
            </button>}
          </p>
        </div>
        {this.state.expanded && <div>
          <div className="data-item">
            {availability}
          </div>
          <div className="data-item">
            <div className="data-item column nested">
              <h5 className="request-data-header">Shift Length: </h5>
              <span>{this.props.doctor.shiftLength[0]} hours to {this.props.doctor.shiftLength[1]} hours</span>
            </div>
            <div className="data-item column nested">
              <h5 className="request-data-header">Address: </h5>
              <span>{this.props.doctor.address.streetAddress}</span>
              <span>{this.props.doctor.address.city}, {this.props.doctor.address.state} {this.props.doctor.address.zipCode}</span>
            </div>
          </div>
          <div className="data-item column nested">
            <h5 className="request-data-header">Additional Details: </h5>
            <span>{this.props.doctor.additionalComments}</span>
          </div>
          <button className="primary request-response-btn" onClick={() => { this.props.requestShadowing(this.props.doctor) }}>Request</button>
        </div>}
      </div>
    } else {
      doctorComponent = <div className="request">
        <div className="component-header">
          <div className="component-header-details">
            <h3>{this.props.doctor.specialty} Physician</h3>
            <span>{this.props.doctor.specialty}</span>
          </div>
          <p className="component-header-right">{distanceMiles} Miles</p>
        </div>
        <button disabled className="primary request-response-btn">Login For More Details</button>
      </div>
    }
    return doctorComponent
  }
}
