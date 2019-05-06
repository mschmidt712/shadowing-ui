import React, { Component } from 'react';
import { connect } from 'react-redux';

import './RequestsPage.css';
import * as requestActions from '../../actions/requestActions';
import StudentRequest from './StudentRequest';
import DoctorRequest from './DoctorRequest';

class RequestsPage extends Component {
  componentDidMount() {
    if (this.props.requests) {
      if (this.props.occupation === 'student') {
        this.props.getStudentRequests(this.props.id);
      }
      if (this.props.occupation === 'doctor') {
        this.props.getDoctorRequests(this.props.id);
      }
    }
  }

  render() {
    let requests = <div>No requests for shadowing found!</div>;
    if (this.props.requests && this.props.requests.length) {
      if (this.props.occupation === 'student') {
        requests = this.props.requests.map((request, index) => (
          <StudentRequest key={request.uuid} request={request} deleteRequest={this.props.deleteRequest} />
        ));
      } else if (this.props.occupation === 'doctor') {
        requests = this.props.requests.map((request, index) => (
          <DoctorRequest request={request} index={index} />
        ));
      }
    }

    return (
      <div className="main">
        <h2>Shadowing Requests</h2>
        {requests}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.authReducer,
  ...state.requestReducer
});

const mapDispatchToProps = dispatch => ({
  getStudentRequests: (id, query) => dispatch(requestActions.getStudentRequests(id, query)),
  getDoctorRequests: (id, query) => dispatch(requestActions.getDoctorRequests(id, query)),
  deleteRequest: (requestId) => dispatch(requestActions.deleteRequest(requestId))
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestsPage);
