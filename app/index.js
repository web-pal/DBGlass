import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import './styles/main.less';
import '../node_modules/fixed-data-table/dist/fixed-data-table.min.css';
import DB from './db';
import BaseComponent from './components/Base/BaseComponent';

const store = configureStore();

render(
  <Provider store={store}>
    <BaseComponent />
  </Provider>,
  document.getElementById('root')
);

window.onbeforeunload = function closeWindow() {
  DB.disconnectDB();
};
