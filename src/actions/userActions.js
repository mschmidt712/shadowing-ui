import { push } from 'connected-react-router';
import AWS from 'aws-sdk';
import * as userAction from './userTypes';

const baseUrl = 'https://5hc101yjlj.execute-api.us-east-1.amazonaws.com/Test';

export const createStudent = (data) => {
  return (dispatch) => {
    const url = `${baseUrl}/student`;

    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(() => {
        dispatch({
          type: userAction.CREATE_STUDENT,
          payload: data.student
        });
        dispatch(push(`/user?${data.student.id}`));
        return;
      })
      .catch(err => console.error(err));
  }
}

export const updateStudent = (data) => {
  return (dispatch) => {
    const url = `${baseUrl}/student`;

    return fetch(url, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(() => {
        dispatch({
          type: userAction.UPDATE_STUDENT,
          payload: data.student
        });
        dispatch(push(`/user?${data.student.id}`));
        return;
      })
      .catch(err => console.error(err));
  }
}

export const getStudent = (id) => {
  return (dispatch) => {
    const url = `${baseUrl}/student/${id}`;

    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => {
        if (response.status === 404) {
          dispatch({
            type: userAction.GET_STUDENT_FAILURE
          });
          dispatch(push('/sign-up/student'));
          return;
        }

        return response.json().then(response => {
          return dispatch({
            type: userAction.GET_STUDENT_SUCCESS,
            payload: JSON.parse(response.body)
          });
        })
      })
      .catch(err => {
        console.error(err);
      });
  }
}

export const createDoctor = (data, credentials) => {
  return (dispatch) => {
    const url = `${baseUrl}/doctor`;
    let badgePhoto;

    var s3 = new AWS.S3({
      region: 'us-east-1',
      credentials
    });
    var params = { Bucket: 'physician-badge-image', Key: `${data.id}.jpg`, Body: data.badgePhoto };
    var options = { partSize: 10 * 1024 * 1024, queueSize: 1 };

    return new Promise((resolve, reject) => {
      return s3.upload(params, options, function (err, data) {
        if (err) {
          return reject(err);
        }
        return resolve(data.Location);
      });
    }).then(photoUpload => {
      badgePhoto = photoUpload;
      const bodyData = Object.assign({}, data, {
        badgePhoto
      });

      return fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctor: bodyData }),
      })
    }).then(response => response.json())
      .then(() => {
        dispatch({
          type: userAction.CREATE_DOCTOR,
          payload: {
            ...data,
            badgePhoto
          }
        });
        dispatch(push(`/user?${data.id}`));
        return;
      })
      .catch(err => console.error(err));
  }
}


export const updateDoctor = (data, credentials) => {
  return (dispatch) => {
    const url = `${baseUrl}/doctor`;
    let badgePhoto;

    var s3 = new AWS.S3({
      region: 'us-east-1',
      credentials
    });
    var params = { Bucket: 'physician-badge-image', Key: `${data.id}.jpg`, Body: data.badgePhoto };
    var options = { partSize: 10 * 1024 * 1024, queueSize: 1 };

    return new Promise((resolve, reject) => {
      return s3.upload(params, options, function (err, data) {
        if (err) {
          return reject(err);
        }
        return resolve(data.Location);
      });
    }).then(photoUpload => {
      badgePhoto = photoUpload;
      const bodyData = Object.assign({}, data, {
        badgePhoto
      });

      return fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctor: bodyData }),
      })
    }).then(response => response.json())
      .then(() => {
        dispatch({
          type: userAction.UPDATE_DOCTOR,
          payload: {
            ...data,
            badgePhoto
          }
        });
        dispatch(push(`/user?${data.id}`));
        return;
      })
      .catch(err => console.error(err));
  }
}

export const getDoctor = (id) => {
  return (dispatch) => {
    const url = `${baseUrl}/doctor/${id}`;

    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => {
        if (response.status === 404) {
          dispatch({
            type: userAction.GET_DOCTOR_FAILURE
          });
          dispatch(push('/sign-up/doctor'));
          return;
        }

        return response.json().then(response => {
          return dispatch({
            type: userAction.GET_DOCTOR_SUCCESS,
            payload: JSON.parse(response.body)
          });
        })
      })
      .catch(err => {
        console.error(err);
      });
  }
}


export const getDoctors = (query) => {
  return (dispatch) => {
    let url = `${baseUrl}/doctors`;
    let queryString;
    if (query) {
      queryString = Object.keys(query).map(val => {
        return `${val}=${query[val]}`;
      }, []).join('&');
      url = `${url}?${queryString}`;
    }

    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => {
        if (response.status === 404) {
          dispatch({
            type: userAction.GET_DOCTORS_FAILURE
          });
          return;
        }

        return response.json().then(response => {
          dispatch({
            type: userAction.GET_DOCTORS,
            payload: JSON.parse(response.body)
          });
          dispatch(push(`/search?${queryString}`));
        });
      })
      .catch(err => {
        console.error(err);
      });
  }
}

export const clearUser = () => {
  return (dispatch) => {
    dispatch({
      type: userAction.CLEAR_USER
    })
  }
}