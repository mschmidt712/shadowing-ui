import { push } from 'connected-react-router';
import AWS from 'aws-sdk';
import * as userAction from './userTypes';

import { loadingStart, loadingStop } from './loadingActions';
import { baseUrl } from './fetchConstants';

function uploadCV(data, credentials) {
  var s3 = new AWS.S3({
    region: 'us-east-1',
    credentials
  });
  var params = { Bucket: 'student-cv-upload', Key: `${data.id}.pdf`, Body: data.cv };
  var options = { partSize: 10 * 1024 * 1024, queueSize: 1 };

  return new Promise((resolve, reject) => {
    return s3.upload(params, options, function (err, data) {
      if (err) {
        return reject(err);
      }
      return resolve(data.Location);
    });
  }).then(uploadLocation => {
    return uploadLocation;
  }).catch(err => {
    throw new Error(err);
  });
}

export const createStudent = (data, credentials) => {
  return (dispatch) => {
    dispatch(loadingStart());

    const url = `${baseUrl}/student`;

    let studentRespStatus, cvLocation;
    return uploadCV(data, credentials).then(cvLocation => {
      cvLocation = cvLocation;
      const bodyData = Object.assign({}, data, {
        cv: cvLocation
      });

      return fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student: bodyData }),
      });
    }).then(response => {
      studentRespStatus = response.ok;
      return response.json();
    }).then(resp => {
      if (!studentRespStatus) {
        throw new Error(resp.errorMessage)
      }

      dispatch({
        type: userAction.CREATE_STUDENT,
        payload: {
          ...data,
          cv: cvLocation
        }
      });
      dispatch(push(`/user?${data.id}`));
      dispatch(loadingStop());
      return;
    }).catch(err => {
      dispatch({
        type: userAction.USER_ERROR,
        payload: {
          err: err.message
        }
      });
      dispatch(loadingStop());
      return;
    });
  }
}

export const updateStudent = (data, credentials) => {
  return (dispatch) => {
    dispatch(loadingStart());

    const url = `${baseUrl}/student`;

    let studentRespStatus;
    let cv = data.cv instanceof File ? data.cv : undefined;
    return new Promise(resolve => {
      if (cv) {
        return uploadCV(data, credentials).then(cvLocation => resolve(cvLocation));
      } else {
        return resolve();
      }
    }).then(cvLocation => {
      if (cvLocation) {
        data.cv = cvLocation
      }

      return fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student: data }),
      });
    }).then(response => {
      studentRespStatus = response.ok;
      return response.json();
    }).then(resp => {
      if (!studentRespStatus) {
        throw new Error(resp.errorMessage);
      }

      dispatch({
        type: userAction.UPDATE_STUDENT,
        payload: JSON.parse(resp.body)
      });
      dispatch(push(`/user?${data.id}`));
      dispatch(loadingStop());
      return;
    })
      .catch(err => {
        dispatch({
          type: userAction.USER_ERROR,
          payload: {
            err: err.message
          }
        });
        dispatch(loadingStop());
        return;
      });
  }
}

export const getStudent = (id) => {
  return (dispatch) => {
    dispatch(loadingStart());

    const url = `${baseUrl}/student/${id}`;

    let studentRespStatus;
    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => {
        studentRespStatus = response.ok;

        if (response.status === 404) {
          dispatch({
            type: userAction.GET_STUDENT_FAILURE
          });
          dispatch(push('/sign-up/student'));
          dispatch(loadingStop());
          return;
        }

        return response.json().then(response => {
          if (!studentRespStatus) {
            throw new Error(response.errorMessage);
          }

          dispatch({
            type: userAction.GET_STUDENT_SUCCESS,
            payload: JSON.parse(response.body)
          });
          dispatch(loadingStop());
          return;
        })
      })
      .catch(err => {
        dispatch({
          type: userAction.USER_ERROR,
          payload: {
            err: err.message
          }
        });
        dispatch(loadingStop());
        return;
      });
  }
}


