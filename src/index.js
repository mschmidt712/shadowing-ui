import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router'

import './index.css';
import App from './components/App';
import Home from './components/Home/Home';
import UserPage from './components/UserPage/UserPage';
import SignUpPageStudent from './components/SignUpPageStudent/SignUpPageStudent';
import SignUpPageDoctor from './components/SignUpPageDoctor/SignUpPageDoctor';
import RequestsPage from './components/Requests/RequestsPage';
import SearchPage from './components/SearchPage/SearchPage';
import AboutUsPage from './components/AboutUsPage/AboutUsPage';
import FaqPage from './components/FaqPage/FaqPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage/PrivacyPolicyPage';
import AdminPage from './components/AdminPage/AdminPage';
import * as serviceWorker from './serviceWorker';
import store, { history } from './store';
import * as authActions from './actions/authTypes';

ReactDOM.render((
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route path="/" component={App} />
      <Route exact path="/" render={() => {
        return <Home />;
      }} />
      <Route path="/physician-sign-up" render={() => {
        store.dispatch({
          type: authActions.SIGNUP_CLICK
        });

        return <Home />;
      }} />
      <Route path="/user" render={() => {
        if (store.getState().authReducer.isLoggedIn) {
          return <UserPage />;
        } else {
          return <Redirect to='/' />
        }
      }} />
      <Route path="/sign-up/student" render={() => {
        if (store.getState().authReducer.isLoggedIn) {
          return <SignUpPageStudent />;
        } else {
          return <Redirect to='/' />
        }
      }} />
      <Route path="/sign-up/doctor" render={() => {
        if (store.getState().authReducer.isLoggedIn) {
          return <SignUpPageDoctor />;
        } else {
          return <Redirect to='/' />
        }
      }} />
      <Route path="/requests" render={() => {
        if (store.getState().authReducer.isLoggedIn) {
          return <RequestsPage />;
        } else {
          return <Redirect to='/' />
        }
      }} />
      <Route path="/search" component={SearchPage} />
      <Route path="/about-us" component={AboutUsPage} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route exact path="/admin/pending-doctors" component={AdminPage} />
      <Route exact path="/admin/enrollment" component={AdminPage} />
      <Route exact path="/admin/email-templates" component={AdminPage} />
    </ConnectedRouter>
  </Provider>
),
  document.getElementById('container')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
