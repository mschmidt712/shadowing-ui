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
      email: this.props.email,
      hipaaCert: undefined,
      addressLatLong: undefined,
      accountActive: true
    }

    this.geocodeAddress = this.geocodeAddress.bind(this);
    this.onAccountActiveChange = this.onAccountActiveChange.bind(this);
    this.updateDoctor = this.updateDoctor.bind(this);
  }

  componentDidMount() {
    if (this.props.occupation === 'doctor') {
      this.setState({
        ...this.props.doctor
      });
    } else if (this.props.occupation === 'student') {
      this.setState({
        ...this.props.student
      });
    }
  }

  updateDoctor() {
    console.log(this.props);
  }

  onAccountActiveChange(status) {
    this.updateDoctor();

    this.setState({
      accountActive: status
    });
  }

  geocodeAddress() {
    Geocode.setApiKey(config['google-api-key']);
    const address = `${this.state.address.streetAddress} ${this.state.address.city}, ${this.state.address.state} ${this.state.address.zipCode}`;

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
    if (this.state.address && !this.state.addressLatLong) {
      this.geocodeAddress();
    }

    return (
      <div className="main">
        {this.props.occupation === 'student' && <StudentUserPage
          {...this.state}
        />}
        {this.props.occupation === 'doctor' && <DoctorUserPage
          {...this.state}
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