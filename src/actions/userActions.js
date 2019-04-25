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
        return dispatch({
          type: userAction.CREATE_STUDENT,
          payload: data.student
        });
      })
      .catch(err => console.error(err));
  }
}

export const getStudent = (email) => {
  return (dispatch) => {
    const url = `${baseUrl}/student/${email}`;

    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => {
        if (response.status === 404) {
          return dispatch({
            type: userAction.GET_STUDENT_FAILURE
          });
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