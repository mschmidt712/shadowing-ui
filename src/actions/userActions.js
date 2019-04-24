import * as userAction from './userTypes';

export const createStudent = (data) => {
  return (dispatch) => {
    const baseUrl = 'https://5hc101yjlj.execute-api.us-east-1.amazonaws.com/Test';
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