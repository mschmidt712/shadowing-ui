import { push } from 'connected-react-router';
import * as requestAction from './requestTypes';

const baseUrl = 'https://5hc101yjlj.execute-api.us-east-1.amazonaws.com/Test';

export const getStudentRequests = (id, query) => {
  return (dispatch) => {
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
      }).catch(err => {
        console.error(err);
      })
  }
}

export const getDoctorRequests = (id, query) => {
  return (dispatch) => {
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
      }).catch(err => {
        console.error(err);
      })
  }
}