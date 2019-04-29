import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import authReducer from './authReducer';
import userReducer from './userReducer';

export default (history) => combineReducers({
  router: connectRouter(history),
  authReducer,
  userReducer
});