export const getStudents = () => {
  return (dispatch) => {
    dispatch(loadingStart());

    const url = `${baseUrl}/students`;

    let studentRespStatus;
    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => {
        studentRespStatus = response.ok;

        if (response.status === 404) {
          dispatch({
            type: userAction.GET_STUDENTS_FAILURE
          });
          dispatch(loadingStop());
          return;
        }

        return response.json().then(response => {
          if (!studentRespStatus) {
            throw new Error(response.errorMessage);
          }

          dispatch({
            type: userAction.GET_STUDENTS,
            payload: JSON.parse(response.body)
          });
          dispatch(loadingStop());
          return;
        })
      })
      .catch(err => {
        dispatch({
          type: userAction.USER_ERROR,
          payload: {
            err: err.message
          }
        });
        dispatch(loadingStop());
        return;
      });
  }
}

function uploadBadgePhoto(data, credentials) {
  const s3 = new AWS.S3({
    region: 'us-east-1',
    credentials
  });
  const params = { Bucket: 'physician-badge-images', Key: `${data.id}.jpg`, Body: data.badgePhoto };
  const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };

  return new Promise((resolve, reject) => {
    return s3.upload(params, options, function (err, data) {
      if (err) {
        return reject(err);
      }
      return resolve(data.Location);
    });
  }).then(uploadLocation => {
    return uploadLocation;
  }).catch(err => {
    throw new Error(err);
  });
}


export const createDoctor = (data, credentials) => {
  return (dispatch) => {
    dispatch(loadingStart());

    const url = `${baseUrl}/doctor`;

    let doctorRespStatus, badgePhotoLocation;
    return uploadBadgePhoto(data, credentials).then(photoUpload => {
      badgePhotoLocation = photoUpload;
      const bodyData = Object.assign({}, data, {
        badgePhoto: badgePhotoLocation
      });

      return fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctor: bodyData }),
      })
    }).then(response => {
      doctorRespStatus = response.ok;
      return response.json();
    }).then(resp => {
      if (!doctorRespStatus) {
        throw new Error(resp.errorMessage);
      }

      dispatch({
        type: userAction.CREATE_DOCTOR,
        payload: {
          ...data,
          badgePhoto: badgePhotoLocation
        }
      });
      dispatch(push(`/user?${data.id}`));
      dispatch(loadingStop());
      return;
    }).catch(err => {
      dispatch({
        type: userAction.USER_ERROR,
        payload: {
          err: err.message
        }
      });
      dispatch(loadingStop());
      return;
    });
  }
}

export const updateDoctor = (data, credentials) => {
  return (dispatch) => {
    dispatch(loadingStart());
    const url = `${baseUrl}/doctor`;

    let doctorRespStatus;
    let badgePhoto = data.badgePhoto instanceof File ? data.badgePhoto : undefined;
    return new Promise(resolve => {
      if (badgePhoto) {
        return uploadBadgePhoto(data, credentials).then(badgePhotoLocation => resolve(badgePhotoLocation));
      } else {
        return resolve();
      }
    }).then(badgePhotoLocation => {
      if (badgePhotoLocation) {
        data.badgePhoto = badgePhotoLocation;
      }

      return fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctor: data }),
      });
    }).then(response => {
      doctorRespStatus = response.ok;
      return response.json();
    }).then(resp => {
      if (!doctorRespStatus) {
        throw new Error(resp.errorMessage);
      }

      dispatch({
        type: userAction.UPDATE_DOCTOR,
        payload: JSON.parse(resp.body)
      });
      dispatch(push(`/user?${data.id}`));
      dispatch(loadingStop());
      return;
    }).catch(err => {
      dispatch({
        type: userAction.USER_ERROR,
        payload: {
          err: err.message
        }
      });
      dispatch(loadingStop());
      return;
    });
  }
}

