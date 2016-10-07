import React, { Component } from 'react';
import ReduxFormMain from './ReduxFormMain';

const { shell } = require('electron');


class ReduxFormBase extends Component {
  static onClick(ev) {
    ev.preventDefault();
    shell.openExternal('http://web-pal.com?ref=dbglass');
  }

  render() {
    return (
      <div className="form-wrapper flex-row flex--center">
        <div className="form">
          <ReduxFormMain />
        </div>
        <span id="madeby">designed by</span>
        <a
          onClick={ReduxFormBase.onClick}
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
  }
}


export default ReduxFormBase;
