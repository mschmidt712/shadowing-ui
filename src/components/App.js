import React, { Component } from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import './App.css';
import AppHeader from './Header/Header';
import Home from './Home/Home';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import UserVerification from './UserVerification/UserVerification';
import SignUpConfirmation from './SignUpConfirmation/SignUpConfirmation';

import authFunctions from './authentication-functions';
import { simpleAction } from '../actions/simpleAction';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      verification: '',
      isLoggedIn: false,
      displayLogin: false,
      displaySignUp: false,
      displayVerification: false,
      displayConfirmation: false
    };

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onVerificationChange = this.onVerificationChange.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLoginClose = this.handleLoginClose.bind(this);
    this.handleSignUpClick = this.handleSignUpClick.bind(this);
    this.handleSignUpClose = this.handleSignUpClose.bind(this);
    this.handleVerificationClose = this.handleVerificationClose.bind(this);
    this.handleConfirmationClose = this.handleConfirmationClose.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.verifyUser = this.verifyUser.bind(this);
    this.resendVerification = this.resendVerification.bind(this);
  }

  componentDidMount () {
    authFunctions.checkAuthStatus().then(result => {
      this.setState(result);
    });
  }

  onEmailChange (event) {
    this.setState({email: event.target.value})
  }

  onPasswordChange (event) {
    this.setState({password: event.target.value})
  }

  onVerificationChange (event) {
    this.setState({verification: event.target.value})
  }

  handleLoginClick () {
    this.setState({displayLogin: true});
  }

  handleLoginClose () {
    this.setState({displayLogin: false});
  }

  handleSignUpClick () {
    this.setState({
      displayLogin: false,
      displaySignUp: true
    });
  }

  handleSignUpClose () {
    this.setState({displaySignUp: false});
  }

  handleVerificationClose () {
    this.setState({displayVerification: false});
  }

  handleConfirmationClose () {
    this.setState({displayConfirmation: false});
  }

  loginUser () {
    return authFunctions.loginUser(this.state.email, this.state.password, this.handleLoginClose);
  }

  registerUser () {
    return authFunctions.registerUser(this.state.email, this.state.password).then(result => {
      this.setState(result);
    }).catch(err => {
      throw new Error(err);
    })
  }

  verifyUser () {
    return authFunctions.verifyUser(this.state.email, this.state.verification).then(result => {
      this.setState(result);
    }).catch(err => {
      throw new Error(err);
    })
  }
  
  resendVerification () {
    return authFunctions.resendVerification(this.state.email);
  }

  render() {
    return (
      <div className="App">
        <AppHeader 
          location={this.props.location}
          isLoggedIn={this.state.isLoggedIn}
          handleLoginClick={this.handleLoginClick}
          handleLoginClose={this.handleLoginClose}
          handleSignUpClick={this.handleSignUpClick}
          handleSignUpClose={this.handleSignUpClose}
          displayLogin={this.state.displayLogin}
          displaySignUp={this.state.displaySignUp}
          logoutUser = {authFunctions.logoutUser}
        />
        <Home 
          googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBV0ERwNWnf4cLICe7TozgRJG6jNM5aL9Q'
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
        {this.state.displayLogin &&
        <Login 
          email={this.state.email}
          password={this.state.password}
          onEmailChange={this.onEmailChange}
          onPasswordChange={this.onPasswordChange}
          handleLoginClose={this.handleLoginClose}
          handleSignUpClick={this.handleSignUpClick}
          loginUser={this.loginUser}
          />}
        {this.state.displaySignUp &&
        <SignUp
          email={this.state.email}
          password={this.state.password}
          onEmailChange={this.onEmailChange}
          onPasswordChange={this.onPasswordChange}
          registerUser={this.registerUser}
          handleSignUpClose={this.handleSignUpClose}
          />}
        {this.state.displayVerification &&
        <UserVerification
          verification={this.state.verification}
          onVerificationChange={this.onVerificationChange}
          verifyUser={this.verifyUser}
          handleVerificationClose={this.handleVerificationClose}
          />}
        {this.state.displayConfirmation &&
        <SignUpConfirmation
          handleConfirmationClose={this.handleConfirmationClose}
          />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction())
})

render(<App />, document.getElementById('container'));
export default connect(mapStateToProps, mapDispatchToProps)(App);
