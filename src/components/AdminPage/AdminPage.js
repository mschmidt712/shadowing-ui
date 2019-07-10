import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as userActions from '../../actions/userActions';
import './AdminPage.css';

class AdminPage extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getDoctorsForApproval();
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
        <div className="center">
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
        <p className="with-horizontal-line"></p>
        <h3 className="app-subtitle">Doctors Pending Approval</h3>
        {doctors.length > 0 && doctors}
        {doctors.length === 0 && <div className="request box-shadow">
          <p className="app-subtitle">No unapproved doctors found.</p>
        </div>}
      </div>
    )
  }
}



const mapStateToProps = state => ({
  ...state.authReducer,
  ...state.userReducer,
});

const mapDispatchToProps = dispatch => ({
  getDoctorsForApproval: () => dispatch(userActions.getDoctorsForApproval()),
  approveDoctor: (doctor) => dispatch(userActions.approveDoctor(doctor))
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);