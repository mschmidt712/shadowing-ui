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
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const headerRow = daysOfWeek.map(day => {
        return <th key={day}>{this.capitalizeWord(day)}</th>
      });
      const availabilityRow = daysOfWeek.map(day => {
        if (!this.props.doctor.scheduling[day]) {
          return <td key={day}>Unavailable</td>;
        }
        return <td key={day}>{this.convertTime(this.props.doctor.scheduling[day][0])} to {this.convertTime(this.props.doctor.scheduling[day][1])}</td>
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
              <i class="fas fa-map-marked-alt"></i>
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
          <h3 className="with-horizontal-line"></h3>
          <div className="data-item spaced">
            <div className="left-icon-container">
              <i class="far fa-clock"></i>
              <div className="data-item column nested">
                <h5 className="request-data-header">Shift Length: </h5>
                <span>{this.props.doctor.shiftLength[0]} hours to {this.props.doctor.shiftLength[1]} hours</span>
              </div>
            </div>
            <div className="left-icon-container">
              <i class="fas fa-map-marker-alt"></i>
              <div className="data-item column nested">
                <h5 className="request-data-header">Address: </h5>
                <span>{this.props.doctor.address.streetAddress}</span>
                <span>{this.props.doctor.address.city}, {this.props.doctor.address.state} {this.props.doctor.address.zipCode}</span>
              </div>
            </div>
          </div>
          <h3 className="with-horizontal-line"></h3>
          <div className="nested">
            <h5>Availability</h5>
            <table className="availability-table">
              <tr>{headerRow}</tr>
              <tr>{availabilityRow}</tr>
            </table>
          </div>
          <div className="data-item column nested">
            <h4 className="request-data-header">Additional Details: </h4>
            <span>{this.props.doctor.additionalComments}</span>
          </div>
          <button className="primary request-response-btn" onClick={() => { this.props.requestShadowing(this.props.doctor) }}>Request</button>
        </div>}
      </div>
    } else {
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
            <i class="fas fa-map-marked-alt"></i>
            <span>{distanceMiles} Miles</span>
          </div>
        </div>
        <button disabled className="primary request-response-btn">Login For More Details</button>
      </div>
    }
    return doctorComponent
  }
}
