import * as requestAction from '../actions/requestTypes';

const initialState = {
  requests: [],
  request: {},
  requestErr: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case requestAction.GET_REQUESTS:
      return Object.assign({}, state, {
        requests: action.payload
      });
    case requestAction.DELETE_REQUEST:
      const newRequests = state.requests.filter(req => {
        return req.uuid !== action.payload.requestId;
      });
      return Object.assign({}, state, {
        requests: newRequests
      });
    case requestAction.CREATE_REQUEST:
      return Object.assign({}, state, {
        requests: [...state.requests, action.payload]
      });
    case requestAction.REQUEST_ERROR:
      return Object.assign({}, state, {
        requestErr: JSON.parse(action.payload.err)
      });
    case requestAction.HANDLE_ERROR:
      return Object.assign({}, state, {
        requestErr: undefined
      });
    default:
      return state;
  }
}