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
      displayDeleteRequestModal: false
    }

    this.toggleDeleteRequestModal = this.toggleDeleteRequestModal.bind(this);
  }

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

  toggleDeleteRequestModal() {
    this.setState({
      displayDeleteRequestModal: !this.state.displayDeleteRequestModal
    });
  }

  render() {
    let requests = <h3 className="app-subtitle">No requests for shadowing found!</h3>;
    if (this.props.requests && this.props.requests.length) {
      if (this.props.occupation === 'student') {
        requests = this.props.requests.map((request) => (
          <StudentRequest key={request.uuid} request={request} deleteRequest={this.props.deleteRequest} />
        ));
      } else if (this.props.occupation === 'doctor') {
        requests = this.props.requests.map((request) => (
          <DoctorRequest
            key={request.uuid}
            request={request}
            doctorName={`Dr. ${this.props.name}, ${this.props.degree}`}
            deleteRequest={this.props.deleteRequest}
            displayDeleteRequestModal={this.state.displayDeleteRequestModal}
            toggleDeleteRequestModal={this.toggleDeleteRequestModal}
          />
        ));
      }
    }

    return (
      <div className="main">
        <h3 className="app-title">Shadowing Requests</h3>
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
  deleteRequest: (requestId) => dispatch(requestActions.deleteRequest(requestId))
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestsPage);
