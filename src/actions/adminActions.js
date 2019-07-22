import * as adminTypes from './adminTypes';

import { loadingStart, loadingStop } from './loadingActions';
import { baseUrl } from './fetchConstants';

export const getAdminData = () => {
  return (dispatch) => {
    dispatch(loadingStart());

    let url = `${baseUrl}/admin`

    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(resp => {
      if (!resp.ok) {
        return resp.json().then(jsonResp => {
          dispatch({
            type: adminTypes.ADMIN_ERROR,
            payload: {
              err: jsonResp.errorMessage
            }
          });
          dispatch(loadingStop());
          return;
        });
      }

      return resp.json();
    }).then(data => {
      dispatch({
        type: adminTypes.GET_ADMIN_DATA,
        payload: JSON.parse(data.body)
      });
      dispatch(loadingStop());
      return;
    });
  }
}

//************************* Error Actions *************************//
export const handleError = () => {
  return dispatch => (
    dispatch({
      type: adminTypes.HANDLE_ERROR
    })
  );
}
