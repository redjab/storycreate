import 'babel-polyfill';
import React from 'react';
import {Router, browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import App from './components/App';
import routes from './routes';

ReactDOM.render(<Router history={browserHistory}>{routes}</Router>, document.getElementById('app'));
