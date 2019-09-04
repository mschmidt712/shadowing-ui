import React from 'react';
import moment from 'moment';

import ResolveRequestModal from './ResolveRequestModal';

class DoctorRequest extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      status: undefined,
      hipaaCert: 'No',
      availabilityText: [],
      availability: [],
      acceptRequestBody: '',
      denyRequestBody: ''
    }

    this.setStatus = this.setStatus.bind(this);
  }

  componentDidMount() {
    if (this.props.request) {
      const request = this.props.request;

      let availabilityText = [];
      const availability = Object.keys(request.scheduling).filter(day => {
        return request.scheduling[day];
      }).map((day, availIndex) => {
        const [start, end] = request.scheduling[day];
        availabilityText.push(`${this.capitalizeWord(day)}: ${this.convertTime(start)} to ${this.convertTime(end)}`);
        return <div key={availIndex}>{this.capitalizeWord(day)}: {this.convertTime(start)} to {this.convertTime(end)}</div>
      });
      availabilityText = availabilityText.join(' and ');

      let hipaaCert = 'No';
      if (request.student.hipaaCert) {
        hipaaCert = 'Yes';
      }

      const acceptRequestBody = `Dear ${request.student.name},
      %0A%0A I am happy to inform you that your shadowing request has been approved! Let's set up a time to for shadowing based on the proposed availability of ${availabilityText}. I look forward to meeting you and helping you on your path to becoming a physician!
      %0A%0A Thanks,
      %0A ${this.props.doctorName}`;
      const denyRequestBody = `Dear ${request.student.name},
      %0A%0A I am sorry to inform you that I will not be able to accomidate your shadowing request due to the number of requests received and a busy work schedule. I wish you the best in your future endevours.
      %0A%0A Thanks,
      %0A ${this.props.doctorName}`;

      this.setState({
        status: request.status,
        hipaaCert,
        availabilityText,
        availability,
        school: request.student.school,
        schoolYear: request.student.schoolYear,
        acceptRequestBody,
        denyRequestBody
      });
    }
  }

  setStatus(status) {
    this.setState({
      status
    });
  }

  changeRequestStatus(request, status) {
    return Object.assign({}, request, {
      status
    });
  }

  formatSchoolYear(str) {
    if (!str) {
      return;
    }

    const arr = str.split('-');
    return arr.map(string => {
      return this.capitalizeWord(string);
    }).reduce((str, val) => {
      return `${str} ${val}`
    }, '').trim();
  }

  capitalizeWord(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  convertTime(time) {
    return moment(time, 'HH:mm:ss').format('h:mm A');
  }

  render() {
    const request = this.props.request;

    return (
      <div className="request box-shadow">
        <div className="component-header">
          <div className="component-header-details">
            <i className="fa fa-user-graduate"></i>
            <div>
              <h3 className="request-data-header">{request.student.name}</h3>
              <h5 className="app-subtitle">{request.student.email}</h5>
              <h5 className="app-subtitle">{request.student.phoneNumber}</h5>
              <a href={request.student.cv} className="secondary" download><h5>Download CV/Resume</h5></a>
            </div>
          </div>
          <p className="component-header-right">{moment(request.createdDate).format('MM/DD/YYYY')}</p>
        </div>
        <p className="with-horizontal-line"></p>
        <div>
          <div className="data-item column nested">
            <h5 className="request-data-header">School Information: </h5>
            {this.state.school} - {this.formatSchoolYear(this.state.schoolYear)}
          </div>
          <div className="data-item column nested">
            <h5 className="request-data-header">HIPAA Certified: </h5>
            {this.state.hipaaCert}
          </div>
          <div className="data-item column nested">
            <h5 className="request-data-header">Availability:</h5>
            {this.state.availability}
          </div>
          <div className="data-item column nested">
            <h5 className="request-data-header">Additional Info:</h5>
            {request.additionalInfo && <span>{request.additionalInfo}</span>}
            {!request.additionalInfo && <span>No additional info given.</span>}
          </div>
          <div className="data-item request-response-btn">
            {request.status === 'pending' && <div>
              <button className="button primary">
                <a href={`mailto:${request.student.email}?subject=Shadowing Request Accepted&body=${this.state.acceptRequestBody}`} className="no-decoration accept-request-btn" onClick={() => { this.props.toggleResolveRequestModal(); this.setStatus('approved'); }}>Accept Request</a>
              </button>
              <button className="button secondary">
                <a href={`mailto:${request.student.email}?subject=Shadowing Request Denied&body=${this.state.denyRequestBody}`} className="no-decoration deny-request-btn" onClick={() => { this.props.toggleResolveRequestModal(); this.setStatus('denied'); }}>Deny Request</a>
              </button>
            </div>}
            {request.status !== 'pending' && <div className="data-item nested">
              <h5>Status:</h5>
              <span className={request.status}>{this.capitalizeWord(request.status)}</span>
            </div>}
          </div>
          {this.props.displayResolveRequestModal &&
            <ResolveRequestModal changeRequestStatus={this.props.changeRequestStatus} toggleResolveRequestModal={this.props.toggleResolveRequestModal} request={request} status={this.state.status} />}
        </div>
      </div>
    )
  }
}

export default DoctorRequest;