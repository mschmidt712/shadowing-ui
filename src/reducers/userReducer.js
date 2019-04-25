import * as userAction from '../actions/userTypes';

const initialState = {
  active: false,
  name: '',
  address: '',
  phoneNumber: undefined
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
    default:
      return state;
  }
}