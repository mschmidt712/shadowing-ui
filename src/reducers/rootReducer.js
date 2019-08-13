import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import authReducer from './authReducer';
import userReducer from './userReducer';
import requestReducer from './requestReducer';
import adminReducer from './adminReducer';
import loadingReducer from './loadingReducer';
import emailReducer from './emailReducer';

export default (history) => combineReducers({
  router: connectRouter(history),
  authReducer,
  userReducer,
  requestReducer,
  adminReducer,
  loadingReducer,
  emailReducer
});