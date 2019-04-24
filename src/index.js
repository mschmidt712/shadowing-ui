import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';
import store from './store';
import App from './components/App';
import Home from './components/Home/Home';
import * as serviceWorker from './serviceWorker';

ReactDOM.render((
     <Provider store={store}>
          <BrowserRouter>
               <Route path="/" component={App} />
          </BrowserRouter>
     </Provider>
),
     document.getElementById('container')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
