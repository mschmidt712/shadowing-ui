import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import UserPageMapComponent from './UserPageMapComponent';
import './UserPage.css';

export default function DoctorUserPage(props) {
  console.log(props.addressLatLong);

  if (!props.scheduling) {
    return <div></div>;
  }

  const accountStatus = props.accountStatus ? 'approved' : 'pending';
  const availability = Object.keys(props.scheduling).filter(day => {
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
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBV0ERwNWnf4cLICe7TozgRJG6jNM5aL9Q"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            addressLatLong={props.addressLatLong} />
        </div>
        <div className="user-data">
          <div className="data-item">
            <h3 className="app-subtitle">Account Status:</h3>
            <p className={accountStatus}>{accountStatus}</p>
          </div>
          <div className="data-item">
            < h3 className="app-subtitle">Email:</h3>
            {props.email}
          </div>
          <div className="data-item">
            <h3 className="app-subtitle">Address:</h3>
            {`${props.address.streetAddress}, ${props.address.city}, ${props.address.state} ${props.address.zipCode}`}
          </div>
          <div className="data-item column">
            <h3 className="app-subtitle">Availability:</h3>
            {availability}
          </div>
          <div className="data-item">
            <h3 className="app-subtitle">Preferred Shift Length:</h3>
            {props.shiftLength[0]} to {props.shiftLength[1]} hrs
          </div>
          <div className="data-item">
            <h3 className="app-subtitle">Additional Comments:</h3>
            {props.additionalComments}
          </div>
          <div className="data-item column">
            <h3 className="app-subtitle">Badge Photo:</h3>
            <img src={props.badgePhoto} alt="user badge" className="badge-photo"></img>
          </div>
          <Link to="/sign-up/doctor">
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