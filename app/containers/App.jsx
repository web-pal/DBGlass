// @flow
import React from 'react';
import { connect } from 'react-redux';

import Connect from './Connect/Connect';
import Main from './Main/Main';
import type { State } from '../types';
import ContextMenu from './ContextMenu/ContextMenu';

type Props = {
  isConnected: boolean
};

const App = ({ isConnected }: Props) => (
  <div id="wrapper">
    <ContextMenu />
    {isConnected
      ? <Main />
      : <Connect />
    }
  </div>
);


const mapStateToProps = ({ ui }: State) => ({
  isConnected: ui.isConnected,
});

export default connect(mapStateToProps)(App);
