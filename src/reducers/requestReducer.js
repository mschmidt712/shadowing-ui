import * as requestAction from '../actions/requestTypes';

const initialState = {
  requests: [],
  request: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case requestAction.GET_REQUESTS:
      return Object.assign({}, state, {
        requests: action.payload
      });
    default:
      return state;
  }
}