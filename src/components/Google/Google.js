import React, { Component } from 'react'
import { connect } from 'react-redux';
import GoogleLogin from 'react-google-login';

import awsData from '../../aws-config.json';
import { googleLoginUser } from '../../actions/authActions';
import './Google.css';

class Google extends Component {
  responseGoogle = (response) => {
    console.log(response);

    this.props.googleLoginUser(response.profileObj.email, response.profileObj.imageUrl, response.tokenId, response.googleId)
  }

  render() {
    return (
      <GoogleLogin
        clientId={awsData['google-client-id']}
        render={renderProps => (
          <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="google button">
            <i className="fa fa-google-plus"></i>
            Continue with Google
          </button>
        )}
        autoLoad={true}
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    )
  }
}

const mapStateToProps = state => ({
  ...state.authReducer
});

const mapDispatchToProps = dispatch => ({
  googleLoginUser: (email, picture, token, id) => dispatch(googleLoginUser(email, picture, token, id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Google);
