import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';

import {store} from './routes/login/_helpers'
import {configureFakeBackend} from './routes/login/_helpers'
import { Login } from './routes/Login';
configureFakeBackend()

ReactDOM.render(
    <Provider store={store}>
      <Login />
    </Provider>, document.getElementById('root'));
registerServiceWorker();
