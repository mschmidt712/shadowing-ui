import * as requestAction from './requestTypes';

import { loadingStart, loadingStop } from './loadingActions';
import { baseUrl } from './fetchConstants';

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

    let requestPromiseStatus;
    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(response => {
      requestPromiseStatus = response.ok;
      return response.json();
    }).then(resp => {
      if (!requestPromiseStatus) {
        throw new Error(resp.errorMessage);
      }

      requests = JSON.parse(resp.body);

      const promises = [];
      requests.forEach(request => {
        const doctor = request.doctor;
        let doctorPromiseStatus;

        const doctorPromise = new Promise((resolve, reject) => {
          return fetch(`${baseUrl}/doctor/${doctor}`, {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            }
          }).then(resp => {
            doctorPromiseStatus = resp.ok;
            return resp.json();
          }).then(resp => {
            if (!doctorPromiseStatus) {
              return reject(resp.errorMessage);
            }

            const doctor = JSON.parse(resp.body);
            request['doctor'] = doctor;
            resolve(request);
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
          err: err.message
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

    let requestPromiseStatus;
    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(response => {
      requestPromiseStatus = response.ok;
      return response.json()
    }).then(resp => {
      if (!requestPromiseStatus) {
        throw new Error(resp.errorMessage);
      }

      requests = JSON.parse(resp.body);

      const promises = [];
      requests.forEach(request => {
        const student = request.student;

        let studentPromiseStatus;
        const studentPromise = new Promise((resolve, reject) => {
          return fetch(`${baseUrl}/student/${student}`, {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            }
          }).then(resp => {
            studentPromiseStatus = resp.ok;
            return resp.json();
          }).then(resp => {
            if (!studentPromiseStatus) {
              return reject(resp.errorMessage);
            }

            const student = JSON.parse(resp.body);
            request['student'] = student;
            resolve(request);
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
          err: err.message
        }
      });
      dispatch(loadingStop());
      return;
    })
  }
}

export const changeRequestStatus = (request, status) => {
  return (dispatch) => {
    dispatch(loadingStart());

    let url = `${baseUrl}/request`
    const requestData = Object.assign({}, request, {
      student: request.student.id,
      status
    });

    return fetch(url, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ request: requestData })
    }).then(resp => {
      if (!resp.ok) {
        return resp.json().then(jsonResp => {
          dispatch({
            type: requestAction.REQUEST_ERROR,
            payload: {
              err: jsonResp.errorMessage
            }
          });
          dispatch(loadingStop());
          return;
        });
      }

      let studentPromiseStatus;
      return new Promise((resolve, reject) => {
        return fetch(`${baseUrl}/student/${requestData.student}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          }
        }).then(resp => {
          studentPromiseStatus = resp.ok;
          return resp.json();
        }).then(resp => {
          if (!studentPromiseStatus) {
            return reject(resp.errorMessage);
          }

          const student = JSON.parse(resp.body);
          requestData.student = student;
          resolve(requestData);
        });
      });
    }).then(request => {
      console.log('Final Request: ', request);

      dispatch({
        type: requestAction.CHANGE_REQUEST_STATUS,
        payload: requestData
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
    });
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
    }).then(resp => {
      if (!resp.ok) {
        return resp.json().then(jsonResp => {
          dispatch({
            type: requestAction.REQUEST_ERROR,
            payload: {
              err: jsonResp.errorMessage
            }
          });
          dispatch(loadingStop());
          return;
        });
      }

      dispatch({
        type: requestAction.DELETE_REQUEST,
        payload: { requestId }
      });
      dispatch(loadingStop());
      return;
    });
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
      if (!resp.ok) {
        return resp.json().then(resp => {
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

      dispatch({
        type: requestAction.CREATE_REQUEST,
        payload: requestData
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
