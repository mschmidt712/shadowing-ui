import * as emailTypes from './emailTypes';

import { loadingStart, loadingStop } from './loadingActions';
import { baseUrl } from './fetchConstants';

export const getEmailTemplates = () => {
  return (dispatch) => {
    dispatch(loadingStart());

    let url = `${baseUrl}/emails`

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
            type: emailTypes.HANDLE_ERROR,
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
        type: emailTypes.GET_EMAIL_TEMPLATES,
        payload: JSON.parse(data.body)
      });
      dispatch(loadingStop());
    });
  }
}

export const updateEmailTemplate = (template) => {
  return (dispatch) => {
    dispatch(loadingStart());
    let url = `${baseUrl}/email`;

    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ template })
    }).then(resp => {
      if (!resp.ok) {
        return resp.json().then(jsonResp => {
          dispatch({
            type: emailTypes.HANDLE_ERROR,
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
        type: emailTypes.UPDATE_EMAIL_TEMPLATE,
        payload: data.body
      });
      dispatch({
        type: emailTypes.SHOW_UPDATE_TEMPLATE_CONFIRMATION
      });
      dispatch(loadingStop());
    });
  };
};

export const handleUpdateTemplateConfirmation = () => {
  return dispatch => {
    return dispatch({
      type: emailTypes.HIDE_UPDATE_TEMPLATE_CONFIRMATION
    });
  }
}

export const sendTestEmail = (email, template) => {
  return (dispatch) => {
    dispatch(loadingStart());
    let url = `${baseUrl}/email/test`;

    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        template
      })
    }).then(resp => {
      if (!resp.ok) {
        return resp.json().then(jsonResp => {
          dispatch({
            type: emailTypes.HANDLE_ERROR,
            payload: {
              err: jsonResp.errorMessage
            }
          });
          dispatch(loadingStop());
          return;
        });
      }

      dispatch({
        type: emailTypes.SEND_TEST_EMAIL
      });
      dispatch(loadingStop());
      alert('Email Successfully Sent.');
    })
  };
};

//************************* Error Actions *************************//
export const handleError = () => {
  return dispatch => (
    dispatch({
      type: emailTypes.HANDLE_ERROR
    })
  );
}
