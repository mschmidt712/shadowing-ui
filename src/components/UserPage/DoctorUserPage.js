import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router-dom';
import Switch from "react-switch";

import UserPageMapComponent from './UserPageMapComponent';
import capitalizeWord from '../utilities/capitalizeWord';
import convertTime from '../utilities/convertTime';
import findGender from '../utilities/findGender';
import daysOfTheWeek from '../../constants/daysOfTheWeek';
import './UserPage.css';
import config from '../../aws-config.json';

export default function DoctorUserPage(props) {
  if (!props.scheduling) {
    return <div></div>;
  }

  const accountStatus = props.approved ? 'approved' : 'pending';
  const availability = daysOfTheWeek.filter(day => {
    if (!props.scheduling[day]) {
      return false;
    }

    return true;
  }).map((day, index) => {
    const start = props.scheduling[day][0];
    const end = props.scheduling[day][1];
    return <div key={index} className="scheduling-item"><h4>{capitalizeWord(day)}:</h4> {convertTime(start)} - {convertTime(end)}</div>
  });
  let organizations = 'No affiliated organizations.'; 

  if (props.userOrganizations.length > 0) {
    organizations = props.userOrganizations.map(org => {
      return <div key={org.value} className="scheduling-item">{org.label}</div>
    });
  }

  return (
    <div>
      <h1 className="user-header"><i className="fa fa-user icon"></i>{props.name}, {props.degree}</h1>
      {props.specialty && <h3 className="user-subheader">{props.specialty}</h3>}
      {props.currentUser && <div className="data-item center">
        <h5 className="user-subheader react-switch">Your Account is Set To</h5>
        <Switch
          onChange={props.onAccountActiveChange}
          checked={props.active}
          uncheckedIcon={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "150px",
                transform: "translateX(-108px)"
              }}
            >
              Inactive
          </div>
          }
          checkedIcon={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "150px"
              }}
            >
              Active
        </div>}
          width={150}
          onColor="#3CADE7"
          className="react-switch"
          aria-label="Account Active Toggle Switch"
        />
        <i
          data-for="account-active"
          data-tip="You can use this switch to toggle your account on and off when you are unavailable to accept shadowing requests. Some examples might include the holiday season or vacations."
          className="fas fa-info-circle icon">
        </i>
        <ReactTooltip
          id="account-active"
          className="tooltip"
        />
      </div>}
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
              <h3 className="app-subtitle label">Gender:</h3>
              <div className="value">{findGender(props.gender)}</div>
            </div>
            <div className="data-item">
              <h3 className="app-subtitle label">Email:</h3>
              <div className="value">{props.email}</div>
            </div>
            <div className="data-item">
              <h3 className="app-subtitle label">Request Email:</h3>
              <div className="value">{props.requestEmail}</div>
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
              <h3 className="app-subtitle label">Organizations:</h3>
              <div className="value">{organizations}</div>
            </div>
            <div className="data-item">
              <h3 className="app-subtitle label">Additional Comments:</h3>
              <div className="value">{props.additionalComments}</div>
            </div>
          </div>
          {props.currentUser && <Link to="/sign-up/doctor" className="center-button">
            <button className="secondary">Edit Profile</button>
          </Link>}
        </div>
      </div>
    </div>
  )
}