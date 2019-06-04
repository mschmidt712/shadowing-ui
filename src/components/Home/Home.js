import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as authActions from '../../actions/authActions';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      zipCode: undefined,
      occupation: undefined
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.setOccupation = this.setOccupation.bind(this);
  }

  onInputChange(event) {
    const newState = {};
    newState[event.target.name] = event.target.value;

    this.setState(newState);
  }

  setOccupation(occupation) {
    this.setState({
      occupation
    });
  }

  render() {
    return (
      <div className="background-image">
        <div className="home main">
          <h1 className="app-title" >Find Shadowing</h1>
          <h3 className="app-subtitle">A website built to help students find physicians to shadow in a number of specialities in their area.</h3>
          <h3 className="app-subtitle">Enter your location below to get started</h3>
          <div className="search">
            <input maxLength="5" placeholder="Enter Your Zip Code" name="zipCode" value={this.state.zipCode} onChange={this.onInputChange}></input>
            <Link to={`/search?zipCode=${this.state.zipCode}`} className="primary button">
              <i className="fa fa-search"></i>
            </Link>
          </div>
          <button className="tertiary small" onClick={() => { this.props.handleSignUpClick(); this.setOccupation("doctor"); }}>Physician Sign Up</button>
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
  handleSignUpClick: () => dispatch(authActions.handleSignUpClick())
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);