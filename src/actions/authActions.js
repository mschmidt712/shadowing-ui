import { AuthenticationDetails, CognitoUserPool, CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { push } from 'connected-react-router';
import AWS from 'aws-sdk';

import * as authAction from './authTypes';
import * as userAction from './userTypes';
import awsData from '../aws-config.json';

import { getStudent, getDoctor } from './userActions';
import { loadingStart, loadingStop } from './loadingActions';
import { getStudentRequests, getDoctorRequests } from './requestActions';

const poolData = {
  UserPoolId: awsData['pool-id'],
  ClientId: awsData['app-client']
};

//************************* Authentication Actions *************************//
export const loginUser = (email, password) => {
  return (dispatch) => {
    dispatch(loadingStart());

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
      newPasswordRequired: function (userAttributes, requiredAttributes) {
        delete userAttributes.email_verified;

        const newPassword = prompt('Please enter a new password below: ')
        cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
      },
      onSuccess: (authResult) => {
        let credentials;
        return getUserCredentials(authResult)
          .then(creds => {
            credentials = creds;

            return retrieveUserAttributes(cognitoUser);
          }).then(attributes => {
            if (attributes['custom:occupation'] === 'student') {
              dispatch(getStudent(attributes.sub));
              dispatch(getStudentRequests(attributes.sub));
            } else if (attributes['custom:occupation'] === 'doctor') {
              dispatch(getDoctor(attributes.sub));
              dispatch(getDoctorRequests(attributes.sub));
            }

            if (attributes['sub'] === '6e3a3ee5-a29e-408e-93cf-dc95b2c0f819') {
              dispatch({
                type: authAction.IS_ADMIN
              });
              dispatch(push(`/admin`));

              attributes['custom:occupation'] = 'admin';
            }

            dispatch({
              type: authAction.LOGIN_USER,
              payload: {
                credentials,
                email,
                occupation: attributes['custom:occupation'],
                id: attributes.sub
              }
            });
            dispatch(loadingStop());
            return;
          });
      },
      onFailure: (err) => {
        dispatch({
          type: authAction.AUTH_ERROR,
          payload: {
            err
          }
        });
        dispatch(loadingStop());
        return;
      }
    });
  }
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
  params.Logins[`cognito-idp.${awsData['region']}.amazonaws.com/${awsData['pool-id']}`] = session.getIdToken().getJwtToken()
  AWS.config.credentials = new AWS.CognitoIdentityCredentials(params, { region: awsData['region'] });
  return new Promise((resolve, reject) => {
    return AWS.config.credentials.refresh(err => {
      if (err) { return reject(err) };
      return resolve(AWS.config.credentials);
    });
  });
}

export const logoutUser = () => {
  return (dispatch) => {
    dispatch(loadingStart());

    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();

    return new Promise((resolve, reject) => {
      return cognitoUser.getSession((err, session) => {
        if (err) {
          return reject(err);
        }

        return resolve(session);
      });
    }).then(session => {
      const params = {
        IdentityPoolId: awsData['identity-pool-id'],
        Logins: {}
      };
      params.Logins[`cognito-idp.${awsData['region']}.amazonaws.com/${awsData['pool-id']}`] = session.getIdToken().getJwtToken()
      AWS.config.credentials = new AWS.CognitoIdentityCredentials(params, { region: awsData['region'] });
      AWS.config.credentials.clearCachedId();

      cognitoUser.signOut();

      dispatch({
        type: authAction.LOGOUT_USER
      });
      dispatch({
        type: userAction.CLEAR_USER
      });
      dispatch(push('/'));
      dispatch(loadingStop());
      return;
    }).catch(err => {
      dispatch({
        type: authAction.AUTH_ERROR,
        payload: {
          err
        }
      });
      dispatch(loadingStop());
      return;
    });
  }
}

