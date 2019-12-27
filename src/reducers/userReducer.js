import * as userAction from '../actions/userTypes';

const initialState = {
  doctor: {},
  student: {},
  doctors: [],
  students: [],
  userErr: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case userAction.CREATE_STUDENT:
      return Object.assign({}, state, {
        student: {
          email: action.payload.email,
          name: action.payload.name,
          address: action.payload.address,
          phoneNumber: action.payload.phoneNumber,
          hipaaCert: action.payload.hipaaCert,
          school: action.payload.school,
          schoolYear: action.payload.schoolYear,
          cv: action.payload.cv,
          requests: action.payload.requests,
          active: true
        }
      });
    case userAction.UPDATE_STUDENT:
      return Object.assign({}, state, {
        student: {
          email: action.payload.email,
          name: action.payload.name,
          address: action.payload.address,
          phoneNumber: action.payload.phoneNumber,
          hipaaCert: action.payload.hipaaCert,
          school: action.payload.school,
          schoolYear: action.payload.schoolYear,
          cv: action.payload.cv,
          requests: action.payload.requests,
          active: true
        }
      });
    case userAction.GET_STUDENT_SUCCESS:
      return Object.assign({}, state, {
        student: {
          email: action.payload.email,
          name: action.payload.name,
          address: action.payload.address,
          phoneNumber: action.payload.phoneNumber,
          hipaaCert: action.payload.hipaaCert,
          school: action.payload.school,
          schoolYear: action.payload.schoolYear,
          cv: action.payload.cv,
          requests: action.payload.requests,
          active: true
        }
      });
    case userAction.GET_STUDENT_FAILURE:
      return Object.assign({}, state, {
        active: false
      });
    case userAction.GET_STUDENTS:
      return Object.assign({}, state, {
        students: action.payload
      });
    case userAction.GET_STUDENTS_FAILURE:
      return Object.assign({}, state, {
        students: []
      });
    case userAction.CREATE_DOCTOR:
      return Object.assign({}, state, {
        doctor: {
          email: action.payload.email,
          name: action.payload.name,
          career: action.payload.career,
          degree: action.payload.degree,
          address: action.payload.address,
          specialty: action.payload.specialty,
          approved: action.payload.approved,
          maxRequests: action.payload.maxRequests,
          requestEmail: action.payload.requestEmail,
          scheduling: action.payload.scheduling,
          shiftLength: action.payload.shiftLength,
          additionalComments: action.payload.additionalComments,
          badgePhoto: action.payload.badgePhoto,
          requests: action.payload.requests,
          active: true
        }
      });
    case userAction.UPDATE_DOCTOR:
      return Object.assign({}, state, {
        doctor: {
          email: action.payload.email,
          name: action.payload.name,
          career: action.payload.career,
          degree: action.payload.degree,
          address: action.payload.address,
          specialty: action.payload.specialty,
          approved: action.payload.approved,
          maxRequests: action.payload.maxRequests,
          requestEmail: action.payload.requestEmail,
          scheduling: action.payload.scheduling,
          shiftLength: action.payload.shiftLength,
          additionalComments: action.payload.additionalComments,
          badgePhoto: action.payload.badgePhoto,
          requests: action.payload.requests,
          active: action.payload.active
        }
      });
    case userAction.GET_DOCTOR_SUCCESS:
      return Object.assign({}, state, {
        doctor: {
          email: action.payload.email,
          name: action.payload.name,
          career: action.payload.career,
          degree: action.payload.degree,
          address: action.payload.address,
          specialty: action.payload.specialty,
          approved: action.payload.approved,
          maxRequests: action.payload.maxRequests,
          requestEmail: action.payload.requestEmail,
          scheduling: action.payload.scheduling,
          shiftLength: action.payload.shiftLength,
          additionalComments: action.payload.additionalComments,
          badgePhoto: action.payload.badgePhoto,
          requests: action.payload.requests,
          active: action.payload.active
        }
      });
    case userAction.GET_DOCTOR_FAILURE:
      return Object.assign({}, state, {
        active: false
      });
    case userAction.GET_DOCTORS:
      state.doctors = action.payload;
      return state;
    case userAction.GET_DOCTORS_FAILURE:
      return Object.assign({}, state, {
        doctors: []
      });
    case userAction.CLEAR_USER:
      return initialState;
    case userAction.USER_ERROR:
      let err;
      try {
        err = JSON.parse(action.payload.err)
      } catch {
        err = action.payload.err
      }

      return Object.assign({}, state, {
        userErr: err
      });
    case userAction.HANDLE_ERROR:
      return Object.assign({}, state, {
        userErr: undefined
      });
    default:
      return state;
  }
}