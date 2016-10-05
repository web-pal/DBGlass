import React from 'react';
import ReduxFormMain from './ReduxFormMain';

const { shell } = require('electron');

const ReduxFormBase = () => (
  <div className="form-wrapper flex-row flex--center">
    <div className="form">
      <ReduxFormMain />
    </div>
    <span id="madeby"> made by </span>
    <a
      onClick={() => shell.openExternal('http://web-pal.com', { activate: false })}
      className="webpal-logo"
      href=""
    >
      <img
        src="styles/images/webpal.png"
        role="presentation"
      />
    </a>
  </div>
);

export default ReduxFormBase;
