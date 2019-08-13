import * as adminAction from '../actions/adminTypes';

const initialState = {
  doctorCount: 0,
  studentCount: 0,
  requestCount: 0,
  adminErr: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case adminAction.GET_ADMIN_DATA:
      return Object.assign({}, state, {
        doctorCount: action.payload.doctors,
        studentCount: action.payload.students,
        requestCount: action.payload.requests,
        updateDate: action.payload.updateDate
      });
    case adminAction.ADMIN_ERROR:
      return Object.assign({}, state, {
        adminErr: JSON.parse(action.payload.err)
      });
    case adminAction.HANDLE_ERROR:
      return Object.assign({}, state, {
        adminErr: undefined
      });
    default:
      return state;
  }
}