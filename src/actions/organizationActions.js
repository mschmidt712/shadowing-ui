import * as orgAction from './organizationTypes';

import { loadingStart, loadingStop } from './loadingActions';
import { baseUrl } from './fetchConstants';

export const getOrganizations = () => {
  return (dispatch) => {
    dispatch(loadingStart());

    const url = `${baseUrl}/organizations`;

    let orgRespStatus;
    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => {
        orgRespStatus = response.ok;

        if (response.status === 404) {
          dispatch({
            type: orgAction.GET_ORGANIZATIONS_FAILURE
          });
          dispatch(loadingStop());
          return;
        }

        return response.json().then(response => {
          if (!orgRespStatus) {
            throw new Error(response.errorMessage);
          }

          dispatch({
            type: orgAction.GET_ORGANIZATIONS,
            payload: JSON.parse(response.body)
          });
          dispatch(loadingStop());
          return;
        })
      })
      .catch(err => {
        dispatch({
          type: orgAction.ORGANIZATION_ERROR,
          payload: {
            err: err.message
          }
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
      type: orgAction.HANDLE_ERROR
    })
  );
}