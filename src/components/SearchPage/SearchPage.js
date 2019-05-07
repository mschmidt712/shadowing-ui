import React, { Component } from 'react';
import { connect } from 'react-redux';
import Geocode from 'react-geocode';

import SearchMapComponent from './SearchMapComponent';
import SearchDoctorComponent from './SearchDoctorComponent';
import './SearchPage.css';

import * as userActions from '../../actions/userActions';

class SearchPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      zipCode: undefined,
      doctors: [],
      addressLatLng: undefined
    }

    this.geocodeAddress = this.geocodeAddress.bind(this);
    this.geocodeDoctorAddresses = this.geocodeDoctorAddresses.bind(this);
  }

  componentDidMount() {
    const search = this.props.location.search;
    const searchItems = search.slice(1, search.length).split('&');
    const searchObj = searchItems.reduce((obj, item) => {
      const [prop, val] = item.split('=');
      return Object.assign({}, obj, {
        [prop]: val
      });
    }, {});

    this.setState({
      zipCode: searchObj['zipCode']
    });

    this.props.getDoctors(Object.assign({}, searchObj, {
      distance: 20,
      approved: true
    }));
  }

  componentDidUpdate(oldProps, oldState) {
    if (this.state.zipCode && this.props.doctors.length && this.props !== oldProps) {
      this.geocodeAddress(this.state.zipCode).then(() => {
        this.geocodeDoctorAddresses(this.props.doctors);
      });
    }
    if (this.state.zipCode && !this.props.doctors.length && this.props !== oldProps) {
      this.geocodeAddress(this.state.zipCode);
    }
  }

  geocodeAddress(zipCode) {
    Geocode.setApiKey("AIzaSyBV0ERwNWnf4cLICe7TozgRJG6jNM5aL9Q");
    return Geocode.fromAddress(zipCode).then(
      response => {
        const addressLatLng = response.results[0].geometry.location;
        this.setState({ addressLatLng });
      },
      error => {
        console.error(error);
      });
  }

  geocodeDoctorAddresses(doctors) {
    Geocode.setApiKey("AIzaSyBV0ERwNWnf4cLICe7TozgRJG6jNM5aL9Q");
    const updatedDoctorsPromises = doctors.map(doctor => {
      const address = `${doctor.address.streetAddress} ${doctor.address.city}, ${doctor.address.state} ${doctor.address.zipCode}`;
      return Geocode.fromAddress(address).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          const updatedDoctor = Object.assign({}, doctor, {
            addressLatLng: {
              lat,
              lng
            }
          });
          return updatedDoctor;
        },
        error => {
          console.error(error);
        }
      );
    });

    Promise.all(updatedDoctorsPromises).then(doctors => {
      this.setState({
        doctors
      });
    });
  }

  render() {
    const doctors = this.state.doctors.map((doctor, index) => {
      return <SearchDoctorComponent key={index} doctor={doctor} userAddress={this.state.addressLatLng} />
    });

    return (
      <div className="search-page">
        <div className="search-filters-column">Filters</div>
        <div className="search-data-column">
          <div>
            <SearchMapComponent
              googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBV0ERwNWnf4cLICe7TozgRJG6jNM5aL9Q"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `300px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              addressLatLng={this.state.addressLatLng}
              doctors={this.state.doctors} />
          </div>
          <div className="search-results">
            {doctors.length ? doctors : <h3 className="no-results">No doctors found matching your search criteria. Please try your search again.</h3>}
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  ...state.authReducer,
  ...state.userReducer
});

const mapDispatchToProps = dispatch => ({
  getDoctors: (query) => dispatch(userActions.getDoctors(query))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
