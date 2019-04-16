import * as authAction from '../actions/authTypes';

const initialState = {
  credentials: {},
  email: '',
  picture: undefined,
  active: false,
  isLoggedIn: false,
  loginMethod: '',
  unverifiedUser: false,
  displayLogin: false,
  displaySignUp: false,
  displayVerification: false,
  displayConfirmation: false,
  displayForgotPassword: false,
  err: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case authAction.LOGIN_USER:
      return Object.assign({}, state, {
        credentials: action.payload.credentials,
        email: action.payload.email,
        active: action.payload.active,
        isLoggedIn: true,
        loginMethod: 'Cognito',
        displayLogin: false
      });
    case authAction.AUTH_ERROR:
      return Object.assign({}, state, {
        err: action.payload.err
      });
    case authAction.CHECK_AUTH_STATUS:
      return Object.assign({}, state, {
        credentials: action.payload.credentials,
        active: action.payload.active,
        isLoggedIn: action.payload.isLoggedIn,
        loginMethod: 'Cognito'
      });
    case authAction.REGISTER_USER:
      return Object.assign({}, state, {
        displaySignUp: false,
        displayVerification: true
      });
    case authAction.RESEND_VERIFICATION:
      return Object.assign({}, state, {
        verificationSent: true
      });
    case authAction.VERIFY_USER:
      return Object.assign({}, state, {
        displayVerification: false,
        displayConfirmation: true,
        isLoggedIn: true,
        loginMethod: 'Cognito',
        active: false
      });
    case authAction.LOGOUT_USER:
      return Object.assign({}, state, {
        isLoggedIn: false
      });
    case authAction.DELETE_USER:
      return Object.assign({}, state, {
        isLoggedIn: false
      });
    case authAction.CONFIRM_PASSWORD:
      return Object.assign({}, state, {
        displayForgotPassword: false,
        displayLogin: true
      });
    case authAction.FACEBOOK_LOGIN_USER:
      return Object.assign({}, state, {
        isLoggedIn: true,
        loginMethod: 'Facebook',
        displayLogin: false,
        email: action.payload.email,
        picture: action.payload.picture
      });
    case authAction.LOGIN_CLICK:
      return Object.assign({}, state, {
        displayLogin: true
      });
    case authAction.LOGIN_CLOSE:
      return Object.assign({}, state, {
        displayLogin: false
      });
    case authAction.FORGOT_PASSWORD_CLICK:
      return Object.assign({}, state, {
        displayLogin: false,
        displayForgotPassword: true
      });
    case authAction.FORGOT_PASSWORD_CLOSE:
      return Object.assign({}, state, {
        displayForgotPassword: false
      });
    case authAction.SIGNUP_CLICK:
      return Object.assign({}, state, {
        displayLogin: false,
        displaySignUp: true
      });
    case authAction.SIGNUP_CLOSE:
      return Object.assign({}, state, {
        displaySignUp: false
      })
    case authAction.UNVERIFIED_USER:
      return Object.assign({}, state, {
        displayLogin: false,
        displayVerification: true,
        unverifiedUser: true,
        err: undefined
      });
    case authAction.VERIFICATION_CLOSE:
      return Object.assign({}, state, {
        displayVerification: false
      });
    case authAction.CONFIRMATION_CLOSE:
      return Object.assign({}, state, {
        displayConfirmation: false
      });
    case authAction.HANDLE_ERROR:
      return Object.assign({}, state, {
        err: undefined
      });
    default:
      return state
  }
}