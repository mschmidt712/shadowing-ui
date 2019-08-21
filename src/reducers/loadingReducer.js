import * as loadingAction from '../actions/loadingTypes';

const initialState = {
  loading: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case loadingAction.LOADING_START:
      return Object.assign({}, state, {
        loading: state.loading + 1
      });
    case loadingAction.LOADING_STOP:
      if (state.loading > 0) {
        return Object.assign({}, state, {
          loading: state.loading - 1
        });
      } else {
        return Object.assign({}, state, {
          loading: 0
        });
      }
    default:
      return state;
  }
}