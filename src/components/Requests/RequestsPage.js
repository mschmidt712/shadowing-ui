import React, { Component } from 'react';
import { connect } from 'react-redux';

import './RequestsPage.css';
import * as requestActions from '../../actions/requestActions';
import StudentRequest from './StudentRequest';
import DoctorRequest from './DoctorRequest';

class RequestsPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      displayResolveRequestModal: false,
      status: 'pending'
    }

    this.toggleResolveRequestModal = this.toggleResolveRequestModal.bind(this);
    this.setStatus = this.setStatus.bind(this);
  }

  componentDidMount() {
    if (!this.props.requests) {
      if (this.props.occupation === 'student') {
        this.props.getStudentRequests(this.props.id);
      }
      if (this.props.occupation === 'doctor') {
        this.props.getDoctorRequests(this.props.id);
      }
    }
  }

  toggleResolveRequestModal() {
    this.setState({
      displayResolveRequestModal: !this.state.displayResolveRequestModal
    });
  }

  setStatus(status) {
    this.setState({
      status
    });
  }

  render() {
    let requests = this.props.requests;
    if (requests && requests.length) {
      requests = requests.filter(request => {
        return request.status === this.state.status;
      });

      if (this.props.occupation === 'student') {
        requests = requests.map((request) => (
          <StudentRequest
            key={request.uuid}
            request={request}
            deleteRequest={this.props.deleteRequest}
          />
        ));
      } else {
        requests = requests.map(request => (
          <DoctorRequest
            key={request.uuid}
            request={request}
            doctorName={`Dr. ${this.props.name}, ${this.props.degree}`}
            changeRequestStatus={this.props.changeRequestStatus}
            displayResolveRequestModal={this.state.displayResolveRequestModal}
            toggleResolveRequestModal={this.toggleResolveRequestModal}
          />
        ));
      }

      if (requests.length === 0) {
        requests = <h3 className="app-subtitle">No {this.state.status} requests for shadowing found!</h3>;
      }
    } else {
      requests = <h3 className="app-subtitle">No requests for shadowing found!</h3>;
    }

    return (
      <div className="main">
        <h3 className="app-title">Shadowing Requests
          <div>
            <button className="primary" onClick={() => this.setStatus('pending')}>Pending Requests</button>
            <button className="secondary" onClick={() => this.setStatus('resolved')}>Resolved Requests</button>
          </div>
        </h3>
        {requests}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.authReducer,
  ...state.userReducer,
  ...state.requestReducer
});

const mapDispatchToProps = dispatch => ({
  getStudentRequests: (id, query) => dispatch(requestActions.getStudentRequests(id, query)),
  getDoctorRequests: (id, query) => dispatch(requestActions.getDoctorRequests(id, query)),
  deleteRequest: (requestId) => dispatch(requestActions.deleteRequest(requestId)),
  changeRequestStatus: (request, status) => dispatch(requestActions.changeRequestStatus(request, status))
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestsPage);
