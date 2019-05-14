import * as loadingAction from '../actions/loadingTypes';

const initialState = {
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case loadingAction.LOADING_START:
      return Object.assign({}, state, {
        loading: true
      });
    case loadingAction.LOADING_STOP:
      return Object.assign({}, state, {
        loading: false
      });
    default:
      return state;
  }
}