import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as userActions from '../../actions/userActions';
import * as adminActions from '../../actions/adminActions';
import './AdminPage.css';

class AdminPage extends Component {

  componentDidMount() {
    this.props.getDoctorsForApproval();
    this.props.getAdminData();
  }

  render() {
    const doctors = this.props.doctors.map(doctor => {
      return <div className="request box-shadow" key={doctor.id}>
        <div className="component-header">
          <div className="component-header-details">
            <i className="fa fa-user-md"></i>
            <div>
              <h3 className="request-data-header">{doctor.name}, {doctor.degree}</h3>
              <h5 className="app-subtitle">{doctor.specialty}</h5>
              <h5 className="app-subtitle">{doctor.address.streetAddress}, {doctor.address.city}, {doctor.address.state} {doctor.address.zipCode}</h5>
            </div>
          </div>
          <p className="component-header-right">Account Opened: {new Date(doctor.createdDate).toDateString()}</p>
        </div>
        <img className="badge-image" src={doctor.badgePhoto} alt="Physician Badge" />
        <div className="center-block">
          <button className="button primary" onClick={() => this.props.approveDoctor(doctor)}>
            Approve
          </button>
          <button className="button secondary">
            Decline
          </button>
        </div>
      </div>
    });
    return (
      <div className="main">
        <h1 className="app-title">Admin Dashboard</h1>
        <nav>
          <button className="secondary"><Link to="/admin/pending-doctors" className="no-decoration secondary">Doctors Pending Approval</Link></button>
          <button className="secondary"><Link to="/admin/enrollment" className="no-decoration secondary">Enrollment Statistics</Link></button>
        </nav>
        <p className="with-horizontal-line"></p>
        {this.props.location.pathname !== '/admin/enrollment' && <div>
          <h3 className="app-subtitle">Doctors Pending Approval</h3>
          {doctors.length > 0 && doctors}
          {doctors.length === 0 && <div className="request box-shadow">
            <p className="app-subtitle">No unapproved doctors found.</p>
          </div>}
        </div>}
        {this.props.location.pathname === '/admin/enrollment' && <div>
          <h3 className="app-subtitle">Enrollment Statistics</h3>
          <div className="request box-shadow center">
            <h4 className="app-subtitle"><i className="fa fa-user-md"></i> Doctors</h4>
            <h1>{this.props.doctorCount}</h1>
          </div>
          <div className="request box-shadow center">
            <h4 className="app-subtitle"><i className="fa fa-user-graduate"></i> Students</h4>
            <h1>{this.props.studentCount}</h1>
          </div>
          <div className="request box-shadow center">
            <h4 className="app-subtitle"><i className="fas fa-envelope"></i> Requests</h4>
            <h1>{this.props.requestCount}</h1>
          </div>
        </div>}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.authReducer,
  ...state.userReducer,
  ...state.adminReducer
});

const mapDispatchToProps = dispatch => ({
  getDoctorsForApproval: () => dispatch(userActions.getDoctorsForApproval()),
  approveDoctor: (doctor) => dispatch(userActions.approveDoctor(doctor)),
  getAdminData: () => dispatch(adminActions.getAdminData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);