export const checkAuthStatus = () => {
  return (dispatch) => {
    dispatch(loadingStart());
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
        if (attributes['custom:occupation'] === 'student') {
          dispatch(getStudent(attributes.sub));
          dispatch(getStudentRequests(attributes.sub));
        } else if (attributes['custom:occupation'] === 'doctor') {
          dispatch(getDoctor(attributes.sub));
          dispatch(getDoctorRequests(attributes.sub));
        }

        if (attributes['sub'] === '6e3a3ee5-a29e-408e-93cf-dc95b2c0f819') {
          dispatch({
            type: authAction.IS_ADMIN
          });
          dispatch(push(`/admin/pending-doctors`));
          attributes['custom:occupation'] = 'admin';
        }

        dispatch({
          type: authAction.CHECK_AUTH_STATUS,
          payload: {
            isLoggedIn: true,
            email: attributes.email,
            occupation: attributes['custom:occupation'],
            id: attributes.sub,
            credentials
          }
        });
        dispatch(loadingStop());
        return;
      }).catch(err => {
        dispatch({
          type: authAction.AUTH_ERROR,
          payload: {
            err
          }
        });
        dispatch(loadingStop());
        return;
      });
    } else {
      dispatch({
        type: authAction.CHECK_AUTH_STATUS,
        payload: {
          isLoggedIn: false
        }
      });
      dispatch(loadingStop());
      return;
    }
  }
}

export const registerUser = (email, password, occupation) => {
  return (dispatch) => {
    dispatch(loadingStart());
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
      dispatch({
        type: authAction.REGISTER_USER
      });
      dispatch(loadingStop());
      return;
    }).catch(err => {
      dispatch({
        type: authAction.AUTH_ERROR,
        payload: {
          err
        }
      });
      dispatch(loadingStop());
    })
  }
}

export const verifyUser = (email, password, verification, occupation) => {
  return (dispatch) => {
    dispatch(loadingStart());

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

      return dispatch(loginUser(email, password));
    }).then(() => {
      dispatch({
        type: authAction.VERIFY_USER,
        payload: {
          occupation
        }
      });
      dispatch(loadingStop());
      return;
    }
    ).catch(err => {
      dispatch({
        type: authAction.AUTH_ERROR,
        payload: {
          err
        }
      });
      dispatch(loadingStop());
      return;
    });
  }
}

