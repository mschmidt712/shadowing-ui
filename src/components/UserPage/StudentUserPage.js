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

  function formatSchoolYear(str) {
    const arr = str.split('-');
    return arr.map(string => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }).reduce((str, val) => {
      return `${str} ${val}`
    }, '').trim();
  }

  if (!props.address) {
    return <div></div>
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
            <h3 className="app-subtitle label">School Name:</h3>
            <div className="value">{props.school}</div>
          </div>
          <div className="data-item">
            <h3 className="app-subtitle label">School Year:</h3>
            <div className="value">{formatSchoolYear(props.schoolYear)}</div>
          </div>
          <div className="data-item">
            <h3 className="app-subtitle label">HIPAA Certified:</h3>
            <div className="value"><i className={`fa ${hipaaIcon} icon`}></i></div>
          </div>
          <div className="data-item">
            <h3 className="app-subtitle label">CV/Resume</h3>
            <button className="button primary"><a href={props.cv} className="no-decoration primary" download>Download PDF</a></button>
          </div>
          <Link to="/sign-up/student" className="center">
            <button className="secondary center">Edit Profile</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
