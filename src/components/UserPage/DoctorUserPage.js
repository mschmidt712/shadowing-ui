import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import UserPageMapComponent from './UserPageMapComponent';
import './UserPage.css';
import config from '../../aws-config.json';

export default function DoctorUserPage(props) {
  if (!props.scheduling) {
    return <div></div>;
  }

  const accountStatus = props.approved ? 'approved' : 'pending';
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const availability = days.filter(day => {
    if (!props.scheduling[day]) {
      return false;
    }

    return true;
  }).map((day, index) => {
    const start = props.scheduling[day][0];
    const end = props.scheduling[day][1];
    return <div key={index} className="scheduling-item"><h4>{capitalizeWord(day)}:</h4> {convertTime(start)} - {convertTime(end)}</div>
  });

  return (
    <div>
      <h1 className="user-header"><i className="fa fa-user icon"></i>{props.name}, {props.degree}</h1>
      <h3 className="user-subheader">{props.specialty}</h3>
      <div className="user-body">
        <div className="user-map">
          <UserPageMapComponent
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${config['google-api-key']}`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            addressLatLong={props.addressLatLong} />
        </div>
        <div>
          <div className="user-data">
            <div className="data-item">
              <h3 className="app-subtitle label">Account Status:</h3>
              <div className="value">
                <p className={accountStatus}>{accountStatus}</p>
              </div>
            </div>
            <div className="data-item">
              < h3 className="app-subtitle label">Email:</h3>
              <div className="value">{props.email}</div>
            </div>
            <div className="data-item">
              <h3 className="app-subtitle label">Address:</h3>
              <div className="value">{`${props.address.streetAddress}, ${props.address.city}, ${props.address.state} ${props.address.zipCode}`}</div>
            </div>
            <div className="data-item">
              <h3 className="app-subtitle label">Availability:</h3>
              <div className="value">{availability}</div>
            </div>
            <div className="data-item">
              <h3 className="app-subtitle label">Preferred Shift Length:</h3>
              <div className="value">{props.shiftLength[0]} to {props.shiftLength[1]} hrs</div>
            </div>
            <div className="data-item">
              <h3 className="app-subtitle label">Additional Comments:</h3>
              <div className="value">{props.additionalComments}</div>
            </div>
          </div>
          <Link to="/sign-up/doctor" className="center-button">
            <button className="secondary">Edit Profile</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function capitalizeWord(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function convertTime(time) {
  return moment(time, 'HH:mm:ss').format('h:mm A');
}