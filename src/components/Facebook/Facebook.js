import React, { Component } from 'react'
import FacebookLogin from 'react-facebook-login';
import { connect } from 'react-redux';

import { facebookLoginUser } from '../../actions/authActions';
import './Facebook.css';

class Facebook extends Component {
  responseFacebook = (response) => {
    console.log(response.picture.data.url);

    this.props.facebookLoginUser(response.email, response.picture.data.url);
  }

  render() {
    return <FacebookLogin
      appId="876295212724117"
      autoLoad={false}
      fields="name,email,picture"
      cssClass="facebook"
      callback={this.responseFacebook}
      icon="fa-facebook-square"
      textButton="Continue with Facebook"
    />;
  }
}

const mapStateToProps = state => ({
  ...state.authReducer
});

const mapDispatchToProps = dispatch => ({
  facebookLoginUser: (email, picture) => dispatch(facebookLoginUser(email, picture))
});

export default connect(mapStateToProps, mapDispatchToProps)(Facebook);