import React, { Component } from 'react'
import { connect } from 'react-redux';
import GoogleLogin from 'react-google-login';

import { googleLoginUser } from '../../actions/authActions';
import './Google.css';

class Google extends Component {
  responseGoogle = (response) => {
    this.props.googleLoginUser(response.profileObj.email, response.profileObj.imageUrl)
  }

  render() {
    return (
      <GoogleLogin
        clientId='153888190723-0jprekqk4akkree3mt7323tv1pmjnsef.apps.googleusercontent.com'
        render={renderProps => (
          <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="google button">
            <i className="fa fa-google-plus"></i>
            Continue with Google
          </button>
        )}
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
  googleLoginUser: (email, picture) => dispatch(googleLoginUser(email, picture))
});

export default connect(mapStateToProps, mapDispatchToProps)(Google);
