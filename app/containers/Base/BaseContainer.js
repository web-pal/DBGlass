import React, { PropTypes } from 'react';
import { lifecycle } from 'recompose';
import { connect } from 'react-redux';

import MainSidebar from '../../components/Main/Sidebar/MainSidebar';
import ConnectSidebar from '../../components/Connect/Sidebar/ConnectSidebar';
import ReduxFormBase from '../../components/Connect/Content/ReduxFormBase';
import MainContent from '../../components/Main/Content/MainContent';
import Header from '../../components/Base/Header/Header';
import ContextMenu from '../../components/Base/ContextMenu/ContextMenu';
import UpdatesModal from '../../components/Connect/Content/UpdatesModal/UpdatesModal';
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

    {isConnected ?
      <div className="flex-row max-height">
        <div className="flex-col left-pane">
          <Header />
          <MainSidebar />
        </div>
        <MainContent />
      </div> :

      <div className="flex-col max-height">
        <Header />
        <div className="flex-row max-height">
          <UpdatesModal />
          <ConnectSidebar />
          <ReduxFormBase />
        </div>
      </div>
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
