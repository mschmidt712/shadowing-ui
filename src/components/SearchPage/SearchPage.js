import React, { Component } from 'react';
import { connect } from 'react-redux';
import Geocode from 'react-geocode';

import SearchMapComponent from './SearchMapComponent';
import SearchFilters from './SearchFilters';
import SearchDoctorComponent from './SearchDoctorComponent';
import RequestModal from '../RequestModal/RequestModal';
import RequestConfirmationModal from '../RequestModal/RequestConfirmationModal';
import handleEnterClick from '../utilities/handleEnterClick';
import './SearchPage.css';
import config from '../../aws-config.json';

import * as userActions from '../../actions/userActions';
import * as requestActions from '../../actions/requestActions';

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
      selectedDoctor: undefined,
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
    }));

    if (window.innerWidth <= 480) {
      this.setState({
        filtersEnabled: false
      });
    }

    handleEnterClick('zipCode');
    handleEnterClick('specialty');
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    daysOfWeek.forEach(day => {
      handleEnterClick(day);
    });
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

    if (window.innerWidth <= 480) {
      this.setState({
        filtersEnabled: false
      });
    }
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
      selectedDoctor: doctor,
      displayRequestModal: true
    });
  }

  closeRequestModal() {
    this.setState({
      displayRequestModal: false
    });
  }

  render() {
    const doctors = this.state.doctors.sort((a, b) => {
      const aAvailability = a.weeklyRequests < a.maxRequests;
      const bAvailability = b.weeklyRequests < b.maxRequests;
      if (!aAvailability & bAvailability) {
        return 1;
      } else if (aAvailability & bAvailability) {
        return 0;
      } else {
        return -1;
      }
    }).map((doctor, index) => {
      return <SearchDoctorComponent
        key={doctor.id}
        doctor={doctor}
        occupation={this.props.occupation}
        isLoggedIn={this.props.isLoggedIn}
        requestShadowing={this.requestShadowing} />
    })

    let body;
    if (window.innerWidth <= 480 && this.state.filtersEnabled) {
      body = <div className="search-page main mobile">
        <div className="search-filters-column box-shadow mobile">
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
        </div>
      </div>
    } else if (window.innerWidth <= 480 && !this.state.filtersEnabled) {
      body = <div className="search-page main mobile">
        <div onClick={this.toggleFilters} className="search-filters-column-hidden box-shadow">
          <button className="icon icon-secondary small" title="Show Filters">
            <div className="component-header-details">
              <h3>Filters</h3>
              <div className="icon">
                <i className="fas fa-angle-double-right"></i>
              </div>
            </div>
          </button>
        </div>
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
            {this.props.doctors.length >= 0 && doctors}
            {this.props.doctors.length === 0 && !this.props.loading ? <h3 className="no-results box-shadow">No doctors found matching your search criteria. Please try your search again.</h3> : <div></div>}
          </div>
          {this.state.displayRequestModal && <RequestModal
            selectedDoctor={this.state.selectedDoctor}
            closeRequestModal={this.closeRequestModal}
            toggleConfirmationModal={this.toggleConfirmationModal}
          />}
          {this.state.displayConfirmationModal && !this.props.loading && !this.props.requestErr && <RequestConfirmationModal
            selectedDoctor={this.state.selectedDoctora}
            toggleConfirmationModal={this.toggleConfirmationModal}
          />}
        </div>
      </div>
    } else {
      body = <div className="search-page main">
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
        {!this.state.filtersEnabled &&
          <div onClick={this.toggleFilters} className="search-filters-column-hidden box-shadow">
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
            {this.props.doctors.length >= 0 && doctors}
            {this.props.doctors.length === 0 && this.props.loading === 0 ? <h3 className="no-results box-shadow">No doctors found matching your search criteria. Please try your search again.</h3> : <div></div>}
          </div>
          {this.state.displayRequestModal && <RequestModal
            selectedDoctor={this.state.selectedDoctor}
            closeRequestModal={this.closeRequestModal}
          />}
          {this.props.displayConfirmationModal && !this.props.loading && <RequestConfirmationModal
            selectedDoctor={this.state.selectedDoctor}
            closeConfirmationModal={this.props.closeConfirmationModal}
          />}
        </div>
      </div>
    }

    return body;
  }
}


const mapStateToProps = state => ({
  ...state.authReducer,
  ...state.userReducer,
  ...state.loadingReducer,
  ...state.requestReducer
});

const mapDispatchToProps = dispatch => ({
  getDoctors: (query) => dispatch(userActions.getDoctors(query)),
  closeConfirmationModal: () => dispatch(requestActions.closeConfirmationModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
