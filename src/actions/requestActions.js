import * as requestAction from './requestTypes';

import { loadingStart, loadingStop } from './loadingActions';

const baseUrl = 'https://5hc101yjlj.execute-api.us-east-1.amazonaws.com/Test';

export const getStudentRequests = (id, query) => {
  return (dispatch) => {
    dispatch(loadingStart());

    let requests;
    let url = `${baseUrl}/requests?student=${id}`
    if (query) {
      const queryString = Object.keys(query).map(val => {
        return `${val}=${query[val]}`;
      }, []).join('&');
      url = `${url}&${queryString}`;
    }

    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(response => response.json())
      .then(resp => {
        requests = JSON.parse(resp.body);

        const promises = [];
        requests.forEach(request => {
          const doctor = request.doctor;

          const doctorPromise = new Promise((resolve, reject) => {
            return fetch(`${baseUrl}/doctor/${doctor}`, {
              method: "GET",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              }
            }).then(resp => resp.json())
              .then(resp => {
                const doctor = JSON.parse(resp.body);
                request['doctor'] = doctor;
                resolve(request);
              }).catch(err => {
                reject(err);
              });
          });

          promises.push(doctorPromise);
        });
        return Promise.all(promises);
      }).then(results => {
        dispatch({
          type: requestAction.GET_REQUESTS,
          payload: results
        });
        dispatch(loadingStop());
        return;
      }).catch(err => {
        dispatch({
          type: requestAction.REQUEST_ERROR,
          payload: {
            err
          }
        });
        dispatch(loadingStop());
        return;
      })
  }
}

export const getDoctorRequests = (id, query) => {
  return (dispatch) => {
    dispatch(loadingStart());

    let requests;
    let url = `${baseUrl}/requests?doctor=${id}`
    if (query) {
      const queryString = Object.keys(query).map(val => {
        return `${val}=${query[val]}`;
      }, []).join('&');
      url = `${url}&${queryString}`;
    }

    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(response => response.json())
      .then(resp => {
        requests = JSON.parse(resp.body);

        const promises = [];
        requests.forEach(request => {
          const student = request.student;

          const studentPromise = new Promise((resolve, reject) => {
            return fetch(`${baseUrl}/student/${student}`, {
              method: "GET",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              }
            }).then(resp => resp.json())
              .then(resp => {
                const student = JSON.parse(resp.body);
                request['student'] = student;
                resolve(request);
              }).catch(err => {
                reject(err);
              });
          });

          promises.push(studentPromise);
        });
        return Promise.all(promises);
      }).then(results => {
        dispatch({
          type: requestAction.GET_REQUESTS,
          payload: results
        });
        dispatch(loadingStop());
        return;
      }).catch(err => {
        dispatch({
          type: requestAction.REQUEST_ERROR,
          payload: {
            err
          }
        });
        dispatch(loadingStop());
        return;
      })
  }
}

export const deleteRequest = (requestId) => {
  return (dispatch) => {
    dispatch(loadingStart());

    let url = `${baseUrl}/request/${requestId}`

    return fetch(url, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(() => {
      dispatch({
        type: requestAction.DELETE_REQUEST,
        payload: { requestId }
      });
      dispatch(loadingStop());
      return;
    }).catch(err => {
      dispatch({
        type: requestAction.REQUEST_ERROR,
        payload: {
          err
        }
      });
      dispatch(loadingStop());
      return;
    })
  }
}

export const createRequest = (requestData) => {
  return (dispatch) => {
    dispatch(loadingStart());

    let url = `${baseUrl}/request`;

    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ request: requestData })
    }).then((resp) => {
      if (resp.status !== 201) {
        return resp.json();
      }

      dispatch({
        type: requestAction.CREATE_REQUEST,
        payload: requestData
      });
      dispatch(loadingStop());
      return;
    }).then(resp => {
      dispatch({
        type: requestAction.REQUEST_ERROR,
        payload: {
          err: resp.errorMessage
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
      type: requestAction.HANDLE_ERROR
    })
  );
}
