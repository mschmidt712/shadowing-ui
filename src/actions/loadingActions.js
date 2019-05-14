import * as loadingAction from './loadingTypes';

export const loadingStart = () => {
  return (dispatch) => {
    return dispatch({
      type: loadingAction.LOADING_START
    });
  }
};

export const loadingStop = () => {
  return (dispatch) => {
    return dispatch({
      type: loadingAction.LOADING_STOP
    });
  }
};