import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { lifecycle } from 'recompose';

import ConnectContainer from '../../containers/ConnectContainer';

import MainSidebar from '../../components/Main/Sidebar/MainSidebar';
import MainContent from '../../components/Main/Content/MainContent';
import Header from '../../components/Base/Header/Header';
import ContextMenu from '../../components/Base/ContextMenu/ContextMenu';
import { startAppMixpanelEvent } from '../../helpers';

const propTypes = {
  isConnected: PropTypes.bool
};

const enhance = lifecycle({
  componentDidMount() {
    startAppMixpanelEvent();
  }
});

const BaseContainer = enhance(({ isConnected }) => (
  <div id="wrapper">
    <ContextMenu />

    {isConnected
      ? <div className="flex-row max-height">
        <div className="flex-col left-pane">
          <Header />
          <MainSidebar />
        </div>
        <MainContent />
      </div>
      : <ConnectContainer />
    }
  </div>
));

BaseContainer.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isConnected: state.currentTable.isConnected
  };
}
export default connect(mapStateToProps, null)(BaseContainer);