export const updateEmailAttribute = (email) => {
  return dispatch => {
    dispatch(loadingStart());

    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();

    const attributeList = [];
    const attribute = new CognitoUserAttribute({
      Name: 'email',
      Value: email
    });
    attributeList.push(attribute);

    return new Promise((resolve, reject) => {
      return cognitoUser.getSession((err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    }).then(() => {
      return new Promise((resolve, reject) => {
        cognitoUser.updateAttributes(attributeList, function (err, result) {
          if (err) {
            return reject(err);
          }
          return resolve();
        });
      });
    }).then(() => {
      dispatch({
        type: authAction.UPDATE_EMAIL_ATTRIBUTE,
        payload: email
      });
      dispatch(loadingStop());
      return;
    }).catch(err => {
      dispatch({
        type: authAction.AUTH_ERROR,
        payload: {
          err
        }
      });
      dispatch(loadingStop());
      return;
    });
  }
}

export const verifyNewEmail = (verification) => {
  return (dispatch) => {
    dispatch(loadingStart());

    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();

    return new Promise((resolve, reject) => {
      return cognitoUser.getSession(err => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    }).then(() => {
      return new Promise((resolve, reject) => {
        return cognitoUser.verifyAttribute('email', verification, {
          onSuccess: (resp) => {
            return resolve(resp);
          },
          onFailure: (err) => {
            return reject(err);
          }
        })
      });
    }).then(() => {
      dispatch({
        type: authAction.VERIFICATION_CLOSE
      });
      dispatch(loadingStop());
      return;
    }).catch(err => {
      dispatch({
        type: authAction.AUTH_ERROR,
        payload: {
          err
        }
      });
      dispatch(loadingStop());
      return;
    })
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
    }).then(() => {
      dispatch({
        type: authAction.RESEND_VERIFICATION
      });
      dispatch(loadingStop());
      return;
    }).catch(err => {
      dispatch({
        type: authAction.AUTH_ERROR,
        payload: {
          err
        }
      });
      dispatch(loadingStop());
    });
  }
}

export const changePassword = (oldPassword, newPassword) => {
  return dispatch => {
    dispatch(loadingStart());

    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();
    return new Promise((resolve, reject) => {
      cognitoUser.getSession((err, session) => {
        if (err) {
          return reject(err)
        }

        return resolve(session);
      });
    }).then(() => {
      return new Promise((resolve, reject) => {
        cognitoUser.changePassword(oldPassword, newPassword, function (err, result) {
          if (err) {
            return reject(err);
          }
          return resolve()
        });
      });
    }).then(() => {
      dispatch({
        type: authAction.CHANGE_PASSWORD
      });
      dispatch(loadingStop());
      return;
    }).catch(err => {
      dispatch({
        type: authAction.AUTH_ERROR,
        payload: {
          err
        }
      });
      dispatch(loadingStop());
      return;
    });
  };
}

export const forgotPassword = (email) => {
  return dispatch => {
    dispatch(loadingStart());

    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    cognitoUser.forgotPassword({
      onSuccess: function (data) {
        alert('Verification Code Sent!');

        dispatch({
          type: authAction.FORGOT_PASSWORD
        });
        dispatch(loadingStop());
        return;
      },
      onFailure: function (err) {
        dispatch({
          type: authAction.AUTH_ERROR,
          payload: {
            err
          }
        });
        dispatch(loadingStop());
        return;
      }
    });
  }
}

export const confirmPasswordReset = (email, verification, newPassword) => {
  return dispatch => {
    dispatch(loadingStart());

    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    cognitoUser.confirmPassword(verification, newPassword, {
      onSuccess() {
        alert('Password Successfully Reset!');

        dispatch({
          type: authAction.CONFIRM_PASSWORD
        });
        dispatch(loadingStop());
        return;
      },
      onFailure(err) {
        dispatch({
          type: authAction.AUTH_ERROR,
          payload: {
            err
          }
        });
        dispatch(loadingStop());
        return;
      }
    });
  }
}

export const deleteUser = () => {
  return (dispatch) => {
    dispatch(loadingStart());

    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();
    cognitoUser.deleteUser(function (err, result) {
      if (err) {
        dispatch({
          type: authAction.AUTH_ERROR,
          payload: {
            err
          }
        });
        dispatch(loadingStop());
        return;
      }

      dispatch({
        type: authAction.DELETE_USER
      });
      dispatch(loadingStop());
      return;
    });
  }
}

//************************* Facebook Authentication Actions *************************//
export const facebookLoginUser = (email, picture, token, id) => {
  return dispatch => {
    dispatch(loadingStart());

    return getFacebookUserCredentials(token).then(credentials => {
      dispatch(getStudent(id));
      dispatch(getStudentRequests(id));

      dispatch({
        type: authAction.FACEBOOK_LOGIN_USER,
        payload: {
          credentials,
          id,
          email,
          picture
        }
      });
      dispatch(loadingStop());
      return;
    }).catch(err => {
      dispatch({
        type: authAction.AUTH_ERROR,
        payload: {
          err
        }
      });
      dispatch(loadingStop());
      return;
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

  return dispatch => {
    dispatch({
      type: authAction.FACEBOOK_LOGOUT_USER
    });
    dispatch({
      type: userAction.CLEAR_USER
    });
    dispatch(push('/'));
  }
}

//************************* Google Authentication Actions *************************//
export const googleLoginUser = (email, picture, token, id) => {
  return dispatch => {
    dispatch(loadingStart());

    return getGoogleUserCredentials(token).then(credentials => {
      dispatch(getStudent(id));
      dispatch(getStudentRequests(id));

      dispatch({
        type: authAction.GOOGLE_LOGIN_USER,
        payload: {
          credentials,
          email,
          picture,
          id
        }
      });
      dispatch(loadingStop());
      return;
    }).catch(err => {
      dispatch({
        type: authAction.AUTH_ERROR,
        payload: {
          err
        }
      });
      dispatch(loadingStop());
      return;
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
  return dispatch => {
    dispatch({
      type: authAction.GOOGLE_LOGOUT_USER
    });
    dispatch({
      type: userAction.CLEAR_USER
    });
    dispatch(push('/'));
  }
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
