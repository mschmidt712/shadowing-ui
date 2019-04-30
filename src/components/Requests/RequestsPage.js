import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import './RequestsPage.css';
import * as requestActions from '../../actions/requestActions';

class RequestsPage extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {
    if (this.props.requests) {
      if (this.props.occupation === 'student') {
        this.props.getStudentRequests(this.props.id);
      }
    }
  }

  render() {
    let requests = <div></div>;
    if (this.props.requests) {
      requests = this.props.requests.map((request, index) => {
        const availability = Object.keys(request.scheduling).filter(day => {
          return request.scheduling[day];
        }).map((day, index) => {
          const [start, end] = request.scheduling[day];
          return <div key={index}>{capitalizeWord(day)}: {convertTime(start)} to {convertTime(end)}</div>
        });
        return <div key={index} className="request">
          <h3>Dr. {request.doctor.name}, {request.doctor.degree}</h3>
          <h4>{request.doctor.specialty}</h4>
          <p>Requested {moment(request.createdDate).format('MM/DD/YYYY')}</p>
          <h5>Availability: {availability}</h5>
        </div>
      });
    }

    return (
      <div className="main">
        <h2>Shadowing Requests</h2>
        {requests}
      </div>
    )
  }
}

function capitalizeWord(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function convertTime(time) {
  return moment(time, 'HH:mm:ss').format('h:mm A');
}

const mapStateToProps = state => ({
  ...state.authReducer,
  ...state.requestReducer
});

const mapDispatchToProps = dispatch => ({
  getStudentRequests: (id, query) => dispatch(requestActions.getStudentRequests(id, query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestsPage);
