import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';

import './App.css';
import AppHeader from './Header/Header';
import Login from './Login/Login';
import SignUpModal from './SignUpModal/SignUpModal';
import UserVerification from './UserVerification/UserVerification';
import SignUpConfirmation from './SignUpConfirmationModal/SignUpConfirmationModal';
import ForgotPassword from './ForgotPassword/ForgotPassword';

import * as authActions from '../actions/authActions';
import * as userActions from '../actions/userActions';
import * as requestActions from '../actions/requestActions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      occupation: '',
      verification: '',
      zipCode: undefined
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.setOccupation = this.setOccupation.bind(this);
  }

  componentDidMount() {
    if (this.props.checkAuthStatus) {
      this.props.checkAuthStatus();
    }
  }

  componentDidUpdate() {
    // Handle Errors
    if (this.props.err && this.props.err.name === 'UserNotConfirmedException' && !this.state.userNotConfirmed) {
      this.props.handleUnverifiedUser();
    } else if (this.props.err) {
      alert(this.props.err.message);
      this.props.handleError();
    } else if (this.props.userErr) {
      alert(this.props.userErr.error);
      this.props.handleUserError();
    } else if (this.props.requestErr) {
      alert(this.props.requestErr.body);
      this.props.handleRequestError();
    }
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
      <div className="App">
        {this.props.loading && <div className="spinner-container">
          <Loader
            type="Circles"
            color="#6558f5"
            height="100"
            width="100"
          />
        </div>}
        <AppHeader
          location={this.props.location}
          id={this.props.id}
          picture={this.props.picture}
          isLoggedIn={this.props.isLoggedIn}
          loginMethod={this.props.loginMethod}
          handleLoginClick={this.props.handleLoginClick}
          handleSignUpClick={this.props.handleSignUpClick}
          setOccupation={this.setOccupation}
          displayLogin={this.props.displayLogin}
          logoutUser={this.props.logoutUser}
          facebookLogoutUser={this.props.facebookLogoutUser}
          googleLogoutUser={this.props.googleLogoutUser}
          zipCode={this.state.zipCode}
          onInputChange={this.onInputChange}
        />
        {this.props.displayLogin &&
          <Login
            email={this.state.email}
            password={this.state.password}
            onEmailChange={this.onInputChange}
            onPasswordChange={this.onInputChange}
            handleLoginClose={this.props.handleLoginClose}
            handleSignUpClick={this.props.handleSignUpClick}
            setOccupation={this.setOccupation}
            loginUser={this.props.loginUser}
            handleForgotPasswordClick={this.props.handleForgotPasswordClick}
          />}
        {this.props.displaySignUp &&
          <SignUpModal
            email={this.state.email}
            password={this.state.password}
            confirmPassword={this.state.confirmPassword}
            occupation={this.state.occupation}
            onInputChange={this.onInputChange}
            registerUser={this.props.registerUser}
            handleSignUpClose={this.props.handleSignUpClose}
          />}
        {this.props.displayVerification &&
          <UserVerification
            email={this.state.email}
            password={this.state.password}
            verification={this.state.verification}
            occupation={this.state.occupation}
            unverifiedUser={this.props.unverifiedUser}
            isLoggedIn={this.props.isLoggedIn}
            onVerificationChange={this.onInputChange}
            verifyUser={this.props.verifyUser}
            verifyNewEmail={this.props.verifyNewEmail}
            handleVerificationClose={this.props.handleVerificationClose}
            resendVerification={this.props.resendVerification}
          />}
        {this.props.displayConfirmation &&
          <SignUpConfirmation
            handleConfirmationClose={this.props.handleConfirmationClose}
          />}
        {this.props.displayForgotPassword &&
          <ForgotPassword
            email={this.state.email}
            verification={this.state.verification}
            password={this.state.password}
            onInputChange={this.onInputChange}
            forgotPassword={this.props.forgotPassword}
            confirmPasswordReset={this.props.confirmPasswordReset}
            handleForgotPasswordClose={this.props.handleForgotPasswordClose}
          />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.authReducer,
  ...state.userReducer,
  ...state.requestReducer,
  ...state.loadingReducer
});

const mapDispatchToProps = dispatch => ({
  // Authentication Actions
  loginUser: (email, password) => dispatch(authActions.loginUser(email, password)),
  logoutUser: () => dispatch(authActions.logoutUser()),
  facebookLogoutUser: () => dispatch(authActions.facebookLogoutUser()),
  googleLogoutUser: () => dispatch(authActions.googleLogoutUser()),
  checkAuthStatus: () => dispatch(authActions.checkAuthStatus()),
  registerUser: (email, password, occupation) => dispatch(authActions.registerUser(email, password, occupation)),
  resendVerification: (email) => dispatch(authActions.resendVerification(email)),
  verifyUser: (email, password, verification, occupation) => dispatch(authActions.verifyUser(email, password, verification, occupation)),
  verifyNewEmail: (verification) => dispatch(authActions.verifyNewEmail(verification)),
  forgotPassword: (email) => dispatch(authActions.forgotPassword(email)),
  confirmPasswordReset: (email, verification, password) => dispatch(authActions.confirmPasswordReset(email, verification, password)),
  // Display Actions
  handleLoginClick: () => dispatch(authActions.handleLoginClick()),
  handleLoginClose: () => dispatch(authActions.handleLoginClose()),
  handleForgotPasswordClick: () => dispatch(authActions.handleForgotPasswordClick()),
  handleForgotPasswordClose: () => dispatch(authActions.handleForgotPasswordClose()),
  handleSignUpClick: () => dispatch(authActions.handleSignUpClick()),
  handleSignUpClose: () => dispatch(authActions.handleSignUpClose()),
  handleUnverifiedUser: () => dispatch(authActions.handleUnverifiedUser()),
  handleVerificationClose: () => dispatch(authActions.handleVerificationClose()),
  handleConfirmationClose: () => dispatch(authActions.handleConfirmationClose()),
  // Error Actions
  handleError: () => dispatch(authActions.handleError()),
  handleUserError: () => dispatch(userActions.handleError()),
  handleRequestError: () => dispatch(requestActions.handleError())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