export const approveDoctor = (doctor) => {
  return (dispatch) => {
    dispatch(loadingStart());
    const url = `${baseUrl}/doctor`;

    const bodyData = Object.assign({}, doctor, {
      approved: true
    });
    let doctorRespStatus;
    return fetch(url, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ doctor: bodyData }),
    }).then(response => {
      doctorRespStatus = response.ok;
      return response.json();
    }).then(resp => {
      if (!doctorRespStatus) {
        throw new Error(resp.errorMessage);
      }

      dispatch({
        type: userAction.UPDATE_DOCTOR,
        payload: JSON.parse(resp.body)
      });
      dispatch(getDoctorsForApproval());
      dispatch(loadingStop());
      return;
    }).catch(err => {
      dispatch({
        type: userAction.USER_ERROR,
        payload: {
          err: err.message
        }
      });
      dispatch(loadingStop());
      return;
    });
  }
}

export const getDoctor = (id) => {
  return (dispatch) => {
    dispatch(loadingStart());

    const url = `${baseUrl}/doctor/${id}`;

    let doctorRespStatus;
    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(response => {
      doctorRespStatus = response.ok;

      if (response.status === 404) {
        dispatch({
          type: userAction.GET_DOCTOR_FAILURE
        });
        dispatch(push('/sign-up/doctor'));
        dispatch(loadingStop());
        return;
      }

      return response.json().then(response => {
        if (!doctorRespStatus) {
          throw new Error(response.errorMessage);
        }

        dispatch({
          type: userAction.GET_DOCTOR_SUCCESS,
          payload: JSON.parse(response.body)
        });
        dispatch(loadingStop());
        return;
      })
    }).catch(err => {
      dispatch({
        type: userAction.USER_ERROR,
        payload: {
          err: err.message
        }
      });
      dispatch(loadingStop());
      return;
    });
  }
}

export const getDoctors = (query) => {
  return (dispatch) => {
    dispatch(loadingStart());

    let url = `${baseUrl}/doctors`;
    let queryString;
    if (query) {
      queryString = Object.keys(query)
        .map(val => {
          let queryVal;
          if (typeof query[val] === 'object') {
            queryVal = encodeURI(encodeURIComponent(JSON.stringify(query[val])));
          } else {
            queryVal = query[val]
          }
          return `${val}=${queryVal}`;
        }, [])
        .join('&');
      url = `${url}?${queryString}`;
    }

    let doctorRespStatus;
    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(response => {
      doctorRespStatus = response.ok;

      if (response.status === 404) {
        dispatch({
          type: userAction.GET_DOCTORS_FAILURE
        });
        dispatch(loadingStop());
        return;
      }

      return response.json().then(response => {
        if (!doctorRespStatus) {
          throw new Error(response.errorMessage);
        }

        dispatch({
          type: userAction.GET_DOCTORS,
          payload: JSON.parse(response.body)
        });
        dispatch(loadingStop());
        return;
      });
    })
      .catch(err => {
        dispatch({
          type: userAction.USER_ERROR,
          payload: {
            err: err.message
          }
        });
        dispatch(loadingStop());
        return;
      });
  }
}

export const getDoctorsForApproval = () => {
  return (dispatch) => {
    dispatch(loadingStart());

    let url = `${baseUrl}/doctors?approved=false`;

    let doctorRespStatus;
    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(response => {
      doctorRespStatus = response.ok;

      if (response.status === 404) {
        dispatch({
          type: userAction.GET_DOCTORS_FAILURE
        });
        dispatch(loadingStop());
        return;
      }

      return response.json().then(response => {
        if (!doctorRespStatus) {
          throw new Error(response.errorMessage);
        }

        dispatch({
          type: userAction.GET_DOCTORS,
          payload: JSON.parse(response.body)
        });
        dispatch(loadingStop());
        return;
      });
    })
      .catch(err => {
        dispatch({
          type: userAction.USER_ERROR,
          payload: {
            err: err.message
          }
        });
        dispatch(loadingStop());
        return;
      });
  }
}

export const getUser = (id, occupation) => {
  return (dispatch) => {
    if (occupation === 'doctor') {
      dispatch(getDoctor(id));
    } else if (occupation === 'student') {
      dispatch(getStudent(id));
    }
  }
}

export const clearUser = () => {
  return (dispatch) => {
    dispatch({
      type: userAction.CLEAR_USER
    })
  }
}

//************************* Error Actions *************************//
export const handleError = () => {
  return dispatch => (
    dispatch({
      type: userAction.HANDLE_ERROR
    })
  );
}