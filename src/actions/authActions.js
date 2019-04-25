import { AuthenticationDetails, CognitoUserPool, CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';

import * as authAction from './authTypes';
import awsData from '../aws-config.json';

import { getStudent } from '../actions/userActions';

const poolData = {
  UserPoolId: awsData['pool-id'],
  ClientId: awsData['app-client']
};

//************************* Authentication Actions *************************//
export const loginUser = (email, password) => {
  return (dispatch) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (authResult) => {
        let attributes = {};

        return retrieveUserAttributes(cognitoUser)
          .then(result => {
            attributes = result;

            return getUserCredentials(authResult);
          }).then(credentials => {
            dispatch(getStudent(email));

            return dispatch({
              type: authAction.LOGIN_USER,
              payload: {
                credentials,
                email,
                occupation: attributes['custom:occupation'],
                id: attributes.sub
              }
            });
          });
      },
      onFailure: (err) => {
        dispatch({
          type: authAction.AUTH_ERROR,
          payload: {
            err
          }
        });
      }
    });
  }
}

const loginUserWithoutAction = (email, password) => {
  const authenticationDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const userPool = new CognitoUserPool(poolData);
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool
  });
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: () => {
      return;
    },
    onFailure: (err) => {
      throw new Error(err);
    }
  });
}

function retrieveUserAttributes(user) {
  return new Promise((resolve, reject) => {
    return user.getUserAttributes(function (err, result) {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return reject(err);
      }

      let attributes = {};
      result.forEach(attribute => {
        attributes[attribute.getName()] = attribute.getValue();
      });

      return resolve(attributes);
    });
  });
}

function getUserCredentials(session) {
  const params = {
    IdentityPoolId: awsData['identity-pool-id'],
    Logins: {}
  };
  params.Logins[`cognito-idp.${awsData['region']}.amazonaws.com/${awsData['pool-id']}`] = session.getIdToken().jwt
  const credentials = new AWS.CognitoIdentityCredentials(params, { region: awsData['region'] });
  return new Promise((resolve, reject) => {
    return credentials.refresh(err => {
      if (err) { return reject(err) };
      return resolve(credentials);
    });
  });
}

export const logoutUser = () => {
  return (dispatch) => {
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();
    cognitoUser.signOut();

    dispatch({
      type: authAction.LOGOUT_USER
    });
  }
}

export const checkAuthStatus = () => {
  return (dispatch) => {
    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    let session;
    let attributes;

    if (cognitoUser != null) {
      return new Promise((resolve, reject) => {
        return cognitoUser.getSession(function (err, session) {
          if (err) {
            return reject(err);
          }
          return resolve(session);
        });
      }).then(sessionResult => {
        if (sessionResult.isValid()) {
          session = sessionResult;
          return retrieveUserAttributes(cognitoUser);
        } else {
          return dispatch({
            type: authAction.CHECK_AUTH_STATUS,
            payload: {
              isLoggedIn: false
            }
          });
        }
      }).then(attributesResult => {
        attributes = attributesResult;
        return getUserCredentials(session);
      }).then(credentials => {
        dispatch(getStudent(attributes.email));

        return dispatch({
          type: authAction.CHECK_AUTH_STATUS,
          payload: {
            isLoggedIn: true,
            email: attributes.email,
            occupation: attributes['custom:occupation'],
            id: attributes.sub,
            credentials
          }
        });
      }).catch(err => {
        dispatch({
          type: authAction.AUTH_ERROR,
          payload: {
            err
          }
        });
      });
    } else {
      return dispatch({
        type: authAction.CHECK_AUTH_STATUS,
        payload: {
          isLoggedIn: false
        }
      });
    }
  }
}

export const registerUser = (email, password, occupation) => {
  return (dispatch) => {
    const userPool = new CognitoUserPool(poolData);

    let attributeList = [];
    const dataEmail = {
      Name: 'email',
      Value: email
    };
    const dataOccupation = {
      Name: 'custom:occupation',
      Value: occupation
    };
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    const attributeOccupation = new CognitoUserAttribute(dataOccupation);
    attributeList = [...attributeList, attributeEmail, attributeOccupation];

    return new Promise((resolve, reject) => {
      userPool.signUp(email, password, attributeList, null, function (err, result) {
        if (err) {
          return reject(err);
        }
        const cognitoUser = result.user;
        return resolve(cognitoUser);
      });
    }).then(user => {
      console.log(`New User Registered with Email: ${user.getUsername()}`);
      return dispatch({
        type: authAction.REGISTER_USER
      });
    }).catch(err => {
      dispatch({
        type: authAction.AUTH_ERROR,
        payload: {
          err
        }
      });
    })
  }
}

export const verifyUser = (email, password, verification, occupation) => {
  return (dispatch) => {
    const userPool = new CognitoUserPool(poolData);
    const userData = {
      Username: email,
      Pool: userPool
    };

    var cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(verification, true, function (err, result) {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    }).then(result => {
      console.log(`Account Verification: ${result}`);

      return loginUserWithoutAction(email, password);
    }).then(() =>
      dispatch({
        type: authAction.VERIFY_USER,
        payload: {
          occupation
        }
      })
    ).catch(err => {
      return dispatch({
        type: authAction.AUTH_ERROR,
        payload: {
          err
        }
      });
    });
  }
}

export const updateUserAttributes = () => {
  return dispatch => {
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();

    const attributeList = [];
    const attribute = new CognitoUserAttribute({
      Name: 'custom:active',
      Value: true
    });
    attributeList.push(attribute);
    cognitoUser.updateAttributes(attributeList, function (err, result) {
      if (err) {
        return dispatch({
          type: authAction.AUTH_ERROR,
          payload: {
            err
          }
        });
      }

      dispatch({
        type: authAction.UPDATE_USER_ATTRIBUTES
      });
    });
  }
}

