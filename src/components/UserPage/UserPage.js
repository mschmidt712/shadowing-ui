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
    super(props);

    this.state = {
      hipaaCert: undefined,
      addressLatLong: undefined,
      currentUser: props.id === this.formatSearchQuery(props.location).id
    }

    this.geocodeAddress = this.geocodeAddress.bind(this);
    this.onAccountActiveChange = this.onAccountActiveChange.bind(this);
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
    } else if (this.props.occupation === 'admin') {
      const search = this.formatSearchQuery(this.props.location);

      this.props.getUser(search.id, search.occupation);
    }
  }

  componentDidUpdate(oldProps) {
    if (this.props.doctor && (oldProps.doctor !== this.props.doctor)) {
      this.setState({
        ...this.props.doctor
      });
    }
    if (this.props.student && (oldProps.student !== this.props.student)) {
      this.setState({
        ...this.props.student
      });
    }
  }

  formatSearchQuery(location) {
    return location.search.slice(1, location.search.length).split('&').reduce((obj, val) => {
      const [prop, value] = val.split('=');
      return Object.assign({}, obj, {
        [prop]: value
      });
    }, {});
  }

  onAccountActiveChange(status) {
    const data = Object.assign({}, this.props.doctor, {
      email: this.props.email,
      id: this.props.id,
      active: status
    });
    this.props.updateDoctor(data, this.props.credentials);
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
        {this.props.occupation === 'admin' && this.formatSearchQuery(this.props.location).occupation === 'student' && <StudentUserPage
          {...this.state}
        />}
        {this.props.occupation === 'admin' && this.formatSearchQuery(this.props.location).occupation === 'doctor' && <DoctorUserPage
          {...this.state}
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
  getDoctor: (id) => dispatch(userActions.getDoctor(id)),
  getUser: (id, occupation) => dispatch(userActions.getUser(id, occupation)),
  updateDoctor: (id) => dispatch(userActions.updateDoctor(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);