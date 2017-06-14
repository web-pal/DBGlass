import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Raven from 'raven-js';
import { ipcRenderer as ipc } from 'electron';
import { useSentry, sentryUrl, sendQuitRequest } from 'config';

import Base from './components/Base/Base';
import store from './store';
import { appQuitRequest } from './actions/ui';

import pjson from './package.json';
import './app.global.css';


Raven.addPlugin(require('./raven-electron-plugin')); // eslint-disable-line
if (useSentry) {
  Raven
    .config(sentryUrl, {
      release: `${pjson.version}_${process.platform}`,
    })
    .install();
}

window.onerror = (...argw) => {
  ipc.send('errorInWindow', argw);
};

render(
  <AppContainer>
    <Base store={store} />
  </AppContainer>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./components/Base/Base', () => {
    const Base = require('./components/Base/Base'); // eslint-disable-line
    render(
      <AppContainer>
        <Base store={store} />
      </AppContainer>,
      document.getElementById('root'),
    );
  });
}

window.onbeforeunload = function closeWindow() {
  if (sendQuitRequest) { // it needs because of hot-reload
    store.dispatch(appQuitRequest());
    return false;
  }
};
