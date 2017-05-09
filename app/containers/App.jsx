// @flow
import React from 'react';
import { connect } from 'react-redux';

import Connect from './Connect/Connect';
import Main from './Main';

type AppType = {
  isConnected: boolean
};

const App = ({ isConnected }: AppType) =>
  <div id="wrapper">
    {isConnected
      ? <Main />
      : <Connect />
    }
  </div>;

function mapStateToProps({ ui }) {
  return {
    isConnected: ui.isConnected,
  };
}

export default connect(mapStateToProps)(App);
