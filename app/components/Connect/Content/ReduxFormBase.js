import React from 'react';
import ReduxFormMain from './ReduxFormMain';
import check from './UpdatesModal/versionCheck.js';

const { shell } = require('electron');

const ReduxFormBase = () => (
  <div className="form-wrapper flex-row flex--center">
    <div className="form">
      <ReduxFormMain />
    </div>
    <span id="madeby">designed by</span>
    <a
      onClick={() => shell.openExternal('http://web-pal.com', { activate: false })}
      className="webpal-logo"
      href=""
    >
      <img
        src="styles/images/WebPal.svg"
        role="presentation"
        style={{ width: '100px' }}
      />
    </a>
  </div>
);

export default ReduxFormBase;
