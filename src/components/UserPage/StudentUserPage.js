import React from 'react';
import { Link } from 'react-router-dom';

import UserPageMapComponent from './UserPageMapComponent';
import './UserPage.css';

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
        <div className="user-data">
          <h3 className="app-subtitle">Email: {props.email}</h3>
          <h3 className="app-subtitle">Phone Number: {props.phoneNumber}</h3>
          <h3 className="app-subtitle">Address: {`${props.address.streetAddress}, ${props.address.city}, ${props.address.state} ${props.address.zipCode}`}</h3>
          <h3 className="app-subtitle">
            HIPAA Certified
            <i className={`fa ${hipaaIcon} icon`}></i>
          </h3>
          <Link to="/sign-up/student">
            <button className="secondary">Edit Profile</button>
          </Link>
        </div>
        <div className="user-map">
          <UserPageMapComponent
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBV0ERwNWnf4cLICe7TozgRJG6jNM5aL9Q"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            addressLatLong={props.addressLatLong} />
        </div>
      </div>
    </div>
  )
}
