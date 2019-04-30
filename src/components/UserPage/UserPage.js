import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Geocode from "react-geocode";

import * as userActions from '../../actions/userActions';
import './UserPage.css';
import UserPageMapComponent from './UserPageMapComponent';

class UserPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hipaaCert: undefined,
      addressLatLong: undefined
    }
  }

  componentDidMount() {
    this.geocodeAddress();
  }

  geocodeAddress = () => {
    console.log('Running Geocode Address');

    Geocode.setApiKey("AIzaSyBV0ERwNWnf4cLICe7TozgRJG6jNM5aL9Q");
    const address = `${this.props.address.streetAddress} ${this.props.address.city}, ${this.props.address.state} ${this.props.address.zipCode}`;
    Geocode.fromAddress(address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);
        this.setState({
          addressLatLong: {
            lat,
            lng
          }
        })
      },
      error => {
        console.error(error);
      }
    );
  }

  render() {
    let hipaaCert = '';
    if (this.props.hipaaCert) {
      hipaaCert = <h3 className="app-subtitle">
        HIPAA Certified
        <i className="fa fa-check icon"></i>
      </h3>
    } else {
      hipaaCert = <h3 className="app-subtitle">
        HIPAA Certified
        <i className="fa fa-times icon"></i>
      </h3>
    }

    return (
      <div>
        {this.props.occupation === 'student' &&
          <div>
            <h1 className="user-header"><i className="fa fa-user icon"></i>{this.props.name}</h1>
            <div className="user-body">
              <div className="user-data">
                <h3 className="app-subtitle">Email: {this.props.email}</h3>
                <h3 className="app-subtitle">Phone Number: {this.props.phoneNumber}</h3>
                <h3 className="app-subtitle">Address: {`${this.props.address.streetAddress}, ${this.props.address.city}, ${this.props.address.state} ${this.props.address.zipCode}`}</h3>
                {hipaaCert}
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
                  addressLatLong={this.state.addressLatLong} />
              </div>
            </div>
          </div>}
        {this.props.occupation === 'doctor' &&
          <div>Doctor</div>}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.authReducer,
  ...state.userReducer
});

const mapDispatchToProps = dispatch => ({
  getStudent: (id) => dispatch(userActions.getStudent(id)),
  getDoctor: (id) => dispatch(userActions.getDoctor(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);