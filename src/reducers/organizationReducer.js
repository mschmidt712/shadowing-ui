import * as organizationAction from '../actions/organizationTypes';

const initialState = {
  organizations: [],
  organizationErr: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case organizationAction.GET_ORGANIZATIONS:
      return Object.assign({}, state, {
        organizations: action.payload
      });
    case organizationAction.ORGANIZATION_ERROR:
      let err;
      try {
        err = JSON.parse(action.payload.err)
      } catch {
        err = action.payload.err
      }

      return Object.assign({}, state, {
        organizationErr: err
      });
    case organizationAction.HANDLE_ERROR:
      return Object.assign({}, state, {
        organizationErr: undefined
      });
    default:
      return state;
  }
}