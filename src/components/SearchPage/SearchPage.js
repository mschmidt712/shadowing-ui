import React, { Component } from 'react';
import { connect } from 'react-redux';
import Geocode from 'react-geocode';

import SearchMapComponent from './SearchMapComponent';
import SearchFilters from './SearchFilters';
import SearchDoctorComponent from './SearchDoctorComponent';
import RequestModal from '../RequestModal/RequestModal';
import RequestConfirmationModal from '../RequestModal/RequestConfirmationModal';
import './SearchPage.css';
import config from '../../aws-config.json';

import * as userActions from '../../actions/userActions';

class SearchPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      zipCode: undefined,
      distance: 20,
      specialty: undefined,
      availability: {},
      approved: true,
      doctors: [],
      addressLatLng: undefined,
      filtersEnabled: true,
      doctor: undefined,
      displayRequestModal: false,
      displayConfirmationModal: false
    }

    this.getDoctors = this.getDoctors.bind(this);
    this.geocodeAddress = this.geocodeAddress.bind(this);
    this.geocodeDoctorAddresses = this.geocodeDoctorAddresses.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onAvailabilityChange = this.onAvailabilityChange.bind(this);
    this.requestShadowing = this.requestShadowing.bind(this);
    this.closeRequestModal = this.closeRequestModal.bind(this);
    this.toggleConfirmationModal = this.toggleConfirmationModal.bind(this);
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

    const distance = searchObj.distance || 20;
    const specialty = searchObj.specialty || '';
    let availability = searchObj.availability ? JSON.parse(decodeURIComponent(decodeURI(searchObj.availability))) : {};

    this.setState({
      zipCode: searchObj.zipCode,
      distance,
      specialty,
      availability
    })

    this.props.getDoctors(Object.assign({}, searchObj, {
      distance,
      availability,
      approved: true
    }))
  }

  componentDidUpdate(oldProps) {
    if (this.props !== oldProps) {
      if (!this.props.doctors.length) {
        this.setState({
          doctors: []
        })
      }
      if (this.state.zipCode && this.props.doctors.length) {
        this.geocodeAddress(this.state.zipCode).then(() => {
          this.geocodeDoctorAddresses(this.props.doctors);
        });
      }
      if (this.state.zipCode && !this.props.doctors.length) {
        this.geocodeAddress(this.state.zipCode);
      }
    }
  }

  getDoctors() {
    const filters = ['zipCode', 'distance', 'specialty', 'availability', 'approved'];

    const filterObj = filters.filter(val => {
      if (this.state[val]) {
        return true;
      } else {
        return false;
      }
    }).reduce((obj, val) => {
      obj[val] = this.state[val];
      return obj;
    }, {});

    filterObj.availability = this.filterAvailabilityObj(filterObj.availability);

    this.props.getDoctors(filterObj);
  }

  filterAvailabilityObj(availabilityObj) {
    if (Object.keys(availabilityObj).length > 0) {
      return Object.keys(availabilityObj).filter(day => availabilityObj[day]).reduce((obj, day) =>
        Object.assign({}, obj, {
          [day]: availabilityObj[day]
        }), {});
    }
    return {};
  }

  geocodeAddress(zipCode) {
    Geocode.setApiKey(config['google-api-key']);
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
    Geocode.setApiKey(config['google-api-key']);
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

  toggleFilters() {
    this.setState({
      filtersEnabled: !this.state.filtersEnabled
    });
  }

  onInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onAvailabilityChange(e) {
    const day = e.target.name;
    const newAvailability = Object.assign({}, this.state.availability);
    newAvailability[day] = e.target.checked;

    this.setState({
      availability: newAvailability
    });
  }

  requestShadowing(doctor) {
    this.setState({
      doctor,
      displayRequestModal: true
    });
  }

  closeRequestModal() {
    this.setState({
      displayRequestModal: false
    });
  }

  toggleConfirmationModal(status) {
    this.setState({
      displayConfirmationModal: status
    });
  }

  render() {
    const doctors = this.state.doctors.map((doctor, index) => {
      return <SearchDoctorComponent
        key={doctor.id}
        doctor={doctor}
        isLoggedIn={this.props.isLoggedIn}
        requestShadowing={this.requestShadowing} />
    });

    return (
      <div className="search-page main">
        {this.state.filtersEnabled && <div className="search-filters-column box-shadow">
          <SearchFilters
            zipCode={this.state.zipCode}
            distance={this.state.distance}
            specialty={this.state.specialty}
            availability={this.state.availability}
            toggleFilters={this.toggleFilters}
            onInputChange={this.onInputChange}
            onAvailabilityChange={this.onAvailabilityChange}
            getDoctors={this.getDoctors}
          />
        </div>}
        {!this.state.filtersEnabled && <div onClick={this.toggleFilters} className="search-filters-column-hidden box-shadow">
          <p>
            <button className="icon  icon-secondary small" title="Show Filters">
              <i className="fas fa-angle-double-right"></i>
            </button>
          </p>
        </div>}
        <div className="search-data-column">
          <div>
            <SearchMapComponent
              googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${config['google-api-key']}`}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `300px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              addressLatLng={this.state.addressLatLng}
              doctors={this.state.doctors} />
          </div>
          <div className="search-results">
            {doctors.length ? doctors : <h3 className="no-results box-shadow">No doctors found matching your search criteria. Please try your search again.</h3>}
          </div>
          {this.state.displayRequestModal && <RequestModal
            doctor={this.state.doctor}
            closeRequestModal={this.closeRequestModal}
            toggleConfirmationModal={this.toggleConfirmationModal}
          />}
          {this.state.displayConfirmationModal && !this.props.loading && <RequestConfirmationModal
            doctor={this.state.doctor}
            toggleConfirmationModal={this.toggleConfirmationModal}
          />}
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  ...state.authReducer,
  ...state.userReducer,
  ...state.loadingReducer
});

const mapDispatchToProps = dispatch => ({
  getDoctors: (query) => dispatch(userActions.getDoctors(query))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
