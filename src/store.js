import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history'
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

const initialState = {};

export const history = createBrowserHistory();
const store = createStore(
  rootReducer(history),
  initialState,
  applyMiddleware(thunk, routerMiddleware(history))
);
export default store;