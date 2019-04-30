import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Geocode from "react-geocode";

import * as userActions from '../../actions/userActions';
import './UserPage.css';
import StudentUserPage from './StudentUserPage';
import { IoTJobsDataPlane } from 'aws-sdk';

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
    Geocode.setApiKey("AIzaSyBV0ERwNWnf4cLICe7TozgRJG6jNM5aL9Q");
    const address = `${this.props.address.streetAddress} ${this.props.address.city}, ${this.props.address.state} ${this.props.address.zipCode}`;
    Geocode.fromAddress(address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
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
    return (
      <div>
        {this.props.occupation === 'student' && <StudentUserPage
          name={this.props.name}
          email={this.props.email}
          phoneNumber={this.props.phoneNumber}
          address={this.props.address}
          hipaaCert={this.props.hipaaCert}
          addressLatLong={this.state.addressLatLong} />}
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