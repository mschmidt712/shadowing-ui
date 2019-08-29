import React, { Component } from 'react';
import { connect } from 'react-redux';
import Geocode from 'react-geocode';

import * as userActions from '../../actions/userActions';
import './UserPage.css';
import StudentUserPage from './StudentUserPage';
import DoctorUserPage from './DoctorUserPage';
import config from '../../aws-config.json';

class UserPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hipaaCert: undefined,
      addressLatLong: undefined,
      accountActive: true
    }

    this.geocodeAddress = this.geocodeAddress.bind(this);
    this.onAccountActiveChange = this.onAccountActiveChange.bind(this);
  }

  componentDidMount() {
    this.geocodeAddress();
  }

  onAccountActiveChange(status) {
    this.setState({
      accountActive: status
    });
  }

  geocodeAddress() {
    Geocode.setApiKey(config['google-api-key']);
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
          addressLatLong={this.state.addressLatLong}
          accountActive={this.state.accountActive}
          onAccountActiveChange={this.onAccountActiveChange}
        />}
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