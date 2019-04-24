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
      console.log('Create Student Reducer: ', action.payload);

      return Object.assign({}, state, {
        name: action.payload.name,
        address: action.payload.address,
        phoneNumber: action.payload.phoneNumber,
        active: true
      });
    default:
      return state;
  }
}