export const resendVerification = (email) => {
  return (dispatch) => {
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    return new Promise((resolve, reject) => {
      return cognitoUser.resendConfirmationCode(function (err, result) {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    }).then(result => {
      console.log(`Account Verification: ${result}`);
      return dispatch({
        type: authAction.RESEND_VERIFICATION
      });
    }).catch(err => {
      return dispatch({
        type: authAction.AUTH_ERROR,
        payload: {
          err
        }
      });
    });
  }
}

export const forgotPassword = (email) => {
  return dispatch => {
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    cognitoUser.forgotPassword({
      onSuccess: function (data) {
        // successfully initiated reset password request
        alert('Verification Code Sent!');

        return dispatch({
          type: authAction.FORGOT_PASSWORD
        });
      },
      onFailure: function (err) {
        return dispatch({
          type: authAction.AUTH_ERROR,
          payload: {
            err
          }
        });
      }
    });
  }
}

export const confirmPasswordReset = (email, verification, newPassword) => {
  return dispatch => {
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    cognitoUser.confirmPassword(verification, newPassword, {
      onSuccess() {
        alert('Password Successfully Reset!');

        return dispatch({
          type: authAction.CONFIRM_PASSWORD
        });
      },
      onFailure(err) {
        return dispatch({
          type: authAction.AUTH_ERROR,
          payload: {
            err
          }
        });
      }
    });
  }
}

export const deleteUser = () => {
  return (dispatch) => {
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();
    cognitoUser.deleteUser(function (err, result) {
      if (err) {
        return dispatch({
          type: authAction.AUTH_ERROR,
          payload: {
            err
          }
        });
      }

      dispatch({
        type: authAction.DELETE_USER
      });
    });
  }
}

//************************* Facebook Authentication Actions *************************//
export const facebookLoginUser = (email, picture, token) => {
  return dispatch => {
    return getFacebookUserCredentials(token).then(credentials => {
      dispatch(getStudent(email));

      return dispatch({
        type: authAction.FACEBOOK_LOGIN_USER,
        payload: {
          credentials,
          email,
          picture
        }
      });
    }).catch(err => {
      return dispatch({
        type: authAction.AUTH_ERROR,
        payload: {
          err
        }
      });
    });
  }
}

function getFacebookUserCredentials(token) {
  const params = {
    IdentityPoolId: awsData['identity-pool-id'],
    Logins: {}
  };
  params.Logins['graph.facebook.com'] = token;
  const credentials = new AWS.CognitoIdentityCredentials(params, { region: awsData['region'] });
  return new Promise((resolve, reject) => {
    return credentials.refresh(err => {
      if (err) { return reject(err) };
      return resolve(credentials);
    });
  });
}

export const facebookLogoutUser = () => {
  localStorage.clear();

  return dispatch => (
    dispatch({
      type: authAction.FACEBOOK_LOGOUT_USER
    })
  )
}

//************************* Google Authentication Actions *************************//
export const googleLoginUser = (email, picture, token) => {
  return dispatch => {
    return getGoogleUserCredentials(token).then(credentials => {
      dispatch(getStudent(email));

      return dispatch({
        type: authAction.GOOGLE_LOGIN_USER,
        payload: {
          credentials,
          email,
          picture
        }
      });
    }).catch(err => {
      return dispatch({
        type: authAction.AUTH_ERROR,
        payload: {
          err
        }
      });
    });
  }
}

function getGoogleUserCredentials(token) {
  const params = {
    IdentityPoolId: awsData['identity-pool-id'],
    Logins: {}
  };
  params.Logins['accounts.google.com'] = token;
  const credentials = new AWS.CognitoIdentityCredentials(params, { region: awsData['region'] });
  return new Promise((resolve, reject) => {
    return credentials.refresh(err => {
      if (err) { return reject(err) };
      return resolve(credentials);
    });
  });
}

export const googleLogoutUser = () => {
  return dispatch => (
    dispatch({
      type: authAction.GOOGLE_LOGOUT_USER
    })
  )
}

//************************* Display Actions *************************//
export const handleLoginClick = () => {
  return dispatch => (
    dispatch({
      type: authAction.LOGIN_CLICK
    })
  );
}

export const handleLoginClose = () => {
  return dispatch => (
    dispatch({
      type: authAction.LOGIN_CLOSE
    })
  )
}

export const handleForgotPasswordClick = () => {
  return dispatch => (
    dispatch({
      type: authAction.FORGOT_PASSWORD_CLICK
    })
  );
}

export const handleForgotPasswordClose = () => {
  return dispatch => (
    dispatch({
      type: authAction.FORGOT_PASSWORD_CLOSE
    })
  );
}

export const handleSignUpClick = () => {
  return dispatch => (
    dispatch({
      type: authAction.SIGNUP_CLICK
    })
  );
}

export const handleSignUpClose = () => {
  return dispatch => (
    dispatch({
      type: authAction.SIGNUP_CLOSE
    })
  );
}

export const handleUnverifiedUser = () => {
  return dispatch => (
    dispatch({
      type: authAction.UNVERIFIED_USER
    })
  );
}

export const handleVerificationClose = () => {
  return dispatch => (
    dispatch({
      type: authAction.VERIFICATION_CLOSE
    })
  );
}

export const handleConfirmationClose = () => {
  return dispatch => (
    dispatch({
      type: authAction.CONFIRMATION_CLOSE
    })
  );
}

//************************* Error Actions *************************//
export const handleError = () => {
  return dispatch => (
    dispatch({
      type: authAction.HANDLE_ERROR
    })
  );
}
