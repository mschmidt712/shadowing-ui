import * as userAction from '../actions/userTypes';

const initialState = {
  active: false,
  name: '',
  address: '',
  phoneNumber: undefined,
  hipaaCert: undefined,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case userAction.CREATE_STUDENT:
      return Object.assign({}, state, {
        name: action.payload.name,
        address: action.payload.address,
        phoneNumber: action.payload.phoneNumber,
        hipaaCert: action.payload.hipaaCert,
        active: true
      });
    case userAction.UPDATE_STUDENT:
      return Object.assign({}, state, {
        name: action.payload.name,
        address: action.payload.address,
        phoneNumber: action.payload.phoneNumber,
        hipaaCert: action.payload.hipaaCert,
        active: true
      });
    case userAction.GET_STUDENT_SUCCESS:
      return Object.assign({}, state, {
        name: action.payload.name,
        address: action.payload.address,
        phoneNumber: action.payload.phoneNumber,
        hipaaCert: action.payload.hipaaCert,
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
        active: true
      });
    case userAction.UPDATE_DOCTOR:
      return Object.assign({}, state, {
        name: action.payload.name,
        degree: action.payload.degree,
        address: action.payload.address,
        specialty: action.payload.specialty,
        approved: action.payload.approved,
        active: true
      });
    case userAction.GET_DOCTOR_SUCCESS:
      return Object.assign({}, state, {
        name: action.payload.name,
        degree: action.payload.degree,
        address: action.payload.address,
        specialty: action.payload.specialty,
        approved: action.payload.approved,
        active: true
      });
    case userAction.GET_DOCTOR_FAILURE:
      return Object.assign({}, state, {
        active: false
      });
    default:
      return state;
  }
}