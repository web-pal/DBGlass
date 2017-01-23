import React from 'react';
import { lifecycle } from 'recompose';

import ReduxFormMain from './ReduxFormMain';
import { mixPanelTrack } from '../../../helpers';
import DB from '../../../db';

const { shell } = require('electron');


const enhance = lifecycle({
  componentDidMount() {
    DB.disconnectDB();
  }
});


function onClick(ev) {
  ev.preventDefault();
  mixPanelTrack('Open web-pal.com');
  shell.openExternal('http://web-pal.com?ref=dbglass');
}


const ReduxFormBase = enhance(({ props }) => (
  <div className="form-wrapper flex-row flex--center">
    <div className="form">
      <ReduxFormMain propsa={{ ...props }} />
    </div>
    <span id="madeby">designed by</span>
    <a
      onClick={onClick}
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
));


export default ReduxFormBase;
