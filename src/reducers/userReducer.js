import * as userAction from '../actions/userTypes';

const initialState = {
  active: false,
  name: '',
  address: '',
  phoneNumber: undefined,
  hipaaCert: undefined,
  doctors: [],
  userErr: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case userAction.CREATE_STUDENT:
      return Object.assign({}, state, {
        name: action.payload.name,
        address: action.payload.address,
        phoneNumber: action.payload.phoneNumber,
        hipaaCert: action.payload.hipaaCert,
        requests: action.payload.requests,
        active: true
      });
    case userAction.UPDATE_STUDENT:
      return Object.assign({}, state, {
        name: action.payload.name,
        address: action.payload.address,
        phoneNumber: action.payload.phoneNumber,
        hipaaCert: action.payload.hipaaCert,
        requests: action.payload.requests,
        active: true
      });
    case userAction.GET_STUDENT_SUCCESS:
      return Object.assign({}, state, {
        name: action.payload.name,
        address: action.payload.address,
        phoneNumber: action.payload.phoneNumber,
        hipaaCert: action.payload.hipaaCert,
        requests: action.payload.requests,
        active: true
      });
    case userAction.GET_STUDENT_FAILURE:
      return Object.assign({}, state, {
        active: false
      });
    case userAction.CREATE_DOCTOR:
      return Object.assign({}, state, {
        name: action.payload.name,
        degree: action.payload.degree,
        address: action.payload.address,
        specialty: action.payload.specialty,
        approved: action.payload.approved,
        maxRequests: action.payload.maxRequests,
        scheduling: action.payload.scheduling,
        shiftLength: action.payload.shiftLength,
        additionalComments: action.payload.additionalComments,
        badgePhoto: action.payload.badgePhoto,
        requests: action.payload.requests,
        active: true
      });
    case userAction.UPDATE_DOCTOR:
      return Object.assign({}, state, {
        name: action.payload.name,
        degree: action.payload.degree,
        address: action.payload.address,
        specialty: action.payload.specialty,
        approved: action.payload.approved,
        maxRequests: action.payload.maxRequests,
        scheduling: action.payload.scheduling,
        shiftLength: action.payload.shiftLength,
        additionalComments: action.payload.additionalComments,
        badgePhoto: action.payload.badgePhoto,
        requests: action.payload.requests,
        active: true
      });
    case userAction.GET_DOCTOR_SUCCESS:
      return Object.assign({}, state, {
        name: action.payload.name,
        degree: action.payload.degree,
        address: action.payload.address,
        specialty: action.payload.specialty,
        approved: action.payload.approved,
        maxRequests: action.payload.maxRequests,
        scheduling: action.payload.scheduling,
        shiftLength: action.payload.shiftLength,
        additionalComments: action.payload.additionalComments,
        badgePhoto: action.payload.badgePhoto,
        requests: action.payload.requests,
        active: true
      });
    case userAction.GET_DOCTOR_FAILURE:
      return Object.assign({}, state, {
        active: false
      });
    case userAction.GET_DOCTORS:
      return Object.assign({}, state, {
        doctors: action.payload
      });
    case userAction.GET_DOCTORS_FAILURE:
      return Object.assign({}, state, {
        doctors: []
      });
    case userAction.CLEAR_USER:
      return initialState;
    case userAction.USER_ERROR:
      let err;
      try {
        err = JSON.parse(action.payload.err)
      } catch {
        err = action.payload.err
      }

      return Object.assign({}, state, {
        userErr: err
      });
    case userAction.HANDLE_ERROR:
      return Object.assign({}, state, {
        userErr: undefined
      });
    default:
      return state;
  }
}