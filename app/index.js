import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';


import BaseContainer from './containers/Base/BaseContainer';

import configureStore from './store/configureStore';
import './styles/main.less';
import './app.global.css';

const store = configureStore();

render(
  <Provider store={store}>
    <BaseContainer />
  </Provider>,
  document.getElementById('root')
);
