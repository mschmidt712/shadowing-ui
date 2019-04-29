import React, { Component } from 'react'
import FacebookLogin from 'react-facebook-login';
import { connect } from 'react-redux';

import awsData from '../../aws-config.json';
import { facebookLoginUser } from '../../actions/authActions';
import './Facebook.css';

class Facebook extends Component {
  responseFacebook = (response) => {
    console.log(response);

    this.props.facebookLoginUser(response.email, response.picture.data.url, response.accessToken, response.id);
  }

  render() {
    return <FacebookLogin
      appId={awsData['facebook-app-id']}
      autoLoad={true}
      fields="id,name,email,picture"
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
  facebookLoginUser: (email, picture, accessToken, id) => dispatch(facebookLoginUser(email, picture, accessToken, id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Facebook);