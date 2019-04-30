import React, { Component } from 'react';
import { connect } from 'react-redux';
import Geocode from "react-geocode";

import * as userActions from '../../actions/userActions';
import './UserPage.css';
import StudentUserPage from './StudentUserPage';
import DoctorUserPage from './DoctorUserPage';


class UserPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hipaaCert: undefined,
      addressLatLong: undefined
    }

    this.geocodeAddress = this.geocodeAddress.bind(this);
  }

  componentDidMount() {
    this.geocodeAddress();
  }

  geocodeAddress() {
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
      <div className="main">
        {this.props.occupation === 'student' && <StudentUserPage
          {...this.props}
          addressLatLong={this.state.addressLatLong} />}
        {this.props.occupation === 'doctor' && <DoctorUserPage
          {...this.props}
          addressLatLong={this.state.addressLatLong} />}
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