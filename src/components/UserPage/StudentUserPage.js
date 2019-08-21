import React from 'react';
import { Link } from 'react-router-dom';

import UserPageMapComponent from './UserPageMapComponent';
import './UserPage.css';
import config from '../../aws-config.json';

export default function StudentUserPage(props) {
  let hipaaIcon;
  if (props.hipaaCert) {
    hipaaIcon = 'fa-check';
  } else {
    hipaaIcon = 'fa-times';
  }

  return (
    <div>
      <h1 className="user-header"><i className="fa fa-user icon"></i>{props.name}</h1>
      <div className="user-body">
        <div className="user-map">
          <UserPageMapComponent
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${config['google-api-key']}`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            addressLatLong={props.addressLatLong} />
        </div>
        <div className="user-data">
          <div className="data-item">
            <h3 className="app-subtitle label">Email:</h3>
            <div className="value">{props.email}</div>
          </div>
          <div className="data-item">
            <h3 className="app-subtitle label">Phone Number:</h3>
            <div className="value">{props.phoneNumber}</div>
          </div>
          <div className="data-item">
            <h3 className="app-subtitle label">Address:</h3>
            <div className="value">{props.address.streetAddress} {props.address.city}, {props.address.state} {props.address.zipCode}</div>
          </div>
          <div className="data-item">
            <h3 className="app-subtitle label">HIPAA Certified</h3>
            <div className="value"><i className={`fa ${hipaaIcon} icon`}></i></div>
          </div>
          <div className="data-item">
            <h3 className="app-subtitle label">CV/Resume</h3>
            <button className="button primary"><a href={props.cv} className="no-decoration primary" download>Download PDF</a></button>
          </div>
          <Link to="/sign-up/student">
            <button className="secondary">Edit Profile</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
