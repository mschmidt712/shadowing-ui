import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import './index.css';
import App from './components/App';
import Home from './components/Home/Home';
import SignUpPageStudent from './components/SignUpPageStudent/SignUpPageStudent';
import * as serviceWorker from './serviceWorker';
import store from './store';

ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Route exact path="/" render={() => <Home
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBV0ERwNWnf4cLICe7TozgRJG6jNM5aL9Q"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />} />
      <Route path="/sign-up/student" component={SignUpPageStudent} />
      <Route path="/sign-up/doctor" component={SignUpPageStudent} />
    </BrowserRouter>
  </Provider>
),
  document.getElementById('container')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
